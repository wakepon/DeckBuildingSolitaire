import { useState, useCallback } from 'react';
import type { GameState } from '../types/game';
import { EnemyInfo } from './EnemyInfo';
import { PlayerInfo } from './PlayerInfo';
import { FieldCards } from './FieldCards';
import { HandArea } from './HandArea';
import { canPlayCard } from '../utils/gameLogic';

interface GameBoardProps {
  state: GameState;
  onPlayCard: (cardId: string, field: 'left' | 'right') => void;
  onReset: () => void;
}

/**
 * ゲームボード全体を表示するコンポーネント
 */
export function GameBoard({ state, onPlayCard, onReset }: GameBoardProps) {
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
        <h1 className="text-xl font-bold text-white">
          Stage {state.stage} - Round {state.round}
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
