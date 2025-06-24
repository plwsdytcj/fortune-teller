<script setup>
import { NSpin, NButton, useMessage } from 'naive-ui'
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from 'vue-router'
import { useStorage } from '@vueuse/core'

const state_jwt = useStorage('jwt')
const API_BASE = import.meta.env.VITE_API_BASE || "";
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const message = useMessage();

onMounted(async () => {
    if (route.path === '/login/github') {
        loading.value = true;
        try {
            const response = await fetch(`${API_BASE}/api/v1/oauth`, {
                method: "POST",
                body: JSON.stringify({
                    login_type: "github",
                    code: route.query.code,
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            if (!response.ok) {
                message.error(`${response.status} ${await response.text()}` || "登录失败");
            }
            let res = await response.json();
            state_jwt.value = res;
            window.location.href = "/";
        } catch (error) {
            console.error(error);
            message.error(`登录失败: ${error.message || "未知错误"}`);
        }
        finally {
            loading.value = false;
        }
    }
})

const onGithubLogin = async () => {
    try {
        loading.value = true;
        const response = await fetch(`${API_BASE}/api/v1/login?login_type=github&redirect_url=${window.location.origin}/login/github`, {
            method: "GET",
        });
        if (!response.ok) {
            message.error(`${response.status} ${await response.text()}` || "登录失败");
        }
        let res = await response.json();
        window.location.href = res;
    } catch (error) {
        console.error(error);
        message.error(error.message || "登录失败");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-container">
        <n-spin size="large" description="正在登录..." :show="loading">
            <div class="button-stack">
                <n-button type="primary" class="themed-button-primary login-button" block strong @click="onGithubLogin">Github 登录</n-button>
                <n-button type="default" class="themed-button-secondary login-button" block strong @click="router.push('/')">返回主页</n-button>
            </div>
        </n-spin>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 80vh; /* Take up most of the viewport height */
    padding: 20px;
}

.button-stack {
    display: flex;
    flex-direction: column;
    gap: 15px; /* Spacing between buttons */
    width: 100%;
    max-width: 300px; /* Max width for login buttons */
}

.login-button {
    font-family: "Georgia", serif;
    padding: 10px 0; /* Make buttons a bit taller */
    font-size: 1.1em;
}

/* Primary button is largely handled by global styles + themeOverrides */
.themed-button-primary {
    /* themeOverrides in App.vue: primaryColor: '#8B0000', textColorPrimary: '#E0E0E0' */
    border: 1px solid #FFD700; /* Gold border */
}
.themed-button-primary:hover {
    border-color: #A52A2A;
}

/* Secondary/Default button styling */
.themed-button-secondary {
  background-color: transparent !important;
  color: #FFD700 !important; /* Gold text */
  border: 1px solid #FFD700 !important; /* Gold border */
}
.themed-button-secondary:hover {
  background-color: #4a4a4a !important; /* Darker grey on hover */
  color: #FFD700 !important;
  border-color: #B8860B !important; /* Darker gold on hover */
}

/* The .n-spin description color is already set in App.vue themeOverrides */
</style>
