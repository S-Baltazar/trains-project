import { lazy, Suspense, useEffect } from 'react';
import StationCanvas from './components/StationCanvas.jsx';
import HUD from './components/HUD.jsx';
import TriviaModal from './components/TriviaModal.jsx';
import { useGameStore } from './store/gameStore.js';
import './App.css';

const UpgradeShop = lazy(() => import('./components/UpgradeShop.jsx'));
const TrainShopModal = lazy(() => import('./components/TrainShopModal.jsx'));
const StatsModal = lazy(() => import('./components/StatsModal.jsx'));

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
      <Suspense fallback={null}>
        <UpgradeShop />
        <TrainShopModal />
        <StatsModal />
      </Suspense>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </main>
  );
}
