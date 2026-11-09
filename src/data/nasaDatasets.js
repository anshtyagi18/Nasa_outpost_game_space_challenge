/**
 * nasaDatasets.js — NASA Open-Data Event Engine for Outpost Sol-1
 *
 * Integrates real scientific data logic from:
 *   • NASA DONKI  — Coronal Mass Ejections, Solar Flares, Geomagnetic Storms,
 *                    Solar Energetic Particles, Interplanetary Shocks
 *   • NASA Mars InSight / Curiosity — Dust accumulation, pressure drops,
 *                                      temperature extremes
 *   • NASA OSDR   — Microgravity biology, hydroponics, plant growth studies
 *
 * Architecture:
 *   fetchNasaEvents()   → tries live NASA DONKI API, falls back to curated data
 *   CURATED_EVENTS[]    → 12 offline-safe, kid-friendly events with real trade-offs
 *   pickEventForSol()   → deterministic-but-varied event selector per sol
 *
 * Every event has exactly 2 choices. Neither choice is completely safe —
 * each mirrors a real engineering trade-off that NASA mission planners face.
 *
 * @see https://api.nasa.gov  (DONKI, InSight, APOD)
 * @see https://osdr.nasa.gov (Open Science Data Repository)
 */

import { NASA_API_BASE, NASA_API_KEY } from './nasaApi.js'

// ─── Live NASA fetch with resilient fallback ────────────────────────────

/**
 * Attempt to fetch recent space-weather notifications from NASA DONKI.
 * Returns parsed JSON on success, or null on any failure.
 *
 * @param {'FLR'|'CME'|'GST'|'SEP'} type  DONKI event type code
 * @param {number} days                     Look-back window in days
 * @returns {Promise<object[]|null>}
 */
export async function fetchDonkiEvents(type = 'FLR', days = 30) {
  const end = new Date()
  const start = new Date(end.getTime() - days * 86_400_000)

  const fmt = (d) => d.toISOString().slice(0, 10)
  const url =
    `${NASA_API_BASE}/DONKI/${type}` +
    `?startDate=${fmt(start)}&endDate=${fmt(end)}` +
    `&api_key=${NASA_API_KEY}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : null
  } catch {
    // Network error, timeout, or offline — silently fall back
    return null
  }
}

/**
 * Try to enrich the curated event catalogue with live DONKI data.
 * If the API is unreachable (offline judging, rate-limited, etc.),
 * the curated fallback is used unchanged — the app never crashes.
 *
 * @returns {Promise<object[]>}  Array of game-ready event objects
 */
export async function fetchNasaEvents() {
  try {
    const [flares, cmes] = await Promise.all([
      fetchDonkiEvents('FLR', 30),
      fetchDonkiEvents('CME', 30),
    ])

    // If we got live data, annotate the matching curated events
    const enriched = CURATED_EVENTS.map((event) => {
      const copy = { ...event }

      if (event.sourceDataset === 'NASA DONKI — Solar Flare' && flares?.length) {
        const latest = flares[flares.length - 1]
        copy.liveDataNote =
          `Real NASA data: ${flares.length} solar flare(s) detected in the last 30 days. ` +
          `Latest class: ${latest.classType || 'Unknown'}.`
      }

      if (event.sourceDataset === 'NASA DONKI — Coronal Mass Ejection' && cmes?.length) {
        const latest = cmes[cmes.length - 1]
        copy.liveDataNote =
          `Real NASA data: ${cmes.length} CME(s) recorded recently. ` +
          `Latest speed: ${latest.speed || '—'} km/s.`
      }

      return copy
    })

    return enriched
  } catch {
    // Any unexpected error → return curated data untouched
    return [...CURATED_EVENTS]
  }
}

// ─── Curated Event Catalogue ────────────────────────────────────────────
//
// Each event mirrors a real scenario NASA engineers face.
// hazardLevel:  1 = informational  →  5 = mission-critical
//
// Choice design rule: BOTH options cost something.
//   • Choice A protects one system but strains another.
//   • Choice B protects a different system but has its own penalty.
//
// scienceNote: written at a 4th–6th grade reading level, explaining
// the real NASA engineering principle behind the decision.

export const CURATED_EVENTS = [
  // ── DONKI: Solar Flares ───────────────────────────────────────────
  {
    id: 'flr_001',
    title: '☀️ Solar Flare Alert!',
    hazardLevel: 3,
    sourceDataset: 'NASA DONKI — Solar Flare',
    scenarioDescription:
      'The Sun just burped a giant radioactive X-flare straight at Outpost Sol-1! We have 15 minutes to brace before radiation slams our electronics!',
    scienceNote:
      'NASA classifies solar flares by their X-ray brightness: A, B, C, M, and X (strongest). On the International Space Station, astronauts shelter in the most-shielded modules during X-class flares. The trade-off is real: shielding uses heavy materials that cost power to deploy, and sheltering means pausing experiments and EVAs.',
    choices: [
      {
        id: 'flr_001_a',
        label: '🛡️ Activate Full Radiation Shields',
        description: 'Divert all available battery power to the magnetic shield array.',
        effects: { power: -20, oxygen: 0, shields: +15, food: 0 },
        outcomeText:
          'The shields absorb the worst of the radiation — but the power drain forces you to shut down the greenhouse grow-lights for this sol.',
      },
      {
        id: 'flr_001_b',
        label: '🏃 Emergency Crew Shelter',
        description: 'Hustle the crew into the storm shelter and seal outer modules.',
        effects: { power: 0, oxygen: -15, shields: +5, food: -10 },
        outcomeText:
          'The crew is safe in the shelter, but sealed modules trap CO₂ (straining scrubbers) and nobody can tend the food crops.',
      },
    ],
  },

  // ── DONKI: Coronal Mass Ejection ──────────────────────────────────
  {
    id: 'cme_001',
    title: '🌊 Coronal Mass Ejection Incoming!',
    hazardLevel: 4,
    sourceDataset: 'NASA DONKI — Coronal Mass Ejection',
    scenarioDescription:
      'A super-tsunami of scorching solar plasma is racing at our base at 1,500 km/s! Protect our electronics before they fry!',
    scienceNote:
      'A Coronal Mass Ejection (CME) is a huge cloud of magnetized plasma ejected from the Sun. They can weigh billions of tons! NASA\'s SOHO and STEREO spacecraft watch for CMEs. In deep space, astronauts have no Earth magnetic field to protect them.',
    choices: [
      {
        id: 'cme_001_a',
        label: '⚡ Power Down & Shield Up',
        description: 'Shut down non-essential systems and route all energy to mag-shields.',
        effects: { power: -25, oxygen: -5, shields: +25, food: -5 },
        outcomeText:
          'Your shields hold strong against the CME! But the power-down means the water recycler ran at half-speed and food dehydrators stopped.',
      },
      {
        id: 'cme_001_b',
        label: '🌱 Protect the Greenhouse',
        description: 'Use emergency power to keep the greenhouse sealed and heated.',
        effects: { power: -15, oxygen: -10, shields: -10, food: +15 },
        outcomeText:
          'The plants survive with extra CO₂ scrubbing, boosting food reserves. But radiation hits exposed modules and shield integrity drops.',
      },
    ],
  },

  // ── DONKI: Geomagnetic Storm ──────────────────────────────────────
  {
    id: 'gst_001',
    title: '🧲 Geomagnetic Storm Warning!',
    hazardLevel: 3,
    sourceDataset: 'NASA DONKI — Geomagnetic Storm',
    scenarioDescription:
      'Static is screeching across our radios and rover compasses are spinning wildly! A magnetic storm is cutting us off from Earth!',
    scienceNote:
      'Geomagnetic storms happen when solar plasma hits magnetic fields. During the 1989 storm, Quebec, Canada lost power for 9 hours! NASA\'s ACE satellite gives about 30-60 minutes warning to prepare power grids.',
    choices: [
      {
        id: 'gst_001_a',
        label: '📡 Boost Antenna Power',
        description: 'Crank transmission power to maximum to punch through the static.',
        effects: { power: -20, oxygen: 0, shields: -5, food: 0 },
        outcomeText:
          'You maintain communication with Mission Control, but the massive power draw drains batteries and antenna heat weakens nearby shielding.',
      },
      {
        id: 'gst_001_b',
        label: '🔇 Go Silent & Conserve',
        description: 'Turn off comms, park the rovers, and wait out the storm.',
        effects: { power: +10, oxygen: -10, shields: 0, food: -10 },
        outcomeText:
          'Power reserves recover, but without rover scouting, you miss an ice deposit and the oxygen recycler wasted reserves on an old setting.',
      },
    ],
  },

  // ── DONKI: Solar Energetic Particles ──────────────────────────────
  {
    id: 'sep_001',
    title: '⚛️ Solar Particle Storm!',
    hazardLevel: 5,
    sourceDataset: 'NASA DONKI — Solar Energetic Particles',
    scenarioDescription:
      'Invisible proton bullets traveling near light-speed are hammering our habitat! Radiation alarms are blaring inside!',
    scienceNote:
      'Solar Energetic Particles (SEPs) travel at nearly the speed of light. NASA uses hydrogen-rich materials for spacecraft walls because hydrogen atoms stop protons. On the ISS, water storage bags are placed around sleeping quarters as emergency radiation shielding!',
    choices: [
      {
        id: 'sep_001_a',
        label: '💧 Water-Wall Shield Protocol',
        description: 'Pump drinking water into wall bladders for emergency shielding.',
        effects: { power: -10, oxygen: -15, shields: +20, food: 0 },
        outcomeText:
          'The water-walls absorb most particle radiation — just like on the ISS! But pumping takes power and sealed rooms build up CO₂.',
      },
      {
        id: 'sep_001_b',
        label: '🚀 Rotate Habitat Angle',
        description: 'Turn the outpost so the thickest armored hull faces the Sun.',
        effects: { power: -20, oxygen: -5, shields: +10, food: -10 },
        outcomeText:
          'The rotation helps deflect protons, but thrusters use precious power and the greenhouse gets less sunlight, slowing crop growth.',
      },
    ],
  },

  // ── Mars InSight: Dust Accumulation ───────────────────────────────
  {
    id: 'dust_001',
    title: '🏜️ Martian Dust Buildup!',
    hazardLevel: 2,
    sourceDataset: 'NASA Mars InSight — Dust Monitoring',
    scenarioDescription:
      'Yikes! Gritty red Martian dust is choking our solar panels! Our battery power is plunging fast!',
    scienceNote:
      'Mars dust is super fine — like smoke particles — and sticks with static electricity. NASA\'s InSight lander slowly lost power over 4 years as dust piled up. Engineers poured sand near panels on windy days so bouncing grains would knock dust off!',
    choices: [
      {
        id: 'dust_001_a',
        label: '🤖 Deploy Cleaning Rovers',
        description: 'Send mini-rovers outside to brush and sweep the solar panels clean.',
        effects: { power: -10, oxygen: -5, shields: 0, food: 0 },
        outcomeText:
          'The rovers clean 80% of the dust off and power recovers! But rovers consumed batteries and supervising crew used airlock oxygen.',
      },
      {
        id: 'dust_001_b',
        label: '🔋 Fire Up Backup Fuel Cells',
        description: 'Ignore the panels for now and burn hydrogen fuel cells.',
        effects: { power: +5, oxygen: -15, shields: 0, food: -5 },
        outcomeText:
          'Fuel cells keep lights on, but consume hydrogen needed for water recycling. Oxygen drops because the air generator shares the same fuel.',
      },
    ],
  },

  // ── Mars Curiosity: Extreme Cold Snap ─────────────────────────────
  {
    id: 'cold_001',
    title: '🥶 Extreme Temperature Drop!',
    hazardLevel: 3,
    sourceDataset: 'NASA Mars Curiosity — Environmental Monitoring',
    scenarioDescription:
      'Brrr! Temperatures just plummeted to -120°C tonight on Mars! Our greenhouse crops will freeze into popsicles without heat!',
    scienceNote:
      'Mars temperatures can swing 70°C between day and night because the thin atmosphere can\'t trap heat. NASA\'s Curiosity rover uses a nuclear RTG battery that generates heat as a bonus to stay warm.',
    choices: [
      {
        id: 'cold_001_a',
        label: '🔥 Blast Thermal Heaters',
        description: 'Crank habitat heaters to maximum to protect both crew and plants.',
        effects: { power: -25, oxygen: 0, shields: -5, food: +10 },
        outcomeText:
          'The heaters keep everything warm and crops thrive! But the power drain is huge and exterior thermal strain weakens hull shielding.',
      },
      {
        id: 'cold_001_b',
        label: '🏠 Seal & Huddle in Core',
        description: 'Abandon outer greenhouse modules and huddle inside the insulated core.',
        effects: { power: -5, oxygen: -20, shields: 0, food: -15 },
        outcomeText:
          'Power is conserved, but the cramped core causes CO₂ to climb quickly. Abandoned greenhouse seedlings freeze in the cold.',
      },
    ],
  },

  // ── Mars InSight: Dust Devil Season ───────────────────────────────
  {
    id: 'devil_001',
    title: '🌪️ Dust Devil Season!',
    hazardLevel: 2,
    sourceDataset: 'NASA Mars InSight — Seismometer & Weather',
    scenarioDescription:
      'Huge 5-mile-tall swirling dust devils are roaring past our outpost! They could sandblast our panels—or sweep them clean!',
    scienceNote:
      'Martian dust devils can reach 8 km (5 miles) high! NASA\'s Spirit rover got lucky power boosts when dust devils wiped panels clean (called "cleaning events"). But they also whip up abrasive grit.',
    choices: [
      {
        id: 'devil_001_a',
        label: '🍀 Leave Panels Exposed',
        description: 'Take the gamble! Hope the dust devils wipe the panels clean like Spirit rover.',
        effects: { power: +15, oxygen: 0, shields: -10, food: 0 },
        outcomeText:
          'Luck is with you! A swirling vortex sweeps the panels spotless and power surges! But flying grit scratches the shield sensor array.',
      },
      {
        id: 'devil_001_b',
        label: '🛡️ Retract & Protect Everything',
        description: 'Pull in antennas, close panel blast-shields, and batten down the hatches.',
        effects: { power: -10, oxygen: -5, shields: +5, food: -5 },
        outcomeText:
          'Everything stays safe, but zero solar power is generated during the storm. Air scrubbers use reserves and plants miss light cycles.',
      },
    ],
  },

  // ── OSDR: Microgravity Plant Growth Crisis ────────────────────────
  {
    id: 'bio_001',
    title: '🌱 Plant Growth Anomaly!',
    hazardLevel: 2,
    sourceDataset: 'NASA OSDR — Microgravity Hydroponics',
    scenarioDescription:
      'Our space lettuce roots are growing sideways and twisting in crazy loops! The plants forgot which way is down!',
    scienceNote:
      'In reduced gravity, plant roots get confused because there is no strong downward pull (gravitropism). NASA\'s Veggie project on the ISS discovered that calibrated LED light wavelengths can guide roots when gravity cannot.',
    choices: [
      {
        id: 'bio_001_a',
        label: '💡 Install Extra Grow LEDs',
        description: 'Add intense red and blue LED strips so leaves know where "up" is.',
        effects: { power: -15, oxygen: +5, shields: 0, food: +10 },
        outcomeText:
          'The bright LEDs act like a lighthouse for roots! Plant growth bounces back and photosynthesis pumps out fresh oxygen, though power drains.',
      },
      {
        id: 'bio_001_b',
        label: '🔄 Spin the Centrifuge Planter',
        description: 'Spin the hydroponics carousel to create artificial gravity.',
        effects: { power: -10, oxygen: -5, shields: -5, food: +15 },
        outcomeText:
          'Artificial gravity straightens out the stems and food production jumps! But centrifuge vibrations stress hab seals and air scrubbers.',
      },
    ],
  },

  // ── OSDR: Algae Bioreactor Overgrowth ─────────────────────────────
  {
    id: 'bio_002',
    title: '🦠 Algae Bioreactor Overflow!',
    hazardLevel: 3,
    sourceDataset: 'NASA OSDR — Closed-Loop Life Support',
    scenarioDescription:
      'The emergency algae slime tank is bubbling out of control! Green goo is clogging the oxygen pipes!',
    scienceNote:
      'NASA researches edible micro-algae (like Spirulina) because it creates oxygen and protein. But balancing closed ecosystems is tricky — excess algae can consume oxygen at night and choke water circulation.',
    choices: [
      {
        id: 'bio_002_a',
        label: '🌡️ UV Sterilization Zap',
        description: 'Blast the tanks with UV light pulses to trim excess algae blooms.',
        effects: { power: -10, oxygen: -10, shields: 0, food: +5 },
        outcomeText:
          'The UV zap clears the pipes! But the lamps draw battery power, and killing off algae temporarily drops oxygen generation.',
      },
      {
        id: 'bio_002_b',
        label: '🍽️ Harvest the Algae Slime',
        description: 'Have the crew scoop up and process the overflow into space snack bars.',
        effects: { power: -5, oxygen: -5, shields: 0, food: +20 },
        outcomeText:
          'The crew turns the green goo into super-protein bars! Food stores jump, though manual scooping and processing burns oxygen and battery.',
      },
    ],
  },

  // ── Mars: Global Dust Storm ───────────────────────────────────────
  {
    id: 'storm_001',
    title: '🌫️ Global Dust Storm!',
    hazardLevel: 5,
    sourceDataset: 'NASA Mars Reconnaissance Orbiter — Weather Imaging',
    scenarioDescription:
      'A monstrous red dust storm has swallowed the entire planet of Mars! The sky turned black and solar power is dead!',
    scienceNote:
      'Every few Mars years, dust storms grow until they wrap around the entire planet! In 2018, a global storm blocked 99% of sunlight and ended Opportunity\'s 15-year mission. Future Mars bases will require nuclear RTG backups.',
    choices: [
      {
        id: 'storm_001_a',
        label: '☢️ Fire Up Emergency Nuclear RTG',
        description: 'Start up the radioisotope generator for high power through the blackout.',
        effects: { power: +10, oxygen: -5, shields: -15, food: -5 },
        outcomeText:
          'The RTG roars to life and powers the base! But thermal radiation degrades nearby shield sensors and dries out stored rations.',
      },
      {
        id: 'storm_001_b',
        label: '😴 Deep Hibernation Mode',
        description: 'Power down everything except emergency life support and sleep it out.',
        effects: { power: -5, oxygen: -20, shields: +5, food: -15 },
        outcomeText:
          'The outpost survives in quiet slumber. Shields stay undamaged, but sleeping crew still consumes oxygen while air scrubbers run on low.',
      },
    ],
  },

  // ── DONKI: Interplanetary Shock Wave ──────────────────────────────
  {
    id: 'ips_001',
    title: '💥 Interplanetary Shock Wave!',
    hazardLevel: 4,
    sourceDataset: 'NASA DONKI — Interplanetary Shock',
    scenarioDescription:
      'Sonic boom in space! A massive solar shock wave just hammered our sector and shook the entire outpost hull!',
    scienceNote:
      'Interplanetary shocks occur when fast solar wind crashes into slower space weather fronts, acting like a sonic boom. NASA\'s ACE spacecraft orbits at the L1 Lagrange point to detect these shock waves before they hit.',
    choices: [
      {
        id: 'ips_001_a',
        label: '🧲 Overcharge Magnetic Deflector',
        description: 'Pump maximum juice into the electromagnetic field to deflect the blast.',
        effects: { power: -25, oxygen: 0, shields: +15, food: -5 },
        outcomeText:
          'The boosted mag-field deflects the shock! But coils overheat, draining batteries and scorching some hydroponic seedling racks.',
      },
      {
        id: 'ips_001_b',
        label: '🌀 Pressure Equalization Vent',
        description: 'Vent small amounts of gas to equalize pressure against the shock front.',
        effects: { power: 0, oxygen: -20, shields: +10, food: 0 },
        outcomeText:
          'Pressure equalization prevents hull rupture! But venting air sacrifices valuable oxygen, forcing the crew onto emergency masks.',
      },
    ],
  },

  // ── OSDR: Water Recycler Contamination ────────────────────────────
  {
    id: 'water_001',
    title: '💧 Water Recycler Contamination!',
    hazardLevel: 3,
    sourceDataset: 'NASA OSDR — ISS Environmental Control & Life Support',
    scenarioDescription:
      'Gross! Slimy space bacteria are growing inside the water recycling pipes! Our drinking water and oxygen supply are in danger!',
    scienceNote:
      'The ISS recycles over 90% of water — including sweat and urine! Bacterial biofilms inside microgravity plumbing are a constant challenge. In 2019, NASA discovered unique bacteria on the ISS adapted specifically to space plumbing.',
    choices: [
      {
        id: 'water_001_a',
        label: '🧪 Silver-Ion Chemical Flush',
        description: 'Flush the pipes with silver disinfectant to wipe out bacteria.',
        effects: { power: -5, oxygen: -10, shields: 0, food: -10 },
        outcomeText:
          'Silver ions kill the slime and water is pure again! But flush cycles waste water needed by oxygen generators and hydroponic nutrient tanks.',
      },
      {
        id: 'water_001_b',
        label: '🔥 Superheat Sterilization',
        description: 'Boil water lines to 120°C to scorch every microbe alive.',
        effects: { power: -20, oxygen: +5, shields: -5, food: -5 },
        outcomeText:
          'Microbes are fried and oxygen generators run clean! But heating draws heavy power, deferring shield tune-ups.',
      },
    ],
  },
]

// ─── Event Selector ─────────────────────────────────────────────────────

/**
 * Pick an event appropriate for the given sol.
 *
 * Early sols get lower-hazard events; later sols escalate.
 * Uses a seeded-ish rotation so events feel varied but are reproducible.
 *
 * @param {number} sol             Current sol number (1-based)
 * @param {object[]} [events]      Event pool (defaults to CURATED_EVENTS)
 * @returns {object}               A single event object
 */
export function pickEventForSol(sol, events = CURATED_EVENTS) {
  // Filter by hazard: sols 1-2 see levels 1-3, sols 3-5 see 2-4, sols 6+ see 3-5
  const minHazard = sol <= 2 ? 1 : sol <= 5 ? 2 : 3
  const maxHazard = sol <= 2 ? 3 : sol <= 5 ? 4 : 5

  const eligible = events.filter(
    (e) => e.hazardLevel >= minHazard && e.hazardLevel <= maxHazard
  )

  // Deterministic-but-varied selection based on sol
  const pool = eligible.length > 0 ? eligible : events
  const index = ((sol * 7) + (sol * sol * 3)) % pool.length
  return pool[index]
}

