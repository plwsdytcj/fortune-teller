<script setup>
import {
  NAlert,
  NButton,
  NMessageProvider,
  NConfigProvider,
  NGlobalStyle,
  NBackTop,
  darkTheme,
  NSpin,
  enUS,
  dateEnUS
} from 'naive-ui'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useIsMobile } from './utils/composables'
import { useGlobalState } from './store'

const { isDark, toggleDark } = useGlobalState()
const state_jwt = useStorage('jwt')
const isMobile = useIsMobile()

const themeOverrides = {
  common: {
    primaryColor: '#7c3aed',
    primaryColorHover: '#6d28d9',
    primaryColorPressed: '#5b21b6',
    primaryColorSuppl: '#8b5cf6',
    borderRadius: '14px',
    fontFamily: '"Inter", "Segoe UI", sans-serif'
  }
}

const theme = computed(() => (isDark.value ? darkTheme : null))

const router = useRouter()
const settings = ref({})
const loading = ref(false)

const API_BASE = import.meta.env.VITE_API_BASE || ''

const logOut = () => {
  state_jwt.value = ''
  router.go(0)
}

const fetchSettings = async () => {
  loading.value = true
  try {
    const response = await fetch(`${API_BASE}/api/v1/settings`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${state_jwt.value || 'xxx'}`,
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) {
      settings.value = await response.json()
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const showAd = computed(() => !isMobile.value && settings.value.ad_client)

onMounted(async () => {
  await fetchSettings()
  if (!isMobile.value && settings.value.ad_client) {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }
  if (!document.getElementById('my-ad-script')) {
    const script = document.createElement('script')
    script.id = 'my-ad-script'
    script.type = 'text/javascript'
    script.src = '//pl27008502.profitableratecpm.com/78/54/89/78548974d6da00601feb22cead70491f.js'
    document.body.appendChild(script)
  }
})
</script>

<template>
  <div class="app-shell">
    <div class="background-gradient"></div>
    <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="enUS" :date-locale="dateEnUS">
      <n-spin description="Consulting the ancient wisdom..." :show="loading" class="app-loading">
        <n-global-style />
        <n-message-provider>
          <div class="layout-shell">
            <aside v-if="showAd" class="ad-column">
              <div class="ad-surface">
                <ins
                  class="adsbygoogle"
                  style="display:block"
                  :data-ad-client="settings.ad_client"
                  :data-ad-slot="settings.ad_slot"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>
              </div>
            </aside>

            <main class="main-column">
              <header class="top-bar">
                <div class="brand">
                  <span class="brand-icon">🔮</span>
                  <div class="brand-copy">
                    <h1>Divination Today</h1>
                    <p>Ancient wisdom for curious minds</p>
                  </div>
                </div>
                <div class="top-actions">
                  <n-button quaternary class="action-btn" @click="toggleDark">
                    <span class="btn-icon">{{ isDark ? '🌙' : '☀️' }}</span>
                    {{ isDark ? 'Dark' : 'Light' }} mode
                  </n-button>
                  <template v-if="settings.enable_login">
                    <n-button v-if="settings.user_name" quaternary class="action-btn" @click="logOut">
                      <span class="btn-icon">🚪</span>
                      Logout
                    </n-button>
                    <n-button v-else type="primary" class="action-btn" @click="router.push('/login')">
                      <span class="btn-icon">🔑</span>
                      Login
                    </n-button>
                  </template>
                </div>
              </header>

              <section class="nav-card">
                <div class="nav-buttons">
                  <n-button class="nav-btn" @click="router.push('/')">
                    <span class="btn-icon">🏠</span>
                    Home
                  </n-button>
                  <n-button class="nav-btn" @click="router.push('/blog')">
                    <span class="btn-icon">📝</span>
                    Blog
                  </n-button>
                  <n-button class="nav-btn" @click="router.push('/settings')">
                    <span class="btn-icon">⚙️</span>
                    Settings
                  </n-button>
                  <n-button class="nav-btn" @click="router.push('/consulting')">
                    <span class="btn-icon">💬</span>
                    Consulting
                  </n-button>
                </div>
              </section>

              <section class="promo-area">
                <a
                  href="https://www.profitableratecpm.com/n3sirgrydd?key=42e88561bb8eac1885992f9b328639bc"
                  class="promo-banner"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div class="promo-copy">
                    <span class="eyebrow">Sponsored</span>
                    <h2>Curated offers for seekers</h2>
                    <p>Discover partners that complement your spiritual journey.</p>
                  </div>
                  <img
                    src="https://www.profitableratecpm.com/banners/728x90.png"
                    alt="Advertisement"
                    loading="lazy"
                  />
                </a>
              </section>

              <div class="ad-placeholder">
                <div id="my-ad-slot"></div>
              </div>

              <section class="status-area">
                <n-alert v-if="settings.user_name" type="success" class="status-alert">
                  <div class="alert-content">
                    <span class="alert-icon">🌟</span>
                    Welcome, {{ settings.login_type }} user {{ settings.user_name }}
                  </div>
                </n-alert>
                <n-alert
                  v-else-if="settings.enable_login && settings.enable_rate_limit"
                  type="warning"
                  class="status-alert"
                >
                  <div class="alert-content">
                    <span class="alert-icon">⚠️</span>
                    Not logged in - rate limited mode ({{ settings.rate_limit }})
                  </div>
                </n-alert>
              </section>

              <section class="content-surface">
                <router-view />
              </section>
            </main>

            <aside v-if="showAd" class="ad-column">
              <div class="ad-surface">
                <ins
                  class="adsbygoogle"
                  style="display:block"
                  :data-ad-client="settings.ad_client"
                  :data-ad-slot="settings.ad_slot"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                ></ins>
              </div>
            </aside>
          </div>
        </n-message-provider>
        <n-back-top class="back-top" />
      </n-spin>
    </n-config-provider>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

:global(body) {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: #020617;
  color: #e2e8f0;
  margin: 0;
}

.app-shell {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  color: #e2e8f0;
}

.background-gradient {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, rgba(99, 102, 241, 0.12), transparent 55%),
    radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.12), transparent 60%),
    radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.1), transparent 65%);
  z-index: -2;
}

.background-gradient::before,
.background-gradient::after {
  content: '';
  position: absolute;
  width: 540px;
  height: 540px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.18), transparent 70%);
  filter: blur(40px);
  z-index: -1;
}

.background-gradient::before {
  top: -120px;
  left: -160px;
}

.background-gradient::after {
  bottom: -180px;
  right: -120px;
}

.layout-shell {
  width: min(1200px, 100% - 48px);
  margin: 0 auto;
  padding: 80px 0 96px;
  display: flex;
  gap: 32px;
  align-items: stretch;
}

.ad-column {
  flex: 0 0 220px;
  display: flex;
  align-items: flex-start;
}

.ad-surface {
  width: 100%;
  padding: 20px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 60px rgba(8, 47, 73, 0.35);
}

.ad-surface ins {
  display: block;
  width: 100%;
  min-height: 260px;
}

.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 24px 28px;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(8, 47, 73, 0.35);
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-icon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #f8fafc;
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.5);
}

.brand-copy h1 {
  margin: 0;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.4px;
}

.brand-copy p {
  margin: 4px 0 0;
  color: #cbd5f5;
  font-size: 14px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.action-btn {
  --n-height: 38px;
  --n-padding: 0 18px;
  --n-border-radius: 999px;
  --n-font-size: 14px;
  --n-border: 1px solid transparent;
  --n-color: rgba(148, 163, 184, 0.12);
  --n-color-hover: rgba(148, 163, 184, 0.24);
  --n-color-pressed: rgba(148, 163, 184, 0.32);
  --n-text-color: #e2e8f0;
  --n-text-color-hover: #ffffff;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn.n-button--primary-type {
  --n-color: rgba(99, 102, 241, 0.95);
  --n-color-hover: rgba(79, 70, 229, 1);
  --n-color-pressed: rgba(55, 48, 163, 1);
  --n-text-color: #f8fafc;
  --n-text-color-hover: #f8fafc;
  --n-border: none;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
}

.nav-card {
  border-radius: 20px;
  padding: 20px 24px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(18px);
}

.nav-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.nav-btn {
  --n-height: 48px;
  --n-border-radius: 16px;
  --n-padding: 0 20px;
  --n-font-size: 15px;
  --n-color: rgba(148, 163, 184, 0.14);
  --n-color-hover: rgba(99, 102, 241, 0.18);
  --n-color-pressed: rgba(79, 70, 229, 0.25);
  --n-text-color: #f8fafc;
  --n-text-color-hover: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.promo-area {
  border-radius: 22px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(18px);
  padding: 24px;
}

.promo-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  text-decoration: none;
  color: inherit;
}

.promo-copy {
  flex: 1;
  min-width: 220px;
}

.promo-copy .eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.18);
  color: #cbd5f5;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}

.promo-copy h2 {
  margin: 12px 0 8px;
  font-family: 'Playfair Display', 'Inter', serif;
  font-size: 22px;
  font-weight: 600;
}

.promo-copy p {
  margin: 0;
  color: #cbd5f5;
  line-height: 1.6;
  max-width: 480px;
}

.promo-banner img {
  flex: 0 0 240px;
  width: 240px;
  height: 96px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.45);
  background: rgba(148, 163, 184, 0.08);
}

.ad-placeholder {
  border-radius: 20px;
  border: 1px dashed rgba(148, 163, 184, 0.26);
  background: rgba(15, 23, 42, 0.55);
  padding: 16px;
  min-height: 110px;
}

#my-ad-slot {
  min-height: 90px;
  width: 100%;
}

.status-area {
  display: grid;
  gap: 12px;
}

.status-alert {
  --n-border-radius: 16px;
  --n-padding: 16px 18px;
  --n-font-size: 14px;
}

.status-alert :deep(.n-alert-body) {
  align-items: center;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.alert-icon {
  font-size: 18px;
}

.content-surface {
  border-radius: 26px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  background: rgba(10, 21, 41, 0.85);
  backdrop-filter: blur(26px);
  padding: 36px;
  box-shadow: 0 25px 70px rgba(8, 47, 73, 0.45);
}

.back-top {
  --n-color: rgba(30, 41, 59, 0.85);
  --n-color-hover: rgba(79, 70, 229, 0.7);
  --n-icon-color: #f8fafc;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.app-loading {
  --n-color: rgba(15, 23, 42, 0.88);
  --n-text-color: #e2e8f0;
}

.btn-icon {
  font-size: 18px;
}

@media (max-width: 1100px) {
  .layout-shell {
    flex-direction: column;
    padding: 64px 0 80px;
  }

  .ad-column {
    display: none;
  }
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .promo-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .promo-banner img {
    width: 100%;
    height: auto;
  }

  .content-surface {
    padding: 24px;
  }
}
</style>
