/**
 * Efectos de sonido sintetizados con Web Audio API (sin archivos externos).
 */
let audioCtx = null;

function getCtx() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', gainVal = 0.12, delay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(gainVal, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration);
}

export function playStationBell(muted) {
  if (muted) return;
  playTone(880, 0.28, 'triangle', 0.1, 0);
  playTone(1174.66, 0.42, 'triangle', 0.1, 0.16);
}

export function playCoinSound(muted) {
  if (muted) return;
  playTone(987.77, 0.12, 'sine', 0.12, 0);
  playTone(1318.51, 0.28, 'sine', 0.12, 0.09);
}

export function playErrorSound(muted) {
  if (muted) return;
  playTone(240, 0.18, 'sawtooth', 0.08, 0);
  playTone(185, 0.26, 'sawtooth', 0.08, 0.12);
}

export function playClickSound(muted) {
  if (muted) return;
  playTone(620, 0.07, 'sine', 0.06, 0);
}
