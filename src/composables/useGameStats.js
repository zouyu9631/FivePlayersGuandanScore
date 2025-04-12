import { computed } from 'vue';
import { formatScore, getScoreClass } from '../utils/gameUtils';

export function useGameStats(players, gameHistory) {
  const getRoundsByPlayerRole = (playerName, role) => {
    return gameHistory.value.filter(round => {
      if (role === 'emperor') return round.emperor === playerName;
      if (role === 'guard') return round.guard === playerName && round.emperor !== playerName;
      return playerName !== round.emperor && playerName !== round.guard;
    });
  };

  const isPlayerWinningRound = (round, playerName) => {
    return round.ranking && round.ranking.length > 0 && round.ranking[0] === playerName;
  };
  
  const isPositiveScoreRound = (round, playerName) => {
    return round.scoreChanges && round.scoreChanges[playerName] > 0;
  };
  
  const calculateWinRate = (wins, total) => {
    return total > 0 ? Math.round((wins / total) * 100) : 0;
  };

  const emperorTeamWinRate = computed(() => {
    if (gameHistory.value.length === 0) return 0;
    
    const winCount = gameHistory.value.filter(round => {
      return round.ranking?.length > 0 && 
             (round.ranking[0] === round.emperor || round.ranking[0] === round.guard);
    }).length;
    
    return calculateWinRate(winCount, gameHistory.value.length);
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
    return getRoundsByPlayerRole(playerName, role).length;
  };

  const getPlayerRoleWinRate = (playerName, role) => {
    const games = getRoundsByPlayerRole(playerName, role);
    
    if (games.length === 0) return 0;
    
    const wins = games.filter(round => isPlayerWinningRound(round, playerName)).length;
    
    return calculateWinRate(wins, games.length);
  };

  const getPlayerRoleTotalScore = (playerName, role) => {
    return getRoundsByPlayerRole(playerName, role).reduce((total, round) => {
      return total + (round.scoreChanges?.[playerName] || 0);
    }, 0);
  };

  const getPlayerWinRate = (playerName) => {
    if (gameHistory.value.length === 0) return 0;
    
    const playerGames = gameHistory.value.filter(round => 
      round.ranking && round.ranking.includes(playerName)
    );
    
    if (playerGames.length === 0) return 0;
    
    const wins = playerGames.filter(round => isPositiveScoreRound(round, playerName)).length;
    
    return calculateWinRate(wins, playerGames.length);
  };

  const getPlayerWinCount = (playerName) => {
    return gameHistory.value.filter(round => isPositiveScoreRound(round, playerName)).length;
  };

  const getFirstRankCount = (playerName) => {
    return gameHistory.value.filter(round => isPlayerWinningRound(round, playerName)).length;
  };

  const mvpPlayers = computed(() => {
    if (gameHistory.value.length === 0) return [];
    
    const playerScores = players.value.map(player => {
      const winCount = getPlayerWinCount(player.name);
      const winRate = getPlayerWinRate(player.name);
      const totalScore = player.score;
      
      const score = winRate * 100 + winCount + totalScore / 100;
      
      return {
        name: player.name,
        score,
        winRate
      };
    });
    
    playerScores.sort((a, b) => b.score - a.score);
    
    if (playerScores.length === 0) return [];
    
    const topScore = playerScores[0].score;
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
