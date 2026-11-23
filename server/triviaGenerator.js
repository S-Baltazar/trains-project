/**
 * Generador procedural de preguntas de trivia con distractores aleatorios
 * para minimizar la repetición entre partidas.
 */

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildQuestion(category, difficulty, question, correctAnswer, distractors, explanation) {
  const uniqueDistractors = [...new Set(distractors.filter((d) => d !== correctAnswer))];
  const picked = shuffle(uniqueDistractors).slice(0, 3);
  const options = shuffle([correctAnswer, ...picked]);
  return {
    id: `proc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    category,
    difficulty,
    question,
    options,
    correctIndex: options.indexOf(correctAnswer),
    explanation,
  };
}

const CAPITALS = [
  ['Argentina', 'Buenos Aires'],
  ['Brasil', 'Brasilia'],
  ['Chile', 'Santiago'],
  ['Uruguay', 'Montevideo'],
  ['Paraguay', 'Asunción'],
  ['Perú', 'Lima'],
  ['Colombia', 'Bogotá'],
  ['Ecuador', 'Quito'],
  ['Bolivia', 'Sucre'],
  ['México', 'Ciudad de México'],
  ['Canadá', 'Ottawa'],
  ['Estados Unidos', 'Washington D. C.'],
  ['España', 'Madrid'],
  ['Francia', 'París'],
  ['Italia', 'Roma'],
  ['Alemania', 'Berlín'],
  ['Portugal', 'Lisboa'],
  ['Reino Unido', 'Londres'],
  ['Países Bajos', 'Ámsterdam'],
  ['Suiza', 'Berna'],
  ['Austria', 'Viena'],
  ['Polonia', 'Varsovia'],
  ['Grecia', 'Atenas'],
  ['Suecia', 'Estocolmo'],
  ['Noruega', 'Oslo'],
  ['Japón', 'Tokio'],
  ['Corea del Sur', 'Seúl'],
  ['China', 'Pekín'],
  ['India', 'Nueva Delhi'],
  ['Tailandia', 'Bangkok'],
  ['Egipto', 'El Cairo'],
  ['Marruecos', 'Rabat'],
  ['Sudáfrica', 'Pretoria'],
  ['Australia', 'Canberra'],
  ['Nueva Zelanda', 'Wellington'],
];

const ELEMENTS = [
  ['Hidrógeno', 'H'],
  ['Helio', 'He'],
  ['Litio', 'Li'],
  ['Carbono', 'C'],
  ['Nitrógeno', 'N'],
  ['Oxígeno', 'O'],
  ['Sodio', 'Na'],
  ['Magnesio', 'Mg'],
  ['Aluminio', 'Al'],
  ['Silicio', 'Si'],
  ['Fósforo', 'P'],
  ['Azufre', 'S'],
  ['Cloro', 'Cl'],
  ['Potasio', 'K'],
  ['Calcio', 'Ca'],
  ['Hierro', 'Fe'],
  ['Cobre', 'Cu'],
  ['Zinc', 'Zn'],
  ['Plata', 'Ag'],
  ['Estaño', 'Sn'],
  ['Oro', 'Au'],
  ['Mercurio', 'Hg'],
  ['Plomo', 'Pb'],
];

const INVENTIONS = [
  ['la imprenta moderna de tipos móviles', 'Johannes Gutenberg', ['Galileo Galilei', 'Leonardo da Vinci', 'Isaac Newton', 'Nikola Tesla']],
  ['la primera locomotora de vapor funcional (1804)', 'Richard Trevithick', ['James Watt', 'George Stephenson', 'Thomas Edison', 'Henry Ford']],
  ['la bombilla incandescente comercial', 'Thomas Edison', ['Nikola Tesla', 'Benjamin Franklin', 'Michael Faraday', 'Alexander Graham Bell']],
  ['el teléfono', 'Alexander Graham Bell', ['Guglielmo Marconi', 'Thomas Edison', 'Samuel Morse', 'Heinrich Hertz']],
  ['la radio de telegrafía sin hilos', 'Guglielmo Marconi', ['Nikola Tesla', 'Alexander Graham Bell', 'Alan Turing', 'James Clerk Maxwell']],
  ['la penicilina', 'Alexander Fleming', ['Louis Pasteur', 'Marie Curie', 'Edward Jenner', 'Robert Koch']],
  ['la teoría de la relatividad', 'Albert Einstein', ['Isaac Newton', 'Niels Bohr', 'Stephen Hawking', 'Max Planck']],
  ['el telescopio espacial lanzado en 1990', 'Hubble', ['James Webb', 'Kepler', 'Voyager', 'Galileo']],
];

function generateCapitalQuestion() {
  const [country, capital] = pickRandom(CAPITALS);
  const allCapitals = CAPITALS.map(([, c]) => c);
  return buildQuestion(
    'Geografía',
    'Fácil',
    `¿Cuál es la capital oficial de ${country}?`,
    capital,
    allCapitals,
    `${capital} es la capital oficial de ${country}.`
  );
}

function generateElementQuestion() {
  const [name, symbol] = pickRandom(ELEMENTS);
  if (Math.random() < 0.5) {
    return buildQuestion(
      'Ciencia',
      'Media',
      `¿Cuál es el símbolo químico del elemento ${name}?`,
      symbol,
      ELEMENTS.map(([, s]) => s),
      `El elemento ${name} se representa con el símbolo '${symbol}' en la tabla periódica.`
    );
  }
  return buildQuestion(
    'Ciencia',
    'Media',
    `¿A qué elemento químico corresponde el símbolo '${symbol}'?`,
    name,
    ELEMENTS.map(([n]) => n),
    `El símbolo '${symbol}' corresponde al ${name}.`
  );
}

function generateRailwayMathQuestion() {
  const speeds = [60, 75, 80, 90, 100, 120, 140, 160];
  const hours = [2, 3, 4, 5];
  const v = pickRandom(speeds);
  const h = pickRandom(hours);
  const dist = v * h;

  if (Math.random() < 0.5) {
    const distractors = [
      `${dist + v} km`,
      `${dist - Math.round(v / 2)} km`,
      `${dist + 40} km`,
      `${Math.max(40, dist - 60)} km`,
    ];
    return buildQuestion(
      'Ferrocarriles',
      'Media',
      `Si un tren circula a una velocidad constante de ${v} km/h, ¿qué distancia recorre en ${h} horas?`,
      `${dist} km`,
      distractors,
      `Distancia = velocidad × tiempo (${v} km/h × ${h} h = ${dist} km).`
    );
  }

  const distractors = [
    `${h + 1} horas`,
    `${Math.max(1, h - 1)} horas`,
    `${h + 2} horas`,
    `${h + 3} horas`,
  ];
  return buildQuestion(
    'Ferrocarriles',
    'Difícil',
    `Un tren debe recorrer ${dist} km a una velocidad constante de ${v} km/h. ¿Cuántas horas tarda en completar el viaje?`,
    `${h} horas`,
    distractors,
    `Tiempo = distancia ÷ velocidad (${dist} km ÷ ${v} km/h = ${h} horas).`
  );
}

function generatePassengerCapacityQuestion() {
  const cars = pickRandom([4, 5, 6, 7, 8, 9]);
  const perCar = pickRandom([45, 50, 60, 75, 80, 90]);
  const total = cars * perCar;
  const distractors = [
    `${total + perCar}`,
    `${total - perCar}`,
    `${total + 30}`,
    `${total - 25}`,
  ];
  return buildQuestion(
    'Matemática Ferroviaria',
    'Difícil',
    `Una formación tiene ${cars} coches y en cada coche viajan ${perCar} pasajeros. ¿Cuántos pasajeros lleva el tren en total?`,
    `${total}`,
    distractors,
    `${cars} coches × ${perCar} pasajeros = ${total} pasajeros en total.`
  );
}

function generateInventionQuestion() {
  const [thing, person, others] = pickRandom(INVENTIONS);
  return buildQuestion(
    'Historia y Ciencia',
    'Fácil',
    `¿Quién es reconocido por ${thing}?`,
    person,
    others,
    `${person} es reconocido históricamente por ${thing}.`
  );
}

export function generateProceduralQuestion(targetDifficulty = 'Todas') {
  const byDiff = {
    Fácil: [generateCapitalQuestion, generateInventionQuestion],
    Media: [generateElementQuestion, generateRailwayMathQuestion],
    Difícil: [generateRailwayMathQuestion, generatePassengerCapacityQuestion],
  };
  const pool =
    byDiff[targetDifficulty] || [
      generateCapitalQuestion,
      generateElementQuestion,
      generateRailwayMathQuestion,
      generatePassengerCapacityQuestion,
      generateInventionQuestion,
    ];
  return pickRandom(pool)();
}
