import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';

const PHASE_LABELS = {
  WAITING: 'Esperando próximo tren',
  ARRIVING: '¡Tren entrando al andén!',
  TRIVIA: 'El Capitán pregunta...',
  RESULT: 'Resultado de la trivia',
  DEPARTING: 'El tren está partiendo',
};

const TIME_LABELS = {
  night: '🌙 Noche',
  day: '☀️ Día',
  sunset: '🌅 Tarde',
};

const CAMERA_PRESETS = [
  { id: 'overview', label: '🎥 General' },
  { id: 'platform', label: '🏪 Andén' },
  { id: 'track', label: '🚆 Vía' },
];

const WEATHER_LABELS = {
  clear: '🌤️ Despejado',
  rain: '🌧️ Lluvia',
  rush: '⚡ Hora Pico',
};

const DIFFICULTIES = ['Todas', 'Fácil', 'Media', 'Difícil'];

export default function HUD() {
  const phase = useGameStore((s) => s.phase);
  const waitEndsAt = useGameStore((s) => s.waitEndsAt);
  const coins = useGameStore((s) => s.coins);
  const streak = useGameStore((s) => s.streak);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const passiveIncomePerTrain = useGameStore((s) => s.passiveIncomePerTrain);
  const stationLevel = useGameStore((s) => s.stationLevel);
  const satisfaction = useGameStore((s) => s.satisfaction);
  const weatherEvent = useGameStore((s) => s.weatherEvent);
  const cycleWeather = useGameStore((s) => s.cycleWeather);
  const difficulty = useGameStore((s) => s.difficulty);
  const setDifficulty = useGameStore((s) => s.setDifficulty);
  const timeOfDay = useGameStore((s) => s.timeOfDay);
  const cycleTimeOfDay = useGameStore((s) => s.cycleTimeOfDay);
  const cameraPreset = useGameStore((s) => s.cameraPreset);
  const setCameraPreset = useGameStore((s) => s.setCameraPreset);
  const muted = useGameStore((s) => s.muted);
  const toggleMuted = useGameStore((s) => s.toggleMuted);
  const catalog = useGameStore((s) => s.catalog);
  const trainsCatalog = useGameStore((s) => s.trainsCatalog);
  const achievements = useGameStore((s) => s.achievements);
  const serverOnline = useGameStore((s) => s.serverOnline);
  const summonTrainNow = useGameStore((s) => s.summonTrainNow);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const setTrainShopOpen = useGameStore((s) => s.setTrainShopOpen);
  const setStatsOpen = useGameStore((s) => s.setStatsOpen);
  const setSandboxModalOpen = useGameStore((s) => s.setSandboxModalOpen);
  const sandboxMode = useGameStore((s) => s.sandboxMode);
  const showToast = useGameStore((s) => s.showToast);
  const resetStation = useGameStore((s) => s.resetStation);

  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (phase !== 'WAITING') return;
    const onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const tag = document.activeElement?.tagName;
        if (tag !== 'BUTTON' && tag !== 'INPUT') {
          e.preventDefault();
          summonTrainNow();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, summonTrainNow]);

  useEffect(() => {
    const update = () => {
      if (phase === 'WAITING' && waitEndsAt) {
        setSecondsLeft(Math.max(0, Math.ceil((waitEndsAt - Date.now()) / 1000)));
      }
    };
    update();
    const id = setInterval(update, 200);
    return () => clearInterval(id);
  }, [phase, waitEndsAt]);

  const affordableCount = catalog.filter((u) => !u.unlocked && coins >= u.cost).length;
  const affordableTrainsCount = trainsCatalog.filter((t) => !t.unlocked && coins >= t.cost).length;
  const unlockedAchCount = achievements.filter((a) => a.unlocked).length;

  const handleReset = () => {
    if (window.confirm('¿Reiniciar la estación y empezar de 0? Se perderán tus monedas, mejoras y trenes comprados.')) {
      resetStation();
    }
  };

  return (
    <>
      <header className="hud">
        <div className="hud-title-row">
          <div>
            <h1>Estación Trivia 3D</h1>
            <span className="station-level-tag">
              Nv. {stationLevel.level} • {stationLevel.title} • 😊 {satisfaction.percent}% (x{satisfaction.multiplier})
            </span>
          </div>
          <span className={`dot ${serverOnline ? 'online' : 'offline'}`} title={serverOnline ? 'Backend conectado' : 'Backend desconectado'} />
        </div>

        <div className="stats-grid">
          <div className="stat-pill coins">
            <span>🪙</span>
            <strong>{coins}</strong>
            <small>Monedas {passiveIncomePerTrain > 0 ? `(+${passiveIncomePerTrain}/tren)` : ''}</small>
          </div>
          <div className="stat-pill streak">
            <span>🔥</span>
            <strong>{streak}</strong>
            <small>Racha (Máx {bestStreak})</small>
          </div>
        </div>

        <div className="difficulty-row" title="Dificultad de la trivia">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={`diff-pill ${difficulty === d ? 'active' : ''}`}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="phase-box">
          <span className="phase-label">{PHASE_LABELS[phase]}</span>
          {phase === 'WAITING' && (
            <div className="countdown-row">
              <span className="countdown-time">⏱️ {secondsLeft}s</span>
              <button className="btn-secondary" onClick={summonTrainNow}>
                🚄 Llamar tren ahora
              </button>
            </div>
          )}
        </div>

        <div className="hud-toolbar">
          <button className="btn-mini" onClick={cycleTimeOfDay} title="Cambiar momento del día">
            {TIME_LABELS[timeOfDay]}
          </button>
          <button className="btn-mini" onClick={cycleWeather} title="Cambiar clima / evento">
            {WEATHER_LABELS[weatherEvent]}
          </button>
          {CAMERA_PRESETS.map((cam) => (
            <button
              key={cam.id}
              className={`btn-mini ${cameraPreset === cam.id ? 'active' : ''}`}
              onClick={() => setCameraPreset(cam.id)}
            >
              {cam.label}
            </button>
          ))}
          <button className="btn-mini" onClick={toggleMuted} title="Silenciar o activar sonido">
            {muted ? '🔇' : '🔊'}
          </button>
        </div>

        <p className="controls-hint">Teclas 1-4 en trivia • Enter/Espacio para llamar tren</p>
      </header>

      <div className="hud-actions">
        <button className="btn-shop" onClick={() => setStatsOpen(true)}>
          🏆 Logros
          <span className="badge">{unlockedAchCount}/{achievements.length || 6}</span>
        </button>
        <button className="btn-shop" onClick={() => setTrainShopOpen(true)}>
          🚆 Elegir Tren
          {affordableTrainsCount > 0 && <span className="badge">{affordableTrainsCount}</span>}
        </button>
        <button className="btn-shop" onClick={() => setShopOpen(true)}>
          🛠️ Mejorar Estación
          {affordableCount > 0 && <span className="badge">{affordableCount}</span>}
        </button>
        <button
          className={`btn-shop ${sandboxMode ? 'btn-sandbox-active' : ''}`}
          onClick={() =>
            sandboxMode
              ? showToast('El Modo Sandbox ya está activo', 'info')
              : setSandboxModalOpen(true)
          }
          title="Modo Sandbox con contraseña"
        >
          {sandboxMode ? '🔓 Sandbox' : '🔒'}
        </button>
        <button className="btn-shop btn-reset" onClick={handleReset} title="Reiniciar estación desde 0">
          🔄 Reiniciar Estación
        </button>
      </div>
    </>
  );
}
