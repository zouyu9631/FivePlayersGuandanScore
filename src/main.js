import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { setupTouchEventFix } from './utils/touchEventFix'
import { applyBrowserCompatibility } from './utils/browserCompatibility'

applyBrowserCompatibility()
setupTouchEventFix()

createApp(App).mount('#app')
