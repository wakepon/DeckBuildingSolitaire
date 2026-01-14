import type { Card as CardType } from '../types/game';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../types/game';

interface CardProps {
  card: CardType;
  faceDown?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * トランプカードコンポーネント
 * 表面と裏面の表示をサポート
 */
export function Card({ card, faceDown = false, onClick, className = '' }: CardProps) {
  const symbol = SUIT_SYMBOLS[card.suit];
  const color = SUIT_COLORS[card.suit];
  const isRed = color === 'red';

  // 裏面表示
  if (faceDown) {
    return (
      <div
        onClick={onClick}
        className={`
          w-16 h-24 rounded-lg border-2 border-gray-300
          bg-gradient-to-br from-blue-600 to-blue-800
          flex items-center justify-center
          cursor-pointer select-none
          shadow-md hover:shadow-lg transition-shadow
          ${className}
        `}
      >
        <div className="w-12 h-20 border border-blue-400 rounded bg-blue-700 flex items-center justify-center">
          <span className="text-blue-300 text-2xl">♠</span>
        </div>
      </div>
    );
  }

  // 表面表示
  return (
    <div
      onClick={onClick}
      className={`
        w-16 h-24 rounded-lg border-2 border-gray-300
        bg-white
        flex flex-col
        cursor-pointer select-none
        shadow-md hover:shadow-lg transition-shadow
        ${className}
      `}
    >
      {/* 左上のランクとスート */}
      <div className={`text-xs font-bold pl-1 pt-0.5 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        <div className="leading-none">{card.rank}</div>
        <div className="leading-none">{symbol}</div>
      </div>

      {/* 中央のスート */}
      <div className={`flex-1 flex items-center justify-center ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        <span className="text-3xl">{symbol}</span>
      </div>

      {/* 右下のランクとスート（逆さま） */}
      <div className={`text-xs font-bold pr-1 pb-0.5 text-right rotate-180 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        <div className="leading-none">{card.rank}</div>
        <div className="leading-none">{symbol}</div>
      </div>
    </div>
  );
}
