/**
 * 修复移动端触摸事件和拖拽相关问题
 */

export function setupTouchEventFix() {
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
  
  // 禁用拖拽元素上的默认行为
  document.addEventListener('dragover', function(e) {
    e.preventDefault();
  }, false);
  
  // 优化拖拽结束后的行为
  document.addEventListener('drop', function(e) {
    e.preventDefault();
    
    setTimeout(() => {
      const ghosts = document.querySelectorAll('.ghost, .ghost-empty, .sortable-ghost');
      ghosts.forEach(ghost => {
        if (ghost.parentNode) {
          ghost.style.display = 'none';
          try {
            ghost.parentNode.removeChild(ghost);
          } catch (err) {
            console.log('清理ghost元素出错', err);
          }
        }
      });
    }, 0);
  }, false);
  
  // 防止触摸拖拽时页面滚动
  document.addEventListener('touchmove', function(e) {
    if (document.querySelector('.sortable-drag')) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // 处理拖拽中的布局问题
  document.addEventListener('dragstart', function() {
    document.body.classList.add('dragging-active');
  });
  
  document.addEventListener('dragend', function() {
    document.body.classList.remove('dragging-active');
    
    setTimeout(() => {
      const ghosts = document.querySelectorAll('.ghost, .ghost-empty, .sortable-ghost');
      ghosts.forEach(ghost => {
        if (ghost.parentNode) {
          ghost.style.display = 'none';
        }
      });
    }, 0);
  });
}
