export function calculateScores({ playerRanking, emperor, guard, isSelfGuard }) {
  const changes = {};
  
  playerRanking.forEach(player => {
    changes[player.name] = 0;
  });

  const emperorRank = playerRanking.findIndex(p => p.name === emperor);
  const guardRank = playerRanking.findIndex(p => p.name === guard);
  
  if (isSelfGuard) {
    applySelfGuardRules(changes, playerRanking, emperor, emperorRank);
  } else {
    applyTeamRules(changes, playerRanking, emperor, guard, emperorRank, guardRank);
  }
  
  return changes;
}

function applySelfGuardRules(changes, playerRanking, emperor, emperorRank) {
  if (emperorRank === 0) {
    changes[emperor] += 720;
    
    playerRanking.forEach(player => {
      if (player.name !== emperor) {
        changes[player.name] -= 180;
      }
    });
  } else {
    changes[emperor] -= 360;
    
    playerRanking.forEach(player => {
      if (player.name !== emperor) {
        changes[player.name] += 90;
      }
    });
  }
}

function applyTeamRules(changes, playerRanking, emperor, guard, emperorRank, guardRank) {
  const teamRanks = [emperorRank, guardRank].sort((a, b) => a - b);
  
  const bestRank = teamRanks[0];
  const worstRank = teamRanks[1];
  
  const { teamScore, farmerScore } = getTeamScores(bestRank, worstRank);
  
  changes[emperor] += teamScore;
  changes[guard] += teamScore;
  
  playerRanking.forEach(player => {
    if (player.name !== emperor && player.name !== guard) {
      changes[player.name] += farmerScore;
    }
  });
}

function getTeamScores(bestRank, worstRank) {
  if (bestRank === 0) {
    if (worstRank === 1) {
      return { teamScore: 90, farmerScore: -60 };
    } else if (worstRank === 2 || worstRank === 3) {
      return { teamScore: 60, farmerScore: -40 };
    } else if (worstRank === 4) {
      return { teamScore: 30, farmerScore: -20 };
    }
  } else if (worstRank === 4) {
    if (bestRank === 1 || bestRank === 2) {
      return { teamScore: -60, farmerScore: 40 };
    } else if (bestRank === 3) {
      return { teamScore: -90, farmerScore: 60 };
    }
  }
  
  return { teamScore: -30, farmerScore: 20 };
}
