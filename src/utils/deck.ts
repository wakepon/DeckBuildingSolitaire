import type { Card, Suit, Rank } from '../types/game';
import { SUITS, RANKS, RANK_VALUES } from '../types/game';

/**
 * カードIDを生成する
 */
function createCardId(suit: Suit, rank: Rank): string {
  return `${suit}-${rank}`;
}

/**
 * 1枚のカードを生成する
 */
function createCard(suit: Suit, rank: Rank): Card {
  return {
    id: createCardId(suit, rank),
    suit,
    rank,
    value: RANK_VALUES[rank],
  };
}

/**
 * 52枚のトランプデッキを生成する
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(createCard(suit, rank));
    }
  }

  return deck;
}

/**
 * デッキをシャッフルする（Fisher-Yates アルゴリズム）
 * 元の配列を変更せず、新しい配列を返す
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * デッキの先頭からカードを引く
 * 元の配列を変更せず、引いたカードと残りのデッキを返す
 */
export function drawCard(deck: Card[]): { card: Card | null; remainingDeck: Card[] } {
  if (deck.length === 0) {
    return { card: null, remainingDeck: [] };
  }

  const [card, ...remainingDeck] = deck;
  return { card, remainingDeck };
}

/**
 * デッキの先頭から複数枚のカードを引く
 */
export function drawCards(deck: Card[], count: number): { cards: Card[]; remainingDeck: Card[] } {
  const cards = deck.slice(0, count);
  const remainingDeck = deck.slice(count);
  return { cards, remainingDeck };
}
