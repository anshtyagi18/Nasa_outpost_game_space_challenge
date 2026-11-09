/**
 * PhysicsManager — Thin abstraction over Matter.js for 2D physics.
 *
 * Used for:
 *   - Debris / asteroid collision mini-games
 *   - Drag-and-drop module placement with physics feedback
 *   - Particle-style visual effects in the 2D UI layer
 *
 * The 3D starfield uses Three.js; this module handles the 2D gameplay layer.
 */

import Matter from 'matter-js'

const { Engine, World, Bodies, Runner } = Matter

/**
 * Create a self-contained physics world.
 *
 * @param {object} options
 * @param {number} options.width   World width in px.
 * @param {number} options.height  World height in px.
 * @returns {{ engine, runner, addBody, clear }}
 */
export function createPhysicsWorld({ width = 800, height = 600 } = {}) {
  const engine = Engine.create({
    gravity: { x: 0, y: 0 }, // Space — no gravity by default
  })

  const runner = Runner.create()

  /** Add a circular body (asteroid, debris, etc.) */
  function addBody(x, y, radius, options = {}) {
    const body = Bodies.circle(x, y, radius, {
      restitution: 0.6,
      friction: 0,
      ...options,
    })
    World.add(engine.world, body)
    return body
  }

  /** Tear down the physics world. */
  function clear() {
    Runner.stop(runner)
    World.clear(engine.world, false)
    Engine.clear(engine)
  }

  return { engine, runner, addBody, clear }
}

