<template>
  <div class="role-section">
    <div class="card-selection" @click="$emit('update:showCardSelector', true)">
      <div class="selected-card">{{ calledCard }}</div>
      <div class="card-hint">(点击更换叫牌)</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    calledCard: String
  },
  
  emits: ['update:showCardSelector', 'update:calledCard'],
  
  setup(props, { emit }) {
    return {};
  }
};
</script>

<style scoped>
.role-section {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 15px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-selection {
  text-align: center;
  cursor: pointer;
}

.selected-card {
  font-size: 48px;
  margin-bottom: 5px;
}

.card-hint {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .role-section {
    padding: 15px;
  }
  
  .selected-card {
    font-size: 42px;
  }
}
</style>
