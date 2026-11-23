import { useGameStore } from '../store/gameStore.js';

export default function UpgradeShop() {
  const shopOpen = useGameStore((s) => s.shopOpen);
  const setShopOpen = useGameStore((s) => s.setShopOpen);
  const coins = useGameStore((s) => s.coins);
  const catalog = useGameStore((s) => s.catalog);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  if (!shopOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setShopOpen(false)}>
      <div className="shop-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shop-header">
          <div>
            <h2>Mejoras de la Estación</h2>
            <p>Invierte tus monedas en mejoras visibles en el mundo 3D</p>
          </div>
          <div className="shop-header-right">
            <span className="shop-balance">🪙 {coins}</span>
            <button className="btn-close" onClick={() => setShopOpen(false)}>
              ✕
            </button>
          </div>
        </div>

        <div className="upgrades-list">
          {catalog.map((item) => {
            const canAfford = coins >= item.cost;
            return (
              <div key={item.id} className={`upgrade-card ${item.unlocked ? 'unlocked' : ''}`}>
                <div className="upgrade-icon">{item.icon}</div>
                <div className="upgrade-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>
                <div className="upgrade-action">
                  {item.unlocked ? (
                    <span className="unlocked-tag">✓ Instalado</span>
                  ) : (
                    <button
                      className="btn-buy"
                      disabled={!canAfford}
                      onClick={() => buyUpgrade(item.id)}
                    >
                      🪙 {item.cost}
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
