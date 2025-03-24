/**
 * 游戏配置常量
 * 集中管理游戏中使用的常量值
 */

// 默认玩家名称
export const DEFAULT_PLAYER_NAMES = ["关羽", "张飞", "赵云", "马超", "黄忠"];

// 排名名称
export const RANK_NAMES = ['头游', '二游', '三游', '四游', '末游'];

// 存储键名
export const STORAGE_KEYS = {
  GAME_STATE: 'guandanGame',
  CARD_SELECTOR_HINT: 'cardSelectorHintShown'
};

// 默认叫牌
export const DEFAULT_CALLED_CARD = '🃏';

// 角色图标
export const ROLE_ICONS = {
  EMPEROR: '👑',
  GUARD: '🛡️',
  SELF_GUARD: '👑🛡️'
};
