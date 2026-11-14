import { motion } from 'framer-motion';
import { playClick } from '../utils/sound';

// Which science fact to show based on which meter failed
const FAILURE_SCIENCE = {
  power: {
    title: 'Real NASA Science: Solar Power on Mars',
    icon: '⚡',
    color: 'yellow',
    facts: [
      'Mars receives only 43% of the sunlight that Earth gets, making solar power much harder!',
      'NASA\'s Perseverance rover uses a nuclear battery (RTG) instead of solar panels because of Martian dust storms.',
      'The Opportunity rover survived 15 years on Mars — but finally stopped communicating when a 2018 global dust storm covered its solar panels for months.',
    ],
    link: { label: 'NASA Mars Trek', url: 'https://trek.nasa.gov/mars/#' },
  },
  food: {
    title: 'Real NASA Science: Life Support & Hydroponics',
    icon: '🌱',
    color: 'green',
    facts: [
      'Astronauts on the International Space Station have successfully grown lettuce, radishes, and dwarf tomatoes in space!',
      'NASA OSDR Study OSD-379 proved that space-grown radishes are completely nutritious and safe to eat.',
      'The CSA Space Food Production Toolkit details how closed-loop hydroponic systems recycle humidity into drinking water.',
    ],
    link: { label: 'CSA Food Toolkit', url: 'https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/' },
  },
  shield: {
    title: 'Real NASA Science: Mars Radiation Shielding',
    icon: '🛡️',
    color: 'purple',
    facts: [
      'Mars lacks a global protective magnetic field, so its surface receives ~0.7 mSv of radiation per day — 85× more than Earth!',
      'NASA RadLab instruments on the Curiosity rover (MSL-RAD) continuously measure this ionizing dose on the Martian surface.',
      'Future Martian habitats will need regolith shielding, water wall layers, or active magnetic deflectors to protect astronauts.',
    ],
    link: { label: 'NASA RadLab', url: 'https://visualization.osdr.nasa.gov/radlab/gui/data-api/' },
  },
};

export default function FailureScreen({ scenario, meters, failureReason, choiceHistory, onRestart }) {
  // Determine which meter failed
  const failedMeter = Object.entries(meters).find(([, v]) => v <= 0)?.[0] || 'power';
  const science = FAILURE_SCIENCE[failedMeter] || FAILURE_SCIENCE.power;
  const colorMap = {
    yellow: { border: 'border-yellow-500/40', bg: 'bg-yellow-900/20', text: 'text-yellow-300', btn: 'bg-yellow-600 hover:bg-yellow-500' },
    green: { border: 'border-green-500/40', bg: 'bg-green-900/20', text: 'text-green-300', btn: 'bg-green-600 hover:bg-green-500' },
    purple: { border: 'border-purple-500/40', bg: 'bg-purple-900/20', text: 'text-purple-300', btn: 'bg-purple-600 hover:bg-purple-500' },
  };
  const c = colorMap[science.color];

  return (
    <div className="flex flex-col items-center gap-5 py-8">
      {/* Failure header */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <div className="text-6xl mb-2">💥</div>
        <h1 className="font-orbitron font-black text-3xl text-red-400">MISSION SCRUBBED</h1>
        <p className="text-slate-400 text-sm mt-2">{failureReason}</p>
      </motion.div>

      {/* What went wrong — real science */}
      <motion.div
        className={`w-full max-w-sm rounded-2xl border ${c.border} ${c.bg} p-4`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{science.icon}</span>
          <h3 className={`font-orbitron font-black text-sm ${c.text}`}>{science.title}</h3>
        </div>
        <ul className="space-y-2">
          {science.facts.map((fact, i) => (
            <motion.li
              key={i}
              className="flex gap-2 text-xs text-slate-300 leading-relaxed"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <span className="text-cyan-400 flex-shrink-0 mt-0.5">→</span>
              <span>{fact}</span>
            </motion.li>
          ))}
        </ul>
        <a
          href={science.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl ${c.btn} text-white text-xs font-bold font-orbitron transition-colors`}
        >
          🔗 Learn More: {science.link.label} ↗
        </a>
      </motion.div>

      {/* Sol log */}
      {choiceHistory.length > 0 && (
        <motion.div
          className="w-full max-w-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="font-orbitron font-bold text-xs text-slate-400 mb-2">YOUR MISSION LOG:</h4>
          <div className="space-y-1">
            {choiceHistory.map((entry, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-800/60 rounded-lg px-3 py-2 text-xs">
                <span className="text-slate-400 font-orbitron font-bold">Sol {entry.sol}</span>
                <span className="text-slate-300">{entry.scenarioId.replace(/-/g, ' ')}</span>
                <div className="flex gap-1">
                  {Object.entries(entry.effects).filter(([,v]) => v !== 0).map(([k, v]) => (
                    <span key={k} className={`font-bold font-orbitron ${v > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {v > 0 ? '+' : ''}{v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Encouragement + restart */}
      <motion.div
        className="text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-slate-400 text-sm mb-4 max-w-xs">
          Real NASA missions prepare for every emergency! Review the science and try again — every simulation makes you a better planner! 💪
        </p>
        <motion.button
          onClick={() => { playClick(); onRestart(); }}
          className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-base rounded-2xl font-orbitron shadow-lg transition-all glow-orange"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          🔄 RETRY SIMULATION
        </motion.button>
      </motion.div>
    </div>
  );
}
