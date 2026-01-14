/**
 * ビルド日時を表示するコンポーネント
 */
export function BuildInfo() {
  const buildTime = new Date(__BUILD_TIME__).toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed bottom-2 right-2 text-xs text-gray-400">
      Deployed: {buildTime}
    </div>
  );
}
