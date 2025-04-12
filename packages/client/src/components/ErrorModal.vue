<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container error-container" @click.stop>
      <h3>信息不完整</h3>
      <p>{{ message }}</p>
      <div class="error-actions">
        <button @click="$emit('close')" class="action-btn error-btn">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  emits: ['close']
};
</script>

<style scoped>
.error-container {
  max-width: 320px;
}

.error-container h3 {
  margin-top: 0;
  text-align: center;
  color: var(--error-color);
  margin-bottom: 15px;
}

.error-container p {
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  justify-content: center;
}

.action-btn {
  color: var(--text-color);
  border-radius: 18px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  background-color: white;
}

.error-btn {
  border-color: var(--primary-color);
  background-color: rgba(74, 123, 255, 0.08);
  box-shadow: 0 2px 4px rgba(74, 123, 255, 0.15);
  padding: 10px 30px;
}

.error-btn:active {
  background-color: rgba(74, 123, 255, 0.15);
}
</style>
