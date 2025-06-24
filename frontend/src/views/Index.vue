<script setup>
import {
  NInput, NButton, NCard, NDatePicker, NSelect, NFormItem,
  NInputNumber, NTabs, NTabPane, NDrawer, NDrawerContent
} from 'naive-ui'
import { watch, ref, onMounted } from "vue";
import MarkdownIt from 'markdown-it';
import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source';
import { useStorage } from '@vueuse/core';
import { Solar } from 'lunar-javascript'

import { useIsMobile } from '../utils/composables'
import About from '../components/About.vue'
import { useGlobalState } from '../store'

const { customOpenAISettings } = useGlobalState()
import { DIVINATION_OPTIONS } from "../config/constants";
const isMobile = useIsMobile()

const state_jwt = useStorage('jwt')
const prompt = ref("");
const result = useStorage("result", "");
const tmp_result = ref("");
const prompt_type = useStorage("prompt_type", "tarot");
const menu_type = useStorage("menu_type", "divination");
const lunarBirthday = ref("");
const birthday = useStorage("birthday", "2000-08-17 00:00:00");
const loading = ref(false);
const API_BASE = import.meta.env.VITE_API_BASE || "";
const IS_TAURI = import.meta.env.VITE_IS_TAURI || "";
const md = new MarkdownIt();
const showDrawer = ref(false)
const sex = ref("")
const surname = ref("")
const new_name_prompt = ref("")
const sexOptions = [
  { label: "男", value: "男" },
  { label: "女", value: "女" },
]
const plum_flower = useStorage("plum_flower", { num1: 0, num2: 0 })
const fate_body = useStorage("fate_body", { name1: "", name2: "" })

const onSubmit = async () => {
  try {
    loading.value = true;
    tmp_result.value = "";
    result.value = "";
    showDrawer.value = true;
    const headers = {
      "Authorization": `Bearer ${state_jwt.value || "xxx"}`,
      "Content-Type": "application/json"
    }
    if (customOpenAISettings.value.enable) {
      headers["x-api-key"] = customOpenAISettings.value.apiKey;
      headers["x-api-url"] = customOpenAISettings.value.baseUrl
      headers["x-api-model"] = customOpenAISettings.value.model
    } else if (IS_TAURI) {
      result.value = "请在设置中配置 API BASE URL 和 API KEY";
      return;
    }
    await fetchEventSource(`${API_BASE}/api/divination`, {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt.value || "我的财务状况如何",
        prompt_type: prompt_type.value,
        birthday: birthday.value,
        new_name: {
          surname: surname.value,
          sex: sex.value,
          birthday: birthday.value,
          new_name_prompt: new_name_prompt.value
        },
        plum_flower: prompt_type.value == "plum_flower" ? plum_flower.value : null,
        fate: prompt_type.value == "fate" ? fate_body.value : null
      }),
      headers: headers,
      async onopen(response) {
        if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
          return;
        } else if (response.status >= 400 && response.status < 500) {
          throw new Error(`${response.status} ${await response.text()}`);
        }
      },
      onmessage(msg) {
        if (msg.event === 'FatalError') {
          throw new FatalError(msg.data);
        }
        if (!msg.data) {
          return;
        }
        try {
          tmp_result.value += JSON.parse(msg.data);
          result.value = md.render(tmp_result.value);
        } catch (error) {
          console.error(error);
        }
      },
      onclose() {

      },
      onerror(err) {
        result.value = `占卜失败: ${err.message}`;
        throw new Error(`占卜失败: ${err.message}`);
      }
    });
  } catch (error) {
    console.error(error);
    result.value = error.message || "占卜失败";
  } finally {
    loading.value = false;
  }
};

const computeLunarBirthday = (newBirthday) => {
  try {
    let date = new Date(newBirthday)
    let solar = Solar.fromYmdHms(
      date.getFullYear(), date.getMonth() + 1, date.getDate(),
      date.getHours(), date.getMinutes(), date.getSeconds());
    lunarBirthday.value = solar.getLunar().toFullString();
  } catch (error) {
    console.error(error)
    lunarBirthday.value = '转换失败'
  }
}

watch(birthday, async (newBirthday, oldBirthday) => {
  computeLunarBirthday(newBirthday)
})

const changeTab = async (delta) => {
  let curIndex = DIVINATION_OPTIONS.findIndex((option) => option.key === prompt_type.value);
  let newIndex = curIndex + delta;
  if (newIndex < 0) {
    newIndex = DIVINATION_OPTIONS.length - 1;
  } else if (newIndex >= DIVINATION_OPTIONS.length) {
    newIndex = 0;
  }
  prompt_type.value = DIVINATION_OPTIONS[newIndex].key;
}

onMounted(async () => {
  computeLunarBirthday(birthday.value)
});
</script>

<template>
  <div class="m-8 themed-container">
    <h2 class="page-title text-3xl mb-2 font-bold">{{ $t('message.divination_types') }}</h2>
    <p class="page-subtitle text-gray-500 mb-4">{{ $t('message.select_a_type') }}</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <n-tabs v-model:value="prompt_type" type="card" animated placement="top" class="themed-tabs">
        <template v-if="isMobile" #prefix>
          <n-button @click="changeTab(-1)" class="tab-nav-button">←</n-button>
        </template>
        <template v-if="isMobile" #suffix>
          <n-button @click="changeTab(1)" class="tab-nav-button">→</n-button>
        </template>
        <n-tab-pane v-for="option in DIVINATION_OPTIONS" :name="option.key" :tab="option.label">
          <n-card v-if="prompt_type != 'about'" class="themed-card bg-slate-50 shadow-sm hover:shadow-lg transition-shadow rounded-lg">
            <div v-if="prompt_type == 'tarot'">
              <n-input v-model:value="prompt" type="textarea" round maxlength="40" :autosize="{ minRows: 3 }"
                :placeholder="$t('message.tarot_prompt_placeholder')" class="themed-input" />
            </div>
            <div v-if="prompt_type == 'horoscope'">
              <n-select v-model:value="prompt" :options="[
                { label: 'Aries', value: 'Aries' }, { label: 'Taurus', value: 'Taurus' },
                { label: 'Gemini', value: 'Gemini' }, { label: 'Cancer', value: 'Cancer' },
                { label: 'Leo', value: 'Leo' }, { label: 'Virgo', value: 'Virgo' },
                { label: 'Libra', value: 'Libra' }, { label: 'Scorpio', value: 'Scorpio' },
                { label: 'Sagittarius', value: 'Sagittarius' }, { label: 'Capricorn', value: 'Capricorn' },
                { label: 'Aquarius', value: 'Aquarius' }, { label: 'Pisces', value: 'Pisces' }
              ]" class="themed-select" />
            </div>
            <div v-if="prompt_type == 'birthday'">
              <div style="display: inline-block; text-align: left;" class="form-section">
                <n-form-item :label="$t('message.birthday')" label-placement="left" class="themed-form-item">
                  <n-date-picker v-model:formatted-value="birthday" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="themed-datepicker"/>
                </n-form-item>
                <n-form-item :label="$t('message.lunar_date')" label-placement="left" class="themed-form-item">
                  <p class="themed-text">{{ lunarBirthday }}</p>
                </n-form-item>
              </div>
            </div>
            <div v-if="prompt_type == 'new_name'">
              <div style="display: inline-block;" class="form-section">
                <n-form-item :label="$t('message.surname')" label-placement="left" class="themed-form-item">
                  <n-input v-model:value="surname" type="text" maxlength="2" :placeholder="$t('message.surname')" class="themed-input" />
                </n-form-item>
                <n-form-item :label="$t('message.gender')" label-placement="left" class="themed-form-item">
                  <n-select v-model:value="sex" :options="[{label: $t('message.male'), value: '男'}, {label: $t('message.female'), value: '女'}]" class="themed-select" />
                </n-form-item>
                <n-form-item :label="$t('message.birthday')" label-placement="left" class="themed-form-item">
                  <n-date-picker v-model:formatted-value="birthday" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="themed-datepicker" />
                </n-form-item>
                <n-form-item :label="$t('message.additional_info')" label-placement="left" class="themed-form-item">
                  <n-input v-model:value="new_name_prompt" type="text" maxlength="20" placeholder="" class="themed-input" />
                </n-form-item>
                <p class="themed-text">{{ $t('message.lunar_date') }}: {{ lunarBirthday }}</p>
              </div>
            </div>
            <div v-if="prompt_type == 'name'">
              <div style="display: inline-block;" class="form-section">
                <n-input v-model:value="prompt" type="text" maxlength="10" round :placeholder="$t('message.name')" class="themed-input" />
              </div>
            </div>
            <div v-if="prompt_type == 'dream'">
              <n-input v-model:value="prompt" type="textarea" round maxlength="40" :autosize="{ minRows: 3 }"
                :placeholder="$t('message.dream_prompt')" class="themed-input" />
            </div>
            <div v-if="prompt_type == 'plum_flower'">
              <div style="display: inline-block;" class="form-section">
                <h4 class="themed-h4">{{ $t('message.plum_flower_prompt') }}</h4>
                <n-form-item :label="$t('message.num1')" label-placement="left" class="themed-form-item">
                  <n-input-number v-model:value="plum_flower.num1" :min="0" :max="1000" class="themed-input-number" />
                </n-form-item>
                <n-form-item :label="$t('message.num2')" label-placement="left" class="themed-form-item">
                  <n-input-number v-model:value="plum_flower.num2" :min="0" :max="1000" class="themed-input-number" />
                </n-form-item>
              </div>
            </div>
            <div v-if="prompt_type == 'fate'">
              <div style="display: inline-block;" class="form-section">
                <h4 class="themed-h4">{{ $t('message.fate_prompt_1') }}</h4>
                <p class="themed-text">{{ $t('message.fate_prompt_2') }}</p>
                <p class="themed-text">{{ $t('message.fate_prompt_3') }}</p>
                <n-form-item :label="$t('message.name1')" label-placement="left" class="themed-form-item">
                  <n-input v-model:value="fate_body.name1" round maxlength="40" :placeholder="$t('message.enter_a_name')" class="themed-input" />
                </n-form-item>
                <n-form-item :label="$t('message.name2')" label-placement="left" class="themed-form-item">
                  <n-input v-model:value="fate_body.name2" round maxlength="40" :placeholder="$t('message.enter_a_name')" class="themed-input" />
                </n-form-item>
                <div class="footer" style="text-align:center">
                  <p>
                    <a href="https://github.com/alongLFB/alonglfb.github.io/blob/master/images/wechatpay.png"
                      style="text-decoration: underline;" target="_blank">Please buy the author a cup of coffee</a> - 🤗 Along Li
                  </p>
                </div>
              </div>
            </div>
            <div v-if="menu_type != 'about'" class="button-container">
              <n-button class="button themed-button-tertiary" @click="showDrawer = !showDrawer" tertiary type="primary">
                {{ loading ? $t('message.show_result_loading') : $t('message.show_result') }}
              </n-button>
              <n-button class="button themed-button-primary" @click="onSubmit" type="primary" :disabled="loading">
                {{ loading ? $t('message.submitting') : $t('message.submit') }}
              </n-button>
            </div>
          </n-card>
        </n-tab-pane>
        <n-tab-pane name="about" :tab="$t('message.about')" class="themed-tab-pane">
          <About />
        </n-tab-pane>
      </n-tabs>
    </div>
    <n-drawer v-model:show="showDrawer" style="height: 80vh;" placement="bottom" :trap-focus="false"
      :block-scroll="false" class="themed-drawer">
      <n-drawer-content :title="$t('message.result_title')" closable class="themed-drawer-content">
        <div class="result" v-html="result"></div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
/* General page theming */
.themed-container .page-title {
  color: #FFD700; /* Gold */
  font-family: "Georgia", serif;
}

.themed-container .page-subtitle {
  color: #B8860B; /* DarkGoldenRod */
}

/* Tabs theming */
.themed-tabs :deep(.n-tabs-tab) {
  background-color: #2a2a2a;
  color: #B8860B;
  border-color: #FFD700 !important;
}

.themed-tabs :deep(.n-tabs-tab.n-tabs-tab--active) {
  background-color: #8B0000; /* Dark Red for active tab */
  color: #FFD700; /* Gold text for active tab */
}

.themed-tabs :deep(.n-tabs-bar) {
  border-color: #FFD700 !important;
}

.tab-nav-button { /* For mobile tab navigation */
  background-color: #2a2a2a !important;
  color: #FFD700 !important;
  border: 1px solid #FFD700 !important;
}
.tab-nav-button:hover {
  background-color: #8B0000 !important;
}


/* Card Theming */
.themed-card {
  background-color: #2C2C2C !important; /* Slightly lighter dark grey */
  border: 1px solid #B8860B; /* DarkGoldenRod border */
  box-shadow: 0 0 15px rgba(0,0,0,0.7); /* Darker shadow for more depth */
  color: #E0E0E0; /* Light grey text inside card */
  position: relative; /* Needed for pseudo-elements if used for borders/patterns */
  overflow: hidden; /* Ensure pseudo-elements don't overflow if they are for borders */
}

.themed-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at top left, rgba(255, 215, 0, 0.03), transparent 30%),
    radial-gradient(circle at bottom right, rgba(139, 0, 0, 0.05), transparent 40%);
  background-blend-mode: multiply; /* or other blend modes like 'overlay' */
  opacity: 0.7; /* Adjust opacity of the pattern */
  pointer-events: none; /* So it doesn't interfere with interactions */
  z-index: 0; /* Behind content */
}

.themed-card > * { /* Ensure card content is above the pseudo-element */
  position: relative;
  z-index: 1;
}


.themed-card :deep(.n-card-header__main) { /* Card title if it had one */
  color: #FFD700 !important;
  font-family: "Georgia", serif;
}

/* Form elements theming */
.form-section {
  padding: 10px;
  text-align: left; /* Align form items left */
}

.form-section .themed-h4 {
  color: #FFD700;
  font-family: "Georgia", serif;
  margin-bottom: 15px;
}

.form-section .themed-text,
.form-section :deep(.n-form-item-label__text) { /* Label text */
  color: #E0E0E0 !important;
}
.form-section :deep(.n-form-item-label) { /* Actual label element */
  color: #E0E0E0 !important;
}


.themed-input :deep(input),
.themed-input :deep(textarea),
.themed-select :deep(.n-base-selection-label),
.themed-datepicker :deep(input) {
  background-color: #1A1A1A !important; /* Very dark background for inputs */
  color: #E0E0E0 !important; /* Light text */
  border: 1px solid #B8860B !important; /* DarkGoldenRod border */
}
.themed-input :deep(textarea) {
  min-height: 80px; /* Ensure textarea is a decent size */
}

.themed-input-number :deep(input) {
  background-color: #1A1A1A !important;
  color: #E0E0E0 !important;
}
.themed-input-number :deep(.n-input-number-button) {
  background-color: #2a2a2a !important;
  color: #FFD700 !important;
  border-color: #B8860B !important;
}


/* Buttons in card */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button {
  margin: 0 10px;
  font-family: "Georgia", serif;
}

.themed-button-primary {
  /* ThemeOverrides in App.vue should handle primary buttons (dark red bg, light text) */
  /* Add specific overrides here if needed, e.g., border */
  border: 1px solid #FFD700; /* Gold border */
}
.themed-button-primary:hover {
  border-color: #A52A2A; /* Darker gold/brownish on hover */
}

.themed-button-tertiary { /* For "Show Result" button */
  background-color: transparent !important;
  color: #FFD700 !important; /* Gold text */
  border: 1px solid #FFD700 !important; /* Gold border */
}
.themed-button-tertiary:hover {
  background-color: #4a4a4a !important; /* Darker grey on hover */
  color: #FFD700 !important;
}


/* Drawer Theming */
.themed-drawer :deep(.n-drawer-header__main) {
  color: #FFD700 !important; /* Gold title */
  font-family: "Georgia", serif;
}

.themed-drawer :deep(.n-drawer-body-content-wrapper) {
  background-color: #1A1A1A; /* Dark background for drawer content */
}

.themed-drawer-content {
  background-color: #1A1A1A !important;
}

.result {
  text-align: left;
  color: #E0E0E0; /* Light grey text for results */
  padding: 15px;
}
.result :deep(h1), .result :deep(h2), .result :deep(h3) {
  color: #FFD700; /* Gold for headings within results */
  font-family: "Georgia", serif;
}
.result :deep(a) {
  color: #8B0000; /* Dark Red for links */
  text-decoration: underline;
}
.result :deep(a:hover) {
  color: #A52A2A; /* Brownish red on hover */
}

/* Ensure About tab also gets some theming if it's just a component */
.themed-tab-pane {
    /* background-color: #2C2C2C; */ /* Example if it needs a bg */
    /* padding: 15px; */
}

</style>
