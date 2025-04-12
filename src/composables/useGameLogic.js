import { ref, reactive, computed, watch } from 'vue';
import { getRankName } from '../utils/gameUtils';
import { calculateScores } from '../utils/guandanRules';
import { DEFAULT_CALLED_CARD } from '../config/gameConfig';

export function useGameLogic(props) {
  const playerRanking = ref([...props.players]);
  const emperor = ref('');
  const guard = ref('');
  const calledCard = ref(DEFAULT_CALLED_CARD);
  const scoreChanges = reactive({});
  
  watch(() => props.players, (newPlayers) => {
    playerRanking.value = [...newPlayers];
  }, { deep: true });
  
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
    
    Object.keys(scoreChanges).forEach(key => delete scoreChanges[key]);
    Object.entries(changes).forEach(([key, value]) => {
      scoreChanges[key] = value;
    });
    
    return true;
  };
  
  const resetRound = () => {
    emperor.value = '';
    guard.value = '';
    calledCard.value = DEFAULT_CALLED_CARD;
    playerRanking.value = [...props.players];
    
    Object.keys(scoreChanges).forEach(key => {
      delete scoreChanges[key];
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
