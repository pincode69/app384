// ============================================================
// Street Cricket Rush – Type Definitions
// ============================================================

// ---------- Characters & Equipment ----------

export interface Character {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  price: number;
  isUnlocked: boolean;
  skins: Skin[];
}

export interface Skin {
  id: string;
  name: string;
  icon: string;
  price: number;
  isUnlocked: boolean;
}

export interface Bat {
  id: string;
  name: string;
  icon: string;
  description: string;
  power: number;
  hitZone: number;
  comboBonus: number;
  level: number;
  maxLevel: number;
  upgradeCost: number;
  isUnlocked: boolean;
  color: string;
}

export interface GameLocation {
  id: string;
  name: string;
  description: string;
  icon: string;
  bgColor: string;
  accentColor: string;
  requiredLevel: number;
  isUnlocked: boolean;
  obstacles: ObstacleType[];
}

export type ObstacleType = 'car' | 'crate' | 'bottle' | 'bicycle';

// ---------- Match Player ----------

export type PlayerRole = 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';

export interface MatchPlayer {
  id: string;
  name: string;
  role: PlayerRole;
  skill: number;       // 1–10
  stamina: number;     // 0–100
  maxStamina: number;
  icon: string;
  color: string;
  isOnField: boolean;
  fieldPosition: number; // 0 = bench, 1-11 = field slot
  yellowCards: number;   // 0-2
  isRedCarded: boolean;
  isInjured: boolean;
}

// ---------- Match ----------

export type MatchEventType =
  | 'dot'
  | 'single'
  | 'double'
  | 'four'
  | 'six'
  | 'wide'
  | 'wicket'
  | 'mini_batting'
  | 'mini_slider'
  | 'mini_catch'
  | 'mini_falling'
  | 'yellow_card'
  | 'red_card'
  | 'injury'
  | 'medkit'
  | 'swap'
  | 'boost'
  | 'info';

export interface MatchEvent {
  id: number;
  type: MatchEventType;
  text: string;
  over: number;
  ball: number;
  runs?: number;
  isImportant?: boolean;
}

export type MiniGameKind = 'batting' | 'slider' | 'catch' | 'falling' | null;
export type MiniGameResult = 'perfect' | 'good' | 'fail';

export type HitResult = 'miss' | 'normal' | 'perfect';
export type BallType = 'normal' | 'golden' | 'fire';
export type BonusType = 'golden_ball' | 'slow_motion' | 'fever_mode';

export interface GameBall {
  id: number;
  type: BallType;
  lane: number;
  y: number;
  speed: number;
  isHit: boolean;
  hitTime: number;
}

// ---------- Boosters ----------

export interface Booster {
  id: string;
  name: string;
  icon: string;
  description: string;
  owned: number;
  price: number;
  currency: 'coins' | 'gems';
  effect: BoosterEffect;
}

export type BoosterEffect =
  | 'extra_life'
  | 'slow_start'
  | 'double_score'
  | 'big_hit_zone'
  | 'coin_magnet';

// ---------- General Game State ----------

export interface GameState {
  score: number;
  bestScore: number;
  lives: number;
  maxLives: number;
  combo: number;
  maxCombo: number;
  multiplier: number;
  coins: number;
  gems: number;
  energy: number;
  maxEnergy: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  feverMode: boolean;
  slowMotion: boolean;
  level: number;
  totalGamesPlayed: number;
  lastDailyRewardDay: number;
  lastDailyRewardDate: string | null;
  selectedCharacterId: string;
  selectedBatId: string;
  selectedLocationId: string;
  activeBoosters: string[];
  medkits: number;
}

// ---------- Shop ----------

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  currency: 'coins' | 'gems';
  quantity: number;
  category: 'booster' | 'cosmetic' | 'currency';
  isFree?: boolean;
}

export interface DailyReward {
  day: number;
  icon: string;
  name: string;
  quantity: number;
  isClaimed: boolean;
  isSpecial?: boolean;
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: string;
  badge?: string;
  timeLeft: string;
  items: { icon: string; quantity: number }[];
}
