<template>
  <div class="modal-overlay" @click="$emit('continue')">
    <div class="modal-container" @click.stop>
      <div class="summary-content">
        <div class="overall-stats card">
          <h3>本次游戏共 {{ gameHistoryRef.length }} 局</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span>皇帝方:</span>
              <div class="stat-values">
                <span>胜率 {{ emperorTeamWinRate }}%</span>
                <span :class="getScoreClass(emperorAvgScore)">
                  平均得分{{ emperorAvgScore > 0 ? '+' : '' }}{{ emperorAvgScore }}
                </span>
              </div>
            </div>
            
            <div class="stat-item">
              <span>平民方:</span>
              <div class="stat-values">
                <span>胜率 {{ 100-emperorTeamWinRate }}%</span>
                <span :class="getScoreClass(farmerAvgScore)">
                  平均得分{{ farmerAvgScore > 0 ? '+' : '' }}{{ farmerAvgScore }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="players-ranking card">
          <div class="players-table">
            <div class="table-header">
              <div class="player-col">玩家</div>
              <div class="score-col">总分</div>
              <div class="role-col">
                <div class="role-label">皇帝</div>
                <div class="role-stats">
                  <span>次数</span>
                  <span>得分</span>
                  <span>胜率</span>
                </div>
              </div>
              <div class="role-col">
                <div class="role-label">侍卫</div>
                <div class="role-stats">
                  <span>次数</span>
                  <span>得分</span>
                  <span>胜率</span>
                </div>
              </div>
              <div class="role-col">
                <div class="role-label">平民</div>
                <div class="role-stats">
                  <span>次数</span>
                  <span>得分</span>
                  <span>胜率</span>
                </div>
              </div>
            </div>
            
            <div 
              v-for="player in sortedPlayers" 
              :key="player.name" 
              class="player-row"
            >
              <div class="player-col">{{ player.name }}</div>
              <div class="score-col" :class="getScoreClass(player.score)">
                {{ player.score > 0 ? '+' : '' }}{{ player.score }}
              </div>
              
              <div class="role-col">
                <div class="role-stats">
                  <span>{{ getPlayerRoleCount(player.name, 'emperor') }}</span>
                  <span :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'emperor'))">
                    {{ formatScore(getPlayerRoleTotalScore(player.name, 'emperor')) }}
                  </span>
                  <span>{{ getPlayerRoleWinRate(player.name, 'emperor') }}%</span>
                </div>
              </div>
              
              <div class="role-col">
                <div class="role-stats">
                  <span>{{ getPlayerRoleCount(player.name, 'guard') }}</span>
                  <span :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'guard'))">
                    {{ formatScore(getPlayerRoleTotalScore(player.name, 'guard')) }}
                  </span>
                  <span>{{ getPlayerRoleWinRate(player.name, 'guard') }}%</span>
                </div>
              </div>
              
              <div class="role-col">
                <div class="role-stats">
                  <span>{{ getPlayerRoleCount(player.name, 'farmer') }}</span>
                  <span :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'farmer'))">
                    {{ formatScore(getPlayerRoleTotalScore(player.name, 'farmer')) }}
                  </span>
                  <span>{{ getPlayerRoleWinRate(player.name, 'farmer') }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="summary-actions">
        <button @click="$emit('continue')" class="action-btn return-btn">返回游戏</button>
        <button @click="$emit('end')" class="action-btn end-game-btn">结束重开</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useGameStats } from '../composables/useGameStats';
import { formatScore, getScoreClass, sortPlayers } from '../utils/gameUtils';

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
    const playersRef = ref(props.players);
    const gameHistoryRef = ref(props.gameHistory);
    
    const sortedPlayers = computed(() => sortPlayers(props.players));

    const {
      emperorTeamWinRate,
      emperorAvgScore,
      farmerAvgScore,
      getPlayerRoleCount,
      getPlayerRoleWinRate,
      getPlayerRoleTotalScore
    } = useGameStats(playersRef, gameHistoryRef);

    return { 
      gameHistoryRef,
      sortedPlayers,
      formatScore,
      getScoreClass,
      emperorTeamWinRate,
      emperorAvgScore,
      farmerAvgScore,
      getPlayerRoleCount,
      getPlayerRoleWinRate,
      getPlayerRoleTotalScore
    };
  }
};
</script>

<style scoped>
.modal-container {
  max-width: 620px;
  width: 95%;
}

.summary-content {
  flex-grow: 1;
}

.players-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  overflow-x: auto;
}

.table-header {
  display: flex;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
  padding: 8px 0;
}

.player-row {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}

.player-row:last-child {
  border-bottom: none;
}

.player-col, .score-col, .role-col {
  padding: 0 5px;
  display: flex;
  align-items: center;
}

.player-col {
  width: 16%;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 0;
}

.score-col {
  width: 10%;
  font-weight: bold;
  justify-content: flex-end;
  padding-right: 8px;
  padding-left: 0;
  white-space: nowrap;
  text-align: right;
}

.role-col {
  width: 24%;
  flex-direction: column;
}

.role-label {
  font-weight: bold;
  margin-bottom: 3px;
  text-align: center;
}

.role-stats {
  display: flex;
  width: 100%;
}

.role-stats span {
  flex: 1;
  text-align: right;
  font-size: 0.9em;
  padding-right: 8px;
  min-width: 30px;
}

.table-header .role-stats span {
  text-align: right;
  padding-right: 8px;
}

.role-stats span, .score-col {
  font-family: 'Courier New', monospace;
  letter-spacing: -0.5px;
}

.summary-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 15px;
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

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 15px;
  margin-bottom: 15px;
}

.card h3 {
  margin-top: 0;
  color: var(--primary-color);
  font-size: 16px;
  border-bottom: 1px solid #e3f2fd;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
}

.return-btn {
  background-color: #757575;
  color: white;
}

.end-game-btn {
  background-color: var(--error-color);
  color: white;
}

@media (max-width: 600px) {
  .modal-container {
    padding: 15px;
  }
  
  .player-col {
    width: 15%;
    padding-left: 5px;
  }
  
  .score-col {
    width: 12%;
    padding-right: 5px;
  }
  
  .role-stats span {
    font-size: 0.8em;
  }
  
  .table-header, .player-row {
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .modal-container {
    padding: 10px;
  }
  
  .players-table {
    font-size: 0.8em;
  }
  
  .player-col {
    width: 14%;
    padding-left: 2px;
  }
  
  .score-col {
    width: 10%;
    padding-right: 2px;
  }
  
  .role-col {
    width: 25%;
  }
  
  .role-stats span {
    padding-right: 2px;
    letter-spacing: -0.8px;
    font-size: 0.75em;
  }
  
  .score-col {
    padding-right: 2px;
    letter-spacing: -0.8px;
  }
}
</style>
