// ============================================================
// Match Store – Manages the cricket match simulation
// ============================================================

import { create } from 'zustand';
import { MatchPlayer, MatchEvent, MatchEventType, MiniGameKind, MiniGameResult } from '@/types/game';
import { teamRoster } from '@/data/players';

interface MatchStore {
  // State
  players: MatchPlayer[];
  bench: MatchPlayer[];
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  target: number;
  events: MatchEvent[];
  isMatchActive: boolean;
  isMatchOver: boolean;
  isPaused: boolean;
  currentBatsmanIdx: number;
  currentBowlerIdx: number;
  activeMiniGame: MiniGameKind;
  pendingEventType: MatchEventType | null;
  matchResult: 'win' | 'loss' | 'draw' | null;
  eventIdCounter: number;
  injuredPlayerId: string | null; // player needing medkit

  // Actions
  initMatch: () => void;
  setFormation: (players: MatchPlayer[]) => void;
  startMatch: () => void;
  pauseMatch: () => void;
  resumeMatch: () => void;
  simulateBall: () => void;
  resolveMiniGame: (result: MiniGameResult) => void;
  dismissMiniGame: () => void;
  swapPlayer: (fieldPlayerId: string, benchPlayerId: string) => void;
  useMatchBooster: (boosterId: string) => void;
  healPlayer: (playerId: string) => void;
  drainStamina: () => void;
  endMatch: () => void;
  resetMatch: () => void;
}

function cloneRoster(): { field: MatchPlayer[]; bench: MatchPlayer[] } {
  const all = teamRoster.map((p) => ({
    ...p,
    stamina: p.maxStamina,
    yellowCards: 0,
    isRedCarded: false,
    isInjured: false,
  }));
  return {
    field: all.filter((p) => p.isOnField),
    bench: all.filter((p) => !p.isOnField),
  };
}

function randomEvent(skill: number): MatchEventType {
  const rand = Math.random() * 100;
  if (rand < 3) return 'mini_catch';
  if (rand < 6) return 'mini_slider';
  if (rand < 11) return 'mini_batting';
  if (rand < 14) return 'mini_falling';
  if (rand < 18) return 'yellow_card';
  if (rand < 20) return 'injury';
  if (rand < 27) return 'wicket';
  if (rand < 37) return 'dot';
  if (rand < 47) return 'single';
  if (rand < 55) return 'double';
  if (rand < 65 + skill) return 'four';
  if (rand < 75 + skill * 0.5) return 'six';
  if (rand < 85) return 'wide';
  return 'single';
}

function eventText(type: MatchEventType, batsman: string, bowler: string): string {
  const texts: Record<string, string[]> = {
    dot: [`${bowler} bowls a dot. Good defense by ${batsman}.`, `Tight delivery! No run.`, `${batsman} blocks. Dot ball.`],
    single: [`${batsman} pushes for a single.`, `Quick single! Good running.`, `${batsman} nudges it for 1.`],
    double: [`${batsman} finds a gap! 2 runs.`, `Good placement! Running two.`, `Smart cricket, 2 runs scored.`],
    four: [`FOUR! ${batsman} drives through covers!`, `Boundary! Beautiful shot by ${batsman}!`, `${batsman} cuts it for FOUR!`],
    six: [`SIX! ${batsman} launches it over the stands!`, `MASSIVE SIX by ${batsman}!`, `That's gone! SIX runs!`],
    wide: [`Wide ball by ${bowler}. Extra run.`, `${bowler} strays down leg. Wide.`],
    wicket: [`OUT! ${bowler} gets ${batsman}! Wicket falls!`, `WICKET! ${batsman} has to go!`],
    mini_batting: [`Big moment! ${batsman} faces a crucial delivery...`, `Key ball coming up! Get your timing right!`],
    mini_slider: [`${bowler} runs in for a big delivery... Time your action!`, `Pressure ball! Find the sweet spot!`],
    mini_catch: [`Ball in the air! Can you take the catch?!`, `It's up! Quick, get under it!`],
    mini_falling: [`Multiple balls incoming! Show your batting skills!`, `Rapid fire round! Hit as many as you can!`],
    yellow_card: [`YELLOW CARD! ${batsman} gets a warning from the umpire!`, `Caution! ${bowler} receives a yellow card for aggression!`],
    red_card: [`RED CARD! Player is sent off the field!`],
    injury: [`INJURY! ${batsman} goes down clutching his leg!`, `${bowler} pulls up injured mid-over! Needs medical attention!`],
  };
  const arr = texts[type] || [`${batsman} plays a shot.`];
  return arr[Math.floor(Math.random() * arr.length)];
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  players: [],
  bench: [],
  runs: 0,
  wickets: 0,
  overs: 0,
  balls: 0,
  target: 120 + Math.floor(Math.random() * 60),
  events: [],
  isMatchActive: false,
  isMatchOver: false,
  isPaused: false,
  currentBatsmanIdx: 0,
  currentBowlerIdx: 0,
  activeMiniGame: null,
  pendingEventType: null,
  matchResult: null,
  eventIdCounter: 0,
  injuredPlayerId: null,

  initMatch: () => {
    const { field, bench } = cloneRoster();
    set({
      players: field,
      bench,
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      target: 120 + Math.floor(Math.random() * 60),
      events: [],
      isMatchActive: false,
      isMatchOver: false,
      isPaused: false,
      currentBatsmanIdx: 0,
      currentBowlerIdx: 3,
      activeMiniGame: null,
      pendingEventType: null,
      matchResult: null,
      eventIdCounter: 0,
      injuredPlayerId: null,
    });
  },

  setFormation: (players: MatchPlayer[]) => {
    const field = players.filter((p) => p.isOnField);
    const bench = players.filter((p) => !p.isOnField);
    set({ players: field, bench });
  },

  startMatch: () => set({ isMatchActive: true }),
  pauseMatch: () => set({ isPaused: true }),
  resumeMatch: () => set({ isPaused: false }),

  simulateBall: () => {
    const state = get();
    if (!state.isMatchActive || state.isPaused || state.activeMiniGame || state.isMatchOver) return;
    // Pause if someone is injured and waiting for medkit
    if (state.injuredPlayerId) return;

    const batsman = state.players[state.currentBatsmanIdx];
    const bowler = state.players[state.currentBowlerIdx];
    if (!batsman || !bowler) return;

    let type = randomEvent(batsman.skill);

    // Don't duplicate injury if someone is already injured
    if (type === 'injury' && state.players.some((p) => p.isInjured)) type = 'dot';

    const text = eventText(type, batsman.name, bowler.name);
    const newId = state.eventIdCounter + 1;

    // Mini-games pause the simulation
    if (type === 'mini_batting' || type === 'mini_slider' || type === 'mini_catch' || type === 'mini_falling') {
      const miniKind: MiniGameKind =
        type === 'mini_falling' ? 'falling' :
        type === 'mini_batting' ? 'batting' : type === 'mini_slider' ? 'slider' : 'catch';

      set({
        activeMiniGame: miniKind,
        pendingEventType: type,
        eventIdCounter: newId,
        events: [
          { id: newId, type, text, over: state.overs, ball: state.balls, isImportant: true },
          ...state.events,
        ],
      });
      return;
    }

    // Yellow / Red card
    if (type === 'yellow_card') {
      const targetPlayer = Math.random() > 0.5 ? batsman : bowler;
      const newYellow = targetPlayer.yellowCards + 1;
      const isNowRed = newYellow >= 2;
      const cardText = isNowRed
        ? `RED CARD! ${targetPlayer.name} gets a second yellow and is sent off!`
        : `YELLOW CARD! ${targetPlayer.name} receives a caution.`;

      const updatedPlayers = state.players.map((p) =>
        p.id === targetPlayer.id
          ? { ...p, yellowCards: newYellow, isRedCarded: isNowRed }
          : p
      );

      set({
        players: updatedPlayers,
        eventIdCounter: newId,
        events: [
          { id: newId, type: isNowRed ? 'red_card' : 'yellow_card', text: cardText, over: state.overs, ball: state.balls, isImportant: true },
          ...state.events,
        ],
      });
      get().drainStamina();
      return;
    }

    // Injury
    if (type === 'injury') {
      const targetPlayer = Math.random() > 0.5 ? batsman : bowler;
      const injuryText = `INJURY! ${targetPlayer.name} is down and needs medical attention! Use a Medical Kit!`;
      const updatedPlayers = state.players.map((p) =>
        p.id === targetPlayer.id ? { ...p, isInjured: true, stamina: Math.max(0, p.stamina - 30) } : p
      );
      set({
        players: updatedPlayers,
        injuredPlayerId: targetPlayer.id,
        eventIdCounter: newId,
        events: [
          { id: newId, type: 'injury', text: injuryText, over: state.overs, ball: state.balls, isImportant: true },
          ...state.events,
        ],
      });
      return;
    }

    // Calculate runs
    let runsScored = 0;
    if (type === 'single') runsScored = 1;
    else if (type === 'double') runsScored = 2;
    else if (type === 'four') runsScored = 4;
    else if (type === 'six') runsScored = 6;
    else if (type === 'wide') runsScored = 1;

    let newBalls = state.balls + (type === 'wide' ? 0 : 1);
    let newOvers = state.overs;
    if (newBalls >= 6) { newBalls = 0; newOvers += 1; }

    let newWickets = state.wickets;
    let newBatsmanIdx = state.currentBatsmanIdx;
    if (type === 'wicket') {
      newWickets += 1;
      const nextIdx = state.players.findIndex(
        (p, i) => i !== state.currentBatsmanIdx && p.role !== 'bowler' && p.role !== 'wicketkeeper' && p.stamina > 0 && !p.isRedCarded && i > state.currentBatsmanIdx
      );
      if (nextIdx >= 0) newBatsmanIdx = nextIdx;
    }

    const newRuns = state.runs + runsScored;
    const matchOver = newWickets >= 10 || newOvers >= 20 || newRuns >= state.target;

    set({
      runs: newRuns,
      wickets: newWickets,
      overs: newOvers,
      balls: newBalls,
      currentBatsmanIdx: newBatsmanIdx,
      eventIdCounter: newId,
      events: [
        { id: newId, type, text, over: newOvers, ball: newBalls, runs: runsScored, isImportant: type === 'wicket' || type === 'six' || type === 'four' },
        ...state.events,
      ],
    });

    if (matchOver) {
      const result = newRuns >= state.target ? 'win' : newWickets >= 10 ? 'loss' : 'draw';
      set({ isMatchOver: true, isMatchActive: false, matchResult: result });
    }

    get().drainStamina();
  },

  resolveMiniGame: (result: MiniGameResult) => {
    const state = get();
    const batsman = state.players[state.currentBatsmanIdx];
    const bowler = state.players[state.currentBowlerIdx];
    const newId = state.eventIdCounter + 1;

    let runsScored = 0;
    let text = '';
    let type: MatchEventType = 'info';
    let isWicket = false;

    if (state.activeMiniGame === 'batting') {
      if (result === 'perfect') { runsScored = 6; text = `SIX! ${batsman?.name} nails the timing perfectly!`; type = 'six'; }
      else if (result === 'good') { runsScored = 4; text = `FOUR! Good timing by ${batsman?.name}!`; type = 'four'; }
      else { text = `OUT! ${batsman?.name} mistimes it completely!`; type = 'wicket'; isWicket = true; }
    } else if (state.activeMiniGame === 'slider') {
      if (result === 'perfect') { text = `Perfect delivery by ${bowler?.name}! Dot ball.`; type = 'dot'; }
      else if (result === 'good') { runsScored = 1; text = `Good ball. ${batsman?.name} manages a single.`; type = 'single'; }
      else { runsScored = 4; text = `Bad delivery! ${batsman?.name} smashes it for FOUR!`; type = 'four'; }
    } else if (state.activeMiniGame === 'catch') {
      if (result === 'perfect' || result === 'good') { text = `CAUGHT! Brilliant catch! ${batsman?.name} is out!`; type = 'wicket'; isWicket = true; }
      else { runsScored = 2; text = `Dropped! ${batsman?.name} survives and scores 2.`; type = 'double'; }
    } else if (state.activeMiniGame === 'falling') {
      if (result === 'perfect') { runsScored = 12; text = `INCREDIBLE batting! ${batsman?.name} smashes 12 runs in the rapid round!`; type = 'six'; }
      else if (result === 'good') { runsScored = 6; text = `Good hitting! ${batsman?.name} scores 6 from the rapid round.`; type = 'four'; }
      else { text = `Poor showing... ${batsman?.name} can't connect. Wicket falls!`; type = 'wicket'; isWicket = true; }
    }

    let newBalls = state.balls + 1;
    let newOvers = state.overs;
    if (newBalls >= 6) { newBalls = 0; newOvers += 1; }

    let newWickets = state.wickets + (isWicket ? 1 : 0);
    let newBatsmanIdx = state.currentBatsmanIdx;
    if (isWicket) {
      const nextIdx = state.players.findIndex(
        (p, i) => i !== state.currentBatsmanIdx && p.role !== 'bowler' && p.role !== 'wicketkeeper' && p.stamina > 0 && !p.isRedCarded && i > state.currentBatsmanIdx
      );
      if (nextIdx >= 0) newBatsmanIdx = nextIdx;
    }

    const newRuns = state.runs + runsScored;
    const matchOver = newWickets >= 10 || newOvers >= 20 || newRuns >= state.target;

    set({
      activeMiniGame: null,
      pendingEventType: null,
      runs: newRuns,
      wickets: newWickets,
      overs: newOvers,
      balls: newBalls,
      currentBatsmanIdx: newBatsmanIdx,
      eventIdCounter: newId,
      events: [
        { id: newId, type, text, over: newOvers, ball: newBalls, runs: runsScored, isImportant: true },
        ...state.events,
      ],
    });

    if (matchOver) {
      const result2 = newRuns >= state.target ? 'win' : newWickets >= 10 ? 'loss' : 'draw';
      set({ isMatchOver: true, isMatchActive: false, matchResult: result2 });
    }

    get().drainStamina();
  },

  dismissMiniGame: () => set({ activeMiniGame: null, pendingEventType: null }),

  swapPlayer: (fieldPlayerId: string, benchPlayerId: string) => {
    const state = get();
    const fieldPlayer = state.players.find((p) => p.id === fieldPlayerId);
    const benchPlayer = state.bench.find((p) => p.id === benchPlayerId);
    if (!fieldPlayer || !benchPlayer) return;

    const pos = fieldPlayer.fieldPosition;
    const updatedField = state.players.map((p) =>
      p.id === fieldPlayerId ? { ...benchPlayer, isOnField: true, fieldPosition: pos, yellowCards: 0, isRedCarded: false, isInjured: false } : p
    );
    const updatedBench = state.bench.map((p) =>
      p.id === benchPlayerId ? { ...fieldPlayer, isOnField: false, fieldPosition: 0 } : p
    );

    const newId = state.eventIdCounter + 1;
    set({
      players: updatedField,
      bench: updatedBench,
      eventIdCounter: newId,
      injuredPlayerId: state.injuredPlayerId === fieldPlayerId ? null : state.injuredPlayerId,
      events: [
        { id: newId, type: 'swap', text: `Substitution: ${benchPlayer.name} replaces ${fieldPlayer.name}`, over: state.overs, ball: state.balls, isImportant: true },
        ...state.events,
      ],
    });
  },

  useMatchBooster: (boosterId: string) => {
    const state = get();
    const newId = state.eventIdCounter + 1;
    if (boosterId === 'stamina_boost') {
      const updated = state.players.map((p) => ({ ...p, stamina: Math.min(p.maxStamina, p.stamina + 20) }));
      set({
        players: updated,
        eventIdCounter: newId,
        events: [
          { id: newId, type: 'boost', text: 'Team stamina boosted! +20 energy for all players.', over: state.overs, ball: state.balls, isImportant: true },
          ...state.events,
        ],
      });
    }
  },

  healPlayer: (playerId: string) => {
    const state = get();
    const newId = state.eventIdCounter + 1;
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    const updated = state.players.map((p) =>
      p.id === playerId ? { ...p, isInjured: false, stamina: Math.min(p.maxStamina, p.stamina + 40) } : p
    );
    set({
      players: updated,
      injuredPlayerId: null,
      eventIdCounter: newId,
      events: [
        { id: newId, type: 'medkit', text: `Medical Kit used! ${player.name} is back on the field!`, over: state.overs, ball: state.balls, isImportant: true },
        ...state.events,
      ],
    });
  },

  drainStamina: () => {
    const state = get();
    const updated = state.players.map((p) => ({
      ...p,
      stamina: Math.max(0, p.stamina - (2 + Math.floor(Math.random() * 3))),
    }));
    set({ players: updated });
  },

  endMatch: () => {
    const state = get();
    const result = state.runs >= state.target ? 'win' : state.wickets >= 10 ? 'loss' : 'draw';
    set({ isMatchOver: true, isMatchActive: false, matchResult: result });
  },

  resetMatch: () => {
    set({
      players: [],
      bench: [],
      runs: 0,
      wickets: 0,
      overs: 0,
      balls: 0,
      events: [],
      isMatchActive: false,
      isMatchOver: false,
      isPaused: false,
      activeMiniGame: null,
      pendingEventType: null,
      matchResult: null,
      eventIdCounter: 0,
      injuredPlayerId: null,
    });
  },
}));
