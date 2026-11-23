import { useMemo } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import {
  getBallastTexture,
  getBrickTexture,
  getConcreteSlabTexture,
  getTactileStripTexture,
} from './textures.js';
import {
  HangingStationClock,
  SuspendedLinearLamp,
  WallBracketLantern,
} from './StationFurniture.jsx';

const ARCH_CENTERS = [-7, 0, 7];
const COLUMN_ZS = [-10.5, -3.5, 3.5, 10.5];

function CastIronColumn({ position }) {
  return (
    <group position={position}>
      {/* Base escalonada de fundición */}
      <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.28, 12]} />
        <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.18, 12]} />
        <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
      </mesh>
      {/* Fuste principal */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.13, 3.2, 12]} />
        <meshStandardMaterial color="#2d3238" metalness={0.65} roughness={0.38} />
      </mesh>
      {/* Anillo decorativo */}
      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
        <meshStandardMaterial color="#272b30" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Capitel superior */}
      <mesh position={[0, 3.58, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.12, 0.24, 12]} />
        <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
      </mesh>
      {/* Ménsulas curvas hacia el techo */}
      <mesh position={[0, 3.45, -0.35]} rotation={[0.55, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.55, 0.08]} />
        <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.45, 0.35]} rotation={[-0.55, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.55, 0.08]} />
        <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
      </mesh>
    </group>
  );
}

function TrashBin({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.76, 0.36]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.75} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.38, 0.05, 0.38]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.185, 0.62, 0]}>
        <boxGeometry args={[0.02, 0.12, 0.24]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function BrickArchBay({ zCenter, brickTex }) {
  const archSegments = useMemo(() => {
    const segs = [];
    const count = 11;
    const radius = 2.15;
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const angle = Math.PI * t; // 0 to PI
      const z = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      segs.push({ z, y, rotX: angle - Math.PI / 2, isKeystone: i === 5 });
    }
    return segs;
  }, []);

  return (
    <group position={[9.4, 0.9, zCenter]}>
      {/* Paso abierto hacia el exterior (sin muro trasero en andén y zona de molinetes) */}
      <pointLight position={[0.9, 3.6, 0]} intensity={2.6} distance={9} color="#fde68a" />
      {/* Dintel superior del arco */}
      <mesh position={[0.95, 4.55, 0]}>
        <boxGeometry args={[1.9, 0.2, 5.2]} />
        <meshStandardMaterial color="#4b4139" roughness={0.88} />
      </mesh>

      {/* Enjutas de ladrillo sobre el arco */}
      <mesh position={[0.15, 4.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.85, 5.2]} />
        <meshStandardMaterial map={brickTex} roughness={0.88} />
      </mesh>

      {/* Dovela / anillo del arco */}
      <group position={[0.05, 2.15, 0]}>
        {archSegments.map((seg, idx) => (
          <mesh
            key={idx}
            position={[seg.isKeystone ? -0.04 : 0, seg.y, seg.z]}
            rotation={[seg.rotX, 0, 0]}
            castShadow
          >
            <boxGeometry
              args={[
                seg.isKeystone ? 0.54 : 0.48,
                seg.isKeystone ? 0.52 : 0.42,
                seg.isKeystone ? 0.44 : 0.36,
              ]}
            />
            <meshStandardMaterial
              color={seg.isKeystone ? '#b8ad99' : idx % 2 === 0 ? '#8c4a38' : '#a89c88'}
              roughness={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function RailwaySignal({ position }) {
  const phase = useGameStore((s) => s.phase);
  const isGreen = phase === 'TRIVIA' || phase === 'RESULT';
  const isYellow = phase === 'ARRIVING' || phase === 'DEPARTING';
  const isRed = phase === 'WAITING';

  return (
    <group position={position}>
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 3.7, 10]} />
        <meshStandardMaterial color="#1e2228" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 3.65, 0]} castShadow>
        <boxGeometry args={[0.34, 0.96, 0.24]} />
        <meshStandardMaterial color="#181b20" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Luz Roja / Amarilla / Verde */}
      {[
        { y: 3.92, active: isRed, color: '#ef4444' },
        { y: 3.65, active: isYellow, color: '#facc15' },
        { y: 3.38, active: isGreen, color: '#22c55e' },
      ].map((sig, i) => (
        <mesh key={i} position={[0, sig.y, 0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.04, 14]} />
          <meshStandardMaterial
            color={sig.active ? sig.color : '#1e293b'}
            emissive={sig.active ? sig.color : '#000000'}
            emissiveIntensity={sig.active ? 2.4 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function StationBuildingAndCanopy() {
  const brickTex = useMemo(() => getBrickTexture(), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);
  const tactileTex = useMemo(() => getTactileStripTexture(), []);
  const ballastTex = useMemo(() => getBallastTexture(), []);

  const sleeperPositions = useMemo(() => {
    const arr = [];
    for (let z = -70; z <= 70; z += 1.4) {
      arr.push(z);
    }
    return arr;
  }, []);

  // Forma extruida para la cubierta inclinada del techo de vidrio y acero
  const canopyWidth = 7.4; // x = 2.2 a 9.6
  const canopyLength = 25.0; // z = -12.5 a 12.5
  const eaveY = 4.45;
  const ridgeY = 5.45;
  const halfSpan = canopyWidth / 2;
  const slopeAngle = Math.atan2(ridgeY - eaveY, halfSpan);
  const slopeLen = Math.hypot(halfSpan, ridgeY - eaveY);

  return (
    <group>
      {/* Suelo general */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[140, 180]} />
        <meshStandardMaterial color="#1e293b" roughness={0.95} />
      </mesh>

      {/* Césped lateral */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-22, -0.01, 0]} receiveShadow>
        <planeGeometry args={[36, 180]} />
        <meshStandardMaterial color="#1e3a2f" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[28, -0.01, 0]} receiveShadow>
        <planeGeometry args={[36, 180]} />
        <meshStandardMaterial color="#1e3a2f" roughness={0.95} />
      </mesh>

      {/* Losa base de hormigón bajo la vía (05_via_ferrea_recta_3d.jpg) */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.05, 150]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>

      {/* Balasto de vía con textura de granito partida (05_via_ferrea_recta_3d.jpg) */}
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <boxGeometry args={[3.9, 0.12, 150]} />
        <meshStandardMaterial map={ballastTex} roughness={0.95} />
      </mesh>

      {/* Durmientes alternados de hormigón y madera + fijaciones metálicas */}
      {sleeperPositions.map((z, idx) => (
        <group key={z} position={[0, 0.15, z]}>
          <mesh receiveShadow>
            <boxGeometry args={[2.8, 0.08, 0.32]} />
            <meshStandardMaterial
              color={idx % 3 === 0 ? '#7c5836' : '#cbd5e1'}
              roughness={idx % 3 === 0 ? 0.85 : 0.78}
            />
          </mesh>
          {[-1.0, 1.0].map((fx) => (
            <mesh key={fx} position={[fx, 0.045, 0]}>
              <boxGeometry args={[0.22, 0.02, 0.24]} />
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Rieles metálicos */}
      {[-1.0, 1.0].map((rx) => (
        <mesh key={rx} position={[rx, 0.23, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.11, 0.12, 150]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.25} />
        </mesh>
      ))}

      {/* Postes de catenaria y cable aéreo (06_cambio_via_y_catenaria_3d.jpg) */}
      {[-36, -18, 0, 18, 36].map((cz) => (
        <group key={`cat-${cz}`} position={[-2.45, 0, cz]}>
          <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.24, 0.42]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.85} />
          </mesh>
          <mesh position={[0, 2.65, 0]} castShadow>
            <boxGeometry args={[0.16, 4.9, 0.16]} />
            <meshStandardMaterial color="#1e2228" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Brazo ménsula superior */}
          <mesh position={[1.25, 4.75, 0]}>
            <boxGeometry args={[2.5, 0.06, 0.06]} />
            <meshStandardMaterial color="#1e2228" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Tirante diagonal */}
          <mesh position={[1.15, 4.25, 0]} rotation={[0, 0, 0.42]}>
            <boxGeometry args={[2.4, 0.05, 0.05]} />
            <meshStandardMaterial color="#1e2228" metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
      ))}
      {/* Cable de contacto de catenaria */}
      <mesh position={[0, 4.55, 0]}>
        <boxGeometry args={[0.025, 0.025, 140]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Señal luminosa ferroviaria reactiva a la fase del tren */}
      <RailwaySignal position={[-2.15, 0, 14.5]} />

      {/* Desvío / cambio de vía decorativo (06_cambio_via_y_catenaria_3d.jpg) */}
      <group position={[0, 0, -24]}>
        {[-1.0, 1.0].map((rx, i) => (
          <mesh key={`sw-${i}`} position={[rx - 1.15, 0.23, -3.5]} rotation={[0, -0.24, 0]}>
            <boxGeometry args={[0.1, 0.11, 10]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[-1.95, 0.22, 0]} castShadow>
          <boxGeometry args={[0.32, 0.28, 0.44]} />
          <meshStandardMaterial color="#1e2228" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[-1.95, 0.48, 0]} rotation={[0, 0, 0.35]}>
          <boxGeometry args={[0.05, 0.42, 0.05]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
      </group>

      {/* ANDÉN PRINCIPAL AGRANDADO (06_modulo_anden_3d.jpg) */}
      <mesh position={[5.9, 0.38, -2]} receiveShadow castShadow>
        <boxGeometry args={[7.4, 0.76, 43.6]} />
        <meshStandardMaterial color="#2b303a" roughness={0.85} />
      </mesh>
      <mesh position={[5.7, 0.83, -2]} receiveShadow castShadow>
        <boxGeometry args={[7.8, 0.14, 44]} />
        <meshStandardMaterial map={concreteTex} color="#d4d7db" roughness={0.78} />
      </mesh>
      {/* Piso de conexión bajo los arcos y molinetes hacia el exterior */}
      <mesh position={[10.35, 0.83, 0]} receiveShadow>
        <boxGeometry args={[2.3, 0.14, 24]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Franja podotáctil + línea amarilla de seguridad */}
      <mesh position={[2.22, 0.905, -2]} receiveShadow>
        <boxGeometry args={[0.42, 0.015, 43.8]} />
        <meshStandardMaterial map={tactileTex} color="#d6d3cd" roughness={0.8} />
      </mesh>
      <mesh position={[2.0, 0.908, -2]} receiveShadow>
        <boxGeometry args={[0.12, 0.016, 43.8]} />
        <meshStandardMaterial color="#eab308" roughness={0.5} />
      </mesh>

      {/* EDIFICIO HISTÓRICO DE LADRILLO Y ARCOS (06_modulo_anden_3d.jpg) */}
      {ARCH_CENTERS.map((zc) => (
        <BrickArchBay key={zc} zCenter={zc} brickTex={brickTex} />
      ))}

      {/* Faroles de pared en las pilastras del fondo (13_faroles_iluminacion_3d.jpg) */}
      {[-10.5, -3.5, 3.5, 10.5].map((pz) => (
        <WallBracketLantern
          key={`wall-lamp-${pz}`}
          position={[9.05, 3.4, pz]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      ))}

      {/* Pilastras de piedra y ladrillo entre arcos */}
      {[-10.5, -3.5, 3.5, 10.5].map((pz) => (
        <group key={pz} position={[9.45, 0.9, pz]}>
          {/* Plinto inferior de piedra */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 1.1, 1.8]} />
            <meshStandardMaterial color="#a89d8a" roughness={0.85} />
          </mesh>
          {/* Cuerpo de la pilastra */}
          <mesh position={[0.15, 2.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.75, 3.0, 1.55]} />
            <meshStandardMaterial color="#b3a794" roughness={0.82} />
          </mesh>
          {/* Capitel / imposta */}
          <mesh position={[0.05, 4.15, 0]} castShadow>
            <boxGeometry args={[0.92, 0.26, 1.75]} />
            <meshStandardMaterial color="#9c917e" roughness={0.85} />
          </mesh>
          {/* Contrafuerte trasero */}
          <mesh position={[1.1, 2.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 4.7, 1.4]} />
            <meshStandardMaterial map={brickTex} roughness={0.88} />
          </mesh>
        </group>
      ))}

      {/* Parapeto superior de ladrillo y cornisa de piedra */}
      <mesh position={[10.45, 5.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.9, 23.0]} />
        <meshStandardMaterial map={brickTex} roughness={0.88} />
      </mesh>
      <mesh position={[10.4, 6.48, 0]} castShadow>
        <boxGeometry args={[2.5, 0.18, 23.3]} />
        <meshStandardMaterial color="#b5aa97" roughness={0.82} />
      </mesh>

      {/* Detalles de pared: cartel blanco izquierdo, cartel oscuro derecho e intercomunicador */}
      <mesh position={[9.02, 2.5, -3.5]}>
        <boxGeometry args={[0.06, 0.65, 0.42]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
      </mesh>
      <mesh position={[9.02, 2.35, 3.5]}>
        <boxGeometry args={[0.12, 0.42, 0.28]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[9.55, 4.15, 7.0]}>
        <boxGeometry args={[0.14, 0.4, 2.8]} />
        <meshStandardMaterial color="#272b30" roughness={0.5} />
      </mesh>

      {/* Cestos de basura metálicos junto a las columnas */}
      {COLUMN_ZS.map((cz) => (
        <TrashBin key={`bin-${cz}`} position={[8.65, 0.9, cz + 0.55]} />
      ))}

      {/* COLUMNAS DE FUNDICIÓN Y TECHO DE VIDRIO Y ACERO (06_modulo_anden_3d.jpg) */}
      {COLUMN_ZS.map((cz) => (
        <group key={`cols-${cz}`}>
          <CastIronColumn position={[3.8, 0.9, cz]} />
          <CastIronColumn position={[8.9, 0.9, cz]} />
        </group>
      ))}

      {/* Vigas longitudinales de alero + tiras LED cálidas integradas */}
      {[2.25, 9.55].map((bx, i) => (
        <group key={`beam-${i}`} position={[bx, eaveY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.34, canopyLength]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
          {/* Tira LED cálida inferior (como en la sección transversal de 06) */}
          <mesh position={[0, -0.18, 0]}>
            <boxGeometry args={[0.1, 0.03, canopyLength - 0.6]} />
            <meshStandardMaterial
              color="#fef9c3"
              emissive="#fde68a"
              emissiveIntensity={1.6}
            />
          </mesh>
        </group>
      ))}

      {/* Viga cumbrera central */}
      <mesh position={[5.9, ridgeY, 0]} castShadow>
        <boxGeometry args={[0.22, 0.26, canopyLength]} />
        <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
      </mesh>

      {/* Cabriadas transversales de acero */}
      {[-12, -8, -4, 0, 4, 8, 12].map((tz) => (
        <group key={`truss-${tz}`} position={[5.9, 0, tz]}>
          {/* Tirante horizontal inferior */}
          <mesh position={[0, eaveY + 0.05, 0]}>
            <boxGeometry args={[canopyWidth - 0.2, 0.08, 0.08]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
          {/* Montante central */}
          <mesh position={[0, (eaveY + ridgeY) / 2, 0]}>
            <boxGeometry args={[0.08, ridgeY - eaveY, 0.08]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
          {/* Cabrios inclinados izquierdo y derecho */}
          <mesh position={[-halfSpan / 2, (eaveY + ridgeY) / 2, 0]} rotation={[0, 0, slopeAngle]}>
            <boxGeometry args={[slopeLen, 0.1, 0.1]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
          <mesh position={[halfSpan / 2, (eaveY + ridgeY) / 2, 0]} rotation={[0, 0, -slopeAngle]}>
            <boxGeometry args={[slopeLen, 0.1, 0.1]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Reloj circular colgante doble faz bajo la cabriada central (12_reloj_circular_3d.jpg) */}
      <HangingStationClock position={[5.9, 3.45, 0]} />

      {/* Luminarias lineales colgantes bajo la cubierta (13_faroles_iluminacion_3d.jpg) */}
      {[-8, -4, 4, 8].map((lz) => (
        <SuspendedLinearLamp
          key={`linear-lamp-${lz}`}
          position={[5.9, 3.85, lz]}
          rotation={[0, Math.PI / 2, 0]}
          drop={0.65}
        />
      ))}

      {/* Paneles de vidrio traslúcido a dos aguas */}
      <mesh
        position={[5.9 - halfSpan / 2, (eaveY + ridgeY) / 2 + 0.04, 0]}
        rotation={[0, 0, slopeAngle]}
        receiveShadow
      >
        <boxGeometry args={[slopeLen, 0.04, canopyLength]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.34}
          roughness={0.12}
          metalness={0.25}
        />
      </mesh>
      <mesh
        position={[5.9 + halfSpan / 2, (eaveY + ridgeY) / 2 + 0.04, 0]}
        rotation={[0, 0, -slopeAngle]}
        receiveShadow
      >
        <boxGeometry args={[slopeLen, 0.04, canopyLength]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.34}
          roughness={0.12}
          metalness={0.25}
        />
      </mesh>
    </group>
  );
}
