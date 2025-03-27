<template>
  <div class="container">
    <div class="header-container">
      <h1>五人掼蛋记分器</h1>
      
      <button class="rules-button" @click="showRules = true" title="游戏规则">
        <span class="rules-icon">?</span>
      </button>
    </div>
    
    <div class="setup-card">
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
  padding: 20px;
  background-color: #f5f7fa;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  margin-bottom: 20px;
}

.header-container h1 {
  margin: 0;
  color: var(--primary-color);
  font-size: 24px;
}

.setup-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.setup-card h2 {
  margin-top: 0;
  color: var(--primary-color);
  font-size: 18px;
  border-bottom: 1px solid #e3f2fd;
  padding-bottom: 8px;
  margin-bottom: 15px;
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
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  color: #000;
}

.player-input input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  outline: none;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 10px;
}

.primary-btn {
  padding: 12px 25px;
  font-size: 16px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 10px rgba(33, 150, 243, 0.3);
}

.default-name {
  color: #999 !important;
}

.credits {
  text-align: center;
  font-size: 12px;
  color: #888;
  font-style: italic;
  margin-top: auto;
  padding: 10px 0;
}

.rules-button {
  position: relative;
  width: 36px;
  height: 36px;
  background-color: transparent;
  color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  border: none;
  box-sizing: border-box;
  min-width: 36px;
  min-height: 36px;
  max-width: 36px;
  max-height: 36px;
}

.rules-icon {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
  }
  
  .header-container h1 {
    font-size: 20px;
  }
  
  .rules-button {
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
  }
  
  .rules-icon {
    font-size: 20px;
  }
  
  .setup-card {
    padding: 15px;
  }
  
  .player-input input {
    padding: 10px 12px;
    font-size: 15px;
  }
  
  .primary-btn {
    padding: 10px 20px;
  }
}
</style>
