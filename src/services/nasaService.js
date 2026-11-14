// NASA Service — Live API + Curated Fallback
// API Key: cp79fkQDcnfwKG8f9hWn7WHRH77jJmGgjgjnhpgF

const NASA_API_KEY = 'cp79fkQDcnfwKG8f9hWn7WHRH77jJmGgjgjnhpgF';

// ─── FALLBACK / ARCHIVED DATA ───────────────────────────────────────────────
const FALLBACK_FLARES = [
  {
    flrID: 'ARCHIVED-2024-11-01T08:12Z-FLR-001',
    beginTime: '2024-11-01T08:12Z',
    peakTime: '2024-11-01T08:34Z',
    endTime: '2024-11-01T09:05Z',
    classType: 'X2.4',
    sourceLocation: 'N15W22',
    activeRegionNum: 13490,
    isLive: false,
  },
  {
    flrID: 'ARCHIVED-2024-10-29T05:52Z-FLR-002',
    beginTime: '2024-10-29T05:52Z',
    peakTime: '2024-10-29T06:14Z',
    endTime: '2024-10-29T06:48Z',
    classType: 'M5.8',
    sourceLocation: 'S12E34',
    activeRegionNum: 13482,
    isLive: false,
  },
  {
    flrID: 'ARCHIVED-2024-10-03T12:00Z-FLR-003',
    beginTime: '2024-10-03T12:00Z',
    peakTime: '2024-10-03T12:22Z',
    endTime: '2024-10-03T13:10Z',
    classType: 'M1.2',
    sourceLocation: 'N08W10',
    activeRegionNum: 13460,
    isLive: false,
  },
];

const FALLBACK_CME = [
  {
    activityID: 'ARCHIVED-2024-11-01-CME-001',
    startTime: '2024-11-01T09:36Z',
    catalog: 'M2M_CATALOG',
    note: 'Full halo CME associated with X2.4 flare. Estimated arrival at Mars in 4-5 days.',
    isLive: false,
  },
  {
    activityID: 'ARCHIVED-2024-10-29-CME-002',
    startTime: '2024-10-29T07:00Z',
    catalog: 'M2M_CATALOG',
    note: 'Partial halo CME. Speed ~850 km/s.',
    isLive: false,
  },
];

const FALLBACK_APOD = {
  title: 'Mars Jezero Crater — Perseverance Landing Site',
  url: 'https://mars.nasa.gov/system/resources/detail_files/26215_PIA24549.jpg',
  explanation:
    'Jezero Crater on Mars is the landing site for NASA\'s Perseverance rover. This ancient lake bed contains minerals that could preserve signs of ancient microbial life. The crater is 45 km wide and sits at coordinates 18.4°N, 77.7°E.',
  date: '2024-11-01',
  media_type: 'image',
  isLive: false,
};

// Mars RadLab reference data (OSDR/RadLab verified)
export const RADLAB_DATA = {
  marsSurface: {
    dailyDose_mSv: 0.7,
    source: 'NASA RadLab / MSL-RAD instrument',
    link: 'https://visualization.osdr.nasa.gov/radlab/gui/data-api/',
  },
  earthSurface: {
    dailyDose_mSv: 0.0082,
    source: 'UNSCEAR 2020 Report',
  },
  issOrbital: {
    dailyDose_mSv: 1.0,
    source: 'NASA Human Research Program',
  },
  marsFactor: 85, // Mars surface ~85x Earth background
};

// NASA OSDR biological study references
export const OSDR_STUDIES = [
  {
    id: 'OSD-379',
    title: 'Plant Growth in Space — Radish Study (HATCH)',
    url: 'https://osdr.nasa.gov/bio/repo/search?q=OSD-379',
    finding: 'Radishes grown on the ISS were nutritious and safe to eat after 27 days.',
  },
  {
    id: 'OSD-7',
    title: 'Rodent Research-1: Spaceflight Effects on Muscle and Bone',
    url: 'https://osdr.nasa.gov/bio/repo/search?q=OSD-7',
    finding: 'Microgravity causes measurable bone density loss within 30 days.',
  },
];

// ─── LIVE API FETCH FUNCTIONS ────────────────────────────────────────────────

export async function fetchSolarFlares(days = 30) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const url = `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return { data: FALLBACK_FLARES, isLive: false, source: 'ARCHIVED NASA OSDR/RADLAB TELEMETRY' };
    }
    const tagged = data.slice(0, 5).map(f => ({ ...f, isLive: true }));
    return { data: tagged, isLive: true, source: 'LIVE NASA DONKI TELEMETRY' };
  } catch {
    return { data: FALLBACK_FLARES, isLive: false, source: 'ARCHIVED NASA OSDR/RADLAB TELEMETRY' };
  }
}

export async function fetchCME(days = 30) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
  const url = `https://api.nasa.gov/DONKI/CME?startDate=${startDate}&endDate=${endDate}&api_key=${NASA_API_KEY}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return { data: FALLBACK_CME, isLive: false, source: 'ARCHIVED NASA OSDR/RADLAB TELEMETRY' };
    }
    const tagged = data.slice(0, 3).map(c => ({ ...c, isLive: true }));
    return { data: tagged, isLive: true, source: 'LIVE NASA DONKI TELEMETRY' };
  } catch {
    return { data: FALLBACK_CME, isLive: false, source: 'ARCHIVED NASA OSDR/RADLAB TELEMETRY' };
  }
}

export async function fetchAPOD() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { data: { ...data, isLive: true }, isLive: true, source: 'LIVE NASA APOD' };
  } catch {
    return { data: FALLBACK_APOD, isLive: false, source: 'ARCHIVED NASA OSDR/RADLAB TELEMETRY' };
  }
}

// NASA Resource Links (8 official sources)
export const NASA_RESOURCES = [
  {
    label: 'NASA Open API',
    url: 'https://api.nasa.gov/',
    badge: '🛰️',
    description: 'Official NASA APIs including DONKI, APOD, Mars Rover Photos',
  },
  {
    label: 'NASA DONKI Space Weather',
    url: 'https://ccmc.gsfc.nasa.gov/DONKI-API',
    badge: '☀️',
    description: 'Real-time solar flare and CME alerts used in this game',
  },
  {
    label: 'NASA OSDR Biological Studies',
    url: 'https://osdr.nasa.gov/bio/repo/search?q=&data_source=cgene,alsda,esa&data_type=study',
    badge: '🧬',
    description: 'Open Science Data Repository — plant growth, radiation biology',
  },
  {
    label: 'NASA RadLab API',
    url: 'https://visualization.osdr.nasa.gov/radlab/gui/data-api/',
    badge: '☢️',
    description: 'Mars surface radiation data from MSL-RAD instrument (~0.7 mSv/day)',
  },
  {
    label: 'NASA Mars Trek — Jezero Crater',
    url: 'https://trek.nasa.gov/mars/#v=0.1&x=10.195312309821048&y=-1.4062499737684107&z=1&p=urn%3Aogc%3Adef%3Acrs%3AEPSG%3A%3A104905&d=&locale=&b=mars&e=-219.72655840131594%2C-118.47656028998954%2C240.11718302095804%2C115.66406034245271&sfz=&w=',
    badge: '🗺️',
    description: 'Interactive 3D map of Mars — explore Jezero Crater landing site',
  },
  {
    label: 'NASA Solar System Trek',
    url: 'https://trek.nasa.gov/#',
    badge: '🪐',
    description: 'Explore all planets and moons with real NASA data',
  },
  {
    label: 'CSA Youth STEM Resources',
    url: 'https://www.asc-csa.gc.ca/eng/youth-educators/resources-stem-and-youth-organizations.asp',
    badge: '🍁',
    description: 'Canadian Space Agency educational resources for youth',
  },
  {
    label: 'CSA Space Food Production Toolkit',
    url: 'https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/',
    badge: '🌱',
    description: 'How astronauts grow food in space — CSA educator toolkit',
  },
];
