<script setup>
import {
  NGrid, NGi, NSpace, NAlert, NButton, NMessageProvider, NPageHeader,
  NConfigProvider, NGlobalStyle, NBackTop, darkTheme, NSpin, enUS, dateEnUS
} from 'naive-ui'
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useIsMobile } from './utils/composables'
import { useGlobalState } from './store'

const { isDark, toggleDark } = useGlobalState()
const state_jwt = useStorage('jwt')
const isMobile = useIsMobile()

const themeOverrides = {
  common: {
    primaryColor: '#d4af37',
    primaryColorHover: '#b8941f',
    primaryColorPressed: '#9c7a1a',
    borderRadius: '12px',
    fontFamily: '"Noto Serif SC", "Ma Shan Zheng", serif',
  }
}

const theme = computed(() => isDark.value ? darkTheme : null)

const router = useRouter()
const settings = ref({});
const loading = ref(false);

const API_BASE = import.meta.env.VITE_API_BASE || "";

const logOut = () => {
  state_jwt.value = "";
  router.go(0);
};

const fetchSettings = async () => {
  loading.value = true;
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${state_jwt.value || "xxx"}`,
        "Content-Type": "application/json"
      },
    });
    if (response.ok) {
      settings.value = await response.json();
    }
  } catch (error) {
    console.error(error);
  }
  finally {
    loading.value = false;
  }
}

const showAd = computed(() => !isMobile.value && settings.value.ad_client);

onMounted(async () => {
  await fetchSettings();
  if (!isMobile.value && settings.value.ad_client) {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
  if (!document.getElementById('my-ad-script')) {
    const script = document.createElement('script')
    script.id = 'my-ad-script'
    script.type = 'text/javascript'
    script.src = '//pl27008502.profitableratecpm.com/78/54/89/78548974d6da00601feb22cead70491f.js'
    document.body.appendChild(script)
  }
});
</script>

<template>
  <div class="app-container">
    <!-- Enhanced Zen Background Effects -->
    <div class="zen-background">
      <!-- Animated Particles -->
      <div class="floating-particles"></div>
      
      <!-- Mystical Orbs -->
      <div class="mystical-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="orb orb-4"></div>
      </div>
      
      <!-- Energy Streams -->
      <div class="energy-streams">
        <div class="stream stream-1"></div>
        <div class="stream stream-2"></div>
        <div class="stream stream-3"></div>
      </div>
      
      <!-- Mystical Glow -->
      <div class="mystical-glow"></div>
      
      <!-- Zen Circles -->
      <div class="zen-circles">
        <div class="zen-circle zen-circle-1"></div>
        <div class="zen-circle zen-circle-2"></div>
        <div class="zen-circle zen-circle-3"></div>
        <div class="zen-circle zen-circle-4"></div>
      </div>
      
      <!-- Sacred Geometry -->
      <div class="sacred-geometry">
        <div class="geometry-shape triangle-1"></div>
        <div class="geometry-shape triangle-2"></div>
        <div class="geometry-shape hexagon-1"></div>
        <div class="geometry-shape hexagon-2"></div>
      </div>
      
      <!-- Constellation Effect -->
      <div class="constellation">
        <div class="star star-1"></div>
        <div class="star star-2"></div>
        <div class="star star-3"></div>
        <div class="star star-4"></div>
        <div class="star star-5"></div>
        <div class="star star-6"></div>
        <div class="connecting-line line-1"></div>
        <div class="connecting-line line-2"></div>
        <div class="connecting-line line-3"></div>
      </div>
    </div>

    <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="enUS" :date-locale="dateEnUS">
      <n-spin description="Consulting the ancient wisdom..." :show="loading" class="mystical-loading">
        <n-global-style />
        <n-message-provider>
          <n-grid :x-gap="12" :cols="isMobile ? 4 : 6">
            <n-gi :span="1">
              <div class="side" v-if="showAd">
                <ins class="adsbygoogle" style="display:block" :data-ad-client="settings.ad_client"
                  :data-ad-slot="settings.ad_slot" data-ad-format="auto" data-full-width-responsive="true"></ins>
              </div>
            </n-gi>
            <n-gi :span="4">
              <div class="main">
                <!-- 广告位，主内容区最上方 -->
                <div class="ad-center">
                  <div id="my-ad-slot" style="min-height: 120px;"></div>
                </div>
                <div class="mystical-header">
                  <div class="header-ornament">◆ ◇ ◆</div>
                  <h1 class="main-title">Chinese Fortune Teller</h1>
                  <div class="subtitle">Ancient Wisdom • Modern Insights</div>
                  <div class="header-ornament">◆ ◇ ◆</div>
                </div>

                <div class="control-panel">
                  <div class="mystical-controls">
                    <div v-if="settings.enable_login" class="auth-section">
                      <n-button v-if="settings.user_name" @click="logOut" class="mystical-btn logout-btn">
                        <span class="btn-icon">🚪</span>
                        Logout
                      </n-button>
                      <n-button v-else type="primary" @click="router.push('/login')" class="mystical-btn login-btn">
                        <span class="btn-icon">🔑</span>
                        Login
                      </n-button>
                    </div>
                    <n-button @click="router.push('/')" class="mystical-btn nav-btn">
                      <span class="btn-icon">🏠</span>
                      Home
                    </n-button>
                    <n-button @click="router.push('/blog')" class="mystical-btn nav-btn">
                      <span class="btn-icon">📝</span>
                      Blog
                    </n-button>
                    <n-button @click="router.push('/settings')" class="mystical-btn nav-btn">
                      <span class="btn-icon">⚙️</span>
                      Settings
                    </n-button>
                    <n-button @click="router.push('/consulting')" class="mystical-btn nav-btn">
                      <span class="btn-icon">💬</span>
                      Consulting
                    </n-button>
                  </div>
                </div>

                <div class="status-alerts">
                  <n-alert v-if="settings.user_name" type="success" class="mystical-alert success-alert">
                    <div class="alert-content">
                      <span class="alert-icon">🌟</span>
                      Welcome, {{ settings.login_type }} user {{ settings.user_name }}
                    </div>
                  </n-alert>
                  <n-alert v-else-if="settings.enable_login && settings.enable_rate_limit" type="warning" class="mystical-alert warning-alert">
                    <div class="alert-content">
                      <span class="alert-icon">⚠️</span>
                      Not logged in - rate limited mode ({{ settings.rate_limit }})
                    </div>
                  </n-alert>
                </div>

                <router-view></router-view>
              </div>
            </n-gi>
            <n-gi :span="1" v-if="!isMobile">
              <div class="side" v-if="showAd">
                <ins class="adsbygoogle" style="display:block" :data-ad-client="settings.ad_client"
                  :data-ad-slot="settings.ad_slot" data-ad-format="auto" data-full-width-responsive="true"></ins>
              </div>
            </n-gi>
          </n-grid>
        </n-message-provider>
        <n-back-top class="mystical-back-top" />
      </n-spin>
    </n-config-provider>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700;900&family=Ma+Shan+Zheng&display=swap');

.app-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  background: radial-gradient(ellipse at center, #0a0a1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%);
}

/* Enhanced Zen Background Effects */
.zen-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(212, 175, 55, 0.4), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255, 215, 0, 0.3), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(212, 175, 55, 0.5), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255, 215, 0, 0.4), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(212, 175, 55, 0.3), transparent);
  background-repeat: repeat;
  background-size: 250px 250px;
  animation: float 25s linear infinite;
}

.mystical-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.6), rgba(212, 175, 55, 0.1), transparent);
  animation: orb-float 15s ease-in-out infinite;
}

.orb-1 {
  width: 120px;
  height: 120px;
  top: 15%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 20%;
  animation-delay: 3s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 25%;
  left: 30%;
  animation-delay: 6s;
}

.orb-4 {
  width: 60px;
  height: 60px;
  top: 40%;
  right: 40%;
  animation-delay: 9s;
}

.energy-streams {
  position: absolute;
  width: 100%;
  height: 100%;
}

.stream {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
  animation: stream-flow 20s linear infinite;
}

.stream-1 {
  width: 200px;
  height: 2px;
  top: 20%;
  left: -200px;
  animation-delay: 0s;
}

.stream-2 {
  width: 300px;
  height: 1px;
  top: 50%;
  left: -300px;
  animation-delay: 7s;
}

.stream-3 {
  width: 150px;
  height: 2px;
  top: 80%;
  left: -150px;
  animation-delay: 14s;
}

.mystical-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1000px;
  height: 1000px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(255, 215, 0, 0.05) 30%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: pulse 12s ease-in-out infinite;
}

.zen-circles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.zen-circle {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 50%;
  animation: rotate 40s linear infinite;
}

.zen-circle-1 {
  width: 400px;
  height: 400px;
  top: 10%;
  left: 5%;
  animation-duration: 30s;
}

.zen-circle-2 {
  width: 250px;
  height: 250px;
  top: 50%;
  right: 10%;
  animation-duration: 45s;
  animation-direction: reverse;
}

.zen-circle-3 {
  width: 180px;
  height: 180px;
  bottom: 15%;
  left: 40%;
  animation-duration: 35s;
}

.zen-circle-4 {
  width: 320px;
  height: 320px;
  top: 30%;
  right: 30%;
  animation-duration: 50s;
  animation-direction: reverse;
}

.sacred-geometry {
  position: absolute;
  width: 100%;
  height: 100%;
}

.geometry-shape {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.2);
  animation: geometry-rotate 25s linear infinite;
}

.triangle-1 {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 52px solid rgba(212, 175, 55, 0.1);
  top: 25%;
  left: 20%;
  animation-delay: 0s;
}

.triangle-2 {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 35px solid rgba(212, 175, 55, 0.1);
  bottom: 30%;
  right: 25%;
  animation-delay: 8s;
  animation-direction: reverse;
}

.hexagon-1 {
  width: 40px;
  height: 23px;
  background: rgba(212, 175, 55, 0.1);
  position: relative;
  top: 40%;
  left: 70%;
  animation-delay: 4s;
}

.hexagon-1:before,
.hexagon-1:after {
  content: "";
  position: absolute;
  width: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
}

.hexagon-1:before {
  bottom: 100%;
  border-bottom: 12px solid rgba(212, 175, 55, 0.1);
}

.hexagon-1:after {
  top: 100%;
  border-top: 12px solid rgba(212, 175, 55, 0.1);
}

.hexagon-2 {
  width: 30px;
  height: 17px;
  background: rgba(212, 175, 55, 0.1);
  position: relative;
  top: 70%;
  left: 15%;
  animation-delay: 12s;
  animation-direction: reverse;
}

.hexagon-2:before,
.hexagon-2:after {
  content: "";
  position: absolute;
  width: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
}

.hexagon-2:before {
  bottom: 100%;
  border-bottom: 9px solid rgba(212, 175, 55, 0.1);
}

.hexagon-2:after {
  top: 100%;
  border-top: 9px solid rgba(212, 175, 55, 0.1);
}

.constellation {
  position: absolute;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #d4af37;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);
  animation: star-twinkle 3s ease-in-out infinite;
}

.star-1 { top: 20%; left: 30%; animation-delay: 0s; }
.star-2 { top: 25%; left: 45%; animation-delay: 0.5s; }
.star-3 { top: 35%; left: 40%; animation-delay: 1s; }
.star-4 { top: 30%; left: 55%; animation-delay: 1.5s; }
.star-5 { top: 40%; left: 50%; animation-delay: 2s; }
.star-6 { top: 45%; left: 35%; animation-delay: 2.5s; }

.connecting-line {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
  animation: line-glow 4s ease-in-out infinite;
}

.line-1 {
  width: 80px;
  top: 22.5%;
  left: 32%;
  transform: rotate(25deg);
  animation-delay: 0s;
}

.line-2 {
  width: 60px;
  top: 32.5%;
  left: 42%;
  transform: rotate(-15deg);
  animation-delay: 1s;
}

.line-3 {
  width: 70px;
  top: 37.5%;
  left: 47%;
  transform: rotate(45deg);
  animation-delay: 2s;
}

/* Header Styling */
.mystical-header {
  text-align: center;
  padding: 2rem 0;
  margin-bottom: 2rem;
  position: relative;
}

.header-ornament {
  color: #d4af37;
  font-size: 1.5rem;
  margin: 1rem 0;
  opacity: 0.8;
  animation: shimmer 3s ease-in-out infinite;
}

.main-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #d4af37, #ffd700, #d4af37);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 1rem 0;
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
  animation: gradientShift 4s ease-in-out infinite;
  letter-spacing: 0.1em;
}

.subtitle {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.2rem;
  color: rgba(212, 175, 55, 0.8);
  font-style: italic;
  margin: 1rem 0;
  letter-spacing: 0.2em;
}

/* Control Panel */
.control-panel {
  margin-bottom: 2rem;
}

.mystical-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.mystical-btn {
  background: rgba(10, 10, 30, 0.95) !important;
  border: 3px solid #ffd700 !important;
  color: #ffd700 !important;
  padding: 1.2rem 2.8rem !important;
  border-radius: 22px !important;
  font-size: 2rem !important;
  font-weight: 700 !important;
  box-shadow: 0 8px 32px rgba(212, 175, 55, 0.25), 0 2px 8px rgba(0,0,0,0.18);
  transition: all 0.25s cubic-bezier(0.4,1,0.7,1.2);
  position: relative;
  overflow: hidden;
}
.mystical-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 22px;
  background: linear-gradient(120deg, rgba(255,215,0,0.18) 0%, rgba(255,255,255,0.12) 100%);
  z-index: 0;
  pointer-events: none;
}
.mystical-btn .btn-icon {
  font-size: 2.2rem !important;
  margin-right: 0.7rem;
  filter: drop-shadow(0 0 8px #ffd70088);
}
.mystical-btn:hover {
  background: linear-gradient(120deg, #ffd700 0%, #fffbe6 100%) !important;
  color: #1a1a2e !important;
  border-color: #fffbe6 !important;
  box-shadow: 0 12px 40px #ffd70055, 0 4px 16px #fffbe688;
  transform: translateY(-4px) scale(1.04);
}
.mystical-btn:hover .btn-icon {
  filter: drop-shadow(0 0 16px #ffd700cc);
}

/* Status Alerts */
.status-alerts {
  margin-bottom: 2rem;
}

.mystical-alert {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(212, 175, 55, 0.3) !important;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  margin-bottom: 1rem;
}

.alert-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #d4af37;
  font-family: 'Noto Serif SC', serif;
}

.alert-icon {
  font-size: 1.2rem;
}

/* Loading Spinner */
.mystical-loading {
  --n-color: rgba(212, 175, 55, 0.8);
  --n-text-color: #d4af37;
}

/* Back to Top */
.mystical-back-top {
  --n-color: rgba(0, 0, 0, 0.4);
  --n-color-hover: rgba(212, 175, 55, 0.2);
  --n-icon-color: #d4af37;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.side {
  height: 100vh;
}

.main {
  min-height: 100vh;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* Enhanced Animations */
@keyframes float {
  0% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-15px) translateX(8px); }
  50% { transform: translateY(-8px) translateX(-5px); }
  75% { transform: translateY(-12px) translateX(10px); }
  100% { transform: translateY(0px) translateX(0px); }
}

@keyframes orb-float {
  0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
  33% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
  66% { transform: translateY(10px) scale(0.9); opacity: 0.7; }
}

@keyframes stream-flow {
  0% { left: -300px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes geometry-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes star-twinkle {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

@keyframes line-glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .mystical-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .mystical-btn {
    width: 200px;
    justify-content: center;
  }
  
  .zen-circle, .orb, .geometry-shape {
    display: none;
  }
  
  .constellation {
    display: none;
  }
  
  .energy-streams {
    display: none;
  }
}
</style>