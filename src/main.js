import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { setupTouchEventFix } from './utils/touchEventFix'
import { applyBrowserCompatibility } from './utils/browserCompatibility'

// 应用浏览器兼容性修复
applyBrowserCompatibility()

// 设置触摸事件修复
setupTouchEventFix()

createApp(App).mount('#app')
