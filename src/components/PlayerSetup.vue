<template>
  <div class="container">
    <h1>五人掼蛋记分器</h1>
    <div class="card">
      <h2>玩家设置</h2>
      <div class="players-container">
        <div v-for="(player, index) in players" :key="index" class="player-input">
          <input 
            type="text" 
            v-model="player.name" 
            :placeholder="`玩家${index + 1}`" 
            maxlength="8" 
            @blur="validateName(index)"
          />
        </div>
      </div>
      <div class="actions">
        <button @click="startGame" class="primary-btn">开始游戏</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['start-game'],
  setup(props, { emit }) {
    const players = ref([
      { name: '玩家1', score: 0 },
      { name: '玩家2', score: 0 },
      { name: '玩家3', score: 0 },
      { name: '玩家4', score: 0 },
      { name: '玩家5', score: 0 }
    ]);

    const validateName = (index) => {
      // 检查空名字
      if (!players.value[index].name.trim()) {
        players.value[index].name = `玩家${index + 1}`;
      }
      
      // 检查名字长度
      const name = players.value[index].name.trim();
      if (name.length > 8) {
        players.value[index].name = name.substring(0, 8);
      }
      
      // 检查重复名字
      const duplicateCount = players.value.filter(p => p.name === players.value[index].name).length;
      if (duplicateCount > 1) {
        let counter = 1;
        while (players.value.some(p => p !== players.value[index] && p.name === `${players.value[index].name}${counter}`)) {
          counter++;
        }
        players.value[index].name = `${players.value[index].name}${counter}`;
      }
    };

    const startGame = () => {
      // 验证所有名字
      players.value.forEach((_, index) => validateName(index));
      emit('start-game', players.value);
    };

    return {
      players,
      startGame,
      validateName
    };
  }
};
</script>

<style scoped>
.players-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.player-input {
  display: flex;
}

.player-input input {
  flex: 1;
  width: 100%;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.primary-btn {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
