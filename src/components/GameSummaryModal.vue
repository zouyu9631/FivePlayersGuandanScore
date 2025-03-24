<template>
  <div class="modal-overlay" @click="$emit('continue')">
    <div class="modal-container" @click.stop>
      <div class="summary-content">
        <!-- 整体数据统计 -->
        <div class="overall-stats card">
          <h3>本次游戏共 {{ gameHistoryRef.length }} 局</h3>
          <div class="stats-grid">
            <!-- 皇帝方统计 -->
            <div class="stat-item">
              <span>皇帝方:</span>
              <div class="stat-values">
                <span>胜率 {{ emperorTeamWinRate }}%</span>
                <span :class="getScoreClass(emperorAvgScore)">
                  平均得分{{ emperorAvgScore > 0 ? '+' : '' }}{{ emperorAvgScore }}
                </span>
              </div>
            </div>
            
            <!-- 农民方统计 -->
            <div class="stat-item">
              <span>农民方:</span>
              <div class="stat-values">
                <span>胜率 {{ 100-emperorTeamWinRate }}%</span>
                <span :class="getScoreClass(farmerAvgScore)">
                  平均得分{{ farmerAvgScore > 0 ? '+' : '' }}{{ farmerAvgScore }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 玩家排行榜 -->
        <div class="players-ranking card">
          <div class="players-table">
            <!-- 表格标题行 -->
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
                <div class="role-label">农民</div>
                <div class="role-stats">
                  <span>次数</span>
                  <span>得分</span>
                  <span>胜率</span>
                </div>
              </div>
            </div>
            
            <!-- 玩家数据行 -->
            <div 
              v-for="player in sortedPlayers" 
              :key="player.name" 
              class="player-row"
            >
              <div class="player-col">{{ player.name }}</div>
              <div class="score-col" :class="getScoreClass(player.score)">
                {{ player.score > 0 ? '+' : '' }}{{ player.score }}
              </div>
              
              <!-- 皇帝角色数据 -->
              <div class="role-col">
                <div class="role-stats">
                  <span>{{ getPlayerRoleCount(player.name, 'emperor') }}</span>
                  <span :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'emperor'))">
                    {{ formatScore(getPlayerRoleTotalScore(player.name, 'emperor')) }}
                  </span>
                  <span>{{ getPlayerRoleWinRate(player.name, 'emperor') }}%</span>
                </div>
              </div>
              
              <!-- 侍卫角色数据 -->
              <div class="role-col">
                <div class="role-stats">
                  <span>{{ getPlayerRoleCount(player.name, 'guard') }}</span>
                  <span :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'guard'))">
                    {{ formatScore(getPlayerRoleTotalScore(player.name, 'guard')) }}
                  </span>
                  <span>{{ getPlayerRoleWinRate(player.name, 'guard') }}%</span>
                </div>
              </div>
              
              <!-- 农民角色数据 -->
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
        <button @click="$emit('continue')" class="return-btn">返回游戏</button>
        <button @click="$emit('end')" class="end-game-btn">结束重开</button>
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
    // 创建响应式引用，供composable使用
    const playersRef = ref(props.players);
    const gameHistoryRef = ref(props.gameHistory);
    
    // 按照得分排序的玩家列表
    const sortedPlayers = computed(() => sortPlayers(props.players));

    // 使用游戏统计composable
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

/* 玩家排行表格样式 */
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
  width: 16%; /* 从20%减少到16% */
  font-weight: bold;
  padding-left: 10px;
  padding-right: 0; /* 减少右边距 */
}

.score-col {
  width: 10%; /* 从15%减少到10% */
  font-weight: bold;
  justify-content: flex-end;
  padding-right: 8px;
  padding-left: 0; /* 减少左边距 */
  white-space: nowrap;
  text-align: right;
}

.role-col {
  width: 24%; /* 从22%增加到24%，给其他数据更多空间 */
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
  min-width: 30px; /* 确保每列有最小宽度 */
}

/* 表头也右对齐以匹配数据 */
.table-header .role-stats span {
  text-align: right;
  padding-right: 8px;
}

/* 让数字使用等宽字体，确保对齐 */
.role-stats span, .score-col {
  font-family: 'Courier New', monospace;
  letter-spacing: -0.5px; /* 微调字符间距 */
}

/* 确保数字单元格有足够的宽度显示内容不换行 */
.score-col {
  white-space: nowrap;
  text-align: right;
  justify-content: flex-end; /* 改为右对齐 */
  padding-right: 8px;
}

/* 总分也右对齐，使用等宽字体 */
.player-col {
  width: 20%;
  font-weight: bold;
  padding-left: 10px;
}

/* 让表格总宽度有些富余，避免挤压 */
.players-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  overflow-x: auto;
}

.summary-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 15px;
}

.return-btn {
  background-color: var(--primary-color);
}

.end-game-btn {
  background-color: var(--error-color);
}

/* 响应式调整 */
@media (max-width: 600px) {
  .modal-container {
    padding: 15px;
  }
  
  .player-col {
    width: 15%; /* 进一步缩小 */
    padding-left: 5px;
  }
  
  .score-col {
    width: 12%;
    padding-right: 5px;
  }
  
  .role-col {
    width: 24%;
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
    width: 25%; /* 补偿剩余空间 */
  }
  
  .role-stats span {
    padding-right: 2px; /* 在小屏幕上减小右边距 */
    letter-spacing: -0.8px; /* 在小屏幕上进一步减小间距 */
    font-size: 0.75em; /* 在小屏幕上稍微减小字体 */
  }
  
  .score-col {
    padding-right: 2px;
    letter-spacing: -0.8px;
  }
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
</style>
