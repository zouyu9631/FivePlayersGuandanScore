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
    },
    showHistory: {
      type: Boolean,
      default: false
    }
  },
  emits: ['end-game', 'toggle-history'],
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
  border-left: 4px solid var(--primary-color);
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

/* 历史记录按钮样式 - 更小巧精致的设计 */
.history-button {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background-color: rgba(74, 123, 255, 0.1);
  border: 1px solid rgba(74, 123, 255, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--primary-color);
  font-weight: 500;
  height: 28px;
}

.history-button:hover {
  background-color: rgba(74, 123, 255, 0.15);
  box-shadow: 0 2px 5px rgba(74, 123, 255, 0.2);
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
  width: 19%; /* 确保五个玩家在一行显示 */
  text-align: center;
  padding: 5px 0;
  margin: 0;
  border-radius: 6px;
  transition: all 0.2s;
}

/* 移除悬停效果，玩家名称就显示为静态元素 */
.player-score:hover {
  background-color: transparent; /* 移除悬停背景色 */
}

.player-score .player-name {
  font-size: 14px; /* 减小字体以确保能够放下 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin-bottom: 4px;
}

.positive {
  color: var(--positive-score-color);
  font-weight: bold;
  font-size: 1.1em;
}

.negative {
  color: var(--negative-score-color);
  font-weight: bold;
  font-size: 1.1em;
}

.zero-score {
  color: var(--zero-score-color);
  font-weight: normal;
}

/* 移除不再使用的历史按钮样式 */
.history-btn {
  width: 100%;
  margin-top: 10px;
  background-color: white;
  color: #555;
  border: 1px solid #e0e0e0;
  height: 36px;
  padding: 6px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.history-btn:hover {
  background-color: #f8f9fa;
  color: var(--primary-color);
}

/* 移除旧的历史指示器样式 */
.history-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 5px auto 0;
  padding: 5px 0 7px;
  cursor: pointer;
  border-top: 1px solid #f0f0f0;
  user-select: none;
  opacity: 0.8;
  transition: all 0.2s ease;
}

.history-indicator:hover {
  opacity: 1;
  background-color: rgba(0,0,0,0.02);
}

.history-handle {
  width: 30px;
  height: 3px;
  background-color: #bbb;
  border-radius: 2px;
  margin-bottom: 4px;
}

.history-text {
  font-size: 12px;
  color: #777;
}

/* 当历史记录显示时的样式变化 */
.header-card:has(+ .history-panel) .history-indicator {
  background-color: #f0f0f0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .history-indicator {
    padding: 6px 0 8px;
    width: 70px;
  }
  
  .history-handle {
    width: 26px;
    height: 3px;
  }
  
  .history-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .header-top {
    /* 不再需要列方向，保持在一行 */
    flex-direction: row;
    align-items: center;
  }
  
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
