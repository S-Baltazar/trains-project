import { useMemo } from 'react';
import * as THREE from 'three';
import {
  getAtmScreenTexture,
  getDepartureScreenTexture,
  getMenuBoardTexture,
  getTicketKioskScreenTexture,
  getVentGrilleTexture,
  getWoodTexture,
} from './textures.js';

/**
 * 01_banco_lineal_listones_3d.jpg
 * Banco lineal de listones de madera con base metálica oscura retraída.
 */
export function SlattedLinearBench({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const topSlats = [-0.24, -0.144, -0.048, 0.048, 0.144, 0.24];
  const sideSlats = [0.22, 0.31, 0.4];

  return (
    <group position={position} rotation={rotation}>
      {/* Base metálica oscura retraída */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.16, 1.85]} />
        <meshStandardMaterial color="#1f2328" metalness={0.55} roughness={0.45} />
      </mesh>
      {[-0.86, 0.86].map((lz) => (
        <mesh key={lz} position={[0, 0.08, lz]} castShadow>
          <boxGeometry args={[0.42, 0.16, 0.05]} />
          <meshStandardMaterial color="#181b20" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Núcleo interno oscuro para que se noten las ranuras entre listones */}
      <mesh position={[0, 0.29, 0]}>
        <boxGeometry args={[0.48, 0.22, 2.08]} />
        <meshStandardMaterial color="#3b2818" roughness={0.9} />
      </mesh>

      {/* 6 listones superiores longitudinales */}
      {topSlats.map((sx, i) => (
        <mesh key={`top-${i}`} position={[sx, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.075, 0.05, 2.2]} />
          <meshStandardMaterial map={oakTex} roughness={0.65} />
        </mesh>
      ))}

      {/* 3 listones horizontales en ambos frentes */}
      {sideSlats.map((sy, i) => (
        <group key={`side-${i}`}>
          <mesh position={[-0.26, sy, 0]} castShadow>
            <boxGeometry args={[0.045, 0.068, 2.2]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
          <mesh position={[0.26, sy, 0]} castShadow>
            <boxGeometry args={[0.045, 0.068, 2.2]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Tapas laterales de madera en los extremos */}
      {[-1.08, 1.08].map((ez) => (
        <mesh key={`end-${ez}`} position={[0, 0.3, ez]} castShadow>
          <boxGeometry args={[0.48, 0.23, 0.045]} />
          <meshStandardMaterial map={oakTex} roughness={0.68} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 02_banco_ergonomico_curvo_3d.jpg
 * Banco ergonómico curvo de madera con apoyabrazos y punteras metálicas en patas.
 */
export function CurvedErgonomicBench({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);

  const shellGeo = useMemo(() => {
    const shape = new THREE.Shape();
    // Perfil lateral curvo (asiento + respaldo en S suave)
    shape.moveTo(-0.34, 0.38);
    shape.bezierCurveTo(-0.22, 0.42, -0.05, 0.37, 0.14, 0.38);
    shape.bezierCurveTo(0.24, 0.39, 0.29, 0.47, 0.33, 0.62);
    shape.lineTo(0.39, 0.92);
    shape.lineTo(0.34, 0.93);
    shape.lineTo(0.27, 0.62);
    shape.bezierCurveTo(0.23, 0.49, 0.18, 0.44, 0.1, 0.43);
    shape.bezierCurveTo(-0.06, 0.42, -0.22, 0.47, -0.34, 0.42);
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 2.2,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments: 14,
    });
    geo.translate(0, 0, -1.1);
    // Rotar para que el frente mire hacia -X y el largo sea en Z
    geo.rotateY(Math.PI / 2);
    // Corrección: shape está en XY, depth en Z; tras rotateY(PI/2) el largo queda en X, así que no rotamos Y:
    geo.rotateY(-Math.PI / 2);
    return geo;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Carcasa ergonómica curva */}
      <mesh geometry={shellGeo} castShadow receiveShadow>
        <meshStandardMaterial map={oakTex} roughness={0.62} />
      </mesh>

      {/* Travesaño horizontal bajo el asiento */}
      <mesh position={[0.04, 0.32, 0]} castShadow>
        <boxGeometry args={[0.1, 0.12, 1.95]} />
        <meshStandardMaterial map={oakTex} roughness={0.68} />
      </mesh>

      {/* 3 patas de madera con punteras metálicas oscuras */}
      {[-0.95, 0, 0.95].map((lz) => (
        <group key={lz} position={[0, 0, lz]}>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.48, 0.28, 0.08]} />
            <meshStandardMaterial map={oakTex} roughness={0.68} />
          </mesh>
          <mesh position={[0, 0.045, 0]} castShadow>
            <boxGeometry args={[0.5, 0.09, 0.095]} />
            <meshStandardMaterial color="#272b30" metalness={0.55} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* 2 apoyabrazos curvos divisorios */}
      {[-0.36, 0.36].map((az) => (
        <group key={az} position={[0, 0, az]}>
          {/* Poste delantero */}
          <mesh position={[-0.18, 0.52, 0]} castShadow>
            <boxGeometry args={[0.05, 0.2, 0.05]} />
            <meshStandardMaterial map={oakTex} roughness={0.6} />
          </mesh>
          {/* Barra superior del apoyabrazos */}
          <mesh position={[0.04, 0.62, 0]} castShadow>
            <boxGeometry args={[0.48, 0.045, 0.055]} />
            <meshStandardMaterial map={oakTex} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * 03_banco_doble_faz_3d.jpg
 * Banco doble faz de madera de nogal con respaldo central inclinado.
 */
export function DoubleSidedBench({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const walnutTex = useMemo(() => getWoodTexture('walnut'), []);
  const oakTex = useMemo(() => getWoodTexture('oak'), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Dos pedestales sólidos de madera */}
      {[-0.72, 0.72].map((lz) => (
        <mesh key={lz} position={[0, 0.19, lz]} castShadow receiveShadow>
          <boxGeometry args={[0.72, 0.38, 0.16]} />
          <meshStandardMaterial map={walnutTex} roughness={0.7} />
        </mesh>
      ))}

      {/* Viga longitudinal de soporte */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.58, 0.08, 1.65]} />
        <meshStandardMaterial map={walnutTex} roughness={0.7} />
      </mesh>

      {/* Asientos en ambas caras (tablones anchos) */}
      <mesh position={[-0.34, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.075, 2.2]} />
        <meshStandardMaterial map={walnutTex} roughness={0.62} />
      </mesh>
      <mesh position={[0.34, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.38, 0.075, 2.2]} />
        <meshStandardMaterial map={walnutTex} roughness={0.62} />
      </mesh>
      {/* Tablón central claro */}
      <mesh position={[0, 0.42, 0]} receiveShadow>
        <boxGeometry args={[0.28, 0.075, 2.2]} />
        <meshStandardMaterial map={oakTex} roughness={0.65} />
      </mesh>

      {/* Respaldo central doble inclinado en A */}
      <mesh position={[-0.08, 0.66, 0]} rotation={[0, 0, -0.15]} castShadow>
        <boxGeometry args={[0.07, 0.44, 2.2]} />
        <meshStandardMaterial map={walnutTex} roughness={0.62} />
      </mesh>
      <mesh position={[0.08, 0.66, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.07, 0.44, 2.2]} />
        <meshStandardMaterial map={walnutTex} roughness={0.62} />
      </mesh>
    </group>
  );
}

/**
 * 08_barra_cafe_isla_3d.jpg
 * Barra de café isla con listones verticales, mesada oscura, estructura metálica con LED,
 * menú colgante, vitrina pastelera, cafetera espresso y molinillo.
 */
export function IslandCoffeeBar({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const menuTex = useMemo(() => getMenuBoardTexture(), []);
  const ventTex = useMemo(() => getVentGrilleTexture(), []);

  // Listones verticales del frente (-X) y laterales
  const frontSlats = useMemo(() => {
    const arr = [];
    for (let z = -1.65; z <= 1.05; z += 0.09) arr.push(z);
    return arr;
  }, []);

  const sideSlats = useMemo(() => {
    const arr = [];
    for (let x = -0.82; x <= 0.82; x += 0.09) arr.push(x);
    return arr;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Zócalo oscuro inferior */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1.82, 0.1, 3.62]} />
        <meshStandardMaterial color="#1f2328" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Cuerpo del mostrador (paredes de isla con pozo central para barista) */}
      <mesh position={[-0.68, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.84, 3.6]} />
        <meshStandardMaterial color="#3b2b1d" roughness={0.85} />
      </mesh>
      <mesh position={[0.68, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.84, 3.6]} />
        <meshStandardMaterial color="#3b2b1d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.52, -1.48]} castShadow receiveShadow>
        <boxGeometry args={[1.84, 0.84, 0.64]} />
        <meshStandardMaterial color="#3b2b1d" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.52, 1.48]} castShadow receiveShadow>
        <boxGeometry args={[1.84, 0.84, 0.64]} />
        <meshStandardMaterial color="#3b2b1d" roughness={0.85} />
      </mesh>

      {/* Listones verticales frontales y traseros */}
      {frontSlats.map((sz, i) => (
        <group key={`fslat-${i}`}>
          <mesh position={[-0.93, 0.52, sz]} castShadow>
            <boxGeometry args={[0.04, 0.82, 0.045]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
          <mesh position={[0.93, 0.52, sz]} castShadow>
            <boxGeometry args={[0.04, 0.82, 0.045]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Panel liso de madera + rejilla metálica en la esquina derecha (como en 08_barra_cafe_isla_3d.jpg) */}
      <mesh position={[-0.93, 0.68, 1.45]}>
        <boxGeometry args={[0.04, 0.48, 0.68]} />
        <meshStandardMaterial map={oakTex} roughness={0.65} />
      </mesh>
      <mesh position={[-0.93, 0.27, 1.45]}>
        <boxGeometry args={[0.05, 0.3, 0.66]} />
        <meshStandardMaterial map={ventTex} metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Listones en los extremos Z */}
      {sideSlats.map((sx, i) => (
        <group key={`sslat-${i}`}>
          <mesh position={[sx, 0.52, -1.81]} castShadow>
            <boxGeometry args={[0.045, 0.82, 0.04]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
          <mesh position={[sx, 0.52, 1.81]} castShadow>
            <boxGeometry args={[0.045, 0.82, 0.04]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Mesada oscura de piedra/granito con hueco central */}
      <mesh position={[-0.68, 0.99, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.58, 0.1, 3.74]} />
        <meshStandardMaterial color="#25282e" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0.68, 0.99, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.58, 0.1, 3.74]} />
        <meshStandardMaterial color="#25282e" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.99, -1.52]} castShadow receiveShadow>
        <boxGeometry args={[1.94, 0.1, 0.7]} />
        <meshStandardMaterial color="#25282e" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0.99, 1.52]} castShadow receiveShadow>
        <boxGeometry args={[1.94, 0.1, 0.7]} />
        <meshStandardMaterial color="#25282e" roughness={0.45} metalness={0.15} />
      </mesh>

      {/* Estructura superior de acero negro (4 postes + marco superior + riel LED) */}
      {[
        [-0.78, -1.55],
        [-0.78, 1.55],
        [0.78, -1.55],
        [0.78, 1.55],
      ].map(([px, pz], idx) => (
        <mesh key={`post-${idx}`} position={[px, 1.82, pz]} castShadow>
          <boxGeometry args={[0.06, 1.58, 0.06]} />
          <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {/* Vigas superiores del marco */}
      {[2.22, 2.58].map((hy, idx) => (
        <group key={`frame-${idx}`} position={[0, hy, 0]}>
          <mesh position={[-0.78, 0, 0]}>
            <boxGeometry args={[0.06, 0.06, 3.16]} />
            <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0.78, 0, 0]}>
            <boxGeometry args={[0.06, 0.06, 3.16]} />
            <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, -1.55]}>
            <boxGeometry args={[1.62, 0.06, 0.06]} />
            <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0, 1.55]}>
            <boxGeometry args={[1.62, 0.06, 0.06]} />
            <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Tira LED cálida debajo del riel a y=2.22 */}
      <mesh position={[-0.78, 2.185, 0]}>
        <boxGeometry args={[0.04, 0.015, 3.04]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[0.78, 2.185, 0]}>
        <boxGeometry args={[0.04, 0.015, 3.04]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={1.8} />
      </mesh>
      <pointLight position={[0, 2.05, 0]} intensity={1.8} distance={5.5} color="#fde68a" />

      {/* Cartel de menú colgante */}
      <group position={[-0.74, 2.02, 0.65]}>
        <mesh position={[0, 0.16, -0.22]}>
          <boxGeometry args={[0.02, 0.25, 0.02]} />
          <meshStandardMaterial color="#1c1f24" />
        </mesh>
        <mesh position={[0, 0.16, 0.22]}>
          <boxGeometry args={[0.02, 0.25, 0.02]} />
          <meshStandardMaterial color="#1c1f24" />
        </mesh>
        <mesh rotation={[0, -Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[0.78, 0.36, 0.04]} />
          <meshStandardMaterial map={menuTex} roughness={0.5} />
        </mesh>
      </group>

      {/* Vitrina de vidrio para pastelería (lado izquierdo del mostrador frontal) */}
      <group position={[-0.68, 1.24, -0.78]}>
        <mesh castShadow>
          <boxGeometry args={[0.44, 0.4, 0.78]} />
          <meshStandardMaterial color="#e0f2fe" transparent opacity={0.28} roughness={0.1} />
        </mesh>
        {/* Estante interno y medialunas/pasteles */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.72]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.5} />
        </mesh>
        {[-0.2, 0, 0.2].map((pz, i) => (
          <mesh key={`pastry-${i}`} position={[0, 0.04, pz]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color="#d97706" roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Terminal POS / Caja registradora */}
      <mesh position={[-0.66, 1.15, -0.15]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[0.16, 0.2, 0.22]} />
        <meshStandardMaterial color="#111827" roughness={0.4} />
      </mesh>

      {/* Cafetera Espresso + Molinillo + Vasos (mostrador trasero derecho) */}
      <group position={[0.66, 1.04, 0.55]}>
        {/* Cuerpo cafetera */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.38, 0.4, 0.56]} />
          <meshStandardMaterial color="#27272a" metalness={0.75} roughness={0.3} />
        </mesh>
        {/* Bandeja superior con tacitas blancas */}
        {[-0.14, 0, 0.14].map((cz, i) => (
          <mesh key={`cup-${i}`} position={[0, 0.44, cz]}>
            <cylinderGeometry args={[0.04, 0.03, 0.07, 10]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
        ))}
        {/* Molinillo de café */}
        <mesh position={[0, 0.22, -0.45]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.44, 12]} />
          <meshStandardMaterial color="#18181b" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * 10_modulo_cajeros_3d.jpg
 * Módulo de cajeros y boletería automática con listones verticales, dos nichos
 * empotrados (ATM + Expendedora), estructura de acero superior y visera con LED.
 */
export function AtmKioskModule({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const atmTex = useMemo(() => getAtmScreenTexture(), []);
  const kioskTex = useMemo(() => getTicketKioskScreenTexture(), []);

  const frontSlats = useMemo(() => {
    const arr = [];
    for (let z = -1.2; z <= 1.2; z += 0.085) arr.push(z);
    return arr;
  }, []);

  const sideSlats = useMemo(() => {
    const arr = [];
    for (let x = -0.52; x <= 0.52; x += 0.085) arr.push(x);
    return arr;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Zócalo oscuro */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[1.18, 0.12, 2.54]} />
        <meshStandardMaterial color="#1f2328" metalness={0.5} roughness={0.45} />
      </mesh>

      {/* Base inferior con listones verticales */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.14, 0.78, 2.5]} />
        <meshStandardMaterial color="#3b2b1d" roughness={0.85} />
      </mesh>
      {frontSlats.map((sz, i) => (
        <group key={`kslat-${i}`}>
          <mesh position={[-0.59, 0.5, sz]} castShadow>
            <boxGeometry args={[0.035, 0.76, 0.042]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
          <mesh position={[0.59, 0.5, sz]} castShadow>
            <boxGeometry args={[0.035, 0.76, 0.042]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
        </group>
      ))}
      {sideSlats.map((sx, i) => (
        <group key={`ksslat-${i}`}>
          <mesh position={[sx, 0.5, -1.27]} castShadow>
            <boxGeometry args={[0.042, 0.76, 0.035]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
          <mesh position={[sx, 0.5, 1.27]} castShadow>
            <boxGeometry args={[0.042, 0.76, 0.035]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Repisa superior oscura del mostrador inferior */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[1.24, 0.07, 2.58]} />
        <meshStandardMaterial color="#25282e" roughness={0.45} />
      </mesh>

      {/* Cuerpo superior empotrado para los dos cajeros */}
      <mesh position={[0.04, 1.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.96, 1.15, 2.26]} />
        <meshStandardMaterial color="#2c3036" roughness={0.6} />
      </mesh>

      {/* Pilastras laterales y central de listones de madera alrededor de los cajeros */}
      {[-1.08, 0, 1.08].map((pz, idx) => (
        <mesh key={`pil-${idx}`} position={[-0.45, 1.52, pz]} castShadow>
          <boxGeometry args={[0.06, 1.15, 0.16]} />
          <meshStandardMaterial map={oakTex} roughness={0.65} />
        </mesh>
      ))}

      {/* Cajero Izquierdo (ATM) */}
      <group position={[-0.46, 1.52, -0.54]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.88, 0.76]} />
          <meshStandardMaterial color="#1c1f24" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Cabecera iluminada blanca */}
        <mesh position={[-0.045, 0.28, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.56]} />
          <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.85} />
        </mesh>
        {/* Pantalla ATM */}
        <mesh position={[-0.045, 0.04, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.42, 0.3]} />
          <meshStandardMaterial map={atmTex} emissive="#38bdf8" emissiveIntensity={0.35} />
        </mesh>
        {/* Teclado y ranuras */}
        <mesh position={[-0.05, -0.22, 0]}>
          <boxGeometry args={[0.04, 0.14, 0.44]} />
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </mesh>
      </group>

      {/* Cajero Derecho (Expendedora de Boletos / SUBE) */}
      <group position={[-0.46, 1.52, 0.54]}>
        <mesh castShadow>
          <boxGeometry args={[0.08, 0.88, 0.76]} />
          <meshStandardMaterial color="#1c1f24" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Marco dorado/madera cálido */}
        <mesh position={[-0.02, 0, 0]}>
          <boxGeometry args={[0.05, 0.92, 0.8]} />
          <meshStandardMaterial color="#a68156" roughness={0.55} />
        </mesh>
        {/* Pantalla táctil */}
        <mesh position={[-0.048, 0.1, 0.08]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.38, 0.3]} />
          <meshStandardMaterial map={kioskTex} emissive="#bae6fd" emissiveIntensity={0.35} />
        </mesh>
        {/* Ranura de boletos/tarjeta */}
        <mesh position={[-0.048, -0.22, -0.1]}>
          <boxGeometry args={[0.03, 0.16, 0.26]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Techo y visera en voladizo de acero negro con tira LED */}
      <mesh position={[-0.16, 2.13, 0]} castShadow>
        <boxGeometry args={[1.56, 0.06, 2.54]} />
        <meshStandardMaterial color="#1f2328" metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Tira LED cálida bajo la visera */}
      <mesh position={[-0.56, 2.09, 0]}>
        <boxGeometry args={[0.05, 0.02, 2.36]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={1.6} />
      </mesh>
      {/* Estructura superior abierta sobre el techo (como en 10_modulo_cajeros_3d.jpg) */}
      {[
        [-0.55, -1.2],
        [-0.55, 1.2],
        [0.55, -1.2],
        [0.55, 1.2],
      ].map(([px, pz], idx) => (
        <mesh key={`kpost-${idx}`} position={[px, 2.3, pz]}>
          <boxGeometry args={[0.05, 0.34, 0.05]} />
          <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[-0.55, 2.47, 0]}>
        <boxGeometry args={[0.05, 0.05, 2.45]} />
        <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.55, 2.47, 0]}>
        <boxGeometry args={[0.05, 0.05, 2.45]} />
        <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.47, -1.2]}>
        <boxGeometry args={[1.15, 0.05, 0.05]} />
        <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.47, 1.2]}>
        <boxGeometry args={[1.15, 0.05, 0.05]} />
        <meshStandardMaterial color="#1c1f24" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

/**
 * 11_totem_pantallas_trenes_3d.jpg
 * Tótem vertical de pantallas de partidas de trenes con listones de madera y barra protectora.
 */
export function DepartureTotem({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const screenTex = useMemo(() => getDepartureScreenTexture(), []);

  const lowerSlats = useMemo(() => {
    const arr = [];
    for (let z = -0.36; z <= 0.36; z += 0.072) arr.push(z);
    return arr;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Base metálica oscura */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 0.16, 0.96]} />
        <meshStandardMaterial color="#1f2328" metalness={0.65} roughness={0.38} />
      </mesh>

      {/* Barra tubular protectora perimetral en la base */}
      <mesh position={[-0.18, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.02, 8]} />
        <meshStandardMaterial color="#272b30" metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[0.18, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 1.02, 8]} />
        <meshStandardMaterial color="#272b30" metalness={0.75} roughness={0.3} />
      </mesh>
      {[-0.51, 0.51].map((bz) => (
        <mesh key={bz} position={[0, 0.16, bz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.36, 8]} />
          <meshStandardMaterial color="#272b30" metalness={0.75} roughness={0.3} />
        </mesh>
      ))}

      {/* Cuerpo principal del tótem */}
      <mesh position={[0, 1.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.22, 2.16, 0.92]} />
        <meshStandardMaterial color="#20242a" metalness={0.55} roughness={0.4} />
      </mesh>

      {/* Listones verticales de madera en la mitad inferior (frente, dorso y laterales) */}
      {lowerSlats.map((sz, i) => (
        <group key={`tslat-${i}`}>
          <mesh position={[-0.12, 0.54, sz]} castShadow>
            <boxGeometry args={[0.025, 0.72, 0.036]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
          <mesh position={[0.12, 0.54, sz]} castShadow>
            <boxGeometry args={[0.025, 0.72, 0.036]} />
            <meshStandardMaterial map={oakTex} roughness={0.65} />
          </mesh>
        </group>
      ))}
      {/* Madera en los laterales del tótem */}
      {[-0.47, 0.47].map((sz) => (
        <mesh key={`tside-${sz}`} position={[0, 1.24, sz]}>
          <boxGeometry args={[0.14, 2.08, 0.025]} />
          <meshStandardMaterial map={oakTex} roughness={0.68} />
        </mesh>
      ))}

      {/* Pantallas verticales de partidas (frente y dorso) */}
      <mesh position={[-0.115, 1.58, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.78, 1.32]} />
        <meshStandardMaterial
          map={screenTex}
          emissive="#f8fafc"
          emissiveMap={screenTex}
          emissiveIntensity={0.55}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.115, 1.58, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.78, 1.32]} />
        <meshStandardMaterial
          map={screenTex}
          emissive="#f8fafc"
          emissiveMap={screenTex}
          emissiveIntensity={0.55}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
