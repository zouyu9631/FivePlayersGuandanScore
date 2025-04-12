export function calculateDialogPosition(clickPosition, dialogSize = { width: 220, height: 140 }) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  if (clickPosition.x && clickPosition.y) {
    let left = Math.max(10, Math.min(windowWidth - dialogSize.width - 10, clickPosition.x - dialogSize.width / 2));
    let top;
    
    if (clickPosition.y > windowHeight / 2) {
      top = Math.max(10, clickPosition.y - dialogSize.height - 10);
    } else {
      top = Math.min(windowHeight - dialogSize.height - 10, clickPosition.y + 10);
    }
    
    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      transform: 'none'
    };
  }
  
  return {
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  };
}

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
