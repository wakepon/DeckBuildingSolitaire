import type { Enemy } from '../types/game';

interface EnemyInfoProps {
  enemy: Enemy;
}

/**
 * 敵の情報を表示するコンポーネント
 */
export function EnemyInfo({ enemy }: EnemyInfoProps) {
  const hpPercentage = (enemy.hp / enemy.maxHP) * 100;

  return (
    <div className="bg-red-900/50 rounded-lg p-4">
      <div className="text-center text-white">
        {/* 敵の名前 */}
        <p className="text-lg font-bold mb-2">{enemy.name}</p>

        {/* HPバー */}
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>HP</span>
            <span>{enemy.hp} / {enemy.maxHP}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(0, hpPercentage)}%` }}
            />
          </div>
        </div>

        {/* 攻撃力とシールド */}
        <div className="flex justify-center gap-8 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚔️</span>
            <span className="text-red-400 text-xl font-bold">{enemy.currentAttack}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-blue-400 text-xl font-bold">{enemy.currentShield}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
