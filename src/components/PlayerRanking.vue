<template>
  <div class="ranking-section">
    <h3>请设置本局玩家身份和排名</h3>
    <draggable 
      v-model="internalValue" 
      item-key="name"
      ghost-class="ghost-placeholder" 
      chosen-class="chosen-item"
      :animation="150"
      handle=".drag-handle"
      :delay="0"
      :delayOnTouchOnly="true"
      :touchStartThreshold="1"
      :forceFallback="true" 
      fallback-class="sortable-drag"
      :fallback-on-body="true"
      :scroll="true"
      :scroll-sensitivity="30"
      drag-class="dragging"
    >
      <template #item="{element, index}">
        <div class="player-rank" 
             :class="{ 
               'emperor-player': element.name === emperor, 
               'guard-player': element.name === guard && emperor !== guard,
               'emperor-guard-player': element.name === emperor && element.name === guard
             }">
          <div class="drag-handle">
            <span class="drag-icon">≡</span>
          </div>
          <span class="rank-number">{{ index + 1 }}. </span>
          <span class="player-name" @click="handlePlayerClick($event, element.name)">{{ element.name }}</span>
          <div class="role-indicators">
            <span v-if="element.name === emperor && element.name === guard" class="role-indicator self-guard-indicator">{{ ROLE_ICONS.SELF_GUARD }}</span>
            <span v-else-if="element.name === emperor" class="role-indicator emperor-indicator">{{ ROLE_ICONS.EMPEROR }}</span>
            <span v-else-if="element.name === guard" class="role-indicator guard-indicator">{{ ROLE_ICONS.GUARD }}</span>
          </div>
        </div>
      </template>
    </draggable>
    
    <div v-if="showRankingTip" class="ranking-tip">
      <span class="tip-icon">💡</span>
      <div class="tip-text">
        <div>拖动 ≡ 图标可调整名次</div>
        <div>点击名字可选择身份</div>
      </div>
      <button class="close-tip-btn" @click="hideRankingTip">✕</button>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import draggable from 'vuedraggable';
import { setItem, getItem } from '../utils/storageUtils';
import { STORAGE_KEYS, ROLE_ICONS } from '../config/gameConfig';

export default {
  components: {
    draggable
  },
  
  props: {
    modelValue: {
      type: Array,
      required: true
    },
    emperor: String,
    guard: String
  },
  
  emits: ['update:modelValue', 'select-player'],
  
  setup(props, { emit }) {
    const internalValue = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    });
    
    const showRankingTip = ref(true);
    
    onMounted(() => {
      const dragHandles = document.querySelectorAll('.drag-handle');
      
      dragHandles.forEach(handle => {
        handle.addEventListener('touchstart', (e) => {
          e.preventDefault();
        }, { passive: false });
      });

      // 检查提示是否应该显示
      if (getItem(STORAGE_KEYS.RANKING_HINT, false)) {
        showRankingTip.value = false;
      }
    });
    
    const hideRankingTip = () => {
      showRankingTip.value = false;
      setItem(STORAGE_KEYS.RANKING_HINT, 'true');
    };
    
    const handlePlayerClick = (event, playerName) => {
      const position = {
        x: event.clientX,
        y: event.clientY
      };
      emit('select-player', playerName, position);
    };
    
    return {
      internalValue,
      showRankingTip,
      hideRankingTip,
      handlePlayerClick,
      ROLE_ICONS
    };
  }
};
</script>

<style scoped>
.ranking-section {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin: 15px 0 20px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.1);
}

.ranking-section h3 {
  margin-top: 0;
  color: var(--primary-color);
  font-size: 18px;
  border-bottom: 1px solid #e3f2fd;
  padding-bottom: 8px;
  margin-bottom: 15px;
}

.player-rank {
  display: flex;
  align-items: center;
  padding: 0;
  background: #f9f9f9;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.2s;
  touch-action: pan-y;
  z-index: 1;
  position: relative;
  height: 50px;
  box-sizing: border-box;
  overflow: hidden;
}

.drag-handle {
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: move;
  cursor: -webkit-grab;
  cursor: grab;
  touch-action: none;
  min-width: 40px;
  height: 40px;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
}

.drag-handle:active {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}

.drag-icon {
  color: #777;
  font-size: 22px;
  -webkit-user-drag: none;
  user-select: none;
  display: inline-block;
}

.rank-number {
  margin-right: 15px;
  font-weight: bold;
  display: inline-block;
  width: 25px;
  text-align: right;
}

.player-name {
  flex-grow: 1;
  padding: 5px 10px;
  border-radius: 4px;
  background: transparent;
  border: none;
}

.player-name:active {
  opacity: 0.7;
}

.role-indicators {
  display: flex;
  gap: 10px;
  padding-right: 10px;
  align-items: center;
  height: 100%;
}

.role-indicator {
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-width: 24px;
  line-height: 1;
}

.self-guard-indicator {
  color: var(--self-guard-color);
  font-weight: bold;
}

.emperor-player {
  background-color: rgba(255, 193, 7, 0.1);
}

.guard-player {
  background-color: rgba(33, 150, 243, 0.1);
}

.emperor-guard-player {
  background-color: rgba(156, 39, 176, 0.1);
}

.ghost-placeholder {
  border: 2px dashed var(--primary-color) !important;
  background-color: rgba(25, 118, 210, 0.1) !important;
  opacity: 0.5 !important;
  height: 40px !important;
  min-height: 40px !important;
  visibility: visible !important;
  transform: none !important;
  transition: none !important;
  padding: 0 !important;
  margin-bottom: 8px !important;
  border-radius: 6px !important;
  box-sizing: border-box !important;
}

.sortable-drag {
  opacity: 0.99 !important;
  background: white !important;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  z-index: 2000;
  pointer-events: none;
  transition: none !important;
  border-radius: 6px !important;
  border: 1px solid var(--border-color) !important;
  height: 40px !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  display: flex !important;
  align-items: center !important;
}

.chosen-item {
  opacity: 1 !important;
  background-color: rgba(33, 150, 243, 0.08) !important;
  z-index: 1;
  position: relative;
}

.dragging {
  cursor: -webkit-grabbing !important;
  cursor: grabbing !important;
}

.ranking-tip {
  display: flex;
  align-items: center;
  background-color: #fff8e1;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 15px;
  font-size: 13px;
  color: #ff8f00;
  position: relative;
  border: 1px solid rgba(255, 193, 7, 0.2);
}

.tip-icon {
  margin-right: 8px;
  font-size: 16px;
}

.tip-text {
  flex: 1;
}

.close-tip-btn {
  background: none;
  border: none;
  color: #ff8f00;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

@media (max-width: 768px) {
  .player-rank {
    padding: 0;
    height: 44px;
  }
  
  .rank-number {
    font-size: 18px;
  }
  
  .drag-handle {
    padding: 0 8px;
    height: 44px;
    display: flex;
    align-items: center;
    min-width: 44px;
  }
  
  .drag-icon {
    font-size: 24px;
    padding: 5px;
  }
  
  .drag-handle:active {
    background-color: rgba(0,0,0,0.1);
    border-radius: 4px;
  }
  
  .ghost-placeholder {
    height: 44px !important;
    min-height: 44px !important;
    border: 2px dashed #1976d2 !important;
    background-color: rgba(25, 118, 210, 0.15) !important;
    opacity: 0.7 !important;
  }
  
  .sortable-drag {
    height: 44px !important;
    opacity: 0.98 !important;
    transform: scale(1.03);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    background-color: #ffffff !important;
  }
  
  .player-name {
    padding: 5px 8px;
  }
  
  .player-name:active {
    opacity: 0.65;
    transition: opacity 0.1s;
  }
  
  .role-indicator {
    font-size: 16px;
  }
  
  .close-tip-btn {
    width: 28px;
    height: 28px;
  }
}

@media (forced-colors: active) {
  .player-rank {
    forced-color-adjust: none;
    border: 1px solid currentColor;
  }
  
  .emperor-player,
  .guard-player,
  .emperor-guard-player {
    border: 1px solid currentColor;
  }
  
  .role-indicator {
    forced-color-adjust: none;
  }
}
</style>
