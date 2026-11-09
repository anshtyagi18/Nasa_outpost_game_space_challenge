import { useState, useRef, useEffect } from 'react'
import { Rocket } from 'lucide-react'

export default function VirtualJoystick({ onMove, onDash }) {
  const [touchActive, setTouchActive] = useState(false)
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 })
  const baseRef = useRef(null)

  const handleTouchStart = (e) => {
    setTouchActive(true)
    handleTouchMove(e)
  }

  const handleTouchMove = (e) => {
    if (!baseRef.current) return
    const touch = e.touches[0]
    const rect = baseRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const dx = touch.clientX - centerX
    const dy = touch.clientY - centerY
    const dist = Math.hypot(dx, dy)
    const maxRadius = rect.width / 2

    const angle = Math.atan2(dy, dx)
    const clampedDist = Math.min(dist, maxRadius)

    const sx = Math.cos(angle) * clampedDist
    const sy = Math.sin(angle) * clampedDist

    setStickPos({ x: sx, y: sy })
    onMove(sx / maxRadius, sy / maxRadius)
  }

  const handleTouchEnd = () => {
    setTouchActive(false)
    setStickPos({ x: 0, y: 0 })
    onMove(0, 0)
  }

  return (
    <div className="md:hidden pointer-events-auto fixed bottom-5 left-5 right-5 flex items-end justify-between z-40 select-none">
      {/* Virtual D-Pad Thumbstick */}
      <div
        ref={baseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-space-deep/80 border-2 border-shield-cyan/40 backdrop-blur-md relative flex items-center justify-center touch-none shadow-lg"
      >
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-shield-cyan to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-transform duration-75"
          style={{
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          }}
        />
      </div>

      {/* Big Tactile DASH / BOOST Touch Button */}
      <button
        onTouchStart={(e) => {
          e.preventDefault()
          onDash()
        }}
        onClick={onDash}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-sol-gold to-orange-500 border-2 border-sol-gold
                   shadow-[0_0_25px_rgba(251,191,36,0.5)] flex flex-col items-center justify-center
                   text-space-black font-display font-extrabold text-xs active:scale-95 transition-transform cursor-pointer"
      >
        <Rocket className="w-8 h-8 mb-1" />
        <span>BOOST</span>
      </button>
    </div>
  )
}
