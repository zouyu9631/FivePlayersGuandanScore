import { createApp } from 'vue'
import App from './App.vue'
import './assets/theme.css'
import './assets/main.css'
import { applyBrowserCompatibility, setupTouchEvents } from './utils/browserUtils'

applyBrowserCompatibility()
setupTouchEvents()
createApp(App).mount('#app')
