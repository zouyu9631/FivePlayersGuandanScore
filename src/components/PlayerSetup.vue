<template>
  <div class="container">
    <h1>五人掼蛋记分器</h1>
    <div class="card">
      <h2>输入五位玩家的名字</h2>
      <div class="players-container">
        <div v-for="(player, index) in players" :key="index" class="player-input">
          <input 
            type="text" 
            v-model="player.name" 
            :placeholder="defaultNames[index]" 
            maxlength="8" 
            @blur="validateName(index)"
            @focus="onFocus(index)"
            :class="{'default-name': isDefaultName(index)}"
          />
        </div>
        <div class="actions">
          <button @click="startGame" class="primary-btn">开始游戏</button>
        </div>
      </div>
    </div>
    <div class="credits">
      感谢许公子，让掼蛋多了一份精彩
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['start-game'],
  setup(props, { emit }) {
    const defaultNames = ["关羽", "张飞", "赵云", "马超", "黄忠"];
    
    const players = ref([
      { name: '', score: 0 },
      { name: '', score: 0 },
      { name: '', score: 0 },
      { name: '', score: 0 },
      { name: '', score: 0 }
    ]);

    const isDefaultName = (index) => {
      return !players.value[index].name || players.value[index].name === defaultNames[index];
    };

    const onFocus = (index) => {
      // 当用户点击输入框时，确保内容为空，方便输入
      if (players.value[index].name === defaultNames[index]) {
        players.value[index].name = '';
      }
    };

    const validateName = (index) => {
      // 检查空名字
      if (!players.value[index].name.trim()) {
        players.value[index].name = defaultNames[index];
        return;
      }
      
      // 检查名字长度 - 限制为4个汉字或8个英文/数字
      const name = players.value[index].name.trim();
      const chineseRegex = /[\u4e00-\u9fa5]/g;
      const chineseChars = name.match(chineseRegex) || [];
      const chineseLength = chineseChars.length;
      const otherLength = name.length - chineseLength;
      
      // 如果汉字超过4个或总长度超过8个字符，进行截断
      if (chineseLength > 4 || (chineseLength * 2 + otherLength) > 8) {
        let result = '';
        let currentChineseCount = 0;
        let currentTotalLength = 0;
        
        for (const char of name) {
          const isChineseChar = /[\u4e00-\u9fa5]/.test(char);
          
          if (isChineseChar) {
            if (currentChineseCount < 4 && currentTotalLength < 8) {
              result += char;
              currentChineseCount++;
              currentTotalLength += 2; // 汉字算两个字符长度
            }
          } else {
            if (currentTotalLength < 8) {
              result += char;
              currentTotalLength++;
            }
          }
        }
        
        players.value[index].name = result;
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
      defaultNames,
      startGame,
      validateName,
      onFocus,
      isDefaultName
    };
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 10px;
}

.card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.players-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  flex: 1;
}

.player-input {
  display: flex;
}

.player-input input {
  flex: 1;
  width: 100%;
  color: #000; /* 自定义输入的名字为黑色 */
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
}

.primary-btn {
  padding: 10px 20px;
  font-size: 16px;
}

.default-name {
  color: #999 !important; /* 使用灰色表示默认名称 */
}

.credits {
  text-align: center;
  font-size: 12px;
  color: #888;
  font-style: italic;
  margin-top: auto;
  padding: 10px 0;
}
</style>
