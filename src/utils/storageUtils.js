/**
 * 本地存储相关工具函数
 */

/**
 * 保存游戏状态到本地存储
 * @param {Object} gameState - 游戏状态对象
 */
export function saveGameState(gameState) {
  try {
    localStorage.setItem('guandanGame', JSON.stringify(gameState));
  } catch (e) {
    console.error('保存游戏状态失败', e);
  }
}

/**
 * 从本地存储加载游戏状态
 * @returns {Object|null} 游戏状态对象或null
 */
export function loadGameState() {
  try {
    const savedGame = localStorage.getItem('guandanGame');
    if (savedGame) {
      return JSON.parse(savedGame);
    }
  } catch (e) {
    console.error('加载游戏状态失败', e);
  }
  return null;
}

/**
 * 清除本地存储中的游戏状态
 */
export function clearGameState() {
  localStorage.removeItem('guandanGame');
}

/**
 * 设置指定键的本地存储项
 * @param {string} key - 存储键名
 * @param {any} value - 存储值
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
  } catch (e) {
    console.error(`保存${key}失败`, e);
  }
}

/**
 * 获取指定键的本地存储项
 * @param {string} key - 存储键名
 * @param {boolean} parse - 是否解析JSON
 * @returns {any} 存储值
 */
export function getItem(key, parse = true) {
  try {
    const item = localStorage.getItem(key);
    if (item && parse) {
      return JSON.parse(item);
    }
    return item;
  } catch (e) {
    console.error(`获取${key}失败`, e);
    return null;
  }
}
