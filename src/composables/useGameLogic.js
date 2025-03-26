import { ref, reactive, computed } from 'vue';
import { getRankName } from '../utils/gameUtils';
import { calculateScores } from '../utils/guandanRules';

export function useGameLogic(props) {
  const playerRanking = ref([...props.players]);
  const emperor = ref('');
  const guard = ref('');
  const calledCard = ref('🃏');
  const scoreChanges = reactive({});
  
  const isReadyToCalculate = computed(() => {
    return emperor.value !== '' && guard.value !== '';
  });
  
  const isSelfGuard = computed(() => {
    return emperor.value === guard.value && emperor.value !== '';
  });
  
  const calculateScore = () => {
    const changes = calculateScores({
      playerRanking: playerRanking.value,
      emperor: emperor.value,
      guard: guard.value,
      isSelfGuard: isSelfGuard.value
    });
    
    Object.keys(changes).forEach(key => {
      scoreChanges[key] = changes[key];
    });
    
    return true;
  };
  
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
