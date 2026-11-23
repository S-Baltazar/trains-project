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
const DB_PATH = path.resolve(__dirname, 'data/db.json');

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

const DEFAULT_STATE = {
  coins: 25,
  streak: 0,
  bestStreak: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  upgrades: [],
  unlockedTrains: ['sarmiento'],
  selectedTrain: 'sarmiento',
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

  return {
    coins: state.coins,
    streak: state.streak,
    bestStreak: state.bestStreak,
    totalAnswered: state.totalAnswered,
    totalCorrect: state.totalCorrect,
    upgrades: state.upgrades,
    catalog: UPGRADE_CATALOG.map((item) => ({
      ...item,
      unlocked: state.upgrades.includes(item.id),
    })),
    unlockedTrains,
    selectedTrain,
    trainsCatalog: TRAIN_CATALOG.map((train) => ({
      ...train,
      unlocked: unlockedTrains.includes(train.id),
      selected: selectedTrain === train.id,
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
  const questions = loadQuestions();
  const lastId = req.query.lastId;
  const freshCurated = questions.filter(
    (q) => q.id !== lastId && !recentQuestionIds.includes(q.id)
  );

  let picked;
  // Mezcla preguntas curadas no vistas recientemente y preguntas procedurales únicas
  const useProcedural = freshCurated.length === 0 || Math.random() < 0.45;
  if (useProcedural) {
    picked = generateProceduralQuestion();
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
    question: picked.question,
    options: picked.options,
  });
});

app.post('/api/trivia/answer', (req, res) => {
  const { questionId, selectedIndex } = req.body ?? {};
  const questions = loadQuestions();
  const question =
    questions.find((q) => q.id === questionId) || generatedQuestionsCache.get(questionId);

  if (!question) {
    return res.status(404).json({ error: 'Pregunta no encontrada' });
  }

  const state = loadState();
  const isCorrect = Number(selectedIndex) === question.correctIndex;
  state.totalAnswered += 1;

  let baseCoins = 0;
  let streakBonus = 0;
  let totalEarned = 0;

  if (isCorrect) {
    state.totalCorrect += 1;
    state.streak += 1;
    if (state.streak > state.bestStreak) {
      state.bestStreak = state.streak;
    }
    baseCoins = Math.floor(Math.random() * 41) + 10; // 10 a 50 monedas aleatorias
    streakBonus = Math.min(state.streak - 1, 10) * 5; // +5 por racha consecutiva
    totalEarned = baseCoins + streakBonus;
    state.coins += totalEarned;
  } else {
    state.streak = 0;
  }

  saveState(state);

  res.json({
    correct: isCorrect,
    correctIndex: question.correctIndex,
    baseCoins,
    streakBonus,
    totalEarned,
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
  saveState(state);

  res.json({
    purchased: item,
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
  saveState(state);

  res.json({
    purchased,
    selected: train,
    ...buildStationPayload(state),
  });
});

app.post('/api/station/reset', (_req, res) => {
  const fresh = { ...DEFAULT_STATE };
  saveState(fresh);
  res.json(buildStationPayload(fresh));
});

if (process.env.NODE_ENV === 'production') {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${PORT}`);
});
