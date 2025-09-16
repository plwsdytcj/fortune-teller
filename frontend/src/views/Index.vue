<script setup>
import {
  NInput,
  NButton,
  NDatePicker,
  NSelect,
  NFormItem,
  NInputNumber,
  NTabs,
  NTabPane,
  NDrawer,
  NDrawerContent
} from 'naive-ui'
import { watch, ref, onMounted, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source'
import { useStorage } from '@vueuse/core'
import { Solar } from 'lunar-javascript'

import { useIsMobile } from '../utils/composables'
import About from '../components/About.vue'
import { useGlobalState } from '../store'

const { customOpenAISettings } = useGlobalState()
import { DIVINATION_OPTIONS } from '../config/constants'
const isMobile = useIsMobile()

const state_jwt = useStorage('jwt')
const prompt = ref('')
const result = useStorage('result', '')
const tmp_result = ref('')
const prompt_type = useStorage('prompt_type', 'tarot')
const lunarBirthday = ref('')
const birthday = useStorage('birthday', '2000-08-17 00:00:00')
const loading = ref(false)
const API_BASE = import.meta.env.VITE_API_BASE || ''
const IS_TAURI = import.meta.env.VITE_IS_TAURI || ''
const md = new MarkdownIt()
const showDrawer = ref(false)
const sex = ref('')
const surname = ref('')
const new_name_prompt = ref('')
const sexOptions = [
  { label: 'Male', value: '男' },
  { label: 'Female', value: '女' }
]
const plum_flower = useStorage('plum_flower', { num1: 0, num2: 0 })
const fate_body = useStorage('fate_body', { name1: '', name2: '' })

const currentOption = computed(() => {
  return DIVINATION_OPTIONS.find(option => option.key === prompt_type.value) || DIVINATION_OPTIONS[0]
})

const isAboutTab = computed(() => prompt_type.value === 'about')

const onSubmit = async () => {
  try {
    loading.value = true
    tmp_result.value = ''
    result.value = ''
    showDrawer.value = true
    const headers = {
      Authorization: `Bearer ${state_jwt.value || 'xxx'}`,
      'Content-Type': 'application/json'
    }
    if (customOpenAISettings.value.enable) {
      headers['x-api-key'] = customOpenAISettings.value.apiKey
      headers['x-api-url'] = customOpenAISettings.value.baseUrl
      headers['x-api-model'] = customOpenAISettings.value.model
    } else if (IS_TAURI) {
      result.value = 'Please configure API BASE URL and API KEY in settings'
      return
    }
    await fetchEventSource(`${API_BASE}/api/divination`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: prompt.value || 'What does my financial future hold?',
        prompt_type: prompt_type.value,
        birthday: birthday.value,
        new_name: {
          surname: surname.value,
          sex: sex.value,
          birthday: birthday.value,
          new_name_prompt: new_name_prompt.value
        },
        plum_flower: prompt_type.value == 'plum_flower' ? plum_flower.value : null,
        fate: prompt_type.value == 'fate' ? fate_body.value : null
      }),
      headers: headers,
      async onopen(response) {
        if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
          return
        } else if (response.status >= 400 && response.status < 500) {
          throw new Error(`${response.status} ${await response.text()}`)
        }
      },
      onmessage(msg) {
        if (msg.event === 'FatalError') {
          throw new FatalError(msg.data)
        }
        if (!msg.data) {
          return
        }
        try {
          tmp_result.value += JSON.parse(msg.data)
          result.value = md.render(tmp_result.value)
        } catch (error) {
          console.error(error)
        }
      },
      onclose() {},
      onerror(err) {
        result.value = `Reading failed: ${err.message}`
        throw new Error(`Reading failed: ${err.message}`)
      }
    })
  } catch (error) {
    console.error(error)
    result.value = error.message || 'Reading failed'
  } finally {
    loading.value = false
  }
}

const computeLunarBirthday = newBirthday => {
  try {
    const date = new Date(newBirthday)
    const solar = Solar.fromYmdHms(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
    lunarBirthday.value = solar.getLunar().toFullString()
  } catch (error) {
    console.error(error)
    lunarBirthday.value = 'Conversion failed'
  }
}

watch(birthday, newBirthday => {
  computeLunarBirthday(newBirthday)
})

const changeTab = delta => {
  const curIndex = DIVINATION_OPTIONS.findIndex(option => option.key === prompt_type.value)
  let newIndex = curIndex + delta
  if (newIndex < 0) {
    newIndex = DIVINATION_OPTIONS.length - 1
  } else if (newIndex >= DIVINATION_OPTIONS.length) {
    newIndex = 0
  }
  prompt_type.value = DIVINATION_OPTIONS[newIndex].key
}

onMounted(async () => {
  computeLunarBirthday(birthday.value)
})
</script>

<template>
  <div class="divination-page">
    <header class="page-header">
      <div class="header-text">
        <h2>Explore personalized divination</h2>
        <p>Choose a tradition, share a few details, and receive guidance crafted for your situation.</p>
      </div>
      <div v-if="result" class="header-actions">
        <n-button quaternary size="large" class="secondary-btn" @click="showDrawer = true">
          <span class="btn-icon">📜</span>
          View last reading
        </n-button>
      </div>
    </header>

    <div class="ad-space">
      <div id="my-ad-slot"></div>
    </div>

    <div class="content-grid" :class="{ 'about-active': isAboutTab }">
      <aside v-if="!isAboutTab" class="summary-column" aria-label="Divination method summary">
        <div class="summary-card">
          <div class="summary-icon">{{ currentOption.icon }}</div>
          <h3>{{ currentOption.title }}</h3>
          <p class="summary-lead">{{ currentOption.description }}</p>
          <p class="summary-body">{{ currentOption.longDescription }}</p>
          <div class="summary-divider"></div>
          <h4>Highlights</h4>
          <ul class="feature-list">
            <li v-for="feature in currentOption.features" :key="feature">{{ feature }}</li>
          </ul>
          <div class="example-card">
            <h4>Sample prompt</h4>
            <p>{{ currentOption.example }}</p>
          </div>
        </div>
      </aside>

      <section class="interaction-column">
        <n-tabs v-model:value="prompt_type" type="line" animated class="divination-tabs">
          <template v-if="isMobile" #prefix>
            <n-button quaternary class="tab-nav" @click="changeTab(-1)">
              <span class="btn-icon">◀</span>
            </n-button>
          </template>
          <template v-if="isMobile" #suffix>
            <n-button quaternary class="tab-nav" @click="changeTab(1)">
              <span class="btn-icon">▶</span>
            </n-button>
          </template>

          <n-tab-pane v-for="option in DIVINATION_OPTIONS" :key="option.key" :name="option.key">
            <template #tab>
              <span class="tab-label">
                <span class="tab-icon">{{ option.icon }}</span>
                {{ option.label }}
              </span>
            </template>

            <div class="panel-card">
              <div class="form-stack">
                <div v-if="prompt_type === 'tarot'" class="form-block">
                  <h3 class="form-title">What's on your mind?</h3>
                  <p class="form-description">
                    Share a question or scenario for your three-card reading. Specific details help the insight feel personal.
                  </p>
                  <n-input
                    v-model:value="prompt"
                    type="textarea"
                    :autosize="{ minRows: 3 }"
                    maxlength="120"
                    placeholder="What does my financial future hold?"
                    class="input-control"
                  />
                </div>

                <div v-if="prompt_type === 'horoscope'" class="form-block">
                  <h3 class="form-title">Choose your zodiac sign</h3>
                  <p class="form-description">
                    We use your sign to tailor love, career, and wellness highlights for today.
                  </p>
                  <n-select
                    v-model:value="prompt"
                    :options="[
                      { label: 'Aries ♈', value: 'Aries' }, { label: 'Taurus ♉', value: 'Taurus' },
                      { label: 'Gemini ♊', value: 'Gemini' }, { label: 'Cancer ♋', value: 'Cancer' },
                      { label: 'Leo ♌', value: 'Leo' }, { label: 'Virgo ♍', value: 'Virgo' },
                      { label: 'Libra ♎', value: 'Libra' }, { label: 'Scorpio ♏', value: 'Scorpio' },
                      { label: 'Sagittarius ♐', value: 'Sagittarius' }, { label: 'Capricorn ♑', value: 'Capricorn' },
                      { label: 'Aquarius ♒', value: 'Aquarius' }, { label: 'Pisces ♓', value: 'Pisces' }
                    ]"
                    placeholder="Select your zodiac sign"
                    class="input-control"
                  />
                </div>

                <div v-if="prompt_type === 'birthday'" class="form-block">
                  <h3 class="form-title">Birth details</h3>
                  <p class="form-description">
                    Provide your birth date and time to generate a precise BaZi chart.
                  </p>
                  <div class="form-grid">
                    <n-form-item label="Birthday" label-placement="top" class="form-item">
                      <n-date-picker
                        v-model:formatted-value="birthday"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        class="input-control"
                      />
                    </n-form-item>
                    <n-form-item label="Lunar calendar" label-placement="top" class="form-item">
                      <div class="lunar-display">{{ lunarBirthday }}</div>
                    </n-form-item>
                  </div>
                </div>

                <div v-if="prompt_type === 'new_name'" class="form-block">
                  <h3 class="form-title">Name generator details</h3>
                  <p class="form-description">
                    We'll blend BaZi insights and five elements to suggest auspicious names.
                  </p>
                  <div class="form-grid">
                    <n-form-item label="Surname" label-placement="top" class="form-item">
                      <n-input
                        v-model:value="surname"
                        type="text"
                        maxlength="2"
                        placeholder="Enter surname"
                        class="input-control"
                      />
                    </n-form-item>
                    <n-form-item label="Gender" label-placement="top" class="form-item">
                      <n-select
                        v-model:value="sex"
                        :options="sexOptions"
                        placeholder="Select gender"
                        class="input-control"
                      />
                    </n-form-item>
                    <n-form-item label="Birthday" label-placement="top" class="form-item">
                      <n-date-picker
                        v-model:formatted-value="birthday"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="datetime"
                        class="input-control"
                      />
                    </n-form-item>
                    <n-form-item label="Preferences" label-placement="top" class="form-item">
                      <n-input
                        v-model:value="new_name_prompt"
                        type="text"
                        maxlength="40"
                        placeholder="Any special inspirations?"
                        class="input-control"
                      />
                    </n-form-item>
                  </div>
                  <div class="lunar-hint">Lunar calendar: {{ lunarBirthday }}</div>
                </div>

                <div v-if="prompt_type === 'name'" class="form-block">
                  <h3 class="form-title">Name to analyse</h3>
                  <p class="form-description">
                    Enter the full name you'd like to evaluate with five-grid numerology.
                  </p>
                  <n-input
                    v-model:value="prompt"
                    type="text"
                    maxlength="20"
                    placeholder="Enter your name"
                    class="input-control"
                  />
                </div>

                <div v-if="prompt_type === 'dream'" class="form-block">
                  <h3 class="form-title">Describe your dream</h3>
                  <p class="form-description">
                    Include people, places, and emotions to help interpret the symbolism.
                  </p>
                  <n-input
                    v-model:value="prompt"
                    type="textarea"
                    :autosize="{ minRows: 3 }"
                    maxlength="160"
                    placeholder="Please describe your dream in detail..."
                    class="input-control"
                  />
                </div>

                <div v-if="prompt_type === 'plum_flower'" class="form-block">
                  <h3 class="form-title">Numbers for the oracle</h3>
                  <p class="form-description">
                    Provide two random numbers between 0 and 1000 to generate your I Ching hexagram.
                  </p>
                  <div class="form-grid">
                    <n-form-item label="Number 1" label-placement="top" class="form-item">
                      <n-input-number
                        v-model:value="plum_flower.num1"
                        :min="0"
                        :max="1000"
                        class="input-control"
                      />
                    </n-form-item>
                    <n-form-item label="Number 2" label-placement="top" class="form-item">
                      <n-input-number
                        v-model:value="plum_flower.num2"
                        :min="0"
                        :max="1000"
                        class="input-control"
                      />
                    </n-form-item>
                  </div>
                </div>

                <div v-if="prompt_type === 'fate'" class="form-block">
                  <h3 class="form-title">Names to compare</h3>
                  <p class="form-description">
                    We'll look at the energetic harmony between the names you provide.
                  </p>
                  <div class="form-grid">
                    <n-form-item label="First name" label-placement="top" class="form-item">
                      <n-input
                        v-model:value="fate_body.name1"
                        maxlength="40"
                        placeholder="Enter first name"
                        class="input-control"
                      />
                    </n-form-item>
                    <n-form-item label="Second name" label-placement="top" class="form-item">
                      <n-input
                        v-model:value="fate_body.name2"
                        maxlength="40"
                        placeholder="Enter second name"
                        class="input-control"
                      />
                    </n-form-item>
                  </div>
                </div>

                <div v-if="prompt_type === 'flower_oracle'" class="form-block">
                  <h3 class="form-title">Ask the flowers</h3>
                  <p class="form-description">
                    Pose a gentle question and let floral symbolism offer a perspective.
                  </p>
                  <n-input
                    v-model:value="prompt"
                    type="textarea"
                    :autosize="{ minRows: 2 }"
                    maxlength="120"
                    placeholder="What flower energy is guiding me today?"
                    class="input-control"
                  />
                </div>
              </div>

              <div class="action-row">
                <n-button type="primary" size="large" class="submit-btn" @click="onSubmit" :loading="loading">
                  {{ loading ? 'Preparing your reading...' : 'Reveal my reading' }}
                </n-button>
                <n-button
                  v-if="result"
                  quaternary
                  size="large"
                  class="secondary-btn"
                  @click="showDrawer = true"
                >
                  <span class="btn-icon">📜</span>
                  View last reading
                </n-button>
              </div>
            </div>
          </n-tab-pane>

          <n-tab-pane name="about" tab="📚 About">
            <div class="about-card">
              <About />
            </div>
          </n-tab-pane>
        </n-tabs>
      </section>
    </div>

    <n-drawer
      v-model:show="showDrawer"
      style="height: 80vh;"
      placement="bottom"
      :trap-focus="false"
      :block-scroll="false"
      class="reading-drawer"
    >
      <n-drawer-content title="🔮 Your Reading" closable class="reading-drawer__content">
        <div class="result-content" v-html="result"></div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

.divination-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header {
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 22px 60px rgba(8, 47, 73, 0.45);
}

@media (min-width: 768px) {
  .page-header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
}

.header-text h2 {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.header-text p {
  margin: 8px 0 0;
  color: #cbd5f5;
  line-height: 1.7;
  max-width: 640px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.ad-space {
  border-radius: 20px;
  border: 1px dashed rgba(148, 163, 184, 0.26);
  background: rgba(15, 23, 42, 0.5);
  padding: 18px;
}

#my-ad-slot {
  min-height: 100px;
  width: 100%;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.content-grid.about-active {
  grid-template-columns: minmax(0, 1fr);
}

.summary-column {
  position: sticky;
  top: 120px;
}

.summary-card {
  border-radius: 26px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(8, 15, 33, 0.85);
  padding: 32px;
  box-shadow: 0 24px 70px rgba(8, 47, 73, 0.45);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.summary-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  background: rgba(99, 102, 241, 0.2);
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.35);
}

.summary-card h3 {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 24px;
  font-weight: 600;
}

.summary-lead {
  margin: 0;
  color: #cbd5f5;
  font-weight: 500;
}

.summary-body {
  margin: 0;
  color: #94a3b8;
  line-height: 1.7;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(to right, rgba(148, 163, 184, 0.16), rgba(99, 102, 241, 0.3), rgba(148, 163, 184, 0.16));
  margin: 8px 0;
}

.feature-list {
  margin: 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 8px;
  color: #cbd5f5;
}

.feature-list li {
  list-style: disc;
  line-height: 1.6;
}

.example-card {
  border-radius: 20px;
  padding: 20px;
  background: rgba(79, 70, 229, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #cbd5f5;
}

.example-card h4 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #a855f7;
}

.example-card p {
  margin: 0;
  line-height: 1.6;
}

.interaction-column {
  min-width: 0;
}

.divination-tabs {
  border-radius: 26px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(8, 15, 33, 0.78);
  padding: 24px;
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 70px rgba(8, 47, 73, 0.45);
}

.divination-tabs :deep(.n-tabs-nav) {
  margin-bottom: 24px;
}

.divination-tabs :deep(.n-tabs-tab) {
  padding: 0;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #cbd5f5;
}

.tab-icon {
  font-size: 18px;
}

.divination-tabs :deep(.n-tabs-bar) {
  height: 2px;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.8), rgba(236, 72, 153, 0.6));
}

.tab-nav {
  --n-height: 36px;
  --n-border-radius: 12px;
  --n-color: rgba(148, 163, 184, 0.12);
  --n-color-hover: rgba(148, 163, 184, 0.2);
  --n-text-color: #e2e8f0;
}

.panel-card {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(2, 10, 26, 0.88);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-stack {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-block {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-title {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 22px;
  font-weight: 600;
}

.form-description {
  margin: 0;
  color: #94a3b8;
  line-height: 1.7;
}

.form-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.form-item :deep(.n-form-item-label) {
  font-weight: 600;
  color: #cbd5f5;
  font-size: 14px;
}

.input-control {
  --n-border-radius: 16px;
  --n-color: rgba(15, 23, 42, 0.9);
  --n-color-hover: rgba(15, 23, 42, 0.96);
  --n-color-focus: rgba(15, 23, 42, 0.96);
  --n-color-pressed: rgba(15, 23, 42, 1);
  --n-text-color: #e2e8f0;
  --n-placeholder-color: rgba(148, 163, 184, 0.7);
  --n-border: 1px solid rgba(99, 102, 241, 0.18);
  --n-border-hover: 1px solid rgba(129, 140, 248, 0.38);
  --n-border-focus: 1px solid rgba(129, 140, 248, 0.5);
  --n-caret-color: #a855f7;
  --n-box-shadow-focus: 0 0 0 2px rgba(129, 140, 248, 0.18);
  --n-padding: 14px 16px;
}

.input-control :deep(textarea) {
  min-height: 120px;
}

.lunar-display {
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(99, 102, 241, 0.18);
  padding: 16px;
  color: #cbd5f5;
  min-height: 54px;
  display: flex;
  align-items: center;
  line-height: 1.6;
}

.lunar-hint {
  margin-top: -8px;
  color: #94a3b8;
  font-size: 14px;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
  align-items: center;
}

.submit-btn {
  --n-height: 52px;
  --n-padding: 0 32px;
  --n-border-radius: 16px;
  --n-font-size: 16px;
  font-weight: 600;
  box-shadow: 0 18px 40px rgba(99, 102, 241, 0.35);
}

.secondary-btn {
  --n-height: 52px;
  --n-padding: 0 28px;
  --n-border-radius: 16px;
  --n-font-size: 15px;
  --n-color: rgba(148, 163, 184, 0.12);
  --n-color-hover: rgba(148, 163, 184, 0.22);
  --n-text-color: #e2e8f0;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.about-card {
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(2, 10, 26, 0.88);
  padding: 32px;
  box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.12);
}

.reading-drawer :deep(.n-drawer-body) {
  padding: 0;
  background: rgba(2, 10, 26, 0.95);
}

.reading-drawer__content :deep(.n-drawer-header) {
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 20px;
  font-weight: 600;
  padding: 20px 24px;
}

.reading-drawer__content :deep(.n-drawer-body) {
  padding: 0 24px 24px;
}

.result-content {
  max-height: 50vh;
  overflow-y: auto;
  color: #e2e8f0;
  line-height: 1.7;
}

.result-content :deep(h1),
.result-content :deep(h2),
.result-content :deep(h3) {
  font-family: 'Playfair Display', 'Inter', serif;
  color: #a855f7;
}

.result-content :deep(p) {
  margin-bottom: 1rem;
  color: #cbd5f5;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary-column {
    position: static;
  }
}

@media (max-width: 640px) {
  .page-header {
    padding: 24px;
  }

  .divination-tabs {
    padding: 16px;
  }

  .panel-card {
    padding: 24px;
  }

  .action-row {
    flex-direction: column;
    align-items: stretch;
  }

  .secondary-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
