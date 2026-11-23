import { create } from 'zustand';
import {
  playClickSound,
  playCoinSound,
  playErrorSound,
  playStationBell,
} from '../utils/sound.js';

const BASE_WAIT_MS = 30_000;
const EXPRESS_WAIT_MS = 20_000;
const TRIVIA_TIME_MS = 20_000;

export const useGameStore = create((set, get) => ({
  // Máquina de estados finitos del juego:
  // WAITING -> ARRIVING -> TRIVIA -> RESULT -> DEPARTING -> WAITING
  phase: 'WAITING',
  waitEndsAt: Date.now() + BASE_WAIT_MS,
  triviaEndsAt: null,

  // Economía y progreso sincronizados con Node.js
  coins: 0,
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  upgrades: [],
  catalog: [],
  unlockedTrains: ['sarmiento'],
  selectedTrain: 'sarmiento',
  trainsCatalog: [],
  achievements: [],
  passiveIncomePerTrain: 0,
  stationLevel: { level: 1, title: 'Apeadero Rural', score: 0 },
  satisfaction: { percent: 35, multiplier: 1 },
  weatherEvent: 'clear',
  serverOnline: true,

  // Trivia actual
  activeQuestion: null,
  lastQuestionId: null,
  selectedIndex: null,
  lastResult: null,
  isSubmitting: false,
  difficulty: 'Todas',

  // Señal de oleada de pasajeros al responder bien
  passengerWave: { id: 0, count: 0 },

  // UI y Ambiente
  shopOpen: false,
  trainShopOpen: false,
  statsOpen: false,
  sandboxModalOpen: false,
  sandboxMode: false,
  timeOfDay: 'night',
  cameraPreset: 'overview',
  muted: false,
  stationName:
    (typeof window !== 'undefined' && window.localStorage.getItem('stationName')) ||
    'Estación Trivia 3D',
  blitzActive: false,
  blitzEndsAt: null,
  blitzScore: 0,
  bestBlitzScore: Number(
    (typeof window !== 'undefined' && window.localStorage.getItem('bestBlitzScore')) || 0
  ),
  toast: null,

  getWaitDurationMs: () => {
    const { upgrades } = get();
    return upgrades.includes('express_train') ? EXPRESS_WAIT_MS : BASE_WAIT_MS;
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
  },

  clearToast: () => set({ toast: null }),

  setShopOpen: (shopOpen) => set({ shopOpen, trainShopOpen: false, statsOpen: false, sandboxModalOpen: false }),

  setTrainShopOpen: (trainShopOpen) => set({ trainShopOpen, shopOpen: false, statsOpen: false, sandboxModalOpen: false }),

  setStatsOpen: (statsOpen) => set({ statsOpen, shopOpen: false, trainShopOpen: false, sandboxModalOpen: false }),

  setSandboxModalOpen: (sandboxModalOpen) => set({ sandboxModalOpen, shopOpen: false, trainShopOpen: false, statsOpen: false }),

  setDifficulty: (difficulty) => set({ difficulty }),

  cycleTimeOfDay: () => {
    const order = ['night', 'day', 'sunset'];
    const next = order[(order.indexOf(get().timeOfDay) + 1) % order.length];
    set({ timeOfDay: next });
  },

  setCameraPreset: (cameraPreset) => set({ cameraPreset }),

  toggleMuted: () => set((s) => ({ muted: !s.muted })),

  setStationName: (name) => {
    const clean = name.trim() || 'Estación Trivia 3D';
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('stationName', clean);
    }
    set({ stationName: clean });
  },

  startBlitz: async () => {
    const { phase, lastQuestionId, difficulty, muted } = get();
    if (phase === 'TRIVIA' || phase === 'RESULT') return;
    playStationBell(muted);
    set({
      blitzActive: true,
      blitzEndsAt: Date.now() + 60_000,
      blitzScore: 0,
      phase: 'TRIVIA',
      waitEndsAt: null,
      triviaEndsAt: Date.now() + 60_000,
      selectedIndex: null,
      lastResult: null,
    });
    try {
      const params = new URLSearchParams();
      if (lastQuestionId) params.set('lastId', lastQuestionId);
      if (difficulty && difficulty !== 'Todas') params.set('difficulty', difficulty);
      const res = await fetch(`/api/trivia/next?${params.toString()}`);
      if (res.ok) {
        const q = await res.json();
        set({ activeQuestion: q, lastQuestionId: q.id });
      }
    } catch {
      set({ blitzActive: false, blitzEndsAt: null, phase: 'WAITING', waitEndsAt: Date.now() + BASE_WAIT_MS });
    }
  },

  cycleWeather: () => {
    const order = ['clear', 'rain', 'rush'];
    const next = order[(order.indexOf(get().weatherEvent) + 1) % order.length];
    set({ weatherEvent: next });
  },

  fetchStation: async () => {
    try {
      const res = await fetch('/api/station');
      if (!res.ok) throw new Error('Error de servidor');
      const data = await res.json();
      set({
        coins: data.coins,
        streak: data.streak,
        bestStreak: data.bestStreak,
        totalAnswered: data.totalAnswered,
        totalCorrect: data.totalCorrect,
        upgrades: data.upgrades,
        catalog: data.catalog,
        unlockedTrains: data.unlockedTrains || ['sarmiento'],
        selectedTrain: data.selectedTrain || 'sarmiento',
        trainsCatalog: data.trainsCatalog || [],
        achievements: data.achievements || [],
        passiveIncomePerTrain: data.passiveIncomePerTrain || 0,
        stationLevel: data.stationLevel || { level: 1, title: 'Apeadero Rural', score: 0 },
        satisfaction: data.satisfaction || { percent: 35, multiplier: 1 },
        sandboxMode: Boolean(data.sandboxMode),
        serverOnline: true,
      });
    } catch {
      set({ serverOnline: false });
    }
  },

  summonTrainNow: () => {
    const { phase } = get();
    if (phase !== 'WAITING') return;
    set({ phase: 'ARRIVING', waitEndsAt: null });
  },

  tickTimers: () => {
    const { phase, waitEndsAt, triviaEndsAt, submitAnswer, isSubmitting, blitzActive, blitzEndsAt, blitzScore, bestBlitzScore } = get();
    const now = Date.now();

    if (blitzActive && blitzEndsAt && now >= blitzEndsAt) {
      const newBest = Math.max(bestBlitzScore, blitzScore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('bestBlitzScore', String(newBest));
      }
      set({
        blitzActive: false,
        blitzEndsAt: null,
        bestBlitzScore: newBest,
        phase: 'WAITING',
        activeQuestion: null,
        lastResult: null,
        triviaEndsAt: null,
        waitEndsAt: now + get().getWaitDurationMs(),
      });
      get().showToast(`⚡ ¡Contrarreloj finalizado! Aciertos: ${blitzScore} (Récord: ${newBest})`, 'success');
      return;
    }

    if (phase === 'WAITING' && waitEndsAt && now >= waitEndsAt) {
      set({ phase: 'ARRIVING', waitEndsAt: null });
    } else if (phase === 'TRIVIA' && triviaEndsAt && now >= triviaEndsAt && !isSubmitting) {
      // Tiempo agotado: enviar respuesta inválida (-1)
      submitAnswer(-1);
    }
  },

  onTrainArrived: async () => {
    const { phase, lastQuestionId, difficulty, muted } = get();
    if (phase !== 'ARRIVING') return;

    playStationBell(muted);

    set({
      phase: 'TRIVIA',
      selectedIndex: null,
      lastResult: null,
      triviaEndsAt: Date.now() + TRIVIA_TIME_MS,
    });

    try {
      const params = new URLSearchParams();
      if (lastQuestionId) params.set('lastId', lastQuestionId);
      if (difficulty && difficulty !== 'Todas') params.set('difficulty', difficulty);
      const qs = params.toString();
      const res = await fetch(`/api/trivia/next${qs ? `?${qs}` : ''}`);
      if (!res.ok) throw new Error('No se pudo cargar la pregunta');
      const question = await res.json();
      set({
        activeQuestion: question,
        lastQuestionId: question.id,
        serverOnline: true,
      });
    } catch {
      set({ serverOnline: false });
      get().showToast('No se pudo conectar con el servidor de preguntas', 'error');
      set({ phase: 'DEPARTING', triviaEndsAt: null });
    }
  },

  submitAnswer: async (selectedIndex) => {
    const { phase, activeQuestion, isSubmitting, muted } = get();
    if (phase !== 'TRIVIA' || !activeQuestion || isSubmitting) return;

    set({ isSubmitting: true, selectedIndex, triviaEndsAt: null });

    try {
      const res = await fetch('/api/trivia/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          selectedIndex,
        }),
      });
      if (!res.ok) throw new Error('Error al validar respuesta');
      const data = await res.json();

      if (data.correct) {
        playCoinSound(muted);
      } else {
        playErrorSound(muted);
      }

      if (data.newAchievements?.length) {
        const first = data.newAchievements[0];
        get().showToast(`🏆 ¡Logro desbloqueado: ${first.name} (+${first.reward} 🪙)!`, 'success');
      }

      const nextWave = data.correct
        ? {
            id: Date.now(),
            count: (Math.floor(Math.random() * 3) + 3) * (get().weatherEvent === 'rush' ? 2 : 1),
          }
        : get().passengerWave;

      set({
        phase: 'RESULT',
        isSubmitting: false,
        coins: data.coins,
        streak: data.streak,
        bestStreak: data.bestStreak,
        totalAnswered: data.totalAnswered,
        totalCorrect: data.totalCorrect,
        upgrades: data.upgrades,
        catalog: data.catalog,
        achievements: data.achievements || [],
        passiveIncomePerTrain: data.passiveIncomePerTrain || 0,
        stationLevel: data.stationLevel || get().stationLevel,
        satisfaction: data.satisfaction || get().satisfaction,
        passengerWave: nextWave,
        lastResult: {
          correct: data.correct,
          correctIndex: data.correctIndex,
          difficulty: data.difficulty,
          explanation: data.explanation,
          baseCoins: data.baseCoins,
          streakBonus: data.streakBonus,
          passiveIncome: data.passiveIncome || 0,
          totalEarned: data.totalEarned,
          timedOut: selectedIndex === -1,
        },
      });

      if (data.correct && get().blitzActive) {
        set((s) => ({ blitzScore: s.blitzScore + 1 }));
      }

      setTimeout(async () => {
        if (get().blitzActive && get().blitzEndsAt && Date.now() < get().blitzEndsAt) {
          try {
            const params = new URLSearchParams();
            if (get().lastQuestionId) params.set('lastId', get().lastQuestionId);
            if (get().difficulty && get().difficulty !== 'Todas') params.set('difficulty', get().difficulty);
            const r = await fetch(`/api/trivia/next?${params.toString()}`);
            if (r.ok) {
              const nextQ = await r.json();
              set({
                phase: 'TRIVIA',
                activeQuestion: nextQ,
                lastQuestionId: nextQ.id,
                selectedIndex: null,
                lastResult: null,
                triviaEndsAt: get().blitzEndsAt,
              });
              return;
            }
          } catch {
            // fallback to normal departure
          }
        }
        if (get().phase === 'RESULT') {
          set({ phase: 'DEPARTING', activeQuestion: null, lastResult: null });
        }
      }, get().blitzActive ? 750 : 2600);
    } catch {
      set({ isSubmitting: false, phase: 'DEPARTING', activeQuestion: null });
      get().showToast('Error al comunicarse con el servidor', 'error');
    }
  },

  onTrainDeparted: () => {
    const { phase, getWaitDurationMs } = get();
    if (phase !== 'DEPARTING') return;
    set({
      phase: 'WAITING',
      waitEndsAt: Date.now() + getWaitDurationMs(),
    });
  },

  buyUpgrade: async (upgradeId) => {
    try {
      const res = await fetch('/api/station/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upgradeId }),
      });
      const data = await res.json();
      if (!res.ok) {
        get().showToast(data.error || 'No se pudo comprar la mejora', 'error');
        return;
      }

      set({
        coins: data.coins,
        upgrades: data.upgrades,
        catalog: data.catalog,
        achievements: data.achievements || get().achievements,
        passiveIncomePerTrain: data.passiveIncomePerTrain ?? get().passiveIncomePerTrain,
        stationLevel: data.stationLevel || get().stationLevel,
        satisfaction: data.satisfaction || get().satisfaction,
      });
      playClickSound(get().muted);
      get().showToast(`¡Mejora desbloqueada: ${data.purchased.name}!`, 'success');
    } catch {
      get().showToast('Error de conexión al comprar mejora', 'error');
    }
  },

  selectOrBuyTrain: async (trainId) => {
    try {
      const res = await fetch('/api/station/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainId }),
      });
      const data = await res.json();
      if (!res.ok) {
        get().showToast(data.error || 'No se pudo seleccionar el tren', 'error');
        return;
      }

      set({
        coins: data.coins,
        unlockedTrains: data.unlockedTrains,
        selectedTrain: data.selectedTrain,
        trainsCatalog: data.trainsCatalog,
        achievements: data.achievements || get().achievements,
      });
      playClickSound(get().muted);
      if (data.purchased) {
        get().showToast(`¡Tren adquirido y en servicio: ${data.purchased.name}!`, 'success');
      } else {
        get().showToast(`Tren en servicio: ${data.selected.name}`, 'success');
      }
    } catch {
      get().showToast('Error de conexión al cambiar de tren', 'error');
    }
  },

  resetStation: async () => {
    try {
      const res = await fetch('/api/station/reset', { method: 'POST' });
      if (!res.ok) throw new Error('No se pudo reiniciar la estación');
      const data = await res.json();
      set({
        coins: data.coins,
        streak: data.streak,
        bestStreak: data.bestStreak,
        totalAnswered: data.totalAnswered,
        totalCorrect: data.totalCorrect,
        upgrades: data.upgrades,
        catalog: data.catalog,
        unlockedTrains: data.unlockedTrains || ['sarmiento'],
        selectedTrain: data.selectedTrain || 'sarmiento',
        trainsCatalog: data.trainsCatalog || [],
        achievements: data.achievements || [],
        passiveIncomePerTrain: data.passiveIncomePerTrain || 0,
        sandboxMode: Boolean(data.sandboxMode),
        shopOpen: false,
        trainShopOpen: false,
        statsOpen: false,
        sandboxModalOpen: false,
      });
      get().showToast('Estación reiniciada desde cero', 'success');
    } catch {
      get().showToast('Error al reiniciar la estación', 'error');
    }
  },

  activateSandbox: async (password) => {
    try {
      const res = await fetch('/api/station/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        playErrorSound(get().muted);
        get().showToast(data.error || 'Contraseña incorrecta', 'error');
        return false;
      }

      set({
        coins: data.coins,
        upgrades: data.upgrades,
        catalog: data.catalog,
        unlockedTrains: data.unlockedTrains || ['sarmiento'],
        selectedTrain: data.selectedTrain || 'sarmiento',
        trainsCatalog: data.trainsCatalog || [],
        achievements: data.achievements || [],
        passiveIncomePerTrain: data.passiveIncomePerTrain || 0,
        stationLevel: data.stationLevel || { level: 1, title: 'Apeadero Rural', score: 0 },
        satisfaction: data.satisfaction || { percent: 35, multiplier: 1 },
        sandboxMode: true,
        sandboxModalOpen: false,
      });
      playCoinSound(get().muted);
      get().showToast('🔓 Modo Sandbox activado: ¡todas las mejoras y trenes desbloqueados!', 'success');
      return true;
    } catch {
      get().showToast('Error de conexión al activar Modo Sandbox', 'error');
      return false;
    }
  },
}));
