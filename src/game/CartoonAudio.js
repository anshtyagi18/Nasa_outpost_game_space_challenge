/**
 * CartoonAudio.js — Web Audio API Retro Cartoon Sound Synthesizer
 *
 * Provides instant, zero-latency cartoon sound effects for kids (ages 7–12):
 *   - Bouncy card pops on hover
 *   - Ta-daa! celebratory fanfares on success
 *   - Funny cartoon slide whistle / womp-womp on comic fails
 *   - Comic alert sirens and electric zaps
 */

class CartoonAudio {
  constructor() {
    this.ctx = null
    this.muted = false
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('save_astronaut_muted')
        if (saved !== null) this.muted = saved === 'true'
      } catch {}
    }
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  isMuted() {
    return this.muted
  }

  toggleMute() {
    this.muted = !this.muted
    try {
      localStorage.setItem('save_astronaut_muted', String(this.muted))
    } catch {}
    return this.muted
  }

  /** Soft juicy bubble pop when hovering over cards */
  playPop() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.05)

    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.05)
  }

  /** Bouncy cartoon click / boing */
  playClick() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(260, now)
    osc.frequency.linearRampToValueAtTime(520, now + 0.06)
    osc.frequency.linearRampToValueAtTime(320, now + 0.12)

    gain.gain.setValueAtTime(0.14, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  }

  /** Ta-daa! Joyful cartoon celebration on correct choice */
  playSuccess() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    // C major triumph: C5, E5, G5, C6
    const notes = [
      { f: 523.25, d: 0.1, t: 0 },
      { f: 659.25, d: 0.1, t: 0.1 },
      { f: 783.99, d: 0.12, t: 0.2 },
      { f: 1046.50, d: 0.45, t: 0.32 },
    ]

    notes.forEach((n) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + n.t

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(n.f, start)

      gain.gain.setValueAtTime(0.001, start)
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + n.d)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(start)
      osc.stop(start + n.d + 0.02)
    })
  }

  /** Funny cartoon slide whistle / womp-womp fail sound */
  playFail() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    // Descending cartoon slide whistle + bonk buzzer
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.38)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.4)

    // Second cartoon bonk
    setTimeout(() => {
      if (this.muted || !this.ctx) return
      const t = this.ctx.currentTime
      const o2 = this.ctx.createOscillator()
      const g2 = this.ctx.createGain()

      o2.type = 'square'
      o2.frequency.setValueAtTime(110, t)
      o2.frequency.exponentialRampToValueAtTime(55, t + 0.2)

      g2.gain.setValueAtTime(0.2, t)
      g2.gain.exponentialRampToValueAtTime(0.001, t + 0.2)

      o2.connect(g2)
      g2.connect(this.ctx.destination)

      o2.start(t)
      o2.stop(t + 0.2)
    }, 200)
  }

  /** Comic scene alert */
  playSiren() {
    if (this.muted) return
    const ctx = this.init()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.linearRampToValueAtTime(880, now + 0.15)
    osc.frequency.linearRampToValueAtTime(600, now + 0.3)

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.32)
  }
}

export const cartoonAudio = new CartoonAudio()
export default cartoonAudio

