import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  getAtmScreenTexture,
  getBookstoreSignTexture,
  getClockFaceTexture,
  getDepartureScreenTexture,
  getMenuBoardTexture,
  getTicketKioskScreenTexture,
  getTransitMapTexture,
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

/**
 * 12_reloj_circular_3d.jpg
 * Reloj ferroviario circular colgante doble faz con marco de madera y hierro negro.
 */
export function HangingStationClock({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const clockTex = useMemo(() => getClockFaceTexture(), []);
  const frontMinRef = useRef(null);
  const frontHourRef = useRef(null);
  const backMinRef = useRef(null);
  const backHourRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (frontMinRef.current) frontMinRef.current.rotation.z = -t * 0.4;
    if (frontHourRef.current) frontHourRef.current.rotation.z = -t * 0.05;
    if (backMinRef.current) backMinRef.current.rotation.z = t * 0.4;
    if (backHourRef.current) backHourRef.current.rotation.z = t * 0.05;
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Placa de anclaje superior al techo/cabriada */}
      <mesh position={[0, 1.04, 0]} castShadow>
        <boxGeometry args={[0.24, 0.05, 0.14]} />
        <meshStandardMaterial color="#1c2026" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Dos varillas verticales paralelas de suspensión */}
      {[-0.06, 0.06].map((rx) => (
        <mesh key={rx} position={[rx, 0.74, 0]} castShadow>
          <boxGeometry args={[0.032, 0.58, 0.032]} />
          <meshStandardMaterial color="#1c2026" metalness={0.75} roughness={0.35} />
        </mesh>
      ))}
      {/* Abrazadera superior sobre el tambor */}
      <mesh position={[0, 0.47, 0]} castShadow>
        <boxGeometry args={[0.18, 0.05, 0.18]} />
        <meshStandardMaterial color="#1c2026" metalness={0.75} roughness={0.35} />
      </mesh>

      {/* Tambor metálico oscuro */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.47, 0.47, 0.22, 32]} />
        <meshStandardMaterial color="#1e2228" metalness={0.65} roughness={0.38} />
      </mesh>

      {/* Aros exteriores de madera (frente y dorso) */}
      {[-0.095, 0.095].map((bz) => (
        <mesh key={`wood-${bz}`} position={[0, 0, bz]} castShadow>
          <torusGeometry args={[0.455, 0.032, 12, 36]} />
          <meshStandardMaterial map={oakTex} roughness={0.6} />
        </mesh>
      ))}

      {/* Aros interiores de hierro negro (frente y dorso) */}
      {[-0.108, 0.108].map((bz) => (
        <mesh key={`iron-${bz}`} position={[0, 0, bz]}>
          <torusGeometry args={[0.425, 0.022, 10, 36]} />
          <meshStandardMaterial color="#181b20" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {/* Esfera frontal (+Z) */}
      <mesh position={[0, 0, 0.112]}>
        <circleGeometry args={[0.415, 32]} />
        <meshStandardMaterial
          map={clockTex}
          emissive="#fef3c7"
          emissiveIntensity={0.2}
          roughness={0.45}
        />
      </mesh>
      <group position={[0, 0, 0.122]}>
        <mesh ref={frontMinRef}>
          <boxGeometry args={[0.022, 0.31, 0.012]} />
          <meshStandardMaterial color="#181b20" />
        </mesh>
        <mesh ref={frontHourRef}>
          <boxGeometry args={[0.03, 0.21, 0.012]} />
          <meshStandardMaterial color="#181b20" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.018, 12]} />
          <meshStandardMaterial color="#181b20" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>

      {/* Esfera trasera (-Z) */}
      <mesh position={[0, 0, -0.112]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.415, 32]} />
        <meshStandardMaterial
          map={clockTex}
          emissive="#fef3c7"
          emissiveIntensity={0.2}
          roughness={0.45}
        />
      </mesh>
      <group position={[0, 0, -0.122]} rotation={[0, Math.PI, 0]}>
        <mesh ref={backMinRef}>
          <boxGeometry args={[0.022, 0.31, 0.012]} />
          <meshStandardMaterial color="#181b20" />
        </mesh>
        <mesh ref={backHourRef}>
          <boxGeometry args={[0.03, 0.21, 0.012]} />
          <meshStandardMaterial color="#181b20" />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.018, 12]} />
          <meshStandardMaterial color="#181b20" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Pieza compartida: farol de vidrio cónico de 4 caras (13_faroles_iluminacion_3d.jpg).
 */
function LanternHead({ position = [0, 0, 0], scale = 1 }) {
  const cornerAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

  return (
    <group position={position} scale={scale}>
      {/* Base metálica del farol */}
      <mesh position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.06, 4]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Vidrio troncopiramidal */}
      <mesh position={[0, 0.26, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.2, 0.13, 0.42, 4]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.38}
          roughness={0.12}
          metalness={0.2}
        />
      </mesh>
      {/* 4 montantes metálicos en las esquinas */}
      {cornerAngles.map((ang, i) => (
        <mesh
          key={i}
          position={[Math.cos(ang) * 0.16, 0.26, Math.sin(ang) * 0.16]}
          rotation={[0, -ang, 0]}
        >
          <boxGeometry args={[0.022, 0.43, 0.022]} />
          <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
        </mesh>
      ))}
      {/* Tubo luminoso cálido vertical interior */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.34, 10]} />
        <meshStandardMaterial
          color="#fef9c3"
          emissive="#fde68a"
          emissiveIntensity={2.6}
        />
      </mesh>
      {/* Techo piramidal escalonado + remate esférico */}
      <mesh position={[0, 0.52, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.24, 0.14, 4]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.61, 0]} castShadow>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>
    </group>
  );
}

/**
 * 13_faroles_iluminacion_3d.jpg (izquierda)
 * Farol clásico de pie con base de hierro fundido, fuste con sección de madera y cabezal vidriado.
 */
export function ClassicLampPost({ position = [0, 0, 0], castLight = true }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);

  return (
    <group position={position}>
      {/* Base escalonada de fundición */}
      <mesh position={[0, 0.07, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.14, 14]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.46, 14]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.38} />
      </mesh>
      {/* Anillo inferior */}
      <mesh position={[0, 0.61, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 14]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>

      {/* Sección intermedia de madera cálida */}
      <mesh position={[0, 1.06, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.095, 0.86, 14]} />
        <meshStandardMaterial map={oakTex} roughness={0.62} />
      </mesh>

      {/* Collarín de transición */}
      <mesh position={[0, 1.51, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.05, 14]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>

      {/* Fuste superior metálico */}
      <mesh position={[0, 2.26, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.078, 1.46, 12]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Capitel bajo el farol */}
      <mesh position={[0, 3.02, 0]}>
        <cylinderGeometry args={[0.11, 0.06, 0.1, 12]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>

      {/* Cabezal de farol */}
      <LanternHead position={[0, 3.06, 0]} scale={1} />

      {castLight && (
        <pointLight position={[0, 3.35, 0]} intensity={3.2} distance={11} color="#fde68a" />
      )}
    </group>
  );
}

/**
 * 13_faroles_iluminacion_3d.jpg (centro)
 * Farol de pared con ménsula de hierro, brazo de madera y farol colgante.
 */
export function WallBracketLantern({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  castLight = true,
}) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Placa de fijación a la pared */}
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[0.14, 0.42, 0.04]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Brazo horizontal de madera */}
      <mesh position={[0, 0.14, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.036, 0.036, 0.44, 10]} />
        <meshStandardMaterial map={oakTex} roughness={0.62} />
      </mesh>
      {/* Puntera metálica del brazo */}
      <mesh position={[0, 0.14, 0.47]}>
        <boxGeometry args={[0.08, 0.08, 0.06]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Tornapunta curva inferior de hierro */}
      <mesh position={[0, -0.02, 0.2]} rotation={[0.7, 0, 0]} castShadow>
        <boxGeometry args={[0.035, 0.34, 0.035]} />
        <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
      </mesh>

      {/* Farol colgante (invertido respecto al remate superior) */}
      <LanternHead position={[0, -0.45, 0.44]} scale={0.78} />

      {castLight && (
        <pointLight position={[0, -0.25, 0.5]} intensity={2.4} distance={8.5} color="#fde68a" />
      )}
    </group>
  );
}

/**
 * 13_faroles_iluminacion_3d.jpg (derecha)
 * Luminaria lineal colgante prismática con tubo LED cálido para andén cubierto.
 */
export function SuspendedLinearLamp({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  drop = 0.65,
  castLight = true,
}) {
  const length = 1.65;

  return (
    <group position={position} rotation={rotation}>
      {/* Dos varillas de suspensión y rosetones */}
      {[-0.58, 0.58].map((lx) => (
        <group key={lx} position={[lx, 0, 0]}>
          <mesh position={[0, drop, 0]}>
            <boxGeometry args={[0.07, 0.025, 0.07]} />
            <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
          </mesh>
          <mesh position={[0, drop / 2 + 0.06, 0]}>
            <cylinderGeometry args={[0.012, 0.012, drop, 8]} />
            <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Cuerpo prismático trapezoidal de vidrio */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, length, 4]} />
        <meshStandardMaterial
          color="#e2e8f0"
          transparent
          opacity={0.35}
          roughness={0.12}
          metalness={0.2}
        />
      </mesh>

      {/* Marcos metálicos en extremos y flejes intermedios */}
      {[-length / 2, -0.28, 0.28, length / 2].map((fx, i) => (
        <mesh key={i} position={[fx, 0, 0]} rotation={[0, Math.PI / 4, Math.PI / 2]}>
          <cylinderGeometry args={[0.175, 0.175, 0.032, 4]} />
          <meshStandardMaterial color="#1d2127" metalness={0.75} roughness={0.35} />
        </mesh>
      ))}

      {/* Tubo lineal cálido interior */}
      <mesh position={[0, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.028, 0.028, length - 0.08, 10]} />
        <meshStandardMaterial
          color="#fef9c3"
          emissive="#fde68a"
          emissiveIntensity={2.4}
        />
      </mesh>

      {castLight && (
        <pointLight position={[0, -0.15, 0]} intensity={2.4} distance={9.5} color="#fde68a" />
      )}
    </group>
  );
}

/**
 * 02_floreria_verde_metalica_3d.jpg
 * Florería invernadero metálica verde con techo vidriado a dos aguas, mostrador iluminado y flores.
 */
export function FlowerShopPavilion({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const frameColor = '#466452';
  const counterColor = '#557763';
  const flowerColors = ['#f472b6', '#ef4444', '#facc15', '#f8fafc', '#c084fc'];
  const roofSlopeAngle = Math.atan2(0.55, 1.15);
  const roofSlopeLen = Math.hypot(1.15, 0.55);

  return (
    <group position={position} rotation={rotation}>
      {/* Estructura metálica verde: 6 columnas */}
      {[-2.0, 0, 2.0].map((px) =>
        [-1.1, 1.1].map((pz) => (
          <mesh key={`fcol-${px}-${pz}`} position={[px, 1.15, pz]} castShadow>
            <boxGeometry args={[0.08, 2.3, 0.08]} />
            <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.42} />
          </mesh>
        ))
      )}
      {/* Vigas perimetrales superiores */}
      {[-1.1, 1.1].map((pz) => (
        <mesh key={`fbeam-${pz}`} position={[0, 2.28, pz]} castShadow>
          <boxGeometry args={[4.1, 0.08, 0.08]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.42} />
        </mesh>
      ))}
      {[-2.0, 2.0].map((px) => (
        <mesh key={`fsbeam-${px}`} position={[px, 2.28, 0]} castShadow>
          <boxGeometry args={[0.08, 0.08, 2.28]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.42} />
        </mesh>
      ))}
      {/* Cumbrera del techo */}
      <mesh position={[0, 2.83, 0]} castShadow>
        <boxGeometry args={[4.1, 0.08, 0.08]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.42} />
      </mesh>
      {/* Cabrios del techo vidriado */}
      {[-2.0, -1.0, 0, 1.0, 2.0].map((rx) => (
        <group key={`frafter-${rx}`} position={[rx, 0, 0]}>
          <mesh position={[0, 2.55, -0.57]} rotation={[roofSlopeAngle, 0, 0]}>
            <boxGeometry args={[0.05, 0.06, roofSlopeLen]} />
            <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.42} />
          </mesh>
          <mesh position={[0, 2.55, 0.57]} rotation={[-roofSlopeAngle, 0, 0]}>
            <boxGeometry args={[0.05, 0.06, roofSlopeLen]} />
            <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.42} />
          </mesh>
        </group>
      ))}
      {/* Paneles de vidrio del techo */}
      <mesh position={[0, 2.57, -0.57]} rotation={[roofSlopeAngle, 0, 0]}>
        <boxGeometry args={[4.04, 0.025, roofSlopeLen]} />
        <meshStandardMaterial color="#d1fae5" transparent opacity={0.35} roughness={0.12} />
      </mesh>
      <mesh position={[0, 2.57, 0.57]} rotation={[-roofSlopeAngle, 0, 0]}>
        <boxGeometry args={[4.04, 0.025, roofSlopeLen]} />
        <meshStandardMaterial color="#d1fae5" transparent opacity={0.35} roughness={0.12} />
      </mesh>
      {/* Tira LED cálida bajo el techo */}
      <mesh position={[0, 2.22, 0.96]}>
        <boxGeometry args={[3.9, 0.03, 0.04]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fde68a" emissiveIntensity={1.8} />
      </mesh>

      {/* Mostrador verde frontal derecho con vitrina iluminada */}
      <mesh position={[0.75, 0.48, 0.72]} castShadow receiveShadow>
        <boxGeometry args={[2.05, 0.96, 0.68]} />
        <meshStandardMaterial color={counterColor} roughness={0.55} />
      </mesh>
      {/* Nicho iluminado en el frente del mostrador */}
      <mesh position={[1.18, 0.52, 1.065]}>
        <boxGeometry args={[0.98, 0.62, 0.03]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fde68a" emissiveIntensity={0.85} />
      </mesh>
      {[-0.28, 0, 0.28].map((mx) =>
        [0.36, 0.66].map((my) => (
          <group key={`mpot-${mx}-${my}`} position={[1.18 + mx, my, 1.09]}>
            <mesh>
              <cylinderGeometry args={[0.055, 0.04, 0.09, 8]} />
              <meshStandardMaterial color="#d6d3d1" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.07, 0]}>
              <sphereGeometry args={[0.065, 8, 8]} />
              <meshStandardMaterial color="#2f6b3c" roughness={0.85} />
            </mesh>
          </group>
        ))
      )}

      {/* Rollos de papel de regalo sobre el mostrador trasero */}
      <mesh position={[0.25, 0.46, -0.78]} castShadow>
        <boxGeometry args={[1.4, 0.92, 0.45]} />
        <meshStandardMaterial color={frameColor} roughness={0.6} />
      </mesh>
      {['#f472b6', '#a7f3d0', '#fde68a', '#cbd5e1'].map((rc, i) => (
        <mesh key={`roll-${i}`} position={[0.25, 1.05 + i * 0.08, -0.82]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.032, 0.032, 0.72, 8]} />
          <meshStandardMaterial color={rc} roughness={0.5} />
        </mesh>
      ))}

      {/* Estanterías escalonadas con flores y follaje (izquierda, fondo y derecha) */}
      {[
        { pos: [-1.45, 0.35, 0.3], size: [0.85, 0.7, 1.5] },
        { pos: [-1.15, 0.55, -0.65], size: [1.5, 1.1, 0.65] },
        { pos: [1.55, 0.38, -0.35], size: [0.7, 0.76, 1.1] },
      ].map((stand, idx) => (
        <group key={`stand-${idx}`} position={stand.pos}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={stand.size} />
            <meshStandardMaterial color={frameColor} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Arreglos florales y macetas */}
      {[
        [-1.65, 0.82, 0.75],
        [-1.35, 0.85, 0.35],
        [-1.6, 0.85, -0.15],
        [-1.4, 1.2, -0.6],
        [-0.9, 1.22, -0.7],
        [-0.45, 1.15, -0.7],
        [1.55, 0.88, -0.6],
        [1.55, 0.86, 0.0],
        [1.15, 1.08, 0.72],
        [0.45, 1.08, 0.72],
      ].map(([fx, fy, fz], idx) => (
        <group key={`flw-${idx}`} position={[fx, fy, fz]}>
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.11, 0.08, 0.14, 8]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <dodecahedronGeometry args={[0.17, 0]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#2f6b3c' : '#3f854d'} roughness={0.85} />
          </mesh>
          <mesh position={[0.04, 0.16, 0.03]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color={flowerColors[idx % flowerColors.length]} roughness={0.6} />
          </mesh>
          <mesh position={[-0.05, 0.14, -0.03]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={flowerColors[(idx + 2) % flowerColors.length]} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Plantas colgantes desde el techo */}
      {[-1.55, -0.85, 0.65, 1.35].map((hx, i) => (
        <group key={`hang-${i}`} position={[hx, 1.85, i % 2 === 0 ? 0.55 : -0.45]}>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.44, 6]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.1, 0.07, 0.12, 8]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, -0.04, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial color="#3f854d" roughness={0.85} />
          </mesh>
        </group>
      ))}

      <pointLight position={[0, 2.05, 0.2]} intensity={2.2} distance={8} color="#fde68a" />
    </group>
  );
}

/**
 * 03_libreria_revistero_3d.jpg
 * Librería y revistero con listones de madera, exhibidor escalonado, vitrina y cartel "BOOKS & NEWS".
 */
export function BookstoreNewsstand({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const signTex = useMemo(() => getBookstoreSignTexture(), []);
  const bookColors = ['#ef4444', '#3b82f6', '#eab308', '#10b981', '#f97316', '#8b5cf6', '#ec4899'];

  const frontSlats = useMemo(() => {
    const arr = [];
    for (let x = -1.86; x <= 1.86; x += 0.095) arr.push(x);
    return arr;
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Zócalo oscuro */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.9, 0.1, 1.85]} />
        <meshStandardMaterial color="#181b20" roughness={0.5} />
      </mesh>

      {/* Mostrador base con listones verticales de madera */}
      <mesh position={[0, 0.54, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.86, 0.88, 1.78]} />
        <meshStandardMaterial color="#2a241e" roughness={0.8} />
      </mesh>
      {frontSlats.map((sx, i) => (
        <mesh key={`bslat-${i}`} position={[sx, 0.54, 0.905]} castShadow>
          <boxGeometry args={[0.048, 0.86, 0.025]} />
          <meshStandardMaterial map={oakTex} roughness={0.62} />
        </mesh>
      ))}

      {/* Mesada superior oscura */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[3.96, 0.06, 1.88]} />
        <meshStandardMaterial color="#22262c" metalness={0.35} roughness={0.45} />
      </mesh>

      {/* Estructura metálica superior */}
      {[-1.9, 1.9].map((px) =>
        [-0.88, 0.88].map((pz) => (
          <mesh key={`bpost-${px}-${pz}`} position={[px, 1.78, pz]} castShadow>
            <boxGeometry args={[0.07, 1.56, 0.07]} />
            <meshStandardMaterial color="#1d2127" metalness={0.7} roughness={0.35} />
          </mesh>
        ))
      )}
      {/* Techo de vidrio y marco superior */}
      <mesh position={[0, 2.56, 0]}>
        <boxGeometry args={[3.94, 0.06, 1.9]} />
        <meshStandardMaterial color="#1d2127" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.57, 0]}>
        <boxGeometry args={[3.8, 0.03, 1.76]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.32} roughness={0.1} />
      </mesh>
      {/* Visera frontal inclinada */}
      <mesh position={[0, 2.38, 1.15]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[3.94, 0.04, 0.58]} />
        <meshStandardMaterial color="#1d2127" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Tira LED cálida superior */}
      <mesh position={[0, 2.5, 0.82]}>
        <boxGeometry args={[3.7, 0.03, 0.04]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fde68a" emissiveIntensity={1.8} />
      </mesh>

      {/* Cartel colgante "BOOKS & NEWS" */}
      <mesh position={[1.05, 2.15, 0.88]} castShadow>
        <boxGeometry args={[1.18, 0.3, 0.05]} />
        <meshStandardMaterial map={signTex} roughness={0.4} />
      </mesh>

      {/* Exhibidor escalonado de revistas y libros (mitad izquierda) */}
      <group position={[-0.95, 1.25, 0.65]} rotation={[-0.24, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.65, 0.92, 0.36]} />
          <meshStandardMaterial map={oakTex} roughness={0.65} />
        </mesh>
        {[0.28, 0.0, -0.28].map((ry, rowIdx) =>
          [-0.64, -0.32, 0, 0.32, 0.64].map((rx, colIdx) => (
            <mesh key={`bk-${rowIdx}-${colIdx}`} position={[rx, ry, 0.2]}>
              <boxGeometry args={[0.24, 0.22, 0.03]} />
              <meshStandardMaterial
                color={bookColors[(rowIdx * 5 + colIdx) % bookColors.length]}
                roughness={0.45}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Caja registradora / POS sobre la mesada derecha */}
      <group position={[0.45, 1.16, 0.42]}>
        <mesh castShadow>
          <boxGeometry args={[0.36, 0.24, 0.28]} />
          <meshStandardMaterial color="#181b20" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.18, 0.04]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.28, 0.18, 0.03]} />
          <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.45} />
        </mesh>
      </group>

      {/* Pequeña vitrina de vidrio en el extremo derecho */}
      <mesh position={[1.38, 1.32, 0.45]}>
        <boxGeometry args={[0.62, 0.58, 0.52]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.35} roughness={0.12} />
      </mesh>

      {/* Estantería trasera de madera */}
      <mesh position={[0, 1.45, -0.72]} castShadow>
        <boxGeometry args={[3.65, 0.9, 0.25]} />
        <meshStandardMaterial map={oakTex} roughness={0.68} />
      </mesh>

      <pointLight position={[0, 2.15, 0.2]} intensity={2.2} distance={8} color="#fde68a" />
    </group>
  );
}

/**
 * 04_molinetes_cestos_mapa_3d.jpg
 * Conjunto de 3 molinetes con tope de madera, cestos de reciclaje y tótem mapa con macetero.
 */
export function TurnstileGateSet({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const mapTex = useMemo(() => getTransitMapTexture(), []);

  return (
    <group position={position} rotation={rotation}>
      {/* 3 Molinetes paralelos */}
      {[-1.55, -0.75, 0.05].map((gx, i) => (
        <group key={`gate-${i}`} position={[gx, 0, 0]}>
          {/* Cuerpo oscuro */}
          <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.18, 1.0, 1.35]} />
            <meshStandardMaterial color="#1d2127" metalness={0.55} roughness={0.4} />
          </mesh>
          {/* Tapa superior de madera cálida */}
          <mesh position={[0, 1.02, 0]} castShadow>
            <boxGeometry args={[0.19, 0.06, 1.37]} />
            <meshStandardMaterial map={oakTex} roughness={0.6} />
          </mesh>
          {/* Lector de tarjeta luminoso */}
          <mesh position={[0, 1.055, 0.52]}>
            <boxGeometry args={[0.11, 0.015, 0.14]} />
            <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}

      {/* Puertas de vidrio entre los molinetes */}
      {[-1.15, -0.35].map((wx, i) => (
        <mesh key={`wing-${i}`} position={[wx, 0.56, 0.08]}>
          <boxGeometry args={[0.56, 0.56, 0.03]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.42} roughness={0.1} />
        </mesh>
      ))}

      {/* Estación de 3 cestos de reciclaje con listones de madera */}
      <group position={[0.92, 0, 0.15]}>
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.96, 0.88, 0.52]} />
          <meshStandardMaterial color="#1d2127" roughness={0.55} />
        </mesh>
        {[-0.4, -0.28, -0.16, -0.04, 0.08, 0.2, 0.32, 0.42].map((sx, idx) => (
          <mesh key={`rslat-${idx}`} position={[sx, 0.42, 0.27]} castShadow>
            <boxGeometry args={[0.05, 0.78, 0.02]} />
            <meshStandardMaterial map={oakTex} roughness={0.62} />
          </mesh>
        ))}
        {/* 3 bocas de colores */}
        {['#3b82f6', '#eab308', '#22c55e'].map((bc, idx) => (
          <mesh key={`bin-${idx}`} position={[-0.28 + idx * 0.28, 0.89, 0]}>
            <boxGeometry args={[0.2, 0.02, 0.28]} />
            <meshStandardMaterial color={bc} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Tótem Mapa con macetero verde */}
      <group position={[2.05, 0, 0.15]}>
        {/* Macetero oscuro */}
        <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.52, 0.48]} />
          <meshStandardMaterial color="#1d2127" roughness={0.5} />
        </mesh>
        {/* Plantas del macetero */}
        {[-0.32, 0, 0.32].map((px, i) => (
          <mesh key={`tplant-${i}`} position={[px, 0.58, 0.02]}>
            <dodecahedronGeometry args={[0.19, 0]} />
            <meshStandardMaterial color={i === 1 ? '#2f6b3c' : '#3f854d'} roughness={0.85} />
          </mesh>
        ))}
        {/* Postes del tótem */}
        {[-0.48, 0.48].map((px) => (
          <mesh key={`tpost-${px}`} position={[px, 1.15, -0.16]} castShadow>
            <boxGeometry args={[0.07, 2.2, 0.08]} />
            <meshStandardMaterial color="#1d2127" metalness={0.65} roughness={0.38} />
          </mesh>
        ))}
        {/* Faja de listones de madera bajo el mapa */}
        <mesh position={[0, 0.82, -0.16]} castShadow>
          <boxGeometry args={[0.92, 0.24, 0.06]} />
          <meshStandardMaterial map={oakTex} roughness={0.62} />
        </mesh>
        {/* Panel del mapa iluminado */}
        <mesh position={[0, 1.56, -0.16]} castShadow>
          <boxGeometry args={[0.92, 1.2, 0.07]} />
          <meshStandardMaterial color="#1d2127" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.56, -0.12]}>
          <planeGeometry args={[0.84, 1.12]} />
          <meshStandardMaterial
            map={mapTex}
            emissive="#f8fafc"
            emissiveMap={mapTex}
            emissiveIntensity={0.4}
            roughness={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}
