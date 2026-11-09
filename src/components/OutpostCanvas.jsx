import { useEffect, useRef, useState, useCallback } from 'react'
import Matter from 'matter-js'
import { ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react'
import sound from '../engine/soundFx.js'

const { Engine, Render, Runner, Bodies, Body, World, Mouse, MouseConstraint, Events, Composite } = Matter

// ─── Module Definitions ─────────────────────────────────────────────────

const MODULE_DEFS = [
  {
    id: 'habitat',
    label: 'Habitat Dome',
    emoji: '🏠',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.4)',
    width: 90,
    height: 60,
    xRatio: 0.2,
  },
  {
    id: 'solar',
    label: 'Solar Array',
    emoji: '☀️',
    color: '#eab308',
    glowColor: 'rgba(234,179,8,0.4)',
    width: 100,
    height: 30,
    xRatio: 0.4,
  },
  {
    id: 'oxygen',
    label: 'O₂ Silo',
    emoji: '💨',
    color: '#06b6d4',
    glowColor: 'rgba(6,182,212,0.4)',
    width: 50,
    height: 75,
    xRatio: 0.6,
  },
  {
    id: 'greenhouse',
    label: 'Greenhouse',
    emoji: '🌱',
    color: '#22c55e',
    glowColor: 'rgba(34,197,94,0.4)',
    width: 85,
    height: 50,
    xRatio: 0.8,
  },
]

// ─── Gravity Presets ────────────────────────────────────────────────────

const GRAVITY_MODES = {
  lunar:  { label: 'Moon 🌙 0.16G', x: 0, y: 0.27 },   // Moon = 1.62 m/s² ≈ 0.16G
  zero:   { label: 'Zero-G 🚀 0G',  x: 0, y: 0 },
}

// ─── Canvas Drawing Helpers ─────────────────────────────────────────────

/** Draw the planetary surface with terrain texture. */
function drawSurface(ctx, w, h, groundY) {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY)
  skyGrad.addColorStop(0, '#0a0e17')
  skyGrad.addColorStop(0.7, '#111827')
  skyGrad.addColorStop(1, '#1e293b')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, groundY)

  // Ground
  const gndGrad = ctx.createLinearGradient(0, groundY - 10, 0, h)
  gndGrad.addColorStop(0, '#78716c')
  gndGrad.addColorStop(0.3, '#57534e')
  gndGrad.addColorStop(1, '#44403c')
  ctx.fillStyle = gndGrad
  ctx.fillRect(0, groundY - 10, w, h - groundY + 10)

  // Craters
  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  const craterSeed = [0.15, 0.35, 0.55, 0.75, 0.9]
  craterSeed.forEach((xr, i) => {
    const cx = w * xr
    const cy = groundY + 8 + (i % 3) * 6
    const r = 8 + (i % 4) * 5
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()
  })

  // Surface line
  ctx.strokeStyle = 'rgba(168,162,158,0.5)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, groundY - 8)
  for (let x = 0; x <= w; x += 20) {
    ctx.lineTo(x, groundY - 8 + Math.sin(x * 0.05) * 3)
  }
  ctx.stroke()
}

/** Draw stars in the background. */
function drawStars(ctx, w, groundY, starPositions) {
  starPositions.forEach(([x, y, r, bright]) => {
    if (y > groundY - 20) return
    ctx.fillStyle = `rgba(240,249,255,${bright})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  })
}

/** Draw a single base module body with label. */
function drawModule(ctx, body, def, isAlarming, tick) {
  const { position, angle } = body
  const { width, height, color, glowColor, label, emoji } = def

  ctx.save()
  ctx.translate(position.x, position.y)
  ctx.rotate(angle)

  // Glow effect
  if (isAlarming) {
    const flicker = 0.3 + Math.sin(tick * 0.3) * 0.3
    ctx.shadowColor = 'rgba(239,68,68,' + flicker + ')'
    ctx.shadowBlur = 18
  } else {
    ctx.shadowColor = glowColor
    ctx.shadowBlur = 12
  }

  // Module body
  const hw = width / 2
  const hh = height / 2
  ctx.fillStyle = color
  ctx.globalAlpha = isAlarming ? (0.6 + Math.sin(tick * 0.3) * 0.2) : 0.85

  // Rounded rect
  const r = 6
  ctx.beginPath()
  ctx.moveTo(-hw + r, -hh)
  ctx.lineTo(hw - r, -hh)
  ctx.quadraticCurveTo(hw, -hh, hw, -hh + r)
  ctx.lineTo(hw, hh - r)
  ctx.quadraticCurveTo(hw, hh, hw - r, hh)
  ctx.lineTo(-hw + r, hh)
  ctx.quadraticCurveTo(-hw, hh, -hw, hh - r)
  ctx.lineTo(-hw, -hh + r)
  ctx.quadraticCurveTo(-hw, -hh, -hw + r, -hh)
  ctx.closePath()
  ctx.fill()

  // Border
  ctx.globalAlpha = 1
  ctx.strokeStyle = isAlarming
    ? `rgba(239,68,68,${0.5 + Math.sin(tick * 0.3) * 0.3})`
    : 'rgba(255,255,255,0.3)'
  ctx.lineWidth = isAlarming ? 2 : 1
  ctx.stroke()

  // Reset shadow
  ctx.shadowBlur = 0

  // Label text
  ctx.fillStyle = '#fff'
  ctx.font = 'bold 10px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji + ' ' + label, 0, 0)

  ctx.restore()
}

/** Draw alarm overlay when resources are critical. */
function drawAlarmOverlay(ctx, w, h, tick) {
  const alpha = 0.02 + Math.sin(tick * 0.15) * 0.02
  ctx.fillStyle = `rgba(239,68,68,${Math.max(0, alpha)})`
  ctx.fillRect(0, 0, w, h)

  // Scan line
  const scanY = (tick * 2) % h
  ctx.strokeStyle = 'rgba(239,68,68,0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, scanY)
  ctx.lineTo(w, scanY)
  ctx.stroke()
}

// ─── Component ──────────────────────────────────────────────────────────

/**
 * OutpostCanvas — Interactive Matter.js physics scene.
 *
 * Props:
 * @param {object} resources - { power, oxygen, shields, food }
 * @param {string} className - Additional CSS classes
 */
export default function OutpostCanvas({ resources = {}, className = '' }) {
  const sceneRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const runnerRef = useRef(null)
  const bodiesRef = useRef([])
  const mouseConstraintRef = useRef(null)
  const tickRef = useRef(0)
  const starsRef = useRef([])
  const rafRef = useRef(null)
  const [gravityMode, setGravityMode] = useState('lunar')

  const power = resources.power ?? 75
  const shields = resources.shields ?? 75
  const isAlarming = power < 30 || shields < 30

  // ── Initialize Matter.js ────────────────────────────────────────
  const initPhysics = useCallback((container) => {
    const w = container.clientWidth
    const h = container.clientHeight
    const groundY = h * 0.78

    // Canvas
    const canvas = document.createElement('canvas')
    canvas.width = w * (window.devicePixelRatio || 1)
    canvas.height = h * (window.devicePixelRatio || 1)
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    container.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)

    // Generate star positions (stable across frames)
    starsRef.current = Array.from({ length: 80 }, () => [
      Math.random() * w,
      Math.random() * groundY,
      0.5 + Math.random() * 1.5,
      0.3 + Math.random() * 0.7,
    ])

    // Engine
    const engine = Engine.create({
      gravity: { ...GRAVITY_MODES[gravityMode] },
    })
    engineRef.current = engine

    // Ground
    const ground = Bodies.rectangle(w / 2, groundY + 50, w + 100, 100, {
      isStatic: true,
      friction: 0.8,
      render: { visible: false },
    })

    // Walls (invisible)
    const wallL = Bodies.rectangle(-25, h / 2, 50, h * 2, { isStatic: true })
    const wallR = Bodies.rectangle(w + 25, h / 2, 50, h * 2, { isStatic: true })
    const ceiling = Bodies.rectangle(w / 2, -25, w + 100, 50, { isStatic: true })

    // Base modules
    const moduleBodies = MODULE_DEFS.map((def) => {
      const body = Bodies.rectangle(
        w * def.xRatio,
        groundY - def.height / 2 - 5,
        def.width,
        def.height,
        {
          restitution: 0.3,
          friction: 0.6,
          density: 0.004,
          chamfer: { radius: 5 },
          label: def.id,
        }
      )
      return body
    })
    bodiesRef.current = moduleBodies

    World.add(engine.world, [ground, wallL, wallR, ceiling, ...moduleBodies])

    // Mouse interaction
    const mouse = Mouse.create(canvas)
    mouse.pixelRatio = window.devicePixelRatio || 1

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    })
    mouseConstraintRef.current = mouseConstraint
    World.add(engine.world, mouseConstraint)

    // Runner
    const runner = Runner.create()
    runnerRef.current = runner
    Runner.run(runner, engine)

    // Custom render loop
    function renderFrame() {
      tickRef.current += 1
      const t = tickRef.current
      ctx.clearRect(0, 0, w, h)

      // Background
      drawStars(ctx, w, groundY, starsRef.current)
      drawSurface(ctx, w, h, groundY)

      // Modules
      const currentAlarm = isAlarmingRef.current
      moduleBodies.forEach((body, i) => {
        drawModule(ctx, body, MODULE_DEFS[i], currentAlarm, t)
      })

      // Connection lines between modules
      ctx.strokeStyle = currentAlarm ? 'rgba(239,68,68,0.3)' : 'rgba(6,182,212,0.15)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      for (let i = 0; i < moduleBodies.length - 1; i++) {
        const a = moduleBodies[i].position
        const b = moduleBodies[i + 1].position
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Mouse drag indicator
      if (mouseConstraint.body) {
        ctx.strokeStyle = 'rgba(251,191,36,0.4)'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.beginPath()
        ctx.arc(mouse.position.x, mouse.position.y, 20, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }

      // Alarm overlay
      if (currentAlarm) {
        drawAlarmOverlay(ctx, w, h, t)
      }

      // Gravity label
      const grav = GRAVITY_MODES[gravityMode]
      ctx.fillStyle = 'rgba(240,249,255,0.3)'
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`Gravity: ${grav.label}`, 10, h - 10)

      rafRef.current = requestAnimationFrame(renderFrame)
    }

    rafRef.current = requestAnimationFrame(renderFrame)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mount / Unmount ─────────────────────────────────────────────
  useEffect(() => {
    const container = sceneRef.current
    if (!container) return

    initPhysics(container)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (runnerRef.current) Runner.stop(runnerRef.current)
      if (engineRef.current) {
        World.clear(engineRef.current.world, false)
        Engine.clear(engineRef.current)
      }
      if (canvasRef.current && container.contains(canvasRef.current)) {
        container.removeChild(canvasRef.current)
      }
    }
  }, [initPhysics])

  // ── Gravity toggle ──────────────────────────────────────────────
  useEffect(() => {
    if (!engineRef.current) return
    const grav = GRAVITY_MODES[gravityMode]
    engineRef.current.gravity.x = grav.x
    engineRef.current.gravity.y = grav.y

    // Give bodies a nudge when switching to zero-G so they float
    if (gravityMode === 'zero') {
      bodiesRef.current.forEach((body) => {
        Body.applyForce(body, body.position, {
          x: (Math.random() - 0.5) * 0.002,
          y: -0.003 - Math.random() * 0.003,
        })
      })
    }
  }, [gravityMode])

  // ── Update alarm state (reactive to resource changes) ───────────
  // The isAlarming variable is used in the render closure, but since we
  // recreate the closure only on mount, we store it in a ref too.
  const isAlarmingRef = useRef(isAlarming)
  isAlarmingRef.current = isAlarming

  const toggleGravity = useCallback(() => {
    setGravityMode((prev) => {
      const next = prev === 'lunar' ? 'zero' : 'lunar'
      sound.playGravity(next)
      return next
    })
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Physics scene container */}
      <div
        ref={sceneRef}
        className="w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden
                   border border-nasa-blue/20 bg-space-black"
        style={{ touchAction: 'none' }}
      />

      {/* Gravity toggle button */}
      <button
        onClick={toggleGravity}
        className="absolute top-3 right-3 flex items-center gap-2
                   px-3 py-1.5 rounded-full text-xs font-mono
                   bg-space-deep/80 backdrop-blur-sm border border-nasa-blue/40
                   text-starfield/80 hover:border-sol-gold/60 hover:text-sol-gold
                   transition-all duration-300 select-none cursor-pointer"
        aria-label={`Switch gravity to ${gravityMode === 'lunar' ? 'Zero-G' : 'Lunar'}`}
      >
        {gravityMode === 'lunar' ? (
          <ToggleLeft className="w-4 h-4" />
        ) : (
          <ToggleRight className="w-4 h-4 text-sol-gold" />
        )}
        <span>{gravityMode === 'lunar' ? '🌙 Lunar' : '🚀 Zero-G'}</span>
      </button>

      {/* Drag hint */}
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2
                    font-mono text-[10px] text-starfield/30 select-none pointer-events-none">
        drag modules to move • toggle gravity to float
      </p>
    </div>
  )
}

