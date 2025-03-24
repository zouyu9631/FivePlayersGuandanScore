<template>
  <div class="history-panel">
    <div v-if="gameHistory.length === 0" class="no-history">
      暂无历史记录
    </div>
    <div v-else class="history-table-container">
      <table class="history-table">
        <thead>
          <tr>
            <th class="round-col" rowspan="2">局</th>
            <th v-for="player in sortedPlayerNames" :key="player" colspan="1">{{ player }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(round, i) in gameHistory" :key="i">
            <!-- 第一行：局号 + 角色信息 -->
            <tr class="role-row">
              <td class="round-cell">{{ i + 1 }}</td>
              <td v-for="player in sortedPlayerNames" :key="`${i}-${player}-role`" class="role-cell">
                <span v-if="player === round.emperor && player !== round.guard" class="role-icon emperor-icon" title="皇帝">{{ ROLE_ICONS.EMPEROR }}</span>
                <span v-else-if="player === round.guard && player !== round.emperor" class="role-icon guard-icon" title="侍卫">{{ ROLE_ICONS.GUARD }}</span>
                <span v-else-if="player === round.emperor && player === round.guard" class="role-icon self-guard-icon" title="皇帝自保">{{ ROLE_ICONS.SELF_GUARD }}</span>
                <span v-else class="role-placeholder">&nbsp;</span>
              </td>
            </tr>
            <!-- 第二行：叫牌 + 分数信息 -->
            <tr class="score-row">
              <td class="card-cell">
                <span :class="{ 'red-card': isRedCard(round.calledCard) }">
                  {{ round.calledCard }}
                </span>
              </td>
              <td v-for="player in sortedPlayerNames" :key="`${i}-${player}-score`" 
                  :class="{ 
                    'positive': (round.scoreChanges[player] || 0) > 0, 
                    'negative': (round.scoreChanges[player] || 0) < 0,
                    'score-cell': true
                  }">
                {{ formatScore(round.scoreChanges[player] || 0) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { isRedCard } from '../utils/cardUtils';
import { formatScore, getScoreClass } from '../utils/gameUtils';
import { ROLE_ICONS } from '../config/gameConfig';

export default {
  name: 'GameHistory',
  props: {
    gameHistory: {
      type: Array,
      required: true
    },
    players: {
      type: Array,
      required: true
    }
  },
  computed: {
    // 按照总分页面相同的顺序排列玩家
    sortedPlayerNames() {
      if (this.gameHistory.length === 0) return [];
      
      // 从历史记录中获取所有玩家名称
      const playerNames = new Set();
      this.gameHistory.forEach(round => {
        Object.keys(round.scoreChanges).forEach(name => {
          playerNames.add(name);
        });
      });
      
      // 使用players数组中的顺序排序
      const result = Array.from(playerNames);
      result.sort((a, b) => {
        const indexA = this.players.findIndex(p => p.name === a);
        const indexB = this.players.findIndex(p => p.name === b);
        return indexA - indexB;
      });
      
      return result;
    }
  },
  methods: {
    isRedCard,
    formatScore,
    getScoreClass
  },
  data() {
    return {
      ROLE_ICONS
    };
  },
  mounted() {
    // 确保显示最新的记录
    this.$nextTick(() => {
      const container = this.$el.querySelector('.history-table-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  },
  updated() {
    // 当历史记录更新时，滚动到最新记录
    this.$nextTick(() => {
      const container = this.$el.querySelector('.history-table-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
};
</script>

<style scoped>
.history-panel {
  background: white;
  border-radius: 8px;
  padding: 10px; /* 从12px减小到10px */
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-height: 300px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.no-history {
  text-align: center;
  color: #666;
  padding: 20px 0;
}

.history-table-container {
  overflow-y: auto;
  overflow-x: auto;
  flex-grow: 1;
  margin-top: 2px; /* 添加少量顶部边距代替移除的标题 */
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.history-table th {
  padding: 6px 4px; /* 从8px减小到6px */
  text-align: center;
  background-color: #f5f5f5;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 2px solid var(--border-color);
  font-size: 0.92em; /* 减小字体大小 */
}

/* 局号格样式 */
.round-col {
  width: 40px; /* 从50px减小到40px */
  vertical-align: middle;
}

.round-cell {
  font-weight: bold;
  text-align: center;
  border-right: 1px solid var(--border-color);
  vertical-align: middle;
  padding: 8px 4px 6px 4px;
  background-color: #f8f8f8;
  font-size: 1em;
}

.card-cell {
  text-align: center;
  border-right: 1px solid var(--border-color);
  padding: 6px 4px 8px 4px;
  font-size: 0.9em;
  color: #666;
  background-color: #f8f8f8;
}

/* 角色行样式 */
.role-row td {
  border-bottom: none;
  text-align: center;
  padding: 8px 4px 0px 4px;
  min-height: 32px;
}

.role-cell {
  text-align: center;
  padding-top: 8px !important;
  padding-bottom: 0px !important;
  vertical-align: bottom;
}

.role-placeholder {
  display: inline-block;
  height: 20px;
}

/* 分数行样式 */
.score-row td {
  border-bottom: 1px solid var(--border-color);
  text-align: center;
  padding: 0px 4px 8px 4px;
  font-weight: 500;
}

.score-row:last-child td {
  border-bottom: 2px solid var(--border-color);
}

.score-cell {
  text-align: center;
  vertical-align: top;
  padding-top: 2px !important;
}

/* 图标和颜色 */
.role-icon {
  display: inline-block;
  line-height: 1;
  font-size: 18px;
}

.self-guard-icon {
  color: var(--self-guard-color);
}

.emperor-icon {
  color: var(--emperor-color);
}

.guard-icon {
  color: var(--guard-color);
}

.positive {
  color: var(--positive-score-color);
  font-weight: bold;
}

.negative {
  color: var(--negative-score-color);
  font-weight: bold;
}

/* 移除零分样式，因为在游戏规则中不会出现零分情况 */

/* 行的视觉分组 */
.score-row {
  background-color: #fafafa;
}

.role-row {
  background-color: white;
}

/* 移动端优化 */
@media (max-width: 480px) {
  .history-table th {
    padding: 5px 2px; /* 更进一步减小内边距 */
    font-size: 0.82em;
  }
  
  .role-row td, 
  .score-row td {
    padding-left: 2px;
    padding-right: 2px;
    font-size: 0.9em;
  }
  
  .round-col {
    width: 30px; /* 减小到30px */
  }
  
  .card-cell {
    font-size: 0.85em;
  }
  
  .role-icon {
    font-size: 16px;
  }
}

.red-card {
  color: var(--red-card-color);
}
</style>
