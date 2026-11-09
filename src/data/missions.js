/**
 * Mission definitions for Outpost Sol-1.
 *
 * Each mission has objectives the player must complete to earn badges.
 * Missions unlock progressively as the player survives more sols.
 */

const MISSIONS = [
  {
    id: 'mission_01',
    title: 'First Light',
    unlockSol: 1,
    description: 'Boot up the outpost and keep all systems online for one full sol.',
    objectives: [
      { id: 'obj_power_online',  label: 'Bring power above 50%',   check: (s) => s.resources.power >= 50 },
      { id: 'obj_water_stable',  label: 'Stabilize water supply',  check: (s) => s.resources.water >= 40 },
      { id: 'obj_survive_sol_1', label: 'Survive Sol 1',           check: (s) => s.sol >= 2 },
    ],
    badge: '🌅',
  },
  {
    id: 'mission_02',
    title: 'Storm Chaser',
    unlockSol: 2,
    description: 'Survive your first space weather event without losing a resource below 20%.',
    objectives: [
      { id: 'obj_weather_survive', label: 'Endure a space weather event', check: () => false /* wired in engine */ },
      { id: 'obj_no_critical',     label: 'No resource below 20%',       check: (s) => Object.values(s.resources).every((v) => v >= 20) },
    ],
    badge: '⚡',
  },
  {
    id: 'mission_03',
    title: 'Resource Commander',
    unlockSol: 3,
    description: 'Reach max capacity on any two resources simultaneously.',
    objectives: [
      { id: 'obj_two_max', label: 'Two resources at 100%', check: (s) => Object.values(s.resources).filter((v) => v >= 100).length >= 2 },
    ],
    badge: '🏆',
  },
]

export default MISSIONS

