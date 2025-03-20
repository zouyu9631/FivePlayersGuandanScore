<template>
  <div class="game-summary-modal" @click="$emit('continue')">
    <div class="game-summary-container" @click.stop>
      <h2>游戏结算</h2>
      
      <div class="summary-content">
        <!-- 玩家数据展示 - 点击切换玩家 -->
        <div class="player-summary card">
          <div class="player-scores">
            <div 
              v-for="player in players" 
              :key="player.name" 
              class="player-score"
              :class="{'selected': selectedPlayer === player.name}"
              @click="selectedPlayer = player.name"
            >
              <span class="player-name">{{ player.name }}</span>
              <span :class="{ 'positive': player.score > 0, 'negative': player.score < 0 }">
                {{ player.score > 0 ? '+' : '' }}{{ player.score }}
              </span>
            </div>
          </div>
          
          <!-- 始终展示选中玩家的详细数据 -->
          <div class="player-details">
            <div class="role-header">
              <div class="role-title">身份</div>
              <div class="role-data">
                <span>次数</span>
                <span>胜率</span>
                <span>平均得分</span>
              </div>
            </div>
            <div class="role-stats">
              <div class="role-row">
                <div class="role-title">皇帝</div>
                <div class="role-data">
                  <span>{{ getPlayerRoleCount(selectedPlayer, 'emperor') }}次</span>
                  <span>{{ getPlayerRoleWinRate(selectedPlayer, 'emperor') }}%</span>
                  <span :class="getPlayerRoleAvgScore(selectedPlayer, 'emperor') > 0 ? 'positive' : 'negative'">
                    {{ getPlayerRoleAvgScore(selectedPlayer, 'emperor') > 0 ? '+' : '' }}{{ getPlayerRoleAvgScore(selectedPlayer, 'emperor') }}
                  </span>
                </div>
              </div>
              <div class="role-row">
                <div class="role-title">侍卫</div>
                <div class="role-data">
                  <span>{{ getPlayerRoleCount(selectedPlayer, 'guard') }}次</span>
                  <span>{{ getPlayerRoleWinRate(selectedPlayer, 'guard') }}%</span>
                  <span :class="getPlayerRoleAvgScore(selectedPlayer, 'guard') > 0 ? 'positive' : 'negative'">
                    {{ getPlayerRoleAvgScore(selectedPlayer, 'guard') > 0 ? '+' : '' }}{{ getPlayerRoleAvgScore(selectedPlayer, 'guard') }}
                  </span>
                </div>
              </div>
              <div class="role-row">
                <div class="role-title">农民</div>
                <div class="role-data">
                  <span>{{ getPlayerRoleCount(selectedPlayer, 'farmer') }}次</span>
                  <span>{{ getPlayerRoleWinRate(selectedPlayer, 'farmer') }}%</span>
                  <span :class="getPlayerRoleAvgScore(selectedPlayer, 'farmer') > 0 ? 'positive' : 'negative'">
                    {{ getPlayerRoleAvgScore(selectedPlayer, 'farmer') > 0 ? '+' : '' }}{{ getPlayerRoleAvgScore(selectedPlayer, 'farmer') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 整体数据统计 -->
        <div class="overall-stats card">
          <h3>整体数据</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span>本次游戏共{{ gameHistory.length }}局</span>
            </div>
            <div class="stat-item">
              <span>皇帝方:</span>
              <div class="stat-values">
                <span>胜率 {{ emperorTeamWinRate }}%</span>
                <span :class="emperorAvgScore > 0 ? 'positive' : 'negative'">
                  平均得分{{ emperorAvgScore > 0 ? '+' : '' }}{{ emperorAvgScore }}
                </span>
              </div>
            </div>
            <div class="stat-item">
              <span>农民方:</span>
              <div class="stat-values">
                <span>胜率 {{ 100 - emperorTeamWinRate }}%</span>
                <span :class="farmerAvgScore > 0 ? 'positive' : 'negative'">
                  平均得分{{ farmerAvgScore > 0 ? '+' : '' }}{{ farmerAvgScore }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="summary-actions">
        <button @click="$emit('continue')" class="return-btn">返回游戏</button>
        <button @click="confirmEndGame" class="end-game-btn">结束重开</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';

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
  
  setup(props, { emit }) {
    // 选择的玩家（用于显示详细统计）
    const selectedPlayer = ref('');
    
    // 组件挂载时，默认选择第一个玩家
    onMounted(() => {
      if (props.players.length > 0) {
        selectedPlayer.value = props.players[0].name;
      }
    });

    // 皇帝一方的胜率（皇帝或侍卫是头游的比例）
    const emperorTeamWinRate = computed(() => {
      if (props.gameHistory.length === 0) return 0;
      
      let winCount = 0;
      props.gameHistory.forEach(round => {
        // 获取当前局的排名
        const ranking = round.ranking || [];
        // 如果皇帝或侍卫是头游，则算作胜利
        if (ranking.length > 0 && (ranking[0] === round.emperor || ranking[0] === round.guard)) {
          winCount++;
        }
      });
      
      return Math.round((winCount / props.gameHistory.length) * 100);
    });

    // 皇帝方平均得分
    const emperorAvgScore = computed(() => {
      if (props.gameHistory.length === 0) return 0;
      
      let totalScore = 0;
      let count = 0;
      
      props.gameHistory.forEach(round => {
        // 统计皇帝和侍卫的分数
        if (round.emperor && round.scoreChanges) {
          totalScore += round.scoreChanges[round.emperor] || 0;
          count++;
        }
        if (round.guard && round.guard !== round.emperor && round.scoreChanges) {
          totalScore += round.scoreChanges[round.guard] || 0;
          count++;
        }
      });
      
      return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
    });

    // 农民方平均得分
    const farmerAvgScore = computed(() => {
      if (props.gameHistory.length === 0) return 0;
      
      let totalScore = 0;
      let count = 0;
      
      props.gameHistory.forEach(round => {
        // 统计非皇帝非侍卫玩家的分数
        if (round.scoreChanges) {
          props.players.forEach(player => {
            if (player.name !== round.emperor && player.name !== round.guard) {
              totalScore += round.scoreChanges[player.name] || 0;
              count++;
            }
          });
        }
      });
      
      return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
    });

    // 获取玩家担任特定角色的次数
    const getPlayerRoleCount = (playerName, role) => {
      let count = 0;
      props.gameHistory.forEach(round => {
        if (role === 'emperor' && round.emperor === playerName) {
          count++;
        } else if (role === 'guard' && round.guard === playerName && round.emperor !== playerName) {
          count++;
        } else if (role === 'farmer' && playerName !== round.emperor && playerName !== round.guard) {
          count++;
        }
      });
      return count;
    };

    // 获取玩家担任特定角色的胜率
    const getPlayerRoleWinRate = (playerName, role) => {
      let games = 0;
      let wins = 0;
      
      props.gameHistory.forEach(round => {
        const ranking = round.ranking || [];
        const isWin = ranking.length > 0 && ranking[0] === playerName;
        
        if (role === 'emperor' && round.emperor === playerName) {
          games++;
          if (isWin) wins++;
        } else if (role === 'guard' && round.guard === playerName && round.emperor !== playerName) {
          games++;
          if (isWin) wins++;
        } else if (role === 'farmer' && playerName !== round.emperor && playerName !== round.guard) {
          games++;
          if (isWin) wins++;
        }
      });
      
      return games > 0 ? Math.round((wins / games) * 100) : 0;
    };

    // 获取玩家担任特定角色的平均得分
    const getPlayerRoleAvgScore = (playerName, role) => {
      let totalScore = 0;
      let games = 0;
      
      props.gameHistory.forEach(round => {
        const isEmperor = round.emperor === playerName;
        const isGuard = round.guard === playerName && round.emperor !== playerName;
        const isFarmer = playerName !== round.emperor && playerName !== round.guard;
        
        if ((role === 'emperor' && isEmperor) ||
            (role === 'guard' && isGuard) ||
            (role === 'farmer' && isFarmer)) {
          const scoreChange = round.scoreChanges[playerName] || 0;
          totalScore += scoreChange;
          games++;
        }
      });
      
      return games > 0 ? parseFloat((totalScore / games).toFixed(2)) : 0;
    };

    const confirmEndGame = () => {
      if (confirm("确定要结束游戏吗？将清除所有游戏数据并重新开始。")) {
        emit('end');
      }
    };

    return { 
      selectedPlayer,
      emperorTeamWinRate,
      emperorAvgScore,
      farmerAvgScore,
      getPlayerRoleCount,
      getPlayerRoleWinRate,
      getPlayerRoleAvgScore,
      confirmEndGame
    };
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

.card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
  font-size: 18px;
  color: #444;
}

/* 总分样式 - 改为更紧凑的横向布局 */
.player-scores {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.player-score {
  flex: 1;
  min-width: 60px;
  max-width: 80px;
  text-align: center;
  padding: 8px 5px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.player-score:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.player-score.selected {
  background-color: #e3f2fd;
  border: 1px solid #4a7bff;
}

.player-score .player-name {
  display: block;
  font-weight: bold;
  font-size: 0.95em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

/* 玩家详细数据样式 */
.player-details {
  margin-top: 15px;
  background-color: #fff;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.role-header {
  display: flex;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.role-header .role-title {
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-header .role-data {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.role-header .role-data span {
  flex: 1;
  text-align: center;
  padding: 0 5px;
}

.role-stats {
  display: flex;
  flex-direction: column;
}

.role-row {
  display: flex;
  margin-bottom: 10px;
}

.role-title {
  width: 50px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-data {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.role-data span {
  flex: 1;
  text-align: center;
  padding: 0 5px;
}

.role-legend {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
  color: #777;
  margin-top: 5px;
  border-top: 1px solid #eee;
  padding-top: 5px;
}

.role-legend span {
  flex: 1;
  text-align: center;
}

/* 统计项样式 */
.stats-grid {
  display: flex;
  flex-direction: column;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-values {
  display: flex;
  gap: 15px;
  text-align: right;
}

.stat-values span {
  min-width: 80px;
  text-align: right;
}

.summary-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 15px;
}

.return-btn {
  flex: 1;
  background-color: #4a7bff; /* 改为蓝色，与确认每局的体验一致 */
  padding: 12px;
  font-weight: bold;
}

.end-game-btn {
  flex: 1;
  background-color: #FF5722;
  padding: 12px;
  font-weight: bold;
}

.positive {
  color: #4CAF50;
  font-weight: bold;
}

.negative {
  color: #F44336;
  font-weight: bold;
}

@media (max-width: 480px) {
  .game-summary-container {
    padding: 15px;
  }
  
  .player-score {
    min-width: 55px;
    padding: 6px 3px;
    margin: 2px;
  }
  
  .role-title, .role-header .role-title {
    width: 40px;
    font-size: 0.9em;
  }
  
  .summary-actions {
    flex-direction: row; /* 确保在移动端也保持水平显示 */
  }
  
  .return-btn, .end-game-btn {
    width: auto; /* 移除固定宽度 */
    margin: 0; /* 移除额外边距 */
  }
}
</style>
