<template>
  <div class="game-header">
    <div class="header-top">
      <h2>总分</h2>
      <button @click="$emit('end-game')" class="end-game-summary-btn">结算总分</button>
    </div>
    <div class="player-scores">
      <div v-for="player in players" :key="player.name" class="player-score">
        <span>{{ player.name }}</span>
        <span :class="{ 'positive': player.score > 0, 'negative': player.score < 0 }">
          {{ player.score > 0 ? '+' : '' }}{{ player.score }}
        </span>
      </div>
    </div>
    <button @click="$emit('toggle-history')" class="history-btn">
      {{ showHistory ? '隐藏历史' : '显示历史' }} ↓
    </button>
  </div>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      required: true
    },
    showHistory: {
      type: Boolean,
      default: false
    }
  },
  emits: ['end-game', 'toggle-history']
};
</script>

<style scoped>
.game-header {
  margin-bottom: 15px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-top h2 {
  margin: 0;
}

.end-game-summary-btn {
  background-color: #f44336;
  font-size: 14px;
  padding: 6px 12px;
  height: auto;
  font-weight: bold;
}

.end-game-summary-btn:hover {
  background-color: #d32f2f;
}

.player-scores {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 10px 0;
}

.player-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  text-align: center;
}

.positive {
  color: #4CAF50;
  font-weight: bold;
}

.negative {
  color: #F44336;
  font-weight: bold;
}

.history-btn {
  width: 100%;
  margin-top: 10px;
  background-color: #6c757d;
  height: 36px;
  padding: 6px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}
</style>
