import { create } from 'zustand';

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
  serverOnline: true,

  // Trivia actual
  activeQuestion: null,
  lastQuestionId: null,
  selectedIndex: null,
  lastResult: null,
  isSubmitting: false,

  // Señal de oleada de pasajeros al responder bien
  passengerWave: { id: 0, count: 0 },

  // UI
  shopOpen: false,
  toast: null,

  getWaitDurationMs: () => {
    const { upgrades } = get();
    return upgrades.includes('express_train') ? EXPRESS_WAIT_MS : BASE_WAIT_MS;
  },

  showToast: (message, type = 'info') => {
    set({ toast: { message, type, id: Date.now() } });
  },

  clearToast: () => set({ toast: null }),

  setShopOpen: (shopOpen) => set({ shopOpen }),

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
    const { phase, waitEndsAt, triviaEndsAt, submitAnswer, isSubmitting } = get();
    const now = Date.now();

    if (phase === 'WAITING' && waitEndsAt && now >= waitEndsAt) {
      set({ phase: 'ARRIVING', waitEndsAt: null });
    } else if (phase === 'TRIVIA' && triviaEndsAt && now >= triviaEndsAt && !isSubmitting) {
      // Tiempo agotado: enviar respuesta inválida (-1)
      submitAnswer(-1);
    }
  },

  onTrainArrived: async () => {
    const { phase, lastQuestionId } = get();
    if (phase !== 'ARRIVING') return;

    set({
      phase: 'TRIVIA',
      selectedIndex: null,
      lastResult: null,
      triviaEndsAt: Date.now() + TRIVIA_TIME_MS,
    });

    try {
      const query = lastQuestionId ? `?lastId=${encodeURIComponent(lastQuestionId)}` : '';
      const res = await fetch(`/api/trivia/next${query}`);
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
    const { phase, activeQuestion, isSubmitting } = get();
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

      const nextWave = data.correct
        ? { id: Date.now(), count: Math.floor(Math.random() * 3) + 3 } // 3 a 5 pasajeros
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
        passengerWave: nextWave,
        lastResult: {
          correct: data.correct,
          correctIndex: data.correctIndex,
          baseCoins: data.baseCoins,
          streakBonus: data.streakBonus,
          totalEarned: data.totalEarned,
          timedOut: selectedIndex === -1,
        },
      });

      setTimeout(() => {
        if (get().phase === 'RESULT') {
          set({ phase: 'DEPARTING', activeQuestion: null, lastResult: null });
        }
      }, 2600);
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
      });
      get().showToast(`¡Mejora desbloqueada: ${data.purchased.name}!`, 'success');
    } catch {
      get().showToast('Error de conexión al comprar mejora', 'error');
    }
  },
}));
