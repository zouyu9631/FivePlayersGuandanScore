<template>
  <div class="container">
    <!-- 游戏头部信息 -->
    <div class="game-header">
      <h2>总分</h2>
      <div class="player-scores">
        <div v-for="player in players" :key="player.name" class="player-score">
          <span>{{ player.name }}</span>
          <span :class="{ 'positive': player.score > 0, 'negative': player.score < 0 }">
            {{ player.score > 0 ? '+' : '' }}{{ player.score }}
          </span>
        </div>
      </div>
      <button @click="toggleHistory" class="history-btn">
        {{ showHistory ? '隐藏历史' : '显示历史' }} ↓
      </button>
    </div>

    <!-- 历史记录组件 -->
    <GameHistory v-if="showHistory" :gameHistory="gameHistory" />

    <!-- 叫牌区域 -->
    <CardSelector 
      v-model="calledCard"
      :currentRound="currentRound"
    />

    <!-- 排名区域 -->
    <PlayerRanking 
      v-model="playerRanking" 
      :emperor="emperor" 
      :guard="guard"
      @select-player="handlePlayerSelect"
    />

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button @click="handleResetRound" class="reset-btn">重置本局</button>
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
    <div v-if="showError" class="error-modal" @click="showError = false">
      <div class="error-container" @click.stop>
        <h3>信息不完整</h3>
        <p>{{ errorMessage }}</p>
        <div class="error-actions">
          <button @click="showError = false" class="error-btn">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { useGameLogic } from '../composables/useGameLogic';
import GameHistory from './GameHistory.vue';
import CardSelector from './CardSelector.vue';
import ConfirmationDialog from './ConfirmationDialog.vue';
import PlayerRanking from './PlayerRanking.vue';
import RoleAssignmentDialog from './RoleAssignmentDialog.vue';

export default {
  components: {
    GameHistory,
    CardSelector,
    ConfirmationDialog,
    PlayerRanking,
    RoleAssignmentDialog
  },
  
  props: {
    players: Array,
    gameHistory: Array,
    currentRound: Number,
  },
  
  emits: ['update-history', 'end-game'],
  
  setup(props, { emit }) {
    // 使用游戏逻辑
    const {
      playerRanking,
      emperor,
      guard,
      calledCard,
      scoreChanges,
      isReadyToCalculate,
      calculateScore,
      resetRound
    } = useGameLogic(props);

    // UI状态
    const showConfirmation = ref(false);
    const showHistory = ref(false);
    const showRoleSelection = ref(false);
    const showError = ref(false);
    const selectedPlayer = ref('');
    const errorMessage = ref('');
    const dialogPosition = ref({ x: 0, y: 0 }); // 新增：存储对话框位置

    // 监听props变化
    watch(() => props.players, (newVal) => {
      playerRanking.value = [...newVal];
    }, { deep: true });

    // 方法
    const toggleHistory = () => {
      showHistory.value = !showHistory.value;
    };

    const handleResetRound = () => {
      if (confirm('确定要重置本局数据吗？')) {
        resetRound(props.players);
      }
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
      // 移除对叫牌的检查，因为默认就是小王
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
        player.score += scoreChanges[player.name] || 0;
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
      dialogPosition.value = position || { x: 0, y: 0 }; // 保存点击位置
      showRoleSelection.value = true;
    };

    const assignRole = (role, playerName) => {
      if (role === 'emperor') {
        emperor.value = playerName;
      } else if (role === 'guard') {
        guard.value = playerName;
      }
      showRoleSelection.value = false;
    };

    const removeRoles = (playerName) => {
      // 合并条件，简化逻辑
      if (emperor.value === playerName) emperor.value = '';
      if (guard.value === playerName) guard.value = '';
      showRoleSelection.value = false;
    };

    return {
      playerRanking,
      emperor,
      guard,
      calledCard,
      showConfirmation,
      scoreChanges,
      isReadyToCalculate,
      showHistory,
      showRoleSelection,
      showError,
      errorMessage,
      selectedPlayer,
      dialogPosition,
      
      toggleHistory,
      handleResetRound,
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
.game-header {
  margin-bottom: 15px;
}

.player-scores {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 10px 0;
}

.player-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  text-align: center;
}

.positive {
  color: #4CAF50;
  font-weight: bold;
}

.negative {
  color: #F44336;
  font-weight: bold;
}

.history-btn {
  width: 100%;
  margin-top: 10px;
  background-color: #6c757d;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.reset-btn {
  background-color: #f44336;
}

.reset-btn:hover {
  background-color: #d32f2f;
}

.calculate-btn {
  background-color: #4CAF50;
}

.calculate-btn:hover {
  background-color: #388E3C;
}

.error-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 320px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.error-container h3 {
  margin-top: 0;
  text-align: center;
  color: #f44336;
  margin-bottom: 15px;
}

.error-container p {
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  justify-content: center;
}

.error-btn {
  background-color: #4a7bff;
  padding: 10px 30px;
}
</style>