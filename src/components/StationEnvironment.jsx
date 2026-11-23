import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore.js';
import StationBuildingAndCanopy from './station/StationBuildingAndCanopy.jsx';
import {
  AtmKioskModule,
  BookstoreNewsstand,
  ClassicLampPost,
  CurvedErgonomicBench,
  DepartureTotem,
  DoubleSidedBench,
  FlowerShopPavilion,
  IslandCoffeeBar,
  SlattedLinearBench,
  TurnstileGateSet,
} from './station/StationFurniture.jsx';
import {
  ElectricalSubstation,
  ExteriorBusAndBikePlaza,
  SecondPlatformAndBridge,
} from './station/StationInfrastructure.jsx';
import { getBrickTexture, getClockFaceTexture } from './station/textures.js';

/**
 * Estación 3D, vías, andén y mejoras visuales desbloqueables con monedas.
 */
export default function StationEnvironment() {
  const upgrades = useGameStore((s) => s.upgrades);
  const towerMinuteRef = useRef(null);
  const towerHourRef = useRef(null);

  const brickTex = useMemo(() => getBrickTexture(), []);
  const clockTex = useMemo(() => getClockFaceTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (towerMinuteRef.current) towerMinuteRef.current.rotation.z = -t * 0.4;
    if (towerHourRef.current) towerHourRef.current.rotation.z = -t * 0.05;
  });

  const hasBenches = upgrades.includes('benches');
  const hasCurvedBenches = upgrades.includes('bench_curved');
  const hasDoubleBenches = upgrades.includes('bench_double');
  const hasLamps = upgrades.includes('lamps');
  const hasKiosk = upgrades.includes('ticket_kiosk');
  const hasTotem = upgrades.includes('totem_screens');
  const hasCafe = upgrades.includes('cafe');
  const hasClockTower = upgrades.includes('clock_tower');
  const hasTurnstiles = upgrades.includes('turnstiles');
  const hasBookstore = upgrades.includes('bookstore');
  const hasFlowerShop = upgrades.includes('flower_shop');
  const hasExteriorPlaza = upgrades.includes('exterior_plaza');
  const hasSubstation = upgrades.includes('substation');
  const hasSecondPlatform = upgrades.includes('second_platform');

  return (
    <group>
      {/* Estación base fiel a 06_modulo_anden_3d.jpg */}
      <StationBuildingAndCanopy />

      {/* MEJORA 1: Bancos Lineales de Listones (01_banco_lineal_listones_3d.jpg) */}
      {hasBenches && (
        <>
          <SlattedLinearBench position={[6.6, 0.9, -7.0]} />
          <SlattedLinearBench position={[6.6, 0.9, 7.0]} />
        </>
      )}

      {/* MEJORA 2: Bancos Ergonómicos Curvos (02_banco_ergonomico_curvo_3d.jpg) */}
      {hasCurvedBenches && (
        <>
          <CurvedErgonomicBench position={[5.4, 0.9, -9.5]} />
          <CurvedErgonomicBench position={[5.4, 0.9, 9.5]} />
        </>
      )}

      {/* MEJORA 3: Bancos Doble Faz (03_banco_doble_faz_3d.jpg) */}
      {hasDoubleBenches && (
        <>
          <DoubleSidedBench position={[4.5, 0.9, -6.8]} />
          <DoubleSidedBench position={[4.5, 0.9, 6.8]} />
        </>
      )}

      {/* MEJORA 4: Farolas Clásicas (13_faroles_iluminacion_3d.jpg) */}
      {hasLamps &&
        [-13.5, -5.0, 5.0, 13.5].map((lz) => (
          <ClassicLampPost key={lz} position={[2.6, 0.9, lz]} />
        ))}

      {/* MEJORA 5: Módulo de Cajeros y Boletería (10_modulo_cajeros_3d.jpg) */}
      {hasKiosk && <AtmKioskModule position={[7.6, 0.9, -11.5]} />}

      {/* MEJORA 6: Tótem de Pantallas de Trenes (11_totem_pantallas_trenes_3d.jpg) */}
      {hasTotem && (
        <>
          <DepartureTotem position={[4.8, 0.9, -1.8]} />
          <DepartureTotem position={[4.8, 0.9, 12.2]} />
        </>
      )}

      {/* MEJORA 7: Barra de Café Isla (08_barra_cafe_isla_3d.jpg) */}
      {hasCafe && <IslandCoffeeBar position={[6.8, 0.9, 2.2]} />}

      {/* MEJORA 8: Molinetes, Cestos y Mapa en el arco central frontal (04_molinetes_cestos_mapa_3d.jpg) */}
      {hasTurnstiles && (
        <TurnstileGateSet position={[10.0, 0.9, -0.45]} rotation={[0, -Math.PI / 2, 0]} />
      )}

      {/* MEJORA 9: Librería y Revistero en el arco izquierdo frontal (03_libreria_revistero_3d.jpg) */}
      {hasBookstore && (
        <BookstoreNewsstand position={[9.95, 0.9, -7.0]} rotation={[0, -Math.PI / 2, 0]} />
      )}

      {/* MEJORA 10: Florería Verde Metálica en el arco derecho frontal (02_floreria_verde_metalica_3d.jpg) */}
      {hasFlowerShop && (
        <FlowerShopPavilion position={[9.95, 0.9, 7.0]} rotation={[0, -Math.PI / 2, 0]} />
      )}

      {/* MEJORA 11: Plaza Exterior, Parada de Colectivos y Bicicletero */}
      {hasExteriorPlaza && <ExteriorBusAndBikePlaza />}

      {/* MEJORA 12: Subestación Eléctrica */}
      {hasSubstation && <ElectricalSubstation />}

      {/* MEJORA 13: Segundo Andén, Doble Vía y Puente Peatonal */}
      {hasSecondPlatform && <SecondPlatformAndBridge />}

      {/* MEJORA 8: Torre del Reloj sobre el edificio histórico */}
      {hasClockTower && (
        <group position={[10.5, 6.5, 0]}>
          <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.3, 3.8, 2.3]} />
            <meshStandardMaterial map={brickTex} roughness={0.85} />
          </mesh>
          <mesh position={[0, 3.9, 0]} castShadow>
            <boxGeometry args={[2.5, 0.2, 2.5]} />
            <meshStandardMaterial color="#b5aa97" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[2.05, 1.8, 4]} />
            <meshStandardMaterial color="#272b30" metalness={0.5} roughness={0.45} />
          </mesh>
          {/* Esfera del reloj */}
          <mesh position={[-1.18, 2.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.72, 24]} />
            <meshStandardMaterial map={clockTex} emissive="#fef3c7" emissiveIntensity={0.25} />
          </mesh>
          <group position={[-1.2, 2.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <mesh ref={towerMinuteRef}>
              <boxGeometry args={[0.05, 0.52, 0.02]} />
              <meshStandardMaterial color="#111827" />
            </mesh>
            <mesh ref={towerHourRef}>
              <boxGeometry args={[0.07, 0.34, 0.02]} />
              <meshStandardMaterial color="#991b1b" />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
}
