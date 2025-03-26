<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container error-container" @click.stop>
      <h3>信息不完整</h3>
      <p>{{ message }}</p>
      <div class="error-actions">
        <button @click="$emit('close')" class="error-btn">确定</button>
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

.error-btn {
  background-color: var(--primary-color);
  padding: 10px 30px;
}
</style>
