export function isRedCard(card) {
  return card && (card.includes('♥') || card.includes('♦'));
}

export function getCardDisplay(suit, value) {
  return `${suit}${value}`;
}

export const CARD_SUITS = ['♠', '♥', '♣', '♦'];
export const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
