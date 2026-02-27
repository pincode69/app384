import { MatchPlayer } from '@/types/game';

export const teamRoster: MatchPlayer[] = [
  { id: 'p1',  name: 'Raj Kumar',     role: 'batsman',      skill: 8,  stamina: 100, maxStamina: 100, icon: 'cricket',       color: '#4A90E2', isOnField: true,  fieldPosition: 1,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p2',  name: 'Amit Shah',     role: 'batsman',      skill: 7,  stamina: 100, maxStamina: 100, icon: 'cricket',       color: '#FF8C42', isOnField: true,  fieldPosition: 2,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p3',  name: 'Dev Patel',     role: 'allrounder',   skill: 9,  stamina: 100, maxStamina: 100, icon: 'account-star',  color: '#FFD700', isOnField: true,  fieldPosition: 3,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p4',  name: 'Vikram Singh',  role: 'bowler',       skill: 8,  stamina: 100, maxStamina: 100, icon: 'arm-flex',      color: '#E74C3C', isOnField: true,  fieldPosition: 4,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p5',  name: 'Rohan Joshi',   role: 'batsman',      skill: 6,  stamina: 100, maxStamina: 100, icon: 'cricket',       color: '#2ECC71', isOnField: true,  fieldPosition: 5,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p6',  name: 'Arjun Nair',    role: 'bowler',       skill: 7,  stamina: 100, maxStamina: 100, icon: 'arm-flex',      color: '#9B59B6', isOnField: true,  fieldPosition: 6,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p7',  name: 'Karan Mehra',   role: 'allrounder',   skill: 7,  stamina: 100, maxStamina: 100, icon: 'account-star',  color: '#3498DB', isOnField: true,  fieldPosition: 7,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p8',  name: 'Sanjay Rao',    role: 'wicketkeeper', skill: 8,  stamina: 100, maxStamina: 100, icon: 'shield-account',color: '#F39C12', isOnField: true,  fieldPosition: 8,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p9',  name: 'Nikhil Verma',  role: 'bowler',       skill: 6,  stamina: 100, maxStamina: 100, icon: 'arm-flex',      color: '#1ABC9C', isOnField: true,  fieldPosition: 9,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p10', name: 'Pradeep Das',   role: 'batsman',      skill: 5,  stamina: 100, maxStamina: 100, icon: 'cricket',       color: '#E67E22', isOnField: true,  fieldPosition: 10, yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p11', name: 'Suresh Babu',   role: 'bowler',       skill: 7,  stamina: 100, maxStamina: 100, icon: 'arm-flex',      color: '#C0392B', isOnField: true,  fieldPosition: 11, yellowCards: 0, isRedCarded: false, isInjured: false },
  // Bench
  { id: 'p12', name: 'Anil Kapoor',   role: 'batsman',      skill: 6,  stamina: 100, maxStamina: 100, icon: 'cricket',       color: '#8E44AD', isOnField: false, fieldPosition: 0,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p13', name: 'Rahul Dravid',  role: 'allrounder',   skill: 8,  stamina: 100, maxStamina: 100, icon: 'account-star',  color: '#16A085', isOnField: false, fieldPosition: 0,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p14', name: 'Mohit Sharma',  role: 'bowler',       skill: 5,  stamina: 100, maxStamina: 100, icon: 'arm-flex',      color: '#D35400', isOnField: false, fieldPosition: 0,  yellowCards: 0, isRedCarded: false, isInjured: false },
  { id: 'p15', name: 'Yash Gupta',    role: 'batsman',      skill: 4,  stamina: 100, maxStamina: 100, icon: 'cricket',       color: '#7F8C8D', isOnField: false, fieldPosition: 0,  yellowCards: 0, isRedCarded: false, isInjured: false },
];

// Field position labels for the cricket field diagram
export const fieldPositions: { id: number; label: string; x: number; y: number }[] = [
  { id: 1,  label: 'Opener',       x: 0.50, y: 0.80 },
  { id: 2,  label: 'Opener',       x: 0.30, y: 0.75 },
  { id: 3,  label: 'No.3',         x: 0.70, y: 0.75 },
  { id: 4,  label: 'Bowler',       x: 0.50, y: 0.18 },
  { id: 5,  label: 'Mid-off',      x: 0.30, y: 0.30 },
  { id: 6,  label: 'Mid-on',       x: 0.70, y: 0.30 },
  { id: 7,  label: 'Cover',        x: 0.15, y: 0.48 },
  { id: 8,  label: 'Keeper',       x: 0.50, y: 0.92 },
  { id: 9,  label: 'Square Leg',   x: 0.85, y: 0.48 },
  { id: 10, label: 'Fine Leg',     x: 0.85, y: 0.68 },
  { id: 11, label: 'Third Man',    x: 0.15, y: 0.68 },
];
