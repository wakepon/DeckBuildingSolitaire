import { GameBoard } from './components/GameBoard';
import { BuildInfo } from './components/BuildInfo';
import { useGameReducer } from './hooks/useGameReducer';
import { TOTAL_STAGES } from './data/enemies';

function App() {
  const { state, resetGame, playCard, nextStage } = useGameReducer();

  // ゲームクリア画面（全ステージクリア）
  if (state.gameStatus === 'game_clear') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-300 mb-4 animate-pulse">
            CONGRATULATIONS!
          </h1>
          <p className="text-2xl text-white mb-2">全ステージクリア!</p>
          <p className="text-gray-300 mb-6">
            残りHP: {state.playerHP} / {state.playerMaxHP}
          </p>
          <div className="space-y-4">
            <p className="text-yellow-200 text-lg">
              あなたは{TOTAL_STAGES}体の敵を倒しました!
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-yellow-500 text-gray-900 text-lg font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              もう一度プレイ
            </button>
          </div>
        </div>
        <BuildInfo />
      </div>
    );
  }

  // ゲームオーバー画面
  if (state.gameStatus === 'gameover') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h1>
          <p className="text-gray-300 mb-2">
            Stage {state.stage} / {TOTAL_STAGES} - {state.enemy.name}
          </p>
          <p className="text-white text-lg mb-6">敗北しました...</p>
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">STAGE CLEAR!</h1>
          <p className="text-gray-300 mb-2">
            Stage {state.stage} / {TOTAL_STAGES} - {state.enemy.name} を撃破!
          </p>
          <p className="text-white text-lg mb-6">
            残りHP: {state.playerHP} / {state.playerMaxHP}
          </p>
          <button
            onClick={nextStage}
            className="px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors"
          >
            次のステージへ (Stage {state.stage + 1})
          </button>
        </div>
        <BuildInfo />
      </div>
    );
  }

  // ゲームプレイ画面
  return (
    <div className="min-h-screen bg-green-800 p-4">
      <GameBoard
        state={state}
        onPlayCard={playCard}
        onReset={resetGame}
      />
      <BuildInfo />
    </div>
  );
}

export default App;
