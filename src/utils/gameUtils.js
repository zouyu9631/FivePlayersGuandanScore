/**
 * 游戏相关工具函数
 */
import { RANK_NAMES } from '../config/gameConfig';

/**
 * 获取排名显示名称
 * @param {number} index - 排名索引
 * @returns {string} 排名名称（头游、二游等）
 */
export function getRankName(index) {
  return RANK_NAMES[index];
}

/**
 * 格式化得分显示
 * @param {number} score - 得分
 * @returns {string} 格式化后的得分字符串，带符号
 */
export function formatScore(score) {
  return score > 0 ? `+${score}` : `${score}`;
}

/**
 * 获取得分显示的CSS类名
 * @param {number} score - 得分
 * @returns {string} CSS类名
 */
export function getScoreClass(score) {
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'zero-score';
}

/**
 * 排序玩家列表
 * @param {Array} players - 玩家数组
 * @param {string} sortBy - 排序依据（'score'、'name'等）
 * @param {boolean} ascending - 是否升序
 * @returns {Array} 排序后的玩家数组
 */
export function sortPlayers(players, sortBy = 'score', ascending = false) {
  return [...players].sort((a, b) => {
    const comparison = ascending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    return comparison;
  });
}
