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
            <tr class="role-row">
              <td class="round-cell">{{ i + 1 }}</td>
              <td v-for="player in sortedPlayerNames" :key="`${i}-${player}-role`" class="role-cell">
                <span v-if="player === round.emperor && player === round.guard" class="role-icon self-guard-icon">{{ ROLE_ICONS.SELF_GUARD }}</span>
                <span v-else-if="player === round.emperor" class="role-icon emperor-icon">{{ ROLE_ICONS.EMPEROR }}</span>
                <span v-else-if="player === round.guard" class="role-icon guard-icon">{{ ROLE_ICONS.GUARD }}</span>
                <span v-else class="role-placeholder">&nbsp;</span>
              </td>
            </tr>
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
import { computed, onMounted } from 'vue';
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
  
  setup(props) {
    const sortedPlayerNames = computed(() => {
      if (props.gameHistory.length === 0) return [];
      
      const playerNames = new Set();
      props.gameHistory.forEach(round => {
        Object.keys(round.scoreChanges || {}).forEach(name => {
          playerNames.add(name);
        });
      });
      
      const result = Array.from(playerNames);
      result.sort((a, b) => {
        const indexA = props.players.findIndex(p => p.name === a);
        const indexB = props.players.findIndex(p => p.name === b);
        return indexA - indexB;
      });
      
      return result;
    });
    
    const scrollToBottom = () => {
      setTimeout(() => {
        const container = document.querySelector('.history-table-container');
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    };
    
    onMounted(scrollToBottom);
    
    return {
      sortedPlayerNames,
      isRedCard,
      formatScore,
      getScoreClass,
      ROLE_ICONS,
      scrollToBottom
    };
  },
  
  updated() {
    this.scrollToBottom();
  }
};
</script>

<style scoped>
.history-panel {
  flex: 1;
  padding: 0 15px 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0;
  margin: 0;
  box-shadow: none;
  max-height: none;
  border-left: none;
}

.no-history {
  text-align: center;
  color: #666;
  padding: 40px 0;
  font-style: italic;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-table-container {
  overflow-y: auto;
  overflow-x: auto;
  flex-grow: 1;
  border-radius: 6px;
  background-color: #fcfcfc;
  border: 1px solid #f0f0f0;
  -webkit-overflow-scrolling: touch;
  will-change: transform;
  transform: translateZ(0);
  margin-top: 5px;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.history-table th {
  padding: 6px 4px;
  text-align: center;
  background-color: #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 2px solid var(--border-color);
  font-size: 0.92em;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.round-col {
  width: 40px;
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

.score-row {
  background-color: #fafafa;
}

.role-row {
  background-color: white;
}

@media (max-width: 480px) {
  .history-table th {
    padding: 5px 2px;
    font-size: 0.82em;
  }
  
  .role-row td, 
  .score-row td {
    padding-left: 2px;
    padding-right: 2px;
    font-size: 0.9em;
  }
  
  .round-col {
    width: 30px;
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
