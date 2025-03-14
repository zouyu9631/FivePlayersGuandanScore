<template>
  <div v-if="visible" class="card-selector-overlay" @click="closeSelector">
    <div class="card-selector" @click.stop>
      <h3>选择叫牌</h3>
      <div class="card-grid">
        <div v-for="(suit, suitIndex) in cardSuits" :key="suitIndex" class="card-suit-group">
          <div v-for="(value, valueIndex) in cardValues" :key="`${suitIndex}-${valueIndex}`" 
               class="card-option" 
               :class="{ 'red-card': suit === '♥' || suit === '♦' }"
               @click="handleCardSelect(suit, value)">
            {{ getCardDisplay(suit, value) }}
          </div>
        </div>
        <div class="card-option joker" @click="handleCardSelect('joker', 'small')">🃏</div>
      </div>
    </div>
  </div>
  <div v-else class="card-display">
    <div class="card-selection" @click="openSelector">
      <div class="selected-card">{{ selectedCard }}</div>
      <div class="card-hint">(点击更换叫牌)</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  props: {
    modelValue: {
      type: String,
      default: '🃏'
    }
  },
  
  emits: ['update:modelValue'],
  
  setup(props, { emit }) {
    const visible = ref(false);
    const selectedCard = ref(props.modelValue);
    
    const cardSuits = ['♠', '♥', '♦', '♣'];
    const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // 监听props变化同步内部状态
    watch(() => props.modelValue, (newValue) => {
      selectedCard.value = newValue;
    });

    const getCardDisplay = (suit, value) => {
      return `${suit}${value}`;
    };
    
    // 打开选择器
    const openSelector = () => {
      visible.value = true;
    };
    
    // 关闭选择器
    const closeSelector = () => {
      visible.value = false;
    };

    // 处理牌选择
    const handleCardSelect = (suit, value) => {
      let card;
      if (suit === 'joker') {
        card = '🃏';
      } else {
        card = `${suit}${value}`;
      }
      selectedCard.value = card;
      emit('update:modelValue', card);
      visible.value = false;
    };

    return {
      visible,
      selectedCard,
      cardSuits,
      cardValues,
      getCardDisplay,
      openSelector,
      closeSelector,
      handleCardSelect
    };
  }
};
</script>

<style scoped>
.card-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.card-selector {
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.card-option {
  padding: 12px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.card-option:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.red-card {
  color: #d32f2f;
}

/* 从RoleSelector.vue合并的样式 */
.card-display {
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
  .card-display {
    padding: 15px;
  }
  
  .selected-card {
    font-size: 42px;
  }
}
</style>
