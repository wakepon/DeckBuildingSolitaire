interface PlayerInfoProps {
  hp: number;
  maxHP: number;
  attack: number;
  shield: number;
  deckCount: number;
}

/**
 * プレイヤーの情報を表示するコンポーネント
 */
export function PlayerInfo({ hp, maxHP, attack, shield, deckCount }: PlayerInfoProps) {
  const hpPercentage = (hp / maxHP) * 100;

  return (
    <div className="bg-blue-900/50 rounded-lg p-4">
      <div className="text-center text-white">
        {/* HPバー */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>HP</span>
            <span>{hp} / {maxHP}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, hpPercentage)}%` }}
            />
          </div>
        </div>

        {/* 攻撃力・シールド・デッキ残数 */}
        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <span className="text-red-400 text-xl font-bold">{attack}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-blue-400 text-xl font-bold">{shield}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🃏</span>
            <span className="text-gray-300 text-xl font-bold">{deckCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
