/**
 * Space-weather event catalogue for Outpost Sol-1.
 *
 * Structured to mirror NASA DONKI / Space Weather API event types.
 * Each event has:
 *   - id:          Unique string key
 *   - name:        Display name (kid-friendly)
 *   - description: Short flavour text
 *   - severity:    1–5 scale
 *   - effects:     Resource delta map applied when the event triggers
 *
 * @see https://api.nasa.gov (DONKI, EONET, Mars Weather)
 */

const SPACE_EVENTS = [
  {
    id: 'solar_flare',
    name: 'Solar Flare!',
    description: 'A burst of energy from the Sun is heading our way. Shields up!',
    severity: 3,
    effects: { shields: -25, power: -10 },
  },
  {
    id: 'cme',
    name: 'Coronal Mass Ejection',
    description: 'A massive cloud of charged particles is approaching. Protect the electronics!',
    severity: 4,
    effects: { shields: -35, power: -20, thermal: +10 },
  },
  {
    id: 'dust_storm',
    name: 'Martian Dust Storm',
    description: 'Red dust is blocking our solar panels. Power output dropping!',
    severity: 2,
    effects: { power: -30, thermal: -5 },
  },
  {
    id: 'meteor_shower',
    name: 'Meteor Shower',
    description: 'Small rocks are raining down! Reinforce the hull!',
    severity: 3,
    effects: { shields: -20 },
  },
  {
    id: 'ice_deposit',
    name: 'Ice Deposit Found!',
    description: 'Scanners detected subsurface ice! Water supply boosted!',
    severity: 1,
    effects: { water: +30 },
  },
  {
    id: 'geomagnetic_storm',
    name: 'Geomagnetic Storm',
    description: 'Earth's magnetic field is shaking. Communications disrupted!',
    severity: 4,
    effects: { shields: -15, power: -15 },
  },
  {
    id: 'solar_wind',
    name: 'High-Speed Solar Wind',
    description: 'Fast solar wind stream detected. Extra energy for our collectors!',
    severity: 1,
    effects: { power: +20, shields: -5 },
  },
  {
    id: 'radiation_belt',
    name: 'Radiation Belt Crossing',
    description: 'The outpost is passing through a radiation belt. Crew, take shelter!',
    severity: 5,
    effects: { shields: -40, thermal: +15 },
  },
]

export default SPACE_EVENTS

