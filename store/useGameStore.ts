// ============================================================
// Street Cricket Rush – Main Game Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { GameState, HitResult, Booster } from '@/types/game';
import { characters } from '@/data/characters';
import { bats } from '@/data/bats';
import { locations } from '@/data/locations';
import { defaultBoosters } from '@/data/boosters';
import { dailyRewards } from '@/data/shop-items';

interface GameStore extends GameState {
  // Game actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;

  // Gameplay
  hitBall: (result: HitResult) => void;

  // Energy
  useEnergy: () => boolean;
  refillEnergy: (amount: number) => void;

  // Currency
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;

  // Selection
  selectCharacter: (id: string) => void;
  selectBat: (id: string) => void;
  selectLocation: (id: string) => void;

  // Characters & Bats
  unlockCharacter: (id: string) => void;
  unlockBat: (id: string) => void;
  upgradeBat: (id: string) => void;
  charactersList: typeof characters;
  batsList: typeof bats;
  locationsList: typeof locations;

  // Boosters
  boosters: Booster[];
  toggleBooster: (id: string) => void;
  buyBooster: (id: string) => void;

  // Medical kit
  buyMedkit: () => boolean;
  useMedkit: () => boolean;

  // Daily reward
  claimDailyReward: () => number;
  getDailyRewardDay: () => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  score: 0,
  bestScore: 0,
  lives: 3,
  maxLives: 3,
  combo: 0,
  maxCombo: 0,
  multiplier: 1,
  coins: 0,
  gems: 0,
  energy: 5,
  maxEnergy: 5,
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  feverMode: false,
  slowMotion: false,
  level: 1,
  totalGamesPlayed: 0,
  lastDailyRewardDay: 0,
  lastDailyRewardDate: null,
  selectedCharacterId: 'rookie',
  selectedBatId: 'wooden',
  selectedLocationId: 'new_york',
  activeBoosters: [],
  medkits: 0,
  charactersList: characters,
  batsList: bats,
  locationsList: locations,
  boosters: defaultBoosters,

  startGame: () => {
    const state = get();
    const hasExtraLife = state.activeBoosters.includes('extra_life');
    const hasSlowStart = state.activeBoosters.includes('slow_start');

    // Consume boosters
    const updatedBoosters = state.boosters.map((b) =>
      state.activeBoosters.includes(b.id)
        ? { ...b, owned: Math.max(0, b.owned - 1) }
        : b
    );

    set({
      score: 0,
      lives: hasExtraLife ? 4 : 3,
      maxLives: hasExtraLife ? 4 : 3,
      combo: 0,
      maxCombo: 0,
      multiplier: 1,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      feverMode: false,
      slowMotion: hasSlowStart,
      boosters: updatedBoosters,
    });
  },

  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),

  endGame: () => {
    const state = get();
    const newBest = Math.max(state.score, state.bestScore);
    const hasMagnet = state.activeBoosters.includes('coin_magnet');
    const earnedCoins = Math.floor(state.score / 10) * (hasMagnet ? 1.5 : 1);
    set({
      isPlaying: false,
      isGameOver: true,
      bestScore: newBest,
      coins: state.coins + Math.floor(earnedCoins),
      totalGamesPlayed: state.totalGamesPlayed + 1,
      level: Math.floor((state.totalGamesPlayed + 1) / 5) + 1,
      activeBoosters: [],
    });
  },

  resetGame: () =>
    set({
      score: 0,
      lives: 3,
      maxLives: 3,
      combo: 0,
      maxCombo: 0,
      multiplier: 1,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      feverMode: false,
      slowMotion: false,
      activeBoosters: [],
    }),

  hitBall: (result: HitResult) => {
    const state = get();
    if (result === 'miss') {
      const newLives = state.lives - 1;
      if (newLives <= 0) {
        get().endGame();
      } else {
        set({ lives: newLives, combo: 0, multiplier: 1 });
      }
      return;
    }

    const hasDoubleScore = state.activeBoosters.includes('double_score');
    const baseScore = result === 'perfect' ? 100 : 50;
    const newCombo = state.combo + 1;
    const newMaxCombo = Math.max(state.maxCombo, newCombo);
    const newMultiplier = Math.min(1 + Math.floor(newCombo / 3) * 0.5, 5);
    const scoreGain = Math.floor(
      baseScore * newMultiplier * (state.feverMode ? 2 : 1) * (hasDoubleScore ? 2 : 1)
    );

    set({
      score: state.score + scoreGain,
      combo: newCombo,
      maxCombo: newMaxCombo,
      multiplier: newMultiplier,
    });
  },

  useEnergy: () => {
    const state = get();
    if (state.energy > 0) {
      set({ energy: state.energy - 1 });
      return true;
    }
    return false;
  },

  refillEnergy: (amount: number) =>
    set((s) => ({ energy: Math.min(s.maxEnergy, s.energy + amount) })),

  addCoins: (amount: number) => set((s) => ({ coins: s.coins + amount })),
  spendCoins: (amount: number) => {
    const state = get();
    if (state.coins >= amount) {
      set({ coins: state.coins - amount });
      return true;
    }
    return false;
  },

  addGems: (amount: number) => set((s) => ({ gems: s.gems + amount })),
  spendGems: (amount: number) => {
    const state = get();
    if (state.gems >= amount) {
      set({ gems: state.gems - amount });
      return true;
    }
    return false;
  },

  selectCharacter: (id: string) => set({ selectedCharacterId: id }),
  selectBat: (id: string) => set({ selectedBatId: id }),
  selectLocation: (id: string) => set({ selectedLocationId: id }),

  unlockCharacter: (id: string) => {
    const char = characters.find((c) => c.id === id);
    if (!char) return;
    if (get().spendCoins(char.price)) {
      const updated = get().charactersList.map((c) =>
        c.id === id ? { ...c, isUnlocked: true } : c
      );
      set({ charactersList: updated });
    }
  },

  unlockBat: (id: string) => {
    const bat = bats.find((b) => b.id === id);
    if (!bat) return;
    if (get().spendCoins(bat.upgradeCost)) {
      const updated = get().batsList.map((b) =>
        b.id === id ? { ...b, isUnlocked: true } : b
      );
      set({ batsList: updated });
    }
  },

  upgradeBat: (id: string) => {
    const state = get();
    const bat = state.batsList.find((b) => b.id === id);
    if (!bat || bat.level >= bat.maxLevel) return;
    const cost = bat.upgradeCost * bat.level;
    if (get().spendCoins(cost)) {
      const updated = state.batsList.map((b) =>
        b.id === id
          ? {
              ...b,
              level: b.level + 1,
              power: b.power + 1,
              upgradeCost: Math.floor(b.upgradeCost * 1.5),
            }
          : b
      );
      set({ batsList: updated });
    }
  },

  toggleBooster: (id: string) => {
    const state = get();
    const booster = state.boosters.find((b) => b.id === id);
    if (!booster || booster.owned <= 0) return;

    const isActive = state.activeBoosters.includes(id);
    if (isActive) {
      set({ activeBoosters: state.activeBoosters.filter((b) => b !== id) });
    } else {
      set({ activeBoosters: [...state.activeBoosters, id] });
    }
  },

  buyBooster: (id: string) => {
    const state = get();
    const booster = state.boosters.find((b) => b.id === id);
    if (!booster) return;

    const canBuy =
      booster.currency === 'coins'
        ? state.coins >= booster.price
        : state.gems >= booster.price;

    if (canBuy) {
      if (booster.currency === 'coins') {
        set({ coins: state.coins - booster.price });
      } else {
        set({ gems: state.gems - booster.price });
      }
      const updated = state.boosters.map((b) =>
        b.id === id ? { ...b, owned: b.owned + 1 } : b
      );
      set({ boosters: updated });
    }
  },

  buyMedkit: () => {
    const state = get();
    if (state.coins >= 100) {
      set({ coins: state.coins - 100, medkits: state.medkits + 1 });
      return true;
    }
    return false;
  },

  useMedkit: () => {
    const state = get();
    if (state.medkits > 0) {
      set({ medkits: state.medkits - 1 });
      return true;
    }
    return false;
  },

  claimDailyReward: () => {
    const state = get();
    const today = new Date().toDateString();
    if (state.lastDailyRewardDate === today) return -1;

    const nextDay =
      state.lastDailyRewardDay >= 7 ? 1 : state.lastDailyRewardDay + 1;
    const reward = dailyRewards.find((r) => r.day === nextDay);
    if (!reward) return -1;

    if (reward.name === 'Coins') {
      set({ coins: state.coins + reward.quantity });
    }

    set({
      lastDailyRewardDay: nextDay,
      lastDailyRewardDate: today,
    });

    return nextDay;
  },

  getDailyRewardDay: () => get().lastDailyRewardDay,
}));
