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
      :disabled="false"
    >
      <template #item="{element, index}">
        <div class="player-rank" 
             :class="{ 
               'emperor-player': element.name === emperor, 
               'guard-player': element.name === guard && emperor !== guard,
               'emperor-guard-player': element.name === emperor && element.name === guard
             }">
          <div class="drag-handle" title="拖动调整顺序">
            <span class="drag-icon">≡</span>
          </div>
          <span class="rank-number">{{ index + 1 }}. </span>
          <span class="player-name" @click="handlePlayerClick($event, element.name)">{{ element.name }}</span>
          <div class="role-indicators">
            <span v-if="element.name === emperor && element.name !== guard" class="role-indicator emperor-indicator" title="皇帝">👑</span>
            <span v-if="element.name === guard && element.name !== emperor" class="role-indicator guard-indicator" title="侍卫">🛡️</span>
            <span v-if="element.name === emperor && element.name === guard" class="role-indicator self-guard-indicator" title="皇帝自保">👑🛡️</span>
          </div>
        </div>
      </template>
    </draggable>
    
    <div class="ranking-tip">
      <span class="tip-icon">💡</span>
      <span class="tip-text">拖动 ≡ 图标可调整名次，点击名字可选择身份</span>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import draggable from 'vuedraggable';

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

    onMounted(() => {
      const dragHandles = document.querySelectorAll('.drag-handle');
      
      dragHandles.forEach(handle => {
        handle.addEventListener('touchstart', (e) => {
          e.preventDefault();
        }, { passive: false });
      });
    });

    const handlePlayerClick = (event, playerName) => {
      const position = {
        x: event.clientX,
        y: event.clientY
      };
      emit('select-player', playerName, position);
    };

    return {
      internalValue,
      handlePlayerClick
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
  border-left: 4px solid #4CAF50; /* 绿色左边框 */
}

.ranking-section h3 {
  margin-top: 0;
  color: #2e7d32;
  font-size: 18px;
  border-bottom: 1px solid #e8f5e9;
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

.player-rank:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
}

.role-indicator {
  font-size: 18px;
  display: inline-block;
}

.emperor-indicator, .guard-indicator, .self-guard-indicator {
  opacity: 1;
}

.self-guard-indicator {
  color: var(--self-guard-color);
  font-weight: bold;
}

.emperor-player {
  background: var(--emperor-color);
  border-color: var(--emperor-active);
}

.guard-player {
  background: var(--guard-color);
  border-color: var(--guard-active);
}

.emperor-guard-player {
  background: linear-gradient(135deg, var(--emperor-color) 0%, var(--guard-color) 100%);
  border-color: var(--emperor-active);
}

.ghost {
  opacity: 0.3 !important;
  background-color: transparent !important;
  border: 2px dashed #1976d2 !important;
  box-shadow: none !important;
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
  background-color: #f0f0f0 !important;
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
  background-color: #e8f5e9;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 15px;
  font-size: 13px;
  color: #2e7d32;
}

.tip-icon {
  margin-right: 8px;
  font-size: 16px;
}

.tip-text {
  flex: 1;
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
}

@media (forced-colors: active) {
  .player-rank {
    forced-color-adjust: none;
    border: 1px solid currentColor;
  }
  
  .emperor-player,
  .guard-player,
  .emperor-guard-player {
    border: 2px solid currentColor;
  }
  
  .role-indicator {
    forced-color-adjust: none;
  }
}
</style>
