import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { useRef } from 'react'

/**
 * Slowly-rotating camera rig that gives the starfield a gentle drift,
 * making the background feel alive without distracting from gameplay.
 */
function CameraDrift() {
  const groupRef = useRef()

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015
      groupRef.current.rotation.x += delta * 0.005
    }
  })

  return (
    <group ref={groupRef}>
      <Stars
        radius={120}
        depth={60}
        count={4000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </group>
  )
}

/**
 * Full-screen Three.js canvas behind all UI layers.
 * Renders a procedural starfield with slow parallax drift.
 */
export default function StarfieldCanvas() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#0a0e17']} />
        <ambientLight intensity={0.1} />
        <CameraDrift />
      </Canvas>
    </div>
  )
}

