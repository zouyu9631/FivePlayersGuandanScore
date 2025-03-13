<template>
  <div class="container">
    <div class="game-results">
      <h1>游戏结束</h1>
      
      <div class="game-stats">
        <p>总局数: {{ gameHistory.length }}局</p>
        <p>游戏时长: {{ formatGameDuration }}</p>
      </div>
      
      <div class="final-ranking card">
        <h2>最终排名</h2>
        <div v-for="(player, index) in sortedPlayers" :key="player.name" class="rank-item">
          <div class="rank-position">{{ index + 1 }}</div>
          <div class="player-info">
            <div class="player-name">{{ player.name }}</div>
            <div :class="{ 'positive': player.score > 0, 'negative': player.score < 0 }">
              {{ player.score > 0 ? '+' : '' }}{{ player.score }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="role-stats card" v-if="gameHistory.length > 0">
        <h2>角色统计</h2>
        <div class="stats-grid">
          <div class="stats-column">
            <h3>皇帝次数</h3>
            <div v-for="(count, player) in emperorCounts" :key="`emperor-${player}`" class="stat-item">
              <span>{{ player }}:</span>
              <span>{{ count }}次</span>
            </div>
          </div>
          
          <div class="stats-column">
            <h3>侍卫次数</h3>
            <div v-for="(count, player) in guardCounts" :key="`guard-${player}`" class="stat-item">
              <span>{{ player }}:</span>
              <span>{{ count }}次</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="$emit('new-game')" class="new-game-btn">新游戏</button>
        <button @click="$emit('return-to-home')" class="home-btn">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  props: {
    players: Array,
    gameHistory: Array,
  },
  emits: ['new-game', 'return-to-home'],
  setup(props) {
    // 按分数从高到低排序玩家
    const sortedPlayers = computed(() => {
      return [...props.players].sort((a, b) => b.score - a.score);
    });

    // 统计皇帝次数
    const emperorCounts = computed(() => {
      const counts = {};
      props.players.forEach(player => {
        counts[player.name] = 0;
      });
      
      props.gameHistory.forEach(round => {
        if (round.emperor) {
          counts[round.emperor] = (counts[round.emperor] || 0) + 1;
        }
      });
      
      return counts;
    });

    // 统计侍卫次数
    const guardCounts = computed(() => {
      const counts = {};
      props.players.forEach(player => {
        counts[player.name] = 0;
      });
      
      props.gameHistory.forEach(round => {
        if (round.guard && round.guard !== round.emperor) {
          counts[round.guard] = (counts[round.guard] || 0) + 1;
        }
      });
      
      return counts;
    });

    // 格式化游戏时长（假设每局平均5分钟）
    const formatGameDuration = computed(() => {
      const minutes = props.gameHistory.length * 5;
      if (minutes < 60) {
        return `${minutes}分钟`;
      } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}小时${remainingMinutes > 0 ? ` ${remainingMinutes}分钟` : ''}`;
      }
    });

    return {
      sortedPlayers,
      emperorCounts,
      guardCounts,
      formatGameDuration
    };
  }
};
</script>

<style scoped>
.game-results {
  text-align: center;
}

.game-stats {
  margin: 20px 0;
  font-size: 18px;
  color: #555;
}

.final-ranking {
  margin-bottom: 20px;
}

.rank-item {
  display: flex;
  align-items: center;
  padding: 15px;
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
  background: #ffd700; /* 金色，第一名 */
}

.rank-item:nth-child(2) .rank-position {
  background: #c0c0c0; /* 银色，第二名 */
}

.rank-item:nth-child(3) .rank-position {
  background: #cd7f32; /* 铜色，第三名 */
}

.player-info {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.player-name {
  font-weight: bold;
  font-size: 18px;
}

.positive, .negative {
  font-weight: bold;
  font-size: 20px;
}

.positive {
  color: #4CAF50;
}

.negative {
  color: #F44336;
}

.role-stats {
  margin-bottom: 20px;
}

.stats-grid {
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
}

.stats-column {
  flex: 1;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.new-game-btn {
  background-color: #4CAF50;
  padding: 12px 24px;
}

.home-btn {
  background-color: #607D8B;
  padding: 12px 24px;
}
</style>
