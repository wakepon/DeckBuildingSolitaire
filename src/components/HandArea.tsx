import type { Card as CardType } from '../types/game';
import { Card } from './Card';
import { canPlayCard } from '../utils/gameLogic';

interface HandAreaProps {
  hand: CardType[];
  leftFieldCard: CardType | null;
  rightFieldCard: CardType | null;
  selectedCardId: string | null;
  onCardSelect: (cardId: string | null) => void;
}

/**
 * 手札エリアを表示するコンポーネント
 */
export function HandArea({
  hand,
  leftFieldCard,
  rightFieldCard,
  selectedCardId,
  onCardSelect,
}: HandAreaProps) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <p className="text-white text-center mb-3 text-sm">
        手札（カードをクリックして選択）
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        {hand.map((card) => {
          const canPlayLeft = canPlayCard(card, leftFieldCard);
          const canPlayRight = canPlayCard(card, rightFieldCard);
          const isPlayable = canPlayLeft || canPlayRight;
          const isSelected = selectedCardId === card.id;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (isPlayable) {
                  onCardSelect(isSelected ? null : card.id);
                }
              }}
              className={`
                transition-all duration-200 cursor-pointer
                ${isSelected ? 'transform -translate-y-4 scale-110' : ''}
                ${isPlayable ? 'hover:-translate-y-2' : ''}
              `}
            >
              <Card
                card={card}
                className={`
                  ${isSelected ? 'ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50' : ''}
                  ${isPlayable && !isSelected ? 'ring-2 ring-yellow-400/50' : ''}
                  ${!isPlayable ? 'opacity-40 cursor-not-allowed' : ''}
                `}
              />
              {isPlayable && (
                <div className="text-center mt-1">
                  <span className="text-yellow-400 text-xs">+{card.value}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedCardId && (
        <p className="text-yellow-400 text-center text-sm mt-3 animate-pulse">
          場札をクリックしてカードを出す
        </p>
      )}
    </div>
  );
}
