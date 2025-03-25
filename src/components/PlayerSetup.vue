<template>
  <div class="container">
    <!-- 修改这里，添加header-container -->
    <div class="header-container">
      <h1>五人掼蛋记分器</h1>
      
      <!-- 添加问号图标按钮 -->
      <button class="rules-button" @click="showRules = true" title="游戏规则">
        <span class="rules-icon">?</span>
      </button>
    </div>
    
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
    
    <!-- 添加规则模态框 -->
    <RulesModal v-if="showRules" @close="showRules = false" />
  </div>
</template>

<script>
import { ref } from 'vue';
import RulesModal from './RulesModal.vue';
import { validatePlayerName } from '../utils/validationUtils';
import { DEFAULT_PLAYER_NAMES } from '../config/gameConfig';

export default {
  components: {
    RulesModal
  },
  emits: ['start-game'],
  setup(props, { emit }) {
    const defaultNames = DEFAULT_PLAYER_NAMES;
    const showRules = ref(false);
    
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
      const existingNames = players.value
        .filter((_, i) => i !== index)
        .map(p => p.name);
        
      const result = validatePlayerName(
        players.value[index].name, 
        existingNames, 
        defaultNames[index]
      );
      
      players.value[index].name = result.processedName;
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
      isDefaultName,
      showRules
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

/* 添加标题容器样式 */
.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 20px;
}

.header-container h1 {
  margin: 0;
}

/* 修改问号按钮样式，确保在所有设备上都保持圆形 */
.rules-button {
  position: relative; /* 改为相对定位 */
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(var(--primary-color), 0.05);
  color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1.5px solid rgba(var(--primary-color), 0.5);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: all 0.2s ease;
  padding: 0;
  box-sizing: border-box; /* 确保边框不会改变尺寸 */
  min-width: 36px; /* 添加最小宽度 */
  min-height: 36px; /* 添加最小高度 */
  max-width: 36px; /* 添加最大宽度 */
  max-height: 36px; /* 添加最大高度 */
  overflow: hidden; /* 防止内容溢出 */
  -webkit-border-radius: 50%; /* 兼容老旧浏览器 */
  -moz-border-radius: 50%; /* 兼容老旧浏览器 */
}

.rules-button:hover {
  background-color: rgba(var(--primary-color), 0.2);
  color: var(--primary-color);
  transform: scale(1.05);
}

.rules-icon {
  font-size: 20px;
  font-weight: normal;
  line-height: 1; /* 确保文本垂直居中 */
  text-align: center; /* 确保文本水平居中 */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 480px) {
  .rules-button {
    /* 删除top和right属性 */
    width: 32px;
    height: 32px;
    min-width: 32px; /* 保持一致的最小宽度 */
    min-height: 32px; /* 保持一致的最小高度 */
    max-width: 32px; /* 保持一致的最大宽度 */
    max-height: 32px; /* 保持一致的最大高度 */
  }
  
  .rules-icon {
    font-size: 18px;
  }
}
</style>
