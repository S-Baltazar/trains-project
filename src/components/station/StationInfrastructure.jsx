import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { getBallastTexture, getConcreteSlabTexture } from './textures.js';

/**
 * Segunda vía paralela (x = -4.6), segundo andén (x = -9.0) y puente peatonal elevado.
 */
export function SecondPlatformAndBridge() {
  const ballastTex = useMemo(() => getBallastTexture(), []);
  const concreteTex = useMemo(() => getConcreteSlabTexture(), []);
  const secondaryTrainRef = useRef(null);

  const sleeperPositions = useMemo(() => {
    const arr = [];
    for (let z = -60; z <= 60; z += 1.5) arr.push(z);
    return arr;
  }, []);

  // Tren expreso secundario circulando suavemente por la segunda vía
  useFrame(({ clock }) => {
    if (!secondaryTrainRef.current) return;
    const t = clock.getElapsedTime();
    const z = ((t * 14) % 140) - 70;
    secondaryTrainRef.current.position.z = -z;
  });

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
        <mesh position={[0, 1.45, 0]} castShadow>
          <boxGeometry args={[2.3, 1.65, 11.0]} />
          <meshStandardMaterial color="#0284c7" roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.65, 0]}>
          <boxGeometry args={[2.32, 0.6, 10.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} />
        </mesh>
        <mesh position={[0, 1.45, -11.6]} castShadow>
          <boxGeometry args={[2.3, 1.65, 11.0]} />
          <meshStandardMaterial color="#0284c7" roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.65, -11.6]}>
          <boxGeometry args={[2.32, 0.6, 10.4]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} />
        </mesh>
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
        {/* Línea amarilla de seguridad */}
        <mesh position={[2.25, 0.908, 0]}>
          <boxGeometry args={[0.12, 0.016, 28.2]} />
          <meshStandardMaterial color="#eab308" roughness={0.5} />
        </mesh>
        {/* Refugio vidriado del segundo andén */}
        <group position={[-0.6, 0.9, 0]}>
          {[-2.4, 2.4].map((pz) => (
            <mesh key={pz} position={[0, 1.35, pz]} castShadow>
              <boxGeometry args={[0.12, 2.7, 0.12]} />
              <meshStandardMaterial color="#1e2228" metalness={0.7} roughness={0.35} />
            </mesh>
          ))}
          <mesh position={[-0.35, 1.35, 0]}>
            <boxGeometry args={[0.04, 2.3, 4.8]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.35} roughness={0.1} />
          </mesh>
          <mesh position={[0.3, 2.72, 0]} castShadow>
            <boxGeometry args={[1.8, 0.12, 5.4]} />
            <meshStandardMaterial color="#272b30" metalness={0.65} roughness={0.4} />
          </mesh>
          <pointLight position={[0.2, 2.4, 0]} intensity={1.8} distance={7} color="#fde68a" />
        </group>
      </group>

      {/* Puente peatonal elevado conectando ambos andenes (z = -12.8) */}
      <group position={[0, 0, -12.8]}>
        {/* Pasarela horizontal sobre ambas vías */}
        <mesh position={[-2.1, 6.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[14.8, 0.28, 2.2]} />
          <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.45} />
        </mesh>
        {/* Barandas metálicas y vidriadas */}
        {[-1.02, 1.02].map((bz) => (
          <mesh key={`prail-${bz}`} position={[-2.1, 6.75, bz]}>
            <boxGeometry args={[14.8, 1.0, 0.06]} />
            <meshStandardMaterial color="#bae6fd" transparent opacity={0.38} roughness={0.15} />
          </mesh>
        ))}
        {/* Torres de escalera en ambos andenes */}
        {[5.1, -9.2].map((tx, idx) => (
          <group key={`ptower-${idx}`} position={[tx, 0.9, 0]}>
            {[-1.0, 1.0].map((pz) => (
              <mesh key={pz} position={[0, 2.7, pz]} castShadow>
                <boxGeometry args={[0.24, 5.4, 0.24]} />
                <meshStandardMaterial color="#1e2228" metalness={0.7} roughness={0.38} />
              </mesh>
            ))}
            {/* Rampa escalonada de acceso */}
            <mesh
              position={[0, 2.6, 1.8]}
              rotation={[0.68, 0, 0]}
              castShadow
            >
              <boxGeometry args={[1.6, 0.22, 6.4]} />
              <meshStandardMaterial color="#475569" metalness={0.45} roughness={0.55} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * Subestación eléctrica con transformadores, aisladores cerámicos y cerco perimetral.
 */
export function ElectricalSubstation({ position = [-13.8, 0, -9] }) {
  return (
    <group position={position}>
      {/* Losa de hormigón */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.2, 5.8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.88} />
      </mesh>

      {/* 2 Transformadores de alta tensión */}
      {[-1.3, 1.3].map((tz, i) => (
        <group key={`tr-${i}`} position={[0, 0.2, tz]}>
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.6, 1.8, 1.4]} />
            <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.45} />
          </mesh>
          {/* Aletas de refrigeración */}
          {[-0.5, 0, 0.5].map((rz) => (
            <mesh key={rz} position={[0.85, 0.9, rz]} castShadow>
              <boxGeometry args={[0.14, 1.4, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.6} />
            </mesh>
          ))}
          {/* Aisladores cerámicos superiores */}
          {[-0.4, 0, 0.4].map((iz) => (
            <mesh key={iz} position={[0, 2.05, iz]} castShadow>
              <cylinderGeometry args={[0.09, 0.12, 0.5, 10]} />
              <meshStandardMaterial color="#b45309" roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Tablero eléctrico con luz piloto verde */}
      <mesh position={[1.55, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 1.5, 1.2]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[1.81, 1.45, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2.5} />
      </mesh>

      {/* Postes del cerco perimetral */}
      {[-2.2, 2.2].map((cx) =>
        [-2.8, 0, 2.8].map((cz) => (
          <mesh key={`fp-${cx}-${cz}`} position={[cx, 0.95, cz]}>
            <cylinderGeometry args={[0.04, 0.04, 1.7, 8]} />
            <meshStandardMaterial color="#1e2228" metalness={0.7} />
          </mesh>
        ))
      )}
    </group>
  );
}

/**
 * Zona exterior trasera de la estación: plaza pavimentada, parada de colectivos, bicicletero y árboles.
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

      {/* Parada de Colectivos (lado derecho z = 6.5) */}
      <group position={[1.2, 0.12, 6.5]}>
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.06, 2.3, 3.6]} />
          <meshStandardMaterial color="#bae6fd" transparent opacity={0.35} roughness={0.12} />
        </mesh>
        <mesh position={[0.45, 2.45, 0]} castShadow>
          <boxGeometry args={[1.6, 0.1, 4.0]} />
          <meshStandardMaterial color="#1e293b" metalness={0.65} roughness={0.35} />
        </mesh>
        {[-1.7, 1.7].map((pz) => (
          <mesh key={pz} position={[0, 1.2, pz]} castShadow>
            <boxGeometry args={[0.1, 2.4, 0.1]} />
            <meshStandardMaterial color="#1e2228" metalness={0.7} />
          </mesh>
        ))}
        {/* Poste indicador de parada */}
        <mesh position={[1.1, 1.4, 2.2]} castShadow>
          <cylinderGeometry args={[0.045, 0.045, 2.8, 8]} />
          <meshStandardMaterial color="#0284c7" metalness={0.5} />
        </mesh>
        <mesh position={[1.1, 2.65, 2.2]}>
          <boxGeometry args={[0.06, 0.5, 0.45]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0.5, 2.25, 0]} intensity={1.8} distance={7} color="#fde68a" />
      </group>

      {/* Bicicletero cubierto (lado izquierdo z = -6.5) */}
      <group position={[1.0, 0.12, -6.5]}>
        {[-1.6, 1.6].map((pz) => (
          <mesh key={pz} position={[0, 1.1, pz]} castShadow>
            <boxGeometry args={[0.08, 2.2, 0.08]} />
            <meshStandardMaterial color="#1e2228" metalness={0.7} />
          </mesh>
        ))}
        <mesh position={[0.2, 2.22, 0]} rotation={[0, 0, -0.1]} castShadow>
          <boxGeometry args={[1.6, 0.08, 3.6]} />
          <meshStandardMaterial color="#334155" metalness={0.6} />
        </mesh>
        {/* Arcos porta-bicicletas y bicicletas simples */}
        {[-1.0, -0.3, 0.4, 1.1].map((bz, idx) => (
          <group key={`bk-${idx}`} position={[0.1, 0.35, bz]}>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.24, 0.025, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.75} />
            </mesh>
            {/* Ruedas de bicicleta */}
            {[-0.3, 0.3].map((wx) => (
              <mesh key={wx} position={[wx, 0, 0.06]}>
                <torusGeometry args={[0.2, 0.025, 8, 16]} />
                <meshStandardMaterial color="#0f172a" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Árboles urbanos en maceteros */}
      {[-11.5, -1.5, 1.5, 11.5].map((tz, i) => (
        <group key={`tree-${i}`} position={[2.2, 0.12, tz]}>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.4, 0.5, 10]} />
            <meshStandardMaterial color="#334155" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.14, 1.4, 8]} />
            <meshStandardMaterial color="#5c3d28" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.05, 0]} castShadow>
            <dodecahedronGeometry args={[0.75, 1]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#2f6b3c' : '#3f854d'} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
