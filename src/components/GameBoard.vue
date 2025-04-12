<template>
  <div class="container">
    <GameHeader 
      :players="players"
      @show-rules="showRules = true"
    />
    <CardSelector v-model="calledCard" :currentRound="currentRound" />
    <PlayerRanking 
      v-model="playerRanking" 
      :emperor="emperor" 
      :guard="guard"
      @select-player="handlePlayerSelect"
    />
    <RulesModal v-if="showRules" @close="showRules = false" />

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

    <div class="bottom-action-bar">
      <button class="action-btn history-btn" @click="toggleHistory">
        <span class="action-icon">📜</span>
        <span class="action-text">历史记录</span>
      </button>
      <button class="action-btn calculate-btn" @click="handleCalculateScore">
        <span class="action-icon">💰</span>
        <span class="action-text">计算本局</span>
      </button>
      <button class="action-btn summary-btn" @click="handleEndGame">
        <span class="action-icon">📊</span>
        <span class="action-text">结算总分</span>
      </button>
    </div>
    
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
    
    <ConfirmationDialog
      v-if="showConfirmation"
      :calledCard="calledCard"
      :playerRanking="playerRanking"
      :emperor="emperor"
      :guard="guard"
      :scoreChanges="scoreChanges"
      :currentRound="currentRound"
      @confirm="confirmScore"
      @cancel="showConfirmation = false"
    />
    
    <ErrorModal 
      v-if="showError" 
      :message="errorMessage" 
      @close="showError = false"
    />
    
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
import RulesModal from './RulesModal.vue';

export default {
  components: {
    GameHeader,
    GameHistory,
    CardSelector,
    ConfirmationDialog,
    PlayerRanking,
    RoleAssignmentDialog,
    ErrorModal,
    GameSummaryModal,
    RulesModal
  },
  
  props: {
    players: Array,
    gameHistory: Array,
    currentRound: Number,
  },
  
  emits: ['update-history', 'end-game'],
  
  setup(props, { emit }) {
    const {
      playerRanking,
      emperor,
      guard,
      calledCard,
      scoreChanges,
      calculateScore,
      resetRound
    } = useGameLogic(props);

    const showConfirmation = ref(false);
    const showHistory = ref(false);
    const showRoleSelection = ref(false);
    const showError = ref(false);
    const showGameSummary = ref(false);
    const showRules = ref(false);
    const selectedPlayer = ref('');
    const errorMessage = ref('');
    const dialogPosition = ref({ x: 0, y: 0 });

    watch(() => props.players, (newVal) => {
      playerRanking.value = [...newVal];
    }, { deep: true });

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
      const roundData = {
        emperor: emperor.value,
        guard: guard.value || '',
        calledCard: calledCard.value,
        ranking: playerRanking.value.map(p => p.name),
        scoreChanges: {...scoreChanges}
      };
      
      emit('update-history', roundData);
      
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
      showRules,
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
.container {
  padding-bottom: 80px;
  overflow-x: hidden;
  position: relative;
}

.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 -1px 6px rgba(0,0,0,0.08);
  padding: 10px 0;
  z-index: 50;
  border-top: 1px solid #eee;
  backdrop-filter: blur(5px);
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
  margin: 0 8px;
  max-width: 140px;
  background-color: white;
}

.calculate-btn {
  border-color: var(--primary-color);
  background-color: rgba(74, 123, 255, 0.08);
  box-shadow: 0 2px 4px rgba(74, 123, 255, 0.15);
}
.calculate-btn .action-icon {
  color: var(--primary-color);
}
.calculate-btn:active {
  background-color: rgba(74, 123, 255, 0.15);
}

.summary-btn {
  border-color: var(--error-color);
  background-color: rgba(244, 67, 54, 0.08);
  box-shadow: 0 2px 4px rgba(244, 67, 54, 0.15);
}
.summary-btn .action-icon {
  color: var(--error-color);
}
.summary-btn:active {
  background-color: rgba(244, 67, 54, 0.15);
}

.history-btn {
  border-color: var(--warning-color);
  background-color: rgba(255, 152, 0, 0.08);
  box-shadow: 0 2px 4px rgba(255, 152, 0, 0.15);
}
.history-btn .action-icon {
  color: var(--warning-color);
}
.history-btn:active {
  background-color: rgba(255, 152, 0, 0.15);
}

.action-icon {
  font-size: 16px;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .action-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .action-icon {
    font-size: 14px;
    margin-right: 5px;
  }
}

@media (max-width: 480px) {
  .action-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .action-text {
    font-size: 12px;
  }
  
  .action-icon {
    margin-right: 3px;
  }
}

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
  backdrop-filter: blur(2px);
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

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .history-drawer {
    width: 95%;
    max-height: 85vh;
  }
}
</style>