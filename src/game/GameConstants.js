/**
 * GameConstants.js — Space Cadet: Sol Survivors
 *
 * Balance configurations, weapon types, hazard definitions,
 * drop types, and real NASA engineering upgrade cards.
 */

export const ARENA_SIZE = 3000 // Total arena width and height in world pixels

export const UPGRADE_CARDS = [
  {
    id: 'solar_overcharge',
    title: '☀️ Solar Panel Overcharge',
    badge: 'MOBILITY & WEAPONS',
    icon: '⚡',
    color: '#fbbf24',
    border: 'border-amber-400',
    glow: 'rgba(251, 191, 36, 0.4)',
    buffText: '+35% Rover Speed & +25% Laser Fire Rate',
    debuffText: '-15% Base Shielding (Thermal Waste)',
    fact: 'NASA solar panels produce up to 120 kW on the ISS, but excess electrical power converts to heat that strains cooling radiators!',
    apply: (p, b) => {
      p.speedMultiplier *= 1.35
      p.fireRateMultiplier *= 1.25
      b.shields = Math.max(0, b.shields - 15)
    },
  },
  {
    id: 'regolith_bunker',
    title: '🛡️ Lunar Regolith Bunker',
    badge: 'DEFENSE',
    icon: '🏰',
    color: '#22c55e',
    border: 'border-emerald-400',
    glow: 'rgba(34, 197, 94, 0.4)',
    buffText: '+40% Max Base Shields & +25% Player Armor',
    debuffText: '-15% Rover Dash Recharging Speed',
    fact: 'Moon and Mars dirt ("regolith") is packed with iron and silica. Piling 2 meters of regolith over a habitat stops deadly cosmic rays!',
    apply: (p, b) => {
      b.maxShields = Math.min(200, b.maxShields + 40)
      b.shields = Math.min(b.maxShields, b.shields + 40)
      p.armor += 0.25
      p.dashCooldownMax *= 1.15
    },
  },
  {
    id: 'hydroponics_uv',
    title: '🌱 Hydroponics UV Hyper-Boost',
    badge: 'LIFE SUPPORT',
    icon: '🌿',
    color: '#06b6d4',
    border: 'border-cyan-400',
    glow: 'rgba(6, 182, 212, 0.4)',
    buffText: '+35% Base Oxygen & Food Generation',
    debuffText: '-20% Base Battery Reserve',
    fact: 'NASA\'s Veggie plant chamber uses tuned red and blue LED wavelengths to grow space salad without natural sunlight, but drinks lots of watts!',
    apply: (p, b) => {
      b.regenRate *= 1.35
      b.oxygen = Math.min(b.maxOxygen, b.oxygen + 30)
      b.power = Math.max(0, b.power - 20)
    },
  },
  {
    id: 'donki_mag_shield',
    title: '🧲 DONKI Magnetic Deflector',
    badge: 'HELIOPHYSICS TECH',
    icon: '🌊',
    color: '#a855f7',
    border: 'border-purple-400',
    glow: 'rgba(168, 85, 247, 0.4)',
    buffText: 'Unlocks Pulsing Magnetic Repulsor Wave',
    debuffText: '-10% Max Battery Capacity',
    fact: 'NASA\'s DONKI watches Coronal Mass Ejections (CMEs). Artificial magnetic fields deflect high-speed protons just like Earth\'s magnetosphere!',
    apply: (p) => {
      p.hasRepulsor = true
      p.repulsorLevel = (p.repulsorLevel || 0) + 1
    },
  },
  {
    id: 'curiosity_cannons',
    title: '🔫 Curiosity Dual Plasma Cannons',
    badge: 'OFFENSIVE',
    icon: '🎯',
    color: '#ef4444',
    border: 'border-red-400',
    glow: 'rgba(239, 68, 68, 0.4)',
    buffText: '+1 Extra Simultaneous Auto-Targeting Laser',
    debuffText: '+10% Collision Damage From Debris',
    fact: 'NASA\'s Curiosity and Perseverance rovers carry high-power ChemCam lasers that vaporize rock samples from up to 23 feet away!',
    apply: (p) => {
      p.gunCount = Math.min(5, p.gunCount + 1)
      p.damageMultiplier *= 1.2
    },
  },
  {
    id: 'rtg_overdrive',
    title: '☢️ RTG Nuclear Battery Overdrive',
    badge: 'ENERGY TECH',
    icon: '⚛️',
    color: '#f97316',
    border: 'border-orange-400',
    glow: 'rgba(249, 115, 22, 0.4)',
    buffText: '+50% Salvage Magnet Range & +20% Laser Damage',
    debuffText: '-10% Outpost Shield Integrity',
    fact: 'Radioisotope Thermoelectric Generators (RTGs) turn natural heat from decaying plutonium into electricity, powering rovers for decades in the dark!',
    apply: (p, b) => {
      p.magnetRadius *= 1.5
      p.damageMultiplier *= 1.2
      b.shields = Math.max(0, b.shields - 10)
    },
  },
  {
    id: 'water_wall_shield',
    title: '💧 Water-Wall ECLSS Blanket',
    badge: 'SURVIVAL',
    icon: '🚰',
    color: '#38bdf8',
    border: 'border-sky-400',
    glow: 'rgba(56, 189, 248, 0.4)',
    buffText: 'Instantly Repairs 40 HP & +30 Base Oxygen',
    debuffText: '-10% Rover Turn & Strafe Agility',
    fact: 'Water is full of hydrogen atoms, which are the #1 best atomic shield against cosmic rays. Astronaut sleeping quarters on the ISS are lined with water bags!',
    apply: (p, b) => {
      p.hp = Math.min(p.maxHp, p.hp + 40)
      b.oxygen = Math.min(b.maxOxygen, b.oxygen + 30)
    },
  },
  {
    id: 'drone_escort',
    title: '🛰️ Artemis Drone Companion',
    badge: 'AUTONOMOUS BOT',
    icon: '🤖',
    color: '#10b981',
    border: 'border-emerald-500',
    glow: 'rgba(16, 185, 129, 0.4)',
    buffText: 'Deploys an Orbital Sentinel Drone that Zaps Hazards',
    debuffText: 'Requires Constant Base Power Feed (-5/sol)',
    fact: 'NASA\'s Ingenuity Mars helicopter proved that autonomous rotorcraft can scout alien terrain ahead of wheeled rovers!',
    apply: (p) => {
      p.droneCount = (p.droneCount || 0) + 1
    },
  },
]

export const HAZARD_TYPES = {
  DEBRIS: {
    id: 'debris',
    name: 'Space Debris',
    emoji: '🛰️',
    radius: 18,
    speed: 1.6,
    hp: 20,
    xpValue: 15,
    color: '#94a3b8',
    glow: '#cbd5e1',
    damage: 15,
    score: 50,
  },
  METEOR: {
    id: 'meteor',
    name: 'Micro-Meteoroid',
    emoji: '☄️',
    radius: 14,
    speed: 2.8,
    hp: 12,
    xpValue: 20,
    color: '#f97316',
    glow: '#ea580c',
    damage: 20,
    score: 75,
  },
  RADIATION: {
    id: 'radiation',
    name: 'DONKI Radiation Swarm',
    emoji: '☣️',
    radius: 22,
    speed: 1.2,
    hp: 35,
    xpValue: 30,
    color: '#a855f7',
    glow: '#d946ef',
    damage: 25,
    score: 120,
  },
  SOLAR_CME: {
    id: 'solar_cme',
    name: 'CME Plasma Elite',
    emoji: '☀️',
    radius: 34,
    speed: 1.0,
    hp: 110,
    xpValue: 80,
    color: '#ef4444',
    glow: '#f87171',
    damage: 40,
    score: 300,
  },
}

export const SALVAGE_TYPES = {
  XP: {
    id: 'xp',
    label: 'NASA Data Core',
    emoji: '🔬',
    color: '#c084fc',
    glow: '#a855f7',
    radius: 8,
    value: 10,
  },
  POWER: {
    id: 'power',
    label: 'Power Cell',
    emoji: '⚡',
    color: '#fbbf24',
    glow: '#f59e0b',
    radius: 9,
    value: 15,
  },
  OXYGEN: {
    id: 'oxygen',
    label: 'Oxygen Canister',
    emoji: '💨',
    color: '#38bdf8',
    glow: '#0284c7',
    radius: 9,
    value: 15,
  },
  SHIELD: {
    id: 'shield',
    label: 'Regolith Core',
    emoji: '🛡️',
    color: '#4ade80',
    glow: '#16a34a',
    radius: 9,
    value: 20,
  },
}
