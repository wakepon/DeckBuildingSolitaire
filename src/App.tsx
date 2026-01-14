import { useState, useMemo } from 'react';
import { Card } from './components/Card';
import { BuildInfo } from './components/BuildInfo';
import { createDeck, shuffleDeck } from './utils/deck';
import type { Card as CardType } from './types/game';

function App() {
  // デッキの状態管理
  const initialDeck = useMemo(() => createDeck(), []);
  const [deck, setDeck] = useState<CardType[]>(initialDeck);
  const [showFaceDown, setShowFaceDown] = useState(false);

  // デッキをシャッフル
  const handleShuffle = () => {
    setDeck(shuffleDeck(deck));
  };

  // デッキをリセット
  const handleReset = () => {
    setDeck(createDeck());
  };

  return (
    <div className="min-h-screen bg-green-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* タイトル */}
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Deck Building Solitaire
        </h1>

        {/* コントロールボタン */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleShuffle}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            シャッフル
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            リセット
          </button>
          <button
            onClick={() => setShowFaceDown(!showFaceDown)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showFaceDown ? '表向きにする' : '裏向きにする'}
          </button>
        </div>

        {/* デッキ情報 */}
        <p className="text-white text-center mb-4">
          カード枚数: {deck.length}枚
        </p>

        {/* カード一覧 */}
        <div className="flex flex-wrap justify-center gap-2">
          {deck.map((card) => (
            <Card
              key={card.id}
              card={card}
              faceDown={showFaceDown}
              onClick={() => console.log('Clicked:', card)}
            />
          ))}
        </div>
      </div>

      {/* ビルド日時 */}
      <BuildInfo />
    </div>
  );
}

export default App;
