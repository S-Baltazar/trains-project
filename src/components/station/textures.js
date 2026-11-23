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
 * Balasto de piedra partida de granito gris para la vía (05_via_ferrea_recta_3d.jpg).
 */
export function getBallastTexture() {
  return getCached('ballast', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#5c6066';
    ctx.fillRect(0, 0, 512, 512);

    const tones = ['#8b9098', '#464a50', '#a3a8b0', '#34373c', '#747880', '#b4b8bf'];
    for (let i = 0; i < 4200; i++) {
      const x = (i * 73 + (i % 19) * 11) % 512;
      const y = (i * 131 + (i % 23) * 7) % 512;
      const w = 4 + (i % 7);
      const h = 3 + ((i * 5) % 6);
      ctx.fillStyle = tones[i % tones.length];
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + (i % 3));
      ctx.lineTo(x + w - 1, y + h);
      ctx.lineTo(x + (i % 2), y + h - 1);
      ctx.closePath();
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 72);
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

/**
 * Cartel "BOOKS & NEWS" para la librería y revistero (03_libreria_revistero_3d.jpg).
 */
export function getBookstoreSignTexture() {
  return getCached('bookstore_sign', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1b1f24';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 496, 112);

    ctx.fillStyle = '#f3efe6';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BOOKS & NEWS', 256, 66);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}

/**
 * Mapa de red ferroviaria para el tótem junto a los molinetes (04_molinetes_cestos_mapa_3d.jpg).
 */
export function getTransitMapTexture() {
  return getCached('transit_map', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 384;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1e2228';
    ctx.fillRect(0, 0, 384, 512);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('RED DE ESTACIONES', 24, 40);

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(20, 58, 344, 380);

    const lines = [
      { color: '#2563eb', pts: [[45, 110], [140, 170], [240, 220], [340, 280]] },
      { color: '#dc2626', pts: [[60, 360], [150, 270], [240, 220], [310, 110]] },
      { color: '#16a34a', pts: [[45, 230], [160, 230], [240, 220], [340, 200]] },
      { color: '#d97706', pts: [[180, 80], [190, 190], [200, 320], [220, 410]] },
    ];
    for (const line of lines) {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      line.pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();

      for (const [x, y] of line.pts) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px sans-serif';
    ctx.fillText('Líneas A • B • C • Sarmiento', 24, 476);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  });
}
