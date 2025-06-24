<script setup>
import {
  NGrid, NGi, NSpace, NAlert, NButton, NMessageProvider, NPageHeader,
  NConfigProvider, NGlobalStyle, NBackTop, zhCN, darkTheme, NSpin, enUS, dateEnUS, dateZhCN
} from 'naive-ui'
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { useIsMobile } from './utils/composables'
import { useGlobalState } from './store'
import LanguageSwitcher from './components/LanguageSwitcher.vue';
import { useI18n } from 'vue-i18n'

const { isDark, toggleDark } = useGlobalState()
const state_jwt = useStorage('jwt')
const isMobile = useIsMobile()
const { locale } = useI18n()

// Updated themeOverrides for "oriental and mysterious" style
const themeOverrides = {
  common: {
    primaryColor: '#8B0000', // Dark Red
    primaryColorHover: '#A52A2A', // Brown (for a slightly lighter hover)
    primaryColorPressed: '#6F0000', // Darker Red
    // It's good practice to also define textColor and other relevant colors
    // but Naive UI's darkTheme will handle many aspects.
    // We will use global CSS for more comprehensive control.
  },
  Button: {
    // Example: Define textColor for primary buttons if needed
    // textColorPrimary: '#FFD700' // Gold text on Dark Red button
    // This might need to be #FFFFFF or a light grey for readability
    textColorPrimary: '#E0E0E0',
    // textColorHoverPrimary: '#FFD700',
    // textColorPressedPrimary: '#FFD700',
    // textColorFocusPrimary: '#FFD700',

    // For default type buttons (not primary)
    // textColor: '#E0E0E0', // Default text color for buttons
    // textColorHover: '#FFD700',
    // border: "1px solid #FFD700", // Gold border for default buttons
    // borderColorHover: "#FFD700",
  },
  PageHeader: {
    titleTextColor: '#FFD700', // Gold for page titles
    // backColor: '#FFD700' // Color for back icon
  },
  Spin: {
    textColor: '#FFD700' // Gold for loading text
  },
  Alert: { // Default alert styling might clash, let's try to make it fit
    titleTextColorInfo: '#E0E0E0',
    iconColorInfo: '#FFD700',
    contentTextColorInfo: '#E0E0E0',
    colorInfo: '#004040', // Dark Teal background for info alerts
    titleTextColorSuccess: '#E0E0E0',
    iconColorSuccess: '#FFD700',
    contentTextColorSuccess: '#E0E0E0',
    colorSuccess: '#004040', // Dark Teal for success (can differentiate later if needed)
    titleTextColorWarning: '#1A1A1A',
    iconColorWarning: '#8B0000',
    contentTextColorWarning: '#1A1A1A',
    colorWarning: '#FFD700', // Gold background for warning, dark text
    titleTextColorError: '#E0E0E0',
    iconColorError: '#FFD700',
    contentTextColorError: '#E0E0E0',
    colorError: '#8B0000', // Dark red for error
  }
  // Add other component overrides as needed, e.g., Card, Input, Select
}

// Force dark theme for our new style
const theme = computed(() => darkTheme)
// Watch isDark and if it becomes false, set it back to true.
// This ensures our "oriental and mysterious" theme (which is dark) remains active.
watch(isDark, (newVal) => {
  if (!newVal) {
    toggleDark(); // This will set isDark back to true
  }
});

onMounted(() => {
  if (!isDark.value) {
    toggleDark(); // Ensure dark mode is on by default for this theme
  }
});

const naiveLocale = computed(() => {
  return locale.value === 'zh' ? zhCN : enUS
})
const naiveDateLocale = computed(() => {
  return locale.value === 'zh' ? dateZhCN : dateEnUS
})

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
});
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides" :locale="naiveLocale" :date-locale="naiveDateLocale">
    <n-spin description="加载中..." :show="loading">
      <n-global-style />
      <n-message-provider>
        <LanguageSwitcher />
        <n-grid :x-gap="12" :cols="isMobile ? 4 : 6">
          <n-gi :span="1">
            <div class="side" v-if="showAd">
              <ins class="adsbygoogle" style="display:block" :data-ad-client="settings.ad_client"
                :data-ad-slot="settings.ad_slot" data-ad-format="auto" data-full-width-responsive="true"></ins>
            </div>
          </n-gi>
          <n-gi :span="4">
            <div class="main">
              <n-page-header :subtitle="isMobile ? '' : ''">
                <template #title>
                  <h3>Chinese Fortune Teller</h3>
                </template>
                <template #extra>
                  <n-space>
                    <div v-if="settings.enable_login">
                      <n-button v-if="settings.user_name" @click="logOut">登出</n-button>
                      <n-button v-else type="primary" @click="router.push('/login')">登录</n-button>
                    </div>
                    <n-button @click="router.push('/')">Main Page</n-button>
                    <n-button @click="router.push('/settings')">Settings</n-button>
                    <n-button @click="toggleDark()">
                      {{ isDark ? 'Light' : 'Dark' }}
                    </n-button>
                  </n-space>
                </template>
                <template #footer>
                  <n-alert v-if="settings.user_name" type="success">
                    你好, {{ settings.login_type }} 用户 {{ settings.user_name }}
                  </n-alert>
                  <n-alert v-else-if="settings.enable_login && settings.enable_rate_limit" type="warning">
                    当前未登录, 处于限流模式 ({{ settings.rate_limit }})
                  </n-alert>
                </template>
              </n-page-header>
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
      <n-back-top />
    </n-spin>
  </n-config-provider>
</template>

<style>
/* Global styles - not scoped */
body, #app {
  background-color: #1A1A1A !important; /* Very Dark Grey */
  color: #E0E0E0 !important; /* Light Grey / Off-White */
  font-family: "Helvetica Neue", "Arial", sans-serif; /* Body font */

  /* Subtle repeating pattern for background */
  background-image:
    linear-gradient(135deg, rgba(255,215,0,0.02) 25%, transparent 25%),
    linear-gradient(225deg, rgba(255,215,0,0.02) 25%, transparent 25%),
    linear-gradient(45deg, rgba(255,215,0,0.02) 25%, transparent 25%),
    linear-gradient(315deg, rgba(255,215,0,0.02) 25%, #1A1A1A 25%);
  background-size: 40px 40px; /* Size of the pattern */
  background-position: 0 0, 20px 20px, 20px 20px, 0 0; /* Offset for diamond pattern */
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Georgia", serif; /* Heading font */
  color: #B8860B; /* DarkGoldenRod for headings */
}

/* Override Naive UI's default background for the config provider if necessary */
.n-config-provider {
  background-color: #1A1A1A !important;
}

/* Specific overrides if themeOverrides are not enough */
.n-page-header .n-page-header__title h3 {
  color: #FFD700 !important; /* Gold for page title - ensuring it overrides */
  font-family: "Georgia", serif;
}

/* Making sure buttons in the header also adopt the new style */
.n-page-header .n-button {
  /* Default button styling - can be refined */
  /* background-color: transparent !important; */
  /* border: 1px solid #FFD700 !important; */
  /* color: #FFD700 !important; */
}

.n-page-header .n-button:hover {
  /* background-color: #8B0000 !important; */
  /* color: #FFD700 !important; */
}

/* Custom styling for the main content area if needed */
.main {
  /* background-color: #2C2C2C; */ /* Slightly lighter shade for content background if desired */
  /* padding: 20px; */ /* Add some padding */
  /* border: 1px solid #FFD700; */ /* Example border */
}

</style>

<style scoped>
/* Scoped styles remain for component-specific layout */
.side {
  height: 100vh;
  /* background-color: #101010; */ /* Slightly different background for side ads if desired */
}

.main {
  height: 100vh;
  text-align: center;
}

.n-grid {
  height: 100%;
}

.n-gi {
  height: 100%;
}

.n-space {
  height: 100%;
}

.n-alert {
  text-align: center;
  margin-bottom: 10px;
  /* Naive UI theme overrides should handle alert styling, but can add more here if needed */
}
</style>
