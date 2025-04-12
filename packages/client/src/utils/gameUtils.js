import { RANK_NAMES } from '../config/gameConfig';

export function getRankName(index) {
  return RANK_NAMES[index];
}

export function formatScore(score) {
  return score > 0 ? `+${score}` : `${score}`;
}

export function getScoreClass(score) {
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'zero-score';
}

export function sortPlayers(players, sortBy = 'score', ascending = false) {
  return [...players].sort((a, b) => {
    const comparison = ascending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    return comparison;
  });
}
