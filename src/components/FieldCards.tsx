import type { Card as CardType } from '../types/game';
import { Card } from './Card';

interface FieldCardsProps {
  leftCard: CardType | null;
  rightCard: CardType | null;
  selectedCardId: string | null;
  canPlayLeft: boolean;
  canPlayRight: boolean;
  onFieldClick: (field: 'left' | 'right') => void;
}

/**
 * 場札を表示するコンポーネント（左:攻撃 / 右:シールド）
 */
export function FieldCards({
  leftCard,
  rightCard,
  selectedCardId,
  canPlayLeft,
  canPlayRight,
  onFieldClick,
}: FieldCardsProps) {
  const isSelecting = selectedCardId !== null;

  return (
    <div className="flex justify-center gap-12 my-6">
      {/* 左フィールド（攻撃用） */}
      <div className="text-center">
        <p className="text-red-400 mb-2 font-bold flex items-center justify-center gap-1">
          <span>⚔️</span>
          <span>攻撃</span>
        </p>
        <div
          onClick={() => isSelecting && canPlayLeft && onFieldClick('left')}
          className={`
            bg-red-900/30 p-2 rounded-lg transition-all
            ${isSelecting && canPlayLeft ? 'cursor-pointer ring-2 ring-red-400 hover:ring-4' : ''}
            ${isSelecting && !canPlayLeft ? 'opacity-50' : ''}
          `}
        >
          {leftCard ? (
            <Card card={leftCard} />
          ) : (
            <div className="w-16 h-24 border-2 border-dashed border-red-400 rounded-lg" />
          )}
        </div>
        {isSelecting && canPlayLeft && (
          <p className="text-red-400 text-xs mt-1 animate-pulse">クリックで出す</p>
        )}
      </div>

      {/* 右フィールド（シールド用） */}
      <div className="text-center">
        <p className="text-blue-400 mb-2 font-bold flex items-center justify-center gap-1">
          <span>🛡️</span>
          <span>シールド</span>
        </p>
        <div
          onClick={() => isSelecting && canPlayRight && onFieldClick('right')}
          className={`
            bg-blue-900/30 p-2 rounded-lg transition-all
            ${isSelecting && canPlayRight ? 'cursor-pointer ring-2 ring-blue-400 hover:ring-4' : ''}
            ${isSelecting && !canPlayRight ? 'opacity-50' : ''}
          `}
        >
          {rightCard ? (
            <Card card={rightCard} />
          ) : (
            <div className="w-16 h-24 border-2 border-dashed border-blue-400 rounded-lg" />
          )}
        </div>
        {isSelecting && canPlayRight && (
          <p className="text-blue-400 text-xs mt-1 animate-pulse">クリックで出す</p>
        )}
      </div>
    </div>
  );
}
