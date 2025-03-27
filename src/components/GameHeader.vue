<template>
  <div class="game-header">
    <div class="header-card">
      <div class="header-top">
        <h2>总分</h2>
        <button class="rules-button" @click="$emit('show-rules')" title="游戏规则">
          <span class="rules-icon">?</span>
        </button>
      </div>
      <div class="player-scores">
        <div v-for="player in players" :key="player.name" class="player-score">
          <span class="player-name">{{ player.name }}</span>
          <span :class="getScoreClass(player.score)">
            {{ formatScore(player.score) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getScoreClass, formatScore } from '../utils/gameUtils';

export default {
  props: {
    players: {
      type: Array,
      required: true
    }
  },
  emits: ['show-rules'],
  setup() {
    return { getScoreClass, formatScore };
  }
};
</script>

<style scoped>
.game-header {
  margin-bottom: 20px;
  position: relative;
}

.header-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 15px;
  position: relative;
  z-index: 2;
  transition: all 0.25s ease;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header-top h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 20px;
}

.rules-button {
  width: 36px;
  height: 36px;
  background-color: transparent;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  border: none;
  box-sizing: border-box;
}

.rules-icon {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.player-scores {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.player-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 19%;
  text-align: center;
  padding: 5px 0;
  margin: 0;
  border-radius: 6px;
  transition: all 0.2s;
}

.player-score .player-name {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin-bottom: 4px;
}

@media (max-width: 480px) {
  .header-top h2 {
    font-size: 18px;
  }
  
  .player-score .player-name {
    font-size: 12px;
  }
  
  .player-score {
    padding: 4px 0;
  }
  
  .rules-button {
    width: 32px;
    height: 32px;
  }
  
  .rules-icon {
    font-size: 20px;
  }
}
</style>
