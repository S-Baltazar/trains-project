import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  getBallastTexture,
  getConcreteSlabTexture,
  getWoodTexture,
} from './textures.js';

/**
 * 01_puente_peatonal_estacion.jpg
 * Segunda vía paralela, segundo andén y puente peatonal cubierto con torres de ascensor,
 * listones de madera, cerchas diagonales, arcos inferiores y escaleras con baranda de vidrio.
 */
export function SecondPlatformAndBridge() {
  const ballastTex = useMemo(() => getBallastTexture(), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const secondaryTrainRef = useRef(null);

  const sleeperPositions = useMemo(() => {
    const arr = [];
    for (let z = -60; z <= 60; z += 1.5) arr.push(z);
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!secondaryTrainRef.current) return;
    const t = clock.getElapsedTime();
    const z = ((t * 14) % 140) - 70;
    secondaryTrainRef.current.position.z = -z;
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
          <mesh key={`s2-${z}`} position={[0, 0.15, z]} receiveShadow>
            <boxGeometry args={[2.6, 0.08, 0.3]} />
            <meshStandardMaterial color={idx % 3 === 0 ? '#7c5836' : '#cbd5e1'} roughness={0.85} />
          </mesh>
        ))}
        {[-1.0, 1.0].map((rx) => (
          <mesh key={`r2-${rx}`} position={[rx, 0.23, 0]} castShadow>
            <boxGeometry args={[0.11, 0.12, 135]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.82} roughness={0.25} />
          </mesh>
        ))}
      </group>

      {/* Tren secundario pasante en la segunda vía */}
      <group ref={secondaryTrainRef} position={[-4.6, 0.25, 0]}>
        {[0, -11.6].map((cz, i) => (
          <group key={i} position={[0, 0, cz]}>
            <mesh position={[0, 1.45, 0]} castShadow>
              <boxGeometry args={[2.3, 1.65, 11.0]} />
              <meshStandardMaterial color="#0284c7" roughness={0.35} />
            </mesh>
            <mesh position={[0, 1.65, 0]}>
              <boxGeometry args={[2.32, 0.6, 10.4]} />
              <meshStandardMaterial color="#0f172a" roughness={0.15} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Segundo andén lateral en x = -9.2 */}
      <group position={[-9.2, 0, 0]}>
        <mesh position={[0, 0.38, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.4, 0.76, 28]} />
          <meshStandardMaterial color="#2b303a" roughness={0.85} />
        </mesh>
        <mesh position={[0.1, 0.83, 0]} receiveShadow castShadow>
          <boxGeometry args={[4.7, 0.14, 28.4]} />
          <meshStandardMaterial map={concreteTex} color="#d4d7db" roughness={0.78} />
        </mesh>
        <mesh position={[2.25, 0.908, 0]}>
          <boxGeometry args={[0.12, 0.016, 28.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
      </group>

      {/* PUENTE PEATONAL ELEVADO (01_puente_peatonal_estacion.jpg) en z = -12.8 */}
      <group position={[0, 0, -12.8]}>
        {/* Tablero de hormigón y estructura de cercha */}
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

        {/* Cerchas metálicas diagonales + baranda vidriada a ambos lados del puente */}
        {[-1.22, 1.22].map((bz) => (
          <group key={`truss-${bz}`} position={[bridgeCenterX, deckY, bz]}>
            {/* Cordón inferior y superior */}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[bridgeSpan, 0.16, 0.12]} />
              <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
            </mesh>
            <mesh position={[0, 2.55, 0]}>
              <boxGeometry args={[bridgeSpan, 0.16, 0.12]} />
              <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
            </mesh>
            {/* Baranda de vidrio */}
            <mesh position={[0, 0.65, 0]}>
              <boxGeometry args={[bridgeSpan - 0.6, 1.05, 0.04]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.35} roughness={0.1} />
            </mesh>
            {/* Montantes verticales y diagonales Warren */}
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

        {/* Arcos curvos de apoyo bajo los extremos del puente */}
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

        {/* Torres de ascensor con revestimiento de listones de madera y escaleras */}
        {[
          { x: 5.1, stairDir: 1 },
          { x: -9.2, stairDir: 1 },
        ].map((end, idx) => (
          <group key={`tower-${idx}`} position={[end.x, 0.9, 0]}>
            {/* Torre de ascensor detrás del puente (z = -1.6) */}
            <group position={[0, 0, -1.7]}>
              <mesh position={[0, 3.85, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.1, 7.7, 2.1]} />
                <meshStandardMaterial map={oakTex} roughness={0.68} />
              </mesh>
              {/* Estructura metálica exterior de la torre */}
              {[-1.05, 1.05].map((cx) =>
                [-1.05, 1.05].map((cz) => (
                  <mesh key={`tc-${cx}-${cz}`} position={[cx, 3.85, cz]}>
                    <boxGeometry args={[0.14, 7.75, 0.14]} />
                    <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.38} />
                  </mesh>
                ))
              )}
              {/* Cornisa superior oscura */}
              <mesh position={[0, 7.78, 0]} castShadow>
                <boxGeometry args={[2.3, 0.24, 2.3]} />
                <meshStandardMaterial color="#1b1f24" metalness={0.65} roughness={0.38} />
              </mesh>
              {/* Puerta de ascensor metálica en la base */}
              <mesh position={[0, 1.15, 1.06]}>
                <boxGeometry args={[1.1, 2.1, 0.05]} />
                <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.3} />
              </mesh>
            </group>

            {/* Escalera con descanso y baranda vidriada hacia +Z */}
            <group position={[0, 0, 1.3]}>
              <mesh position={[0, 2.45, 2.35]} rotation={[0.68, 0, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.8, 0.22, 7.4]} />
                <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.82} />
              </mesh>
              {[-0.88, 0.88].map((sz) => (
                <mesh
                  key={`sr-${sz}`}
                  position={[sz, 3.05, 2.35]}
                  rotation={[0.68, 0, 0]}
                >
                  <boxGeometry args={[0.05, 0.95, 7.4]} />
                  <meshStandardMaterial color="#bae6fd" transparent opacity={0.38} roughness={0.1} />
                </mesh>
              ))}
              {/* Pilar intermedio bajo la escalera */}
              <mesh position={[0, 1.25, 2.6]} castShadow>
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
 * Subestación eléctrica modular con listones de madera, rejillas superiores, techo con LED
 * y patio lateral cercado con transformador y aisladores cerámicos.
 */
export function ElectricalSubstation({ position = [-14.2, 0, -9] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);

  return (
    <group position={position}>
      {/* Plinto base de hormigón */}
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 0.28, 7.6]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.85} />
      </mesh>

      {/* Edificio modular de la subestación (z = -1.15) */}
      <group position={[0, 0.28, -1.15]}>
        {/* Cuerpo principal con listones verticales de madera */}
        <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.9, 4.6]} />
          <meshStandardMaterial map={oakTex} roughness={0.68} />
        </mesh>
        {/* Franja superior oscura de rejillas de ventilación */}
        <mesh position={[0, 2.62, 0]}>
          <boxGeometry args={[3.24, 0.48, 4.64]} />
          <meshStandardMaterial color="#1b1f24" metalness={0.55} roughness={0.45} />
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
        {/* Puerta técnica de acceso con manija plateada */}
        <mesh position={[1.62, 1.15, -1.45]}>
          <boxGeometry args={[0.06, 2.1, 0.95]} />
          <meshStandardMaterial color="#272b30" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[1.66, 1.12, -1.12]}>
          <boxGeometry args={[0.04, 0.18, 0.05]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} />
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

      {/* Patio cercado del transformador (z = +2.35) */}
      <group position={[0, 0.28, 2.35]}>
        {/* Transformador principal gris con aletas */}
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
        {/* 3 Aisladores cerámicos superiores + caños de conexión al edificio */}
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
        {/* Cerco perimetral metálico oscuro */}
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
 * Cantero modular con estructura de hierro, borde de hormigón, listones horizontales de madera
 * y tres especies de arbustos (boj redondeado, arbusto frondoso y gramínea ornamental).
 */
function ModularPlanterBox({ position = [0, 0, 0], variant = 0 }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);

  return (
    <group position={position}>
      {/* Marco metálico oscuro + listones horizontales de madera */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.68, 0.52, 1.38]} />
        <meshStandardMaterial color="#1b1f24" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <boxGeometry args={[0.7, 0.42, 1.28]} />
        <meshStandardMaterial map={oakTex} roughness={0.65} />
      </mesh>
      {/* Borde superior de hormigón claro */}
      <mesh position={[0, 0.56, 0]} castShadow>
        <boxGeometry args={[0.74, 0.08, 1.44]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {/* Vegetación según variante */}
      {variant % 3 === 0 ? (
        /* Rounded Evergreen */
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
        /* Layered Leafy Shrub */
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
        /* Ornamental Tuft */
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
 * Parada de colectivo con plataforma de hormigón, columnas negras, vidrios, banco de madera,
 * tótem digital y techo con cielorraso de madera e iluminación LED.
 */
function BusStopShelter({ position = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);

  return (
    <group position={position}>
      {/* Plataforma de hormigón */}
      <mesh position={[0, 0.07, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.3, 0.14, 4.8]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.82} />
      </mesh>

      {/* 4 Columnas metálicas oscuras */}
      {[-2.1, 2.1].map((pz) =>
        [-0.75, 0.75].map((px) => (
          <mesh key={`bc-${px}-${pz}`} position={[px, 1.38, pz]} castShadow>
            <cylinderGeometry args={[0.075, 0.09, 2.5, 10]} />
            <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.35} />
          </mesh>
        ))
      )}

      {/* Paños vidriados trasero y laterales */}
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

      {/* Banco de listones de madera interior */}
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

      {/* Tótem digital negro junto al banco */}
      <group position={[-0.32, 0.14, 1.3]}>
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[0.24, 1.84, 0.56]} />
          <meshStandardMaterial color="#181b20" metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0.125, 1.15, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.42, 0.75]} />
          <meshStandardMaterial color="#0f172a" emissive="#38bdf8" emissiveIntensity={0.45} />
        </mesh>
      </group>

      {/* Techo oscuro con cielorraso de madera cálida y tira LED */}
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
 * Bicicletero con base de hormigón, laterales de listones de madera, 5 arcos metálicos y 2 bicicletas 3D.
 */
function BicycleRackWithBikes({ position = [0, 0, 0] }) {
  const oakTex = useMemo(() => getWoodTexture('oak'), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);

  return (
    <group position={position}>
      {/* Base de hormigón */}
      <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.55, 0.16, 4.2]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.82} />
      </mesh>

      {/* Laterales bajos de listones de madera */}
      {[-1.95, 1.95].map((ez) => (
        <mesh key={`bw-${ez}`} position={[0, 0.34, ez]} castShadow>
          <boxGeometry args={[1.45, 0.36, 0.14]} />
          <meshStandardMaterial map={oakTex} roughness={0.65} />
        </mesh>
      ))}

      {/* 5 Arcos metálicos invertidos */}
      {[-1.4, -0.7, 0, 0.7, 1.4].map((hz, i) => (
        <mesh key={`hoop-${i}`} position={[0, 0.16, hz]} castShadow>
          <torusGeometry args={[0.34, 0.035, 10, 18, Math.PI]} />
          <meshStandardMaterial color="#1b1f24" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}

      {/* 2 Bicicletas estacionadas (negra y verde salvia) */}
      {[
        { z: -0.62, color: '#1e2228' },
        { z: 0.78, color: '#4d7c5b' },
      ].map((bike, idx) => (
        <group key={`bike-${idx}`} position={[0, 0.16, bike.z]}>
          {/* Ruedas delantera y trasera */}
          {[-0.48, 0.48].map((wx) => (
            <mesh key={wx} position={[wx, 0.32, 0]} castShadow>
              <torusGeometry args={[0.28, 0.03, 10, 20]} />
              <meshStandardMaterial color="#111827" roughness={0.6} />
            </mesh>
          ))}
          {/* Cuadro */}
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
          {/* Asiento y manubrio */}
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
 * Zona exterior trasera de la estación: plaza pavimentada, parada de colectivos,
 * bicicletero con bicicletas y canteros modulares con arbustos.
 */
export function ExteriorBusAndBikePlaza() {
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);

  return (
    <group position={[15.0, 0, 0]}>
      {/* Plaza exterior pavimentada */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[7.2, 0.12, 28]} />
        <meshStandardMaterial map={concreteTex} color="#cbd5e1" roughness={0.85} />
      </mesh>

      {/* Parada de Colectivos (03_parada_de_colectivo.jpg) */}
      <BusStopShelter position={[1.2, 0.11, 6.5]} />

      {/* Bicicletero con Bicicletas (04_bicicletero_con_bicicletas.jpg) */}
      <BicycleRackWithBikes position={[1.1, 0.11, -6.5]} />

      {/* Canteros modulares con arbustos (02_arbustos_y_canteros.jpg) */}
      {[-11.8, -10.3, -1.6, 1.6, 10.3, 11.8].map((pz, i) => (
        <ModularPlanterBox key={`planter-${i}`} position={[2.3, 0.11, pz]} variant={i} />
      ))}
    </group>
  );
}
