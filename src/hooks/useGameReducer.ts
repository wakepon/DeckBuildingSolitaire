import { useReducer, useCallback } from 'react';
import type { GameState, Enemy, BattleResult, Card } from '../types/game';
import { createDeck, shuffleDeck, drawCards } from '../utils/deck';
import { canPlayCard, randomInRange } from '../utils/gameLogic';
import { createEnemyForStage, TOTAL_STAGES } from '../data/enemies';
import { PLAYER_INITIAL_HP, FIELD_REFRESH_MAX_COUNT, HAND_SIZE } from '../config/gameConfig';

// アクションの型定義
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PLAY_CARD'; cardId: string; field: 'left' | 'right' }
  | { type: 'REFRESH_FIELD' }
  | { type: 'MANUAL_END_ROUND' }
  | { type: 'END_ROUND' }
  | { type: 'CONTINUE_GAME' }
  | { type: 'NEXT_STAGE' }
  | { type: 'RESET_GAME' };

// 初期状態を生成
function createInitialState(): GameState {
  const deck = shuffleDeck(createDeck());
  const { cards: fieldCards, remainingDeck: deckAfterField } = drawCards(deck, 2);
  const { cards: hand, remainingDeck: finalDeck } = drawCards(deckAfterField, HAND_SIZE);

  return {
    playerHP: PLAYER_INITIAL_HP,
    playerMaxHP: PLAYER_INITIAL_HP,
    playerAttack: 0,
    playerShield: 0,
    deck: finalDeck,
    hand,
    leftFieldCard: fieldCards[0] || null,
    rightFieldCard: fieldCards[1] || null,
    enemy: createEnemyForStage(1),
    stage: 1,
    round: 1,
    gameStatus: 'playing',
    fieldRefreshCount: FIELD_REFRESH_MAX_COUNT,
    hasPlayedCardThisRound: false,
    lastBattleResult: null,
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

      // 出したカードの位置に新しいカードを補充（位置を維持）
      let newHand: Card[];
      let newDeck: Card[];

      if (state.deck.length > 0) {
        // デッキにカードがある場合、同じ位置に新しいカードを入れる
        const drawnCard = state.deck[0];
        newDeck = state.deck.slice(1);
        newHand = [...state.hand];
        newHand[cardIndex] = drawnCard;
      } else {
        // デッキが空の場合、カードを削除するだけ
        newDeck = state.deck;
        newHand = state.hand.filter((_, i) => i !== cardIndex);
      }

      // 場札を更新
      const newLeftField = field === 'left' ? card : state.leftFieldCard;
      const newRightField = field === 'right' ? card : state.rightFieldCard;

      // 攻撃力またはシールドを+1（カード1枚につき1）
      const attackBonus = field === 'left' ? 1 : 0;
      const shieldBonus = field === 'right' ? 1 : 0;

      const newState: GameState = {
        ...state,
        hand: newHand,
        deck: newDeck,
        leftFieldCard: newLeftField,
        rightFieldCard: newRightField,
        playerAttack: state.playerAttack + attackBonus,
        playerShield: state.playerShield + shieldBonus,
        hasPlayedCardThisRound: true,
      };

      return newState;
    }

    case 'REFRESH_FIELD': {
      // 更新回数が残っていない場合は何もしない
      if (state.fieldRefreshCount <= 0) return state;
      // デッキに2枚以上ない場合は何もしない
      if (state.deck.length < 2) return state;

      // デッキから2枚引いて場札を更新
      const { cards: newFieldCards, remainingDeck } = drawCards(state.deck, 2);

      // 敵のアタックとシールドも再抽選
      const newEnemy: Enemy = {
        ...state.enemy,
        currentAttack: randomInRange(state.enemy.attackRange[0], state.enemy.attackRange[1]),
        currentShield: randomInRange(state.enemy.shieldRange[0], state.enemy.shieldRange[1]),
      };

      return {
        ...state,
        deck: remainingDeck,
        leftFieldCard: newFieldCards[0] || state.leftFieldCard,
        rightFieldCard: newFieldCards[1] || state.rightFieldCard,
        enemy: newEnemy,
        fieldRefreshCount: state.fieldRefreshCount - 1,
      };
    }

    case 'MANUAL_END_ROUND': {
      // プレイヤーが手動で攻撃終了を選択
      return { ...state, gameStatus: 'round_ending' };
    }

    case 'END_ROUND': {
      // バトル結果を計算
      const damageToEnemy = Math.max(0, state.playerAttack - state.enemy.currentShield);
      const newEnemyHP = state.enemy.hp - damageToEnemy;
      const enemyDefeated = newEnemyHP <= 0;

      // 敵が倒れた場合、プレイヤーへのダメージはなし
      const damageToPlayer = enemyDefeated
        ? 0
        : Math.max(0, state.enemy.currentAttack - state.playerShield);
      const newPlayerHP = state.playerHP - damageToPlayer;
      const playerDefeated = !enemyDefeated && newPlayerHP <= 0;

      const battleResult: BattleResult = {
        playerAttack: state.playerAttack,
        playerShield: state.playerShield,
        enemyAttack: state.enemy.currentAttack,
        enemyShield: state.enemy.currentShield,
        damageToEnemy,
        damageToPlayer,
        enemyDefeated,
        playerDefeated,
      };

      return {
        ...state,
        gameStatus: 'battle_result',
        lastBattleResult: battleResult,
      };
    }

    case 'CONTINUE_GAME': {
      const result = state.lastBattleResult;
      if (!result) return state;

      // 敵を倒した場合
      if (result.enemyDefeated) {
        const isGameClear = state.stage >= TOTAL_STAGES;
        return {
          ...state,
          playerAttack: 0,
          playerShield: 0,
          enemy: {
            ...state.enemy,
            hp: 0,
          },
          gameStatus: isGameClear ? 'game_clear' : 'stage_clear',
          lastBattleResult: null,
        };
      }

      // プレイヤーが倒れた場合
      if (result.playerDefeated) {
        return {
          ...state,
          playerHP: 0,
          playerAttack: 0,
          playerShield: 0,
          enemy: {
            ...state.enemy,
            hp: state.enemy.hp - result.damageToEnemy,
          },
          gameStatus: 'gameover',
          lastBattleResult: null,
        };
      }

      // 両者生存 → 次ラウンドへ
      const newEnemyHP = state.enemy.hp - result.damageToEnemy;
      const newPlayerHP = state.playerHP - result.damageToPlayer;

      const deck = shuffleDeck(createDeck());
      const { cards: fieldCards, remainingDeck: deckAfterField } = drawCards(deck, 2);
      const { cards: hand, remainingDeck: finalDeck } = drawCards(deckAfterField, HAND_SIZE);

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
        hasPlayedCardThisRound: false,
        lastBattleResult: null,
      };
    }

    case 'NEXT_STAGE': {
      const newStage = state.stage + 1;
      const deck = shuffleDeck(createDeck());
      const { cards: fieldCards, remainingDeck: deckAfterField } = drawCards(deck, 2);
      const { cards: hand, remainingDeck: finalDeck } = drawCards(deckAfterField, HAND_SIZE);

      return {
        ...state,
        playerAttack: 0,
        playerShield: 0,
        deck: finalDeck,
        hand,
        leftFieldCard: fieldCards[0] || null,
        rightFieldCard: fieldCards[1] || null,
        enemy: createEnemyForStage(newStage),
        stage: newStage,
        round: 1,
        gameStatus: 'playing',
        fieldRefreshCount: FIELD_REFRESH_MAX_COUNT,
        hasPlayedCardThisRound: false,
        lastBattleResult: null,
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
  const continueGame = useCallback(() => dispatch({ type: 'CONTINUE_GAME' }), []);
  const refreshField = useCallback(() => dispatch({ type: 'REFRESH_FIELD' }), []);
  const manualEndRound = useCallback(() => dispatch({ type: 'MANUAL_END_ROUND' }), []);
  const endRound = useCallback(() => dispatch({ type: 'END_ROUND' }), []);

  const playCard = useCallback((cardId: string, field: 'left' | 'right') => {
    dispatch({ type: 'PLAY_CARD', cardId, field });
  }, []);

  return {
    state,
    startGame,
    resetGame,
    playCard,
    nextStage,
    continueGame,
    refreshField,
    manualEndRound,
    endRound,
  };
}
