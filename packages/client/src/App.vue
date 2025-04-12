<template>
  <div class="app">
    <PlayerSetup v-if="gameState === 'setup'" @start-game="startGame" />
    <GameBoard 
      v-else
      :players="players" 
      :gameHistory="gameHistory"
      :currentRound="currentRound"
      @end-game="resetToSetup"
      @update-history="updateHistory"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import PlayerSetup from './components/PlayerSetup.vue';
import GameBoard from './components/GameBoard.vue';
import { loadGameState, saveGameState, clearGameState } from './utils/storageUtils';

export default {
  components: {
    PlayerSetup,
    GameBoard
  },
  setup() {
    const gameState = ref('setup');
    const players = ref([]);
    const gameHistory = ref([]);
    const currentRound = ref(1);
    
    const savedGame = loadGameState();
    if (savedGame && savedGame.players && savedGame.gameState) {
      players.value = savedGame.players;
      gameHistory.value = savedGame.gameHistory || [];
      gameState.value = savedGame.gameState;
      currentRound.value = savedGame.currentRound || 1;
    }
    
    const startGame = (newPlayers) => {
      players.value = newPlayers.map(player => ({ name: player.name, score: 0 }));
      gameHistory.value = [];
      currentRound.value = 1;
      gameState.value = 'playing';
      saveGameState({
        players: players.value,
        gameHistory: gameHistory.value,
        gameState: gameState.value,
        currentRound: currentRound.value
      });
    };
    
    const updateHistory = (roundData) => {
      players.value.forEach(player => {
        const scoreChange = Number(roundData.scoreChanges[player.name] || 0);
        player.score = Number(player.score || 0) + scoreChange;
      });
      
      gameHistory.value.push(roundData);
      currentRound.value++;
      
      saveGameState({
        players: players.value,
        gameHistory: gameHistory.value,
        gameState: gameState.value,
        currentRound: currentRound.value
      });
    };
    
    const resetToSetup = () => {
      gameState.value = 'setup';
      players.value = [];
      gameHistory.value = [];
      currentRound.value = 1;
      clearGameState();
    };
    
    return {
      gameState,
      players,
      gameHistory,
      currentRound,
      startGame,
      updateHistory,
      resetToSetup
    };
  }
};
</script>

<style>
.app {
  min-height: 100vh;
  background-color: #f5f7fa;
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
</style>
