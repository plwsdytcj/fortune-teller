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

const themeOverrides = {
  common: {
    primaryColor: '#16a34a', // A nice green color
    primaryColorHover: '#15803d',
    primaryColorPressed: '#166534',
  }
}

const theme = computed(() => isDark.value ? darkTheme : null)
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

<style scoped>
.side {
  height: 100vh;
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
}
</style>
