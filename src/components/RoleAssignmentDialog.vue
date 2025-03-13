<template>
  <div class="role-selection-modal" @click="$emit('close')">
    <div class="role-selection-container" @click.stop>
      <h3>选择身份</h3>
      <p>为玩家 <strong>{{ player }}</strong> 分配身份:</p>
      <div class="role-buttons">
        <button @click="$emit('assign', 'emperor', player)" :class="{ 'active': isEmperor }">
          设为皇帝 👑
        </button>
        <button @click="$emit('assign', 'guard', player)" :class="{ 'active': isGuard }">
          设为侍卫 🛡️
        </button>
        <button @click="$emit('remove', player)" class="remove-role-btn" :disabled="!hasRole">
          移除身份
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    player: String,
    currentEmperor: String,
    currentGuard: String
  },
  
  emits: ['close', 'assign', 'remove'],
  
  setup(props) {
    const isEmperor = computed(() => props.player === props.currentEmperor);
    const isGuard = computed(() => props.player === props.currentGuard);
    const hasRole = computed(() => isEmperor.value || isGuard.value);
    
    return {
      isEmperor,
      isGuard,
      hasRole
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
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.role-selection-container h3 {
  margin-top: 0;
  text-align: center;
}

.role-selection-container p {
  text-align: center;
  margin-bottom: 20px;
}

.role-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.role-buttons button {
  padding: 12px;
  font-size: 16px;
  transition: transform 0.1s;
}

.role-buttons button:active {
  transform: scale(0.98);
}

.role-buttons .active {
  background-color: #2196F3;
  border: 2px solid #0b7dda;
}

.remove-role-btn {
  background-color: #f44336;
  margin-top: 10px;
}

.remove-role-btn:disabled {
  background-color: #cccccc;
}
</style>
