// スート（マーク）の定義
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

// ランク（数字）の定義
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

// カードの定義
export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // A=1, 2-10=数字通り, J=11, Q=12, K=13
}

// スートの表示情報
export const SUIT_SYMBOLS: Record<Suit, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

// スートの色
export const SUIT_COLORS: Record<Suit, 'red' | 'black'> = {
  hearts: 'red',
  diamonds: 'red',
  clubs: 'black',
  spades: 'black',
};

// ランクの一覧
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// スートの一覧
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

// ランクから数値への変換
export const RANK_VALUES: Record<Rank, number> = {
  'A': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
};

// 敵の定義
export interface Enemy {
  name: string;
  maxHP: number;
  hp: number;
  attackRange: [number, number];  // ランダム攻撃値の範囲
  shieldRange: [number, number];  // ランダムシールド値の範囲
  currentAttack: number;
  currentShield: number;
}

// ゲームの進行状態
export type GameStatus = 'playing' | 'gameover' | 'stage_clear' | 'game_clear';

// ゲームの状態
export interface GameState {
  // プレイヤー
  playerHP: number;
  playerMaxHP: number;
  playerAttack: number;
  playerShield: number;
  deck: Card[];
  hand: Card[];  // 4枚

  // フィールド
  leftFieldCard: Card | null;   // 攻撃用の場札
  rightFieldCard: Card | null;  // シールド用の場札

  // 敵
  enemy: Enemy;

  // ゲーム進行
  stage: number;
  round: number;
  gameStatus: GameStatus;
}
