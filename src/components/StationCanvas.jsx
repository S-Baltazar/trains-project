import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StationEnvironment from './StationEnvironment.jsx';
import Train from './Train.jsx';
import Passengers from './Passengers.jsx';

/**
 * Lienzo 3D principal con cámara orbital restringida e iluminación con sombras.
 */
export default function StationCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [16, 11, 18], fov: 45 }}
      className="scene-canvas"
    >
      <color attach="background" args={['#0f172a']} />
      <fog attach="fog" args={['#0f172a', 38, 95]} />

      <hemisphereLight args={['#bae6fd', '#1e293b', 0.65]} />
      <directionalLight
        position={[18, 26, 14]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={75}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />

      <StationEnvironment />
      <Train />
      <Passengers />

      <OrbitControls
        target={[3, 1.5, 0]}
        enablePan={false}
        minPolarAngle={0.22}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minDistance={9}
        maxDistance={34}
      />
    </Canvas>
  );
}
