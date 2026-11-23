import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore.js';
import {
  createCorrugatedRoofTexture,
  createDieselFrontChevronTexture,
  createDieselLocoSideTexture,
  createDoubleDeckerSideTexture,
  createFlutedCoachTexture,
  createSuburbanSideTexture,
} from './trainTextures.js';

const ENTRY_Z = -65;
const STOP_Z = 0;
const EXIT_Z = 65;

function createChevronTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#dc2626';
  const stripeW = 24;
  // Chevrons apuntando al centro
  for (let x = -64; x < 128; x += stripeW * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 64);
    ctx.lineTo(x + stripeW, 64);
    ctx.lineTo(x + stripeW + 48, 0);
    ctx.lineTo(x + 48, 0);
    ctx.closePath();
    ctx.fill();
  }
  for (let x = 128; x < 320; x += stripeW * 2) {
    ctx.beginPath();
    ctx.moveTo(x, 64);
    ctx.lineTo(x + stripeW, 64);
    ctx.lineTo(x + stripeW - 48, 0);
    ctx.lineTo(x - 48, 0);
    ctx.closePath();
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createTextTexture(text, bg, fg, width = 256, height = 64, font = 'bold 28px sans-serif') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = fg;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Bogie({ z, wheelRefs, wheelStartIdx }) {
  return (
    <group position={[0, 0.34, z]}>
      {/* Bastidor lateral del bogie */}
      <mesh position={[-1.08, 0.08, 0]} castShadow>
        <boxGeometry args={[0.16, 0.28, 2.2]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[1.08, 0.08, 0]} castShadow>
        <boxGeometry args={[0.16, 0.28, 2.2]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[2.0, 0.2, 0.9]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Dos ejes con ruedas */}
      {[-0.75, 0.75].map((wz, i) => (
        <mesh
          key={i}
          ref={(el) => {
            wheelRefs.current[wheelStartIdx + i] = el;
          }}
          position={[0, -0.02, wz]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.32, 0.32, 2.35, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.75} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function PassengerCarBody({
  length,
  primaryBlue,
  stripeColor,
  isCabCar,
  chevronTex,
  logoTex,
  ledTex,
}) {
  const doorZs = isCabCar ? [-3.4, -0.2, 2.9] : [-3.4, 0, 3.4];
  const windowZs = isCabCar ? [-4.7, -1.8, 1.35] : [-4.7, -1.7, 1.7, 4.7];

  return (
    <group>
      {/* Falda / Chasis inferior azul oscuro */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.46, 0.42, length]} />
        <meshStandardMaterial color="#0f1b2d" roughness={0.55} metalness={0.25} />
      </mesh>

      {/* Cajas de equipamiento bajo bastidor */}
      {[-1.5, 0.3, 1.8].map((bz, idx) => (
        <mesh key={idx} position={[0, 0.45, bz]} castShadow>
          <boxGeometry args={[1.85, 0.34, 1.1]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
      ))}

      {/* Cuerpo principal celeste Trenes Argentinos */}
      <mesh position={[0, 1.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.42, 1.52, length]} />
        <meshStandardMaterial color={primaryBlue} roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Franja blanca inferior + 2 líneas blancas características */}
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[2.44, 0.24, length + 0.01]} />
        <meshStandardMaterial color={stripeColor} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.24, 0]}>
        <boxGeometry args={[2.44, 0.07, length + 0.01]} />
        <meshStandardMaterial color={stripeColor} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <boxGeometry args={[2.44, 0.07, length + 0.01]} />
        <meshStandardMaterial color={stripeColor} roughness={0.35} />
      </mesh>

      {/* Banda negra continua de ventanas */}
      <mesh position={[0, 1.84, isCabCar ? -0.35 : 0]}>
        <boxGeometry args={[2.44, 0.74, isCabCar ? length - 1.1 : length - 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.25} metalness={0.2} />
      </mesh>

      {/* Ventanas laterales */}
      {windowZs.map((wz, idx) => (
        <mesh key={idx} position={[0, 1.84, wz]}>
          <boxGeometry args={[2.46, 0.5, 1.15]} />
          <meshStandardMaterial
            color="#334155"
            emissive="#1e293b"
            emissiveIntensity={0.25}
            roughness={0.12}
            metalness={0.4}
          />
        </mesh>
      ))}

      {/* Puertas dobles celestes + estribos amarillos */}
      {doorZs.map((dz, idx) => (
        <group key={idx} position={[0, 1.58, dz]}>
          {/* Marco de puerta doble */}
          <mesh>
            <boxGeometry args={[2.47, 1.44, 1.18]} />
            <meshStandardMaterial color={primaryBlue} roughness={0.3} />
          </mesh>
          {/* División central */}
          <mesh>
            <boxGeometry args={[2.49, 1.44, 0.04]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Ventanillas de puerta */}
          <mesh position={[0, 0.26, -0.28]}>
            <boxGeometry args={[2.49, 0.56, 0.34]} />
            <meshStandardMaterial color="#1e293b" roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.26, 0.28]}>
            <boxGeometry args={[2.49, 0.56, 0.34]} />
            <meshStandardMaterial color="#1e293b" roughness={0.15} />
          </mesh>
          {/* Estribo amarillo */}
          <mesh position={[0, -0.7, 0]}>
            <boxGeometry args={[2.52, 0.07, 1.22]} />
            <meshStandardMaterial color="#facc15" roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Techo gris claro + unidad de aire acondicionado */}
      <mesh position={[0, 2.48, 0]} castShadow>
        <boxGeometry args={[2.28, 0.14, length - 0.1]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.45} />
      </mesh>
      <mesh position={[0, 2.66, -0.4]} castShadow>
        <boxGeometry args={[1.45, 0.24, 4.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.7, -0.4]}>
        <boxGeometry args={[1.49, 0.12, 3.6]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Detalles exclusivos del coche cabina */}
      {isCabCar && (
        <group position={[0, 0, length / 2]}>
          {/* Frente ligeramente inclinado */}
          <group rotation={[-0.08, 0, 0]}>
            {/* Marco blanco lateral del frente */}
            <mesh position={[0, 1.56, 0.08]} castShadow>
              <boxGeometry args={[2.44, 1.72, 0.22]} />
              <meshStandardMaterial color={stripeColor} roughness={0.3} />
            </mesh>
            {/* Máscara celeste superior del parabrisas */}
            <mesh position={[0, 1.78, 0.16]}>
              <boxGeometry args={[2.1, 1.22, 0.16]} />
              <meshStandardMaterial color={primaryBlue} roughness={0.3} />
            </mesh>
            {/* Parabrisas frontal */}
            <mesh position={[0, 1.8, 0.23]}>
              <boxGeometry args={[1.76, 0.84, 0.06]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#1e293b"
                emissiveIntensity={0.25}
                roughness={0.08}
                metalness={0.5}
              />
            </mesh>
            {/* Limpiaparabrisas */}
            <mesh position={[0.15, 1.62, 0.27]} rotation={[0, 0, -0.55]}>
              <boxGeometry args={[0.04, 0.62, 0.02]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            {/* Cartel LED superior M23 */}
            <mesh position={[0, 2.3, 0.23]}>
              <planeGeometry args={[1.15, 0.18]} />
              <meshBasicMaterial map={ledTex} />
            </mesh>
            {/* Logo frontal Trenes Argentinos */}
            <mesh position={[0, 1.06, 0.2]}>
              <planeGeometry args={[1.35, 0.22]} />
              <meshBasicMaterial map={logoTex} />
            </mesh>
            {/* Faros delanteros izquierdo y derecho */}
            {[-0.84, 0.84].map((hx, idx) => (
              <group key={idx} position={[hx, 1.15, 0.2]}>
                <mesh>
                  <boxGeometry args={[0.26, 0.44, 0.06]} />
                  <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.2} />
                </mesh>
                <mesh position={[0, -0.06, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.03, 14]} />
                  <meshStandardMaterial
                    color="#fef08a"
                    emissive="#fde047"
                    emissiveIntensity={2.2}
                  />
                </mesh>
              </group>
            ))}
          </group>

          {/* Paragolpes inferior azul oscuro + acople amarillo */}
          <mesh position={[0, 0.72, 0.18]} castShadow>
            <boxGeometry args={[2.46, 0.42, 0.34]} />
            <meshStandardMaterial color="#0f1b2d" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.68, 0.44]} castShadow>
            <boxGeometry args={[0.42, 0.28, 0.32]} />
            <meshStandardMaterial color="#facc15" roughness={0.35} metalness={0.2} />
          </mesh>

          {/* Barredor / Quitapiedras rojo y blanco */}
          <mesh position={[0, 0.36, 0.26]} castShadow>
            <boxGeometry args={[2.18, 0.26, 0.14]} />
            <meshStandardMaterial map={chevronTex} roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
}

/**
 * 01_tren_dos_pisos_3d.jpg - Coche Doble Piso TBA (blanco y celeste con textura realista).
 */
function DoubleDeckerCar({ isCabCar, wheelRefs, wheelStartIdx, sideTex, roofTex }) {
  return (
    <group>
      <Bogie z={3.8} wheelRefs={wheelRefs} wheelStartIdx={wheelStartIdx} />
      <Bogie z={-3.8} wheelRefs={wheelRefs} wheelStartIdx={wheelStartIdx + 2} />

      {/* Chasis oscuro */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[2.46, 0.3, 11.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.55} />
      </mesh>

      {/* Cuerpo principal con textura TBA en Z */}
      <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.44, 1.9, 11.2]} />
        <meshStandardMaterial map={sideTex} roughness={0.32} metalness={0.18} />
      </mesh>

      {/* Ventanas piso superior e inferior (5 por lado) con marco */}
      {[-2.2, -1.1, 0, 1.1, 2.2].map((wz, i) => (
        <group key={`ddw-${i}`}>
          <mesh position={[0, 2.26, wz]}>
            <boxGeometry args={[2.47, 0.42, 0.85]} />
            <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.55} />
          </mesh>
          <mesh position={[0, 1.24, wz]}>
            <boxGeometry args={[2.47, 0.44, 0.85]} />
            <meshStandardMaterial color="#1e293b" roughness={0.1} metalness={0.55} />
          </mesh>
        </group>
      ))}

      {/* Vestíbulos extremos con puertas dobles y ventanillas */}
      {[-4.2, 4.2].map((dz, i) => (
        <group key={`ddd-${i}`} position={[0, 1.56, dz]}>
          <mesh>
            <boxGeometry args={[2.47, 1.4, 1.05]} />
            <meshStandardMaterial color="#0284c7" roughness={0.32} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[2.49, 1.4, 0.04]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {[-0.24, 0.24].map((oz) => (
            <mesh key={oz} position={[0, 0.26, oz]}>
              <boxGeometry args={[2.49, 0.48, 0.32]} />
              <meshStandardMaterial color="#0f172a" roughness={0.12} metalness={0.45} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Techo blanco acanalado con unidades AC */}
      <mesh position={[0, 2.75, 0]} castShadow>
        <boxGeometry args={[2.3, 0.16, 11.0]} />
        <meshStandardMaterial map={roofTex} roughness={0.45} />
      </mesh>
      {[-3.4, 3.4].map((az, i) => (
        <group key={`ddac-${i}`} position={[0, 2.88, az]}>
          <mesh castShadow>
            <boxGeometry args={[1.15, 0.14, 1.45]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.45} metalness={0.25} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.03, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Frente de cabina si es coche delantero */}
      {isCabCar && (
        <group position={[0, 0, 5.62]}>
          <mesh position={[0, 1.75, 0.08]} castShadow>
            <boxGeometry args={[2.44, 1.85, 0.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.85, 0.19]}>
            <boxGeometry args={[1.8, 0.72, 0.05]} />
            <meshStandardMaterial color="#0f172a" roughness={0.08} metalness={0.55} />
          </mesh>
          {[-0.82, 0.82].map((hx) => (
            <mesh key={hx} position={[hx, 1.02, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.04, 12]} />
              <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={2.2} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

/**
 * 02_tren_electrico_suburbano_3d.jpg - Tren Eléctrico Suburbano plateado con textura metálica y pantógrafo.
 */
function SuburbanElectricCar({ isCabCar, wheelRefs, wheelStartIdx, sideTex, roofTex }) {
  return (
    <group>
      <Bogie z={3.6} wheelRefs={wheelRefs} wheelStartIdx={wheelStartIdx} />
      <Bogie z={-3.6} wheelRefs={wheelRefs} wheelStartIdx={wheelStartIdx + 2} />

      {/* Bastidor inferior */}
      <mesh position={[0, 0.68, 0]} castShadow>
        <boxGeometry args={[2.42, 0.38, 11.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Carrocería plateada con textura de paneles metálicos */}
      <mesh position={[0, 1.66, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.56, 11.0]} />
        <meshStandardMaterial map={sideTex} metalness={0.52} roughness={0.28} />
      </mesh>

      {/* Ventanas oscuras empotradas con reflejo */}
      {[-1.5, 0, 1.5].map((wz, i) => (
        <mesh key={`sew-${i}`} position={[0, 1.8, wz]}>
          <boxGeometry args={[2.43, 0.62, 1.12]} />
          <meshStandardMaterial color="#0f172a" roughness={0.08} metalness={0.6} />
        </mesh>
      ))}

      {/* Puertas dobles plateadas con junta central y ventanas */}
      {[-3.1, 3.1].map((dz, i) => (
        <group key={`sed-${i}`} position={[0, 1.58, dz]}>
          <mesh>
            <boxGeometry args={[2.44, 1.42, 1.25]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.48} roughness={0.26} />
          </mesh>
          <mesh>
            <boxGeometry args={[2.46, 1.42, 0.04]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {[-0.28, 0.28].map((oz) => (
            <mesh key={oz} position={[0, 0.24, oz]}>
              <boxGeometry args={[2.46, 0.56, 0.34]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.55} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Techo metálico acanalado, unidades AC y Pantógrafo */}
      <mesh position={[0, 2.46, 0]} castShadow>
        <boxGeometry args={[2.26, 0.1, 10.8]} />
        <meshStandardMaterial map={roofTex} metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.6, 0.6]} castShadow>
        <boxGeometry args={[1.35, 0.22, 2.8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.45} metalness={0.35} />
      </mesh>
      {!isCabCar && (
        <group position={[0, 2.55, -2.6]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.9, 0.08, 0.9]} />
            <meshStandardMaterial color="#334155" metalness={0.7} />
          </mesh>
          <mesh position={[0, 0.36, -0.25]} rotation={[0.55, 0, 0]}>
            <boxGeometry args={[0.06, 0.85, 0.06]} />
            <meshStandardMaterial color="#1e293b" metalness={0.75} />
          </mesh>
          <mesh position={[0, 0.76, 0.05]}>
            <boxGeometry args={[1.1, 0.05, 0.18]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* Nariz aerodinámica del coche cabina */}
      {isCabCar && (
        <group position={[0, 0.7, 5.5]}>
          <mesh position={[0, 0.88, 0.55]} rotation={[-0.28, 0, 0]} castShadow>
            <boxGeometry args={[2.34, 1.55, 1.35]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.26} />
          </mesh>
          <mesh position={[0, 1.05, 1.05]} rotation={[-0.28, 0, 0]}>
            <boxGeometry args={[1.85, 0.82, 0.4]} />
            <meshStandardMaterial color="#0f172a" roughness={0.08} metalness={0.6} />
          </mesh>
          {[-0.78, 0.78].map((hx) => (
            <mesh key={hx} position={[hx, 0.52, 1.24]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.05, 12]} />
              <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={2.3} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

/**
 * 03_locomotora_diesel_electrica_3d.jpg + 04_coche_pasajeros_generico_3d.jpg
 */
function DieselLocomotiveUnit({ wheelRefs, sideTex, frontTex }) {
  return (
    <group>
      <Bogie z={3.6} wheelRefs={wheelRefs} wheelStartIdx={0} />
      <Bogie z={-3.6} wheelRefs={wheelRefs} wheelStartIdx={2} />

      {/* Bastidor pesado + tanque de combustible */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[2.52, 0.34, 11.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.65} metalness={0.35} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[1.7, 0.38, 3.8]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Barandas laterales de seguridad */}
      {[-1.18, 1.18].map((rx) => (
        <group key={`rail-${rx}`}>
          <mesh position={[rx, 1.28, -0.5]}>
            <boxGeometry args={[0.03, 0.03, 9.6]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.65} roughness={0.35} />
          </mesh>
          {[-4.8, -3.2, -1.6, 0, 1.6, 3.2].map((rz) => (
            <mesh key={rz} position={[rx, 1.06, rz]}>
              <boxGeometry args={[0.03, 0.44, 0.03]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.65} roughness={0.35} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Cuerpo largo gris carbón con puertas, rejillas y franja naranja */}
      <mesh position={[0, 1.65, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 1.56, 8.6]} />
        <meshStandardMaterial map={sideTex} roughness={0.5} metalness={0.35} />
      </mesh>

      {/* Cabina delantera elevada con frente en V naranja */}
      <mesh position={[0, 1.75, 4.1]} castShadow receiveShadow>
        <boxGeometry args={[2.38, 1.72, 2.1]} />
        <meshStandardMaterial map={frontTex} roughness={0.48} metalness={0.35} />
      </mesh>

      {/* Parabrisas dobles y viseras de la locomotora */}
      {[-0.56, 0.56].map((wx) => (
        <mesh key={wx} position={[wx, 2.1, 5.17]}>
          <boxGeometry args={[0.78, 0.46, 0.05]} />
          <meshStandardMaterial color="#0f172a" roughness={0.08} metalness={0.6} />
        </mesh>
      ))}
      {/* Quitapiedras frontal */}
      <mesh position={[0, 0.42, 5.65]} castShadow>
        <boxGeometry args={[2.3, 0.34, 0.35]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Faros frontales */}
      <mesh position={[0, 1.65, 5.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.04, 12]} />
        <meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={2.4} />
      </mesh>

      {/* Ventiladores superiores */}
      {[-3.6, -2.1, -0.6].map((fz, i) => (
        <mesh key={`fan-${i}`} position={[0, 2.48, fz]}>
          <cylinderGeometry args={[0.52, 0.52, 0.1, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function GenericSilverCoach({ wheelRefs, wheelStartIdx, sideTex, roofTex }) {
  return (
    <group>
      <Bogie z={3.6} wheelRefs={wheelRefs} wheelStartIdx={wheelStartIdx} />
      <Bogie z={-3.6} wheelRefs={wheelRefs} wheelStartIdx={wheelStartIdx + 2} />

      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[2.42, 0.36, 11.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.68, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.54, 11.2]} />
        <meshStandardMaterial map={sideTex} metalness={0.52} roughness={0.28} />
      </mesh>
      {[-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6].map((wz, i) => (
        <mesh key={`gwin-${i}`} position={[0, 1.8, wz]}>
          <boxGeometry args={[2.44, 0.44, 0.82]} />
          <meshStandardMaterial color="#0f172a" roughness={0.08} metalness={0.55} />
        </mesh>
      ))}
      <mesh position={[0, 2.48, 0]} castShadow>
        <boxGeometry args={[2.28, 0.12, 11.0]} />
        <meshStandardMaterial map={roofTex} metalness={0.45} roughness={0.35} />
      </mesh>
      {[-3.2, 3.2].map((az, i) => (
        <mesh key={`gac-${i}`} position={[0, 2.6, az]} castShadow>
          <boxGeometry args={[1.3, 0.2, 1.8]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.45} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Formación 3D reutilizable según el modelo de tren seleccionado.
 */
export function TrainFormation({ selectedTrain = 'sarmiento', isExpress = false, wheelRefs }) {
  const localWheelRefs = useRef([]);
  const activeWheelRefs = wheelRefs || localWheelRefs;

  const chevronTex = useMemo(() => createChevronTexture(), []);
  const logoTex = useMemo(
    () => createTextTexture('Trenes Argentinos', '#f8fafc', '#0284c7', 256, 48, 'bold 26px sans-serif'),
    []
  );
  const ledTex = useMemo(
    () => createTextTexture('SARMIENTO  •  M23', '#0f172a', '#7dd3fc', 256, 44, 'bold 20px monospace'),
    []
  );
  const doubleDeckerSideTex = useMemo(() => createDoubleDeckerSideTexture(), []);
  const corrugatedWhiteRoofTex = useMemo(() => createCorrugatedRoofTexture('#f8fafc', '#cbd5e1'), []);
  const corrugatedSilverRoofTex = useMemo(() => createCorrugatedRoofTexture('#cbd5e1', '#94a3b8'), []);
  const suburbanSideTex = useMemo(() => createSuburbanSideTexture(), []);
  const dieselSideTex = useMemo(() => createDieselLocoSideTexture(), []);
  const dieselFrontTex = useMemo(() => createDieselFrontChevronTexture(), []);
  const flutedCoachTex = useMemo(() => createFlutedCoachTexture(), []);

  useEffect(() => {
    return () => {
      chevronTex.dispose();
      logoTex.dispose();
      ledTex.dispose();
      doubleDeckerSideTex.dispose();
      corrugatedWhiteRoofTex.dispose();
      corrugatedSilverRoofTex.dispose();
      suburbanSideTex.dispose();
      dieselSideTex.dispose();
      dieselFrontTex.dispose();
      flutedCoachTex.dispose();
    };
  }, [
    chevronTex,
    logoTex,
    ledTex,
    doubleDeckerSideTex,
    corrugatedWhiteRoofTex,
    corrugatedSilverRoofTex,
    suburbanSideTex,
    dieselSideTex,
    dieselFrontTex,
    flutedCoachTex,
  ]);

  const primaryBlue = isExpress ? '#0284c7' : '#1fa3e8';
  const stripeColor = isExpress ? '#fef08a' : '#f8fafc';

  if (selectedTrain === 'double_decker') {
    return (
      <>
        <DoubleDeckerCar
          isCabCar={true}
          wheelRefs={activeWheelRefs}
          wheelStartIdx={0}
          sideTex={doubleDeckerSideTex}
          roofTex={corrugatedWhiteRoofTex}
        />
        <mesh position={[0, 1.55, -5.85]} castShadow>
          <boxGeometry args={[1.45, 1.7, 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
        <group position={[0, 0, -11.7]}>
          <DoubleDeckerCar
            isCabCar={false}
            wheelRefs={activeWheelRefs}
            wheelStartIdx={4}
            sideTex={doubleDeckerSideTex}
            roofTex={corrugatedWhiteRoofTex}
          />
        </group>
      </>
    );
  }

  if (selectedTrain === 'suburban_electric') {
    return (
      <>
        <SuburbanElectricCar
          isCabCar={true}
          wheelRefs={activeWheelRefs}
          wheelStartIdx={0}
          sideTex={suburbanSideTex}
          roofTex={corrugatedSilverRoofTex}
        />
        <mesh position={[0, 1.48, -5.85]} castShadow>
          <boxGeometry args={[1.45, 1.65, 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
        <group position={[0, 0, -11.7]}>
          <SuburbanElectricCar
            isCabCar={false}
            wheelRefs={activeWheelRefs}
            wheelStartIdx={4}
            sideTex={suburbanSideTex}
            roofTex={corrugatedSilverRoofTex}
          />
        </group>
      </>
    );
  }

  if (selectedTrain === 'diesel_express') {
    return (
      <>
        <DieselLocomotiveUnit
          wheelRefs={activeWheelRefs}
          sideTex={dieselSideTex}
          frontTex={dieselFrontTex}
        />
        <mesh position={[0, 1.35, -5.85]} castShadow>
          <boxGeometry args={[1.4, 1.5, 0.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
        <group position={[0, 0, -11.7]}>
          <GenericSilverCoach
            wheelRefs={activeWheelRefs}
            wheelStartIdx={4}
            sideTex={flutedCoachTex}
            roofTex={corrugatedSilverRoofTex}
          />
        </group>
      </>
    );
  }

  return (
    <>
      <group position={[0, 0, 0]}>
        <PassengerCarBody
          length={11.2}
          primaryBlue={primaryBlue}
          stripeColor={stripeColor}
          isCabCar={true}
          chevronTex={chevronTex}
          logoTex={logoTex}
          ledTex={ledTex}
        />
        <Bogie z={3.6} wheelRefs={activeWheelRefs} wheelStartIdx={0} />
        <Bogie z={-3.6} wheelRefs={activeWheelRefs} wheelStartIdx={2} />
      </group>

      <mesh position={[0, 1.48, -5.85]} castShadow>
        <boxGeometry args={[1.45, 1.65, 0.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} />
      </mesh>

      <group position={[0, 0, -11.7]}>
        <PassengerCarBody
          length={11.2}
          primaryBlue={primaryBlue}
          stripeColor={stripeColor}
          isCabCar={false}
          chevronTex={chevronTex}
          logoTex={logoTex}
          ledTex={ledTex}
        />
        <Bogie z={3.6} wheelRefs={activeWheelRefs} wheelStartIdx={4} />
        <Bogie z={-3.6} wheelRefs={activeWheelRefs} wheelStartIdx={6} />
        <mesh position={[0, 1.48, -5.75]} castShadow>
          <boxGeometry args={[1.45, 1.65, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
      </group>
    </>
  );
}

/**
 * Modelo 3D del Tren activo (Sarmiento, Dos Pisos, Eléctrico Suburbano o Locomotora Diésel) animado en useFrame.
 */
export default function Train() {
  const groupRef = useRef(null);
  const wheelRefs = useRef([]);
  const phase = useGameStore((s) => s.phase);
  const upgrades = useGameStore((s) => s.upgrades);
  const selectedTrain = useGameStore((s) => s.selectedTrain);
  const onTrainArrived = useGameStore((s) => s.onTrainArrived);
  const onTrainDeparted = useGameStore((s) => s.onTrainDeparted);

  const isExpress = upgrades.includes('express_train');
  const arrivalTriggeredRef = useRef(false);
  const departureTriggeredRef = useRef(false);

  useFrame((_state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);
    let speed = 0;

    if (phase === 'WAITING') {
      group.position.z = ENTRY_Z;
      arrivalTriggeredRef.current = false;
      departureTriggeredRef.current = false;
    } else if (phase === 'ARRIVING') {
      const prevZ = group.position.z;
      const lerpFactor = 1 - Math.exp(-(isExpress ? 2.4 : 1.7) * dt);
      group.position.z = THREE.MathUtils.lerp(prevZ, STOP_Z, lerpFactor);
      speed = Math.abs(group.position.z - prevZ) / Math.max(dt, 0.001);

      if (Math.abs(group.position.z - STOP_Z) < 0.22 && !arrivalTriggeredRef.current) {
        group.position.z = STOP_Z;
        arrivalTriggeredRef.current = true;
        onTrainArrived();
      }
    } else if (phase === 'TRIVIA' || phase === 'RESULT') {
      group.position.z = STOP_Z;
    } else if (phase === 'DEPARTING') {
      const prevZ = group.position.z;
      const accel = isExpress ? 22 : 16;
      const progress = Math.max(0.15, (group.position.z + 2) / 25);
      group.position.z += accel * progress * dt;
      speed = Math.abs(group.position.z - prevZ) / Math.max(dt, 0.001);

      if (group.position.z >= EXIT_Z && !departureTriggeredRef.current) {
        departureTriggeredRef.current = true;
        onTrainDeparted();
      }
    }

    if (speed > 0.05) {
      for (const wheel of wheelRefs.current) {
        if (wheel) wheel.rotation.x += speed * dt * 0.9;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.25, ENTRY_Z]}>
      <TrainFormation
        selectedTrain={selectedTrain}
        isExpress={isExpress}
        wheelRefs={wheelRefs}
      />
    </group>
  );
}
