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
    <div class="round-label">第 {{ currentRound }} 局</div>
    <div class="card-selection" @click="openSelector">
      <div class="called-card-label">叫牌:</div>
      <div class="selected-card" :class="{ 'red-card': isRedCard(selectedCard), 'joker-card': selectedCard === '🃏' }">
        {{ selectedCard }}
      </div>
      <div v-if="showHint" class="card-hint" @click.stop="dismissHint">(点击更换)</div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { isRedCard, getCardDisplay, CARD_SUITS, CARD_VALUES } from '../utils/cardUtils';
import { getItem, setItem } from '../utils/storageUtils';
import { DEFAULT_CALLED_CARD, STORAGE_KEYS } from '../config/gameConfig';

export default {
  props: {
    modelValue: {
      type: String,
      default: DEFAULT_CALLED_CARD
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

    onMounted(() => {
      if (getItem(STORAGE_KEYS.CARD_SELECTOR_HINT, false)) {
        showHint.value = false;
      }
    });

    watch(() => props.modelValue, (newValue) => {
      selectedCard.value = newValue;
    });
    
    const openSelector = () => { visible.value = true; };
    const closeSelector = () => { visible.value = false; };

    const dismissHint = () => {
      showHint.value = false;
      setItem(STORAGE_KEYS.CARD_SELECTOR_HINT, 'true');
    };

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
      cardSuits: CARD_SUITS,
      cardValues: CARD_VALUES,
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
  background: var(--modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.card-selector {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
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
  position: relative;
}

.card-option:active {
  outline: none;
  background-color: #f0f0f0;
  transform: none;
}

.card-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 12px 15px;
  margin: 12px 0 20px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
  position: relative;
  -webkit-tap-highlight-color: transparent;
  min-height: 60px;
}

.round-label {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  padding: 4px 8px;
  background-color: #fff8e1;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.card-selection {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #f9f9f9;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #eee;
}

.called-card-label {
  font-size: 16px;
  margin-right: 10px;
  color: #555;
}

.selected-card {
  font-size: 32px;
  margin: 0 6px;
}

.joker-card {
  font-size: 42px;
  transform: translateY(-3px);
}

.card-hint {
  font-size: 12px;
  color: #999;
  font-style: italic;
  margin-left: 8px;
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
  
  .selected-card {
    font-size: 30px;
  }
  
  .joker-card {
    font-size: 38px;
  }
  
  .card-display {
    padding: 10px 15px;
    min-height: 55px;
  }
  
  .round-label, .called-card-label {
    font-size: 16px;
  }
}

@media (max-height: 700px) {
  .card-option {
    padding: 6px 3px;
    font-size: 18px;
  }
  
  .joker {
    font-size: 24px;
  }
  
  .card-suit-group, .card-grid {
    gap: 4px;
  }
}
</style>