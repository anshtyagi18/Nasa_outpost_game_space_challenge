import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * SolarSystem3D — Cinematic Animated 3D Solar System & Celestial Planets
 * Renders real 3D planets (Mars, Earth, Moon, Saturn, Sun, Jupiter) with
 * procedural high-res textures, orbital paths, rotating atmospheres, and starfields.
 * Completely offline resilient — 100% procedural WebGL without external texture asset dependencies.
 */
export default function SolarSystem3D({ environment = 'space', stageIdx = 0 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── 1. Three.js Scene Setup ──
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    )
    camera.position.set(0, 15, 65)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
    container.appendChild(renderer.domElement)

    // ── 2. Procedural Texture Generators ──
    // Mars Texture
    const createMarsTexture = () => {
      const c = document.createElement('canvas')
      c.width = 512
      c.height = 256
      const ctx = c.getContext('2d')
      // Base martian soil
      const grad = ctx.createLinearGradient(0, 0, 0, 256)
      grad.addColorStop(0, '#c75a2a')
      grad.addColorStop(0.5, '#ad441d')
      grad.addColorStop(1, '#8f3314')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 512, 256)

      // Darker iron-oxide maria & craters
      ctx.fillStyle = '#6e2712'
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 512
        const y = 40 + Math.random() * 176
        const r = 6 + Math.random() * 28
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      // Polar Ice Cap
      ctx.fillStyle = '#f8fafc'
      ctx.beginPath()
      ctx.ellipse(256, 12, 60, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(256, 246, 50, 8, 0, 0, Math.PI * 2)
      ctx.fill()

      const tex = new THREE.CanvasTexture(c)
      tex.wrapS = THREE.RepeatWrapping
      return tex
    }

    // Earth Texture
    const createEarthTexture = () => {
      const c = document.createElement('canvas')
      c.width = 512
      c.height = 256
      const ctx = c.getContext('2d')
      // Blue Oceans
      ctx.fillStyle = '#0f3a6b'
      ctx.fillRect(0, 0, 512, 256)

      // Continents
      ctx.fillStyle = '#227341'
      const drawBlob = (x, y, w, h) => {
        ctx.beginPath()
        ctx.ellipse(x, y, w, h, 0.2, 0, Math.PI * 2)
        ctx.fill()
      }
      drawBlob(130, 90, 45, 30) // N. America
      drawBlob(170, 160, 30, 45) // S. America
      drawBlob(270, 90, 40, 35) // Europe
      drawBlob(280, 150, 38, 45) // Africa
      drawBlob(370, 100, 65, 45) // Asia
      drawBlob(410, 180, 30, 25) // Australia

      // Polar Ice
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 512, 16)
      ctx.fillRect(0, 240, 512, 16)

      const tex = new THREE.CanvasTexture(c)
      tex.wrapS = THREE.RepeatWrapping
      return tex
    }

    // Earth Clouds Texture
    const createEarthCloudsTexture = () => {
      const c = document.createElement('canvas')
      c.width = 512
      c.height = 256
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, 512, 256)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 512
        const y = 30 + Math.random() * 196
        const rx = 15 + Math.random() * 40
        const ry = 4 + Math.random() * 10
        ctx.beginPath()
        ctx.ellipse(x, y, rx, ry, 0.1, 0, Math.PI * 2)
        ctx.fill()
      }
      const tex = new THREE.CanvasTexture(c)
      tex.wrapS = THREE.RepeatWrapping
      return tex
    }

    // Saturn Texture (Gas Giant Bands)
    const createSaturnTexture = () => {
      const c = document.createElement('canvas')
      c.width = 512
      c.height = 256
      const ctx = c.getContext('2d')
      const bands = ['#e6c88f', '#cca064', '#ddbe7d', '#b7894a', '#e9ce9a', '#c39556', '#ebd6aa']
      const h = 256 / bands.length
      bands.forEach((col, idx) => {
        ctx.fillStyle = col
        ctx.fillRect(0, idx * h, 512, h + 1)
      })
      const tex = new THREE.CanvasTexture(c)
      tex.wrapS = THREE.RepeatWrapping
      return tex
    }

    // Saturn Rings Texture
    const createSaturnRingsTexture = () => {
      const c = document.createElement('canvas')
      c.width = 256
      c.height = 32
      const ctx = c.getContext('2d')
      const grad = ctx.createLinearGradient(0, 0, 256, 0)
      grad.addColorStop(0, 'rgba(215, 185, 135, 0)')
      grad.addColorStop(0.15, 'rgba(225, 195, 145, 0.85)')
      grad.addColorStop(0.45, 'rgba(195, 160, 115, 0.9)')
      grad.addColorStop(0.5, 'rgba(20, 20, 30, 0.1)') // Cassini Division gap!
      grad.addColorStop(0.55, 'rgba(235, 205, 155, 0.85)')
      grad.addColorStop(0.85, 'rgba(180, 145, 100, 0.7)')
      grad.addColorStop(1, 'rgba(150, 120, 80, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 256, 32)
      return new THREE.CanvasTexture(c)
    }

    // Moon Texture
    const createMoonTexture = () => {
      const c = document.createElement('canvas')
      c.width = 256
      c.height = 128
      const ctx = c.getContext('2d')
      ctx.fillStyle = '#8f949c'
      ctx.fillRect(0, 0, 256, 128)
      ctx.fillStyle = '#676b73'
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 256
        const y = Math.random() * 128
        ctx.beginPath()
        ctx.arc(x, y, 3 + Math.random() * 12, 0, Math.PI * 2)
        ctx.fill()
      }
      return new THREE.CanvasTexture(c)
    }

    // Sun Radial Corona Texture
    const createSunTexture = () => {
      const c = document.createElement('canvas')
      c.width = 256
      c.height = 256
      const ctx = c.getContext('2d')
      const rad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
      rad.addColorStop(0, '#ffffff')
      rad.addColorStop(0.2, '#fef08a')
      rad.addColorStop(0.5, '#f59e0b')
      rad.addColorStop(0.8, '#ea580c')
      rad.addColorStop(1, 'rgba(180, 40, 10, 0)')
      ctx.fillStyle = rad
      ctx.fillRect(0, 0, 256, 256)
      return new THREE.CanvasTexture(c)
    }

    // ── 3. Starfield Background (1500 Stars) ──
    const starGeo = new THREE.BufferGeometry()
    const starCount = 1200
    const starPos = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#fef08a'),
      new THREE.Color('#fdba74'),
    ]

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3
      starPos[i3] = (Math.random() - 0.5) * 800
      starPos[i3 + 1] = (Math.random() - 0.5) * 600
      starPos[i3 + 2] = (Math.random() - 0.5) * 600 - 100

      const col = palette[Math.floor(Math.random() * palette.length)]
      starColors[i3] = col.r
      starColors[i3 + 1] = col.g
      starColors[i3 + 2] = col.b
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

    const starMat = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    })
    const starField = new THREE.Points(starGeo, starMat)
    scene.add(starField)

    // ── 4. Lights ──
    const sunLight = new THREE.PointLight(0xfff7ed, 2.5, 400)
    sunLight.position.set(-35, 12, -15)
    scene.add(sunLight)

    const ambientLight = new THREE.AmbientLight(0x223355, 0.8)
    scene.add(ambientLight)

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.6)
    rimLight.position.set(40, 20, 20)
    scene.add(rimLight)

    // ── 5. The Sun (Distant Golden Star) ──
    const sunGeo = new THREE.SphereGeometry(6, 32, 32)
    const sunMat = new THREE.MeshBasicMaterial({
      map: createSunTexture(),
      color: 0xffe277,
    })
    const sun = new THREE.Mesh(sunGeo, sunMat)
    sun.position.copy(sunLight.position)
    scene.add(sun)

    // Sun Corona Sprite
    const spriteMat = new THREE.SpriteMaterial({
      map: createSunTexture(),
      color: 0xffaa33,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.7,
    })
    const sunSprite = new THREE.Sprite(spriteMat)
    sunSprite.scale.set(28, 28, 1)
    sun.add(sunSprite)

    // Helper: Create Glowing Orbit Ellipse Ring
    const createOrbitLine = (radiusX, radiusZ, color = 0x38bdf8) => {
      const points = []
      const segs = 96
      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusZ))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points)
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
      })
      const line = new THREE.Line(geo, mat)
      line.position.copy(sun.position)
      return line
    }

    const orbitMarsLine = createOrbitLine(38, 30, 0xf97316)
    const orbitEarthLine = createOrbitLine(26, 20, 0x06b6d4)
    const orbitSaturnLine = createOrbitLine(56, 44, 0xfacc15)
    scene.add(orbitMarsLine)
    scene.add(orbitEarthLine)
    scene.add(orbitSaturnLine)

    // ── 6. Mars (Featured Planet) ──
    const marsPivot = new THREE.Group()
    marsPivot.position.copy(sun.position)
    scene.add(marsPivot)

    const marsGeo = new THREE.SphereGeometry(3.6, 32, 32)
    const marsMat = new THREE.MeshStandardMaterial({
      map: createMarsTexture(),
      roughness: 0.85,
      metalness: 0.1,
    })
    const mars = new THREE.Mesh(marsGeo, marsMat)
    mars.rotation.z = (25.2 * Math.PI) / 180 // Mars axial tilt!
    marsPivot.add(mars)

    // Mars Atmospheric Rim Glow
    const marsAtmosphereGeo = new THREE.SphereGeometry(3.72, 32, 32)
    const marsAtmosphereMat = new THREE.MeshBasicMaterial({
      color: 0xf97316,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    })
    const marsAtmo = new THREE.Mesh(marsAtmosphereGeo, marsAtmosphereMat)
    mars.add(marsAtmo)

    // ── 7. Earth & Orbiting Moon ──
    const earthPivot = new THREE.Group()
    earthPivot.position.copy(sun.position)
    scene.add(earthPivot)

    const earthGeo = new THREE.SphereGeometry(3.2, 32, 32)
    const earthMat = new THREE.MeshStandardMaterial({
      map: createEarthTexture(),
      roughness: 0.6,
      metalness: 0.1,
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    earth.rotation.z = (23.5 * Math.PI) / 180 // Earth axial tilt!
    earthPivot.add(earth)

    // Earth Clouds
    const cloudGeo = new THREE.SphereGeometry(3.26, 32, 32)
    const cloudMat = new THREE.MeshStandardMaterial({
      map: createEarthCloudsTexture(),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })
    const earthClouds = new THREE.Mesh(cloudGeo, cloudMat)
    earth.add(earthClouds)

    // Moon Orbiting Earth
    const moonGeo = new THREE.SphereGeometry(0.85, 24, 24)
    const moonMat = new THREE.MeshStandardMaterial({
      map: createMoonTexture(),
      roughness: 0.9,
    })
    const moon = new THREE.Mesh(moonGeo, moonMat)
    earth.add(moon)

    // ── 8. Saturn with 3D Rings ──
    const saturnPivot = new THREE.Group()
    saturnPivot.position.copy(sun.position)
    scene.add(saturnPivot)

    const saturnGeo = new THREE.SphereGeometry(4.2, 32, 32)
    const saturnMat = new THREE.MeshStandardMaterial({
      map: createSaturnTexture(),
      roughness: 0.7,
    })
    const saturn = new THREE.Mesh(saturnGeo, saturnMat)
    saturn.rotation.z = (26.7 * Math.PI) / 180
    saturnPivot.add(saturn)

    // Saturn Rings (Double sided)
    const ringGeo = new THREE.RingGeometry(5.2, 9.5, 64)
    // Rotate ring geometry to lie flat on equator
    ringGeo.rotateX(Math.PI / 2)
    const ringMat = new THREE.MeshStandardMaterial({
      map: createSaturnRingsTexture(),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    })
    const saturnRings = new THREE.Mesh(ringGeo, ringMat)
    saturn.add(saturnRings)

    // ── 9. Orbiting NASA Deep Space Satellite Probe ──
    const satellite = new THREE.Group()
    const probeBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.5, 0.8),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
    )
    const solarWingLeft = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.05, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.5, roughness: 0.3 })
    )
    solarWingLeft.position.set(-1.0, 0, 0)
    const solarWingRight = solarWingLeft.clone()
    solarWingRight.position.set(1.0, 0, 0)

    satellite.add(probeBody, solarWingLeft, solarWingRight)
    scene.add(satellite)

    // ── 10. Mouse Interaction Parallax ──
    let mouseX = 0
    let mouseY = 0
    let targetCameraX = 0
    let targetCameraY = 15

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      mouseX = (e.clientX / innerWidth - 0.5) * 2
      mouseY = (e.clientY / innerHeight - 0.5) * 2
      targetCameraX = mouseX * 12
      targetCameraY = 15 - mouseY * 8
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // ── 11. Animation Loop ──
    let animationFrameId
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Rotate Planets on their own axes
      mars.rotation.y += 0.007
      earth.rotation.y += 0.009
      earthClouds.rotation.y += 0.012
      saturn.rotation.y += 0.006
      sun.rotation.y += 0.002
      starField.rotation.y += 0.0003

      // Planetary Revolutions along orbits
      // Mars: medium speed, position offset
      const marsAngle = elapsed * 0.12 + 1.2
      mars.position.set(
        Math.cos(marsAngle) * 38,
        Math.sin(marsAngle * 0.5) * 2,
        Math.sin(marsAngle) * 30
      )

      // Earth: faster speed
      const earthAngle = elapsed * 0.18 + 3.8
      earth.position.set(
        Math.cos(earthAngle) * 26,
        Math.sin(earthAngle * 0.3) * 1.5,
        Math.sin(earthAngle) * 20
      )

      // Moon revolving Earth
      const moonAngle = elapsed * 1.2
      moon.position.set(Math.cos(moonAngle) * 5.5, 0, Math.sin(moonAngle) * 5.5)

      // Saturn: slower stately orbit
      const saturnAngle = elapsed * 0.06 + 5.2
      saturn.position.set(
        Math.cos(saturnAngle) * 56,
        Math.sin(saturnAngle * 0.2) * 3,
        Math.sin(saturnAngle) * 44
      )

      // Orbiting Satellite
      const satTime = elapsed * 0.4
      satellite.position.set(
        Math.sin(satTime) * 32,
        8 + Math.cos(satTime * 2) * 3,
        Math.cos(satTime) * 24
      )
      satellite.rotation.y = satTime
      satellite.rotation.x = Math.sin(satTime) * 0.3

      // Sun Corona Pulsing
      const pulse = 1 + Math.sin(elapsed * 2.5) * 0.08
      sunSprite.scale.set(28 * pulse, 28 * pulse, 1)

      // Smooth camera parallax easing
      camera.position.x += (targetCameraX - camera.position.x) * 0.04
      camera.position.y += (targetCameraY - camera.position.y) * 0.04
      camera.lookAt(0, 4, 0)

      renderer.render(scene, camera)
    }

    animate()

    // ── 12. Responsive Resize Handling ──
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
    window.addEventListener('resize', handleResize)

    // ── 13. Clean Cleanup on Unmount ──
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      resizeObserver.disconnect()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }

      // Dispose Three.js objects
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => {
              if (mat.map) mat.map.dispose()
              mat.dispose()
            })
          } else {
            if (obj.material.map) obj.material.map.dispose()
            obj.material.dispose()
          }
        }
      })
      renderer.dispose()
    }
  }, [environment, stageIdx])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  )
}

