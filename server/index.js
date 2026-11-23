import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateProceduralQuestion } from './triviaGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

const QUESTIONS_PATH = path.resolve(__dirname, 'data/questions.json');
const DB_PATH = process.env.VERCEL
  ? '/tmp/db.json'
  : path.resolve(__dirname, 'data/db.json');

const UPGRADE_CATALOG = [
  {
    id: 'benches',
    name: 'Bancos Lineales de Listones',
    description: 'Instala bancos lineales de madera con listones y base de acero en el andén.',
    cost: 40,
    icon: '🪑',
  },
  {
    id: 'bench_curved',
    name: 'Bancos Ergonómicos Curvos',
    description: 'Agrega bancos curvos de madera con apoyabrazos y punteras metálicas.',
    cost: 55,
    icon: '🛋️',
  },
  {
    id: 'lamps',
    name: 'Farolas Clásicas',
    description: 'Ilumina la estación con farolas cálidas a lo largo de toda la plataforma.',
    cost: 65,
    icon: '💡',
  },
  {
    id: 'bench_double',
    name: 'Bancos Doble Faz',
    description: 'Coloca bancos de madera doble faz con respaldo central para mayor capacidad.',
    cost: 80,
    icon: '🪵',
  },
  {
    id: 'ticket_kiosk',
    name: 'Módulo de Cajeros y Boletería',
    description: 'Instala un módulo doble con cajero automático, expendedora y visera LED.',
    cost: 90,
    icon: '🎫',
  },
  {
    id: 'totem_screens',
    name: 'Tótem Pantallas de Trenes',
    description: 'Agrega tótems digitales con horarios de partidas y listones de madera.',
    cost: 110,
    icon: '🖥️',
  },
  {
    id: 'cafe',
    name: 'Barra de Café Isla',
    description: 'Abre una isla de café con vitrina pastelera, cafetera espresso y pérgola LED.',
    cost: 130,
    icon: '☕',
  },
  {
    id: 'clock_tower',
    name: 'Torre del Reloj',
    description: 'Corona el edificio histórico de ladrillo con una torre de reloj animada.',
    cost: 180,
    icon: '🕰️',
  },
  {
    id: 'turnstiles',
    name: 'Molinetes, Cestos y Mapa',
    description: 'Instala el control de acceso con molinetes vidriados, cestos de reciclaje y tótem mapa.',
    cost: 100,
    icon: '🚧',
  },
  {
    id: 'bookstore',
    name: 'Librería y Revistero',
    description: 'Abre un local de libros y revistas con exhibidor de madera e iluminación cálida.',
    cost: 145,
    icon: '📚',
  },
  {
    id: 'flower_shop',
    name: 'Florería Verde Metálica',
    description: 'Agrega un invernadero metálico verde con flores, plantas colgantes y mostrador.',
    cost: 160,
    icon: '💐',
  },
  {
    id: 'exterior_plaza',
    name: 'Plaza Exterior y Parada',
    description: 'Construye la plaza exterior con parada de colectivos, bicicletero cubierto y árboles.',
    cost: 150,
    icon: '🚌',
  },
  {
    id: 'substation',
    name: 'Subestación Eléctrica',
    description: 'Instala transformadores y aisladores de alta tensión para alimentar la red ferroviaria.',
    cost: 190,
    icon: '⚡',
  },
  {
    id: 'second_platform',
    name: 'Doble Vía y Puente Peatonal',
    description: 'Expande la estación con segunda vía, segundo andén y puente peatonal elevado.',
    cost: 220,
    icon: '🌉',
  },
  {
    id: 'station2_canopy',
    name: 'Estación 2: Cubierta y Arcos',
    description: 'Construye arcos de ladrillo, techo de vidrio, faroles y reloj doble faz en el segundo andén.',
    cost: 180,
    icon: '🏛️',
  },
  {
    id: 'station2_furniture',
    name: 'Estación 2: Bancos, Farolas y Tótem',
    description: 'Equipa el segundo andén con bancos de madera, farolas clásicas y tótem de partidas.',
    cost: 120,
    icon: '🪑',
  },
  {
    id: 'station2_shops',
    name: 'Estación 2: Locales y Molinetes',
    description: 'Replica librería, florería, barra de café, cajeros y molinetes en los arcos del andén 2.',
    cost: 210,
    icon: '🏪',
  },
  {
    id: 'station2_exterior',
    name: 'Estación 2: Plaza Exterior y Parada',
    description: 'Construye la plaza exterior oeste con parada de colectivo, bicicletero y canteros.',
    cost: 160,
    icon: '🌳',
  },
  {
    id: 'express_train',
    name: 'Tren Expreso',
    description: 'Moderniza la locomotora y reduce el tiempo de espera entre trenes a 20s.',
    cost: 240,
    icon: '🚄',
  },
];

const TRAIN_CATALOG = [
  {
    id: 'sarmiento',
    name: 'Tren Sarmiento Clásico',
    description: 'Formación eléctrica celeste y blanca tradicional de dos coches.',
    cost: 0,
    icon: '🚆',
  },
  {
    id: 'double_decker',
    name: 'Tren Dos Pisos (TBA)',
    description: 'Coche doble piso blanco y celeste con gran capacidad de pasajeros.',
    cost: 120,
    icon: '🚈',
  },
  {
    id: 'suburban_electric',
    name: 'Tren Eléctrico Suburbano',
    description: 'Formación aerodinámica plateada con pantógrafo y aire acondicionado.',
    cost: 175,
    icon: '🚄',
  },
  {
    id: 'diesel_express',
    name: 'Locomotora Diésel + Coche',
    description: 'Locomotora diésel-eléctrica gris y naranja tirando coche de pasajeros.',
    cost: 230,
    icon: '🚂',
  },
];

const PASSIVE_INCOME_MAP = {
  ticket_kiosk: 5,
  totem_screens: 6,
  turnstiles: 8,
  cafe: 12,
  bookstore: 14,
  flower_shop: 16,
  exterior_plaza: 10,
  substation: 12,
  second_platform: 20,
  station2_canopy: 14,
  station2_furniture: 10,
  station2_shops: 25,
  station2_exterior: 12,
};

const STATION_LEVEL_TITLES = [
  'Apeadero Rural',
  'Parada Suburbana',
  'Estación Local',
  'Estación de Transbordo',
  'Nodo Ferroviario',
  'Terminal Regional',
  'Estación Central',
  'Estación Central Metropolitana',
];

function computeStationLevel(state) {
  const score =
    (state.totalCorrect || 0) * 2 +
    (state.upgrades?.length || 0) * 5 +
    ((state.unlockedTrains?.length || 1) - 1) * 8;
  const level = Math.min(10, Math.floor(score / 12) + 1);
  const title =
    STATION_LEVEL_TITLES[Math.min(STATION_LEVEL_TITLES.length - 1, level - 1)];
  return { level, title, score };
}

function computeSatisfaction(upgrades = []) {
  const base = 35;
  const bonus = Math.min(65, upgrades.length * 6);
  const percent = base + bonus;
  const multiplier = Number((1 + (percent - 35) / 130).toFixed(2)); // 1.00x a 1.50x
  return { percent, multiplier };
}

const ACHIEVEMENT_DEFS = [
  {
    id: 'first_correct',
    name: 'Primer Boleto',
    description: 'Responde correctamente tu primera pregunta.',
    reward: 25,
    icon: '🎟️',
    check: (s) => s.totalCorrect >= 1,
  },
  {
    id: 'streak_3',
    name: 'En Racha',
    description: 'Consigue una racha de 3 respuestas correctas seguidas.',
    reward: 40,
    icon: '🔥',
    check: (s) => s.bestStreak >= 3,
  },
  {
    id: 'streak_5',
    name: 'Maquinista Experto',
    description: 'Alcanza una racha de 5 respuestas correctas seguidas.',
    reward: 75,
    icon: '🏆',
    check: (s) => s.bestStreak >= 5,
  },
  {
    id: 'upgrades_3',
    name: 'Arquitecto Ferroviario',
    description: 'Desbloquea 3 mejoras en la estación.',
    reward: 50,
    icon: '🏗️',
    check: (s) => (s.upgrades?.length || 0) >= 3,
  },
  {
    id: 'trains_2',
    name: 'Coleccionista de Flota',
    description: 'Compra al menos 1 tren adicional.',
    reward: 60,
    icon: '🚆',
    check: (s) => (s.unlockedTrains?.length || 1) >= 2,
  },
  {
    id: 'upgrades_all',
    name: 'Estación Modelo',
    description: 'Desbloquea todas las mejoras disponibles de la estación.',
    reward: 150,
    icon: '🌟',
    check: (s) => (s.upgrades?.length || 0) >= UPGRADE_CATALOG.length,
  },
];

function computePassiveIncome(upgrades = []) {
  return upgrades.reduce((sum, id) => sum + (PASSIVE_INCOME_MAP[id] || 0), 0);
}

function evaluateAchievements(state) {
  if (!Array.isArray(state.unlockedAchievements)) {
    state.unlockedAchievements = [];
  }
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENT_DEFS) {
    if (!state.unlockedAchievements.includes(ach.id) && ach.check(state)) {
      state.unlockedAchievements.push(ach.id);
      state.coins += ach.reward;
      newlyUnlocked.push({ id: ach.id, name: ach.name, reward: ach.reward, icon: ach.icon });
    }
  }
  return newlyUnlocked;
}

const DEFAULT_STATE = {
  coins: 25,
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  upgrades: [],
  unlockedTrains: ['sarmiento'],
  selectedTrain: 'sarmiento',
  unlockedAchievements: [],
  sandboxMode: false,
};

function loadQuestions() {
  const raw = fs.readFileSync(QUESTIONS_PATH, 'utf8');
  return JSON.parse(raw);
}

function loadState() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_STATE, null, 2), 'utf8');
    return { ...DEFAULT_STATE };
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state) {
  fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf8');
}

function buildStationPayload(state) {
  const unlockedTrains = state.unlockedTrains || ['sarmiento'];
  const selectedTrain = state.selectedTrain || 'sarmiento';
  const unlockedAchievements = state.unlockedAchievements || [];
  const stationLevel = computeStationLevel(state);
  const satisfaction = computeSatisfaction(state.upgrades);

  return {
    coins: state.coins,
    streak: state.streak,
    bestStreak: state.bestStreak,
    totalAnswered: state.totalAnswered,
    totalCorrect: state.totalCorrect,
    upgrades: state.upgrades,
    sandboxMode: Boolean(state.sandboxMode),
    stationLevel,
    satisfaction,
    passiveIncomePerTrain: computePassiveIncome(state.upgrades),
    catalog: UPGRADE_CATALOG.map((item) => ({
      ...item,
      passiveIncome: PASSIVE_INCOME_MAP[item.id] || 0,
      unlocked: state.upgrades.includes(item.id),
    })),
    unlockedTrains,
    selectedTrain,
    trainsCatalog: TRAIN_CATALOG.map((train) => ({
      ...train,
      unlocked: unlockedTrains.includes(train.id),
      selected: selectedTrain === train.id,
    })),
    achievements: ACHIEVEMENT_DEFS.map(({ id, name, description, reward, icon }) => ({
      id,
      name,
      description,
      reward,
      icon,
      unlocked: unlockedAchievements.includes(id),
    })),
  };
}

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'API de Estación 3D activa',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/station', (_req, res) => {
  const state = loadState();
  res.json(buildStationPayload(state));
});

const recentQuestionIds = [];
const RECENT_LIMIT = 45;
const generatedQuestionsCache = new Map();

function rememberQuestionId(id) {
  recentQuestionIds.push(id);
  if (recentQuestionIds.length > RECENT_LIMIT) {
    recentQuestionIds.shift();
  }
}

app.get('/api/trivia/next', (req, res) => {
  const questions = loadQuestions().map((q) => ({
    ...q,
    difficulty: q.difficulty || 'Media',
    explanation:
      q.explanation || `La respuesta correcta es "${q.options[q.correctIndex]}".`,
  }));
  const lastId = req.query.lastId;
  const difficulty = req.query.difficulty || 'Todas';

  const freshCurated = questions.filter(
    (q) =>
      q.id !== lastId &&
      !recentQuestionIds.includes(q.id) &&
      (difficulty === 'Todas' || q.difficulty === difficulty)
  );

  let picked;
  // Mezcla preguntas curadas no vistas recientemente y preguntas procedurales únicas
  const useProcedural = freshCurated.length === 0 || Math.random() < 0.45;
  if (useProcedural) {
    picked = generateProceduralQuestion(difficulty);
    generatedQuestionsCache.set(picked.id, picked);
    if (generatedQuestionsCache.size > 150) {
      const oldestKey = generatedQuestionsCache.keys().next().value;
      generatedQuestionsCache.delete(oldestKey);
    }
  } else {
    picked = freshCurated[Math.floor(Math.random() * freshCurated.length)];
  }

  rememberQuestionId(picked.id);

  // No enviamos correctIndex al cliente para evitar trampas en el navegador
  res.json({
    id: picked.id,
    category: picked.category,
    difficulty: picked.difficulty,
    question: picked.question,
    options: picked.options,
  });
});

app.post('/api/trivia/answer', (req, res) => {
  const { questionId, selectedIndex } = req.body ?? {};
  const questions = loadQuestions();
  const rawQuestion =
    questions.find((q) => q.id === questionId) || generatedQuestionsCache.get(questionId);

  if (!rawQuestion) {
    return res.status(404).json({ error: 'Pregunta no encontrada' });
  }

  const difficulty = rawQuestion.difficulty || 'Media';
  const explanation =
    rawQuestion.explanation ||
    `La respuesta correcta es "${rawQuestion.options[rawQuestion.correctIndex]}".`;

  const state = loadState();
  const isCorrect = Number(selectedIndex) === rawQuestion.correctIndex;
  state.totalAnswered += 1;

  let baseCoins = 0;
  let streakBonus = 0;
  const passiveIncome = computePassiveIncome(state.upgrades);
  let totalEarned = passiveIncome;

  if (isCorrect) {
    state.totalCorrect += 1;
    state.streak += 1;
    if (state.streak > state.bestStreak) {
      state.bestStreak = state.streak;
    }
    const ranges = {
      Fácil: [15, 30],
      Media: [30, 55],
      Difícil: [55, 90],
    };
    const [minC, maxC] = ranges[difficulty] || ranges.Media;
    const rawBase = Math.floor(Math.random() * (maxC - minC + 1)) + minC;
    const { multiplier } = computeSatisfaction(state.upgrades);
    baseCoins = Math.round(rawBase * multiplier);
    streakBonus = Math.min(state.streak - 1, 10) * 5; // +5 por racha consecutiva
    totalEarned += baseCoins + streakBonus;
  } else {
    state.streak = 0;
  }

  state.coins += totalEarned;
  const newAchievements = evaluateAchievements(state);
  saveState(state);

  res.json({
    correct: isCorrect,
    correctIndex: rawQuestion.correctIndex,
    difficulty,
    explanation,
    baseCoins,
    streakBonus,
    passiveIncome,
    totalEarned,
    newAchievements,
    ...buildStationPayload(state),
  });
});

app.post('/api/station/upgrade', (req, res) => {
  const { upgradeId } = req.body ?? {};
  const item = UPGRADE_CATALOG.find((u) => u.id === upgradeId);

  if (!item) {
    return res.status(404).json({ error: 'Mejora no encontrada' });
  }

  const state = loadState();
  if (state.upgrades.includes(upgradeId)) {
    return res.status(400).json({ error: 'Esta mejora ya está desbloqueada' });
  }

  if (state.coins < item.cost) {
    return res.status(400).json({ error: 'Monedas insuficientes' });
  }

  state.coins -= item.cost;
  state.upgrades.push(upgradeId);
  const newAchievements = evaluateAchievements(state);
  saveState(state);

  res.json({
    purchased: item,
    newAchievements,
    ...buildStationPayload(state),
  });
});

app.post('/api/station/train', (req, res) => {
  const { trainId } = req.body ?? {};
  const train = TRAIN_CATALOG.find((t) => t.id === trainId);

  if (!train) {
    return res.status(404).json({ error: 'Tren no encontrado' });
  }

  const state = loadState();
  if (!Array.isArray(state.unlockedTrains) || state.unlockedTrains.length === 0) {
    state.unlockedTrains = ['sarmiento'];
  }

  let purchased = null;
  if (!state.unlockedTrains.includes(trainId)) {
    if (state.coins < train.cost) {
      return res.status(400).json({ error: 'Monedas insuficientes para comprar este tren' });
    }
    state.coins -= train.cost;
    state.unlockedTrains.push(trainId);
    purchased = train;
  }

  state.selectedTrain = trainId;
  const newAchievements = evaluateAchievements(state);
  saveState(state);

  res.json({
    purchased,
    selected: train,
    newAchievements,
    ...buildStationPayload(state),
  });
});

app.post('/api/station/sandbox', (req, res) => {
  const { password } = req.body ?? {};
  if (password !== 'baltazar') {
    return res.status(403).json({ error: 'Contraseña incorrecta' });
  }

  const state = loadState();
  state.sandboxMode = true;
  state.upgrades = UPGRADE_CATALOG.map((u) => u.id);
  state.unlockedTrains = TRAIN_CATALOG.map((t) => t.id);
  state.coins = Math.max(state.coins, 9999);
  const newAchievements = evaluateAchievements(state);
  saveState(state);

  res.json({
    newAchievements,
    ...buildStationPayload(state),
  });
});

app.post('/api/station/reset', (_req, res) => {
  const fresh = { ...DEFAULT_STATE };
  saveState(fresh);
  res.json(buildStationPayload(fresh));
});

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor Node.js escuchando en http://localhost:${PORT}`);
  });
}

export default app;
