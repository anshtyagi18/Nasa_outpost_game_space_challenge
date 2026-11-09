/**
 * SolSurvivorEngine.js — 2D High-Octane Space Survivors Game Engine
 *
 * Built for NASA Space Apps Challenge (Ages 7–12).
 * Inspired by CrazyGames "Space Survivors":
 *   - Auto-targeting laser blasters
 *   - Massive swarms of DONKI space weather hazards
 *   - XP data collection, magnet fields, dash boosts
 *   - Central Habitation Base life-support deposit loop
 *   - Screen shake, particle effects, and radar minimap
 */

import { ARENA_SIZE, UPGRADE_CARDS, HAZARD_TYPES, SALVAGE_TYPES } from './GameConstants.js'
import sound from './SoundFX.js'
import ParticleSystem from './ParticleSystem.js'

export class SolSurvivorEngine {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.callbacks = callbacks // onLevelUp, onGameOver, onVictory, onTelemetryUpdate

    this.particles = new ParticleSystem()
    this.width = window.innerWidth
    this.height = window.innerHeight

    // Camera
    this.camera = { x: 0, y: 0 }
    this.shake = 0

    // Timing & Game State
    this.isRunning = false
    this.isPaused = false
    this.gameTime = 0
    this.sol = 1
    this.solTimer = 0
    this.solDuration = 60 // 60 seconds per sol
    this.score = 0
    this.lastFrameTime = performance.now()

    // Controls State
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      arrowup: false,
      arrowdown: false,
      arrowleft: false,
      arrowright: false,
      space: false,
    }
    this.joystick = { x: 0, y: 0 } // On-screen touch support

    // Central Outpost Sol-1 Base
    this.base = {
      x: 0,
      y: 0,
      radius: 75,
      shieldRadius: 240,
      power: 85,
      maxPower: 100,
      oxygen: 85,
      maxOxygen: 100,
      shields: 85,
      maxShields: 100,
      drainRate: 0.05, // per second
      regenRate: 1.0,
      pulseTimer: 0,
    }

    // Player (Explorer Rover / Space Cadet)
    this.player = {
      x: 0,
      y: 120,
      vx: 0,
      vy: 0,
      angle: 0,
      radius: 20,
      hp: 100,
      maxHp: 100,
      speed: 4.8,
      speedMultiplier: 1.0,
      armor: 0,
      dashCooldown: 0,
      dashCooldownMax: 2.8,
      isDashing: false,
      dashTimer: 0,
      gunCount: 1,
      fireRateMultiplier: 1.0,
      fireCooldown: 0,
      damageMultiplier: 1.0,
      range: 460,
      magnetRadius: 200,
      xp: 0,
      xpToNextLevel: 45,
      level: 1,
      carriedPower: 0,
      carriedOxygen: 0,
      carriedShield: 0,
      droneCount: 0,
      droneAngle: 0,
      hasRepulsor: false,
      repulsorLevel: 0,
      repulsorTimer: 0,
    }

    // Entities Arrays
    this.bullets = []
    this.hazards = []
    this.salvage = []

    // Spawner State
    this.spawnTimer = 0
    this.waveTimer = 0
    this.waveNumber = 1

    this.bindEvents()
    this.resize()
  }

  bindEvents() {
    this.onKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (key in this.keys) {
        this.keys[key] = true
        if (key === 'space' && !e.repeat) {
          this.triggerDash()
        }
      }
    }

    this.onKeyUp = (e) => {
      const key = e.key.toLowerCase()
      if (key in this.keys) {
        this.keys[key] = false
      }
    }

    this.onResize = () => this.resize()

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('resize', this.onResize)
  }

  unbindEvents() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('resize', this.onResize)
  }

  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = this.width * (window.devicePixelRatio || 1)
    this.canvas.height = this.height * (window.devicePixelRatio || 1)
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
  }

  start() {
    this.isRunning = true
    this.isPaused = false
    this.lastFrameTime = performance.now()
    requestAnimationFrame((t) => this.loop(t))
  }

  pause() {
    this.isPaused = true
  }

  resume() {
    this.isPaused = false
    this.lastFrameTime = performance.now()
    requestAnimationFrame((t) => this.loop(t))
  }

  stop() {
    this.isRunning = false
  }

  triggerDash() {
    if (this.player.dashCooldown <= 0 && !this.player.isDashing) {
      this.player.isDashing = true
      this.player.dashTimer = 0.22 // 220ms invincible dash
      this.player.dashCooldown = this.player.dashCooldownMax
      sound.playDash()
      this.shake = 8

      // Spawn radial dash shockwave
      this.particles.addShockwave(this.player.x, this.player.y, '#38bdf8', 90)
    }
  }

  applyUpgrade(card) {
    if (card && card.apply) {
      card.apply(this.player, this.base)
      sound.playPickup('power')
      this.particles.addFloatingText(this.player.x, this.player.y - 30, `UPGRADE INSTALLED!`, '#22c55e', 20)
    }
  }

  // ─── Main Game Loop ─────────────────────────────────────────────────────

  loop(currentTime) {
    if (!this.isRunning) return

    const dt = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1) // clamp dt to prevent lag jumps
    this.lastFrameTime = currentTime

    if (!this.isPaused) {
      this.update(dt)
    }

    this.draw()

    if (this.isRunning) {
      requestAnimationFrame((t) => this.loop(t))
    }
  }

  update(dt) {
    this.gameTime += dt
    this.solTimer += dt

    // Sol Day cycle
    if (this.solTimer >= this.solDuration) {
      this.solTimer = 0
      this.sol += 1
      sound.playLevelUp()
      this.particles.addFloatingText(this.player.x, this.player.y - 50, `SOL ${this.sol} REACHED!`, '#fbbf24', 24)

      if (this.callbacks.onSolAdvance) {
        this.callbacks.onSolAdvance(this.sol)
      }

      if (this.sol > 10) {
        this.isRunning = false
        if (this.callbacks.onVictory) this.callbacks.onVictory(this.score, this.sol)
        return
      }
    }

    // Update screen shake
    if (this.shake > 0) {
      this.shake = Math.max(0, this.shake - dt * 25)
    }

    // 1. Update Player Movement & Dash
    this.updatePlayer(dt)

    // 2. Update Central Outpost Life Support & Resource Depot
    this.updateBase(dt)

    // 3. Auto-Targeting Laser Weapons & Drones
    this.updateWeapons(dt)

    // 4. Update Hazards & Spawner Swarms
    this.updateHazards(dt)

    // 5. Update Dropped Salvage (Magnet Attraction & Collect)
    this.updateSalvage(dt)

    // 6. Update Particles & Shockwaves
    this.particles.update()

    // 7. Update Camera follow
    this.camera.x += (this.player.x - this.camera.x) * 0.1
    this.camera.y += (this.player.y - this.camera.y) * 0.1

    // Broadcast Telemetry to HUD
    if (this.callbacks.onTelemetryUpdate) {
      this.callbacks.onTelemetryUpdate({
        sol: this.sol,
        solProgress: Math.min(100, (this.solTimer / this.solDuration) * 100),
        score: this.score,
        playerHp: this.player.hp,
        playerMaxHp: this.player.maxHp,
        dashCd: Math.max(0, this.player.dashCooldown),
        dashCdMax: this.player.dashCooldownMax,
        xp: this.player.xp,
        xpToNext: this.player.xpToNextLevel,
        level: this.player.level,
        carried: {
          power: this.player.carriedPower,
          oxygen: this.player.carriedOxygen,
          shield: this.player.carriedShield,
        },
        base: {
          power: this.base.power,
          oxygen: this.base.oxygen,
          shields: this.base.shields,
        },
      })
    }
  }

  updatePlayer(dt) {
    const p = this.player

    // Direction calculation (WASD + Arrows + Virtual Joystick)
    let moveX = 0
    let moveY = 0

    if (this.keys.w || this.keys.arrowup) moveY -= 1
    if (this.keys.s || this.keys.arrowdown) moveY += 1
    if (this.keys.a || this.keys.arrowleft) moveX -= 1
    if (this.keys.d || this.keys.arrowright) moveX += 1

    if (this.joystick.x !== 0 || this.joystick.y !== 0) {
      moveX = this.joystick.x
      moveY = this.joystick.y
    }

    const len = Math.hypot(moveX, moveY)
    if (len > 0) {
      moveX /= len
      moveY /= len
      p.angle = Math.atan2(moveY, moveX)
    }

    // Dash cooldown & timer
    if (p.dashCooldown > 0) {
      p.dashCooldown -= dt
    }

    let currentSpeed = p.speed * p.speedMultiplier
    if (p.isDashing) {
      p.dashTimer -= dt
      currentSpeed *= 3.0 // 3x speed boost during dash
      this.particles.addThruster(p.x, p.y, p.angle, true)

      if (p.dashTimer <= 0) {
        p.isDashing = false
      }
    } else if (len > 0) {
      // Normal moving thruster sparks
      if (Math.random() < 0.6) {
        this.particles.addThruster(p.x, p.y, p.angle, false)
      }
    }

    p.vx = moveX * currentSpeed
    p.vy = moveY * currentSpeed

    p.x += p.vx
    p.y += p.vy

    // Constrain within Arena bounds
    const half = ARENA_SIZE / 2 - p.radius
    p.x = Math.max(-half, Math.min(half, p.x))
    p.y = Math.max(-half, Math.min(half, p.y))

    // Check Death
    if (p.hp <= 0) {
      this.triggerGameOver('rover_destroyed', 'Rover Hull Breached!', 'Your explorer rover took fatal damage from deep-space hazard swarms.')
    }
  }

  updateBase(dt) {
    const b = this.base
    const p = this.player

    // Deplete life support passively
    b.power = Math.max(0, b.power - b.drainRate * dt * 15)
    b.oxygen = Math.max(0, b.oxygen - b.drainRate * dt * 15)
    b.shields = Math.max(0, b.shields - (b.drainRate * 0.7) * dt * 15)

    // Check Base Depletion Failure
    if (b.power <= 0) {
      this.triggerGameOver('base_power', 'Outpost Power Blackout!', 'The central habitat ran out of electricity to power heating and oxygen scrubbers.')
      return
    }
    if (b.oxygen <= 0) {
      this.triggerGameOver('base_oxygen', 'Outpost Oxygen Depleted!', 'The central habitat life support ran out of breathable air for the crew.')
      return
    }
    if (b.shields <= 0) {
      this.triggerGameOver('base_shield', 'Radiation Shield Failure!', 'Solar cosmic rays penetrated the outpost hull due to depleted regolith armor.')
      return
    }

    // Check if player is inside Base Shield Perimeter
    const distToBase = Math.hypot(p.x - b.x, p.y - b.y)
    if (distToBase < b.shieldRadius) {
      // 1. Repair / Recharge Player Health
      if (p.hp < p.maxHp) {
        p.hp = Math.min(p.maxHp, p.hp + dt * 18)
      }

      // 2. Deposit Carried Salvage
      if (p.carriedPower > 0 || p.carriedOxygen > 0 || p.carriedShield > 0) {
        const dp = p.carriedPower
        const do2 = p.carriedOxygen
        const ds = p.carriedShield

        b.power = Math.min(b.maxPower, b.power + dp)
        b.oxygen = Math.min(b.maxOxygen, b.oxygen + do2)
        b.shields = Math.min(b.maxShields, b.shields + ds)

        this.score += (dp + do2 + ds) * 10
        sound.playBaseDeposit()

        this.particles.addFloatingText(b.x, b.y - 80, `+${dp}⚡ +${do2}💨 +${ds}🛡️ DEPOSITED!`, '#4ade80', 20)
        this.particles.addShockwave(b.x, b.y, '#38bdf8', 140)

        p.carriedPower = 0
        p.carriedOxygen = 0
        p.carriedShield = 0
      }
    }
  }

  updateWeapons(dt) {
    const p = this.player

    // 1. Primary Auto-Targeting Laser Turrets
    p.fireCooldown -= dt
    const fireInterval = 0.32 / p.fireRateMultiplier

    if (p.fireCooldown <= 0 && this.hazards.length > 0) {
      // Find closest hazards within range
      const inRange = this.hazards
        .map((h) => ({ h, d: Math.hypot(h.x - p.x, h.y - p.y) }))
        .filter((item) => item.d <= p.range)
        .sort((a, b) => a.d - b.d)

      const targetsToHit = inRange.slice(0, p.gunCount)

      if (targetsToHit.length > 0) {
        targetsToHit.forEach(({ h }) => {
          const angle = Math.atan2(h.y - p.y, h.x - p.x)
          const bulletSpeed = 16

          this.bullets.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(angle) * bulletSpeed,
            vy: Math.sin(angle) * bulletSpeed,
            damage: 22 * p.damageMultiplier,
            life: 0.8,
            color: '#38bdf8',
          })
        })

        p.fireCooldown = fireInterval
        sound.playLaser()
      }
    }

    // 2. Drone Companion
    if (p.droneCount > 0) {
      p.droneAngle += dt * 3
      const droneDist = 65

      for (let i = 0; i < p.droneCount; i++) {
        const offset = (Math.PI * 2 * i) / p.droneCount
        const dx = p.x + Math.cos(p.droneAngle + offset) * droneDist
        const dy = p.y + Math.sin(p.droneAngle + offset) * droneDist

        // Drone auto-zaps closest enemy within 180px
        const closest = this.hazards.find((h) => Math.hypot(h.x - dx, h.y - dy) < 220)
        if (closest && Math.random() < 0.1) {
          closest.hp -= 8 * p.damageMultiplier
          this.particles.addSparks(closest.x, closest.y, '#10b981', 4)
        }
      }
    }

    // 3. Magnetic Repulsor Wave
    if (p.hasRepulsor) {
      p.repulsorTimer += dt
      if (p.repulsorTimer >= 4.0) {
        p.repulsorTimer = 0
        sound.playRepulsor()
        this.particles.addShockwave(p.x, p.y, '#a855f7', 220)
        this.shake = 6

        // Blast away all hazards within 240px
        this.hazards.forEach((h) => {
          const d = Math.hypot(h.x - p.x, h.y - p.y)
          if (d < 240) {
            const angle = Math.atan2(h.y - p.y, h.x - p.x)
            h.x += Math.cos(angle) * 90
            h.y += Math.sin(angle) * 90
            h.hp -= 25 * p.damageMultiplier
            this.particles.addSparks(h.x, h.y, '#d946ef', 8)
          }
        })
      }
    }

    // Update Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i]
      b.x += b.vx
      b.y += b.vy
      b.life -= dt

      if (b.life <= 0) {
        this.bullets.splice(i, 1)
        continue
      }

      // Check collision with hazards
      for (let j = this.hazards.length - 1; j >= 0; j--) {
        const h = this.hazards[j]
        const d = Math.hypot(h.x - b.x, h.y - b.y)

        if (d < h.radius + 6) {
          h.hp -= b.damage
          this.particles.addSparks(b.x, b.y, b.color, 6)
          this.bullets.splice(i, 1)

          if (h.hp <= 0) {
            this.destroyHazard(j)
          }
          break
        }
      }
    }
  }

  updateHazards(dt) {
    const p = this.player
    const b = this.base

    // Spawner timer
    this.spawnTimer += dt
    const spawnRate = Math.max(0.25, 1.2 - this.sol * 0.08)

    if (this.spawnTimer >= spawnRate) {
      this.spawnTimer = 0
      this.spawnHazard()
    }

    // Periodic Swarm Alert Wave (every 25 seconds)
    this.waveTimer += dt
    if (this.waveTimer >= 25) {
      this.waveTimer = 0
      sound.playSiren()
      this.particles.addFloatingText(p.x, p.y - 70, `⚠️ INCOMING DONKI RADIATION SWARM!`, '#fc3d21', 22)
      for (let i = 0; i < 7 + this.sol * 2; i++) {
        this.spawnHazard(HAZARD_TYPES.RADIATION)
      }
    }

    // Move hazards
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i]

      // Decide target: 70% chance targets player, 30% targets central base
      const target = h.targetBase ? b : p
      const angle = Math.atan2(target.y - h.y, target.x - h.x)

      h.x += Math.cos(angle) * h.speed
      h.y += Math.sin(angle) * h.speed

      // Check collision with Player
      const distToPlayer = Math.hypot(p.x - h.x, p.y - h.y)
      if (distToPlayer < p.radius + h.radius) {
        if (!p.isDashing) {
          const dmg = Math.max(5, h.damage * (1 - p.armor))
          p.hp -= dmg
          this.shake = 12
          sound.playExplosion(false)
          this.particles.addFloatingText(p.x, p.y - 20, `-${Math.round(dmg)} HP`, '#ef4444', 18)
          this.particles.addSparks(p.x, p.y, '#ef4444', 8)
        } else {
          // If dashing, rover smashes through hazards!
          h.hp -= 60
          this.particles.addSparks(h.x, h.y, '#38bdf8', 12)
        }

        if (h.hp <= 0) {
          this.destroyHazard(i)
          continue
        }
      }

      // Check collision with Base Shield
      const distToBase = Math.hypot(b.x - h.x, b.y - h.y)
      if (distToBase < b.shieldRadius) {
        b.shields = Math.max(0, b.shields - h.damage * 0.4)
        this.particles.addSparks(h.x, h.y, '#38bdf8', 6)
        this.destroyHazard(i)
      }
    }
  }

  spawnHazard(typeOverride = null) {
    let type = typeOverride

    if (!type) {
      const roll = Math.random()
      if (this.sol >= 3 && roll < 0.15) {
        type = HAZARD_TYPES.SOLAR_CME
      } else if (this.sol >= 2 && roll < 0.45) {
        type = HAZARD_TYPES.RADIATION
      } else if (roll < 0.75) {
        type = HAZARD_TYPES.METEOR
      } else {
        type = HAZARD_TYPES.DEBRIS
      }
    }

    // Spawn on a circle around player outside screen
    const spawnDist = 650 + Math.random() * 200
    const spawnAngle = Math.random() * Math.PI * 2
    const x = this.player.x + Math.cos(spawnAngle) * spawnDist
    const y = this.player.y + Math.sin(spawnAngle) * spawnDist

    this.hazards.push({
      ...type,
      x,
      y,
      hp: type.hp * (1 + this.sol * 0.15),
      speed: type.speed * (0.9 + Math.random() * 0.3),
      targetBase: Math.random() < 0.25,
      rotation: 0,
      rotSpeed: (Math.random() - 0.5) * 0.05,
    })
  }

  destroyHazard(index) {
    const h = this.hazards[index]
    if (!h) return

    sound.playExplosion(h.id === 'solar_cme')
    this.particles.addExplosion(h.x, h.y, h.color, h.id === 'solar_cme' ? 30 : 16, h.id === 'solar_cme')
    this.score += h.score

    // Drop salvage: XP + chance of Power / Oxygen / Shield
    this.salvage.push({
      ...SALVAGE_TYPES.XP,
      x: h.x,
      y: h.y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    })

    const dropRoll = Math.random()
    if (dropRoll < 0.35) {
      this.salvage.push({
        ...SALVAGE_TYPES.POWER,
        x: h.x + (Math.random() - 0.5) * 20,
        y: h.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
      })
    } else if (dropRoll < 0.65) {
      this.salvage.push({
        ...SALVAGE_TYPES.OXYGEN,
        x: h.x + (Math.random() - 0.5) * 20,
        y: h.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
      })
    } else if (dropRoll < 0.85) {
      this.salvage.push({
        ...SALVAGE_TYPES.SHIELD,
        x: h.x + (Math.random() - 0.5) * 20,
        y: h.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
      })
    }

    this.hazards.splice(index, 1)
  }

  updateSalvage(dt) {
    const p = this.player

    for (let i = this.salvage.length - 1; i >= 0; i--) {
      const s = this.salvage[i]

      // Natural drag
      s.x += s.vx
      s.y += s.vy
      s.vx *= 0.94
      s.vy *= 0.94

      // Magnet pull towards player
      const d = Math.hypot(p.x - s.x, p.y - s.y)
      if (d < p.magnetRadius) {
        const pullSpeed = Math.min(14, (p.magnetRadius - d) * 0.12 + 4)
        const angle = Math.atan2(p.y - s.y, p.x - s.x)
        s.x += Math.cos(angle) * pullSpeed
        s.y += Math.sin(angle) * pullSpeed
      }

      // Collect when close
      if (d < p.radius + s.radius + 6) {
        sound.playPickup(s.id)

        if (s.id === 'xp') {
          p.xp += s.value
          this.particles.addFloatingText(s.x, s.y, `+${s.value} XP`, '#c084fc', 14)
          this.checkLevelUp()
        } else if (s.id === 'power') {
          p.carriedPower += s.value
          this.particles.addFloatingText(s.x, s.y, `+${s.value}⚡`, '#fbbf24', 15)
        } else if (s.id === 'oxygen') {
          p.carriedOxygen += s.value
          this.particles.addFloatingText(s.x, s.y, `+${s.value}💨`, '#38bdf8', 15)
        } else if (s.id === 'shield') {
          p.carriedShield += s.value
          this.particles.addFloatingText(s.x, s.y, `+${s.value}🛡️`, '#4ade80', 15)
        }

        this.salvage.splice(i, 1)
      }
    }
  }

  checkLevelUp() {
    const p = this.player
    if (p.xp >= p.xpToNextLevel) {
      p.xp -= p.xpToNextLevel
      p.level += 1
      p.xpToNextLevel = Math.round(p.xpToNextLevel * 1.4)
      sound.playLevelUp()

      this.particles.addFloatingText(p.x, p.y - 60, `🌟 LEVEL ${p.level} UP!`, '#fbbf24', 26)
      this.pause()

      // Pick 3 random distinct upgrade cards
      const shuffled = [...UPGRADE_CARDS].sort(() => 0.5 - Math.random())
      const choices = shuffled.slice(0, 3)

      if (this.callbacks.onLevelUp) {
        this.callbacks.onLevelUp(choices)
      }
    }
  }

  triggerGameOver(reason, title, detail) {
    this.isRunning = false
    sound.playExplosion(true)

    if (this.callbacks.onGameOver) {
      this.callbacks.onGameOver({
        reason,
        title,
        detail,
        score: this.score,
        sol: this.sol,
        level: this.player.level,
      })
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  draw() {
    const ctx = this.ctx
    const w = this.width
    const h = this.height

    // Screen Shake Offset
    const shakeX = (Math.random() - 0.5) * this.shake
    const shakeY = (Math.random() - 0.5) * this.shake

    ctx.save()
    ctx.clearRect(0, 0, w, h)
    ctx.translate(w / 2 - this.camera.x + shakeX, h / 2 - this.camera.y + shakeY)

    // 1. Draw Martian / Alien Ground with Grid & Craters
    this.drawTerrain(ctx)

    // 2. Draw Central Outpost Sol-1 Base & Energy Dome
    this.drawBase(ctx)

    // 3. Draw Salvage Drops
    this.drawSalvage(ctx)

    // 4. Draw Bullets & Lasers
    this.drawBullets(ctx)

    // 5. Draw Hazard Swarms
    this.drawHazards(ctx)

    // 6. Draw Player (Rover / Astronaut)
    this.drawPlayer(ctx)

    // 7. Draw Drones
    this.drawDrones(ctx)

    // 8. Draw Particle System
    this.particles.draw(ctx, { x: 0, y: 0 })

    ctx.restore()

    // 9. Draw Minimap Radar on screen overlay
    this.drawRadar(ctx)
  }

  drawTerrain(ctx) {
    // Deep Space Nebula Backdrop
    ctx.fillStyle = '#090d16'
    ctx.fillRect(-ARENA_SIZE / 2, -ARENA_SIZE / 2, ARENA_SIZE, ARENA_SIZE)

    // Arena boundary border
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 6
    ctx.strokeRect(-ARENA_SIZE / 2, -ARENA_SIZE / 2, ARENA_SIZE, ARENA_SIZE)

    // Grid Lines
    ctx.strokeStyle = 'rgba(30, 58, 95, 0.25)'
    ctx.lineWidth = 1
    const gridSize = 100

    const startX = -ARENA_SIZE / 2
    const endX = ARENA_SIZE / 2
    const startY = -ARENA_SIZE / 2
    const endY = ARENA_SIZE / 2

    ctx.beginPath()
    for (let x = startX; x <= endX; x += gridSize) {
      ctx.moveTo(x, startY)
      ctx.lineTo(x, endY)
    }
    for (let y = startY; y <= endY; y += gridSize) {
      ctx.moveTo(startX, y)
      ctx.lineTo(endX, y)
    }
    ctx.stroke()
  }

  drawBase(ctx) {
    const b = this.base

    // Outer Shield Radius
    ctx.save()
    const shieldAlpha = 0.15 + Math.sin(this.gameTime * 3) * 0.05
    ctx.fillStyle = `rgba(56, 189, 248, ${shieldAlpha})`
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.shieldRadius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Base Foundation Dome
    ctx.fillStyle = '#1e293b'
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 4
    ctx.shadowColor = '#06b6d4'
    ctx.shadowBlur = 18
    ctx.beginPath()
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Base Dome Window & Insignia
    ctx.fillStyle = '#06b6d4'
    ctx.beginPath()
    ctx.arc(b.x, b.y, 22, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 12px "Orbitron", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('OUTPOST SOL-1', b.x, b.y - 40)
    ctx.fillText('RECHARGE & DEPOSIT DEPOT', b.x, b.y + 40)

    ctx.restore()
  }

  drawPlayer(ctx) {
    const p = this.player

    ctx.save()
    ctx.translate(p.x, p.y)
    ctx.rotate(p.angle)

    // Invincible Dash Shield Glow
    if (p.isDashing) {
      ctx.strokeStyle = '#38bdf8'
      ctx.shadowColor = '#38bdf8'
      ctx.shadowBlur = 24
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(0, 0, p.radius + 10, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Rover Chassis Body
    ctx.fillStyle = '#f8fafc'
    ctx.strokeStyle = '#0284c7'
    ctx.lineWidth = 2
    ctx.shadowColor = '#38bdf8'
    ctx.shadowBlur = 12

    // Rover Box Chassis
    ctx.beginPath()
    ctx.roundRect(-22, -15, 44, 30, 8)
    ctx.fill()
    ctx.stroke()

    // 4 Wheels
    ctx.fillStyle = '#1e293b'
    ctx.fillRect(-18, -19, 12, 5)
    ctx.fillRect(6, -19, 12, 5)
    ctx.fillRect(-18, 14, 12, 5)
    ctx.fillRect(6, 14, 12, 5)

    // Cockpit Window (Cyan)
    ctx.fillStyle = '#06b6d4'
    ctx.beginPath()
    ctx.arc(6, 0, 8, 0, Math.PI * 2)
    ctx.fill()

    // Primary Cannon Barrel
    ctx.fillStyle = '#64748b'
    ctx.fillRect(12, -3, 14, 6)

    ctx.restore()

    // Health Bar above player
    const barW = 44
    const barH = 5
    const hpRatio = Math.max(0, p.hp / p.maxHp)

    ctx.fillStyle = 'rgba(0,0,0,0.7)'
    ctx.fillRect(p.x - barW / 2, p.y - p.radius - 16, barW, barH)

    ctx.fillStyle = hpRatio > 0.4 ? '#22c55e' : '#ef4444'
    ctx.fillRect(p.x - barW / 2, p.y - p.radius - 16, barW * hpRatio, barH)
  }

  drawDrones(ctx) {
    const p = this.player
    if (p.droneCount <= 0) return

    const droneDist = 65
    for (let i = 0; i < p.droneCount; i++) {
      const offset = (Math.PI * 2 * i) / p.droneCount
      const dx = p.x + Math.cos(p.droneAngle + offset) * droneDist
      const dy = p.y + Math.sin(p.droneAngle + offset) * droneDist

      ctx.save()
      ctx.fillStyle = '#10b981'
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(dx, dy, 7, 0, Math.PI * 2)
      ctx.fill()

      // Satellite solar mini-wings
      ctx.strokeStyle = '#34d399'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(dx - 12, dy)
      ctx.lineTo(dx + 12, dy)
      ctx.stroke()

      ctx.restore()
    }
  }

  drawBullets(ctx) {
    ctx.save()
    this.bullets.forEach((b) => {
      ctx.strokeStyle = b.color
      ctx.shadowColor = b.color
      ctx.shadowBlur = 12
      ctx.lineWidth = 3

      ctx.beginPath()
      ctx.moveTo(b.x - b.vx * 0.8, b.y - b.vy * 0.8)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    })
    ctx.restore()
  }

  drawHazards(ctx) {
    ctx.save()
    this.hazards.forEach((h) => {
      ctx.fillStyle = h.color
      ctx.shadowColor = h.glow
      ctx.shadowBlur = 14

      if (h.id === 'meteor') {
        // Blazing comet with tail
        ctx.beginPath()
        ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2)
        ctx.fill()
      } else if (h.id === 'radiation') {
        // Pulsing radioactive cloud
        const pulse = Math.sin(this.gameTime * 8) * 3
        ctx.beginPath()
        ctx.arc(h.x, h.y, h.radius + pulse, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Angular debris rock
        ctx.beginPath()
        ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Small hazard health bar if damaged
      if (h.hp < (HAZARD_TYPES[h.id.toUpperCase()]?.hp || 20)) {
        const hw = h.radius * 1.5
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(h.x - hw / 2, h.y - h.radius - 8, hw, 3)
        ctx.fillStyle = '#ef4444'
        const ratio = Math.max(0, h.hp / (HAZARD_TYPES[h.id.toUpperCase()]?.hp || 20))
        ctx.fillRect(h.x - hw / 2, h.y - h.radius - 8, hw * ratio, 3)
      }
    })
    ctx.restore()
  }

  drawSalvage(ctx) {
    ctx.save()
    this.salvage.forEach((s) => {
      ctx.fillStyle = s.color
      ctx.shadowColor = s.glow
      ctx.shadowBlur = 12

      ctx.beginPath()
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
      ctx.fill()

      // Emoji label
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.emoji, s.x, s.y)
    })
    ctx.restore()
  }

  drawRadar(ctx) {
    // Top right radar screen
    const radarW = 140
    const radarH = 140
    const rx = this.width - radarW - 20
    const ry = 80

    ctx.save()
    // Radar backdrop
    ctx.fillStyle = 'rgba(10, 14, 23, 0.75)'
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(rx, ry, radarW, radarH, 14)
    ctx.fill()
    ctx.stroke()

    // Radar center (Outpost Sol-1)
    const cx = rx + radarW / 2
    const cy = ry + radarH / 2
    const scale = radarW / ARENA_SIZE

    ctx.fillStyle = '#38bdf8'
    ctx.beginPath()
    ctx.arc(cx, cy, 4, 0, Math.PI * 2)
    ctx.fill()

    // Player position on radar
    const px = cx + this.player.x * scale
    const py = cy + this.player.y * scale
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(px, py, 3.5, 0, Math.PI * 2)
    ctx.fill()

    // Hazard dots
    ctx.fillStyle = '#ef4444'
    this.hazards.forEach((h) => {
      const hx = cx + h.x * scale
      const hy = cy + h.y * scale
      if (hx >= rx && hx <= rx + radarW && hy >= ry && hy <= ry + radarH) {
        ctx.fillRect(hx - 1, hy - 1, 2, 2)
      }
    })

    // Radar sweep line
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)'
    ctx.beginPath()
    const sweepAngle = this.gameTime * 2.5
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(sweepAngle) * (radarW / 2), cy + Math.sin(sweepAngle) * (radarW / 2))
    ctx.stroke()

    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.font = '9px "JetBrains Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText('SOLAR RADAR', cx, ry + 12)

    ctx.restore()
  }
}

export default SolSurvivorEngine

