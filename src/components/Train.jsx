import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore.js';

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
 * Modelo 3D del Tren Sarmiento (Trenes Argentinos) animado en useFrame.
 */
export default function Train() {
  const groupRef = useRef(null);
  const wheelRefs = useRef([]);
  const phase = useGameStore((s) => s.phase);
  const upgrades = useGameStore((s) => s.upgrades);
  const onTrainArrived = useGameStore((s) => s.onTrainArrived);
  const onTrainDeparted = useGameStore((s) => s.onTrainDeparted);

  const isExpress = upgrades.includes('express_train');
  const arrivalTriggeredRef = useRef(false);
  const departureTriggeredRef = useRef(false);

  const chevronTex = useMemo(() => createChevronTexture(), []);
  const logoTex = useMemo(
    () => createTextTexture('Trenes Argentinos', '#f8fafc', '#0284c7', 256, 48, 'bold 26px sans-serif'),
    []
  );
  const ledTex = useMemo(
    () => createTextTexture('SARMIENTO  •  M23', '#0f172a', '#7dd3fc', 256, 44, 'bold 20px monospace'),
    []
  );

  useEffect(() => {
    return () => {
      chevronTex.dispose();
      logoTex.dispose();
      ledTex.dispose();
    };
  }, [chevronTex, logoTex, ledTex]);

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

  const primaryBlue = isExpress ? '#0284c7' : '#1fa3e8';
  const stripeColor = isExpress ? '#fef08a' : '#f8fafc';

  return (
    <group ref={groupRef} position={[0, 0.25, ENTRY_Z]}>
      {/* Coche Cabina Delantero (M4 / M23) */}
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
        <Bogie z={3.6} wheelRefs={wheelRefs} wheelStartIdx={0} />
        <Bogie z={-3.6} wheelRefs={wheelRefs} wheelStartIdx={2} />
      </group>

      {/* Fuelle negro de interconexión entre coches */}
      <mesh position={[0, 1.48, -5.85]} castShadow>
        <boxGeometry args={[1.45, 1.65, 0.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} />
      </mesh>

      {/* Segundo Coche de Pasajeros */}
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
        <Bogie z={3.6} wheelRefs={wheelRefs} wheelStartIdx={4} />
        <Bogie z={-3.6} wheelRefs={wheelRefs} wheelStartIdx={6} />
        {/* Fuelle trasero */}
        <mesh position={[0, 1.48, -5.75]} castShadow>
          <boxGeometry args={[1.45, 1.65, 0.35]} />
          <meshStandardMaterial color="#0f172a" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}
