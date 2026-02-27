// ============================================================
// Street Cricket Rush – Asset Registry
// ============================================================

// Game icon images from assets/images
export const GameAssets = {
  // Icons
  fireBall: require('@/assets/images/fire-ball-icon.png'),
  fireBallSmall: require('@/assets/images/fire-ball-icon-1.png'),
  goldenCup: require('@/assets/images/golden-cup-icon.png'),
  cup: require('@/assets/images/cup-icon.png'),
  energy: require('@/assets/images/energy-boost-icon.png'),
  medicalKit: require('@/assets/images/medical-kit-icon.png'),
  money: require('@/assets/images/money-icon.png'),
  medal: require('@/assets/images/medal-icon.png'),
  aura: require('@/assets/images/aura-icon.png'),
  cards: require('@/assets/images/ellow-red-cards-icon.png'),
  startIcon: require('@/assets/images/start-icon.png'),

  // Reward images
  cupReward: require('@/assets/images/cup-reword.png'),
  moneyReward: require('@/assets/images/money-reword.png'),
  seasonReward: require('@/assets/images/season-reword.png'),
  cup1: require('@/assets/images/cup-1.png'),

  // Team / Player images
  team1: require('@/assets/images/team1.png'),
  team2: require('@/assets/images/team2.png'),

  // Character / UI
  mainCharacter: require('@/assets/images/main-img.png'),
  playBtn: require('@/assets/images/play-btn.png'),
  btnBg: require('@/assets/images/btn-bg.png'),

  // Backgrounds
  stadionBg: require('@/assets/images/stadion-bg.png'),
  stadionBg1: require('@/assets/images/stadion-bg-1.png'),
  stadionBg2: require('@/assets/images/stadion-bg-2.png'),
  stadionBg3: require('@/assets/images/stadion-bg-3.png'),
  stadionBgRain: require('@/assets/images/stadion-bg-rain.png'),
  shopBg: require('@/assets/images/shop-bg.png'),
  clothesRoomBg: require('@/assets/images/clothes-room-bg.png'),
} as const;

// Map location IDs to background images
export const LocationBgMap: Record<string, any> = {
  new_york: GameAssets.stadionBg1,
  rio: GameAssets.stadionBg2,
  middle_east: GameAssets.stadionBg3,
  tokyo: GameAssets.stadionBgRain,
  stadium: GameAssets.stadionBg,
};
