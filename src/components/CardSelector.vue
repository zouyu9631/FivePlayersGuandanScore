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
import { ref, computed, watch, onMounted } from 'vue';

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
    
    // 修改花色顺序：黑桃、红桃、梅花、方块
    const cardSuits = ['♠', '♥', '♣', '♦'];
    const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    // 检查本地存储是否已经展示过提示
    onMounted(() => {
      const hintShown = localStorage.getItem('cardSelectorHintShown');
      if (hintShown) {
        showHint.value = false;
      }
    });

    // 监听props变化同步内部状态
    watch(() => props.modelValue, (newValue) => {
      selectedCard.value = newValue;
    });

    // 判断是否为红色牌（红桃或方块）
    const isRedCard = (card) => {
      return card && (card.includes('♥') || card.includes('♦'));
    };

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

    // 隐藏提示并在localStorage中记录
    const dismissHint = () => {
      showHint.value = false;
      localStorage.setItem('cardSelectorHintShown', 'true');
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
      
      // 用户选择过卡牌后，记录并隐藏提示
      if (showHint.value) {
        dismissHint();
      }
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
  padding: 20px 10px; /* 进一步减少左右内边距 */
  width: 90%; /* 减少整体宽度比例 */
  max-width: 360px; /* 减小最大宽度 */
  max-height: 85%;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
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
  gap: 4px; /* 进一步减少列间距 */
  margin: 15px 0;
}

.card-suit-group {
  display: flex;
  flex-direction: column;
  gap: 6px; /* 减少行间距 */
}

.card-option {
  padding: 8px 3px; /* 减少左右内边距 */
  text-align: center;
  cursor: pointer;
  font-size: 20px; /* 增大字体 */
  transition: transform 0.2s;
  background-color: transparent;
  border-radius: 4px;
}

.card-option:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.red-card {
  color: #d32f2f;
}

/* 重新设计卡片展示区域，更加紧凑 */
.card-display {
  display: flex;
  justify-content: center; /* 改为居中布局 */
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 12px 15px;
  margin: 12px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative; /* 添加相对定位 */
}

.round-info {
  position: absolute; /* 使用绝对定位 */
  left: 15px; /* 左侧贴边 */
  font-size: 16px;
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
  margin-left: auto; /* 自动计算左边距 */
  margin-right: auto; /* 自动计算右边距 */
  padding-left: 30px; /* 为左侧的局数文本留出空间 */
}

.selected-card {
  font-size: 36px;  /* 减小字体大小 */
  margin-bottom: 2px;  /* 减小下边距 */
}

.card-hint {
  font-size: 12px;
  color: #666;
  padding: 2px 0;
  cursor: pointer;
}

.card-hint:hover {
  text-decoration: underline;
}

.joker {
  font-size: 28px; /* 增大小王图标 */
  padding: 2px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

@media (max-width: 768px) {
  .card-display {
    padding: 10px 12px;
  }
  
  .selected-card {
    font-size: 32px;
  }
  
  .card-option {
    padding: 8px 4px;
    font-size: 18px; /* 适当增大移动端字体 */
  }
  
  .joker {
    font-size: 26px;
    padding: 2px 4px;
  }
  
  .card-selector {
    width: 95%; /* 移动端略微增大比例 */
    max-width: 340px; /* 移动端减小最大宽度 */
  }
  
  .card-grid {
    gap: 3px; /* 移动端进一步减小列间距 */
  }

  .round-info {
    font-size: 14px;
    left: 12px;
  }
  
  .card-selection {
    padding-left: 25px; /* 调整移动端的左边距 */
  }
}

/* 针对高度较小的屏幕进行优化 */
@media (max-height: 700px) {
  .card-option {
    padding: 6px 3px; /* 进一步减小上下内边距 */
    font-size: 18px;
  }
  
  .joker {
    font-size: 24px;
  }
  
  .card-suit-group {
    gap: 4px; /* 进一步减少行间距 */
  }
  
  .card-grid {
    gap: 3px; /* 更小屏幕进一步减少列间距 */
  }
}
</style>
