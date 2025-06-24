<script setup>
import { NCard, NFormItemRow, NSwitch, NInput } from 'naive-ui'
import { useGlobalState } from '../store'

const { customOpenAISettings } = useGlobalState()

</script>

<template>
    <div class="settings-container">
        <div class="settings-header">
            <div class="header-ornament">◆ ◇ ◆</div>
            <h2 class="settings-title">Settings</h2>
            <div class="header-ornament">◆ ◇ ◆</div>
        </div>
        
        <n-card class="mystical-settings-card">
            <div class="settings-content">
                <n-form-item-row label="Enable Custom API Settings" class="mystical-form-item">
                    <n-switch v-model:value="customOpenAISettings.enable" :round="false" class="mystical-switch" />
                </n-form-item-row>
                
                <n-form-item-row label="API Base URL" class="mystical-form-item">
                    <n-input v-model:value="customOpenAISettings.baseUrl" class="mystical-input" />
                </n-form-item-row>
                
                <n-form-item-row label="API Key" class="mystical-form-item">
                    <n-input v-model:value="customOpenAISettings.apiKey" type="password" show-password-on="click" class="mystical-input" />
                </n-form-item-row>
                
                <n-form-item-row label="Model" class="mystical-form-item">
                    <n-input v-model:value="customOpenAISettings.model" class="mystical-input" />
                </n-form-item-row>
            </div>
        </n-card>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.settings-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
}

.settings-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.header-ornament {
    color: #d4af37;
    font-size: 1.2rem;
    opacity: 0.8;
}

.settings-title {
    font-family: 'Inter', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(45deg, #d4af37, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
}

.mystical-settings-card {
    background: rgba(0, 0, 0, 0.4) !important;
    border: 1px solid rgba(212, 175, 55, 0.3) !important;
    backdrop-filter: blur(15px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(212, 175, 55, 0.15);
    transition: all 0.3s ease;
}

.mystical-settings-card:hover {
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 0 12px 40px rgba(212, 175, 55, 0.25);
}

.settings-content {
    padding: 1rem;
}

.mystical-form-item {
    margin-bottom: 1.5rem;
    color: #d4af37;
}

.mystical-form-item :deep(.n-form-item-row__label) {
    color: #d4af37 !important;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
}

.mystical-input {
    --n-border: 1px solid rgba(212, 175, 55, 0.3);
    --n-border-hover: 1px solid rgba(212, 175, 55, 0.5);
    --n-border-focus: 1px solid #d4af37;
    --n-color: rgba(0, 0, 0, 0.3);
    --n-text-color: #d4af37;
    --n-placeholder-color: rgba(212, 175, 55, 0.5);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    transition: all 0.3s ease;
}

.mystical-input:hover {
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
}

.mystical-switch {
    --n-rail-color: rgba(212, 175, 55, 0.2);
    --n-rail-color-active: #d4af37;
    --n-button-color: #ffd700;
    --n-button-box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .settings-container {
        padding: 1rem;
    }
    
    .settings-title {
        font-size: 1.5rem;
    }
    
    .header-ornament {
        font-size: 1rem;
    }
}
</style>