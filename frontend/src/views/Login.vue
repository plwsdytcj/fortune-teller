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
                message.error(`${response.status} ${await response.text()}` || "Login failed");
            }
            let res = await response.json();
            state_jwt.value = res;
            window.location.href = "/";
        } catch (error) {
            console.error(error);
            message.error(`Login failed: ${error.message || "Unknown error"}`);
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
            message.error(`${response.status} ${await response.text()}` || "Login failed");
        }
        let res = await response.json();
        window.location.href = res;
    } catch (error) {
        console.error(error);
        message.error(error.message || "Login failed");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="header-ornament">◆ ◇ ◆</div>
                <h2 class="login-title">Login</h2>
                <div class="header-ornament">◆ ◇ ◆</div>
            </div>
            
            <n-spin size="large" description="Logging in..." :show="loading" class="mystical-spin">
                <div class="login-content">
                    <div class="login-description">
                        <p>Please choose a login method to get a better divination experience</p>
                    </div>
                    
                    <div class="login-buttons">
                        <n-button type="primary" block strong @click="onGithubLogin" class="mystical-login-btn github-btn">
                            <span class="btn-icon">🐙</span>
                            Login with GitHub
                        </n-button>
                        
                        <n-button type="secondary" block strong @click="router.push('/')" class="mystical-login-btn back-btn">
                            <span class="btn-icon">🏠</span>
                            Back to Home
                        </n-button>
                    </div>
                </div>
            </n-spin>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
    font-family: 'Inter', sans-serif;
}

.login-card {
    width: 100%;
    max-width: 400px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(212, 175, 55, 0.3);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
    padding: 2rem;
    transition: all 0.3s ease;
}

.login-card:hover {
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 0 12px 40px rgba(212, 175, 55, 0.25);
    transform: translateY(-2px);
}

.login-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.header-ornament {
    color: #d4af37;
    font-size: 1.2rem;
    opacity: 0.8;
}

.login-title {
    font-family: 'Inter', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    background: linear-gradient(45deg, #d4af37, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.mystical-spin {
    --n-color: rgba(212, 175, 55, 0.8);
}

.login-content {
    text-align: center;
}

.login-description {
    margin-bottom: 2rem;
    color: rgba(212, 175, 55, 0.8);
    font-size: 1rem;
    line-height: 1.6;
}

.login-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.mystical-login-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 1rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 48px;
}

.github-btn {
    background: linear-gradient(45deg, #333, #555) !important;
    border: 1px solid rgba(212, 175, 55, 0.3) !important;
    color: #d4af37 !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.github-btn:hover {
    background: linear-gradient(45deg, #444, #666) !important;
    border-color: rgba(212, 175, 55, 0.5) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.back-btn {
    background: rgba(212, 175, 55, 0.1) !important;
    border: 1px solid rgba(212, 175, 55, 0.3) !important;
    color: #d4af37 !important;
    backdrop-filter: blur(10px);
}

.back-btn:hover {
    background: rgba(212, 175, 55, 0.2) !important;
    border-color: rgba(212, 175, 55, 0.5) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
}

.btn-icon {
    font-size: 1.2rem;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .login-container {
        padding: 1rem;
    }
    
    .login-card {
        padding: 1.5rem;
    }
    
    .login-title {
        font-size: 1.5rem;
    }
    
    .header-ornament {
        font-size: 1rem;
    }
}
</style>