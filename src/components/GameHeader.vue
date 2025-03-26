<template>
  <div class="game-header">
    <div class="header-card">
      <div class="header-top">
        <h2>总分</h2>
        <button class="history-button" @click="$emit('toggle-history')">
          <span class="history-icon">📜</span>
          <span class="history-text">历史记录</span>
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
  emits: ['toggle-history'],
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

.history-button {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background-color: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--primary-color);
  font-weight: 500;
  height: 28px;
}

.history-icon {
  font-size: 15px;
  margin-right: 5px;
}

.history-text {
  font-size: 13px;
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
  
  .history-button {
    padding: 3px 8px;
    height: 26px;
  }
  
  .history-icon {
    font-size: 14px;
    margin-right: 3px;
  }
  
  .history-text {
    font-size: 12px;
  }
  
  .player-score .player-name {
    font-size: 12px;
  }
  
  .player-score {
    padding: 4px 0;
  }
}
</style>
