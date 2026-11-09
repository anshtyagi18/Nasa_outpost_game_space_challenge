/**
 * ParticleSystem.js — Arcade Visual FX Engine
 *
 * High-performance 2D canvas particle manager:
 *   - Thruster exhaust fire & smoke
 *   - Laser impact sparks
 *   - Debris / Asteroid shattering explosions
 *   - Floating combat & pickup numbers (+15 ⚡, -20 HP)
 *   - Shockwave expansion rings
 */

export class ParticleSystem {
  constructor() {
    this.particles = []
    this.floatTexts = []
    this.shockwaves = []
  }

  reset() {
    this.particles = []
    this.floatTexts = []
    this.shockwaves = []
  }

  /** Spawn thruster fire behind the rover */
  addThruster(x, y, angle, isBoost = false) {
    const spread = (Math.random() - 0.5) * 0.6
    const speed = (isBoost ? 6 : 3.5) + Math.random() * 2
    const vx = -Math.cos(angle + spread) * speed
    const vy = -Math.sin(angle + spread) * speed

    this.particles.push({
      x,
      y,
      vx,
      vy,
      radius: isBoost ? 4.5 + Math.random() * 3 : 2.5 + Math.random() * 2,
      color: isBoost ? (Math.random() > 0.5 ? '#f97316' : '#fbbf24') : '#38bdf8',
      life: 1,
      decay: isBoost ? 0.05 : 0.08,
      glow: isBoost ? '#ea580c' : '#0284c7',
    })
  }

  /** Explosion burst when a hazard is destroyed */
  addExplosion(x, y, color = '#f97316', count = 18, isBig = false) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = (isBig ? 3 : 1.5) + Math.random() * (isBig ? 7 : 4)
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: (isBig ? 4 : 2) + Math.random() * (isBig ? 5 : 3),
        color,
        life: 1,
        decay: 0.03 + Math.random() * 0.04,
        glow: color,
      })
    }

    // Add expanding shockwave ring
    this.shockwaves.push({
      x,
      y,
      radius: 4,
      maxRadius: isBig ? 85 : 45,
      color,
      alpha: 0.8,
      speed: isBig ? 6 : 3.5,
    })
  }

  /** Laser impact spark burst */
  addSparks(x, y, color = '#38bdf8', count = 6) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1.5 + Math.random() * 3
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 1.5,
        color,
        life: 1,
        decay: 0.08,
        glow: color,
      })
    }
  }

  /** Floating combat / pickup numbers (+15 ⚡ Power, -20 HP) */
  addFloatingText(x, y, text, color = '#fbbf24', fontSize = 16) {
    this.floatTexts.push({
      x,
      y,
      text,
      color,
      fontSize,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -1.8 - Math.random() * 0.8,
      life: 1,
      decay: 0.025,
    })
  }

  /** Add large shockwave */
  addShockwave(x, y, color = '#a855f7', maxRadius = 160) {
    this.shockwaves.push({
      x,
      y,
      radius: 10,
      maxRadius,
      color,
      alpha: 1,
      speed: 9,
    })
  }

  update() {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.95
      p.vy *= 0.95
      p.life -= p.decay

      if (p.life <= 0) {
        this.particles.splice(i, 1)
      }
    }

    // Update float texts
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i]
      ft.x += ft.vx
      ft.y += ft.vy
      ft.life -= ft.decay

      if (ft.life <= 0) {
        this.floatTexts.splice(i, 1)
      }
    }

    // Update shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i]
      sw.radius += sw.speed
      sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius)

      if (sw.radius >= sw.maxRadius || sw.alpha <= 0) {
        this.shockwaves.splice(i, 1)
      }
    }
  }

  draw(ctx, camera) {
    ctx.save()

    // 1. Draw Shockwaves
    this.shockwaves.forEach((sw) => {
      const sx = sw.x - camera.x
      const sy = sw.y - camera.y

      ctx.strokeStyle = sw.color
      ctx.globalAlpha = sw.alpha
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(sx, sy, sw.radius, 0, Math.PI * 2)
      ctx.stroke()
    })

    // 2. Draw Particles
    this.particles.forEach((p) => {
      const sx = p.x - camera.x
      const sy = p.y - camera.y

      ctx.fillStyle = p.color
      ctx.globalAlpha = p.life
      ctx.shadowColor = p.glow
      ctx.shadowBlur = 8

      ctx.beginPath()
      ctx.arc(sx, sy, p.radius * p.life, 0, Math.PI * 2)
      ctx.fill()
    })

    // 3. Draw Floating Text Numbers
    ctx.shadowBlur = 6
    this.floatTexts.forEach((ft) => {
      const sx = ft.x - camera.x
      const sy = ft.y - camera.y

      ctx.font = `bold ${ft.fontSize}px "Orbitron", ui-sans-serif, sans-serif`
      ctx.fillStyle = ft.color
      ctx.shadowColor = ft.color
      ctx.globalAlpha = ft.life
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(ft.text, sx, sy)
    })

    ctx.restore()
  }
}

export default ParticleSystem
