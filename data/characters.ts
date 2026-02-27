import { Character } from '@/types/game';

export const characters: Character[] = [
  {
    id: 'rookie',
    name: 'Rookie Raj',
    description: 'A young street cricket enthusiast with big dreams!',
    icon: 'cricket',
    color: '#4A90E2',
    price: 0,
    isUnlocked: true,
    skins: [
      { id: 'default', name: 'Default', icon: 'tshirt-crew', price: 0, isUnlocked: true },
      { id: 'jersey', name: 'Pro Jersey', icon: 'tshirt-v', price: 200, isUnlocked: false },
      { id: 'golden', name: 'Golden Kit', icon: 'star-circle', price: 500, isUnlocked: false },
    ],
  },
  {
    id: 'captain',
    name: 'Captain Storm',
    description: 'The legendary street captain. Master of combo hits!',
    icon: 'flash',
    color: '#FF8C42',
    price: 500,
    isUnlocked: false,
    skins: [
      { id: 'default', name: 'Default', icon: 'tshirt-crew', price: 0, isUnlocked: true },
      { id: 'thunder', name: 'Thunder Suit', icon: 'weather-lightning', price: 300, isUnlocked: false },
      { id: 'fire', name: 'Fire Outfit', icon: 'fire', price: 600, isUnlocked: false },
    ],
  },
  {
    id: 'alien',
    name: 'Zorp the Alien',
    description: 'A goofy alien who fell in love with cricket!',
    icon: 'alien',
    color: '#4CD964',
    price: 1000,
    isUnlocked: false,
    skins: [
      { id: 'default', name: 'Default', icon: 'alien', price: 0, isUnlocked: true },
      { id: 'space', name: 'Space Suit', icon: 'rocket-launch', price: 400, isUnlocked: false },
      { id: 'disco', name: 'Disco Glow', icon: 'creation', price: 700, isUnlocked: false },
    ],
  },
  {
    id: 'ninja',
    name: 'Ninja Naya',
    description: 'Silent but deadly. Her swings are lightning fast!',
    icon: 'ninja',
    color: '#9B59B6',
    price: 800,
    isUnlocked: false,
    skins: [
      { id: 'default', name: 'Default', icon: 'ninja', price: 0, isUnlocked: true },
      { id: 'shadow', name: 'Shadow Form', icon: 'weather-night', price: 350, isUnlocked: false },
      { id: 'sakura', name: 'Sakura Style', icon: 'flower', price: 550, isUnlocked: false },
    ],
  },
  {
    id: 'robot',
    name: 'RoboBat 3000',
    description: 'Engineered for the perfect swing. Beep boop!',
    icon: 'robot',
    color: '#5AC8FA',
    price: 1500,
    isUnlocked: false,
    skins: [
      { id: 'default', name: 'Default', icon: 'robot', price: 0, isUnlocked: true },
      { id: 'chrome', name: 'Chrome Edition', icon: 'cog', price: 500, isUnlocked: false },
      { id: 'neon', name: 'Neon Circuit', icon: 'chip', price: 800, isUnlocked: false },
    ],
  },
];
