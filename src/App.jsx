import { useEffect } from 'react';
import StationCanvas from './components/StationCanvas.jsx';
import HUD from './components/HUD.jsx';
import TriviaModal from './components/TriviaModal.jsx';
import UpgradeShop from './components/UpgradeShop.jsx';
import TrainShopModal from './components/TrainShopModal.jsx';
import { useGameStore } from './store/gameStore.js';
import './App.css';

export default function App() {
  const fetchStation = useGameStore((s) => s.fetchStation);
  const tickTimers = useGameStore((s) => s.tickTimers);
  const toast = useGameStore((s) => s.toast);
  const clearToast = useGameStore((s) => s.clearToast);

  useEffect(() => {
    fetchStation();
    const interval = setInterval(tickTimers, 200);
    return () => clearInterval(interval);
  }, [fetchStation, tickTimers]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(clearToast, 3200);
    return () => clearTimeout(id);
  }, [toast, clearToast]);

  return (
    <main className="app-container">
      <StationCanvas />
      <HUD />
      <TriviaModal />
      <UpgradeShop />
      <TrainShopModal />

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </main>
  );
}
