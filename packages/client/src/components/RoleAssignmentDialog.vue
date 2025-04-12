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
    
    const handleRemoveOrClose = () => {
      if (isEmperor.value || isGuard.value) {
        emit('remove', props.player);
      } else {
        emit('close');
      }
    };
    
    const dialogStyle = ref({});
    
    onMounted(() => {
      dialogStyle.value = calculateDialogPosition(props.position);
    });
    
    return {
      isEmperor,
      isGuard,
      handleRemoveOrClose,
      dialogStyle,
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
  width: 55px;
  height: 55px;
  border-radius: 50%;
  padding: 0;
  transition: all 0.2s ease;
  background-color: #f5f5f5;
  border: none;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.role-btn:active {
  transform: scale(0.95);
}

.role-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  text-align: center;
  width: auto;
  height: auto;
  line-height: 1;
}

.emperor-btn {
  background-color: rgba(255, 193, 7, 0.1);
  color: var(--emperor-color);
}

.emperor-btn.active {
  background-color: rgba(255, 193, 7, 0.3);
  box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);
}

.guard-btn {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--guard-color);
}

.guard-btn.active {
  background-color: rgba(33, 150, 243, 0.3);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.remove-role-btn {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--error-color);
}

@media (max-width: 340px) {
  .role-btn {
    width: 45px;
    height: 45px;
  }
  
  .role-icon {
    font-size: 20px;
  }
}
</style>
