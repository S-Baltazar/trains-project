import { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';

export default function SandboxModal() {
  const sandboxModalOpen = useGameStore((s) => s.sandboxModalOpen);
  const setSandboxModalOpen = useGameStore((s) => s.setSandboxModalOpen);
  const activateSandbox = useGameStore((s) => s.activateSandbox);

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!sandboxModalOpen) return null;

  const handleClose = () => {
    setPassword('');
    setError('');
    setSandboxModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim() || loading) return;
    setLoading(true);
    setError('');
    const ok = await activateSandbox(password.trim());
    setLoading(false);
    if (ok) {
      setPassword('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="shop-modal sandbox-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shop-header">
          <div>
            <h2>🔒 Modo Sandbox</h2>
            <p>Ingresa la contraseña para desbloquear todas las mejoras y trenes</p>
          </div>
          <div className="shop-header-right">
            <button className="btn-close" onClick={handleClose}>
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="sandbox-form">
          <input
            type="password"
            className="sandbox-input"
            placeholder="Contraseña..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="sandbox-error">{error}</p>}
          <div className="sandbox-actions">
            <button type="button" className="btn-close-text" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-buy" disabled={loading || !password.trim()}>
              {loading ? 'Verificando...' : '🔓 Activar Sandbox'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
