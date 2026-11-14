import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export default function MeterBar({ label, emoji, value, previewDelta, colorClass }) {
  const clamped = Math.max(0, Math.min(100, value));
  const preview = previewDelta != null ? Math.max(0, Math.min(100, value + previewDelta)) : null;
  const isDanger = clamped < 35;
  const isWarning = clamped < 60 && clamped >= 35;

  const barColor = isDanger
    ? 'bg-gradient-to-r from-red-600 to-red-500'
    : isWarning
    ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
    : colorClass || 'bg-gradient-to-r from-cyan-500 to-blue-500';

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Label */}
      <div className="flex items-center gap-1 w-20 flex-shrink-0">
        <span className="text-base">{emoji}</span>
        <span className="text-xs font-bold text-slate-300 font-orbitron truncate">{label}</span>
      </div>

      {/* Bar track */}
      <div className="relative flex-1 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        {/* Preview ghost bar */}
        {preview != null && preview !== clamped && (
          <div
            className={clsx(
              'absolute top-0 left-0 h-full rounded-full opacity-30 transition-all duration-300',
              preview > clamped ? 'bg-green-400' : 'bg-red-400'
            )}
            style={{ width: `${preview}%` }}
          />
        )}
        {/* Main bar */}
        <motion.div
          className={clsx('h-full rounded-full relative', barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
        </motion.div>

        {/* Danger pulse */}
        {isDanger && (
          <motion.div
            className="absolute inset-0 bg-red-500/20 rounded-full"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>

      {/* Value + preview delta */}
      <div className="w-16 flex-shrink-0 text-right">
        <span className={clsx(
          'text-sm font-bold font-orbitron',
          isDanger ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-slate-300'
        )}>
          {Math.round(clamped)}%
        </span>
        {previewDelta != null && previewDelta !== 0 && (
          <div className={clsx(
            'text-xs font-bold',
            previewDelta > 0 ? 'text-green-400 choice-preview-up' : 'text-red-400 choice-preview-down'
          )}>
            {previewDelta > 0 ? `▲${previewDelta}` : `▼${Math.abs(previewDelta)}`}
          </div>
        )}
      </div>
    </div>
  );
}
