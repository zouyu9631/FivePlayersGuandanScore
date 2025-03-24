<template>
  <div v-if="visible" class="card-selector-overlay" @click="closeSelector">
    <div class="card-selector" @click.stop>
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
    <div class="round-info">第 {{ currentRound }} 局叫牌：</div>
    <div class="card-selection" @click="openSelector">
      <div class="selected-card" :class="{ 'red-card': isRedCard(selectedCard) }">
        {{ selectedCard }}
      </div>
      <div v-if="showHint" class="card-hint" @click.stop="dismissHint">(点击更换叫牌)</div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { isRedCard, getCardDisplay, CARD_SUITS, CARD_VALUES } from '../utils/cardUtils';
import { getItem, setItem } from '../utils/storageUtils';

export default {
  props: {
    modelValue: {
      type: String,
      default: '🃏'
    },
    currentRound: {
      type: Number,
      default: 1
    }
  },
  
  emits: ['update:modelValue'],
  
  setup(props, { emit }) {
    const visible = ref(false);
    const selectedCard = ref(props.modelValue);
    const showHint = ref(true);
    
    // 使用导入的卡牌常量，而不是本地定义
    const cardSuits = CARD_SUITS;
    const cardValues = CARD_VALUES;

    // 检查本地存储是否已展示过提示
    onMounted(() => {
      if (getItem('cardSelectorHintShown', false)) {
        showHint.value = false;
      }
    });

    // 监听modelValue变化同步内部状态
    watch(() => props.modelValue, (newValue) => {
      selectedCard.value = newValue;
    });
    
    // 打开/关闭选择器
    const openSelector = () => { visible.value = true; };
    const closeSelector = () => { visible.value = false; };

    // 隐藏提示
    const dismissHint = () => {
      showHint.value = false;
      setItem('cardSelectorHintShown', 'true');
    };

    // 处理牌选择
    const handleCardSelect = (suit, value) => {
      let card = suit === 'joker' ? '🃏' : getCardDisplay(suit, value);
      
      selectedCard.value = card;
      emit('update:modelValue', card);
      visible.value = false;
      
      if (showHint.value) dismissHint();
    };

    return {
      visible,
      selectedCard,
      showHint,
      cardSuits,
      cardValues,
      getCardDisplay,
      isRedCard,
      openSelector,
      closeSelector,
      handleCardSelect,
      dismissHint
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
  padding: 20px 10px;
  width: 90%;
  max-width: 360px;
  max-height: 85%;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

.card-selector h3 {
  margin-top: 0;
  margin-bottom: 12px;
  text-align: center;
  font-size: 18px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin: 15px 0;
}

.card-suit-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-option {
  padding: 8px 3px;
  text-align: center;
  cursor: pointer;
  font-size: 20px;
  background-color: transparent;
  border-radius: 4px;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  position: relative;
}

.card-option:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.card-option:active {
  outline: none;
  background-color: #f0f0f0;
  transform: none;
}

.card-option:focus {
  outline: none;
}

.red-card {
  color: #d32f2f;
}

.card-display {
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 8px 15px; /* 减小上下内边距从12px到8px */
  margin: 12px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  -webkit-tap-highlight-color: transparent;
  height: 48px; /* 设置固定高度 */
}

.round-info {
  position: absolute;
  left: 15px;
  font-size: 17px; /* 增加字体大小从15px到17px */
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.card-selection {
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  padding-left: 30px;
}

.selected-card {
  font-size: 32px; /* 减小字体大小从36px到32px */
  margin-bottom: 0; /* 移除底部间距 */
}

.card-hint {
  font-size: 16px; /* 增加提示文字大小从12px到13px */
  color: #666;
  padding: 0; /* 移除上下内边距 */
  cursor: pointer;
  position: absolute;
  bottom: 3px; /* 将提示定位到底部 */
  right: 8px; /* 向右对齐 */
}

.joker {
  font-size: 28px;
  padding: 2px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

@media (max-width: 768px) {
  .card-selector {
    width: 95%;
    max-width: 340px;
    touch-action: auto;
  }
  
  .card-option {
    padding: 10px 4px;
    min-height: 44px;
    font-size: 18px;
    touch-action: auto;
  }
  
  /* 点击反馈效果 */
  .card-option::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.1);
    opacity: 0;
    border-radius: 4px;
    transition: opacity 0.2s;
    pointer-events: none;
  }
  
  .card-option:active::after {
    opacity: 1;
  }
  
  .round-info {
    font-size: 16px; /* 增加移动端字体大小从14px到16px */
    left: 12px;
  }
  
  .card-selection {
    padding-left: 25px;
  }
  
  .selected-card {
    font-size: 30px; /* 移动端进一步减小字体 */
  }
  
  .card-hint {
    font-size: 12px;
    bottom: 2px;
  }
  
  .card-display {
    padding: 6px 15px; /* 在移动端进一步减小上下内边距 */
    height: 46px; /* 调整移动端高度 */
  }
  
  .joker {
    font-size: 26px;
    padding: 8px 4px;
    min-height: 44px;
  }
}

/* 针对高度较小的屏幕进行优化 */
@media (max-height: 700px) {
  .card-option {
    padding: 6px 3px;
    font-size: 18px;
  }
  
  .joker {
    font-size: 24px;
  }
  
  .card-suit-group {
    gap: 4px;
  }
  
  .card-grid {
    gap: 3px;
  }
}
</style>