import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';

const PHASE_LABELS = {
  WAITING: 'Esperando próximo tren',
  ARRIVING: '¡Tren entrando al andén!',
  TRIVIA: 'El Capitán pregunta...',
  RESULT: 'Resultado de la trivia',
  DEPARTING: 'El tren está partiendo',
};

export default function HUD() {
  const phase = useGameStore((s) => s.phase);
  const waitEndsAt = useGameStore((s) => s.waitEndsAt);
  const coins = useGameStore((s) => s.coins);
  const streak = useGameStore((s) => s.streak);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const catalog = useGameStore((s) => s.catalog);
  const trainsCatalog = useGameStore((s) => s.trainsCatalog);
  const serverOnline = useGameStore((s) => s.serverOnline);
  const summonTrainNow = useGameStore((s) => s.summonTrainNow);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const setTrainShopOpen = useGameStore((s) => s.setTrainShopOpen);
  const resetStation = useGameStore((s) => s.resetStation);

  const [secondsLeft, setSecondsLeft] = useState(30);

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

  const handleReset = () => {
    if (window.confirm('¿Reiniciar la estación y empezar de 0? Se perderán tus monedas, mejoras y trenes comprados.')) {
      resetStation();
    }
  };

  return (
    <>
      <header className="hud">
        <div className="hud-title-row">
          <h1>Estación Trivia 3D</h1>
          <span className={`dot ${serverOnline ? 'online' : 'offline'}`} title={serverOnline ? 'Backend conectado' : 'Backend desconectado'} />
        </div>

        <div className="stats-grid">
          <div className="stat-pill coins">
            <span>🪙</span>
            <strong>{coins}</strong>
            <small>Monedas</small>
          </div>
          <div className="stat-pill streak">
            <span>🔥</span>
            <strong>{streak}</strong>
            <small>Racha (Máx {bestStreak})</small>
          </div>
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

        <p className="controls-hint">Arrastra para rotar la cámara • Rueda para zoom</p>
      </header>

      <div className="hud-actions">
        <button className="btn-shop" onClick={() => setTrainShopOpen(true)}>
          🚆 Elegir Tren
          {affordableTrainsCount > 0 && <span className="badge">{affordableTrainsCount}</span>}
        </button>
        <button className="btn-shop" onClick={() => setShopOpen(true)}>
          🛠️ Mejorar Estación
          {affordableCount > 0 && <span className="badge">{affordableCount}</span>}
        </button>
        <button className="btn-shop btn-reset" onClick={handleReset} title="Reiniciar estación desde 0">
          🔄 Reiniciar Estación
        </button>
      </div>
    </>
  );
}
