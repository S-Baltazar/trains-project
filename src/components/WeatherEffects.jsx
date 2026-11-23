import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore.js';

/**
 * Partículas de lluvia 3D activas cuando el evento climático es "Día de Lluvia".
 */
export default function WeatherEffects() {
  const weatherEvent = useGameStore((s) => s.weatherEvent);
  const pointsRef = useRef(null);

  const positions = useMemo(() => {
    const count = 450;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 44;
      arr[i * 3 + 1] = Math.random() * 18 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 44;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (weatherEvent !== 'rain' || !pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const step = delta * 18;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) - step;
      if (y < 0.2) y = 18;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  if (weatherEvent !== 'rain') return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial color="#bae6fd" size={0.14} transparent opacity={0.65} />
    </points>
  );
}
