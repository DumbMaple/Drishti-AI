import { useState } from 'react';
import {
  ScanEye,
  ArrowRight,
  Box,
  Radio,
  Users,
  Stethoscope,
  ShieldAlert,
  MapPin,
  Activity,
  Layers,
  ChevronRight,
  Compass
} from 'lucide-react';
import { RAIPUR_CAMPUSES } from '../data/mockData';
import { RaipurCampusKey } from '../types';
import { ThreeCampusTwin } from './ThreeCampusTwin';

interface ShowcaseLandingProps {
  onEnterConsole: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  highlightedBuildingId?: string;
  onSelectBuilding?: (buildingId: string) => void;
  onOpenChatbot: () => void;
}

export function ShowcaseLanding({
  onEnterConsole,
  isDark,
  onToggleTheme,
  highlightedBuildingId,
  onSelectBuilding,
  onOpenChatbot,
}: ShowcaseLandingProps) {
  const [selectedCampus, setSelectedCampus] = useState<RaipurCampusKey>('ssipmt');
  const campus = RAIPUR_CAMPUSES[selectedCampus];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSimAlert = (type: 'crowd' | 'fall') => {
    alert(
      `[SIMULATION BROADCAST]: ${
        type === 'crowd' ? 'Crowd surge spike' : 'Human posture fall'
      } beacon triggered in ${campus.name} spatial model.`
    );
  };

  return (
    <div className="relative min-h-screen bg-cream-100 text-cream-dark dark:bg-darkbg-950 dark:text-slate-100 font-sans selection:bg-cream-accent selection:text-black overflow-x-hidden antialiased">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]"></div>

      {/* FRONT PAGE NAVBAR (Clean, without bulky theme text) */}
      <header className="relative z-40 px-6 sm:px-12 py-5 border-b-2 border-black/10 dark:border-white/10 bg-cream-50/95 dark:bg-darkbg-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cream-accent border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <ScanEye className="w-6 h-6 text-black stroke-[2.4]" />
            </div>
            <span className="font-mono text-2xl font-black tracking-wider text-black dark:text-white">
              DRISHTI<span className="text-amber-500 dark:text-cyan-400">.AI</span>
            </span>
          </div>

          {/* Links & Action Buttons */}
          <div className="flex items-center gap-4 sm:gap-7">
            <button
              onClick={() => scrollToSection('section-engines')}
              className="hidden lg:block text-xs font-mono font-black uppercase tracking-wider text-black dark:text-white hover:text-amber-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              SURVEILLANCE ENGINES
            </button>
            <button
              onClick={() => scrollToSection('section-map-2d')}
              className="hidden lg:block text-xs font-mono font-black uppercase tracking-wider text-black dark:text-white hover:text-amber-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              2D RAIPUR GRID
            </button>
            <button
              onClick={() => scrollToSection('section-twin-3d')}
              className="hidden lg:block text-xs font-mono font-black uppercase tracking-wider text-black dark:text-white hover:text-amber-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
            >
              3D CAMPUS TWIN
            </button>

            {/* Chatbot Pill */}
            <button
              onClick={onOpenChatbot}
              className="btn-brutal px-4 py-2 rounded-2xl border-2 border-black bg-cream-200 dark:bg-darkbg-800 text-black dark:text-white font-mono font-black text-xs flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              <span>🏛️ Campus Guide</span>
            </button>

            {/* Launch Console CTA */}
            <button
              onClick={onEnterConsole}
              className="btn-brutal px-5 py-2.5 rounded-2xl bg-black text-white dark:bg-cyan-400 dark:text-black font-mono font-black text-xs uppercase tracking-wide border-2 border-black cursor-pointer flex items-center gap-2"
            >
              <span>SECURITY CONSOLE</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH CONFINED FLOATING BADGES (Strictly inside the first half) */}
      <section className="relative pt-20 pb-16 px-6 z-20 text-center max-w-5xl mx-auto space-y-7 overflow-visible">
        {/* Floating Cartoon Stickers ONLY in the Hero Header First Half */}
        <div className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-10 overflow-visible">
          {/* Top Left: DRISHTI BOT 01 (Exactly as in screenshot) */}
          <div className="absolute top-4 left-0 sm:-left-8 animate-float-1 hidden md:block">
            <div className="relative bg-white dark:bg-darkbg-850 px-4 py-3 rounded-2xl shadow-xl border-2 border-black dark:border-white/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cream-accent border-2 border-black flex items-center justify-center text-xl shadow">
                🤖
              </div>
              <div className="text-left">
                <div className="text-xs font-mono font-black uppercase text-black dark:text-white tracking-wider">
                  DRISHTI BOT 01
                </div>
                <div className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Corridors Monitored
                </div>
              </div>
              {/* Speech Bubble Pointer */}
              <div className="absolute -bottom-2.5 left-6 w-4 h-4 bg-white dark:bg-darkbg-850 border-b-2 border-r-2 border-black dark:border-white/20 transform rotate-45"></div>
            </div>
          </div>

          {/* Top Right: Crowd Normal 42% (Exactly as in screenshot) */}
          <div className="absolute top-6 right-0 sm:-right-8 animate-float-2 hidden md:block">
            <div className="bg-cream-accent text-black font-mono font-black text-xs px-4 py-2.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000] flex items-center gap-2">
              <span className="text-base">👀</span>
              <span>Crowd Normal: 42%</span>
            </div>
          </div>
        </div>

        {/* Small Tag Pill */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cream-accent/40 dark:bg-amber-500/10 border-2 border-black text-black dark:text-cream-accent text-xs font-mono font-black shadow-[2px_2px_0px_#000]">
          <span className="w-2.5 h-2.5 rounded-full bg-cream-accent border border-black dark:border-none animate-pulse"></span>
          AI-VISION CAMPUS SURVEILLANCE
        </div>

        {/* Main Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-black dark:text-white leading-[1.15]">
            Drishti AI — Your guardian for
          </h1>
          <div className="inline-block max-w-full">
            <div className="bg-cream-accent px-4 sm:px-7 py-2 sm:py-2.5 rounded-2xl sm:rounded-3xl border-2 sm:border-[3px] border-black shadow-[4px_4px_0px_#000] sm:shadow-[6px_6px_0px_#000]">
              <span className="text-xl sm:text-4xl lg:text-6xl font-black text-black tracking-tight">
                Campus Safety & Surveillance
              </span>
            </div>
          </div>
        </div>

        <p className="text-slate-700 dark:text-slate-300 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg font-medium leading-relaxed px-2">
          Real-time edge neural inference for human fall detection, unauthorized perimeter access,
          and crowd surges across Raipur college campuses—fully visualised in an interactive 3D spatial twin.
        </p>

        {/* 4 BIG STAT CARDS (Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 max-w-4xl mx-auto pt-2 font-mono">
          <div className="bg-white dark:bg-darkbg-850 border-2 border-black rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[4px_4px_0px_#000] text-center space-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black dark:text-white tabular-nums">910+</div>
            <div className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider truncate">
              CONNECTED CAMS
            </div>
          </div>

          <div className="bg-white dark:bg-darkbg-850 border-2 border-black rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[4px_4px_0px_#000] text-center space-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-500 tabular-nums">&lt;15ms</div>
            <div className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider truncate">
              DETECTION SPEED
            </div>
          </div>

          <div className="bg-white dark:bg-darkbg-850 border-2 border-black rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[4px_4px_0px_#000] text-center space-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-500 tabular-nums">99.2%</div>
            <div className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider truncate">
              ACCURACY RATE
            </div>
          </div>

          <div className="bg-white dark:bg-darkbg-850 border-2 border-black rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-[4px_4px_0px_#000] text-center space-y-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-600 dark:text-cream-accent tabular-nums">
              6 Hubs
            </div>
            <div className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider truncate">
              RAIPUR COLLEGES
            </div>
          </div>
        </div>

        {/* BIG ATTRACTIVE "START YOUR JOURNEY" BUTTON */}
        <div className="pt-6 sm:pt-8 pb-3 px-2">
          <button
            onClick={onEnterConsole}
            className="btn-brutal animate-bobble w-full sm:w-auto inline-flex items-center justify-center gap-3 sm:gap-4 px-6 sm:px-10 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-cream-accent hover:bg-yellow-300 text-black font-black font-mono text-base sm:text-xl lg:text-2xl uppercase tracking-wider border-3 sm:border-4 border-black cursor-pointer shadow-[5px_5px_0px_#000]"
          >
            <span className="text-xl sm:text-3xl">🚀</span>
            <span>ENTER AI SECURITY CONSOLE</span>
            <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 stroke-[3]" />
          </button>
          <p className="text-[11px] sm:text-xs font-mono font-bold text-slate-500 mt-2.5">
            Click above to open the Live Security Operations Center, Camera Feeds, and Campus Zones.
          </p>
        </div>
      </section>

      {/* CAMPUS AI SAFETY MODULES */}
      <section id="section-engines" className="py-16 px-6 z-20 relative max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-black font-mono text-black dark:text-white uppercase tracking-tight">
            CAMPUS AI SAFETY MODULES
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Multi-camera real-time neural vision streams ready for deployment across Raipur
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Module 1: Crowd Surge */}
          <div className="bg-white dark:bg-darkbg-850 border-2 border-black rounded-3xl p-7 shadow-[6px_6px_0px_#000] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cream-accent border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000]">
              👥
            </div>
            <h3 className="text-xl font-black font-mono text-black dark:text-white">
              Crowd Surge & Density
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Detects bottleneck stampede risks, excessive gathering densities, and rapid directional
              movement in cafeterias, auditoriums, and plazas.
            </p>
            <div className="inline-block px-3 py-1 rounded-xl bg-cream-200 border-2 border-black font-mono text-xs font-black text-black">
              REAL-TIME HEATMAPS
            </div>
          </div>

          {/* Module 2: Fall Detection */}
          <div className="bg-white dark:bg-darkbg-850 border-2 border-black rounded-3xl p-7 shadow-[6px_6px_0px_#000] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-300 border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000]">
              🩺
            </div>
            <h3 className="text-xl font-black font-mono text-black dark:text-white">
              Human Fall & Medical Alert
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Identifies sudden posture collapse and sustained immobility across staircases,
              pathways, and sports grounds for immediate medical dispatch.
            </p>
            <div className="inline-block px-3 py-1 rounded-xl bg-emerald-100 border-2 border-black font-mono text-xs font-black text-emerald-800">
              &lt;1s DISPATCH NOTICE
            </div>
          </div>

          {/* Module 3: Perimeter Breach */}
          <div className="bg-white dark:bg-darkbg-850 border-2 border-black rounded-3xl p-7 shadow-[6px_6px_0px_#000] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-300 border-2 border-black flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000]">
              🚫
            </div>
            <h3 className="text-xl font-black font-mono text-black dark:text-white">
              Unauthorized Entry & Loitering
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Monitors campus boundary walls, hostel turnstiles, and restricted server labs after
              curfews with automated vehicle plate identification.
            </p>
            <div className="inline-block px-3 py-1 rounded-xl bg-red-100 border-2 border-black font-mono text-xs font-black text-red-800">
              VIRTUAL TRIPWIRES
            </div>
          </div>
        </div>
      </section>

      {/* 2D RAIPUR CAMPUSES GRID (Strictly Raipur Colleges) */}
      <section id="section-map-2d" className="py-16 px-6 z-20 relative max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs font-mono font-black uppercase text-amber-500 tracking-widest">
            INTERACTIVE GEOGRAPHIC NETWORK
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-mono text-black dark:text-white">
            2D RAIPUR CAMPUS GRID
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
            Monitored higher education & research institutions across Raipur and Atal Nagar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Vector SVG Map Container */}
          <div className="lg:col-span-7 bg-white dark:bg-darkbg-850 border-3 border-black dark:border-white/20 rounded-3xl p-8 sm:p-12 shadow-[8px_8px_0px_#000] relative overflow-hidden">
            <div className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>METRO DISTRICT: RAIPUR & ATAL NAGAR</span>
              <span className="text-emerald-500 font-black">● 6 HUBS MONITORED</span>
            </div>

            {/* Raipur Schematic Map */}
            <div className="relative w-full max-w-[500px] mx-auto aspect-[4/3] flex items-center justify-center">
              <svg viewBox="0 0 500 380" className="w-full h-full filter drop-shadow-md">
                {/* Raipur District Contour */}
                <path
                  d="M 60,60 L 220,30 L 380,45 L 460,140 L 440,280 L 320,350 L 160,340 L 50,240 Z"
                  className="fill-cream-200 stroke-black dark:fill-darkbg-700 dark:stroke-slate-500 transition-colors duration-300"
                  strokeWidth="3.5"
                  strokeDasharray="4 4"
                />

                {/* Main Arterial Roads (GE Road & Old Dhamtari Road) */}
                <line x1="60" y1="180" x2="380" y2="180" stroke="#888" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
                <line x1="220" y1="30" x2="220" y2="340" stroke="#888" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
                <line x1="220" y1="180" x2="420" y2="280" stroke="#888" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />

                <text x="75" y="170" className="text-[10px] font-mono font-bold fill-slate-400">GE Road</text>
                <text x="230" y="300" className="text-[10px] font-mono font-bold fill-slate-400">Old Dhamtari Rd</text>
                <text x="340" y="260" className="text-[10px] font-mono font-bold fill-slate-400">Atal Nagar Expy</text>
              </svg>

              {/* Pin 1: SSIPMT Raipur (Mujgahan - South Raipur) */}
              <div
                className={`absolute cursor-pointer group transition-transform ${
                  selectedCampus === 'ssipmt' ? 'scale-110 z-30' : ''
                }`}
                style={{ top: '68%', left: '44%' }}
                onClick={() => setSelectedCampus('ssipmt')}
              >
                <span className="sonar absolute -inset-4 rounded-full bg-cream-accent"></span>
                <div className="w-9 h-9 rounded-2xl bg-cream-accent border-2 border-black flex items-center justify-center text-sm font-black shadow-[2px_2px_0px_#000] group-hover:scale-125 transition-transform">
                  🏛️
                </div>
                <span className="absolute left-11 top-1/2 -translate-y-1/2 font-mono text-xs font-black text-black bg-cream-accent px-2.5 py-1 rounded-xl border-2 border-black shadow whitespace-nowrap">
                  ★ SSIPMT Mujgahan
                </span>
              </div>

              {/* Pin 2: NIT Raipur (GE Road - Central West) */}
              <div
                className={`absolute cursor-pointer group transition-transform ${
                  selectedCampus === 'nit' ? 'scale-110 z-20' : ''
                }`}
                style={{ top: '44%', left: '36%' }}
                onClick={() => setSelectedCampus('nit')}
              >
                <span className="sonar absolute -inset-3 rounded-full bg-emerald-400"></span>
                <div className="w-7 h-7 rounded-xl bg-emerald-400 border-2 border-black flex items-center justify-center text-xs shadow group-hover:scale-125 transition-transform">
                  🎓
                </div>
                <span className="absolute right-9 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black dark:text-white bg-white dark:bg-black px-2 py-0.5 rounded-lg border border-black shadow whitespace-nowrap">
                  NIT Raipur (GE Rd)
                </span>
              </div>

              {/* Pin 3: AIIMS Raipur (Tatibandh - West) */}
              <div
                className={`absolute cursor-pointer group transition-transform ${
                  selectedCampus === 'aiims' ? 'scale-110 z-20' : ''
                }`}
                style={{ top: '40%', left: '18%' }}
                onClick={() => setSelectedCampus('aiims')}
              >
                <span className="sonar absolute -inset-3 rounded-full bg-red-400"></span>
                <div className="w-7 h-7 rounded-xl bg-red-400 border-2 border-black flex items-center justify-center text-xs shadow group-hover:scale-125 transition-transform">
                  🩺
                </div>
                <span className="absolute left-9 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black dark:text-white bg-white dark:bg-black px-2 py-0.5 rounded-lg border border-black shadow whitespace-nowrap">
                  AIIMS Tatibandh
                </span>
              </div>

              {/* Pin 4: PRSU Raipur (Amanaka) */}
              <div
                className={`absolute cursor-pointer group transition-transform ${
                  selectedCampus === 'prsu' ? 'scale-110 z-20' : ''
                }`}
                style={{ top: '50%', left: '26%' }}
                onClick={() => setSelectedCampus('prsu')}
              >
                <span className="sonar absolute -inset-3 rounded-full bg-amber-400"></span>
                <div className="w-7 h-7 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center text-xs shadow group-hover:scale-125 transition-transform">
                  📚
                </div>
                <span className="absolute left-9 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black dark:text-white bg-white dark:bg-black px-2 py-0.5 rounded-lg border border-black shadow whitespace-nowrap">
                  PRSU Amanaka
                </span>
              </div>

              {/* Pin 5: IIIT Naya Raipur (Sector 24, Atal Nagar) */}
              <div
                className={`absolute cursor-pointer group transition-transform ${
                  selectedCampus === 'iiit' ? 'scale-110 z-20' : ''
                }`}
                style={{ top: '65%', left: '72%' }}
                onClick={() => setSelectedCampus('iiit')}
              >
                <span className="sonar absolute -inset-3 rounded-full bg-cyan-400"></span>
                <div className="w-7 h-7 rounded-xl bg-cyan-400 border-2 border-black flex items-center justify-center text-xs shadow group-hover:scale-125 transition-transform">
                  ⚡
                </div>
                <span className="absolute left-9 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black dark:text-white bg-white dark:bg-black px-2 py-0.5 rounded-lg border border-black shadow whitespace-nowrap">
                  IIIT Naya Raipur
                </span>
              </div>

              {/* Pin 6: HNLU Raipur (Uparwara) */}
              <div
                className={`absolute cursor-pointer group transition-transform ${
                  selectedCampus === 'hnlu' ? 'scale-110 z-20' : ''
                }`}
                style={{ top: '78%', left: '76%' }}
                onClick={() => setSelectedCampus('hnlu')}
              >
                <span className="sonar absolute -inset-3 rounded-full bg-indigo-400"></span>
                <div className="w-7 h-7 rounded-xl bg-indigo-400 border-2 border-black flex items-center justify-center text-xs shadow group-hover:scale-125 transition-transform">
                  ⚖️
                </div>
                <span className="absolute right-9 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-black dark:text-white bg-white dark:bg-black px-2 py-0.5 rounded-lg border border-black shadow whitespace-nowrap">
                  HNLU Raipur
                </span>
              </div>
            </div>
          </div>

          {/* Campus Telemetry Detail Card */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            <div className="bg-white dark:bg-darkbg-850 border-2 sm:border-3 border-black dark:border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-[6px_6px_0px_#000] space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b-2 border-black/10 dark:border-white/10">
                <div className="min-w-0">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 uppercase block truncate">
                    {campus.id} • {campus.location}
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-black dark:text-white leading-tight mt-0.5">
                    {campus.shortName}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-cream-accent block mt-0.5">
                    {campus.name.includes('(') ? campus.name.slice(campus.name.indexOf('(') + 1, -1) : campus.name}
                  </span>
                </div>
                <span
                  className={`self-start px-3 py-1 rounded-full border-2 font-mono text-[11px] font-black shrink-0 ${
                    campus.status === 'SECURE'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-500'
                      : campus.status === 'OPTIMAL'
                      ? 'bg-blue-100 text-blue-800 border-blue-500'
                      : 'bg-amber-100 text-amber-800 border-amber-500'
                  }`}
                >
                  {campus.status}
                </span>
              </div>

              {/* Responsive 4 Telemetry Stat Boxes (Never overflows on mobile) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 font-mono">
                {/* 1. CCTV Streams */}
                <div className="p-3 sm:p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/15 flex flex-col justify-between min-w-0 shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
                    CCTV Streams
                  </span>
                  <div className="mt-1.5">
                    <div className="text-lg sm:text-2xl font-black text-black dark:text-white tabular-nums leading-tight">
                      {campus.cams}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-slate-500 truncate">
                      Connected CCTVs
                    </div>
                  </div>
                </div>

                {/* 2. Crowd Saturation */}
                <div className="p-3 sm:p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/15 flex flex-col justify-between min-w-0 shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
                    Crowd Density
                  </span>
                  <div className="mt-1.5">
                    <div className="text-lg sm:text-2xl font-black text-amber-500 tabular-nums leading-tight">
                      {campus.crowdPct}%
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 truncate">
                      {campus.crowdSaturation.split(' ')[0]} Load
                    </div>
                  </div>
                </div>

                {/* 3. Fence Breaches */}
                <div className="p-3 sm:p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/15 flex flex-col justify-between min-w-0 shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
                    Fence Breaches
                  </span>
                  <div className="mt-1.5">
                    <div className={`text-lg sm:text-2xl font-black tabular-nums leading-tight ${campus.breaches > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {campus.breaches}
                    </div>
                    <div className={`text-[10px] sm:text-xs font-bold truncate ${campus.breaches > 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {campus.breaches === 0 ? '0 Detected' : 'Breach Alert'}
                    </div>
                  </div>
                </div>

                {/* 4. Fall Distress */}
                <div className="p-3 sm:p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/15 flex flex-col justify-between min-w-0 shadow-sm">
                  <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">
                    Fall Distress
                  </span>
                  <div className="mt-1.5">
                    <div className={`text-lg sm:text-2xl font-black tabular-nums leading-tight ${campus.falls > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {campus.falls}
                    </div>
                    <div className={`text-[10px] sm:text-xs font-bold truncate ${campus.falls > 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {campus.falls === 0 ? '0 Incidents' : 'Fall Alert'}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {campus.desc}
              </p>

              <div className="space-y-3 pt-1">
                <button
                  onClick={() => scrollToSection('section-twin-3d')}
                  className="btn-brutal w-full py-3.5 sm:py-4 rounded-2xl bg-cream-accent hover:bg-yellow-300 text-black font-black font-mono text-sm sm:text-base uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2.5 cursor-pointer shadow-[3px_3px_0px_#000]"
                >
                  <Box className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>VIEW 3D DIGITAL TWIN BELOW</span>
                </button>

                <button
                  onClick={onEnterConsole}
                  className="btn-brutal w-full py-3 sm:py-3.5 rounded-2xl bg-black hover:bg-slate-900 text-white font-black font-mono text-xs sm:text-sm uppercase tracking-wider border-2 border-black flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
                >
                  <span>LAUNCH OPERATIONS CENTER FOR THIS HUB</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D ISOMETRIC DIGITAL TWIN OF SSIPMT RAIPUR (Google Earth Spatial Layout) */}
      <section id="section-twin-3d" className="py-16 px-6 z-20 relative max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-mono font-black uppercase text-amber-500 tracking-widest">
              SPATIAL 3D TELEMETRY • GOOGLE EARTH ACCURATE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-mono text-black dark:text-white flex items-center gap-3 mt-1">
              <span>3D DIGITAL CAMPUS TWIN</span>
              <span className="text-xs px-3 py-1 rounded-xl bg-cream-accent border-2 border-black font-black text-black">
                SSIPMT RAIPUR (MUJGAHAN)
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSimAlert('crowd')}
              className="btn-brutal px-4 py-2 bg-cream-accent text-black font-mono font-black text-xs border-2 border-black rounded-xl cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              + Sim Crowd Spike
            </button>
            <button
              onClick={() => handleSimAlert('fall')}
              className="btn-brutal px-4 py-2 bg-red-400 text-black font-mono font-black text-xs border-2 border-black rounded-xl cursor-pointer shadow-[2px_2px_0px_#000]"
            >
              + Sim Fall Alert
            </button>
          </div>
        </div>

        <div className="relative w-full h-[660px] rounded-3xl overflow-hidden border-3 border-black dark:border-white/20 shadow-[8px_8px_0px_#000] bg-cream-50 dark:bg-darkbg-950">
          <div className="absolute top-5 left-5 z-20 pointer-events-none space-y-2 font-mono text-xs font-bold">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/95 dark:bg-black/90 border-2 border-black text-black dark:text-white shadow">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              SSIPMT MUJGAHAN DIGITAL TWIN • DRAG TO ROTATE & CLICK TO INSPECT
            </div>
          </div>
          <ThreeCampusTwin
            campusKey={selectedCampus}
            isDark={isDark}
            highlightedBuildingId={highlightedBuildingId}
            onSelectBuilding={onSelectBuilding}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t-2 border-black/10 dark:border-white/10 text-center font-mono text-xs text-slate-500 z-20 relative bg-cream-50 dark:bg-darkbg-900">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cream-accent border border-black"></span>
            <span className="font-black text-black dark:text-white">DrishtiAI</span> • Intelligent
            Campus Safety & Spatial Twin for Raipur
          </div>
          <p>© 2026 DrishtiAI. Built for smart higher-education campuses across Raipur, Chhattisgarh.</p>
        </div>
      </footer>
    </div>
  );
}
