/**
 * 本地存储相关工具函数
 */
import { STORAGE_KEYS } from '../config/gameConfig';
import { safeExecute, safeParseJSON, logError } from './errorUtils';

/**
 * 保存游戏状态到本地存储
 * @param {Object} gameState - 游戏状态对象
 */
export function saveGameState(gameState) {
  setItem(STORAGE_KEYS.GAME_STATE, gameState);
}

/**
 * 从本地存储加载游戏状态
 * @returns {Object|null} 游戏状态对象或null
 */
export function loadGameState() {
  return getItem(STORAGE_KEYS.GAME_STATE);
}

/**
 * 清除本地存储中的游戏状态
 */
export function clearGameState() {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
}

/**
 * 设置指定键的本地存储项
 * @param {string} key - 存储键名
 * @param {any} value - 存储值
 */
export function setItem(key, value) {
  safeExecute(
    () => localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value),
    [],
    null,
    `保存${key}`
  );
}

/**
 * 获取指定键的本地存储项
 * @param {string} key - 存储键名
 * @param {boolean} parse - 是否解析JSON
 * @returns {any} 存储值
 */
export function getItem(key, parse = true) {
  const item = safeExecute(() => localStorage.getItem(key), [], null, `获取${key}`);
  
  if (!item) return null;
  
  if (parse) {
    return safeParseJSON(item, null);
  }
  
  return item;
}
