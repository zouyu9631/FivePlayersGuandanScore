/**
 * 掼蛋游戏规则相关工具函数
 */

/**
 * 计算玩家得分
 * @param {Object} params - 计分参数
 * @param {Array} params.playerRanking - 排名顺序的玩家数组
 * @param {String} params.emperor - 皇帝玩家名称
 * @param {String} params.guard - 侍卫玩家名称
 * @param {Boolean} params.isSelfGuard - 皇帝是否自己当侍卫
 * @returns {Object} 每个玩家的得分变化
 */
export function calculateScores({ playerRanking, emperor, guard, isSelfGuard }) {
  const changes = {};
  
  // 初始化所有玩家的分数变化为0
  playerRanking.forEach(player => {
    changes[player.name] = 0;
  });

  // 获取皇帝和侍卫的排名
  const emperorRank = playerRanking.findIndex(p => p.name === emperor);
  const guardRank = playerRanking.findIndex(p => p.name === guard);

  if (isSelfGuard) {
    // 皇帝自己情况
    applySelfGuardRules(changes, playerRanking, emperor, emperorRank);
  } else {
    // 皇帝侍卫组队情况
    applyTeamRules(changes, playerRanking, emperor, guard, emperorRank, guardRank);
  }
  
  return changes;
}

/**
 * 应用皇帝自己当侍卫的规则
 */
function applySelfGuardRules(changes, playerRanking, emperor, emperorRank) {
  if (emperorRank === 0) {
    // 皇帝自己头游
    changes[emperor] += 720;
    // 其他人每人扣180分
    playerRanking.forEach(player => {
      if (player.name !== emperor) {
        changes[player.name] -= 180;
      }
    });
  } else {
    // 皇帝自己非头游
    changes[emperor] -= 360;
    // 其他人每人得90分
    playerRanking.forEach(player => {
      if (player.name !== emperor) {
        changes[player.name] += 90;
      }
    });
  }
}

/**
 * 应用皇帝侍卫组队的规则
 */
function applyTeamRules(changes, playerRanking, emperor, guard, emperorRank, guardRank) {
  // 获取皇帝侍卫队的排名位置
  const teamRanks = [emperorRank, guardRank].sort((a, b) => a - b);
  
  // 根据团队最好和最差的排名计算得分
  const bestRank = teamRanks[0];  // 较小的排名（排名更好的）
  const worstRank = teamRanks[1]; // 较大的排名（排名更差的）
  
  // 计算分数变化
  const { teamScore, farmerScore } = getTeamScores(bestRank, worstRank);
  
  // 设置皇帝和侍卫的分数
  changes[emperor] += teamScore;
  changes[guard] += teamScore;
  
  // 设置农民的分数
  playerRanking.forEach(player => {
    if (player.name !== emperor && player.name !== guard) {
      changes[player.name] += farmerScore;
    }
  });
}

/**
 * 获取团队得分
 */
function getTeamScores(bestRank, worstRank) {
  if (bestRank === 0) { // 团队有人是头游
    if (worstRank === 1) {
      // 头游+二游
      return { teamScore: 90, farmerScore: -60 };
    } else if (worstRank === 2 || worstRank === 3) {
      // 头游+三游或头游+四游
      return { teamScore: 60, farmerScore: -40 };
    } else if (worstRank === 4) {
      // 头游+末游
      return { teamScore: 30, farmerScore: -20 };
    }
  } else if (worstRank === 4) { // 团队有人是末游，但没人是头游
    if (bestRank === 1 || bestRank === 2) {
      // 二游+末游或三游+末游
      return { teamScore: -60, farmerScore: 40 };
    } else if (bestRank === 3) {
      // 四游+末游
      return { teamScore: -90, farmerScore: 60 };
    }
  }
  
  // 非头游+非末游的所有其他组合情况
  return { teamScore: -30, farmerScore: 20 };
}
