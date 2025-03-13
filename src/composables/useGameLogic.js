import { ref, reactive, computed } from 'vue';

export function useGameLogic(props, emit) {
  // 状态变量
  const playerRanking = ref([...props.players]);
  const emperor = ref('');
  const guard = ref('');
  const calledCard = ref('🃏'); // 默认设置为小王
  const scoreChanges = reactive({});
  
  // 计算属性 - 检查皇帝是否已标记，以及侍卫是否已标记
  const isReadyToCalculate = computed(() => {
    return emperor.value !== '' && guard.value !== '';
  });

  // 计算皇帝是否自己是侍卫
  const isSelfGuard = computed(() => {
    return emperor.value === guard.value && emperor.value !== '';
  });

  // 计算得分逻辑
  const calculateScore = () => {
    // 按照记分规则计算每个玩家的得分
    const changes = {};
    
    // 初始化所有玩家的分数变化为0
    playerRanking.value.forEach(player => {
      changes[player.name] = 0;
    });

    // 检查皇帝和侍卫的排名
    const emperorRank = playerRanking.value.findIndex(p => p.name === emperor.value);
    const guardRank = playerRanking.value.findIndex(p => p.name === guard.value);

    // 根据记分规则计算得分
    if (isSelfGuard.value) {
      // 皇帝自己情况
      if (emperorRank === 0) {
        // 皇帝自己头游
        changes[emperor.value] += 720;
        // 其他人每人扣180分
        playerRanking.value.forEach(player => {
          if (player.name !== emperor.value) {
            changes[player.name] -= 180;
          }
        });
      } else {
        // 皇帝自己非头游
        changes[emperor.value] -= 360;
        // 其他人每人得90分
        playerRanking.value.forEach(player => {
          if (player.name !== emperor.value) {
            changes[player.name] += 90;
          }
        });
      }
    } else {
      // 皇帝侍卫组队情况
      // 获取皇帝侍卫队的排名位置
      const teamRanks = [emperorRank, guardRank].sort((a, b) => a - b);
      
      // 根据团队最好和最差的排名计算得分
      const bestRank = teamRanks[0];  // 较小的排名（排名更好的）
      const worstRank = teamRanks[1]; // 较大的排名（排名更差的）
      
      if (bestRank === 0) { // 团队有人是头游
        if (worstRank === 1) {
          // 头游+二游
          changes[emperor.value] += 90;
          changes[guard.value] += 90;
          // 其他玩家每人扣60分
          playerRanking.value.forEach(player => {
            if (player.name !== emperor.value && player.name !== guard.value) {
              changes[player.name] -= 60;
            }
          });
        } else if (worstRank === 2 || worstRank === 3) {
          // 头游+三游或头游+四游
          changes[emperor.value] += 60;
          changes[guard.value] += 60;
          // 其他玩家每人扣40分
          playerRanking.value.forEach(player => {
            if (player.name !== emperor.value && player.name !== guard.value) {
              changes[player.name] -= 40;
            }
          });
        } else if (worstRank === 4) {
          // 头游+末游
          changes[emperor.value] += 30;
          changes[guard.value] += 30;
          // 其他玩家每人扣20分
          playerRanking.value.forEach(player => {
            if (player.name !== emperor.value && player.name !== guard.value) {
              changes[player.name] -= 20;
            }
          });
        }
      } else if (worstRank === 4) { // 团队有人是末游，但没人是头游
        if (bestRank === 1 || bestRank === 2) {
          // 二游+末游或三游+末游
          changes[emperor.value] -= 60;
          changes[guard.value] -= 60;
          // 其他玩家每人得40分
          playerRanking.value.forEach(player => {
            if (player.name !== emperor.value && player.name !== guard.value) {
              changes[player.name] += 40;
            }
          });
        } else if (bestRank === 3) {
          // 四游+末游
          changes[emperor.value] -= 90;
          changes[guard.value] -= 90;
          // 其他玩家每人得60分
          playerRanking.value.forEach(player => {
            if (player.name !== emperor.value && player.name !== guard.value) {
              changes[player.name] += 60;
            }
          });
        }
      } else {
        // 非头游+非末游的所有其他组合情况
        changes[emperor.value] -= 30;
        changes[guard.value] -= 30;
        // 其他玩家每人得20分
        playerRanking.value.forEach(player => {
          if (player.name !== emperor.value && player.name !== guard.value) {
            changes[player.name] += 20;
          }
        });
      }
    }
    
    // 更新scoreChanges引用
    Object.keys(changes).forEach(key => {
      scoreChanges[key] = changes[key];
    });
    
    return true;  // 表示计算完成
  };

  // 重置当前局
  const resetRound = (players) => {
    emperor.value = '';
    guard.value = '';
    calledCard.value = '🃏';
    playerRanking.value = [...players];
    Object.keys(scoreChanges).forEach(key => {
      scoreChanges[key] = 0;
    });
  };

  const getRankName = (index) => {
    const ranks = ['头游', '二游', '三游', '四游', '末游'];
    return ranks[index];
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
