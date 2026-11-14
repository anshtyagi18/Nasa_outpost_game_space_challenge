import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Radio, Zap, Shield, Leaf, Image as ImageIcon } from 'lucide-react';
import { fetchSolarFlares, fetchCME, fetchAPOD, RADLAB_DATA, NASA_RESOURCES, OSDR_STUDIES } from '../services/nasaService';

export default function ScienceModal({ isOpen, onClose }) {
  const [flares, setFlares] = useState(null);
  const [cme, setCme] = useState(null);
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Promise.all([fetchSolarFlares(30), fetchCME(30), fetchAPOD()]).then(([flareResult, cmeResult, apodResult]) => {
      setFlares(flareResult);
      setCme(cmeResult);
      setApod(apodResult);
      setDataSource(flareResult.isLive ? 'LIVE NASA DONKI TELEMETRY' : 'ARCHIVED NASA OSDR/RADLAB TELEMETRY');
      setLoading(false);
    });
  }, [isOpen]);

  const flareClassColor = (cls) => {
    if (!cls) return 'text-gray-400';
    if (cls.startsWith('X')) return 'text-red-400';
    if (cls.startsWith('M')) return 'text-orange-400';
    if (cls.startsWith('C')) return 'text-yellow-400';
    return 'text-blue-400';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 overflow-hidden rounded-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            <div className="h-full flex flex-col bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-cyan-500/20 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Radio className="text-cyan-400 w-6 h-6" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h2 className="text-cyan-300 font-orbitron font-bold text-sm md:text-base">
                      LIVE NASA TELEMETRY & MARS MAP
                    </h2>
                    <p className="text-cyan-500/70 text-xs">Space Apps Challenge — Science Verification</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Data Source Badge */}
                <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold font-orbitron ${
                  dataSource.includes('LIVE') 
                    ? 'bg-green-900/50 border border-green-500/40 text-green-300' 
                    : 'bg-amber-900/50 border border-amber-500/40 text-amber-300'
                }`}>
                  <div className="flex items-center gap-2">
                    <motion.div
                      className={`w-2 h-2 rounded-full ${dataSource.includes('LIVE') ? 'bg-green-400' : 'bg-amber-400'}`}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span>{loading ? 'CONNECTING TO NASA DONKI & APOD...' : (dataSource || 'LOADING...')}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 opacity-80">KEY: cp79...hpgF</span>
                </div>

                {/* NASA APOD / Mars Imagery */}
                {apod?.data && (
                  <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ImageIcon className="text-cyan-400 w-4 h-4" />
                      <h3 className="text-cyan-300 font-orbitron font-bold text-xs">NASA ASTRONOMY PICTURE & MARS IMAGERY</h3>
                      <span className={`text-[10px] ml-auto px-1.5 py-0.5 rounded font-bold ${
                        apod.isLive ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-300'
                      }`}>
                        {apod.isLive ? '🟢 LIVE APOD' : '📁 ARCHIVED JEZERO'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                      <div className="w-full sm:w-44 h-28 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-700">
                        <img
                          src={apod.data.url}
                          alt={apod.data.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://mars.nasa.gov/system/resources/detail_files/26215_PIA24549.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white font-orbitron truncate">{apod.data.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                          {apod.data.explanation}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">Date: {apod.data.date}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Two-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Solar Flare Feed */}
                  <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="text-yellow-400 w-4 h-4" />
                      <h3 className="text-yellow-300 font-orbitron font-bold text-xs">SOLAR FLARE EVENTS</h3>
                    </div>
                    {loading ? (
                      <div className="space-y-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="h-14 bg-slate-700/50 rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : flares?.data?.length > 0 ? (
                      <div className="space-y-2">
                        {flares.data.slice(0, 4).map((flare, i) => (
                          <div key={i} className="bg-slate-700/40 rounded-lg p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-orbitron font-bold text-sm ${flareClassColor(flare.classType)}`}>
                                {flare.classType || 'Unknown'}
                              </span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                flare.isLive ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-300'
                              }`}>
                                {flare.isLive ? '🟢 LIVE' : '📁 ARCHIVED'}
                              </span>
                            </div>
                            <p className="text-slate-400 text-xs">Peak: {flare.peakTime?.slice(0, 16) || 'N/A'}</p>
                            <p className="text-slate-500 text-xs">Region: AR{flare.activeRegionNum || 'N/A'} • {flare.sourceLocation || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs italic">No recent flare data available</p>
                    )}
                  </div>

                  {/* Radiation Data */}
                  <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="text-purple-400 w-4 h-4" />
                      <h3 className="text-purple-300 font-orbitron font-bold text-xs">RADLAB MARS RADIATION</h3>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Mars Surface', value: RADLAB_DATA.marsSurface.dailyDose_mSv, unit: 'mSv/day', color: 'bg-red-500', width: '85%', note: RADLAB_DATA.marsSurface.source },
                        { label: 'ISS Orbit', value: RADLAB_DATA.issOrbital.dailyDose_mSv, unit: 'mSv/day', color: 'bg-orange-500', width: '70%', note: RADLAB_DATA.issOrbital.source },
                        { label: 'Earth Surface', value: RADLAB_DATA.earthSurface.dailyDose_mSv, unit: 'mSv/day', color: 'bg-green-500', width: '5%', note: RADLAB_DATA.earthSurface.source },
                      ].map(item => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-300 font-bold">{item.label}</span>
                            <span className="text-slate-400">{item.value} {item.unit}</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                          </div>
                          <p className="text-slate-600 text-[10px] mt-0.5">{item.note}</p>
                        </div>
                      ))}
                      <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2 mt-2">
                        <p className="text-purple-300 text-xs font-bold">🛡️ Game Science</p>
                        <p className="text-purple-400/80 text-[11px]">Your Radiation Shield meter represents the habitat's shielding against this {RADLAB_DATA.marsFactor}× higher radiation environment!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CME Events */}
                {cme?.data?.length > 0 && (
                  <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Radio className="text-orange-400 w-4 h-4" />
                      <h3 className="text-orange-300 font-orbitron font-bold text-xs">CORONAL MASS EJECTIONS (CME)</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cme.data.slice(0, 2).map((event, i) => (
                        <div key={i} className="bg-slate-700/40 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              event.isLive ? 'bg-green-900/60 text-green-300' : 'bg-amber-900/60 text-amber-300'
                            }`}>
                              {event.isLive ? '🟢 LIVE' : '📁 ARCHIVED'}
                            </span>
                          </div>
                          <p className="text-slate-300 text-xs font-bold">{event.startTime?.slice(0, 16) || 'N/A'}</p>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-2">{event.note || 'CME event detected by DONKI'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mars Trek Interactive Map */}
                <div className="bg-slate-800/60 rounded-xl border border-cyan-500/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">🗺️</span>
                    <h3 className="text-cyan-300 font-orbitron font-bold text-xs">MARS TREK — JEZERO CRATER (10.195°N, -1.406°E)</h3>
                  </div>
                  <p className="text-slate-400 text-xs mb-3">
                    Your habitat in ARES KIDS is set at the real Perseverance landing site! Explore the actual terrain data from NASA.
                  </p>
                  <a
                    href="https://trek.nasa.gov/mars/#v=0.1&x=10.195312309821048&y=-1.4062499737684107&z=1&p=urn%3Aogc%3Adef%3Acrs%3AEPSG%3A%3A104905&d=&locale=&b=mars&e=-219.72655840131594%2C-118.47656028998954%2C240.11718302095804%2C115.66406034245271&sfz=&w="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
                  >
                    <span>🚀 Open NASA Mars Trek — Jezero Crater Coordinates (10.195, -1.406)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* NASA OSDR Studies */}
                <div className="bg-slate-800/60 rounded-xl border border-green-500/20 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="text-green-400 w-4 h-4" />
                    <h3 className="text-green-300 font-orbitron font-bold text-xs">NASA OSDR BIOLOGICAL STUDIES</h3>
                  </div>
                  <div className="space-y-2">
                    {OSDR_STUDIES.map(study => (
                      <div key={study.id} className="bg-green-900/20 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-green-400 font-bold text-xs font-orbitron">{study.id}</span>
                            <p className="text-slate-300 text-xs mt-0.5">{study.title}</p>
                            <p className="text-green-400/70 text-xs mt-1 italic">📋 {study.finding}</p>
                          </div>
                          <a href={study.url} target="_blank" rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 flex-shrink-0 mt-0.5">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* All 8 NASA Resources */}
                <div className="bg-slate-800/60 rounded-xl border border-slate-700/50 p-4">
                  <h3 className="text-slate-300 font-orbitron font-bold text-xs mb-3">📚 VERIFY THE SCIENCE — ALL 8 SOURCES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {NASA_RESOURCES.map(resource => (
                      <a
                        key={resource.label}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2.5 bg-slate-700/30 hover:bg-slate-700/60 rounded-lg p-2.5 transition-colors group border border-transparent hover:border-slate-600"
                      >
                        <span className="text-lg flex-shrink-0">{resource.badge}</span>
                        <div className="min-w-0">
                          <p className="text-slate-200 font-bold text-xs group-hover:text-cyan-300 transition-colors truncate">{resource.label}</p>
                          <p className="text-slate-500 text-[11px] line-clamp-2">{resource.description}</p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 flex-shrink-0 mt-0.5 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
