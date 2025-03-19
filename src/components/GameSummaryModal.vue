<template>
  <div class="game-summary-modal">
    <div class="game-summary-container">
      <h2>游戏结算</h2>
      <div class="summary-content">
        <p class="game-stats">总局数: {{ gameHistory.length }}局</p>
        
        <div class="final-ranking">
          <h3>最终排名</h3>
          <div v-for="(player, index) in sortedPlayers" :key="player.name" class="rank-item">
            <div class="rank-position">{{ index + 1 }}</div>
            <div class="player-name">{{ player.name }}</div>
            <div :class="{ 'positive': player.score > 0, 'negative': player.score < 0 }">
              {{ player.score > 0 ? '+' : '' }}{{ player.score }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="summary-actions">
        <button @click="$emit('continue')" class="return-btn">继续游戏</button>
        <button @click="$emit('end')" class="end-game-btn">结束重开</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    players: {
      type: Array,
      required: true
    },
    gameHistory: {
      type: Array,
      required: true
    }
  },
  
  emits: ['continue', 'end'],
  
  setup(props) {
    const sortedPlayers = computed(() => {
      return [...props.players].sort((a, b) => b.score - a.score);
    });

    return { sortedPlayers };
  }
};
</script>

<style scoped>
.game-summary-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.game-summary-container {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.game-summary-container h2 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.summary-content {
  flex-grow: 1;
}

.game-stats {
  text-align: center;
  font-size: 18px;
  margin-bottom: 20px;
}

.final-ranking {
  margin-bottom: 25px;
}

.final-ranking h3 {
  text-align: center;
  margin-bottom: 15px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-position {
  width: 30px;
  height: 30px;
  background: #4a7bff;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 15px;
}

.rank-item:nth-child(1) .rank-position {
  background: #ffd700;
}

.rank-item:nth-child(2) .rank-position {
  background: #c0c0c0;
}

.rank-item:nth-child(3) .rank-position {
  background: #cd7f32;
}

.player-name {
  flex-grow: 1;
  font-weight: bold;
}

.summary-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 15px;
}

.return-btn {
  flex: 1;
  background-color: #607D8B;
  padding: 12px;
  font-weight: bold;
}

.end-game-btn {
  flex: 1;
  background-color: #FF5722;
  padding: 12px;
  font-weight: bold;
}

@media (max-width: 480px) {
  .game-summary-container {
    padding: 15px;
  }
  
  .rank-item {
    padding: 10px;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .return-btn, .end-game-btn {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
