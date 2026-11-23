import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StationEnvironment from './StationEnvironment.jsx';
import Train from './Train.jsx';
import Passengers from './Passengers.jsx';
import WeatherEffects from './WeatherEffects.jsx';
import { useGameStore } from '../store/gameStore.js';

const SKY_THEMES = {
  night: {
    bg: '#162033',
    hemiSky: '#bae6fd',
    hemiGround: '#334155',
    hemiInt: 0.85,
    sunColor: '#e2e8f0',
    sunInt: 1.35,
    fillInt: 0.65,
  },
  day: {
    bg: '#7dd3fc',
    hemiSky: '#f0f9ff',
    hemiGround: '#64748b',
    hemiInt: 1.25,
    sunColor: '#fffbeb',
    sunInt: 2.0,
    fillInt: 0.85,
  },
  sunset: {
    bg: '#3b2548',
    hemiSky: '#fdba74',
    hemiGround: '#334155',
    hemiInt: 0.95,
    sunColor: '#fb923c',
    sunInt: 1.55,
    fillInt: 0.6,
  },
};

const CAMERA_TARGETS = {
  overview: { pos: [16, 11, 18], target: [3, 1.5, 0] },
  platform: { pos: [-7, 5.5, 11], target: [8.5, 2.2, 0] },
  track: { pos: [-11, 5.2, 16], target: [0, 1.8, -2] },
};

function CameraRig({ controlsRef }) {
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const { camera } = useThree();

  useEffect(() => {
    const cfg = CAMERA_TARGETS[cameraPreset] || CAMERA_TARGETS.overview;
    camera.position.set(...cfg.pos);
    if (controlsRef.current) {
      controlsRef.current.target.set(...cfg.target);
      controlsRef.current.update();
    }
  }, [cameraPreset, camera, controlsRef]);

  return null;
}

/**
 * Lienzo 3D principal con cámara orbital, presets de cámara y ciclo día/tarde/noche.
 */
export default function StationCanvas() {
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const theme = SKY_THEMES[timeOfDay] || SKY_THEMES.night;
  const controlsRef = useRef(null);

  return (
    <Canvas
      shadows
      camera={{ position: [16, 11, 18], fov: 45 }}
      className="scene-canvas"
    >
      <color attach="background" args={[theme.bg]} />
      <fog attach="fog" args={[theme.bg, 45, 105]} />

      <hemisphereLight args={[theme.hemiSky, theme.hemiGround, theme.hemiInt]} />
      <directionalLight
        position={[18, 26, 14]}
        intensity={theme.sunInt}
        color={theme.sunColor}
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
      <directionalLight position={[-16, 14, -10]} intensity={theme.fillInt} color="#dbeafe" />

      <StationEnvironment />
      <Train />
      <Passengers />
      <WeatherEffects />
      <CameraRig controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        target={[3, 1.5, 0]}
        enablePan={false}
        minPolarAngle={0.22}
        maxPolarAngle={Math.PI / 2 - 0.08}
        minDistance={8}
        maxDistance={36}
      />
    </Canvas>
  );
}
