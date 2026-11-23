import * as THREE from 'three';

const textureCache = new Map();

function getCached(key, builder) {
  if (textureCache.has(key)) return textureCache.get(key);
  const tex = builder();
  textureCache.set(key, tex);
  return tex;
}

/**
 * Textura de ladrillo histórico envejecido con juntas de mortero y manchas de revoque.
 */
export function getBrickTexture() {
  return getCached('brick', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#8b7e72'; // mortero
    ctx.fillRect(0, 0, 512, 512);

    const rows = 16;
    const cols = 8;
    const brickH = 512 / rows;
    const brickW = 512 / cols;
    const mortar = 3;

    const palette = ['#8c4a38', '#7c3f2e', '#965440', '#6e3829', '#a05e48', '#784232'];

    for (let r = 0; r < rows; r++) {
      const offset = r % 2 === 0 ? 0 : brickW / 2;
      for (let c = -1; c <= cols; c++) {
        const x = c * brickW + offset;
        const y = r * brickH;
        const color = palette[(r * 7 + c * 13 + 32) % palette.length];
        ctx.fillStyle = color;
        ctx.fillRect(x + mortar / 2, y + mortar / 2, brickW - mortar, brickH - mortar);

        // Sutil variación superior/inferior
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(x + mortar / 2, y + brickH - mortar - 3, brickW - mortar, 3);
      }
    }

    // Manchas sutiles de desgaste / humedad como en 06_modulo_anden_3d.jpg
    for (let i = 0; i < 40; i++) {
      const rx = (i * 97) % 512;
      const ry = (i * 151) % 512;
      const rad = 18 + (i % 5) * 10;
      const grad = ctx.createRadialGradient(rx, ry, 2, rx, ry, rad);
      grad.addColorStop(0, 'rgba(62, 54, 46, 0.22)');
      grad.addColorStop(1, 'rgba(62, 54, 46, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rx, ry, rad, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Textura de hormigón arquitectónico claro con juntas de dilatación para el andén.
 */
export function getConcreteSlabTexture() {
  return getCached('concrete_slab', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#c4c7ca';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 1800; i++) {
      const x = (i * 73) % 512;
      const y = (i * 137) % 512;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
      ctx.fillRect(x, y, 2, 2);
    }

    // Juntas entre losas
    ctx.strokeStyle = 'rgba(70, 75, 82, 0.45)';
    ctx.lineWidth = 3;
    for (let p = 0; p <= 512; p += 128) {
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(512, p);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 8);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Franja táctil podotáctil del borde del andén.
 */
export function getTactileStripTexture() {
  return getCached('tactile_strip', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#aeb3b8';
    ctx.fillRect(0, 0, 128, 512);

    ctx.fillStyle = '#7e848b';
    for (let y = 8; y < 512; y += 16) {
      for (let x = 10; x < 120; x += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 20);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Balasto de piedra partida para la vía.
 */
export function getBallastTexture() {
  return getCached('ballast', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#4a4d52';
    ctx.fillRect(0, 0, 256, 256);

    const tones = ['#64686e', '#383b40', '#73767b', '#2c2f33', '#5c5852'];
    for (let i = 0; i < 950; i++) {
      const x = (i * 53) % 256;
      const y = (i * 97) % 256;
      const w = 3 + (i % 5);
      const h = 3 + ((i * 3) % 4);
      ctx.fillStyle = tones[i % tones.length];
      ctx.fillRect(x, y, w, h);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 48);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Textura de veta de madera cálida (roble o nogal).
 */
export function getWoodTexture(variant = 'oak') {
  return getCached(`wood_${variant}`, () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const isWalnut = variant === 'walnut';
    ctx.fillStyle = isWalnut ? '#8b5e3c' : '#b88b58';
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 3) {
      const alpha = ((y * 17) % 10) * 0.015 + 0.04;
      ctx.fillStyle = isWalnut
        ? `rgba(48, 28, 14, ${alpha})`
        : `rgba(110, 72, 32, ${alpha})`;
      ctx.fillRect(0, y, 256, 1.5 + (y % 2));
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Rejilla metálica perforada para el zócalo de la barra de café (08_barra_cafe_isla_3d.jpg).
 */
export function getVentGrilleTexture() {
  return getCached('vent_grille', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2b2826';
    ctx.fillRect(0, 0, 128, 64);

    ctx.fillStyle = '#111214';
    for (let y = 4; y < 64; y += 6) {
      for (let x = 4; x < 128; x += 6) {
        ctx.fillRect(x, y, 3, 3);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Cartel de menú colgante de la barra de café (08_barra_cafe_isla_3d.jpg).
 */
export function getMenuBoardTexture() {
  return getCached('menu_board', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#222428';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = '#9c7146';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 250, 122);

    ctx.fillStyle = '#f3e5d0';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('CAFÉ', 20, 24);
    ctx.fillText('PASTELERÍA', 138, 24);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '10px monospace';
    const leftItems = ['Espresso     $2.5', 'Latte        $3.5', 'Cappuccino   $3.5', 'Americano    $2.8', 'Cold Brew    $4.0'];
    const rightItems = ['Croissant    $2.8', 'Medialuna    $1.8', 'Muffin       $3.0', 'Tostado      $4.5', 'Cookie       $2.2'];

    leftItems.forEach((line, i) => ctx.fillText(line, 18, 44 + i * 15));
    rightItems.forEach((line, i) => ctx.fillText(line, 138, 44 + i * 15));

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Pantalla vertical de partidas de trenes para el Tótem (11_totem_pantallas_trenes_3d.jpg).
 */
export function getDepartureScreenTexture() {
  return getCached('departure_screen', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#181a1e';
    ctx.fillRect(0, 0, 256, 512);

    // Encabezado
    ctx.fillStyle = '#23262c';
    ctx.fillRect(0, 0, 256, 58);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('Departure', 16, 36);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('TIME', 16, 76);
    ctx.fillText('DESTINATION', 64, 76);
    ctx.fillText('PLAT', 212, 76);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(12, 84);
    ctx.lineTo(244, 84);
    ctx.stroke();

    const rows = [
      ['14:02', 'Once', '1', '#facc15'],
      ['14:10', 'Moreno', '2', '#e2e8f0'],
      ['14:18', 'Castelar', '1', '#e2e8f0'],
      ['14:25', 'Merlo', '2', '#4ade80'],
      ['14:32', 'Morón', '1', '#e2e8f0'],
      ['14:40', 'Liniers', '1', '#e2e8f0'],
      ['14:48', 'Caballito', '2', '#facc15'],
      ['14:55', 'Ramos Mejía', '1', '#e2e8f0'],
      ['15:04', 'Haedo', '2', '#e2e8f0'],
      ['15:12', 'Ituzaingó', '1', '#4ade80'],
      ['15:20', 'Padua', '2', '#e2e8f0'],
      ['15:28', 'Paso del Rey', '1', '#e2e8f0'],
      ['15:36', 'Once Expreso', '1', '#38bdf8'],
      ['15:45', 'Moreno', '2', '#e2e8f0'],
    ];

    ctx.font = '13px monospace';
    rows.forEach(([time, dest, plat, color], idx) => {
      const y = 108 + idx * 27;
      if (idx % 2 === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(10, y - 16, 236, 22);
      }
      ctx.fillStyle = color;
      ctx.fillText(time, 16, y);
      ctx.fillStyle = '#f1f5f9';
      ctx.fillText(dest, 64, y);
      ctx.fillStyle = color;
      ctx.fillText(plat, 222, y);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Pantalla del cajero automático (izquierda en 10_modulo_cajeros_3d.jpg).
 */
export function getAtmScreenTexture() {
  return getCached('atm_screen', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0f2942';
    ctx.fillRect(0, 0, 128, 96);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(8, 10, 112, 18);

    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('ATM BANCO', 30, 23);

    ctx.fillStyle = '#1e4e79';
    ctx.fillRect(12, 38, 46, 18);
    ctx.fillRect(70, 38, 46, 18);
    ctx.fillRect(12, 64, 46, 18);
    ctx.fillRect(70, 64, 46, 18);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Pantalla de la boletería automática (derecha en 10_modulo_cajeros_3d.jpg).
 */
export function getTicketKioskScreenTexture() {
  return getCached('kiosk_screen', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 96;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 128, 96);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 128, 22);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('BOLETOS / SUBE', 20, 15);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(10, 30, 50, 24);
    ctx.fillRect(68, 30, 50, 24);
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(10, 62, 108, 22);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Esfera de reloj ferroviario clásico (12_reloj_circular_3d.jpg).
 */
export function getClockFaceTexture() {
  return getCached('clock_face', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const cx = 256;
    const cy = 256;

    // Fondo crema cálido
    ctx.fillStyle = '#f2ede1';
    ctx.beginPath();
    ctx.arc(cx, cy, 250, 0, Math.PI * 2);
    ctx.fill();

    // 60 marcas de minutos y 12 marcas de horas (sin números, estilo ferroviario)
    for (let i = 0; i < 60; i++) {
      const ang = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const isHour = i % 5 === 0;
      const isQuarter = i % 15 === 0;
      const rOuter = 234;
      const rInner = isQuarter ? 186 : isHour ? 196 : 216;
      ctx.strokeStyle = '#1b1e23';
      ctx.lineWidth = isQuarter ? 9 : isHour ? 6 : 3;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ang) * rInner, cy + Math.sin(ang) * rInner);
      ctx.lineTo(cx + Math.cos(ang) * rOuter, cy + Math.sin(ang) * rOuter);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}
