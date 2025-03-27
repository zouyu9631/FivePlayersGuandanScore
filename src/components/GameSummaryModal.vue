<template>
  <div class="modal-overlay" @click="$emit('continue')">
    <div class="modal-container" @click.stop>
      <div class="summary-header">
        <h2>游戏总结</h2>
        <span class="games-count">{{ gameHistoryRef.length }}局</span>
      </div>
      
      <div class="summary-content">
        <!-- 玩家总分卡片 - 主要信息 -->
        <div class="score-summary card">
          <div class="score-tabs">
            <div class="tab active">总分榜</div>
          </div>
          
          <!-- 阵营统计小卡片 -->
          <div class="team-stats-compact">
            <div class="team-compact emperor-team">
              <span class="team-icon">👑 皇帝方</span>
              <span class="team-stat">胜率 {{ emperorTeamWinRate }}%</span>
              <span class="team-stat" :class="getScoreClass(emperorAvgScore)">平均 {{ formatScore(emperorAvgScore) }}</span>
            </div>
            <div class="team-compact farmer-team">
              <span class="team-icon">👨‍🌾 平民方</span>
              <span class="team-stat">胜率 {{ 100-emperorTeamWinRate }}%</span>
              <span class="team-stat" :class="getScoreClass(farmerAvgScore)">平均 {{ formatScore(farmerAvgScore) }}</span>
            </div>
          </div>
          
          <div class="player-scores-grid">
            <div 
              v-for="(player, index) in sortedPlayers" 
              :key="player.name" 
              class="player-score-card"
              :class="{
                'top-player': index < topPlayerCount,
                'mvp-player': mvpPlayers.includes(player.name),
                'expanded': expandedPlayer === player.name
              }"
              @click="togglePlayerDetails(player.name)"
            >
              <div class="player-main-info">
                <div class="player-rank" :class="{'gold-rank': index === 0, 'silver-rank': index === 1, 'bronze-rank': index === 2}">
                  {{ index + 1 }}
                </div>
                <div class="player-info">
                  <div class="player-name">
                    {{ player.name }}
                    <span v-if="mvpPlayers.includes(player.name)" class="mvp-badge">MVP</span>
                  </div>
                  <div class="player-stats">
                    <span>胜率 {{ getPlayerWinRate(player.name) }}% (胜{{ getPlayerWinCount(player.name) }}场)</span>
                  </div>
                </div>
                <div class="player-total-score" :class="getScoreClass(player.score)">
                  {{ player.score > 0 ? '+' : '' }}{{ player.score }}
                </div>
                <div class="expand-icon">
                  {{ expandedPlayer === player.name ? '▼' : '▶' }}
                </div>
              </div>
              
              <!-- 展开后显示角色表现 -->
              <div v-if="expandedPlayer === player.name" class="player-detail-panel">
                <div class="role-performance">
                  <div class="role-item emperor-role">
                    <div class="role-icon">👑</div>
                    <div class="role-metrics">
                      <div class="metric">
                        <span class="metric-label">次数</span>
                        <span class="metric-value">{{ getPlayerRoleCount(player.name, 'emperor') }}</span>
                      </div>
                      <div class="metric">
                        <span class="metric-label">胜率</span>
                        <span class="metric-value">{{ getPlayerRoleWinRate(player.name, 'emperor') }}%</span>
                      </div>
                      <div class="metric">
                        <span class="metric-label">得分</span>
                        <span class="metric-value" :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'emperor'))">
                          {{ formatScore(getPlayerRoleTotalScore(player.name, 'emperor')) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="role-item guard-role">
                    <div class="role-icon">🛡️</div>
                    <div class="role-metrics">
                      <div class="metric">
                        <span class="metric-label">次数</span>
                        <span class="metric-value">{{ getPlayerRoleCount(player.name, 'guard') }}</span>
                      </div>
                      <div class="metric">
                        <span class="metric-label">胜率</span>
                        <span class="metric-value">{{ getPlayerRoleWinRate(player.name, 'guard') }}%</span>
                      </div>
                      <div class="metric">
                        <span class="metric-label">得分</span>
                        <span class="metric-value" :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'guard'))">
                          {{ formatScore(getPlayerRoleTotalScore(player.name, 'guard')) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="role-item farmer-role">
                    <div class="role-icon">👨‍🌾</div>
                    <div class="role-metrics">
                      <div class="metric">
                        <span class="metric-label">次数</span>
                        <span class="metric-value">{{ getPlayerRoleCount(player.name, 'farmer') }}</span>
                      </div>
                      <div class="metric">
                        <span class="metric-label">胜率</span>
                        <span class="metric-value">{{ getPlayerRoleWinRate(player.name, 'farmer') }}%</span>
                      </div>
                      <div class="metric">
                        <span class="metric-label">得分</span>
                        <span class="metric-value" :class="getScoreClass(getPlayerRoleTotalScore(player.name, 'farmer'))">
                          {{ formatScore(getPlayerRoleTotalScore(player.name, 'farmer')) }}
                        </span>
                      </div>
                    </div>
                  </div>
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
    const gameHistoryRef = computed(() => props.gameHistory);
    const sortedPlayers = computed(() => sortPlayers(props.players));
    
    // 展开的玩家详情
    const expandedPlayer = ref(null);
    
    const togglePlayerDetails = (playerName) => {
      if (expandedPlayer.value === playerName) {
        expandedPlayer.value = null;
      } else {
        expandedPlayer.value = playerName;
      }
    };
    
    const {
      emperorTeamWinRate,
      emperorAvgScore,
      farmerAvgScore,
      getPlayerRoleCount,
      getPlayerRoleWinRate,
      getPlayerRoleTotalScore,
      getPlayerWinRate,
      getPlayerWinCount,
      mvpPlayers
    } = useGameStats(computed(() => props.players), gameHistoryRef);

    // 计算有多少玩家并列第一
    const topPlayerCount = computed(() => {
      if (sortedPlayers.value.length <= 1) return 1;
      
      const topScore = sortedPlayers.value[0].score;
      let count = 1;
      
      for (let i = 1; i < sortedPlayers.value.length; i++) {
        if (sortedPlayers.value[i].score === topScore) {
          count++;
        } else {
          break;
        }
      }
      
      return count;
    });
    
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
      getPlayerRoleTotalScore,
      getPlayerWinRate,
      getPlayerWinCount,
      mvpPlayers,
      topPlayerCount,
      expandedPlayer,
      togglePlayerDetails
    };
  }
};
</script>

<style scoped>
.modal-container {
  max-width: 620px;
  width: 92%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-radius: 12px;
  overflow: hidden;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--primary-color);
  color: white;
  padding: 12px 16px;
}

.summary-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.games-count {
  background: rgba(255,255,255,0.2);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.summary-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f5f7fa;
}

/* 阵营统计 - 紧凑版 */
.team-stats-compact {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  padding: 0 5px;
}

.team-compact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
}

.emperor-team {
  background-color: rgba(255, 235, 59, 0.15);
}

.farmer-team {
  background-color: rgba(76, 175, 80, 0.1);
}

.team-icon {
  font-weight: 600;
  white-space: nowrap;
}

.team-stat {
  white-space: nowrap;
}

/* 玩家总分卡片 */
.score-summary {
  margin-bottom: 15px;
}

.score-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.tab {
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
}

.tab.active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  font-weight: 600;
}

.player-scores-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-score-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.player-score-card:hover {
  background-color: #f5f5f5;
}

.player-score-card.expanded {
  background-color: #f5f5f5;
}

.player-score-card::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #ddd;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.player-main-info {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  position: relative;
}

.top-player {
  background-color: #fff8e1;
}

.top-player::after {
  background-color: #ffd700;
}

.mvp-player::after {
  background-color: #ff9800;
}

.player-rank {
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  border-radius: 50%;
  margin-right: 10px;
  font-weight: 600;
  font-size: 13px;
}

.gold-rank {
  background-color: #ffd700;
  color: white;
}

.silver-rank {
  background-color: #c0c0c0;
  color: white;
}

.bronze-rank {
  background-color: #cd7f32;
  color: white;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name {
  font-weight: 600;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mvp-badge {
  font-size: 11px;
  background-color: #ff9800;
  color: white;
  padding: 1px 5px;
  border-radius: 8px;
  margin-left: 6px;
  font-weight: 500;
}

.player-stats {
  display: flex;
  font-size: 12px;
  color: #666;
}

.player-total-score {
  font-weight: bold;
  font-size: 16px;
  margin: 0 8px;
  font-family: 'Courier New', monospace;
  min-width: 50px;
  text-align: right;
  padding-right: 3px;
}

.expand-icon {
  font-size: 12px;
  color: #999;
  width: 16px;
  text-align: center;
}

/* 玩家详情面板 */
.player-detail-panel {
  background-color: white;
  padding: 10px 12px;
  border-top: 1px solid #eee;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { 
    max-height: 0;
    opacity: 0;
  }
  to { 
    max-height: 300px;
    opacity: 1;
  }
}

.role-performance {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}

.role-item {
  flex: 1 0 30%;
  min-width: 95px;
  padding: 5px;
  border-radius: 6px;
  border: 1px solid rgba(0,0,0,0.05);
}

.emperor-role {
  background-color: rgba(255, 235, 59, 0.08);
}

.guard-role {
  background-color: rgba(156, 39, 176, 0.04);
}

.farmer-role {
  background-color: rgba(76, 175, 80, 0.06);
}

.role-icon {
  display: inline-block;
  font-size: 14px;
  margin-right: 4px;
  vertical-align: middle;
}

.role-metrics {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 4px;
  padding-top: 3px;
}

.metric {
  flex: 1;
  text-align: center;
  border-radius: 4px;
  padding: 3px 0;
  background-color: rgba(0,0,0,0.02);
}

.metric-label {
  color: #777;
  font-size: 10px;
  display: block;
  margin-bottom: 1px;
}

.metric-value {
  font-weight: 600;
  font-size: 12px;
  display: block;
}

/* 按钮样式 */
.summary-actions {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  gap: 15px;
  background-color: white;
  border-top: 1px solid #eee;
}

.action-btn {
  padding: 10px 20px;
  border-radius: 20px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  font-size: 14px;
}

.return-btn {
  background-color: #757575;
  color: white;
}

.end-game-btn {
  background-color: var(--error-color);
  color: white;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 12px;
}

/* 工具类 */
.positive {
  color: var(--positive-score-color);
}

.negative {
  color: var(--negative-score-color);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .modal-container {
    width: 95%;
  }
  
  .summary-header h2 {
    font-size: 16px;
  }
  
  .games-count {
    padding: 3px 8px;
    font-size: 12px;
  }
  
  .team-stats-compact {
    flex-direction: column;
    gap: 6px;
  }
  
  .player-main-info {
    padding: 8px 10px;
  }
  
  .player-total-score {
    font-size: 15px;
    min-width: 45px;
  }
  
  .player-stats {
    font-size: 11px;
  }
  
  .player-rank {
    width: 20px;
    height: 20px;
    font-size: 12px;
    margin-right: 8px;
  }
  
  .role-performance {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    padding: 8px 15px;
    font-size: 13px;
  }
  
  .metric {
    font-size: 11px;
  }
}
</style>
