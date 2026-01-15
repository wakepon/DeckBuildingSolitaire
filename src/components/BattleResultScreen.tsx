import { useEffect, useState } from 'react';
import type { BattleResult, Enemy } from '../types/game';

interface BattleResultScreenProps {
  result: BattleResult;
  enemy: Enemy;
  playerHP: number;
  onContinue: () => void;
}

type Phase = 'player_attack' | 'enemy_attack' | 'result';

/**
 * バトル結果を演出付きで表示するコンポーネント
 */
export function BattleResultScreen({
  result,
  enemy,
  playerHP,
  onContinue,
}: BattleResultScreenProps) {
  const [phase, setPhase] = useState<Phase>('player_attack');
  const [showContinue, setShowContinue] = useState(false);

  // フェーズ遷移
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // プレイヤー攻撃フェーズ
    timers.push(setTimeout(() => {
      if (!result.enemyDefeated) {
        setPhase('enemy_attack');
      } else {
        setPhase('result');
      }
    }, 1500));

    // 敵攻撃フェーズ（敵が生存している場合）
    if (!result.enemyDefeated) {
      timers.push(setTimeout(() => {
        setPhase('result');
      }, 3000));
    }

    // 続行ボタン表示
    timers.push(setTimeout(() => {
      setShowContinue(true);
    }, result.enemyDefeated ? 2000 : 3500));

    return () => timers.forEach(clearTimeout);
  }, [result.enemyDefeated]);

  const newEnemyHP = Math.max(0, enemy.hp - result.damageToEnemy);
  const newPlayerHP = result.enemyDefeated ? playerHP : Math.max(0, playerHP - result.damageToPlayer);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">ラウンド終了</h2>

        {/* プレイヤー攻撃フェーズ */}
        <div className={`transition-all duration-300 ${phase === 'player_attack' ? 'scale-110' : ''}`}>
          <div className="bg-red-900/50 rounded-lg p-4">
            <p className="text-center text-white mb-2">あなたの攻撃</p>
            <div className="flex justify-center items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">攻撃力</p>
                <p className="text-2xl font-bold text-red-400">{result.playerAttack}</p>
              </div>
              <span className="text-2xl text-gray-500">-</span>
              <div className="text-center">
                <p className="text-sm text-gray-400">敵シールド</p>
                <p className="text-2xl font-bold text-blue-400">{result.enemyShield}</p>
              </div>
              <span className="text-2xl text-gray-500">=</span>
              <div className="text-center">
                <p className="text-sm text-gray-400">ダメージ</p>
                <p className={`text-2xl font-bold ${result.damageToEnemy > 0 ? 'text-yellow-400 animate-damage-pop' : 'text-gray-500'}`}>
                  {result.damageToEnemy}
                </p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-400">{enemy.name} HP</p>
              <p className="text-lg">
                <span className="text-red-400">{enemy.hp}</span>
                <span className="text-gray-500"> → </span>
                <span className={result.enemyDefeated ? 'text-yellow-400 font-bold' : 'text-red-400'}>
                  {result.enemyDefeated ? '撃破!' : newEnemyHP}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 敵攻撃フェーズ（敵が生存している場合） */}
        {!result.enemyDefeated && (
          <div className={`transition-all duration-300 ${
            phase === 'enemy_attack' ? 'scale-110' : ''
          } ${phase === 'player_attack' ? 'opacity-50' : ''}`}>
            <div className="bg-blue-900/50 rounded-lg p-4">
              <p className="text-center text-white mb-2">{enemy.name}の攻撃</p>
              <div className="flex justify-center items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400">敵攻撃力</p>
                  <p className="text-2xl font-bold text-red-400">{result.enemyAttack}</p>
                </div>
                <span className="text-2xl text-gray-500">-</span>
                <div className="text-center">
                  <p className="text-sm text-gray-400">シールド</p>
                  <p className="text-2xl font-bold text-blue-400">{result.playerShield}</p>
                </div>
                <span className="text-2xl text-gray-500">=</span>
                <div className="text-center">
                  <p className="text-sm text-gray-400">ダメージ</p>
                  <p className={`text-2xl font-bold ${
                    result.damageToPlayer > 0 && phase !== 'player_attack'
                      ? 'text-yellow-400 animate-damage-pop'
                      : 'text-gray-500'
                  }`}>
                    {result.damageToPlayer}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-400">あなたの HP</p>
                <p className="text-lg">
                  <span className="text-green-400">{playerHP}</span>
                  <span className="text-gray-500"> → </span>
                  <span className={result.playerDefeated ? 'text-red-500 font-bold' : 'text-green-400'}>
                    {result.playerDefeated ? '戦闘不能!' : newPlayerHP}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 結果サマリー */}
        {phase === 'result' && (
          <div className="text-center animate-slide-in-up">
            {result.enemyDefeated && (
              <p className="text-2xl font-bold text-yellow-400 animate-victory">
                {enemy.name}を倒した!
              </p>
            )}
            {result.playerDefeated && (
              <p className="text-2xl font-bold text-red-500">
                力尽きた...
              </p>
            )}
            {!result.enemyDefeated && !result.playerDefeated && (
              <p className="text-xl text-white">
                次のラウンドへ
              </p>
            )}
          </div>
        )}

        {/* 続行ボタン */}
        {showContinue && (
          <div className="text-center animate-fade-in">
            <button
              onClick={onContinue}
              className="px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors"
            >
              続ける
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
