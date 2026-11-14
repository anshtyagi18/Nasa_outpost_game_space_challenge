// ARES KIDS: Survival on Sol-7 — Mission Scenarios
// 10 scenarios for replayability (7 selected per playthrough)
// Each scenario has 2 choices with real NASA-backed trade-offs

export const ALL_SCENARIOS = [
  {
    id: 'dust-blanket',
    sol: null, // assigned dynamically
    title: 'The Great Dust Blanket',
    emoji: '🌪️',
    description: 'A massive Martian dust storm has coated your solar panels! Power is dropping fast. SPARK-E is scanning options...',
    scienceContext: 'Mars Trek — Jezero Site',
    scienceLink: 'https://trek.nasa.gov/mars/#v=0.1&x=10.195312309821048&y=-1.4062499737684107&z=1&p=urn%3Aogc%3Adef%3Acrs%3AEPSG%3A%3A104905',
    kidFact: 'A Sol is one Martian day — it\'s 24 hours and 37 minutes long! Mars has giant dust storms that can last for MONTHS and cover the whole planet!',
    choices: [
      {
        id: 'spacewalk',
        emoji: '🧤',
        title: 'EVA Spacewalk',
        description: 'Commander Maya suits up and brushes the panels clean!',
        subtext: 'Dangerous, but restores power now.',
        effects: { power: +25, food: -10, shield: -15 },
        choiceStory: 'Maya carefully floats outside in her spacesuit. The red dust swirls around her visor as she scrubs each panel. The power gauge climbs back up — but the extra radiation exposure was rough!',
      },
      {
        id: 'greenhouse-off',
        emoji: '💡',
        title: 'Dim the Greenhouse',
        description: 'Turn off the grow lamps to save power!',
        subtext: 'Plants will suffer, but crew stays safe.',
        effects: { power: +10, food: -25, shield: 0 },
        choiceStory: 'The greenhouse goes dark. Sprout the radish droops sadly. Without UV light, the plants stop growing. You saved power, but food supplies are getting tight...',
      },
    ],
  },
  {
    id: 'solar-flare',
    sol: null,
    title: 'DONKI Solar Flare Alert! ☀️',
    emoji: '🔥',
    description: 'NASA DONKI just sent an X-class solar flare warning! Supercharged particles are racing toward Mars. You have 8 minutes!',
    scienceContext: 'NASA DONKI Space Weather Database',
    scienceLink: 'https://ccmc.gsfc.nasa.gov/DONKI-API',
    kidFact: 'CME stands for Coronal Mass Ejection — it\'s like the Sun sneezing a giant blob of hot plasma into space at 1,000 km per second! On Mars, there\'s no magnetic field to protect you!',
    isStormEvent: true,
    choices: [
      {
        id: 'battery-shield',
        emoji: '🔋',
        title: 'Magnetic Shield Boost',
        description: 'Divert ALL battery power to the magnetic deflectors!',
        subtext: 'Maximum protection, but heavy power drain.',
        effects: { power: -30, food: 0, shield: +20 },
        choiceStory: 'SPARK-E reroutes every amp of power to the shield generators. Blue plasma rings hum around the habitat. The solar particles deflect away — the crew is safe! But the batteries are almost drained...',
      },
      {
        id: 'water-walls',
        emoji: '💧',
        title: 'Water Wall Shielding',
        description: 'Pump drinking water into the habitat walls — water blocks radiation!',
        subtext: 'Clever science hack, but uses precious water.',
        effects: { power: 0, food: -25, shield: +15 },
        choiceStory: 'Maya remembers that water is a great radiation shield! Pumps hum as water fills the wall cavities. The crew huddles inside as particles rain down outside. You\'re protected — but now you\'re thirsty!',
      },
    ],
  },
  {
    id: 'wilting-salad',
    sol: null,
    title: 'Wilting Space Salad!',
    emoji: '🥗',
    description: 'Sprout the radish is turning yellow! The hydroponics bay CO₂ levels are spiking. Without plants, oxygen drops dangerously low.',
    scienceContext: 'NASA OSDR Study OSD-379 / CSA Food Toolkit',
    scienceLink: 'https://osdr.nasa.gov/bio/repo/search?q=OSD-379',
    kidFact: 'Hydroponics means growing plants WITHOUT soil — just water and nutrients! Astronaut Anne McClain grew radishes on the ISS in 2019 (Study OSD-379). They were delicious AND healthy!',
    choices: [
      {
        id: 'uv-boost',
        emoji: '☀️',
        title: 'UV Lamp & Oxygen Boost',
        description: 'Blast the plants with grow lights and pump in CO₂!',
        subtext: 'Plants bounce back but drains power fast.',
        effects: { power: -25, food: +30, shield: 0 },
        choiceStory: 'The grow lamps blaze at full intensity. Sprout perks right up, leaves turning deep green! Within hours the oxygen readings improve. Plants really are the best life support system!',
      },
      {
        id: 'backup-rations',
        emoji: '🥫',
        title: 'Crack Open Backup Rations',
        description: 'Open the emergency freeze-dried food packs!',
        subtext: 'Crew gets fed but plants keep struggling.',
        effects: { power: +10, food: -20, shield: 0 },
        choiceStory: 'The freeze-dried meal packets aren\'t as good as fresh radish, but they\'ll do! The plants are still struggling though. You used your emergency reserves... hope nothing else goes wrong!',
      },
    ],
  },
  {
    id: 'comm-delay',
    sol: null,
    title: 'The 20-Minute Earth Delay',
    emoji: '📡',
    description: 'CRITICAL ALERT: Oxygen scrubber is leaking! Earth is 20 light-minutes away — waiting for instructions means 40 minutes of oxygen loss!',
    scienceContext: 'Deep Space Communications Science',
    scienceLink: 'https://api.nasa.gov/',
    kidFact: 'Radio signals travel at the speed of light — but Mars is so far away that a message takes up to 24 minutes to arrive! Astronauts on Mars must solve emergencies THEMSELVES without asking Earth for help.',
    choices: [
      {
        id: 'wait-nasa',
        emoji: '📻',
        title: 'Wait for NASA Instructions',
        description: 'Send the fault data to Earth and wait for expert advice.',
        subtext: 'Safe choice, but oxygen keeps leaking for 40 minutes...',
        effects: { power: 0, food: -25, shield: 0 },
        choiceStory: 'You beam the data to Earth and wait. 40 agonizing minutes pass. The oxygen readings drop. Finally, mission control responds with detailed repair steps. The fix works — but you\'re running low on O₂!',
      },
      {
        id: 'ai-reboot',
        emoji: '🤖',
        title: 'SPARK-E AI Emergency Reboot',
        description: 'Let SPARK-E diagnose and patch the scrubber now!',
        subtext: 'Uses a lot of processing power but fixes it fast.',
        effects: { power: -30, food: +10, shield: 0 },
        choiceStory: 'SPARK-E runs thousands of diagnostic simulations in seconds! It identifies a cracked seal and talks Maya through the repair. The scrubber is fixed in 12 minutes! Future astronauts will need to trust their AI partners!',
      },
    ],
  },
  {
    id: 'cosmic-ray-spike',
    sol: null,
    title: 'RadLab Cosmic Ray Spike!',
    emoji: '⚡',
    description: 'NASA RadLab sensors detect a galactic cosmic ray burst — 3× normal dose hitting the habitat! Shield integrity at 42%.',
    scienceContext: 'NASA RadLab Dosimetry Data',
    scienceLink: 'https://visualization.osdr.nasa.gov/radlab/gui/data-api/',
    kidFact: 'A millisievert (mSv) is how we measure radiation. Mars surface gets ~0.7 mSv per day — that\'s 85× more than Earth! Galactic Cosmic Rays come from EXPLODING STARS outside our solar system!',
    choices: [
      {
        id: 'meteor-mining',
        emoji: '☄️',
        title: 'Rover Meteorite Battery Mining',
        description: 'Send SPARK-E to mine a nearby meteorite for rare metals to boost power!',
        subtext: 'Big power gain but SPARK-E gets exposed to radiation.',
        effects: { power: +30, food: 0, shield: -25 },
        choiceStory: 'SPARK-E trundles out into the cosmic ray storm. Its Geiger counter clicks frantically as it drills into a nickel-iron meteorite. It returns with enough metal for 3 battery cells — but took a heavy radiation hit!',
      },
      {
        id: 'blast-door',
        emoji: '🚪',
        title: 'Full Blast-Door Lockdown',
        description: 'Seal all external hatches and reinforce the radiation wall.',
        subtext: 'Maximum protection but costs power to run the seals.',
        effects: { power: -20, food: 0, shield: +20 },
        choiceStory: 'Heavy blast doors slam shut across the habitat. The crew retreats to the most shielded inner room. Radiation readings drop to safe levels. Maya reads the RadLab data to the crew while they wait for the spike to pass.',
      },
    ],
  },
  {
    id: 'perchlorate-leak',
    sol: null,
    title: 'Perchlorate Soil Leak!',
    emoji: '⚗️',
    description: 'Mars soil contains perchlorate — a toxic chemical! It\'s leaching into the greenhouse water supply. Sprout and the crew are at risk!',
    scienceContext: 'Mars Soil Science / Phoenix Lander Data',
    scienceLink: 'https://trek.nasa.gov/mars/#v=0.1&x=10.195312309821048&y=-1.4062499737684107',
    kidFact: 'Perchlorate is a naturally occurring chemical in Mars soil discovered by the Phoenix lander in 2008. It\'s toxic to humans but some bacteria on Earth actually EAT it for energy! Terraforming Mars will require dealing with this.',
    choices: [
      {
        id: 'flush-filters',
        emoji: '🚿',
        title: 'Flush Water Filters',
        description: 'Run all water through emergency filters to remove perchlorate.',
        subtext: 'Cleans the water but uses up reserves — plants get less water.',
        effects: { power: 0, food: -25, shield: +15 },
        choiceStory: 'The water filtration system runs at triple speed. Perchlorate levels drop to safe limits! Sprout gets clean water again — but you used a lot of the water supply. The crew is carefully rationing every drop.',
      },
      {
        id: 'bake-soil',
        emoji: '🔥',
        title: 'Bake the Soil',
        description: 'Heat the contaminated soil to 500°C to destroy the perchlorate!',
        subtext: 'Actually deactivates the chemical but uses massive power.',
        effects: { power: -30, food: +20, shield: 0 },
        choiceStory: 'Heating coils in the greenhouse floor glow red-hot! The perchlorate breaks down into harmless salts. It takes 6 hours and drains the power reserves, but the greenhouse soil is now safe for Sprout to grow in!',
      },
    ],
  },
  {
    id: 'supply-drop',
    sol: 7,
    title: 'Sol-7 Supply Drop Landing!',
    emoji: '🚀',
    description: 'FINAL SOL! An uncrewed supply rocket is approaching Mars — but a dust storm is reducing visibility to near zero. How do you guide it in?',
    scienceContext: 'Mars EDL — Entry, Descent & Landing',
    scienceLink: 'https://trek.nasa.gov/mars/#',
    kidFact: 'EDL stands for Entry, Descent and Landing — the "7 Minutes of Terror" when spacecraft slow from 20,000 km/h to a gentle landing using heat shields, parachutes, and rockets!',
    isFinalSol: true,
    choices: [
      {
        id: 'power-beacon',
        emoji: '📡',
        title: 'Full-Power Landing Beacon',
        description: 'Blast the radio beacon at maximum power to guide the ship in precisely!',
        subtext: 'Very precise landing but drains remaining power.',
        effects: { power: -25, food: +20, shield: 0 },
        choiceStory: 'The beacon transmits at full power through the dust storm. The supply rocket homes in perfectly, landing just 50 meters from the habitat! Fresh food, medical supplies, and new battery cells! Mission success!',
      },
      {
        id: 'manual-visual',
        emoji: '👁️',
        title: 'Manual Visual Guidance',
        description: 'Maya climbs to the roof and uses signal flares to guide the ship down!',
        subtext: 'Saves power but Maya is exposed to the dust storm.',
        effects: { power: +10, food: 0, shield: -20 },
        choiceStory: 'Maya climbs to the habitat roof in her dusty spacesuit, waving emergency flares. The supply ship wobbles through the storm but touches down safely — 200 meters away. You\'ll need to walk to get the supplies, but you made it!',
      },
    ],
  },
  {
    id: 'habitat-breach',
    sol: null,
    title: 'Micrometeorite Habitat Breach!',
    emoji: '💥',
    description: 'CRACK! A tiny rock the size of a marble just punched through the habitat wall! Air is hissing out. You have 15 minutes before pressure drops critically!',
    scienceContext: 'NASA Space Environment Hazards',
    scienceLink: 'https://api.nasa.gov/',
    kidFact: 'Space is full of tiny rocks called micrometeoroids traveling up to 70 km/s — 200× faster than a bullet! Space stations have special Whipple shields — multiple thin layers that cause small rocks to vaporize before hitting the main wall.',
    choices: [
      {
        id: 'emergency-patch',
        emoji: '🔧',
        title: 'Emergency Repair Patch',
        description: 'Maya applies a self-sealing patch kit to the breach!',
        subtext: 'Fast fix but uses life support power tools.',
        effects: { power: -20, food: 0, shield: +15 },
        choiceStory: 'Maya grabs the patch kit and scrambles to the breach. She slaps on the self-sealing compound — it bubbles and hardens in seconds! The hissing stops. The habitat is sealed. SPARK-E gives a robot thumbs-up!',
      },
      {
        id: 'inflate-barrier',
        emoji: '🫧',
        title: 'Emergency Inflatable Barrier',
        description: 'Deploy an inflatable pressure barrier around the breach area.',
        subtext: 'Slower but more robust, uses food-grade CO₂.',
        effects: { power: 0, food: -15, shield: +20 },
        choiceStory: 'The inflatable barrier deploys with a whoosh of CO₂, creating a mini-room around the breach. It\'s slower, but the double seal is incredibly strong. Radiation protection improves too — the barrier adds an extra layer!',
      },
    ],
  },
  {
    id: 'water-ice',
    sol: null,
    title: 'Subsurface Ice Discovery!',
    emoji: '🧊',
    description: 'SPARK-E\'s ground radar pinged a water ice deposit just 2 meters underground! This could solve your water shortage, but drilling will cost resources.',
    scienceContext: 'MOLA Mars Orbital Laser Altimeter Data',
    scienceLink: 'https://trek.nasa.gov/mars/#',
    kidFact: 'Mars has HUGE amounts of frozen water ice hidden underground and at its poles! If you melted all of Mars\'s polar ice, it would cover the entire planet in a 35-meter deep ocean! Future colonists will use this ice for water, oxygen, and rocket fuel.',
    choices: [
      {
        id: 'drill-ice',
        emoji: '⛏️',
        title: 'Drill for Ice!',
        description: 'Deploy SPARK-E with the thermal drill to extract water ice!',
        subtext: 'Big water/food boost but uses power and takes time.',
        effects: { power: -20, food: +25, shield: 0 },
        choiceStory: 'The thermal drill whirs to life! 90 minutes later, SPARK-E radios back — it hit a vein of pure water ice! The ice is carefully melted and purified. Sprout gets a full watering. Everyone gets extra rations tonight!',
      },
      {
        id: 'save-power',
        emoji: '🔋',
        title: 'Mark It and Save Power',
        description: 'Log the ice location for later and conserve resources.',
        subtext: 'Responsible choice — save energy for more urgent needs.',
        effects: { power: +15, food: 0, shield: 0 },
        choiceStory: 'Maya marks the ice deposit coordinates in SPARK-E\'s memory. Smart thinking — drilling now would drain too much power. The ice will be there when you need it most. SPARK-E uploads the data to NASA for future missions too!',
      },
    ],
  },
  {
    id: 'sandstorm-warning',
    sol: null,
    title: 'Global Dust Storm Warning!',
    emoji: '🌫️',
    description: 'Mars weather satellites warn of a GLOBAL dust storm forming — it could last 3 months and block 99% of sunlight. You have 2 hours to prepare!',
    scienceContext: 'Mars Climate Orbiter Data',
    scienceLink: 'https://trek.nasa.gov/mars/#',
    kidFact: 'The 2018 Mars global dust storm was so massive it was visible from Earth through a telescope! It cut off sunlight to NASA\'s Opportunity rover, which ultimately didn\'t survive. Dust storms are the biggest threat to solar-powered Mars missions!',
    choices: [
      {
        id: 'solar-storage',
        emoji: '⚡',
        title: 'Emergency Power Storage',
        description: 'Run the solar panels at 200% to charge every battery before the storm hits!',
        subtext: 'Builds a power reserve but overloads the panels.',
        effects: { power: +25, food: -10, shield: -10 },
        choiceStory: 'The solar panels whirr at maximum load! SPARK-E monitors the temperature carefully to prevent overheating. By the time the first dust reaches the habitat, the batteries are at 95% charge. Good thinking, commander!',
      },
      {
        id: 'food-stockpile',
        emoji: '🌱',
        title: 'Harvest Everything Now',
        description: 'Pick all edible plants immediately before they die in the darkness!',
        subtext: 'Maximum food stores but no more growing until storm passes.',
        effects: { power: 0, food: +20, shield: +10 },
        choiceStory: 'The whole crew pitches in for an emergency harvest! Sprout gives his last radishes nobly. The greenhouse is stripped clean, but the food stores are packed. The crew settles in to wait out the storm, playing cards by flashlight.',
      },
    ],
  },
];

// Select 7 scenarios for a playthrough (always include the Sol-7 final, pick 6 from the rest)
export function selectScenarios() {
  const finalSol = ALL_SCENARIOS.find(s => s.isFinalSol);
  const pool = ALL_SCENARIOS.filter(s => !s.isFinalSol);
  
  // Shuffle pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 6);
  
  // Add final sol at end
  selected.push(finalSol);
  
  // Assign sol numbers
  return selected.map((scenario, index) => ({
    ...scenario,
    sol: index + 1,
  }));
}

// Sci-fi kid-friendly planet choice labels
export const BASE_TYPES = {
  mars: {
    id: 'mars',
    name: 'Mars — Jezero Crater Base',
    emoji: '🔴',
    subtitle: 'Follow Perseverance Rover\'s footsteps!',
    description: 'Set up humanity\'s first Mars outpost at the ancient Jezero lake crater.',
    color: 'from-red-900 to-orange-900',
    accent: '#ef4444',
    trekLink: 'https://trek.nasa.gov/mars/#v=0.1&x=10.195312309821048&y=-1.4062499737684107',
  },
  moon: {
    id: 'moon',
    name: 'Moon — Artemis Base Camp',
    emoji: '🌙',
    subtitle: 'Return to the Moon with Artemis!',
    description: 'Build the Artemis lunar base near the Moon\'s south pole water ice deposits.',
    color: 'from-slate-800 to-zinc-900',
    accent: '#94a3b8',
    trekLink: 'https://trek.nasa.gov/#',
  },
};
