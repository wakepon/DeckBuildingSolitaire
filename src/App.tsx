import { GameBoard } from './components/GameBoard';
import { BuildInfo } from './components/BuildInfo';
import { useGameReducer } from './hooks/useGameReducer';

function App() {
  const { state, resetGame, playCard, nextStage } = useGameReducer();

  // ゲームオーバー画面
  if (state.gameStatus === 'gameover') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-red-500 mb-4">GAME OVER</h1>
          <p className="text-gray-300 mb-2">Stage {state.stage} - Round {state.round}</p>
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
          <p className="text-gray-300 mb-2">Stage {state.stage} クリア!</p>
          <p className="text-white text-lg mb-6">
            残りHP: {state.playerHP} / {state.playerMaxHP}
          </p>
          <button
            onClick={nextStage}
            className="px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition-colors"
          >
            次のステージへ
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
