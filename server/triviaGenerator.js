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

function buildQuestion(category, question, correctAnswer, distractors) {
  const uniqueDistractors = [...new Set(distractors.filter((d) => d !== correctAnswer))];
  const picked = shuffle(uniqueDistractors).slice(0, 3);
  const options = shuffle([correctAnswer, ...picked]);
  return {
    id: `proc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    category,
    question,
    options,
    correctIndex: options.indexOf(correctAnswer),
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
    `¿Cuál es la capital oficial de ${country}?`,
    capital,
    allCapitals
  );
}

function generateElementQuestion() {
  const [name, symbol] = pickRandom(ELEMENTS);
  if (Math.random() < 0.5) {
    return buildQuestion(
      'Ciencia',
      `¿Cuál es el símbolo químico del elemento ${name}?`,
      symbol,
      ELEMENTS.map(([, s]) => s)
    );
  }
  return buildQuestion(
    'Ciencia',
    `¿A qué elemento químico corresponde el símbolo '${symbol}'?`,
    name,
    ELEMENTS.map(([n]) => n)
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
      `Si un tren circula a una velocidad constante de ${v} km/h, ¿qué distancia recorre en ${h} horas?`,
      `${dist} km`,
      distractors
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
    `Un tren debe recorrer ${dist} km a una velocidad constante de ${v} km/h. ¿Cuántas horas tarda en completar el viaje?`,
    `${h} horas`,
    distractors
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
    `Una formación tiene ${cars} coches y en cada coche viajan ${perCar} pasajeros. ¿Cuántos pasajeros lleva el tren en total?`,
    `${total}`,
    distractors
  );
}

function generateInventionQuestion() {
  const [thing, person, others] = pickRandom(INVENTIONS);
  return buildQuestion(
    'Historia y Ciencia',
    `¿Quién es reconocido por ${thing}?`,
    person,
    others
  );
}

export function generateProceduralQuestion() {
  const generators = [
    generateCapitalQuestion,
    generateElementQuestion,
    generateRailwayMathQuestion,
    generatePassengerCapacityQuestion,
    generateInventionQuestion,
  ];
  return pickRandom(generators)();
}
