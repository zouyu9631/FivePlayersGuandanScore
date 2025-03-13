/**
 * 浏览器兼容性修复
 * 处理不同浏览器下的样式和行为差异
 */

export function applyBrowserCompatibility() {
  // 处理iOS设备上的触摸反馈问题
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.documentElement.style.webkitTapHighlightColor = 'transparent';
    
    // 修复iOS设备上的视口高度问题
    const fixViewportHeight = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', fixViewportHeight);
    fixViewportHeight();
  }
  
  // 处理高对比度模式
  if (window.matchMedia && window.matchMedia('(forced-colors: active)').matches) {
    document.body.classList.add('high-contrast-mode');
  }
}
