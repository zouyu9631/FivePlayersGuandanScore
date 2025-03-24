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
          <span class="role-icon">{{ ROLE_ICONS.EMPEROR }}</span>
        </button>
        
        <button 
          @click="$emit('assign', 'guard', player)" 
          :class="{ 'active': isGuard }"
          class="role-btn guard-btn">
          <span class="role-icon">{{ ROLE_ICONS.GUARD }}</span>
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
import { calculateDialogPosition } from '../utils/uiUtils';
import { ROLE_ICONS } from '../config/gameConfig';

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
      dialogStyle.value = calculateDialogPosition(props.position);
    });
    
    return {
      isEmperor,
      isGuard,
      hasRole,
      dialogStyle,
      handleRemoveOrClose,
      ROLE_ICONS
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
  background-color: var(--modal-overlay);
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
  background-color: var(--emperor-color);
  border-color: var(--emperor-color);
}

.emperor-btn.active {
  background-color: var(--emperor-active);
  border-color: var(--emperor-active);
}

/* 侍卫按钮 - 使用与排序界面相同的底色 */
.guard-btn {
  background-color: var(--guard-color);
  border-color: var(--guard-color);
}

.guard-btn.active {
  background-color: var(--guard-active);
  border-color: var(--guard-active);
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
