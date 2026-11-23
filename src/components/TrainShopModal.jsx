import { useGameStore } from '../store/gameStore.js';

export default function TrainShopModal() {
  const trainShopOpen = useGameStore((s) => s.trainShopOpen);
  const setTrainShopOpen = useGameStore((s) => s.setTrainShopOpen);
  const coins = useGameStore((s) => s.coins);
  const trainsCatalog = useGameStore((s) => s.trainsCatalog);
  const selectOrBuyTrain = useGameStore((s) => s.selectOrBuyTrain);

  if (!trainShopOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setTrainShopOpen(false)}>
      <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shop-header">
          <div>
            <h2>Elegir Tren</h2>
            <p>Compra nuevas formaciones con tus monedas o cambia el tren en servicio</p>
          </div>
          <div className="shop-header-right">
            <span className="shop-balance">🪙 {coins}</span>
            <button className="btn-close" onClick={() => setTrainShopOpen(false)}>
              ✕
            </button>
          </div>
        </div>

        <div className="upgrades-list">
          {trainsCatalog.map((train) => {
            const canAfford = coins >= train.cost;
            return (
              <div key={train.id} className={`upgrade-card ${train.unlocked ? 'unlocked' : ''}`}>
                <div className="upgrade-icon">{train.icon}</div>
                <div className="upgrade-info">
                  <h3>{train.name}</h3>
                  <p>{train.description}</p>
                </div>
                <div className="upgrade-action">
                  {train.selected ? (
                    <span className="unlocked-tag">✓ En servicio</span>
                  ) : train.unlocked ? (
                    <button
                      className="btn-select"
                      onClick={() => selectOrBuyTrain(train.id)}
                    >
                      Seleccionar
                    </button>
                  ) : (
                    <button
                      className="btn-buy"
                      disabled={!canAfford}
                      onClick={() => selectOrBuyTrain(train.id)}
                    >
                      🪙 {train.cost}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
