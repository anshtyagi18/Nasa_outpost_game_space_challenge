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
      'Warning! An X-class solar flare has erupted from the Sun. A wave of intense ' +
      'radiation is heading toward your outpost. Your crew has about 15 minutes to react. ' +
      'The radiation could damage electronics and harm astronauts outside the habitat.',
    scienceNote:
      'NASA classifies solar flares by their X-ray brightness: A, B, C, M, and X (strongest). ' +
      'On the International Space Station, astronauts shelter in the most-shielded modules during ' +
      'X-class flares. The trade-off is real: shielding uses heavy materials that cost power to ' +
      'deploy, and sheltering means pausing experiments and EVAs.',
    choices: [
      {
        id: 'flr_001_a',
        label: '🛡️ Activate Full Radiation Shields',
        description: 'Divert all available power to the electromagnetic shielding array.',
        effects: { power: -20, oxygen: 0, shields: +15, food: 0 },
        outcomeText:
          'The shields absorb the worst of the radiation — but the power drain forces you to ' +
          'shut down the greenhouse grow-lights for this sol.',
      },
      {
        id: 'flr_001_b',
        label: '🏃 Emergency Crew Shelter',
        description: 'Move the crew to the storm shelter and seal the outer modules.',
        effects: { power: 0, oxygen: -15, shields: +5, food: -10 },
        outcomeText:
          'The crew is safe in the shelter, but the sealed modules trap CO₂, straining the ' +
          'scrubbers, and nobody can tend the food crops while sheltering.',
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
      'A massive bubble of superheated plasma is racing toward your outpost at 1,500 km/s! ' +
      'This CME will arrive in about 2 sols and could fry unshielded electronics. ' +
      'You need to prepare NOW.',
    scienceNote:
      'A Coronal Mass Ejection (CME) is a huge cloud of magnetized plasma ejected from the Sun. ' +
      'They can weigh billions of tons! NASA\'s SOHO and STEREO spacecraft watch for CMEs. ' +
      'When one heads toward Earth, satellites can be damaged and power grids on the ground ' +
      'can overload. In deep space, astronauts have no magnetic field to protect them.',
    choices: [
      {
        id: 'cme_001_a',
        label: '⚡ Power Down & Shield Up',
        description: 'Shut down non-essential systems and route all energy to mag-shields.',
        effects: { power: -25, oxygen: -5, shields: +25, food: -5 },
        outcomeText:
          'Your shields hold strong against the CME! But the power-down means the water ' +
          'recycler ran at half-speed and the food dehydrators stopped.',
      },
      {
        id: 'cme_001_b',
        label: '🌱 Protect the Greenhouse',
        description: 'Use emergency power to keep the greenhouse sealed and heated.',
        effects: { power: -15, oxygen: -10, shields: -10, food: +15 },
        outcomeText:
          'The plants survive with extra CO₂ scrubbing, boosting food reserves. But the ' +
          'radiation hits some exposed habitat modules — shield integrity drops.',
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
      'A G3-class geomagnetic storm is disrupting your outpost\'s navigation and ' +
      'communication systems. Static fills every radio channel, and the compass-based ' +
      'rover navigation is going haywire.',
    scienceNote:
      'Geomagnetic storms happen when CME plasma hits Earth\'s magnetic field. They\'re ranked ' +
      'G1 (minor) to G5 (extreme). During the 1989 G5 storm, the entire province of Quebec, ' +
      'Canada lost power for 9 hours! NASA\'s ACE satellite gives about 30-60 minutes warning.',
    choices: [
      {
        id: 'gst_001_a',
        label: '📡 Boost Antenna Power',
        description: 'Increase transmission power to punch through the interference.',
        effects: { power: -20, oxygen: 0, shields: -5, food: 0 },
        outcomeText:
          'You maintain communication with Mission Control, but the extra power draw means ' +
          'the battery reserves drop significantly. The antenna heat also weakens nearby shielding.',
      },
      {
        id: 'gst_001_b',
        label: '🔇 Go Silent & Conserve',
        description: 'Switch off comms, park the rovers, and wait out the storm.',
        effects: { power: +10, oxygen: -10, shields: 0, food: -10 },
        outcomeText:
          'Power reserves recover, but without rover scouting, you miss a water-ice deposit. ' +
          'The crew\'s morale drops, and without comms, the oxygen recycler ran on an old setting ' +
          'that wasted reserves.',
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
      'Extremely fast protons — Solar Energetic Particles — are slamming into your ' +
      'outpost like invisible bullets! These are the most dangerous particles in space ' +
      'weather. Radiation levels inside the hab are climbing fast.',
    scienceNote:
      'Solar Energetic Particles (SEPs) travel at nearly the speed of light. They\'re so fast ' +
      'that there\'s almost no warning time. NASA is developing special hydrogen-rich materials ' +
      'for spacecraft walls because hydrogen atoms are great at stopping protons. On the ISS, ' +
      'the water storage bags are placed around sleeping quarters as extra radiation shielding!',
    choices: [
      {
        id: 'sep_001_a',
        label: '💧 Water-Wall Shield Protocol',
        description: 'Pump water reserves into the wall bladders for emergency radiation shielding.',
        effects: { power: -10, oxygen: -15, shields: +20, food: 0 },
        outcomeText:
          'The water-walls absorb most of the particle radiation — just like on the ISS! But ' +
          'moving all that water takes pump power and the sealed compartments build up CO₂.',
      },
      {
        id: 'sep_001_b',
        label: '🚀 Emergency Habitat Rotation',
        description: 'Rotate the outpost so the thickest hull section faces the Sun.',
        effects: { power: -20, oxygen: -5, shields: +10, food: -10 },
        outcomeText:
          'The rotation helps, but the maneuver uses thruster fuel (shared with power) and ' +
          'the greenhouse gets less sunlight, slowing plant growth.',
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
      'Fine Martian dust has been settling on your solar panels for several sols. Power ' +
      'generation has dropped by 30%. NASA\'s InSight lander faced this exact problem — ' +
      'its mission ended partly because dust covered its panels.',
    scienceNote:
      'Mars dust is super fine — about the size of particles in cigarette smoke. It sticks ' +
      'to everything with static electricity. NASA\'s InSight lander slowly lost power over ' +
      '4 years as dust piled up. Engineers got creative: they poured sand near the panels ' +
      'on windy days so the grains would bounce and knock dust off! This is called "dust ' +
      'cleaning events" and it actually worked for a while.',
    choices: [
      {
        id: 'dust_001_a',
        label: '🤖 Deploy Cleaning Rovers',
        description: 'Send small rovers to brush the solar panels clean.',
        effects: { power: -10, oxygen: -5, shields: 0, food: 0 },
        outcomeText:
          'The rovers clean 80% of the dust off — power generation is recovering! But the ' +
          'rovers used battery power to run, and the crew had to suit up (using oxygen) to ' +
          'supervise from the airlock.',
      },
      {
        id: 'dust_001_b',
        label: '🔋 Switch to Backup Fuel Cells',
        description: 'Ignore the panels and run on hydrogen fuel cells instead.',
        effects: { power: +5, oxygen: -15, shields: 0, food: -5 },
        outcomeText:
          'Fuel cells keep the lights on, but they consume hydrogen that you also need for ' +
          'water recycling. Oxygen reserves drop because the electrolysis system shares the ' +
          'same hydrogen supply.',
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
      'Nighttime temperatures have plunged to -120°C (-184°F)! That\'s cold enough to ' +
      'freeze carbon dioxide out of the thin Martian atmosphere. Your habitat heaters ' +
      'are working overtime, and the greenhouse plants are in danger of freezing.',
    scienceNote:
      'Mars temperatures can swing 70°C (126°F) between day and night because the atmosphere ' +
      'is so thin it can\'t hold heat. NASA\'s Curiosity rover uses a plutonium-powered ' +
      'nuclear battery (RTG) that generates heat as a bonus. Future Mars habitats will ' +
      'likely use a mix of nuclear power and heavy insulation — but insulation is heavy, ' +
      'and every kilogram sent to Mars costs about $54,000 to launch!',
    choices: [
      {
        id: 'cold_001_a',
        label: '🔥 Maximum Heaters',
        description: 'Crank all habitat heaters to maximum to protect crew and plants.',
        effects: { power: -25, oxygen: 0, shields: -5, food: +10 },
        outcomeText:
          'The heaters keep everything warm — the plants even thrive in the cozy conditions! ' +
          'But the power drain is massive, and the heated exterior panels weaken the thermal shielding.',
      },
      {
        id: 'cold_001_b',
        label: '🏠 Seal & Insulate Core Module',
        description: 'Abandon the outer modules and huddle in the insulated core.',
        effects: { power: -5, oxygen: -20, shields: 0, food: -15 },
        outcomeText:
          'Power savings are significant, but the cramped core means CO₂ builds up fast. ' +
          'The abandoned greenhouse modules freeze, damaging some crop seedlings.',
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
      'It\'s dust devil season on Mars! Spinning columns of dust keep whipping past the ' +
      'outpost. They could damage antennas, but they might also clean your dusty solar ' +
      'panels — a lucky break NASA has actually observed on Mars rovers!',
    scienceNote:
      'Martian dust devils can be HUGE — up to 8 km (5 miles) tall, much bigger than on Earth! ' +
      'NASA\'s Spirit rover got a lucky power boost when dust devils swept its panels clean. ' +
      'Scientists call these "cleaning events." But dust devils can also sandblast equipment ' +
      'and create static electricity that sticks to everything.',
    choices: [
      {
        id: 'devil_001_a',
        label: '🍀 Leave Panels Exposed',
        description: 'Hope the dust devils clean the panels — just like Spirit rover!',
        effects: { power: +15, oxygen: 0, shields: -10, food: 0 },
        outcomeText:
          'Luck is on your side! A dust devil sweeps the panels clean and power surges up! ' +
          'But the same wind throws grit at the shield array, scratching the protective coating.',
      },
      {
        id: 'devil_001_b',
        label: '🛡️ Retract & Protect Everything',
        description: 'Pull in antennas, close panel covers, and seal all external ports.',
        effects: { power: -10, oxygen: -5, shields: +5, food: -5 },
        outcomeText:
          'Everything is safe and sealed, but with panels covered you generate zero solar ' +
          'power this sol. The air scrubbers use reserves, and the plants miss their light cycle.',
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
      'Your hydroponics bay is showing strange growth patterns! The lettuce roots are ' +
      'growing sideways, and the tomato stems are curling in spirals. In reduced gravity, ' +
      'plants get confused about which way is "up." NASA sees this on the ISS too.',
    scienceNote:
      'On Earth, plant roots grow down (gravitropism) and stems grow up (phototropism). ' +
      'In space, there\'s no "down"! NASA\'s Veggie experiment on the ISS grows lettuce, ' +
      'radishes, and peppers. Scientists discovered that LED lights can guide plant growth ' +
      'when gravity can\'t. The astronauts also have to water plants with special pillow-like ' +
      'bags because water floats in microgravity!',
    choices: [
      {
        id: 'bio_001_a',
        label: '💡 Install Extra Grow Lights',
        description: 'Add more LED panels so the plants can use light to figure out "up."',
        effects: { power: -15, oxygen: +5, shields: 0, food: +10 },
        outcomeText:
          'The extra red and blue LEDs guide the plants beautifully — like a lighthouse for roots! ' +
          'Oxygen production improves as photosynthesis increases. But the lights draw serious power.',
      },
      {
        id: 'bio_001_b',
        label: '🔄 Activate Centrifuge Planter',
        description: 'Spin the hydroponics module to simulate gravity for the plants.',
        effects: { power: -10, oxygen: -5, shields: -5, food: +15 },
        outcomeText:
          'The spinning creates artificial gravity and the plants straighten out! Food yield jumps. ' +
          'But the vibrations from the centrifuge stress the habitat seals and use up oxygen reserves.',
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
      'The algae bioreactor — your backup oxygen and food source — is growing out of control! ' +
      'The algae is clogging filters and turning the nutrient water green. If it blocks the pipes, ' +
      'the whole life support loop could back up.',
    scienceNote:
      'NASA is researching algae like Spirulina and Chlorella for deep-space missions because ' +
      'they produce oxygen AND are edible — astronaut smoothies! The challenge is controlling ' +
      'growth. In the 1990s, the Biosphere 2 experiment showed how hard it is to balance a ' +
      'closed ecosystem. Too much algae consumes oxygen at night and can crash the system.',
    choices: [
      {
        id: 'bio_002_a',
        label: '🌡️ UV Sterilization Burst',
        description: 'Hit the bioreactor with UV light to kill excess algae.',
        effects: { power: -10, oxygen: -10, shields: 0, food: +5 },
        outcomeText:
          'The UV burst trims the algae back to healthy levels. But the UV lamps need power, ' +
          'and killing off algae temporarily reduces oxygen production until it regrows.',
      },
      {
        id: 'bio_002_b',
        label: '🍽️ Harvest the Surplus',
        description: 'Manually collect the excess algae for food processing.',
        effects: { power: -5, oxygen: -5, shields: 0, food: +20 },
        outcomeText:
          'The crew spends a whole sol harvesting and processing algae into protein bars. ' +
          'Food reserves get a big boost! But all that crew activity uses extra oxygen, and the ' +
          'processing equipment draws power.',
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
      'A planet-encircling dust storm is engulfing Mars! The sky has turned dark orange — ' +
      'so little sunlight reaches the surface that solar panels are almost useless. NASA\'s ' +
      'Opportunity rover was killed by a global dust storm in 2018. This is the most dangerous ' +
      'weather event on Mars.',
    scienceNote:
      'About every 3 Mars years (5.5 Earth years), dust storms can grow until they cover ' +
      'the ENTIRE planet! The 2018 storm that ended Opportunity\'s 15-year mission blocked ' +
      '99% of sunlight. NASA learned a huge lesson: future Mars bases need nuclear power ' +
      '(like Curiosity\'s RTG) or very large battery reserves. You can\'t rely on solar alone!',
    choices: [
      {
        id: 'storm_001_a',
        label: '☢️ Switch to Emergency Nuclear Mode',
        description: 'Activate the backup radioisotope generator — limited fuel, big output.',
        effects: { power: +10, oxygen: -5, shields: -15, food: -5 },
        outcomeText:
          'The RTG kicks in and keeps critical systems alive! But the generator produces radiation ' +
          'as a byproduct — shield reserves drop to protect the crew. The heat also dries out ' +
          'some food stores.',
      },
      {
        id: 'storm_001_b',
        label: '😴 Deep Hibernation Protocol',
        description: 'Put the outpost in minimum-power sleep mode. Crew rests. Wait it out.',
        effects: { power: -5, oxygen: -20, shields: +5, food: -15 },
        outcomeText:
          'The outpost hunkers down. Shields benefit from zero activity, but sleeping crew ' +
          'still breathes! CO₂ scrubbers run at minimum, making the air stale. No food ' +
          'production for the duration.',
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
      'A supersonic shock wave from a distant CME has just hit your sector of space! ' +
      'It compressed the solar wind, slamming a wall of charged particles into the outpost. ' +
      'Instruments are spiking and the hull is vibrating.',
    scienceNote:
      'Interplanetary shocks are like sonic booms in space. When a fast CME catches up to ' +
      'slower solar wind, it creates a shock front. NASA\'s ACE spacecraft, orbiting at the ' +
      'L1 point between Earth and the Sun, detects these shocks and gives warnings. The ' +
      'shock can compress magnetic fields and accelerate particles to dangerous energies.',
    choices: [
      {
        id: 'ips_001_a',
        label: '🧲 Magnetosphere Boost',
        description: 'Overcharge the magnetic field generators to deflect the shock.',
        effects: { power: -25, oxygen: 0, shields: +15, food: -5 },
        outcomeText:
          'The boosted mag-field deflects most of the shock! But the generators overheat, ' +
          'draining batteries and causing a minor fire that damages food storage.',
      },
      {
        id: 'ips_001_b',
        label: '🌀 Vent Atmosphere to Equalize Pressure',
        description: 'Release some internal atmosphere to reduce the pressure differential.',
        effects: { power: 0, oxygen: -20, shields: +10, food: 0 },
        outcomeText:
          'The pressure equalization prevents hull damage and shield rupture. But venting ' +
          'atmosphere means losing precious oxygen — the crew switches to emergency breathing ' +
          'masks until the recycler catches up.',
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
      'Bacteria have been found in the water recycling system! On the ISS, this actually ' +
      'happens — biofilms grow inside the pipes. If not treated, the crew\'s drinking water ' +
      'could become unsafe and the oxygen generator (which splits water) could malfunction.',
    scienceNote:
      'The ISS Water Recovery System recycles about 90% of all water — including sweat and ' +
      'urine! (Yes, really!) It uses filters, chemical treatment, and a catalytic reactor. ' +
      'Biofilm — slimy layers of bacteria — is a real problem. In 2019, NASA found bacteria ' +
      'on the ISS that had never been seen on Earth. Keeping water clean in space is one of ' +
      'the hardest engineering challenges for long missions.',
    choices: [
      {
        id: 'water_001_a',
        label: '🧪 Chemical Flush Protocol',
        description: 'Flush the system with silver-ion disinfectant — kills bacteria but wastes water.',
        effects: { power: -5, oxygen: -10, shields: 0, food: -10 },
        outcomeText:
          'The silver ions kill the biofilm — water is clean again! But the flushing process ' +
          'wastes water that the oxygen generator needed, and the chemical runoff contaminates ' +
          'some nutrient solution in the hydroponics bay.',
      },
      {
        id: 'water_001_b',
        label: '🔥 Thermal Sterilization',
        description: 'Heat the water system to 120°C to kill everything. Uses massive power.',
        effects: { power: -20, oxygen: +5, shields: -5, food: -5 },
        outcomeText:
          'Every last bacterium is destroyed! The clean water lets the oxygen generator run ' +
          'at peak efficiency. But the heating uses so much power that shield maintenance is ' +
          'deferred, and the heat damages some food packaging.',
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

