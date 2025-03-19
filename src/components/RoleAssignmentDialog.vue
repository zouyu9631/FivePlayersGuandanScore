<template>
  <div class="role-selection-modal" @click="$emit('close')">
    <div class="role-selection-container" 
         @click.stop
         :style="dialogStyle">
      <p>为 <strong>{{ player }}</strong> 分配身份:</p>
      
      <div class="role-buttons">
        <button 
          @click="$emit('assign', 'emperor', player)" 
          :class="{ 'active': isEmperor }"
          class="role-btn emperor-btn">
          <span class="role-icon">👑</span>
        </button>
        
        <button 
          @click="$emit('assign', 'guard', player)" 
          :class="{ 'active': isGuard }"
          class="role-btn guard-btn">
          <span class="role-icon">🛡️</span>
        </button>
        
        <button 
          @click="handleRemoveOrClose" 
          class="role-btn remove-role-btn">
          <span class="role-icon">❌</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';

export default {
  props: {
    player: String,
    currentEmperor: String,
    currentGuard: String,
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    }
  },
  
  emits: ['close', 'assign', 'remove'],
  
  setup(props, { emit }) {
    const isEmperor = computed(() => props.player === props.currentEmperor);
    const isGuard = computed(() => props.player === props.currentGuard);
    const hasRole = computed(() => isEmperor.value || isGuard.value);
    
    // 处理移除或关闭
    const handleRemoveOrClose = () => {
      if (hasRole.value) {
        emit('remove', props.player);
      } else {
        emit('close');
      }
    };
    
    // 计算对话框位置
    const dialogStyle = ref({});
    
    onMounted(() => {
      calculatePosition();
    });
    
    const calculatePosition = () => {
      // 更准确的容器尺寸估算
      const dialogWidth = 220;
      const dialogHeight = 140; // 减小高度估计值，更符合实际
      
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // 如果位置坐标存在
      if (props.position.x && props.position.y) {
        let left = Math.max(10, Math.min(windowWidth - dialogWidth - 10, props.position.x - dialogWidth / 2));
        let top;
        
        // 优化垂直位置计算逻辑
        if (props.position.y > windowHeight / 2) {
          // 点击位置在屏幕下半部分，显示在上方
          top = Math.max(10, props.position.y - dialogHeight - 10);
        } else {
          // 点击位置在屏幕上半部分，显示在下方
          top = Math.min(windowHeight - dialogHeight - 10, props.position.y + 10);
        }
        
        dialogStyle.value = {
          position: 'absolute',
          left: `${left}px`,
          top: `${top}px`,
          transform: 'none'
        };
      }
    };
    
    return {
      isEmperor,
      isGuard,
      hasRole,
      dialogStyle,
      handleRemoveOrClose
    };
  }
};
</script>

<style scoped>
.role-selection-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.role-selection-container {
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  width: 80%;
  max-width: 220px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.role-selection-container p {
  text-align: center;
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 15px;
}

.role-buttons {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.role-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;  /* 从60px减小到55px */
  height: 55px; /* 从60px减小到55px */
  border-radius: 50%;
  padding: 0;
  transition: all 0.2s ease; /* 简化transition属性 */
  background-color: #f5f5f5;
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.role-btn:active {
  transform: scale(0.95);
}

.role-icon {
  font-size: 22px; /* 从24px减小到22px */
}

/* 皇帝按钮 - 使用与排序界面相同的底色 */
.emperor-btn {
  background-color: #fff8e1;
  border-color: #ffe082;
}

.emperor-btn.active {
  background-color: #ffecb3;
  border-color: #ffd54f;
}

/* 侍卫按钮 - 使用与排序界面相同的底色 */
.guard-btn {
  background-color: #e8f5e9;
  border-color: #a5d6a7;
}

.guard-btn.active {
  background-color: #c8e6c9;
  border-color: #81c784;
}

/* 移除按钮 */
.remove-role-btn {
  background-color: #ffebee;
  border-color: #ffcdd2;
}

.remove-role-btn:hover {
  background-color: #ffcdd2;
}

@media (max-width: 340px) {
  .role-btn {
    width: 45px;  /* 从50px减小到45px */
    height: 45px; /* 从50px减小到45px */
  }
  
  .role-icon {
    font-size: 20px; /* 减小图标尺寸 */
  }
}

/* 合并重复的样式规则 */
.emperor-btn, .guard-btn, .remove-role-btn {
  border: 1px solid transparent;
}

.emperor-btn.active, .guard-btn.active {
  border-width: 2px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
