import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore.js';
import { TrainFormation } from '../Train.jsx';
import {
  ClassicLampPost,
  CurvedErgonomicBench,
  DepartureTotem,
  HangingStationClock,
  SlattedLinearBench,
  SuspendedLinearLamp,
  WallBracketLantern,
} from './StationFurniture.jsx';
import {
  getBallastTexture,
  getBrickTexture,
  getConcreteSlabTexture,
  getDepartureScreenTexture,
  getTactileStripTexture,
  getVentGrilleTexture,
  getWoodTexture,
} from './textures.js';

/**
 * 01_puente_peatonal_estacion.jpg
 * Segunda vía paralela con el mismo modelo de tren seleccionado, segundo andén y
 * puente peatonal cubierto con escalones reales, torres de ascensor, listones de madera y cerchas.
 */
export function SecondPlatformAndBridge() {
  const ballastTex = useMemo(() => getBallastTexture(), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);
  const tactileTex = useMemo(() => getTactileStripTexture(), []);
  const oakTex = useMemo(() => getWoodTexture('oak'), []);

  const selectedTrain = useGameStore((s) => s.selectedTrain);
  const upgrades = useGameStore((s) => s.upgrades);
  const isExpress = upgrades.includes('express_train');

  const secondaryTrainRef = useRef(null);
  const secondaryWheelRefs = useRef([]);

  const sleeperPositions = useMemo(() => {
    const arr = [];
    for (let z = -60; z <= 60; z += 1.5) arr.push(z);
    return arr;
  }, []);

  // 18 escalones reales por escalera para poder cruzar el puente
  const stairSteps = useMemo(() => {
    const count = 18;
    const totalRise = 4.85;
    const totalRun = 5.4;
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      arr.push({
        y: totalRise * (1 - t),
        z: totalRun * t,
        rise: totalRise / count,
        run: totalRun / count + 0.04,
      });
    }
    return arr;
  }, []);

  useFrame(({ clock }, delta) => {
    if (!secondaryTrainRef.current) return;
    const t = clock.getElapsedTime();
    const speed = isExpress ? 18 : 13;
    const z = ((t * speed) % 140) - 70;
    secondaryTrainRef.current.position.z = -z;

    for (const wheel of secondaryWheelRefs.current) {
      if (wheel) wheel.rotation.x -= speed * Math.min(delta, 0.05) * 0.9;
    }
  });

  const bridgeSpan = 14.3; // x = -9.2 a +5.1
  const bridgeCenterX = -2.05;
  const deckY = 5.75;

  return (
    <group>
      {/* Segunda vía paralela en x = -4.6 */}
      <group position={[-4.6, 0, 0]}>
        <mesh position={[0, 0.01, 0]} receiveShadow>
          <boxGeometry args={[4.2, 0.05, 135]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.07, 0]} receiveShadow>
          <boxGeometry args={[3.6, 0.12, 135]} />
          <meshStandardMaterial map={ballastTex} roughness={0.95} />
        </mesh>
        {sleeperPositions.map((z, idx) => (
          <group key={`s2-${z}`} position={[0, 0.15, z]}>
            <mesh receiveShadow>
              <boxGeometry args={[2.6, 0.08, 0.3]} />
              <meshStandardMaterial color={idx % 3 === 0 ? '#7c5836' : '#cbd5e1'} roughness={0.85} />
            </mesh>
            {[-1.0, 1.0].map((fx) => (
              <mesh key={fx} position={[fx, 0.045, 0]}>
                <boxGeometry args={[0.2, 0.02, 0.22]} />
                <meshStandardMaterial color="#334155" metalness={0.6} />
              </mesh>
            ))}
          </group>
        ))}
        {[-1.0, 1.0].map((rx) => (
          <mesh key={`r2-${rx}`} position={[rx, 0.23, 0]} castShadow>
            <boxGeometry args={[0.11, 0.12, 135]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* Tren secundario pasante con el MISMO modelo seleccionado por el jugador */}
      <group ref={secondaryTrainRef} position={[-4.6, 0.25, 0]} rotation={[0, Math.PI, 0]}>
        <TrainFormation
          selectedTrain={selectedTrain}
          isExpress={isExpress}
          wheelRefs={secondaryWheelRefs}
        />
      </group>

      {/* Segundo andén lateral en x = -9.2 (extendido a z = -22..+16 para recibir la escalera) */}
      <group position={[-9.2, 0, -3]}>
        <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.4, 0.76, 37.6]} />
          <meshStandardMaterial color="#2b303a" roughness={0.85} />
        </mesh>
        <mesh position={[0.1, 0.83, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.7, 0.14, 38]} />
          <meshStandardMaterial map={concreteTex} color="#d4d7db" roughness={0.78} />
        </mesh>
        <mesh position={[2.05, 0.905, 0]} receiveShadow>
          <boxGeometry args={[0.38, 0.015, 37.8]} />
          <meshStandardMaterial map={tactileTex} color="#d6d3cd" roughness={0.8} />
        </mesh>
        <mesh position={[2.25, 0.908, 0]}>
          <boxGeometry args={[0.12, 0.016, 37.8]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
      </group>

      {/* PUENTE PEATONAL ELEVADO (z = -15.6, libre del techo de cristal que termina en z = -12.5) */}
      <group position={[0, 0, -15.6]}>
        {/* Tablero de hormigón */}
        <mesh position={[bridgeCenterX, deckY, 0]} castShadow receiveShadow>
          <boxGeometry args={[bridgeSpan, 0.26, 2.5]} />
          <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.8} />
        </mesh>

        {/* Techo plano superior del puente con cielorraso de madera cálida y tira LED */}
        <mesh position={[bridgeCenterX, deckY + 2.65, 0]} castShadow>
          <boxGeometry args={[bridgeSpan + 2.8, 0.22, 3.1]} />
          <meshStandardMaterial color="#1d2127" metalness={0.65} roughness={0.38} />
        </mesh>
        <mesh position={[bridgeCenterX, deckY + 2.52, 0]}>
          <boxGeometry args={[bridgeSpan + 2.4, 0.05, 2.8]} />
          <meshStandardMaterial map={oakTex} roughness={0.65} />
        </mesh>
        <mesh position={[bridgeCenterX, deckY + 2.48, 0]}>
          <boxGeometry args={[bridgeSpan + 1.8, 0.03, 0.1]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fde68a" emissiveIntensity={1.6} />
        </mesh>

        {/* Cerchas metálicas diagonales + baranda vidriada a ambos lados */}
        {[-1.22, 1.22].map((bz) => (
          <group key={`truss-${bz}`} position={[bridgeCenterX, deckY, bz]}>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[bridgeSpan, 0.16, 0.12]} />
              <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
            </mesh>
            <mesh position={[0, 2.55, 0]}>
              <boxGeometry args={[bridgeSpan, 0.16, 0.12]} />
              <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0.65, 0]}>
              <boxGeometry args={[bridgeSpan - 0.6, 1.05, 0.04]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.35} roughness={0.1} />
            </mesh>
            {[-5.4, -3.6, -1.8, 0, 1.8, 3.6, 5.4].map((vx, i) => (
              <group key={i} position={[vx, 1.3, 0]}>
                <mesh>
                  <boxGeometry args={[0.12, 2.5, 0.1]} />
                  <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
                </mesh>
                {i < 6 && (
                  <mesh
                    position={[0.9, 0, 0]}
                    rotation={[0, 0, i % 2 === 0 ? 0.62 : -0.62]}
                  >
                    <boxGeometry args={[0.1, 2.95, 0.09]} />
                    <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
                  </mesh>
                )}
              </group>
            ))}
          </group>
        ))}

        {/* Arcos de apoyo bajo los extremos del puente */}
        {[
          { x: 3.9, rotY: 0 },
          { x: -8.0, rotY: Math.PI },
        ].map((arch, idx) => (
          <group key={`haunch-${idx}`} position={[arch.x, deckY - 1.3, 0]} rotation={[0, arch.rotY, 0]}>
            {[-1.15, 1.15].map((az) => (
              <mesh key={az} position={[0, 0, az]} rotation={[0, 0, 0.72]}>
                <boxGeometry args={[0.16, 2.4, 0.12]} />
                <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Torres de ascensor y escaleras orientadas hacia -Z (sin tocar el techo de cristal) */}
        {[5.1, -9.2].map((endX, idx) => (
          <group key={`tower-${idx}`} position={[endX, 0.9, 0]}>
            {/* Torre de ascensor en +Z (z = -15.6 + 1.8 = -13.8, libre de -12.5) */}
            <group position={[0, 0, 1.8]}>
              <mesh position={[0, 3.85, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.1, 7.7, 2.1]} />
                <meshStandardMaterial map={oakTex} roughness={0.68} />
              </mesh>
              {[-1.05, 1.05].map((cx) =>
                [-1.05, 1.05].map((cz) => (
                  <mesh key={`tc-${cx}-${cz}`} position={[cx, 3.85, cz]}>
                    <boxGeometry args={[0.14, 7.75, 0.14]} />
                    <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
                  </mesh>
                ))
              )}
              <mesh position={[0, 7.78, 0]} castShadow>
                <boxGeometry args={[2.3, 0.24, 2.3]} />
                <meshStandardMaterial color="#1b1f24" metalness={0.65} roughness={0.38} />
              </mesh>
              <mesh position={[0, 1.15, -1.06]}>
                <boxGeometry args={[1.1, 2.1, 0.05]} />
                <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
              </mesh>
            </group>

            {/* Escalera con 18 escalones reales descendiendo hacia -Z */}
            <group position={[0, 0, -1.25]} rotation={[0, Math.PI, 0]}>
              <mesh position={[0, 4.8, -0.35]} castShadow receiveShadow>
                <boxGeometry args={[1.9, 0.2, 0.8]} />
                <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.82} />
              </mesh>

              {stairSteps.map((st, sIdx) => (
                <mesh
                  key={`step-${sIdx}`}
                  position={[0, st.y, st.z]}
                  castShadow
                  receiveShadow
                >
                  <boxGeometry args={[1.76, st.rise + 0.04, st.run]} />
                  <meshStandardMaterial map={concreteTex} color="#d4d7db" roughness={0.78} />
                </mesh>
              ))}

              {[-0.9, 0.9].map((sz) => (
                <group key={`srail-${sz}`}>
                  <mesh position={[sz, 2.42, 2.7]} rotation={[0.73, 0, 0]} castShadow>
                    <boxGeometry args={[0.08, 0.24, 7.3]} />
                    <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
                  </mesh>
                  <mesh position={[sz, 2.98, 2.7]} rotation={[0.73, 0, 0]}>
                    <boxGeometry args={[0.04, 0.92, 7.3]} />
                    <meshStandardMaterial color="#bae6fd" transparent opacity={0.35} roughness={0.1} />
                  </mesh>
                  <mesh position={[sz, 3.46, 2.7]} rotation={[0.73, 0, 0]}>
                    <boxGeometry args={[0.06, 0.06, 7.35]} />
                    <meshStandardMaterial map={oakTex} roughness={0.6} />
                  </mesh>
                </group>
              ))}

              <mesh position={[0, 1.25, 2.7]} castShadow>
                <boxGeometry args={[0.24, 2.5, 0.24]} />
                <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
              </mesh>
            </group>
          </group>
        ))}

        <pointLight position={[bridgeCenterX, deckY + 2.1, 0]} intensity={2.2} distance={14} color="#fde68a" />
      </group>
    </group>
  );
}

/**
 * 05_estacion_electrica.jpg
 * Subestación eléctrica modular con listones de madera, rejillas realistas, techo con LED
 * y patio lateral cercado con transformador y aisladores cerámicos.
 */
export function ElectricalSubstation({ position = [-14.2, 0, -9] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);
  const ventTex = useMemo(() => getVentGrilleTexture(), []);

  return (
    <group position={position}>
      {/* Plinto base de hormigón */}
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 0.28, 7.6]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.85} />
      </mesh>

      {/* Edificio modular de la subestación */}
      <group position={[0, 0.28, -1.15]}>
        <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.9, 4.6]} />
          <meshStandardMaterial map={oakTex} roughness={0.68} />
        </mesh>
        {/* Franja superior con textura de rejillas */}
        <mesh position={[0, 2.62, 0]}>
          <boxGeometry args={[3.24, 0.48, 4.64]} />
          <meshStandardMaterial map={ventTex} color="#272b30" metalness={0.55} roughness={0.45} />
        </mesh>
        {/* Rejilla de ventilación inferior */}
        <mesh position={[1.62, 0.55, 0.9]}>
          <boxGeometry args={[0.04, 0.48, 0.9]} />
          <meshStandardMaterial map={ventTex} metalness={0.5} roughness={0.45} />
        </mesh>
        {/* Columnas metálicas esquineras */}
        {[-1.58, 1.58].map((cx) =>
          [-2.28, 0.5, 2.28].map((cz) => (
            <mesh key={`scol-${cx}-${cz}`} position={[cx, 1.45, cz]}>
              <boxGeometry args={[0.14, 2.94, 0.14]} />
              <meshStandardMaterial color="#181b20" metalness={0.7} roughness={0.35} />
            </mesh>
          ))
        )}
        {/* Puerta técnica de acceso con manija y cartel de alta tensión */}
        <mesh position={[1.62, 1.15, -1.45]}>
          <boxGeometry args={[0.06, 2.1, 0.95]} />
          <meshStandardMaterial color="#272b30" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[1.66, 1.12, -1.12]}>
          <boxGeometry args={[0.04, 0.18, 0.05]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
        </mesh>
        <mesh position={[1.66, 1.65, -1.45]}>
          <boxGeometry args={[0.02, 0.22, 0.32]} />
          <meshStandardMaterial color="#facc15" roughness={0.4} />
        </mesh>
        {/* Techo metálico voladizo + tira LED cálida */}
        <mesh position={[0, 3.04, 0]} castShadow>
          <boxGeometry args={[3.7, 0.24, 5.1]} />
          <meshStandardMaterial color="#1b1f24" metalness={0.65} roughness={0.38} />
        </mesh>
        <mesh position={[1.7, 2.9, 0]}>
          <boxGeometry args={[0.06, 0.03, 4.7]} />
          <meshStandardMaterial color="#fef9c3" emissive="#fde68a" emissiveIntensity={1.6} />
        </mesh>
      </group>

      {/* Patio cercado del transformador */}
      <group position={[0, 0.28, 2.35]}>
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.65, 2.1, 1.5]} />
          <meshStandardMaterial color="#475569" metalness={0.55} roughness={0.42} />
        </mesh>
        {[-0.48, 0, 0.48].map((ax) => (
          <mesh key={`fin-${ax}`} position={[ax, 1.05, 0.8]} castShadow>
            <boxGeometry args={[0.1, 1.6, 0.16]} />
            <meshStandardMaterial color="#334155" metalness={0.6} />
          </mesh>
        ))}
        {[-0.42, 0, 0.42].map((ix) => (
          <group key={`ins-${ix}`} position={[ix, 2.32, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.08, 0.11, 0.45, 10]} />
              <meshStandardMaterial color="#9a3412" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.28, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.5, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.75} />
            </mesh>
          </group>
        ))}
        {[-1.65, 1.65].map((fx) => (
          <mesh key={`fc-${fx}`} position={[fx, 1.1, 0]}>
            <boxGeometry args={[0.06, 2.2, 2.2]} />
            <meshStandardMaterial color="#1e2228" wireframe />
          </mesh>
        ))}
        <mesh position={[0, 1.1, 1.1]}>
          <boxGeometry args={[3.3, 2.2, 0.06]} />
          <meshStandardMaterial color="#1e2228" wireframe />
        </mesh>
      </group>

      <pointLight position={[2.2, 2.8, 0]} intensity={1.8} distance={8} color="#fde68a" />
    </group>
  );
}

/**
 * 02_arbustos_y_canteros.jpg
 */
function ModularPlanterBox({ position = [0, 0, 0], variant = 0 }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);

  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.52, 1.38]} />
        <meshStandardMaterial color="#1b1f24" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.7, 0.42, 1.28]} />
        <meshStandardMaterial map={oakTex} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.56, 0]} castShadow>
        <boxGeometry args={[0.74, 0.08, 1.44]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {variant % 3 === 0 ? (
        <group position={[0, 0.92, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.42, 12, 12]} />
            <meshStandardMaterial color="#2d5a34" roughness={0.88} />
          </mesh>
          <mesh position={[0.1, 0.14, 0.1]}>
            <dodecahedronGeometry args={[0.26, 1]} />
            <meshStandardMaterial color="#3a7242" roughness={0.88} />
          </mesh>
        </group>
      ) : variant % 3 === 1 ? (
        <group position={[0, 0.96, 0]}>
          {[
            [0, 0, 0, 0.34, '#3f7d47'],
            [-0.14, 0.18, 0.18, 0.26, '#4f9156'],
            [0.14, 0.12, -0.18, 0.28, '#2f6b3c'],
          ].map(([lx, ly, lz, lr, lc], i) => (
            <mesh key={i} position={[lx, ly, lz]} castShadow>
              <dodecahedronGeometry args={[lr, 0]} />
              <meshStandardMaterial color={lc} roughness={0.88} />
            </mesh>
          ))}
        </group>
      ) : (
        <group position={[0, 0.85, 0]}>
          {[-0.25, -0.08, 0.08, 0.25].map((rot, i) => (
            <mesh key={i} position={[0, 0, (i - 1.5) * 0.14]} rotation={[rot, 0, rot * 0.6]} castShadow>
              <coneGeometry args={[0.18, 0.68, 6]} />
              <meshStandardMaterial color="#6b8c6e" roughness={0.85} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

/**
 * 03_parada_de_colectivo.jpg
 */
function BusStopShelter({ position = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);
  const screenTex = useMemo(() => getDepartureScreenTexture(), []);

  return (
    <group position={position}>
      <mesh position={[0, 0.07, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.3, 0.14, 4.8]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.82} />
      </mesh>

      {[-2.1, 2.1].map((pz) =>
        [-0.75, 0.75].map((px) => (
          <mesh key={`bc-${px}-${pz}`} position={[px, 1.38, pz]} castShadow>
            <cylinderGeometry args={[0.075, 0.09, 2.5, 10]} />
            <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.35} />
          </mesh>
        ))
      )}

      <mesh position={[-0.75, 1.35, 0]}>
        <boxGeometry args={[0.04, 2.15, 4.1]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.32} roughness={0.1} />
      </mesh>
      {[-2.1, 2.1].map((sz) => (
        <mesh key={`bsg-${sz}`} position={[0, 1.35, sz]}>
          <boxGeometry args={[1.45, 2.15, 0.04]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.32} roughness={0.1} />
        </mesh>
      ))}

      <group position={[-0.3, 0.14, -0.55]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.52, 0.08, 1.9]} />
          <meshStandardMaterial map={oakTex} roughness={0.62} />
        </mesh>
        <mesh position={[-0.22, 0.68, 0]} rotation={[0, 0, -0.15]} castShadow>
          <boxGeometry args={[0.07, 0.48, 1.9]} />
          <meshStandardMaterial map={oakTex} roughness={0.62} />
        </mesh>
        {[-0.75, 0.75].map((lz) => (
          <mesh key={lz} position={[0, 0.21, lz]}>
            <boxGeometry args={[0.42, 0.42, 0.08]} />
            <meshStandardMaterial color="#1b1f24" metalness={0.65} />
          </mesh>
        ))}
      </group>

      {/* Tótem digital con pantalla realista de horarios */}
      <group position={[-0.32, 0.14, 1.3]}>
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[0.24, 1.84, 0.56]} />
          <meshStandardMaterial color="#181b20" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.125, 1.15, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.42, 0.75]} />
          <meshStandardMaterial
            map={screenTex}
            emissive="#f8fafc"
            emissiveMap={screenTex}
            emissiveIntensity={0.45}
          />
        </mesh>
      </group>

      <mesh position={[0.1, 2.7, 0]} rotation={[0, 0, -0.06]} castShadow>
        <boxGeometry args={[2.15, 0.18, 5.1]} />
        <meshStandardMaterial color="#1b1f24" metalness={0.65} roughness={0.38} />
      </mesh>
      <mesh position={[0.1, 2.59, 0]} rotation={[0, 0, -0.06]}>
        <boxGeometry args={[1.95, 0.04, 4.8]} />
        <meshStandardMaterial map={oakTex} roughness={0.65} />
      </mesh>
      <mesh position={[0.98, 2.54, 0]}>
        <boxGeometry args={[0.04, 0.03, 4.7]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fde68a" emissiveIntensity={1.8} />
      </mesh>
      <pointLight position={[0.3, 2.35, 0]} intensity={2.0} distance={7.5} color="#fde68a" />
    </group>
  );
}

/**
 * 04_bicicletero_con_bicicletas.jpg
 */
function BicycleRackWithBikes({ position = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);

  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.55, 0.16, 4.2]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.82} />
      </mesh>

      {[-1.95, 1.95].map((ez) => (
        <mesh key={`bw-${ez}`} position={[0, 0.34, ez]} castShadow>
          <boxGeometry args={[1.45, 0.36, 0.14]} />
          <meshStandardMaterial map={oakTex} roughness={0.65} />
        </mesh>
      ))}

      {[-1.4, -0.7, 0, 0.7, 1.4].map((hz, i) => (
        <mesh key={`hoop-${i}`} position={[0, 0.16, hz]} castShadow>
          <torusGeometry args={[0.34, 0.035, 10, 18, Math.PI]} />
          <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {[
        { z: -0.62, color: '#1e2228' },
        { z: 0.78, color: '#4d7c5b' },
      ].map((bike, idx) => (
        <group key={`bike-${idx}`} position={[0, 0.16, bike.z]}>
          {[-0.48, 0.48].map((wx) => (
            <mesh key={wx} position={[wx, 0.32, 0]} castShadow>
              <torusGeometry args={[0.28, 0.03, 10, 20]} />
              <meshStandardMaterial color="#111827" roughness={0.6} />
            </mesh>
          ))}
          <mesh position={[0, 0.56, 0]}>
            <boxGeometry args={[0.62, 0.045, 0.045]} />
            <meshStandardMaterial color={bike.color} metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[-0.22, 0.46, 0]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[0.045, 0.45, 0.045]} />
            <meshStandardMaterial color={bike.color} metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0.35, 0.52, 0]} rotation={[0, 0, -0.25]}>
            <boxGeometry args={[0.045, 0.56, 0.045]} />
            <meshStandardMaterial color={bike.color} metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[-0.26, 0.72, 0]}>
            <boxGeometry args={[0.18, 0.05, 0.1]} />
            <meshStandardMaterial color="#b47b48" roughness={0.7} />
          </mesh>
          <mesh position={[0.28, 0.8, 0]}>
            <boxGeometry args={[0.05, 0.04, 0.44]} />
            <meshStandardMaterial color="#b47b48" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Zona exterior trasera conectada al andén principal y molinetes (sin muro de fondo).
 */
export function ExteriorBusAndBikePlaza() {
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);

  return (
    <group position={[15.0, 0, 0]}>
      {/* Escalones de salida desde el nivel del andén (0.9) hacia la plaza exterior (0.11) */}
      {[0, 1, 2, 3].map((step) => (
        <mesh
          key={`exit-step-${step}`}
          position={[-3.3 + step * 0.42, 0.72 - step * 0.18, 0]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[0.46, 0.2, 22]} />
          <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.82} />
        </mesh>
      ))}

      {/* Plaza exterior pavimentada */}
      <mesh position={[0.6, 0.05, 0]} receiveShadow>
        <boxGeometry args={[8.4, 0.12, 28]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.85} />
      </mesh>

      {/* Parada de Colectivos */}
      <BusStopShelter position={[1.4, 0.11, 6.5]} />

      {/* Bicicletero con Bicicletas */}
      <BicycleRackWithBikes position={[1.3, 0.11, -6.5]} />

      {/* Canteros modulares con arbustos */}
      {[-11.8, -10.3, -1.6, 1.6, 10.3, 11.8].map((pz, i) => (
        <ModularPlanterBox key={`planter-${i}`} position={[2.6, 0.11, pz]} variant={i} />
      ))}
    </group>
  );
}

/**
 * ESTACIÓN 2: Cubierta vidriada, columnas de fundición, arcos de ladrillo, reloj y faroles
 * replicando exactamente la estética de la Estación 1 en el segundo andén (x = -9.2).
 */
export function Station2CanopyAndArches() {
  const brickTex = useMemo(() => getBrickTexture(), []);
  const canopyWidth = 4.6; // x = -11.4 a -6.8
  const canopyLength = 25.0; // z = -12.5 a +12.5
  const eaveY = 4.45;
  const ridgeY = 5.15;
  const halfSpan = canopyWidth / 2;
  const slopeAngle = Math.atan2(ridgeY - eaveY, halfSpan);
  const slopeLen = Math.hypot(halfSpan, ridgeY - eaveY);

  const archSegments = useMemo(() => {
    const segs = [];
    const count = 11;
    const radius = 2.15;
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const angle = Math.PI * t;
      segs.push({
        z: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotX: angle - Math.PI / 2,
        isKeystone: i === 5,
      });
    }
    return segs;
  }, []);

  return (
    <group>
      {/* 3 Arcos de ladrillo y piedra en el fondo del segundo andén (x = -11.4) */}
      {[-7, 0, 7].map((zc) => (
        <group key={`s2-arch-${zc}`} position={[-11.4, 0.9, zc]}>
          <mesh position={[-0.15, 4.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.45, 0.85, 5.2]} />
            <meshStandardMaterial map={brickTex} roughness={0.88} />
          </mesh>
          <group position={[-0.05, 2.15, 0]}>
            {archSegments.map((seg, idx) => (
              <mesh
                key={idx}
                position={[seg.isKeystone ? 0.04 : 0, seg.y, seg.z]}
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
          <pointLight position={[0.9, 3.6, 0]} intensity={2.2} distance={8} color="#fde68a" />
        </group>
      ))}

      {/* Pilastras de piedra entre los arcos y parapeto superior */}
      {[-10.5, -3.5, 3.5, 10.5].map((pz) => (
        <group key={`s2-pil-${pz}`} position={[-11.45, 0.9, pz]}>
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.85, 1.1, 1.8]} />
            <meshStandardMaterial color="#a89d8a" roughness={0.85} />
          </mesh>
          <mesh position={[-0.1, 2.55, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.75, 3.0, 1.55]} />
            <meshStandardMaterial color="#b3a794" roughness={0.82} />
          </mesh>
          <mesh position={[-0.05, 4.15, 0]} castShadow>
            <boxGeometry args={[0.92, 0.26, 1.75]} />
            <meshStandardMaterial color="#9c917e" roughness={0.85} />
          </mesh>
          <WallBracketLantern position={[0.45, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} />
        </group>
      ))}
      <mesh position={[-11.6, 5.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.9, 23.0]} />
        <meshStandardMaterial map={brickTex} roughness={0.88} />
      </mesh>
      <mesh position={[-11.55, 6.48, 0]} castShadow>
        <boxGeometry args={[1.1, 0.18, 23.3]} />
        <meshStandardMaterial color="#b5aa97" roughness={0.82} />
      </mesh>

      {/* Columnas de fundición sobre el segundo andén */}
      {[-10.5, -3.5, 3.5, 10.5].map((cz) => (
        <group key={`s2-col-${cz}`} position={[-7.2, 0.9, cz]}>
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.24, 0.28, 12]} />
            <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
          </mesh>
          <mesh position={[0, 1.9, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.13, 3.3, 12]} />
            <meshStandardMaterial color="#2d3238" metalness={0.65} roughness={0.38} />
          </mesh>
          <mesh position={[0, 3.55, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.12, 0.22, 12]} />
            <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Vigas longitudinales con tiras LED cálidas */}
      {[-11.4, -6.8].map((bx, i) => (
        <group key={`s2-beam-${i}`} position={[bx, eaveY, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.24, 0.32, canopyLength]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.17, 0]}>
            <boxGeometry args={[0.1, 0.03, canopyLength - 0.6]} />
            <meshStandardMaterial color="#fef9c3" emissive="#fde68a" emissiveIntensity={1.6} />
          </mesh>
        </group>
      ))}

      {/* Cumbrera y cabriadas */}
      <mesh position={[-9.1, ridgeY, 0]} castShadow>
        <boxGeometry args={[0.2, 0.24, canopyLength]} />
        <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
      </mesh>
      {[-12, -8, -4, 0, 4, 8, 12].map((tz) => (
        <group key={`s2-truss-${tz}`} position={[-9.1, 0, tz]}>
          <mesh position={[0, eaveY + 0.05, 0]}>
            <boxGeometry args={[canopyWidth - 0.2, 0.08, 0.08]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
          <mesh position={[-halfSpan / 2, (eaveY + ridgeY) / 2, 0]} rotation={[0, 0, slopeAngle]}>
            <boxGeometry args={[slopeLen, 0.09, 0.09]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
          <mesh position={[halfSpan / 2, (eaveY + ridgeY) / 2, 0]} rotation={[0, 0, -slopeAngle]}>
            <boxGeometry args={[slopeLen, 0.09, 0.09]} />
            <meshStandardMaterial color="#2e343d" metalness={0.65} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Paneles de vidrio traslúcido a dos aguas */}
      <mesh position={[-9.1 - halfSpan / 2, (eaveY + ridgeY) / 2 + 0.04, 0]} rotation={[0, 0, slopeAngle]}>
        <boxGeometry args={[slopeLen, 0.04, canopyLength]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.34} roughness={0.12} metalness={0.25} />
      </mesh>
      <mesh position={[-9.1 + halfSpan / 2, (eaveY + ridgeY) / 2 + 0.04, 0]} rotation={[0, 0, -slopeAngle]}>
        <boxGeometry args={[slopeLen, 0.04, canopyLength]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.34} roughness={0.12} metalness={0.25} />
      </mesh>

      {/* Reloj circular doble faz y luminarias lineales bajo la cubierta */}
      <HangingStationClock position={[-9.1, 3.45, 0]} />
      {[-8, -4, 4, 8].map((lz) => (
        <SuspendedLinearLamp
          key={`s2-lin-${lz}`}
          position={[-9.1, 3.85, lz]}
          rotation={[0, Math.PI / 2, 0]}
          drop={0.65}
        />
      ))}
    </group>
  );
}

/**
 * ESTACIÓN 2: Bancos de madera, farolas clásicas, tótems digitales y canteros en el segundo andén.
 */
export function Station2Furniture() {
  return (
    <group>
      {/* Bancos lineales y curvos en el segundo andén */}
      <SlattedLinearBench position={[-9.8, 0.9, -7.0]} />
      <SlattedLinearBench position={[-9.8, 0.9, 7.0]} />
      <CurvedErgonomicBench position={[-8.6, 0.9, -9.5]} rotation={[0, Math.PI, 0]} />
      <CurvedErgonomicBench position={[-8.6, 0.9, 9.5]} rotation={[0, Math.PI, 0]} />

      {/* Farolas clásicas en el borde del segundo andén */}
      {[-11.5, -3.5, 3.5, 11.5].map((lz) => (
        <ClassicLampPost key={`s2-lamp-${lz}`} position={[-7.3, 0.9, lz]} />
      ))}

      {/* Tótem de partidas */}
      <DepartureTotem position={[-8.5, 0.9, -1.8]} />
      <DepartureTotem position={[-8.5, 0.9, 11.8]} />
    </group>
  );
}
