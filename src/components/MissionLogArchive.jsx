import { useEffect } from 'react'
import {
  X,
  History,
  AlertTriangle,
  Zap,
  Wind,
  Shield,
  Sprout,
  BookOpen,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import sound from '../engine/soundFx.js'

/**
 * MissionLogArchive — Interactive Drawer showing all command decisions
 * made during the mission and their compound resource costs.
 *
 * Props:
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {object[]} history - Array of sol history entries from gameEngine
 * @param {number} currentSol
 */
export default function MissionLogArchive({ isOpen, onClose, history = [], currentSol = 1 }) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        sound.playClick()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Compute compound resource deltas
  const compoundDeltas = history.reduce(
    (acc, entry) => {
      if (entry.effects) {
        acc.power += entry.effects.power || 0
        acc.oxygen += entry.effects.oxygen || 0
        acc.shields += entry.effects.shields || 0
        acc.food += entry.effects.food || 0
      }
      return acc
    },
    { power: 0, oxygen: 0, shields: 0, food: 0 }
  )

  const resourceConfig = [
    { key: 'power', label: 'Power', emoji: '⚡', icon: Zap, delta: compoundDeltas.power, color: 'text-sol-gold' },
    { key: 'oxygen', label: 'Oxygen', emoji: '💨', icon: Wind, delta: compoundDeltas.oxygen, color: 'text-shield-cyan' },
    { key: 'shields', label: 'Shields', emoji: '🛡️', icon: Shield, delta: compoundDeltas.shields, color: 'text-life-green' },
    { key: 'food', label: 'Food / Bio', emoji: '🌱', icon: Sprout, delta: compoundDeltas.food, color: 'text-mars-orange' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-space-black/70 backdrop-blur-sm transition-opacity"
      onClick={() => {
        sound.playClick()
        onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="archive-drawer-title"
    >
      <div
        className="w-full max-w-xl h-full bg-space-deep/95 border-l border-nasa-blue/40 shadow-2xl
                   flex flex-col overflow-hidden text-starfield animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nasa-blue/20 bg-space-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-nasa-blue/30 text-shield-cyan">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 id="archive-drawer-title" className="font-display text-base tracking-wider uppercase">
                Mission Log & Decision Archive
              </h2>
              <p className="font-mono text-xs text-starfield/60">
                Sol {currentSol} • {history.length} Decision{history.length === 1 ? '' : 's'} Logged
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick()
              onClose()
            }}
            className="p-2 rounded-lg text-starfield/60 hover:text-starfield hover:bg-white/10
                       transition-colors cursor-pointer"
            aria-label="Close archive drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compound Cost Dashboard */}
        <div className="px-6 py-4 bg-nasa-blue/10 border-b border-nasa-blue/20">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-starfield/70">
              Compound Decision Impact
            </span>
            <span className="font-mono text-[11px] text-shield-cyan/80">
              Excludes passive sol drain
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {resourceConfig.map(({ key, label, emoji, delta, color }) => {
              const isPositive = delta > 0
              const isZero = delta === 0
              return (
                <div
                  key={key}
                  className="px-2.5 py-2 rounded-lg bg-space-black/50 border border-white/5 flex flex-col items-center text-center"
                >
                  <span className="text-sm mb-0.5">{emoji}</span>
                  <span className="font-mono text-[10px] text-starfield/50 uppercase truncate w-full">
                    {label}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold flex items-center gap-0.5 ${
                      isZero ? 'text-starfield/60' : isPositive ? 'text-life-green' : 'text-alert-red'
                    }`}
                  >
                    {!isZero && (isPositive ? <TrendingUp className="w-3 h-3 inline" /> : <TrendingDown className="w-3 h-3 inline" />)}
                    {isPositive ? `+${delta}%` : `${delta}%`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Decision History List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center px-4">
              <BookOpen className="w-12 h-12 text-starfield/20 mb-3" />
              <p className="font-display text-sm tracking-wide text-starfield/70 mb-1">
                Mission Flight Log Empty
              </p>
              <p className="font-mono text-xs text-starfield/40 max-w-xs">
                As Commander, each trade-off decision you make for Outpost Sol-1 will be permanently recorded here with its scientific rationale.
              </p>
            </div>
          ) : (
            history.map((entry, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  entry.failedResource
                    ? 'bg-alert-red/10 border-alert-red/40'
                    : 'bg-space-black/40 border-nasa-blue/20'
                } relative`}
              >
                {/* Sol & Event Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-sol-gold/20 text-sol-gold font-bold">
                      SOL {entry.sol}
                    </span>
                    <h3 className="font-display text-sm text-starfield font-medium">
                      {entry.eventTitle || 'Telemetry Event'}
                    </h3>
                  </div>
                  {entry.hazardLevel && (
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-nasa-red/20 text-nasa-red">
                      Lvl {entry.hazardLevel}
                    </span>
                  )}
                </div>

                {/* Source dataset */}
                {entry.sourceDataset && (
                  <p className="font-mono text-[10px] text-shield-cyan/80 mb-2">
                    Source: {entry.sourceDataset}
                  </p>
                )}

                {/* Commander Choice */}
                <div className="mb-2.5 p-2 rounded-lg bg-space-deep/80 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-starfield/90 font-medium mb-1">
                    <ArrowRight className="w-3.5 h-3.5 text-shield-cyan shrink-0" />
                    <span>Order: {entry.choiceLabel}</span>
                  </div>

                  {/* Effects badges */}
                  {entry.effects && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {Object.entries(entry.effects).map(([res, val]) => {
                        if (val === 0) return null
                        const isPos = val > 0
                        const emoji = res === 'power' ? '⚡' : res === 'oxygen' ? '💨' : res === 'shields' ? '🛡️' : '🌱'
                        return (
                          <span
                            key={res}
                            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                              isPos ? 'bg-life-green/20 text-life-green' : 'bg-alert-red/20 text-alert-red'
                            }`}
                          >
                            {emoji} {isPos ? `+${val}%` : `${val}%`}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Outcome */}
                {entry.outcomeText && (
                  <p className="font-mono text-xs text-starfield/70 mb-2 leading-relaxed">
                    {entry.outcomeText}
                  </p>
                )}

                {/* Scientific Insight */}
                {entry.scienceNote && (
                  <div className="mt-2 pt-2 border-t border-white/5 flex gap-2 items-start">
                    <BookOpen className="w-3.5 h-3.5 text-sol-gold shrink-0 mt-0.5" />
                    <p className="font-mono text-[11px] text-starfield/50 leading-relaxed italic">
                      {entry.scienceNote}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-3 border-t border-nasa-blue/20 bg-space-black/60 flex items-center justify-between">
          <span className="font-mono text-[11px] text-starfield/50">
            Target: 10 Sols to complete expedition
          </span>
          <button
            onClick={() => {
              sound.playClick()
              onClose()
            }}
            className="px-4 py-1.5 rounded-lg text-xs font-mono bg-nasa-blue/40 text-starfield hover:bg-nasa-blue/60 transition-colors cursor-pointer"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  )
}

