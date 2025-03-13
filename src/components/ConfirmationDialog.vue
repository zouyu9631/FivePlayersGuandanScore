<template>
  <div class="confirmation-overlay">
    <div class="confirmation-dialog">
      <h3>请确认游戏信息</h3>
      <div class="confirmation-content">
        <p>叫牌：{{ calledCard }}</p>
        <div class="confirmation-ranks">
          <p>排名：</p>
          <div v-for="(player, index) in playerRanking" :key="player.name" class="confirm-player-rank">
            <span>{{ getRankName(index) }}： {{ player.name }} 
              <span v-if="player.name === emperor && player.name !== guard" class="emperor-indicator">👑</span>
              <span v-if="player.name === guard && player.name !== emperor" class="guard-indicator">🛡️</span>
              <span v-if="player.name === emperor && player.name === guard" class="self-guard-indicator">👑🛡️</span>
            </span>
            <span :class="{ 'positive': scoreChanges[player.name] > 0, 'negative': scoreChanges[player.name] < 0 }">
              {{ scoreChanges[player.name] > 0 ? '+' : '' }}{{ scoreChanges[player.name] }}
            </span>
          </div>
        </div>
      </div>
      <div class="confirmation-buttons">
        <button @click="$emit('cancel')">返回游戏</button>
        <button @click="$emit('confirm')" class="confirm-btn">确认计算</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    calledCard: String,
    playerRanking: Array,
    emperor: String,
    guard: String,
    scoreChanges: Object
  },
  emits: ['confirm', 'cancel'],
  setup() {
    const getRankName = (index) => {
      const ranks = ['头游', '二游', '三游', '四游', '末游'];
      return ranks[index];
    };

    return { getRankName };
  }
};
</script>

<style scoped>
.confirmation-overlay {
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

.confirmation-dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.confirmation-content {
  margin: 15px 0;
}

.confirmation-ranks {
  margin-top: 15px;
}

.confirm-player-rank {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.confirm-player-rank:last-child {
  border-bottom: none;
}

.confirmation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.confirm-btn {
  background-color: #4CAF50;
}

.positive {
  color: #4CAF50;
  font-weight: bold;
}

.negative {
  color: #F44336;
  font-weight: bold;
}

.emperor-indicator,
.guard-indicator,
.self-guard-indicator {
  margin-left: 5px;
}

.self-guard-indicator {
  color: #ff9800;
}
</style>
