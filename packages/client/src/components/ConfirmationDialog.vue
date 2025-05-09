<template>
  <div class="confirmation-overlay" @click="$emit('cancel')" @touchmove.prevent>
    <div class="confirmation-dialog" @click.stop>
      <h3>请确认第 {{ currentRound }} 局游戏信息</h3>
      <div class="confirmation-content">
        <p>
          叫牌：
          <span :class="{ 'red-card': isRedCard(calledCard) }">
            {{ calledCard }}
          </span>
        </p>
        <div class="confirmation-ranks">
          <div v-for="(player, index) in playerRanking" :key="player.name" class="confirm-player-rank">
            <span>
              {{ getRankName(index) }}： {{ player.name }} 
              <span v-if="player.name === emperor && player.name === guard" class="self-guard-indicator">{{ ROLE_ICONS.SELF_GUARD }}</span>
              <span v-else-if="player.name === emperor" class="emperor-indicator">{{ ROLE_ICONS.EMPEROR }}</span>
              <span v-else-if="player.name === guard" class="guard-indicator">{{ ROLE_ICONS.GUARD }}</span>
            </span>
            <span :class="getScoreClass(scoreChanges[player.name])">
              {{ formatScore(scoreChanges[player.name]) }}
            </span>
          </div>
        </div>
      </div>
      <div class="confirmation-buttons">
        <button @click="$emit('cancel')" class="action-btn cancel-btn">返回游戏</button>
        <button @click="$emit('confirm')" class="action-btn confirm-btn">确认计算</button>
      </div>
    </div>
  </div>
</template>

<script>
import { isRedCard } from '../utils/cardUtils';
import { getRankName, formatScore, getScoreClass } from '../utils/gameUtils';
import { ROLE_ICONS } from '../config/gameConfig';

export default {
  props: {
    calledCard: String,
    playerRanking: Array,
    emperor: String,
    guard: String,
    scoreChanges: Object,
    currentRound: {
      type: Number,
      default: 1
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props) {
    return { getRankName, isRedCard, ROLE_ICONS, formatScore, getScoreClass };
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
  background: var(--modal-overlay);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.confirmation-dialog {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: inline-block;
  width: auto;
  max-width: 90%;
  min-width: 200px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.confirmation-dialog h3 {
  margin-top: 0;
  color: var(--primary-color);
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e3f2fd;
  padding-bottom: 8px;
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
  gap: 20px;
  margin-top: 20px;
}

.action-btn {
  color: var(--text-color);
  border-radius: 18px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  flex: 1;
  background-color: white;
}

.cancel-btn {
  border-color: #757575;
  background-color: rgba(117, 117, 117, 0.08);
  box-shadow: 0 2px 4px rgba(117, 117, 117, 0.15);
}

.confirm-btn {
  border-color: var(--primary-color);
  background-color: rgba(74, 123, 255, 0.08);
  box-shadow: 0 2px 4px rgba(74, 123, 255, 0.15);
}

.confirm-btn:active {
  background-color: rgba(74, 123, 255, 0.15);
}

.cancel-btn:active {
  background-color: rgba(117, 117, 117, 0.15);
}

.positive {
  color: var(--positive-score-color);
  font-weight: bold;
}

.negative {
  color: var(--negative-score-color);
  font-weight: bold;
}

.emperor-indicator,
.guard-indicator,
.self-guard-indicator {
  margin-left: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.self-guard-indicator {
  color: var(--self-guard-color);
}

.red-card {
  color: var(--red-card-color);
}
</style>
