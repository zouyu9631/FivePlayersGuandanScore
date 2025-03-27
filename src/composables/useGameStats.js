import { computed } from 'vue';
import { formatScore, getScoreClass } from '../utils/gameUtils';

export function useGameStats(players, gameHistory) {
  const emperorTeamWinRate = computed(() => {
    if (gameHistory.value.length === 0) return 0;
    
    const winCount = gameHistory.value.filter(round => {
      const ranking = round.ranking || [];
      return ranking.length > 0 && (ranking[0] === round.emperor || ranking[0] === round.guard);
    }).length;
    
    return Math.round((winCount / gameHistory.value.length) * 100);
  });

  const emperorAvgScore = computed(() => {
    if (gameHistory.value.length === 0) return 0;
    
    let totalScore = 0;
    let count = 0;
    
    gameHistory.value.forEach(round => {
      if (round.emperor && round.scoreChanges) {
        totalScore += round.scoreChanges[round.emperor] || 0;
        count++;
      }
      if (round.guard && round.guard !== round.emperor && round.scoreChanges) {
        totalScore += round.scoreChanges[round.guard] || 0;
        count++;
      }
    });
    
    return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
  });

  const farmerAvgScore = computed(() => {
    if (gameHistory.value.length === 0) return 0;
    
    let totalScore = 0;
    let count = 0;
    
    gameHistory.value.forEach(round => {
      if (round.scoreChanges) {
        players.value.forEach(player => {
          if (player.name !== round.emperor && player.name !== round.guard) {
            totalScore += round.scoreChanges[player.name] || 0;
            count++;
          }
        });
      }
    });
    
    return count > 0 ? parseFloat((totalScore / count).toFixed(2)) : 0;
  });

  const getPlayerRoleCount = (playerName, role) => {
    return gameHistory.value.filter(round => {
      if (role === 'emperor') return round.emperor === playerName;
      if (role === 'guard') return round.guard === playerName && round.emperor !== playerName;
      return playerName !== round.emperor && playerName !== round.guard;
    }).length;
  };

  const getPlayerRoleWinRate = (playerName, role) => {
    const games = gameHistory.value.filter(round => {
      if (role === 'emperor') return round.emperor === playerName;
      if (role === 'guard') return round.guard === playerName && round.emperor !== playerName;
      return playerName !== round.emperor && playerName !== round.guard;
    });
    
    if (games.length === 0) return 0;
    
    const wins = games.filter(round => {
      const ranking = round.ranking || [];
      return ranking.length > 0 && ranking[0] === playerName;
    }).length;
    
    return Math.round((wins / games.length) * 100);
  };

  const getPlayerRoleTotalScore = (playerName, role) => {
    return gameHistory.value.reduce((total, round) => {
      const isEmperor = round.emperor === playerName;
      const isGuard = round.guard === playerName && round.emperor !== playerName;
      const isFarmer = playerName !== round.emperor && playerName !== round.guard;
      
      if ((role === 'emperor' && isEmperor) ||
          (role === 'guard' && isGuard) ||
          (role === 'farmer' && isFarmer)) {
        return total + (round.scoreChanges[playerName] || 0);
      }
      return total;
    }, 0);
  };

  // 获取玩家胜率的函数，胜利定义为玩家在一局游戏中得分为正
  const getPlayerWinRate = (playerName) => {
    if (gameHistory.value.length === 0) return 0;
    
    const playerGames = gameHistory.value.filter(round => {
      return round.ranking && round.ranking.includes(playerName);
    });
    
    if (playerGames.length === 0) return 0;
    
    const wins = playerGames.filter(round => {
      return round.scoreChanges && round.scoreChanges[playerName] > 0;
    }).length;
    
    return Math.round((wins / playerGames.length) * 100);
  };

  // 获取玩家胜场数
  const getPlayerWinCount = (playerName) => {
    return gameHistory.value.filter(round => {
      return round.scoreChanges && round.scoreChanges[playerName] > 0;
    }).length;
  };

  // 获取玩家头游次数
  const getFirstRankCount = (playerName) => {
    return gameHistory.value.filter(round => {
      return round.ranking && round.ranking[0] === playerName;
    }).length;
  };

  // MVP玩家计算，基于胜率
  const mvpPlayers = computed(() => {
    if (gameHistory.value.length === 0) return [];
    
    // 玩家综合评分数据
    const playerScores = players.value.map(player => {
      const winCount = getPlayerWinCount(player.name);
      const winRate = getPlayerWinRate(player.name);
      const totalScore = player.score;
      
      // 计算综合得分，胜率权重最高，其次是胜场数，然后是总分
      const score = winRate * 100 + winCount + totalScore / 100;
      
      return {
        name: player.name,
        score,
        winRate
      };
    });
    
    // 按综合评分排序
    playerScores.sort((a, b) => b.score - a.score);
    
    if (playerScores.length === 0) return [];
    
    const topScore = playerScores[0].score;
    // 获取所有与最高分相同的玩家
    return playerScores
      .filter(p => p.score === topScore)
      .map(p => p.name);
  });

  return {
    formatScore,
    getScoreClass,
    emperorTeamWinRate,
    emperorAvgScore,
    farmerAvgScore,
    getPlayerRoleCount,
    getPlayerRoleWinRate,
    getPlayerRoleTotalScore,
    getPlayerWinRate,
    getFirstRankCount,
    getPlayerWinCount,
    mvpPlayers
  };
}
