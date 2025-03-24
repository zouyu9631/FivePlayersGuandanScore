import { computed } from 'vue';
import { formatScore, getScoreClass } from '../utils/gameUtils';

export function useGameStats(players, gameHistory) {
  // 皇帝队胜率
  const emperorTeamWinRate = computed(() => {
    if (gameHistory.value.length === 0) return 0;
    
    const winCount = gameHistory.value.filter(round => {
      const ranking = round.ranking || [];
      return ranking.length > 0 && (ranking[0] === round.emperor || ranking[0] === round.guard);
    }).length;
    
    return Math.round((winCount / gameHistory.value.length) * 100);
  });

  // 皇帝方平均得分
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

  // 农民方平均得分
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

  // 获取玩家担任特定角色的次数
  const getPlayerRoleCount = (playerName, role) => {
    return gameHistory.value.filter(round => {
      if (role === 'emperor') return round.emperor === playerName;
      if (role === 'guard') return round.guard === playerName && round.emperor !== playerName;
      return playerName !== round.emperor && playerName !== round.guard; // farmer
    }).length;
  };

  // 获取玩家担任特定角色的胜率
  const getPlayerRoleWinRate = (playerName, role) => {
    const games = gameHistory.value.filter(round => {
      if (role === 'emperor') return round.emperor === playerName;
      if (role === 'guard') return round.guard === playerName && round.emperor !== playerName;
      return playerName !== round.emperor && playerName !== round.guard; // farmer
    });
    
    if (games.length === 0) return 0;
    
    const wins = games.filter(round => {
      const ranking = round.ranking || [];
      return ranking.length > 0 && ranking[0] === playerName;
    }).length;
    
    return Math.round((wins / games.length) * 100);
  };

  // 获取玩家担任特定角色的总得分
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

  return {
    formatScore,
    getScoreClass,
    emperorTeamWinRate,
    emperorAvgScore,
    farmerAvgScore,
    getPlayerRoleCount,
    getPlayerRoleWinRate,
    getPlayerRoleTotalScore
  };
}
