import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'
import i18n from './i18n'

registerSW({ immediate: true })
const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
