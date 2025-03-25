<template>
  <div class="container">
    <!-- 游戏头部信息 -->
    <GameHeader 
      :players="players" 
      :showHistory="showHistory"
      @toggle-history="toggleHistory"
    />

    <!-- 叫牌区域 -->
    <CardSelector v-model="calledCard" :currentRound="currentRound" />

    <!-- 排名区域 -->
    <PlayerRanking 
      v-model="playerRanking" 
      :emperor="emperor" 
      :guard="guard"
      @select-player="handlePlayerSelect"
    />

    <!-- 历史记录抽屉 -->
    <transition name="drawer">
      <div v-if="showHistory" class="history-drawer-container" @click.self="toggleHistory">
        <div class="history-drawer">
          <div class="history-drawer-header">
            <h3>历史记录</h3>
            <button class="close-drawer-btn" @click="toggleHistory">✕</button>
          </div>
          <GameHistory :gameHistory="gameHistory" :players="players" />
        </div>
      </div>
    </transition>

    <!-- 浮动操作按钮 -->
    <div class="floating-btns-container">
      <button class="floating-action-btn summary-btn" @click="handleEndGame">
        <span class="summary-icon">📊</span>
        <span class="summary-text">结算总分</span>
      </button>
      
      <button class="floating-action-btn calculate-btn" @click="handleCalculateScore">
        <span class="calculate-icon">💰</span>
        <span class="calculate-text">计算本局得分</span>
      </button>
    </div>

    <!-- 弹窗组件 -->
    <RoleAssignmentDialog
      v-if="showRoleSelection"
      :player="selectedPlayer"
      :current-emperor="emperor"
      :current-guard="guard"
      :position="dialogPosition" 
      @close="showRoleSelection = false"
      @assign="assignRole"
      @remove="removeRoles"
    />
    
    <!-- 确认对话框 -->
    <ConfirmationDialog
      v-if="showConfirmation"
      :calledCard="calledCard"
      :playerRanking="playerRanking"
      :emperor="emperor"
      :guard="guard"
      :scoreChanges="scoreChanges"
      @confirm="confirmScore"
      @cancel="showConfirmation = false"
    />
    
    <!-- 错误提示弹窗 -->
    <ErrorModal 
      v-if="showError" 
      :message="errorMessage" 
      @close="showError = false"
    />
    
    <!-- 游戏结算弹窗 -->
    <GameSummaryModal
      v-if="showGameSummary"
      :players="players"
      :gameHistory="gameHistory"
      @continue="showGameSummary = false"
      @end="confirmEndGame"
    />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useGameLogic } from '../composables/useGameLogic';
import GameHeader from './GameHeader.vue';
import GameHistory from './GameHistory.vue';
import CardSelector from './CardSelector.vue';
import ConfirmationDialog from './ConfirmationDialog.vue';
import PlayerRanking from './PlayerRanking.vue';
import RoleAssignmentDialog from './RoleAssignmentDialog.vue';
import ErrorModal from './ErrorModal.vue';
import GameSummaryModal from './GameSummaryModal.vue';

export default {
  components: {
    GameHeader,
    GameHistory,
    CardSelector,
    ConfirmationDialog,
    PlayerRanking,
    RoleAssignmentDialog,
    ErrorModal,
    GameSummaryModal
  },
  
  props: {
    players: Array,
    gameHistory: Array,
    currentRound: Number,
  },
  
  emits: ['update-history', 'end-game'],
  
  setup(props, { emit }) {
    // 游戏逻辑状态
    const {
      playerRanking,
      emperor,
      guard,
      calledCard,
      scoreChanges,
      calculateScore,
      resetRound
    } = useGameLogic(props);

    // UI状态
    const showConfirmation = ref(false);
    const showHistory = ref(false);
    const showRoleSelection = ref(false);
    const showError = ref(false);
    const showGameSummary = ref(false);
    const selectedPlayer = ref('');
    const errorMessage = ref('');
    const dialogPosition = ref({ x: 0, y: 0 });

    // 监听props变化
    watch(() => props.players, (newVal) => {
      playerRanking.value = [...newVal];
    }, { deep: true });

    // 方法
    const toggleHistory = () => showHistory.value = !showHistory.value;
    
    const handleEndGame = () => showGameSummary.value = true;
    
    const confirmEndGame = () => {
      emit('end-game');
    };

    const checkRequiredInfo = () => {
      if (!emperor.value) {
        errorMessage.value = '请选择一位玩家作为皇帝';
        return false;
      }
      if (!guard.value) {
        errorMessage.value = '请选择一位玩家作为侍卫（如果皇帝自保，请将皇帝也设为侍卫）';
        return false;
      }
      return true;
    };

    const handleCalculateScore = () => {
      if (!checkRequiredInfo()) {
        showError.value = true;
        return;
      }
      
      if (calculateScore()) {
        showConfirmation.value = true;
      }
    };

    const confirmScore = () => {
      // 更新玩家总分
      props.players.forEach(player => {
        // 确保分数是数值类型
        const scoreChange = Number(scoreChanges[player.name] || 0);
        player.score = Number(player.score || 0) + scoreChange;
      });
      
      // 记录本轮数据
      const roundData = {
        emperor: emperor.value,
        guard: guard.value || '',
        calledCard: calledCard.value,
        ranking: playerRanking.value.map(p => p.name),
        scoreChanges: {...scoreChanges}
      };
      
      // 发送更新
      emit('update-history', roundData);
      
      // 重置本局
      resetRound(props.players);
      showConfirmation.value = false;
    };

    const handlePlayerSelect = (playerName, position) => {
      selectedPlayer.value = playerName;
      dialogPosition.value = position || { x: 0, y: 0 };
      showRoleSelection.value = true;
    };

    const assignRole = (role, playerName) => {
      if (role === 'emperor') emperor.value = playerName;
      else if (role === 'guard') guard.value = playerName;
      showRoleSelection.value = false;
    };

    const removeRoles = (playerName) => {
      if (emperor.value === playerName) emperor.value = '';
      if (guard.value === playerName) guard.value = '';
      showRoleSelection.value = false;
    };

    return {
      playerRanking,
      emperor,
      guard,
      calledCard,
      scoreChanges,
      showConfirmation,
      showHistory,
      showRoleSelection,
      showError,
      showGameSummary,
      errorMessage,
      selectedPlayer,
      dialogPosition,
      
      toggleHistory,
      handleEndGame,
      confirmEndGame,
      handleCalculateScore,
      confirmScore,
      handlePlayerSelect,
      assignRole,
      removeRoles
    };
  }
};
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

/* 浮动按钮容器 */
.floating-btns-container {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 50;
}

.floating-action-btn {
  color: white;
  border-radius: 30px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  border: none;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  max-width: 48%;
}

.calculate-btn {
  background-color: var(--success-color);
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

.calculate-btn:hover {
  background-color: var(--success-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(76, 175, 80, 0.4);
}

.summary-btn {
  background-color: var(--error-color);
  box-shadow: 0 4px 10px rgba(244, 67, 54, 0.3);
}

.summary-btn:hover {
  background-color: var(--error-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(244, 67, 54, 0.4);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .floating-action-btn {
    padding: 10px 16px;
    font-size: 14px;
  }
  
  .floating-btns-container {
    bottom: 15px;
    padding: 0 15px;
  }
  
  .calculate-icon, .summary-icon {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .calculate-text, .summary-text {
    font-size: 13px;
  }
  
  .floating-action-btn {
    padding: 8px 14px;
  }
  
  .floating-btns-container {
    padding: 0 10px;
  }
}

.container {
  padding-bottom: 140px; /* 为两个浮动按钮留出空间 */
  overflow-x: hidden; /* 防止水平滚动条出现 */
  position: relative;
}

/* 历史记录过渡动画 - 优化动画效果和解决"弹跳"问题 */
.slide-enter-active,
.slide-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.25s ease,
              margin-bottom 0.25s ease;
  max-height: 300px;
  overflow: hidden;
  margin-bottom: 20px;
  will-change: max-height, opacity, margin-bottom;
  transform: translate3d(0, 0, 0); /* 促进硬件加速 */
}

/* 移除未使用的动画类 */
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
}

/* 完全重新设计历史记录抽屉 */
.history-drawer-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(2px); /* 轻微模糊背景 */
}

.history-drawer {
  background: white;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.history-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background-color: #fcfcfc;
}

.history-drawer-header h3 {
  margin: 0;
  color: var(--primary-color);
  font-size: 18px;
  font-weight: 600;
}

.close-drawer-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-drawer-btn:hover {
  background-color: #f5f5f5;
  color: #333;
}

/* 抽屉动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .history-drawer {
    width: 95%;
    max-height: 85vh;
  }
}
</style>