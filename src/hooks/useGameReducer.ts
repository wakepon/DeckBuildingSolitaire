import { useReducer, useCallback } from 'react';
import type { GameState, Enemy } from '../types/game';
import { createDeck, shuffleDeck, drawCards } from '../utils/deck';
import { canPlayCard, refillHand, isRoundOver, randomInRange } from '../utils/gameLogic';

// アクションの型定義
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PLAY_CARD'; cardId: string; field: 'left' | 'right' }
  | { type: 'END_ROUND' }
  | { type: 'NEXT_STAGE' }
  | { type: 'RESET_GAME' };

// 初期の敵を生成
function createEnemy(stage: number): Enemy {
  const baseHP = 20 + stage * 10;
  const attackMin = 2 + stage;
  const attackMax = 5 + stage * 2;
  const shieldMin = 1 + Math.floor(stage / 2);
  const shieldMax = 3 + stage;

  return {
    name: `Enemy Stage ${stage}`,
    maxHP: baseHP,
    hp: baseHP,
    attackRange: [attackMin, attackMax],
    shieldRange: [shieldMin, shieldMax],
    currentAttack: randomInRange(attackMin, attackMax),
    currentShield: randomInRange(shieldMin, shieldMax),
  };
}

// 初期状態を生成
function createInitialState(): GameState {
  const deck = shuffleDeck(createDeck());
  const { cards: fieldCards, remainingDeck: deckAfterField } = drawCards(deck, 2);
  const { cards: hand, remainingDeck: finalDeck } = drawCards(deckAfterField, 4);

  return {
    playerHP: 50,
    playerMaxHP: 50,
    playerAttack: 0,
    playerShield: 0,
    deck: finalDeck,
    hand,
    leftFieldCard: fieldCards[0] || null,
    rightFieldCard: fieldCards[1] || null,
    enemy: createEnemy(1),
    stage: 1,
    round: 1,
    gameStatus: 'playing',
  };
}

// リデューサー
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
    case 'RESET_GAME':
      return createInitialState();

    case 'PLAY_CARD': {
      const { cardId, field } = action;
      const cardIndex = state.hand.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return state;

      const card = state.hand[cardIndex];
      const fieldCard = field === 'left' ? state.leftFieldCard : state.rightFieldCard;

      // カードが出せるか確認
      if (!canPlayCard(card, fieldCard)) return state;

      // 手札からカードを削除
      const newHand = state.hand.filter((_, i) => i !== cardIndex);

      // 場札を更新
      const newLeftField = field === 'left' ? card : state.leftFieldCard;
      const newRightField = field === 'right' ? card : state.rightFieldCard;

      // 攻撃力またはシールドを加算
      const attackBonus = field === 'left' ? card.value : 0;
      const shieldBonus = field === 'right' ? card.value : 0;

      // 手札を補充
      const { newDeck, newHand: refilledHand } = refillHand(state.deck, newHand);

      const newState: GameState = {
        ...state,
        hand: refilledHand,
        deck: newDeck,
        leftFieldCard: newLeftField,
        rightFieldCard: newRightField,
        playerAttack: state.playerAttack + attackBonus,
        playerShield: state.playerShield + shieldBonus,
      };

      // ラウンド終了判定
      if (isRoundOver(newState)) {
        return gameReducer(newState, { type: 'END_ROUND' });
      }

      return newState;
    }

    case 'END_ROUND': {
      // プレイヤー先攻でダメージ処理

      // 1. プレイヤーの攻撃
      const playerDamage = Math.max(0, state.playerAttack - state.enemy.currentShield);
      const newEnemyHP = state.enemy.hp - playerDamage;

      // 2. 敵のHP確認: 0以下ならステージクリア、以降の処理スキップ
      if (newEnemyHP <= 0) {
        return {
          ...state,
          playerAttack: 0,
          playerShield: 0,
          enemy: {
            ...state.enemy,
            hp: 0,
          },
          gameStatus: 'stage_clear',
        };
      }

      // 3. 敵の攻撃
      const enemyDamage = Math.max(0, state.enemy.currentAttack - state.playerShield);
      const newPlayerHP = state.playerHP - enemyDamage;

      // 4. プレイヤーのHP確認: 0以下ならゲームオーバー
      if (newPlayerHP <= 0) {
        return {
          ...state,
          playerHP: 0,
          playerAttack: 0,
          playerShield: 0,
          enemy: {
            ...state.enemy,
            hp: newEnemyHP,
          },
          gameStatus: 'gameover',
        };
      }

      // 5. 両者生存なら次ラウンドへ
      const deck = shuffleDeck(createDeck());
      const { cards: fieldCards, remainingDeck: deckAfterField } = drawCards(deck, 2);
      const { cards: hand, remainingDeck: finalDeck } = drawCards(deckAfterField, 4);

      // 敵の新しい攻撃・シールド値を設定
      const newEnemy: Enemy = {
        ...state.enemy,
        hp: newEnemyHP,
        currentAttack: randomInRange(state.enemy.attackRange[0], state.enemy.attackRange[1]),
        currentShield: randomInRange(state.enemy.shieldRange[0], state.enemy.shieldRange[1]),
      };

      return {
        ...state,
        playerHP: newPlayerHP,
        playerAttack: 0,
        playerShield: 0,
        deck: finalDeck,
        hand,
        leftFieldCard: fieldCards[0] || null,
        rightFieldCard: fieldCards[1] || null,
        enemy: newEnemy,
        round: state.round + 1,
        gameStatus: 'playing',
      };
    }

    case 'NEXT_STAGE': {
      const newStage = state.stage + 1;
      const deck = shuffleDeck(createDeck());
      const { cards: fieldCards, remainingDeck: deckAfterField } = drawCards(deck, 2);
      const { cards: hand, remainingDeck: finalDeck } = drawCards(deckAfterField, 4);

      return {
        ...state,
        playerAttack: 0,
        playerShield: 0,
        deck: finalDeck,
        hand,
        leftFieldCard: fieldCards[0] || null,
        rightFieldCard: fieldCards[1] || null,
        enemy: createEnemy(newStage),
        stage: newStage,
        round: 1,
        gameStatus: 'playing',
      };
    }

    default:
      return state;
  }
}

// カスタムフック
export function useGameReducer() {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const resetGame = useCallback(() => dispatch({ type: 'RESET_GAME' }), []);
  const nextStage = useCallback(() => dispatch({ type: 'NEXT_STAGE' }), []);

  const playCard = useCallback((cardId: string, field: 'left' | 'right') => {
    dispatch({ type: 'PLAY_CARD', cardId, field });
  }, []);

  return {
    state,
    startGame,
    resetGame,
    playCard,
    nextStage,
  };
}
