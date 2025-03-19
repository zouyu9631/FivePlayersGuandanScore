<template>
  <div class="error-modal" @click="$emit('close')">
    <div class="error-container" @click.stop>
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
.error-modal {
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

.error-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.error-container h3 {
  margin-top: 0;
  text-align: center;
  color: #f44336;
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
  background-color: #4a7bff;
  padding: 10px 30px;
}
</style>
