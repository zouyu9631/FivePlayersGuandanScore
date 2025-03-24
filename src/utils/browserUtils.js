/**
 * 浏览器兼容性和触摸事件优化工具
 */

// 应用浏览器兼容性修复
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

// 设置触摸事件优化
export function setupTouchEvents() {
  // 防止iOS长按菜单
  document.addEventListener('touchstart', function(e) {
    const target = e.target;
    if (
      target.classList.contains('drag-handle') || 
      target.closest('.drag-handle') ||
      target.classList.contains('drag-icon')
    ) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // 优化拖拽相关事件
  document.addEventListener('dragover', e => e.preventDefault(), false);
  
  // 处理拖拽中的布局问题
  document.addEventListener('dragstart', () => {
    document.body.classList.add('dragging-active');
  });
  
  document.addEventListener('dragend', () => {
    document.body.classList.remove('dragging-active');
    cleanupGhostElements();
  });
  
  // 拖拽结束后清理
  document.addEventListener('drop', e => {
    e.preventDefault();
    cleanupGhostElements();
  }, false);
  
  // 防止触摸拖拽时页面滚动
  document.addEventListener('touchmove', e => {
    if (document.querySelector('.sortable-drag')) {
      e.preventDefault();
    }
  }, { passive: false });
}

// 辅助函数：清理拖拽产生的ghost元素
function cleanupGhostElements() {
  setTimeout(() => {
    const ghosts = document.querySelectorAll('.ghost, .ghost-empty, .sortable-ghost');
    ghosts.forEach(ghost => {
      if (ghost.parentNode) {
        ghost.style.display = 'none';
        try {
          ghost.parentNode.removeChild(ghost);
        } catch (err) {
          console.error('清理ghost元素出错', err);
        }
      }
    });
  }, 0);
}
