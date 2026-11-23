import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore.js';

const MAX_POOL = 16;
const PASSENGER_COLORS = ['#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb7185'];

/**
 * Pool de pasajeros autónomos que descienden al responder bien y caminan por waypoints
 * respetando ocupación de los puntos de interés (sin superponerse ni filtrar memoria).
 */
export default function Passengers() {
  const passengerWave = useGameStore((s) => s.passengerWave);
  const upgrades = useGameStore((s) => s.upgrades);
  const lastWaveIdRef = useRef(0);

  const meshRefs = useRef([]);

  // Puntos de interés dinámicos según mejoras desbloqueadas + puntos base
  const pois = useMemo(() => {
    const list = [
      { id: 'platform-n', pos: new THREE.Vector3(4.2, 0.9, -9), occupied: false },
      { id: 'platform-s', pos: new THREE.Vector3(4.2, 0.9, 9), occupied: false },
    ];
    if (upgrades.includes('benches')) {
      list.push(
        { id: 'bench-1', pos: new THREE.Vector3(7.2, 0.9, -7.0), occupied: false },
        { id: 'bench-2', pos: new THREE.Vector3(7.2, 0.9, 7.0), occupied: false }
      );
    }
    if (upgrades.includes('bench_curved')) {
      list.push(
        { id: 'curved-1', pos: new THREE.Vector3(4.6, 0.9, -9.5), occupied: false },
        { id: 'curved-2', pos: new THREE.Vector3(4.6, 0.9, 9.5), occupied: false }
      );
    }
    if (upgrades.includes('bench_double')) {
      list.push(
        { id: 'double-1', pos: new THREE.Vector3(3.6, 0.9, -6.8), occupied: false },
        { id: 'double-2', pos: new THREE.Vector3(3.6, 0.9, 6.8), occupied: false }
      );
    }
    if (upgrades.includes('ticket_kiosk')) {
      list.push({ id: 'kiosk', pos: new THREE.Vector3(6.4, 0.9, -11.5), occupied: false });
    }
    if (upgrades.includes('totem_screens')) {
      list.push(
        { id: 'totem-1', pos: new THREE.Vector3(4.1, 0.9, -1.8), occupied: false },
        { id: 'totem-2', pos: new THREE.Vector3(4.1, 0.9, 12.2), occupied: false }
      );
    }
    if (upgrades.includes('cafe')) {
      list.push({ id: 'cafe', pos: new THREE.Vector3(5.3, 0.9, 2.2), occupied: false });
    }
    if (upgrades.includes('turnstiles')) {
      list.push({ id: 'turnstiles', pos: new THREE.Vector3(8.8, 0.9, 0), occupied: false });
    }
    if (upgrades.includes('bookstore')) {
      list.push({ id: 'bookstore', pos: new THREE.Vector3(8.8, 0.9, -7.0), occupied: false });
    }
    if (upgrades.includes('flower_shop')) {
      list.push({ id: 'flower', pos: new THREE.Vector3(8.8, 0.9, 7.0), occupied: false });
    }
    return list;
  }, [upgrades]);

  // Pool mutable sin setState en cada frame
  const agentsRef = useRef(
    Array.from({ length: MAX_POOL }, (_, idx) => ({
      active: false,
      state: 'IDLE', // TO_CENTER -> TO_POI -> STAY -> TO_EXIT
      pos: new THREE.Vector3(2.4, 0.9, 0),
      target: new THREE.Vector3(4.2, 0.9, 0),
      poiIndex: -1,
      waitTimer: 0,
      speed: 2.1 + (idx % 3) * 0.35,
      phaseOffset: idx * 1.1,
      color: PASSENGER_COLORS[idx % PASSENGER_COLORS.length],
    }))
  );

  // Cuando llega una nueva oleada por respuesta correcta, activar 3–5 pasajeros
  useEffect(() => {
    if (!passengerWave.id || passengerWave.id === lastWaveIdRef.current) return;
    lastWaveIdRef.current = passengerWave.id;

    let toSpawn = passengerWave.count;
    for (const agent of agentsRef.current) {
      if (toSpawn <= 0) break;
      if (!agent.active) {
        const doorZ = (Math.random() - 0.5) * 4.5;
        agent.active = true;
        agent.state = 'TO_CENTER';
        agent.pos.set(2.3, 0.9, doorZ);
        agent.target.set(3.8 + Math.random() * 0.8, 0.9, doorZ * 0.5);
        agent.poiIndex = -1;
        agent.waitTimer = 0;
        toSpawn -= 1;
      }
    }
  }, [passengerWave]);

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clock.getElapsedTime();

    agentsRef.current.forEach((agent, idx) => {
      const group = meshRefs.current[idx];
      if (!group) return;

      if (!agent.active) {
        group.visible = false;
        return;
      }

      group.visible = true;

      if (agent.state === 'STAY') {
        agent.waitTimer -= dt;
        group.position.set(agent.pos.x, agent.pos.y + Math.abs(Math.sin(t * 3 + agent.phaseOffset)) * 0.06, agent.pos.z);

        if (agent.waitTimer <= 0) {
          if (agent.poiIndex >= 0 && pois[agent.poiIndex]) {
            pois[agent.poiIndex].occupied = false;
          }
          agent.poiIndex = -1;
          agent.state = 'TO_EXIT';
          agent.target.set(8.8, 0.9, (Math.random() - 0.5) * 6);
        }
        return;
      }

      const dx = agent.target.x - agent.pos.x;
      const dz = agent.target.z - agent.pos.z;
      const dist = Math.hypot(dx, dz);

      if (dist < 0.18) {
        if (agent.state === 'TO_CENTER') {
          // Buscar un POI libre para evitar superposiciones
          const freeIndices = pois
            .map((p, i) => (p.occupied ? -1 : i))
            .filter((i) => i !== -1);

          if (freeIndices.length > 0) {
            const chosen = freeIndices[Math.floor(Math.random() * freeIndices.length)];
            pois[chosen].occupied = true;
            agent.poiIndex = chosen;
            agent.target.copy(pois[chosen].pos);
          } else {
            agent.target.set(5 + Math.random() * 2, 0.9, (Math.random() - 0.5) * 10);
          }
          agent.state = 'TO_POI';
        } else if (agent.state === 'TO_POI') {
          agent.state = 'STAY';
          agent.waitTimer = 4 + Math.random() * 2.5; // 4 a 6.5 segundos
        } else if (agent.state === 'TO_EXIT') {
          agent.active = false;
          group.visible = false;
        }
      } else {
        const step = Math.min(dist, agent.speed * dt);
        agent.pos.x += (dx / dist) * step;
        agent.pos.z += (dz / dist) * step;
        const bob = Math.abs(Math.sin(t * 9 + agent.phaseOffset)) * 0.1;
        group.position.set(agent.pos.x, agent.pos.y + bob, agent.pos.z);
        group.rotation.y = Math.atan2(dx, dz);
      }
    });
  });

  return (
    <group>
      {agentsRef.current.map((agent, idx) => (
        <group
          key={idx}
          ref={(el) => {
            meshRefs.current[idx] = el;
          }}
          visible={false}
        >
          {/* Cuerpo del pasajero */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <capsuleGeometry args={[0.18, 0.38, 6, 10]} />
            <meshStandardMaterial color={agent.color} roughness={0.5} />
          </mesh>
          {/* Cabeza */}
          <mesh position={[0, 0.95, 0]} castShadow>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#fde68a" roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
