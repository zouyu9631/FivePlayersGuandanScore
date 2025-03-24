/**
 * 卡牌工具函数
 */

/**
 * 判断卡牌是否为红色（红桃或方块）
 * @param {string} card - 卡牌字符串
 * @returns {boolean} 是否为红色卡牌
 */
export function isRedCard(card) {
  return card && (card.includes('♥') || card.includes('♦'));
}

/**
 * 获取卡牌显示文本
 * @param {string} suit - 花色
 * @param {string} value - 点数
 * @returns {string} 格式化的卡牌文本
 */
export function getCardDisplay(suit, value) {
  return `${suit}${value}`;
}

// 卡牌常量
export const CARD_SUITS = ['♠', '♥', '♣', '♦'];
export const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
