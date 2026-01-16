import type { Enemy } from '../types/game';
import { randomInRange } from '../utils/gameLogic';

// 敵のベースデータ（hp, currentAttack, currentShieldは生成時に設定）
export interface EnemyTemplate {
  name: string;
  maxHP: number;
  attackRange: [number, number];
  shieldRange: [number, number];
}

// 全ステージの敵データ
export const ENEMY_TEMPLATES: EnemyTemplate[] = [
  {
    name: 'スライム',
    maxHP: 3,
    attackRange: [2, 4],
    shieldRange: [1,3],
  },
  {
    name: 'ゴブリン',
    maxHP: 5,
    attackRange: [3, 6],
    shieldRange: [1, 3],
  },
  {
    name: 'オーク',
    maxHP: 8,
    attackRange: [4, 8],
    shieldRange: [2, 5],
  },
  {
    name: 'ダークナイト',
    maxHP: 8,
    attackRange: [5, 9],
    shieldRange: [4, 7],
  },
  {
    name: 'ドラゴン',
    maxHP:15,
    attackRange: [6, 12],
    shieldRange: [4, 8],
  },
];

// ステージ数
export const TOTAL_STAGES = ENEMY_TEMPLATES.length;

// テンプレートから敵インスタンスを生成
export function createEnemyFromTemplate(template: EnemyTemplate): Enemy {
  return {
    name: template.name,
    maxHP: template.maxHP,
    hp: template.maxHP,
    attackRange: template.attackRange,
    shieldRange: template.shieldRange,
    currentAttack: randomInRange(template.attackRange[0], template.attackRange[1]),
    currentShield: randomInRange(template.shieldRange[0], template.shieldRange[1]),
  };
}

// ステージ番号から敵を生成（1から始まる）
export function createEnemyForStage(stage: number): Enemy {
  const index = Math.min(stage - 1, ENEMY_TEMPLATES.length - 1);
  return createEnemyFromTemplate(ENEMY_TEMPLATES[index]);
}
