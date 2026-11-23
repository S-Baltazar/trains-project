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
      <color attach="background" args={['#162033']} />
      <fog attach="fog" args={['#162033', 42, 100]} />

      <hemisphereLight args={['#bae6fd', '#334155', 0.85]} />
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
      {/* Luz de relleno frontal para iluminar la fachada y el fondo de la estación */}
      <directionalLight position={[-16, 14, -10]} intensity={0.65} color="#dbeafe" />

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
