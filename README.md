# Street Cricket Rush

A hyper-casual arcade mobile game built with **Expo React Native** and **TypeScript**. Manage your street cricket team, play matches, survive mini-games, and rise through the ranks!

---

## Overview

Street Cricket Rush is a cricket team manager blended with arcade mini-games. You build a squad of street cricketers, gear them up with bats and boosters, then jump into fast-paced match simulations where you must react to events, handle injuries, play mini-games, and chase down the target score.

**Genre:** Hyper-casual / Arcade / Team Manager with Cricket elements  
**Platform:** iOS & Android (portrait, 9:16)  
**Session length:** 2-5 minutes per match  
**Visual style:** Casual, cartoonish (Clash Royale / Disney Pixar inspired), bright colours, 3D button effects, Fugaz One display font

---

## Game Mechanics

### Match Flow

1. **Pre-game** — Pick your location, set up team formation, equip boosters
2. **Match simulation** — Auto-simulated ball-by-ball cricket with an event log
3. **Mini-games** — Pop up during the match and affect scoring
4. **Post-match** — Results screen with coins, rewards, and stats

### Core Gameplay

- Matches are simulated ball-by-ball with random events (runs, wickets, extras, cards, injuries)
- The player must react to events: use boosters, swap tired players, heal injuries
- A **target score** is set at the start — chase it within 20 overs
- Each ball drains player **stamina** — tired players perform worse
- Match ends when all wickets fall, overs are exhausted, or the target is reached

### Mini-Games

During the match, mini-games pop up that affect the next ball outcome:

| Mini-Game | How it works | Result |
|-----------|-------------|--------|
| **Batting** | Tap the ball at the right moment in the strike zone | Perfect / Good / Fail hit |
| **Slider** | Stop a moving marker inside the green zone | Accuracy-based scoring |
| **Catch** | Tap falling balls before they land | Combo-based scoring |
| **Falling** | Hit balls falling down lanes (endless-runner style) | Score & combo multiplier |

Mini-game results directly influence match events (e.g. perfect = boundary, fail = wicket).

### Card System

- **Yellow Card** — Player receives a warning; 2 yellows = automatic red card
- **Red Card** — Player is removed from the match (cannot bat again)
- Cards appear as random events during the simulation

### Injury & Medical Kit

- Players can get **injured** during a match — the simulation pauses
- You must choose: **Use a medkit** (heals + restores stamina), **Buy & use** (costs 100 coins), or **Swap the player** out
- Medkits can be purchased in the shop or earned as rewards

### Energy System

- Each match costs **1 energy** to start
- Maximum energy: **5** (refills over time or can be purchased)
- Prevents endless grinding and encourages strategic play

### Boosters

Equip before a match for in-game advantages:

| Booster | Effect |
|---------|--------|
| Shield | Start with 4 lives instead of 3 |
| Slow Start | First 15 seconds in slow motion |
| Double Score | 2x score for 30 seconds |
| Big Zone | Larger hit zone for easier hits |
| Coin Magnet | Earn 50% more coins from the match |

Boosters are consumed on use. Buy more in the shop.

---

## Progression

### Coins & Gems

- **Coins** — Earned from matches, daily rewards, and calendar events. Used for bats, boosters, and medkits.
- **Gems** — Premium currency for special boosters and shop items.

### Bat Upgrades

Each bat has stats (power, speed, control) and can be leveled up:
- Higher level = better stats
- Upgrade costs increase per level
- Multiple bats to collect and unlock

### Characters

Unlock and equip different heroes with unique skins:
- **Rookie** — Default young cricketer
- **Pro** — Experienced player with gear
- **Alien** — Fun cartoon alien character

### Locations

Play in different themed stadiums:
- **New York** — City streets, taxis, skyscrapers
- **Rio de Janeiro** — Tropical vibes, bright houses, palm trees
- **Dubai** — Golden sands, warm atmosphere
- **Tokyo** — Neon lights, night cityscape
- **Grand Stadium** — Ultimate arena with roaring crowds

Each location has a unique background during gameplay.

### Match Calendar

A weekly schedule of matches with increasing rewards:
- Monday through Sunday, each day has a match type (Friendly, League, Cup, Rivals, Derby, Finals)
- Completed days are marked; today's match is highlighted
- Higher-tier matches give more coin rewards

### Daily Rewards

Log in every day for a 7-day reward cycle:
- Coins, gems, boosters, and special items
- Streak resets if you miss a day

---

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | Main menu with play button, stats, calendar, inventory, season banner |
| **Team** | Hero selection, gear/skin management, booster equip, formation setup |
| **Bats** | View, upgrade, and equip bats |
| **Shop** | Buy boosters, medkits, chests, energy, daily deals |
| **Formation** | Pre-match team setup — position players on the field |
| **Locations** | Choose match location (unlocked by level) |
| **Gameplay** | Live match simulation with event log, mini-games, swaps, medkit usage |
| **Game Over** | Match results — score, rewards, coins earned |
| **Settings** | Game settings and preferences |
| **Daily Reward** | Modal with 7-day reward grid |

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Expo SDK** | React Native framework, managed workflow |
| **TypeScript** | Strict typing across the entire codebase |
| **Expo Router** | File-based routing and navigation |
| **Zustand** | Lightweight global state management |
| **React Native Reanimated** | Performant UI animations |
| **expo-image** | Optimized image loading |
| **@expo-google-fonts/fugaz-one** | Casual display font |
| **MaterialCommunityIcons** | Icon library for UI elements |
| **react-native-safe-area-context** | Safe area handling |

---

## Project Structure

```
CricketTeamManager/
  app/
    (tabs)/
      _layout.tsx        # Bottom tab navigator
      index.tsx          # Home screen
      team.tsx           # Team management
      bats.tsx           # Bat upgrades
      shop.tsx           # Shop
    _layout.tsx          # Root layout (fonts, providers)
    formation.tsx        # Pre-game formation
    gameplay.tsx         # Match simulation
    game-over.tsx        # Results screen
    locations.tsx        # Location picker
    settings.tsx         # Settings
    +not-found.tsx       # 404 screen
  components/
    ui/
      CartoonButton.tsx  # 3D casual button
      CartoonCard.tsx    # Rounded shadow card
      CoinDisplay.tsx    # Currency display
      Header.tsx         # Top bar
      DailyRewardModal.tsx
    game/
      MiniGameBatting.tsx
      MiniGameSlider.tsx
      MiniGameCatch.tsx
      MiniGameFalling.tsx
  store/
    useGameStore.ts      # Global game state (coins, energy, inventory)
    useMatchStore.ts     # Match-specific state (runs, wickets, events)
  constants/
    assets.ts            # Image asset registry
    colors.ts            # Colour palette
    fonts.ts             # Font constants
    layout.ts            # Spacing & sizing
  data/
    players.ts           # Team roster mock data
    characters.ts        # Unlockable heroes
    bats.ts              # Bat items
    locations.ts         # Game locations
    boosters.ts          # Booster items
    shop-items.ts        # Shop & daily rewards
  types/
    game.ts              # All TypeScript interfaces
  assets/
    images/              # All game art (backgrounds, icons, characters)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npx expo`)
- iOS Simulator / Android Emulator / Expo Go app

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Then open in:
- **iOS Simulator** — press `i`
- **Android Emulator** — press `a`
- **Expo Go** — scan the QR code

### Build for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

---

## Art & Assets

All visual assets are located in `assets/images/` and include:
- Stadium backgrounds (5 variants + rain)
- Character images
- Icon set (cups, medals, fire balls, medical kit, cards, energy, money, aura)
- Team player images
- Reward images
- UI elements (buttons, shop background, clothes room)

---

## License

This project is for educational and portfolio purposes.
