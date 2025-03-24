import { ref, reactive, computed } from 'vue';
import { getRankName } from '../utils/gameUtils';
import { calculateScores } from '../utils/guandanRules';

export function useGameLogic(props, emit) {
  // 状态变量
  const playerRanking = ref([...props.players]);
  const emperor = ref('');
  const guard = ref('');
  const calledCard = ref('🃏'); // 默认设置为小王
  const scoreChanges = reactive({});
  
  // 计算属性 - 检查皇帝是否已标记，以及侍卫是否已标记
  const isReadyToCalculate = computed(() => {
    return emperor.value !== '' && guard.value !== '';
  });

  // 计算皇帝是否自己是侍卫
  const isSelfGuard = computed(() => {
    return emperor.value === guard.value && emperor.value !== '';
  });

  // 计算得分逻辑
  const calculateScore = () => {
    // 使用规则工具计算分数
    const changes = calculateScores({
      playerRanking: playerRanking.value,
      emperor: emperor.value,
      guard: guard.value,
      isSelfGuard: isSelfGuard.value
    });
    
    // 更新scoreChanges引用
    Object.keys(changes).forEach(key => {
      scoreChanges[key] = changes[key];
    });
    
    return true;  // 表示计算完成
  };

  // 重置当前局
  const resetRound = (players) => {
    emperor.value = '';
    guard.value = '';
    calledCard.value = '🃏';
    playerRanking.value = [...players];
    Object.keys(scoreChanges).forEach(key => {
      scoreChanges[key] = 0;
    });
  };

  return {
    playerRanking,
    emperor,
    guard,
    calledCard,
    scoreChanges,
    isReadyToCalculate,
    isSelfGuard,
    calculateScore,
    resetRound,
    getRankName
  };
}
