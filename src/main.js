import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { applyBrowserCompatibility, setupTouchEvents } from './utils/browserUtils'

// 应用浏览器兼容性修复和触摸事件优化
applyBrowserCompatibility()
setupTouchEvents()

createApp(App).mount('#app')
