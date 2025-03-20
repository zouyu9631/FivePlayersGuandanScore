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
      // 完全重置玩家数据，确保得分为0
      players.value = newPlayers.map(player => ({
        name: player.name,
        score: 0
      }));
      gameHistory.value = []; // 清空历史记录
      currentRound.value = 1; // 重置局数
      gameState.value = 'playing';
      saveGameState();
    };

    const updateHistory = (roundData) => {
      gameHistory.value.push(roundData);
      currentRound.value++;
      
      // 验证计算结果
      let expectedScores = {};
      players.value.forEach(p => {
        expectedScores[p.name] = 0;
      });
      
      // 从历史记录重新计算总分
      gameHistory.value.forEach((round) => {
        Object.keys(round.scoreChanges).forEach(playerName => {
          expectedScores[playerName] = (expectedScores[playerName] || 0) + Number(round.scoreChanges[playerName]);
        });
      });
      
      // 自动修正不一致的分数
      players.value.forEach(p => {
        if (p.score !== expectedScores[p.name]) {
          p.score = expectedScores[p.name];
        }
      });
      
      saveGameState();
    };

    // 直接回到设置页面
    const resetToSetup = () => {
      gameState.value = 'setup';
      // 完全清除所有数据
      players.value = [];
      gameHistory.value = [];
      currentRound.value = 1;
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
