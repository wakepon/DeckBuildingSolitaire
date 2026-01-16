import type { Card, GameState } from '../types/game';
import { HAND_SIZE } from '../config/gameConfig';

/**
 * カードを場に出せるかを判定する
 * 場札の数字±1のカードのみ出せる（A→K、K→Aの循環あり）
 */
export function canPlayCard(card: Card, fieldCard: Card | null): boolean {
  // 場札がない場合は出せない
  if (!fieldCard) {
    return false;
  }

  const cardValue = card.value;
  const fieldValue = fieldCard.value;

  // ±1の判定（循環対応: 1と13は隣接）
  const diff = Math.abs(cardValue - fieldValue);
  return diff === 1 || diff === 12; // 12は1と13の差
}

/**
 * 手札から出せるカードがあるかを判定
 */
export function hasPlayableCard(hand: Card[], leftFieldCard: Card | null, rightFieldCard: Card | null): boolean {
  return hand.some(card =>
    canPlayCard(card, leftFieldCard) || canPlayCard(card, rightFieldCard)
  );
}

/**
 * 手札の各カードについて、どの場に出せるかを判定
 */
export function getPlayableFields(card: Card, leftFieldCard: Card | null, rightFieldCard: Card | null): {
  canPlayLeft: boolean;
  canPlayRight: boolean;
} {
  return {
    canPlayLeft: canPlayCard(card, leftFieldCard),
    canPlayRight: canPlayCard(card, rightFieldCard),
  };
}

/**
 * デッキから手札を補充する（HAND_SIZE枚になるまで）
 * 元の配列を変更せず、新しい状態を返す
 */
export function refillHand(deck: Card[], hand: Card[]): { newDeck: Card[]; newHand: Card[] } {
  const cardsNeeded = HAND_SIZE - hand.length;

  if (cardsNeeded <= 0 || deck.length === 0) {
    return { newDeck: deck, newHand: hand };
  }

  const cardsToDraw = Math.min(cardsNeeded, deck.length);
  const newHand = [...hand, ...deck.slice(0, cardsToDraw)];
  const newDeck = deck.slice(cardsToDraw);

  return { newDeck, newHand };
}

/**
 * ラウンド終了判定
 * 手札から出せるカードがなくなったら終了
 */
export function isRoundOver(state: GameState): boolean {
  return !hasPlayableCard(state.hand, state.leftFieldCard, state.rightFieldCard);
}

/**
 * 指定範囲のランダムな整数を生成
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
