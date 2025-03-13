<template>
  <div class="card-selector-overlay" @click="$emit('close')">
    <div class="card-selector" @click.stop>
      <h3>选择叫牌</h3>
      <div class="card-grid">
        <div v-for="(suit, suitIndex) in cardSuits" :key="suitIndex" class="card-suit-group">
          <div v-for="(value, valueIndex) in cardValues" :key="`${suitIndex}-${valueIndex}`" 
               class="card-option" 
               :class="{ 'red-card': suit === '♥' || suit === '♦' }"
               @click="selectCard(suit, value)">
            {{ getCardDisplay(suit, value) }}
          </div>
        </div>
        <div class="card-option joker" @click="selectCard('joker', 'small')">🃏</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['close', 'select'],
  setup(props, { emit }) {
    const cardSuits = ['♠', '♥', '♦', '♣'];
    const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    const getCardDisplay = (suit, value) => {
      return `${suit}${value}`;
    };

    const selectCard = (suit, value) => {
      if (suit === 'joker') {
        emit('select', '🃏');
      } else {
        emit('select', `${suit}${value}`);
      }
      emit('close');
    };

    return {
      cardSuits,
      cardValues,
      getCardDisplay,
      selectCard
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
</style>
