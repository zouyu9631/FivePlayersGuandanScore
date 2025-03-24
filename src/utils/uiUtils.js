/**
 * UI相关工具函数
 */

/**
 * 计算弹出对话框的最佳位置
 * @param {Object} clickPosition - 点击位置坐标 {x, y}
 * @param {Object} dialogSize - 对话框尺寸 {width, height}
 * @returns {Object} 计算后的位置 {left, top, transform}
 */
export function calculateDialogPosition(clickPosition, dialogSize = { width: 220, height: 140 }) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // 如果位置坐标存在
  if (clickPosition.x && clickPosition.y) {
    let left = Math.max(10, Math.min(windowWidth - dialogSize.width - 10, clickPosition.x - dialogSize.width / 2));
    let top;
    
    // 优化垂直位置计算逻辑
    if (clickPosition.y > windowHeight / 2) {
      // 点击位置在屏幕下半部分，显示在上方
      top = Math.max(10, clickPosition.y - dialogSize.height - 10);
    } else {
      // 点击位置在屏幕上半部分，显示在下方
      top = Math.min(windowHeight - dialogSize.height - 10, clickPosition.y + 10);
    }
    
    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      transform: 'none'
    };
  }
  
  // 默认居中
  return {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  };
}

/**
 * 添加触觉反馈（如果设备支持）
 * @param {string} style - 反馈强度 ('light', 'medium', 'heavy')
 */
export function addHapticFeedback(style = 'light') {
  if (window.navigator && window.navigator.vibrate) {
    switch (style) {
      case 'light': 
        window.navigator.vibrate(10);
        break;
      case 'medium': 
        window.navigator.vibrate(20);
        break;
      case 'heavy': 
        window.navigator.vibrate([10, 10, 20]);
        break;
      default:
        window.navigator.vibrate(10);
    }
  }
}
