import { useGameStore } from '../store/gameStore.js';

export default function StatsModal() {
  const statsOpen = useGameStore((s) => s.statsOpen);
  const setStatsOpen = useGameStore((s) => s.setStatsOpen);
  const totalAnswered = useGameStore((s) => s.totalAnswered);
  const totalCorrect = useGameStore((s) => s.totalCorrect);
  const bestStreak = useGameStore((s) => s.bestStreak);
  const upgrades = useGameStore((s) => s.upgrades);
  const catalog = useGameStore((s) => s.catalog);
  const unlockedTrains = useGameStore((s) => s.unlockedTrains);
  const trainsCatalog = useGameStore((s) => s.trainsCatalog);
  const passiveIncomePerTrain = useGameStore((s) => s.passiveIncomePerTrain);
  const achievements = useGameStore((s) => s.achievements);

  if (!statsOpen) return null;

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <div className="modal-backdrop" onClick={() => setStatsOpen(false)}>
      <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shop-header">
          <div>
            <h2>Estadísticas y Logros</h2>
            <p>Tu progreso en la Estación Trivia 3D</p>
          </div>
          <div className="shop-header-right">
            <button className="btn-close" onClick={() => setStatsOpen(false)}>
              ✕
            </button>
          </div>
        </div>

        <div className="stats-summary-grid">
          <div className="summary-box">
            <strong>{accuracy}%</strong>
            <span>Precisión ({totalCorrect}/{totalAnswered})</span>
          </div>
          <div className="summary-box">
            <strong>🔥 {bestStreak}</strong>
            <span>Mejor Racha</span>
          </div>
          <div className="summary-box">
            <strong>+{passiveIncomePerTrain} 🪙</strong>
            <span>Ingreso pasivo / tren</span>
          </div>
          <div className="summary-box">
            <strong>{upgrades.length}/{catalog.length}</strong>
            <span>Mejoras • {unlockedTrains.length}/{trainsCatalog.length} Trenes</span>
          </div>
        </div>

        <h3 className="achievements-title">Logros</h3>
        <div className="upgrades-list">
          {achievements.map((ach) => (
            <div key={ach.id} className={`upgrade-card ${ach.unlocked ? 'unlocked' : ''}`}>
              <div className="upgrade-icon">{ach.icon}</div>
              <div className="upgrade-info">
                <h3>{ach.name}</h3>
                <p>{ach.description}</p>
              </div>
              <div className="upgrade-action">
                {ach.unlocked ? (
                  <span className="unlocked-tag">✓ +{ach.reward} 🪙</span>
                ) : (
                  <span className="locked-reward">🪙 +{ach.reward}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
