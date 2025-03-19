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

export default {
  components: {
    PlayerSetup,
    GameBoard
  },
  setup() {
    const gameState = ref('setup'); // setup, playing
    const players = ref([]);
    const gameHistory = ref([]);
    const currentRound = ref(1);

    // 检查是否有存储的游戏
    const savedGame = localStorage.getItem('guandanGame');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame);
        if (parsedGame.players && parsedGame.gameState) {
          players.value = parsedGame.players;
          gameHistory.value = parsedGame.gameHistory || [];
          gameState.value = parsedGame.gameState;
          currentRound.value = parsedGame.currentRound || 1;
        }
      } catch (e) {
        console.error('Failed to parse saved game', e);
      }
    }

    const startGame = (newPlayers) => {
      players.value = newPlayers;
      gameState.value = 'playing';
      saveGameState();
    };

    const updateHistory = (roundData) => {
      gameHistory.value.push(roundData);
      currentRound.value++;
      saveGameState();
    };

    // 直接回到设置页面
    const resetToSetup = () => {
      gameState.value = 'setup';
      localStorage.removeItem('guandanGame'); // 清除存档
    };

    const saveGameState = () => {
      localStorage.setItem('guandanGame', JSON.stringify({
        players: players.value,
        gameHistory: gameHistory.value,
        gameState: gameState.value,
        currentRound: currentRound.value
      }));
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
