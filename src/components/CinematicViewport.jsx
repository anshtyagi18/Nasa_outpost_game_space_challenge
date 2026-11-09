import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'
import * as THREE from 'three'

// ─── Procedural Planet Mars with Atmosphere & Polar Cap ──────────────────

function PlanetMars({ isHazard }) {
  const planetRef = useRef()
  const atmosphereRef = useRef()

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.04
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group position={[-16, 12, -22]}>
      {/* Atmosphere Glow Sphere */}
      <mesh ref={atmosphereRef} scale={1.08}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color={isHazard ? '#fc3d21' : '#e07a3a'}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Main Mars Body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[5, 48, 48]} />
        <meshStandardMaterial
          color="#c1440e"
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Polar Ice Cap */}
      <mesh position={[0, 4.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#f0f9ff" roughness={0.4} />
      </mesh>
    </group>
  )
}

// ─── Martian Terrain Surface with Craters & Rocks ───────────────────────

function MarsTerrain({ isAlarming }) {
  const rocks = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      pos: [
        (Math.sin(i * 1.7) * 16) + (Math.cos(i) * 3),
        -0.2,
        (Math.cos(i * 2.3) * 14) + (Math.sin(i * 3) * 3),
      ],
      scale: [0.3 + Math.random() * 0.5, 0.2 + Math.random() * 0.4, 0.3 + Math.random() * 0.5],
      rot: [Math.random(), Math.random(), Math.random()],
    }))
  }, [])

  return (
    <group position={[0, -2, 0]}>
      {/* Main Ground Desert Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 120, 32, 32]} />
        <meshStandardMaterial
          color={isAlarming ? '#832717' : '#943818'}
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Scattered Martian Boulders */}
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} scale={r.scale} rotation={r.rot} castShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#682512" roughness={0.9} />
        </mesh>
      ))}

      {/* Outpost Base Foundation Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3, 11, 48]} />
        <meshStandardMaterial color="#2d221e" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ─── Outpost Modules: Dome, Solar Arrays, Greenhouse, Silo ──────────────

function OutpostModules({ isAlarming }) {
  const commsDishRef = useRef()

  useFrame((_, delta) => {
    if (commsDishRef.current) {
      commsDishRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group position={[0, -1.9, 0]}>
      {/* ── 1. Central Habitat Command Dome ── */}
      <group position={[0, 0, 0]}>
        {/* Exterior Geodesic Shell */}
        <mesh position={[0, 1.4, 0]} castShadow>
          <sphereGeometry args={[2.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.6}
            roughness={0.3}
            wireframe={false}
          />
        </mesh>

        {/* Observation Windows Ring */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[2.52, 2.52, 0.3, 24]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
        </mesh>

        {/* Interior Command Glow */}
        <pointLight position={[0, 1.5, 0]} color={isAlarming ? '#ef4444' : '#38bdf8'} intensity={isAlarming ? 4 : 2} distance={6} />

        {/* Airlock Tunnel */}
        <mesh position={[0, 0.5, 2.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 1.2, 16]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* ── 2. Hydroponics Greenhouse Bio-Dome ── */}
      <group position={[5, 0, -1]}>
        {/* Translucent Glass Dome */}
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[1.8, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            color="#22c55e"
            transparent
            opacity={0.55}
            roughness={0.1}
            transmission={0.6}
          />
        </mesh>

        {/* Interior Growing Crop Light */}
        <pointLight position={[0, 1, 0]} color="#22c55e" intensity={3} distance={5} />

        {/* Greenhouse Frame Struts */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[1.85, 1.85, 0.2, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* ── 3. High-Efficiency Solar Panel Array ── */}
      <group position={[-5, 0, -0.5]}>
        {/* Support Mast */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.15, 0.2, 2.4, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} />
        </mesh>

        {/* Dual Solar Wings */}
        <mesh position={[0, 2.3, 0]} rotation={[0.4, 0.2, 0]}>
          <boxGeometry args={[4.2, 0.08, 1.4]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.2} />
        </mesh>

        <pointLight position={[0, 2.4, 0]} color="#fbbf24" intensity={1} distance={3} />
      </group>

      {/* ── 4. Oxygen Cryo-Storage Silo ── */}
      <group position={[-2.5, 0, 4]}>
        <mesh position={[0, 1.3, 0]} castShadow>
          <cylinderGeometry args={[0.7, 0.7, 2.6, 20]} />
          <meshStandardMaterial color="#f1f5f9" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Cyan Status LED Band */}
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.2, 20]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* ── 5. Communications Dish & Beacon Tower ── */}
      <group position={[2.8, 0, 3.5]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 3.6, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>

        {/* Rotating Dish */}
        <group ref={commsDishRef} position={[0, 3.6, 0]} rotation={[0.5, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.8, 0.4, 16, 1, true]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0.3]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      </group>
    </group>
  )
}

// ─── Animated Descending Supply Lander Rocket ────────────────────────────

function SupplyLander({ isDescending }) {
  const landerRef = useRef()
  const flameRef = useRef()

  useFrame((state) => {
    if (!landerRef.current) return
    const t = state.clock.getElapsedTime()

    if (isDescending) {
      // Descends towards outpost pad and hovers gently
      const targetY = 1.6 + Math.sin(t * 3) * 0.1
      landerRef.current.position.y += (targetY - landerRef.current.position.y) * 0.05
      landerRef.current.position.x = 4 + Math.sin(t * 1.5) * 0.15
      landerRef.current.position.z = 3.5

      if (flameRef.current) {
        flameRef.current.scale.set(
          0.8 + Math.random() * 0.4,
          1 + Math.random() * 0.6,
          0.8 + Math.random() * 0.4
        )
      }
    } else {
      // In orbit / high altitude
      landerRef.current.position.y = 18 + Math.sin(t * 0.8) * 0.5
      landerRef.current.position.x = 6
      landerRef.current.position.z = -5
    }
  })

  return (
    <group ref={landerRef} position={[4, 18, 3.5]}>
      {/* Command Capsule Body */}
      <mesh position={[0, 0.6, 0]}>
        <coneGeometry args={[0.9, 1.4, 16]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Heat Shield Base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.92, 0.85, 0.3, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Landing Gear Struts */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, -0.4, 0]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      ))}

      {/* Thruster Plume Flame (Flickering) */}
      {isDescending && (
        <group ref={flameRef} position={[0, -0.65, 0]}>
          <mesh rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.45, 1.2, 12]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.85} />
          </mesh>
          <pointLight color="#fbbf24" intensity={5} distance={6} />
        </group>
      )}
    </group>
  )
}

// ─── Swirling Martian Dust Storm Particle System ─────────────────────────

function DustStormParticles({ active }) {
  const pointsRef = useRef()
  const count = 1400

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 45
      pos[i * 3 + 1] = Math.random() * 14 - 1.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 45
      spd[i] = 0.15 + Math.random() * 0.3
    }
    return [pos, spd]
  }, [])

  useFrame(() => {
    if (!pointsRef.current || !active) return
    const pos = pointsRef.current.geometry.attributes.position.array

    for (let i = 0; i < count; i++) {
      // Wind whips horizontally across the viewport
      pos[i * 3] += speeds[i] * 1.5
      pos[i * 3 + 1] += Math.sin(pos[i * 3] * 0.1) * 0.04

      // Wrap around
      if (pos[i * 3] > 22) {
        pos[i * 3] = -22
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        color="#ea580c"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─── Camera Rig & Gentle Parallax Drift ──────────────────────────────────

function SceneLighting({ isAlarming, isHazard }) {
  const alarmLightRef = useRef()

  useFrame((state) => {
    if (alarmLightRef.current && isAlarming) {
      alarmLightRef.current.intensity = 3 + Math.sin(state.clock.getElapsedTime() * 6) * 2.5
    }
  })

  return (
    <>
      <ambientLight intensity={isHazard ? 0.25 : 0.4} color={isHazard ? '#c2410c' : '#ffffff'} />
      <directionalLight
        position={[14, 18, 12]}
        intensity={1.8}
        color="#ffedd5"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-12, 8, -10]} intensity={0.4} color="#0284c7" />

      {/* Emergency Alarm Red Beacon */}
      {isAlarming && (
        <pointLight
          ref={alarmLightRef}
          position={[0, 4, 0]}
          color="#ef4444"
          distance={20}
        />
      )}
    </>
  )
}

// ─── Main Cinematic Viewport Export ─────────────────────────────────────

export default function CinematicViewport({
  isHazard = false,
  isAlarming = false,
  isLanderActive = false,
}) {
  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-space-black overflow-hidden select-none">
      <Canvas
        shadows
        camera={{ position: [0, 6, 17], fov: 48 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#070a12']} />
        <fog attach="fog" args={[isHazard ? '#26120c' : '#070a12', 15, 60]} />

        {/* Starfield */}
        <Stars radius={100} depth={50} count={3500} factor={4} saturation={0} fade speed={0.5} />

        {/* Orbit Controls (Interactive Look & Pan for Kids) */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.05} // Don't clip under ground
          minPolarAngle={Math.PI / 4}
          maxAzimuthAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 3}
          rotateSpeed={0.5}
        />

        {/* Scene Lighting */}
        <SceneLighting isAlarming={isAlarming} isHazard={isHazard} />

        {/* Celestial Mars Planet in Sky */}
        <PlanetMars isHazard={isHazard} />

        {/* Martian Surface Ground */}
        <MarsTerrain isAlarming={isAlarming} />

        {/* 3D Modular Outpost */}
        <OutpostModules isAlarming={isAlarming} />

        {/* Descending Lander Rocket */}
        <SupplyLander isDescending={isLanderActive} />

        {/* Storm Particle Emitter */}
        <DustStormParticles active={isHazard || isAlarming} />
      </Canvas>
    </div>
  )
}

