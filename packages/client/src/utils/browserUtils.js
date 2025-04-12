import { safeExecute, logError } from './errorUtils';

export function applyBrowserCompatibility() {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.documentElement.style.webkitTapHighlightColor = 'transparent';
    
    const fixViewportHeight = () => {
      safeExecute(() => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      }, [], null, 'iOS视口高度修复');
    };
    
    window.addEventListener('resize', fixViewportHeight);
    window.addEventListener('orientationchange', fixViewportHeight);
    fixViewportHeight();
  }
  
  safeExecute(() => {
    if (window.matchMedia && window.matchMedia('(forced-colors: active)').matches) {
      document.body.classList.add('high-contrast-mode');
    }
  }, [], null, '高对比度模式检测');
}

export function setupTouchEvents() {
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
  
  document.addEventListener('dragover', e => e.preventDefault(), false);
  
  document.addEventListener('dragstart', () => {
    document.body.classList.add('dragging-active');
  });
  
  document.addEventListener('dragend', () => {
    document.body.classList.remove('dragging-active');
    cleanupGhostElements();
  });
  
  document.addEventListener('drop', e => {
    e.preventDefault();
    cleanupGhostElements();
  }, false);
  
  document.addEventListener('touchmove', e => {
    if (document.querySelector('.sortable-drag')) {
      e.preventDefault();
    }
  }, { passive: false });
}

function cleanupGhostElements() {
  safeExecute(() => {
    setTimeout(() => {
      const ghosts = document.querySelectorAll('.ghost, .ghost-empty, .sortable-ghost');
      ghosts.forEach(ghost => {
        if (ghost.parentNode) {
          ghost.style.display = 'none';
          try {
            ghost.parentNode.removeChild(ghost);
          } catch (err) {
            logError(err, '清理ghost元素出错');
          }
        }
      });
    }, 0);
  }, [], null, '清理拖拽元素');
}
