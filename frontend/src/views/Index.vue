<script setup>
import {
  NInput, NButton, NCard, NDatePicker, NSelect, NFormItem,
  NInputNumber, NTabs, NTabPane, NDrawer, NDrawerContent
} from 'naive-ui'
import { watch, ref, onMounted, computed } from "vue";
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
  { label: "Male", value: "男" },
  { label: "Female", value: "女" },
]
const plum_flower = useStorage("plum_flower", { num1: 0, num2: 0 })
const fate_body = useStorage("fate_body", { name1: "", name2: "" })

// Get current divination option
const currentOption = computed(() => {
  return DIVINATION_OPTIONS.find(option => option.key === prompt_type.value) || DIVINATION_OPTIONS[0];
});

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
      result.value = "Please configure API BASE URL and API KEY in settings";
      return;
    }
    await fetchEventSource(`${API_BASE}/api/divination`, {
      method: "POST",
      body: JSON.stringify({
        prompt: prompt.value || "What does my financial future hold?",
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
        result.value = `Reading failed: ${err.message}`;
        throw new Error(`Reading failed: ${err.message}`);
      }
    });
  } catch (error) {
    console.error(error);
    result.value = error.message || "Reading failed";
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
    lunarBirthday.value = 'Conversion failed'
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
  <div class="divination-container">
    <!-- Mystical Background Effects -->
    <div class="mystical-background">
      <div class="floating-symbols">
        <div class="symbol symbol-1">☯</div>
        <div class="symbol symbol-2">✦</div>
        <div class="symbol symbol-3">◆</div>
        <div class="symbol symbol-4">⚡</div>
        <div class="symbol symbol-5">🌙</div>
        <div class="symbol symbol-6">⭐</div>
        <div class="symbol symbol-7">🔮</div>
        <div class="symbol symbol-8">✨</div>
      </div>
      <div class="energy-waves">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
      </div>
    </div>

    <div class="section-header">
      <div class="header-ornament">◆ ◇ ◆</div>
      <h2 class="section-title">Divination Types</h2>
      <div class="header-ornament">◆ ◇ ◆</div>
    </div>
    <p class="section-description">Please select a divination type below to begin your reading.</p>
    <div class="ad-center">
      <div id="my-ad-slot" style="min-height: 120px;"></div>
    </div>

    <div class="divination-content">
      <n-tabs v-model:value="prompt_type" type="card" animated placement="top" class="mystical-tabs">
        <template v-if="isMobile" #prefix>
          <n-button @click="changeTab(-1)" class="tab-nav-btn">
            <span class="nav-icon">◀</span>
          </n-button>
        </template>
        <template v-if="isMobile" #suffix>
          <n-button @click="changeTab(1)" class="tab-nav-btn">
            <span class="nav-icon">▶</span>
          </n-button>
        </template>
        
        <n-tab-pane v-for="option in DIVINATION_OPTIONS" :name="option.key" :tab="''" >
          <template #tab>
            <span class="n-tabs-tab__label" :data-icon="option.icon">{{ option.label }}</span>
          </template>
          <n-card v-if="prompt_type != 'about'" class="mystical-divination-card" 
                  :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${currentOption.backgroundImage})` }">
            
            <!-- Function Introduction -->
            <div class="function-intro">
              <div class="intro-header">
                <div class="icon-container">
                  <span class="function-icon">{{ option.icon }}</span>
                  <div class="icon-aura"></div>
                </div>
                <h3 class="function-title">{{ option.title }}</h3>
              </div>
              <p class="function-description">{{ option.description }}</p>
              <div class="function-details">
                <p class="long-description">{{ option.longDescription }}</p>
                <div class="features-section">
                  <h4 class="features-title">✨ Features:</h4>
                  <ul class="features-list">
                    <li v-for="feature in option.features" :key="feature" class="feature-item">
                      <span class="feature-bullet">◆</span>
                      {{ feature }}
                    </li>
                  </ul>
                </div>
                <div class="example-section">
                  <h4 class="example-title">📝 Example:</h4>
                  <p class="example-text">{{ option.example }}</p>
                </div>
              </div>
            </div>

            <!-- Input Forms -->
            <div class="input-section">
              <div v-if="prompt_type == 'tarot'" class="input-group">
                <div class="tarot-cards-preview">
                  <div class="tarot-card card-past">
                    <div class="card-face">Past</div>
                  </div>
                  <div class="tarot-card card-present">
                    <div class="card-face">Present</div>
                  </div>
                  <div class="tarot-card card-future">
                    <div class="card-face">Future</div>
                  </div>
                </div>
                <n-input v-model:value="prompt" type="textarea" :autosize="{ minRows: 3 }" maxlength="40"
                  placeholder="What does my financial future hold?" class="mystical-input" />
              </div>
              
              <div v-if="prompt_type == 'horoscope'" class="input-group">
                <div class="zodiac-wheel">
                  <div class="zodiac-center">
                    <span class="zodiac-symbol">⭐</span>
                  </div>
                  <div class="zodiac-signs">
                    <div v-for="sign in ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']" 
                         :key="sign" class="zodiac-sign">{{ sign }}</div>
                  </div>
                </div>
                <n-select v-model:value="prompt" :options="[
                  { label: 'Aries ♈', value: 'Aries' }, { label: 'Taurus ♉', value: 'Taurus' },
                  { label: 'Gemini ♊', value: 'Gemini' }, { label: 'Cancer ♋', value: 'Cancer' },
                  { label: 'Leo ♌', value: 'Leo' }, { label: 'Virgo ♍', value: 'Virgo' },
                  { label: 'Libra ♎', value: 'Libra' }, { label: 'Scorpio ♏', value: 'Scorpio' },
                  { label: 'Sagittarius ♐', value: 'Sagittarius' }, { label: 'Capricorn ♑', value: 'Capricorn' },
                  { label: 'Aquarius ♒', value: 'Aquarius' }, { label: 'Pisces ♓', value: 'Pisces' }
                ]" placeholder="Select your zodiac sign" class="mystical-select" />
              </div>
              
              <div v-if="prompt_type == 'birthday'" class="input-group form-layout">
                <div class="bazi-elements">
                  <div class="element wood">木</div>
                  <div class="element fire">火</div>
                  <div class="element earth">土</div>
                  <div class="element metal">金</div>
                  <div class="element water">水</div>
                </div>
                <n-form-item label="🎂 Birthday" label-placement="left" class="mystical-form-item">
                  <n-date-picker v-model:formatted-value="birthday" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="mystical-date-picker" />
                </n-form-item>
                <n-form-item label="🌙 Lunar Date" label-placement="left" class="mystical-form-item">
                  <div class="lunar-display">{{ lunarBirthday }}</div>
                </n-form-item>
              </div>
              
              <div v-if="prompt_type == 'new_name'" class="input-group form-layout">
                <div class="name-generator-visual">
                  <div class="chinese-characters">
                    <span class="char">名</span>
                    <span class="char">字</span>
                    <span class="char">生</span>
                    <span class="char">成</span>
                  </div>
                </div>
                <n-form-item label="👤 Surname" label-placement="left" class="mystical-form-item">
                  <n-input v-model:value="surname" type="text" maxlength="2" placeholder="Enter surname" class="mystical-input" />
                </n-form-item>
                <n-form-item label="⚧ Gender" label-placement="left" class="mystical-form-item">
                  <n-select v-model:value="sex" :options="[{label: '♂ Male', value: '男'}, {label: '♀ Female', value: '女'}]" class="mystical-select" />
                </n-form-item>
                <n-form-item label="🎂 Birthday" label-placement="left" class="mystical-form-item">
                  <n-date-picker v-model:formatted-value="birthday" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" class="mystical-date-picker" />
                </n-form-item>
                <n-form-item label="💭 Additional Info" label-placement="left" class="mystical-form-item">
                  <n-input v-model:value="new_name_prompt" type="text" maxlength="20" placeholder="Any special preferences?" class="mystical-input" />
                </n-form-item>
                <div class="lunar-info">🌙 Lunar Date: {{ lunarBirthday }}</div>
              </div>
              
              <div v-if="prompt_type == 'name'" class="input-group">
                <div class="name-analysis-visual">
                  <div class="stroke-counter">
                    <div class="stroke-line"></div>
                    <div class="stroke-line"></div>
                    <div class="stroke-line"></div>
                    <div class="stroke-line"></div>
                    <div class="stroke-line"></div>
                  </div>
                </div>
                <n-input v-model:value="prompt" type="text" maxlength="10" placeholder="Enter your name" class="mystical-input" />
              </div>
              
              <div v-if="prompt_type == 'dream'" class="input-group">
                <div class="dream-visual">
                  <div class="dream-cloud">
                    <span class="dream-symbol">💭</span>
                    <span class="dream-symbol">🌙</span>
                    <span class="dream-symbol">✨</span>
                  </div>
                </div>
                <n-input v-model:value="prompt" type="textarea" :autosize="{ minRows: 3 }" maxlength="40"
                  placeholder="Please describe your dream in detail..." class="mystical-input" />
              </div>
              
              <div v-if="prompt_type == 'plum_flower'" class="input-group form-layout">
                <div class="iching-hexagram">
                  <div class="hexagram-lines">
                    <div class="line solid"></div>
                    <div class="line broken"><span></span><span></span></div>
                    <div class="line solid"></div>
                    <div class="line broken"><span></span><span></span></div>
                    <div class="line solid"></div>
                    <div class="line broken"><span></span><span></span></div>
                  </div>
                  <div class="plum-blossom">🌸</div>
                </div>
                <h4 class="instruction-text">🎲 Please enter two random numbers between 0-1000</h4>
                <n-form-item label="🔢 Number 1" label-placement="left" class="mystical-form-item">
                  <n-input-number v-model:value="plum_flower.num1" :min="0" :max="1000" class="mystical-number-input" />
                </n-form-item>
                <n-form-item label="🔢 Number 2" label-placement="left" class="mystical-form-item">
                  <n-input-number v-model:value="plum_flower.num2" :min="0" :max="1000" class="mystical-number-input" />
                </n-form-item>
              </div>
              
              <div v-if="prompt_type == 'fate'" class="input-group form-layout">
                <div class="love-compatibility-visual">
                  <div class="heart-container">
                    <div class="heart heart-1">💖</div>
                    <div class="heart heart-2">💕</div>
                    <div class="connecting-line"></div>
                  </div>
                </div>
                <h4 class="instruction-text">💫 Destiny is written in the stars, happiness is in your hands.</h4>
                <p class="instruction-subtext">Want to know if you have a connection with them? Enter two names and discover your compatibility.</p>
                <p class="instruction-example">For example: "John Smith" and "Jane Doe"</p>
                <n-form-item label="👤 First Name" label-placement="left" class="mystical-form-item">
                  <n-input v-model:value="fate_body.name1" maxlength="40" placeholder="Enter first name" class="mystical-input" />
                </n-form-item>
                <n-form-item label="👤 Second Name" label-placement="left" class="mystical-form-item">
                  <n-input v-model:value="fate_body.name2" maxlength="40" placeholder="Enter second name" class="mystical-input" />
                </n-form-item>
              </div>

              <div v-if="prompt_type == 'flower_oracle'" class="input-group">
                <div class="flower-oracle-visual">
                  <img :src="currentOption.cardImages[0]" alt="Flower" class="flower-oracle-img" />
                  <div class="flower-oracle-symbols">
                    <span class="flower-symbol">🌸</span>
                    <span class="flower-symbol">🌷</span>
                    <span class="flower-symbol">🌻</span>
                    <span class="flower-symbol">🌹</span>
                  </div>
                </div>
                <n-input v-model:value="prompt" type="textarea" :autosize="{ minRows: 2 }" maxlength="40"
                  placeholder="What flower energy is guiding me today?" class="mystical-input" />
                <div class="flower-oracle-tip">Tip: Ask about your day, love, or anything you wish gentle guidance for.</div>
              </div>
            </div>

            <!-- Enhanced Action Buttons -->
            <div class="action-buttons">
              <div class="button-container">
                <!-- 隐藏 View Reading 按钮 -->
                <button v-if="false" @click="showDrawer = !showDrawer" class="premium-btn view-btn" :class="{ 'has-result': result }">
                  <div class="btn-background"></div>
                  <div class="btn-glow"></div>
                  <div class="btn-content">
                    <div class="btn-icon-wrapper">
                      <span class="btn-icon">👁️</span>
                      <div class="icon-sparkle"></div>
                    </div>
                    <div class="btn-text">
                      <span class="btn-label">{{ loading ? 'Reading Results' : 'View Reading' }}</span>
                      <span class="btn-sublabel">{{ result ? 'Click to view your fortune' : 'Results will appear here' }}</span>
                    </div>
                  </div>
                  <div class="btn-particles">
                    <div class="particle particle-1"></div>
                    <div class="particle particle-2"></div>
                    <div class="particle particle-3"></div>
                    <div class="particle particle-4"></div>
                  </div>
                </button>
                
                <button @click="onSubmit" :disabled="loading" class="premium-btn submit-btn" :class="{ 'loading': loading }">
                  <div class="btn-background"></div>
                  <div class="btn-glow"></div>
                  <div class="btn-content">
                    <div class="btn-icon-wrapper">
                      <span class="btn-icon">{{ loading ? '🔮' : '✨' }}</span>
                      <div class="icon-sparkle"></div>
                      <div v-if="loading" class="loading-ring"></div>
                    </div>
                    <div class="btn-text">
                      <span class="btn-label">{{ loading ? 'Consulting the Stars...' : 'Get Reading' }}</span>
                      <span class="btn-sublabel">{{ loading ? 'Please wait while we divine your future' : 'Discover your destiny now' }}</span>
                    </div>
                  </div>
                  <div class="btn-particles">
                    <div class="particle particle-1"></div>
                    <div class="particle particle-2"></div>
                    <div class="particle particle-3"></div>
                    <div class="particle particle-4"></div>
                    <div class="particle particle-5"></div>
                    <div class="particle particle-6"></div>
                  </div>
                  <div class="btn-energy-waves">
                    <div class="energy-wave wave-1"></div>
                    <div class="energy-wave wave-2"></div>
                    <div class="energy-wave wave-3"></div>
                  </div>
                </button>
              </div>
            </div>
          </n-card>
        </n-tab-pane>
        
        <n-tab-pane name="about" tab="📚 About">
          <About />
        </n-tab-pane>
      </n-tabs>
    </div>
    
    <!-- Results Drawer -->
    <n-drawer v-model:show="showDrawer" style="height: 80vh;" placement="bottom" :trap-focus="false" :block-scroll="false" class="mystical-drawer">
      <n-drawer-content title="🔮 Your Reading" closable class="mystical-drawer-content">
        <div class="result-content" v-html="result"></div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700;900&family=Ma+Shan+Zheng&display=swap');

.divination-container {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  font-family: 'Noto Serif SC', serif;
  position: relative;
}

/* Mystical Background Effects */
.mystical-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-symbols {
  position: absolute;
  width: 100%;
  height: 100%;
}

.symbol {
  position: absolute;
  font-size: 2rem;
  color: rgba(212, 175, 55, 0.3);
  animation: float 15s linear infinite;
}

.symbol-1 { top: 10%; left: 10%; animation-delay: 0s; }
.symbol-2 { top: 20%; right: 15%; animation-delay: 2s; }
.symbol-3 { top: 40%; left: 5%; animation-delay: 4s; }
.symbol-4 { top: 60%; right: 10%; animation-delay: 6s; }
.symbol-5 { bottom: 30%; left: 20%; animation-delay: 8s; }
.symbol-6 { bottom: 20%; right: 25%; animation-delay: 10s; }
.symbol-7 { top: 70%; left: 50%; animation-delay: 12s; }
.symbol-8 { top: 30%; right: 40%; animation-delay: 14s; }

.energy-waves {
  position: absolute;
  width: 100%;
  height: 100%;
}

.wave {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 50%;
  animation: wave-pulse 8s ease-in-out infinite;
}

.wave-1 {
  width: 300px;
  height: 300px;
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.wave-2 {
  width: 400px;
  height: 400px;
  top: 50%;
  right: 20%;
  animation-delay: 2s;
}

.wave-3 {
  width: 250px;
  height: 250px;
  bottom: 20%;
  left: 50%;
  animation-delay: 4s;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.header-ornament {
  color: #d4af37;
  font-size: 1.5rem;
  opacity: 0.8;
  animation: shimmer 3s ease-in-out infinite;
}

.section-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #d4af37, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  letter-spacing: 0.1em;
}

.section-description {
  text-align: center;
  color: rgba(212, 175, 55, 0.8);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  font-style: italic;
}

/* Tabs Styling */
.mystical-tabs {
  --n-tab-color: rgba(0, 0, 0, 0.3);
  --n-tab-text-color: #d4af37;
  --n-tab-text-color-active: #ffd700;
  --n-tab-text-color-hover: #ffd700;
  --n-bar-color: #d4af37;
  --n-close-icon-color: #d4af37;
  --n-close-icon-color-hover: #ffd700;
}

.tab-nav-btn {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  color: #d4af37 !important;
  backdrop-filter: blur(10px);
}

.nav-icon {
  font-size: 1.2rem;
}

.mystical-tabs .n-tabs-tab {
  min-width: 220px;
  min-height: 80px;
  font-size: 1.5rem;
  font-family: 'Noto Serif SC', serif;
  font-weight: 600;
  padding: 1.2rem 2.2rem 1.2rem 2.2rem;
  border-radius: 32px !important;
  background: linear-gradient(120deg, #fffbe6 0%, #f7e9c2 100%);
  border: 2.5px solid #e6d8a8;
  box-shadow: 0 4px 24px #ffd70022, 0 1.5px 6px #fffbe655;
  color: #bfa100;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  position: relative;
  transition: all 0.22s cubic-bezier(0.4,1,0.7,1.2);
  overflow: hidden;
  z-index: 1;
}
.mystical-tabs .n-tabs-tab__label {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  position: relative;
  z-index: 1;
}
.mystical-tabs .n-tabs-tab__label::before {
  content: attr(data-icon);
  font-size: 2.1rem;
  margin-right: 0.2rem;
  filter: drop-shadow(0 0 8px #ffd70055);
  transition: filter 0.2s;
}
.mystical-tabs .n-tabs-tab--active {
  background: linear-gradient(120deg, #fffbe6 0%, #ffe066 100%) !important;
  color: #ffd700 !important;
  border-color: #ffd700 !important;
  box-shadow: 0 8px 32px #ffd70055, 0 2px 8px #fffbe688;
  font-weight: 800;
}
.mystical-tabs .n-tabs-tab--active .n-tabs-tab__label::before {
  filter: drop-shadow(0 0 16px #ffd700cc);
}
.mystical-tabs .n-tabs-tab:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 16px 48px #ffd70044, 0 6px 20px #fffbe688;
  background: linear-gradient(120deg, #fffbe6 0%, #ffe066 100%) !important;
  color: #bfa100 !important;
}
.mystical-tabs .n-tabs-tab:hover .n-tabs-tab__label::before {
  filter: drop-shadow(0 0 18px #ffd700cc);
}

/* Card Styling */
.mystical-divination-card {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(212, 175, 55, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 900px;
  margin: 2rem auto;
  max-width: 1400px;
  background-size: cover !important;
  background-position: center !important;
  background-attachment: fixed !important;
}

.mystical-divination-card:hover {
  border-color: rgba(212, 175, 55, 0.5);
  box-shadow: 0 16px 50px rgba(212, 175, 55, 0.3);
  transform: translateY(-3px);
}

/* Function Introduction */
.function-intro {
  padding: 4rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
  margin-bottom: 3rem;
}

.intro-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.icon-container {
  position: relative;
}

.function-icon {
  font-size: 4rem;
  filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.6));
  position: relative;
  z-index: 2;
}

.icon-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.3), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-aura 3s ease-in-out infinite;
}

.function-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #ffd700;
  margin: 0;
  text-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

.function-description {
  text-align: center;
  color: rgba(212, 175, 55, 0.9);
  font-size: 1.5rem;
  margin-bottom: 2.5rem;
  font-style: italic;
  line-height: 1.6;
}

.function-details {
  text-align: left;
  color: rgba(212, 175, 55, 0.8);
  line-height: 1.8;
  font-size: 1.15rem;
}

.long-description {
  margin-bottom: 2.5rem;
  text-indent: 2em;
  font-size: 1.2rem;
}

.features-section, .example-section {
  margin-bottom: 2rem;
}

.features-title, .example-title {
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.features-list {
  list-style: none;
  padding-left: 2rem;
  margin: 0;
}

.feature-item {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
}

.feature-bullet {
  color: #d4af37;
  font-size: 1.1rem;
}

.example-text {
  font-style: italic;
  color: rgba(212, 175, 55, 0.7);
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Visual Elements for Each Divination Type */
.tarot-cards-preview {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.tarot-card {
  width: 80px;
  height: 130px;
  background: linear-gradient(45deg, #1a1a2e, #16213e);
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4af37;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  animation: card-float 3s ease-in-out infinite;
}

.card-past { animation-delay: 0s; }
.card-present { animation-delay: 1s; }
.card-future { animation-delay: 2s; }

.tarot-card:hover {
  transform: translateY(-10px) rotate(5deg);
  box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
}

.zodiac-wheel {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto 3rem;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotate 30s linear infinite;
}

.zodiac-center {
  font-size: 2.5rem;
  color: #ffd700;
}

.zodiac-signs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.zodiac-sign {
  position: absolute;
  font-size: 1.5rem;
  color: #d4af37;
  transform-origin: center;
}

.zodiac-sign:nth-child(1) { top: 5%; left: 50%; transform: translateX(-50%); }
.zodiac-sign:nth-child(2) { top: 15%; right: 15%; }
.zodiac-sign:nth-child(3) { top: 35%; right: 5%; }
.zodiac-sign:nth-child(4) { top: 50%; right: 0%; transform: translateY(-50%); }
.zodiac-sign:nth-child(5) { bottom: 35%; right: 5%; }
.zodiac-sign:nth-child(6) { bottom: 15%; right: 15%; }
.zodiac-sign:nth-child(7) { bottom: 5%; left: 50%; transform: translateX(-50%); }
.zodiac-sign:nth-child(8) { bottom: 15%; left: 15%; }
.zodiac-sign:nth-child(9) { bottom: 35%; left: 5%; }
.zodiac-sign:nth-child(10) { top: 50%; left: 0%; transform: translateY(-50%); }
.zodiac-sign:nth-child(11) { top: 35%; left: 5%; }
.zodiac-sign:nth-child(12) { top: 15%; left: 15%; }

.bazi-elements {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.element {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  animation: element-pulse 2s ease-in-out infinite;
}

.wood { background: linear-gradient(45deg, #228B22, #32CD32); animation-delay: 0s; }
.fire { background: linear-gradient(45deg, #FF4500, #FF6347); animation-delay: 0.4s; }
.earth { background: linear-gradient(45deg, #8B4513, #D2691E); animation-delay: 0.8s; }
.metal { background: linear-gradient(45deg, #C0C0C0, #DCDCDC); animation-delay: 1.2s; }
.water { background: linear-gradient(45deg, #4169E1, #1E90FF); animation-delay: 1.6s; }

.name-generator-visual {
  text-align: center;
  margin-bottom: 3rem;
}

.chinese-characters {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.char {
  font-size: 2.5rem;
  color: #d4af37;
  border: 2px solid rgba(212, 175, 55, 0.3);
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  animation: char-glow 3s ease-in-out infinite;
}

.char:nth-child(1) { animation-delay: 0s; }
.char:nth-child(2) { animation-delay: 0.5s; }
.char:nth-child(3) { animation-delay: 1s; }
.char:nth-child(4) { animation-delay: 1.5s; }

.name-analysis-visual {
  text-align: center;
  margin-bottom: 3rem;
}

.stroke-counter {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
}

.stroke-line {
  width: 40px;
  height: 5px;
  background: linear-gradient(90deg, #d4af37, #ffd700);
  border-radius: 3px;
  animation: stroke-draw 2s ease-in-out infinite;
}

.stroke-line:nth-child(1) { animation-delay: 0s; }
.stroke-line:nth-child(2) { animation-delay: 0.2s; }
.stroke-line:nth-child(3) { animation-delay: 0.4s; }
.stroke-line:nth-child(4) { animation-delay: 0.6s; }
.stroke-line:nth-child(5) { animation-delay: 0.8s; }

.dream-visual {
  text-align: center;
  margin-bottom: 3rem;
}

.dream-cloud {
  display: inline-block;
  padding: 1.5rem 3rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50px;
  border: 2px solid rgba(212, 175, 55, 0.3);
  animation: cloud-float 4s ease-in-out infinite;
}

.dream-symbol {
  font-size: 2rem;
  margin: 0 0.8rem;
  animation: symbol-twinkle 2s ease-in-out infinite;
}

.dream-symbol:nth-child(1) { animation-delay: 0s; }
.dream-symbol:nth-child(2) { animation-delay: 0.7s; }
.dream-symbol:nth-child(3) { animation-delay: 1.4s; }

.iching-hexagram {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.hexagram-lines {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
}

.line {
  width: 100px;
  height: 8px;
  background: #d4af37;
  border-radius: 4px;
}

.line.broken {
  background: none;
  display: flex;
  gap: 15px;
}

.line.broken span {
  width: 40px;
  height: 8px;
  background: #d4af37;
  border-radius: 4px;
}

.plum-blossom {
  position: absolute;
  top: 50%;
  right: -50px;
  font-size: 2.5rem;
  animation: blossom-sway 3s ease-in-out infinite;
}

.love-compatibility-visual {
  text-align: center;
  margin-bottom: 3rem;
}

.heart-container {
  position: relative;
  display: inline-block;
  padding: 3rem;
}

.heart {
  font-size: 2.5rem;
  animation: heart-beat 2s ease-in-out infinite;
}

.heart-1 {
  position: absolute;
  left: 0;
  animation-delay: 0s;
}

.heart-2 {
  position: absolute;
  right: 0;
  animation-delay: 1s;
}

.connecting-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #ff69b4, #ffd700, #ff69b4);
  transform: translate(-50%, -50%);
  animation: line-pulse 3s ease-in-out infinite;
}

/* Input Section */
.input-section {
  padding: 0 4rem 4rem;
}

.input-group {
  margin-bottom: 3rem;
}

.form-layout {
  text-align: left;
}

.instruction-text {
  color: #ffd700;
  text-align: center;
  margin-bottom: 2.5rem;
  font-weight: 600;
  font-size: 1.4rem;
}

.instruction-subtext, .instruction-example {
  text-align: center;
  color: rgba(212, 175, 55, 0.8);
  margin-bottom: 1.5rem;
  font-style: italic;
  font-size: 1.15rem;
}

.lunar-display, .lunar-info {
  color: #d4af37;
  font-style: italic;
  padding: 1rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  font-size: 1.1rem;
}

/* Form Controls */
.mystical-form-item {
  margin-bottom: 2.5rem;
}

.mystical-form-item :deep(.n-form-item-row__label) {
  color: #d4af37 !important;
  font-family: 'Noto Serif SC', serif !important;
  font-weight: 500 !important;
  min-width: 160px !important;
  font-size: 1.15rem !important;
}

.mystical-input, .mystical-select, .mystical-date-picker, .mystical-number-input {
  --n-border: 1px solid rgba(212, 175, 55, 0.3) !important;
  --n-border-hover: 1px solid rgba(212, 175, 55, 0.5) !important;
  --n-border-focus: 1px solid #d4af37 !important;
  --n-color: rgba(0, 0, 0, 0.3) !important;
  --n-text-color: #d4af37 !important;
  --n-placeholder-color: rgba(212, 175, 55, 0.5) !important;
  --n-height: 52px !important;
  --n-font-size: 1.1rem !important;
  backdrop-filter: blur(10px);
  border-radius: 12px !important;
  transition: all 0.3s ease;
  font-family: 'Noto Serif SC', serif !important;
}

.mystical-input:hover, .mystical-select:hover, .mystical-date-picker:hover, .mystical-number-input:hover {
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.25);
}

/* Enhanced Premium Action Buttons */
.action-buttons {
  padding: 0 4rem 4rem;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.premium-btn {
  position: relative;
  width: 320px;
  height: 120px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  overflow: hidden;
  font-family: 'Noto Serif SC', serif;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.premium-btn:disabled {
  cursor: not-allowed;
  opacity: 0.8;
}

.premium-btn:hover:not(:disabled) {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 60px rgba(212, 175, 55, 0.4);
}

.premium-btn:active:not(:disabled) {
  transform: translateY(-4px) scale(0.98);
}

/* Button Background */
.btn-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.8) 0%,
    rgba(26, 26, 46, 0.9) 25%,
    rgba(22, 33, 62, 0.8) 50%,
    rgba(15, 52, 96, 0.9) 75%,
    rgba(0, 0, 0, 0.8) 100%
  );
  border: 2px solid rgba(212, 175, 55, 0.4);
  border-radius: 25px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.premium-btn:hover .btn-background {
  border-color: rgba(212, 175, 55, 0.8);
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.1) 0%,
    rgba(26, 26, 46, 0.9) 25%,
    rgba(22, 33, 62, 0.8) 50%,
    rgba(15, 52, 96, 0.9) 75%,
    rgba(212, 175, 55, 0.1) 100%
  );
}

/* Button Glow Effect */
.btn-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #d4af37, #ffd700, #d4af37, #ffd700);
  background-size: 400% 400%;
  border-radius: 27px;
  opacity: 0;
  z-index: -1;
  animation: gradient-shift 3s ease-in-out infinite;
  transition: opacity 0.3s ease;
}

.premium-btn:hover .btn-glow {
  opacity: 0.6;
}

.submit-btn .btn-glow {
  opacity: 0.3;
}

.submit-btn:hover .btn-glow {
  opacity: 0.8;
}

/* Button Content */
.btn-content {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  height: 100%;
  padding: 0 2rem;
  z-index: 2;
}

.btn-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.8));
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

.premium-btn:hover .btn-icon {
  transform: scale(1.1) rotate(5deg);
  filter: drop-shadow(0 0 25px rgba(255, 215, 0, 1));
}

.icon-sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.4), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: sparkle-pulse 2s ease-in-out infinite;
  opacity: 0;
}

.premium-btn:hover .icon-sparkle {
  opacity: 1;
}

.btn-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3rem;
}

.btn-label {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  transition: all 0.3s ease;
}

.btn-sublabel {
  font-size: 0.9rem;
  color: rgba(212, 175, 55, 0.8);
  font-style: italic;
  transition: all 0.3s ease;
}

.premium-btn:hover .btn-label {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
}

.premium-btn:hover .btn-sublabel {
  color: rgba(255, 255, 255, 0.9);
}

/* Loading Ring */
.loading-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(212, 175, 55, 0.3);
  border-top: 3px solid #d4af37;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: spin 1s linear infinite;
}

/* Button Particles */
.btn-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 25px;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #d4af37;
  border-radius: 50%;
  opacity: 0;
  animation: particle-float 3s ease-in-out infinite;
}

.particle-1 { top: 20%; left: 20%; animation-delay: 0s; }
.particle-2 { top: 30%; right: 25%; animation-delay: 0.5s; }
.particle-3 { bottom: 25%; left: 30%; animation-delay: 1s; }
.particle-4 { bottom: 35%; right: 20%; animation-delay: 1.5s; }
.particle-5 { top: 50%; left: 15%; animation-delay: 2s; }
.particle-6 { top: 60%; right: 15%; animation-delay: 2.5s; }

.premium-btn:hover .particle {
  opacity: 1;
}

/* Energy Waves for Submit Button */
.btn-energy-waves {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.energy-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: energy-wave-pulse 2s ease-out infinite;
}

.wave-1 {
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.wave-2 {
  width: 120px;
  height: 120px;
  animation-delay: 0.7s;
}

.wave-3 {
  width: 160px;
  height: 160px;
  animation-delay: 1.4s;
}

.submit-btn.loading .energy-wave {
  opacity: 1;
}

/* Button Variants */
.view-btn .btn-background {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.7) 0%,
    rgba(26, 26, 46, 0.8) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.view-btn.has-result .btn-background {
  background: linear-gradient(135deg, 
    rgba(34, 139, 34, 0.2) 0%,
    rgba(26, 26, 46, 0.8) 50%,
    rgba(34, 139, 34, 0.2) 100%
  );
  border-color: rgba(34, 139, 34, 0.5);
}

.submit-btn .btn-background {
  background: linear-gradient(135deg, 
    rgba(212, 175, 55, 0.2) 0%,
    rgba(26, 26, 46, 0.9) 25%,
    rgba(22, 33, 62, 0.8) 50%,
    rgba(15, 52, 96, 0.9) 75%,
    rgba(255, 215, 0, 0.2) 100%
  );
  border-color: rgba(212, 175, 55, 0.6);
}

/* Drawer Styling */
.mystical-drawer {
  --n-color: rgba(0, 0, 0, 0.9);
  --n-text-color: #d4af37;
  backdrop-filter: blur(20px);
}

.mystical-drawer-content {
  background: rgba(0, 0, 0, 0.9) !important;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
}

.result-content {
  text-align: left;
  color: #d4af37;
  line-height: 1.8;
  font-family: 'Noto Serif SC', serif;
  font-size: 1.1rem;
}

.result-content :deep(h1), .result-content :deep(h2), .result-content :deep(h3) {
  color: #ffd700;
  margin: 1.5rem 0 1rem 0;
}

.result-content :deep(p) {
  margin-bottom: 1rem;
}

.result-content :deep(strong) {
  color: #ffd700;
}

/* Enhanced Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
  50% { transform: translateY(-10px) translateX(-5px) rotate(-3deg); }
  75% { transform: translateY(-15px) translateX(8px) rotate(2deg); }
}

@keyframes wave-pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes pulse-aura {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.2); }
}

@keyframes card-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes element-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 255, 255, 0.3); }
  50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 255, 255, 0.6); }
}

@keyframes char-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.6); }
}

@keyframes stroke-draw {
  0% { width: 0; }
  50% { width: 40px; }
  100% { width: 40px; }
}

@keyframes cloud-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes symbol-twinkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes blossom-sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes line-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes sparkle-pulse {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes particle-float {
  0%, 100% { opacity: 0; transform: translateY(0px); }
  50% { opacity: 1; transform: translateY(-20px); }
}

@keyframes energy-wave-pulse {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .divination-container {
    padding: 1rem;
    max-width: 100%;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .function-intro {
    padding: 2rem;
  }
  
  .function-title {
    font-size: 2rem;
  }
  
  .function-description {
    font-size: 1.2rem;
  }
  
  .input-section {
    padding: 0 2rem 2rem;
  }
  
  .button-container {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .premium-btn {
    width: 100%;
    max-width: 350px;
    height: 100px;
  }
  
  .btn-content {
    gap: 1rem;
    padding: 0 1.5rem;
  }
  
  .btn-icon {
    font-size: 2rem;
  }
  
  .btn-label {
    font-size: 1.2rem;
  }
  
  .btn-sublabel {
    font-size: 0.8rem;
  }
  
  .intro-header {
    flex-direction: column;
    text-align: center;
  }
  
  .mystical-divination-card {
    min-height: 700px;
    margin: 1rem auto;
    max-width: 100%;
  }
  
  .zodiac-wheel {
    width: 180px;
    height: 180px;
  }
  
  .bazi-elements {
    gap: 0.8rem;
  }
  
  .element {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  .symbol {
    font-size: 1.5rem;
  }
  
  .wave {
    display: none;
  }
}

.flower-oracle-visual {
  text-align: center;
  margin-bottom: 2rem;
}
.flower-oracle-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 4px 24px #ffd70044;
  object-fit: cover;
  margin-bottom: 1rem;
}
.flower-oracle-symbols {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1rem;
}
.flower-symbol {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px #ffd70088);
  animation: flower-bounce 2.5s infinite ease-in-out;
}
.flower-symbol:nth-child(2) { animation-delay: 0.5s; }
.flower-symbol:nth-child(3) { animation-delay: 1s; }
.flower-symbol:nth-child(4) { animation-delay: 1.5s; }

@keyframes flower-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px) scale(1.1); }
}
.flower-oracle-tip {
  text-align: center;
  color: #ffd700;
  font-size: 1.1rem;
  margin-top: 1rem;
  font-style: italic;
  letter-spacing: 0.02em;
}
</style>