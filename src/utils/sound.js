// Web Audio API Sound Effects Engine — Zero Dependencies
// All sounds synthesized procedurally

let audioCtx = null;
let isMuted = false;

function getAudioCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMuted(muted) {
  isMuted = muted;
}

export function getMuted() {
  return isMuted;
}

export function toggleMute() {
  isMuted = !isMuted;
  return isMuted;
}

function safePlay(fn) {
  if (isMuted) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    fn(ctx);
  } catch {
    // Audio synthesis failed silently
  }
}

// ── playClick: cute pop when hovering/clicking choices ──────────────────────
export function playClick() {
  safePlay(ctx => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.type = 'sine';
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  });
}

// ── playAlarm: urgent sci-fi siren for solar storms ─────────────────────────
export function playAlarm() {
  safePlay(ctx => {
    const times = [0, 0.3, 0.6, 0.9];
    times.forEach(t => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ctx.currentTime + t);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + t + 0.15);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + t + 0.3);
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + t + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + t + 0.3);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.35);
    });
  });
}

// ── playSuccess: cheerful chime when advancing a Sol ────────────────────────
export function playSuccess() {
  safePlay(ctx => {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.45);
    });
  });
}

// ── playDamage: low rumble when a meter drops dangerously ───────────────────
export function playDamage() {
  safePlay(ctx => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.55);
  });
}

// ── playVictory: full fanfare for mission complete ───────────────────────────
export function playVictory() {
  safePlay(ctx => {
    const melody = [
      [523.25, 0], [659.25, 0.15], [783.99, 0.3], [1046.50, 0.45],
      [1046.50, 0.6], [1174.66, 0.75], [1318.51, 0.9],
    ];
    melody.forEach(([freq, t]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + t);
      gain.gain.setValueAtTime(0.35, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.35);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.4);
    });
  });
}

// ── playGameOver: dramatic fail sound ───────────────────────────────────────
export function playGameOver() {
  safePlay(ctx => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1.35);
  });
}
