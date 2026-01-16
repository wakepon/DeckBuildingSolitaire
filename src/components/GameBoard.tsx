import { useState, useCallback } from 'react';
import type { GameState } from '../types/game';
import { EnemyInfo } from './EnemyInfo';
import { PlayerInfo } from './PlayerInfo';
import { FieldCards } from './FieldCards';
import { HandArea } from './HandArea';
import { canPlayCard } from '../utils/gameLogic';
import { TOTAL_STAGES } from '../data/enemies';

interface GameBoardProps {
  state: GameState;
  onPlayCard: (cardId: string, field: 'left' | 'right') => void;
  onRefreshField: () => void;
  onReset: () => void;
}

/**
 * ゲームボード全体を表示するコンポーネント
 */
export function GameBoard({ state, onPlayCard, onRefreshField, onReset }: GameBoardProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // 選択中のカードを取得
  const selectedCard = selectedCardId
    ? state.hand.find(c => c.id === selectedCardId)
    : null;

  // 選択中のカードが各場に出せるかを判定
  const canPlayLeft = selectedCard
    ? canPlayCard(selectedCard, state.leftFieldCard)
    : false;
  const canPlayRight = selectedCard
    ? canPlayCard(selectedCard, state.rightFieldCard)
    : false;

  // 場札クリック時の処理
  const handleFieldClick = useCallback((field: 'left' | 'right') => {
    if (selectedCardId) {
      onPlayCard(selectedCardId, field);
      setSelectedCardId(null);
    }
  }, [selectedCardId, onPlayCard]);

  // カード選択時の処理
  const handleCardSelect = useCallback((cardId: string | null) => {
    setSelectedCardId(cardId);
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* ヘッダー: ステージ・ラウンド情報 */}
      <div className="text-center">
        <p className="text-gray-300 text-sm">Stage {state.stage} / {TOTAL_STAGES}</p>
        <h1 className="text-xl font-bold text-white">
          Round {state.round}
        </h1>
      </div>

      {/* 敵エリア */}
      <EnemyInfo enemy={state.enemy} />

      {/* 場札 */}
      <FieldCards
        leftCard={state.leftFieldCard}
        rightCard={state.rightFieldCard}
        selectedCardId={selectedCardId}
        canPlayLeft={canPlayLeft}
        canPlayRight={canPlayRight}
        onFieldClick={handleFieldClick}
      />

      {/* 場札更新ボタン */}
      <div className="text-center">
        <button
          onClick={onRefreshField}
          disabled={state.fieldRefreshCount <= 0 || state.deck.length < 2}
          className={`
            px-4 py-2 rounded-lg font-bold transition-all
            ${state.fieldRefreshCount > 0 && state.deck.length >= 2
              ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          🔄 場札更新 ({state.fieldRefreshCount})
        </button>
        <p className="text-gray-400 text-xs mt-1">
          場札と敵のステータスを引き直す
        </p>
      </div>

      {/* プレイヤー情報 */}
      <PlayerInfo
        hp={state.playerHP}
        maxHP={state.playerMaxHP}
        attack={state.playerAttack}
        shield={state.playerShield}
        deckCount={state.deck.length}
      />

      {/* 手札 */}
      <HandArea
        hand={state.hand}
        deck={state.deck}
        leftFieldCard={state.leftFieldCard}
        rightFieldCard={state.rightFieldCard}
        selectedCardId={selectedCardId}
        onCardSelect={handleCardSelect}
      />

      {/* リセットボタン */}
      <div className="text-center pt-2">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
