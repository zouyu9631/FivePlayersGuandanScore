<template>
  <div class="container">
    <!-- 游戏头部信息 -->
    <GameHeader 
      :players="players" 
      :showHistory="showHistory" 
      @end-game="handleEndGame" 
      @toggle-history="toggleHistory"
    />

    <!-- 历史记录组件 -->
    <GameHistory v-if="showHistory" :gameHistory="gameHistory" :players="players" />

    <!-- 叫牌区域 -->
    <CardSelector v-model="calledCard" :currentRound="currentRound" />

    <!-- 排名区域 -->
    <PlayerRanking 
      v-model="playerRanking" 
      :emperor="emperor" 
      :guard="guard"
      @select-player="handlePlayerSelect"
    />

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button @click="handleCalculateScore" class="calculate-btn">计算得分</button>
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

.calculate-btn {
  background-color: var(--success-color);
  padding: 12px 25px;
  font-size: 16px;
}

.calculate-btn:hover {
  background-color: var(--success-color-dark); /* 替换硬编码的 #388E3C */
}
</style>