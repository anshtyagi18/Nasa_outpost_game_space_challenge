import { RESOURCE_META } from '../engine/GameEngine.js'
import {
  Zap,
  Wind,
  ShieldCheck,
  Sprout,
} from 'lucide-react'

/**
 * Icon mapping for each resource key.
 */
const RESOURCE_ICONS = {
  power:   Zap,
  oxygen:  Wind,
  shields: ShieldCheck,
  food:    Sprout,
}

/**
 * Tailwind color classes per resource key.
 */
const RESOURCE_COLORS = {
  power:   'bg-sol-gold',
  oxygen:  'bg-shield-cyan',
  shields: 'bg-life-green',
  food:    'bg-mars-orange',
}

/**
 * Status-based bar glow effects.
 */
const STATUS_GLOW = {
  critical:  'shadow-[0_0_12px_rgba(239,68,68,0.6)]',
  warning:   'shadow-[0_0_8px_rgba(251,191,36,0.4)]',
  normal:    '',
  excellent: 'shadow-[0_0_8px_rgba(34,197,94,0.3)]',
}

/**
 * A single resource bar with icon, label, value, and animated gauge.
 */
function ResourceBar({ resourceKey, value, status }) {
  const meta = RESOURCE_META[resourceKey]
  const Icon = RESOURCE_ICONS[resourceKey]
  const barColor = RESOURCE_COLORS[resourceKey]
  const glow = STATUS_GLOW[status] || ''

  const textColor =
    status === 'critical' ? 'text-alert-red' :
    status === 'warning'  ? 'text-sol-gold' :
    'text-starfield/80'

  return (
    <div className={`flex items-center gap-3 ${glow} rounded-lg px-1 py-0.5`}>
      <div className="flex items-center gap-1.5 w-10 shrink-0 justify-center">
        <span className="text-sm" role="img" aria-label={meta.label}>{meta.emoji}</span>
        <Icon className="w-4 h-4 text-starfield/60" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-starfield/60 truncate">
            {meta.label}
          </span>
          <span className={`font-mono text-xs font-semibold ${textColor}`}>
            {Math.round(value)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-space-deep overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
            style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Heads-Up Display showing the 4 core outpost resources.
 *
 * Props:
 * @param {object}  resources  – { power, oxygen, shields, food } values (0–100)
 * @param {number}  sol        – Current sol number
 * @param {string}  phase      – Current game phase
 */
export default function HUD({ resources, sol, phase }) {
  // Derive status per resource
  const getStatus = (value) => {
    if (value <= 15) return 'critical'
    if (value <= 30) return 'warning'
    if (value >= 80) return 'excellent'
    return 'normal'
  }

  // Default resources for initial render
  const res = resources || { power: 75, oxygen: 75, shields: 75, food: 75 }

  return (
    <section
      aria-label="Outpost resource status"
      className="mx-auto mt-6 max-w-md w-full px-5 py-4 rounded-2xl
                 bg-space-deep/60 backdrop-blur-md border border-nasa-blue/30
                 shadow-[0_0_40px_-10px_rgba(11,61,145,0.4)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-sm tracking-widest text-shield-cyan/70 uppercase">
          Outpost Status
        </h2>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-sol-gold/80 tracking-wider">
            SOL {sol || 1}
          </span>
          {phase && (
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-nasa-blue/30 text-starfield/50 uppercase">
              {phase.replace('_', ' ')}
            </span>
          )}
        </div>
      </div>

      {/* Resource bars */}
      <div className="flex flex-col gap-3">
        {Object.entries(res).map(([key, value]) => (
          <ResourceBar
            key={key}
            resourceKey={key}
            value={value}
            status={getStatus(value)}
          />
        ))}
      </div>

      {/* Critical warning */}
      {Object.values(res).some((v) => v <= 15) && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-alert-red/10 border border-alert-red/30 text-center">
          <span className="font-mono text-xs text-alert-red animate-pulse">
            ⚠️ CRITICAL RESOURCE WARNING — MISSION AT RISK
          </span>
        </div>
      )}
    </section>
  )
}
