import * as THREE from 'three';

function finalizeTexture(canvas, repeatX = 1, repeatY = 1) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  if (repeatX !== 1 || repeatY !== 1) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX, repeatY);
  }
  return tex;
}

/**
 * 01_tren_dos_pisos_3d.jpg
 * Textura lateral realista del coche doble piso TBA (blanco, franja Z celeste, azul marino y logo TBA).
 */
export function createDoubleDeckerSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Carrocería blanca base
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 256);

  // Sombreado sutil superior/inferior
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, 'rgba(148,163,184,0.18)');
  grad.addColorStop(0.2, 'rgba(255,255,255,0)');
  grad.addColorStop(0.85, 'rgba(255,255,255,0)');
  grad.addColorStop(1, 'rgba(30,41,59,0.22)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 256);

  // Franja celeste en Z característica de TBA
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  ctx.moveTo(0, 80);
  ctx.lineTo(220, 80);
  ctx.lineTo(290, 128);
  ctx.lineTo(734, 128);
  ctx.lineTo(804, 80);
  ctx.lineTo(1024, 80);
  ctx.lineTo(1024, 165);
  ctx.lineTo(815, 165);
  ctx.lineTo(745, 205);
  ctx.lineTo(279, 205);
  ctx.lineTo(209, 165);
  ctx.lineTo(0, 165);
  ctx.closePath();
  ctx.fill();

  // Filete azul marino inferior
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 208, 1024, 14);

  // Marcas diagonales blanco/negro bajo puertas extremas
  for (const startX of [48, 896]) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(startX, 198, 80, 12);
    ctx.fillStyle = '#f8fafc';
    for (let sx = 0; sx < 80; sx += 16) {
      ctx.beginPath();
      ctx.moveTo(startX + sx, 210);
      ctx.lineTo(startX + sx + 8, 210);
      ctx.lineTo(startX + sx + 14, 198);
      ctx.lineTo(startX + sx + 6, 198);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Juntas verticales de paneles
  ctx.strokeStyle = 'rgba(100,116,139,0.35)';
  ctx.lineWidth = 2;
  for (const px of [120, 230, 794, 904]) {
    ctx.beginPath();
    ctx.moveTo(px, 16);
    ctx.lineTo(px, 240);
    ctx.stroke();
  }

  // Logo central TBA
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('◆ TBA', 512, 166);

  // Numeración 1803
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('1803', 34, 192);
  ctx.fillText('1803', 990, 192);

  return finalizeTexture(canvas);
}

/**
 * Textura de techo acanalado metálico/pintado.
 */
export function createCorrugatedRoofTexture(base = '#e2e8f0', rib = '#cbd5e1') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 512);

  for (let x = 8; x < 256; x += 12) {
    ctx.fillStyle = rib;
    ctx.fillRect(x, 0, 5, 512);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillRect(x + 5, 0, 2, 512);
  }

  return finalizeTexture(canvas, 1, 2);
}

/**
 * 02_tren_electrico_suburbano_3d.jpg
 * Textura lateral de acero cepillado plateado con banda oscura de ventanas y filete azul-gris.
 */
export function createSuburbanSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Metal plateado cepillado
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#cbd5e1');
  grad.addColorStop(0.35, '#e2e8f0');
  grad.addColorStop(0.7, '#cbd5e1');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 256);

  // Banda oscura continua de ventanas
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(28, 48, 968, 96);

  // Franja inferior azul-gris
  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 192, 1024, 26);

  // Líneas de unión de chapas
  ctx.strokeStyle = 'rgba(51,65,85,0.35)';
  ctx.lineWidth = 2;
  for (let x = 64; x < 1024; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 8);
    ctx.lineTo(x, 248);
    ctx.stroke();
  }

  // Rejillas superiores de ventilación
  ctx.fillStyle = '#64748b';
  for (let rx = 460; rx < 564; rx += 8) {
    ctx.fillRect(rx, 24, 4, 14);
  }

  return finalizeTexture(canvas);
}

/**
 * 03_locomotora_diesel_electrica_3d.jpg
 * Textura industrial gris carbón con puertas de mantenimiento, rejillas y franja naranja.
 */
export function createDieselLocoSideTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Gris carbón industrial
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#525b66');
  grad.addColorStop(0.5, '#475569');
  grad.addColorStop(1, '#334155');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 256);

  // Puertas verticales de acceso al motor diésel
  for (let x = 40; x < 980; x += 68) {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 42, 58, 185);
    // Manija/pestillo
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 48, 130, 5, 16);
  }

  // Rejillas de radiador en la parte superior
  for (const gx of [70, 340, 620]) {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(gx, 14, 180, 34);
    ctx.fillStyle = '#64748b';
    for (let ly = 18; ly < 46; ly += 5) {
      ctx.fillRect(gx + 6, ly, 168, 2);
    }
  }

  // Franja naranja característica
  ctx.fillStyle = '#d97706';
  ctx.fillRect(0, 152, 1024, 30);
  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.fillRect(0, 152, 1024, 4);

  return finalizeTexture(canvas);
}

/**
 * Frente en V naranja de la locomotora diésel-eléctrica.
 */
export function createDieselFrontChevronTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#475569';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.moveTo(0, 130);
  ctx.lineTo(128, 175);
  ctx.lineTo(256, 130);
  ctx.lineTo(256, 164);
  ctx.lineTo(128, 208);
  ctx.lineTo(0, 164);
  ctx.closePath();
  ctx.fill();

  return finalizeTexture(canvas);
}

/**
 * 04_coche_pasajeros_generico_3d.jpg
 * Textura de acero inoxidable acanalado con banda azul pizarra para el coche de pasajeros.
 */
export function createFlutedCoachTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, 1024, 256);

  // Acanalado horizontal inferior de acero inoxidable
  for (let y = 160; y < 248; y += 8) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, y, 1024, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, y + 3, 1024, 2);
  }

  // Banda azul pizarra de ventanas
  ctx.fillStyle = '#334155';
  ctx.fillRect(42, 56, 940, 88);

  // Marcos de puertas extremas
  for (const dx of [12, 964]) {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.strokeRect(dx, 28, 48, 210);
  }

  return finalizeTexture(canvas);
}
