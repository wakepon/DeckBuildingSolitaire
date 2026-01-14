import { Card } from './components/Card';
import { BuildInfo } from './components/BuildInfo';
import { useGameReducer } from './hooks/useGameReducer';
import { canPlayCard } from './utils/gameLogic';

function App() {
  const { state, resetGame, playCard, nextStage } = useGameReducer();

  // ゲームオーバー画面
  if (state.gameStatus === 'gameover') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">GAME OVER</h1>
          <p className="text-white mb-6">Stage {state.stage} で敗北...</p>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            もう一度プレイ
          </button>
        </div>
        <BuildInfo />
      </div>
    );
  }

  // ステージクリア画面
  if (state.gameStatus === 'stage_clear') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">STAGE CLEAR!</h1>
          <p className="text-white mb-6">Stage {state.stage} をクリア!</p>
          <button
            onClick={nextStage}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            次のステージへ
          </button>
        </div>
        <BuildInfo />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー: ステージ・ラウンド情報 */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white">
            Stage {state.stage} - Round {state.round}
          </h1>
        </div>

        {/* 敵エリア */}
        <div className="bg-red-900/50 rounded-lg p-4 mb-4">
          <div className="text-center text-white">
            <p className="text-lg font-bold">{state.enemy.name}</p>
            <p>HP: {state.enemy.hp} / {state.enemy.maxHP}</p>
            <div className="flex justify-center gap-8 mt-2">
              <span className="text-red-400">攻撃: {state.enemy.currentAttack}</span>
              <span className="text-blue-400">シールド: {state.enemy.currentShield}</span>
            </div>
          </div>
        </div>

        {/* プレイヤーステータス */}
        <div className="bg-blue-900/50 rounded-lg p-4 mb-4">
          <div className="text-center text-white">
            <p>HP: {state.playerHP} / {state.playerMaxHP}</p>
            <div className="flex justify-center gap-8 mt-2">
              <span className="text-red-400">攻撃力: {state.playerAttack}</span>
              <span className="text-blue-400">シールド: {state.playerShield}</span>
            </div>
          </div>
        </div>

        {/* フィールド */}
        <div className="flex justify-center gap-8 mb-6">
          {/* 左フィールド（攻撃用） */}
          <div className="text-center">
            <p className="text-red-400 mb-2 font-bold">攻撃</p>
            <div className="bg-red-900/30 p-2 rounded-lg">
              {state.leftFieldCard ? (
                <Card card={state.leftFieldCard} />
              ) : (
                <div className="w-16 h-24 border-2 border-dashed border-red-400 rounded-lg" />
              )}
            </div>
          </div>

          {/* 右フィールド（シールド用） */}
          <div className="text-center">
            <p className="text-blue-400 mb-2 font-bold">シールド</p>
            <div className="bg-blue-900/30 p-2 rounded-lg">
              {state.rightFieldCard ? (
                <Card card={state.rightFieldCard} />
              ) : (
                <div className="w-16 h-24 border-2 border-dashed border-blue-400 rounded-lg" />
              )}
            </div>
          </div>
        </div>

        {/* 手札 */}
        <div className="mb-4">
          <p className="text-white text-center mb-2">手札 (デッキ残り: {state.deck.length}枚)</p>
          <div className="flex justify-center gap-2">
            {state.hand.map((card) => {
              const canPlayLeft = canPlayCard(card, state.leftFieldCard);
              const canPlayRight = canPlayCard(card, state.rightFieldCard);
              const isPlayable = canPlayLeft || canPlayRight;

              return (
                <div key={card.id} className="flex flex-col items-center gap-1">
                  <Card
                    card={card}
                    className={isPlayable ? 'ring-2 ring-yellow-400' : 'opacity-50'}
                  />
                  {isPlayable && (
                    <div className="flex gap-1">
                      {canPlayLeft && (
                        <button
                          onClick={() => playCard(card.id, 'left')}
                          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          攻撃
                        </button>
                      )}
                      {canPlayRight && (
                        <button
                          onClick={() => playCard(card.id, 'right')}
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          守備
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* リセットボタン */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            リセット
          </button>
        </div>
      </div>

      <BuildInfo />
    </div>
  );
}

export default App;
