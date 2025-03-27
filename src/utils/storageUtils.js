import { STORAGE_KEYS } from '../config/gameConfig';
import { safeExecute, safeParseJSON } from './errorUtils';

export function saveGameState(gameState) {
  setItem(STORAGE_KEYS.GAME_STATE, gameState);
}

export function loadGameState() {
  return getItem(STORAGE_KEYS.GAME_STATE);
}

export function clearGameState() {
  localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  // 同时清除排名提示的状态，这样新游戏时提示会重新显示
  localStorage.removeItem(STORAGE_KEYS.RANKING_HINT);
}

export function setItem(key, value) {
  safeExecute(
    () => localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value),
    [],
    null,
    `保存${key}`
  );
}

export function getItem(key, parse = true) {
  const item = safeExecute(() => localStorage.getItem(key), [], null, `获取${key}`);
  
  if (!item) return null;
  
  if (parse) {
    return safeParseJSON(item, null);
  }
  
  return item;
}
