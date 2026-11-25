import { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Radio,
  RefreshCw,
  FileDown,
  Video,
  AlertCircle,
  Users,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Maximize2,
  Camera,
  Check,
  AlertTriangle,
  Cpu,
  Database,
  Wifi,
  X,
  MessageSquare
} from 'lucide-react';
import {
  RaipurCampusKey,
  ConsoleTab,
  CameraFeed,
  Incident,
  ZoneRisk
} from '../types';
import {
  RAIPUR_CAMPUSES,
  INITIAL_CAMERAS,
  INITIAL_INCIDENTS,
  INITIAL_ZONES
} from '../data/mockData';
import { CameraStreamCanvas } from './CameraStreamCanvas';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { RiskAnalyticsCharts } from './dashboard/RiskAnalyticsCharts';
import { SchematicCampusMap } from './dashboard/SchematicCampusMap';
import { soundManager } from '../utils/audioAlert';

interface DashboardViewProps {
  onReturnToLanding: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenChatbot: () => void;
}

export function DashboardView({
  onReturnToLanding,
  isDark,
  onToggleTheme,
  onOpenChatbot,
}: DashboardViewProps) {
  const [currentTab, setCurrentTab] = useState<ConsoleTab>('dashboard');
  const [selectedCampus, setSelectedCampus] = useState<RaipurCampusKey>('ssipmt');
  const [cameras, setCameras] = useState<CameraFeed[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [zones, setZones] = useState<ZoneRisk[]>(INITIAL_ZONES);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIncidentFilter, setActiveIncidentFilter] = useState<'all' | 'Critical' | 'Moderate' | 'Low'>('all');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // HUD Toggles
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [isNightVision, setIsNightVision] = useState(false);
  const [selectedCameraForModal, setSelectedCameraForModal] = useState<CameraFeed | null>(null);

  // Simulated Alert Toast (from Video at 00:22)
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<{
    title: string;
    location: string;
    camera: string;
    confidence: number;
    severity: string;
  }>({
    title: 'Abnormal Activity Detected',
    location: 'Parking Area',
    camera: 'CAM-003 - IR',
    confidence: 95.8,
    severity: 'MODERATE',
  });

  const campus = RAIPUR_CAMPUSES[selectedCampus];

  const triggerSimulatedAlert = () => {
    soundManager.playSecurityAlert();
    setToastData({
      title: 'Abnormal Activity Detected',
      location: 'Parking Area',
      camera: 'CAM-003 - IR',
      confidence: 95.8,
      severity: 'MODERATE',
    });
    setShowToast(true);
  };

  const handleAcknowledgeToast = () => {
    soundManager.playAcknowledgePing();
    setShowToast(false);
  };

  const handleAcknowledgeIncident = (id: string) => {
    soundManager.playAcknowledgePing();
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: 'Acknowledged' } : inc))
    );
  };

  const handleRefresh = () => {
    soundManager.playAcknowledgePing();
    setCameras((prev) =>
      prev.map((c) => ({
        ...c,
        peopleCount: Math.max(1, c.peopleCount + (Math.random() > 0.5 ? 1 : -1)),
      }))
    );
  };

  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      const matchSearch =
        cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchZone = selectedZoneFilter === 'all' || cam.zone === selectedZoneFilter;
      return matchSearch && matchZone;
    });
  }, [cameras, searchQuery, selectedZoneFilter]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSeverity = activeIncidentFilter === 'all' || inc.severity === activeIncidentFilter;
      const matchSearch =
        inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.cameraName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.eventType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSeverity && matchSearch;
    });
  }, [incidents, activeIncidentFilter, searchQuery]);

  const pendingIncidentsCount = incidents.filter((i) => i.status === 'Pending').length;

  return (
    <div className="flex min-h-screen bg-cream-100 text-cream-dark dark:bg-darkbg-950 dark:text-slate-100 font-sans selection:bg-cream-accent selection:text-black antialiased">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block sticky top-0 h-screen shrink-0">
        <DashboardSidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReturnToLanding={onReturnToLanding}
          pendingIncidentsCount={pendingIncidentsCount}
          onOpenChatbot={onOpenChatbot}
        />
      </div>

      {/* MOBILE / TABLET SLIDE-OVER DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />
          {/* Drawer Content */}
          <div className="relative z-50 h-full w-72 max-w-[85vw] shadow-2xl">
            <DashboardSidebar
              currentTab={currentTab}
              onTabChange={(tab) => {
                setCurrentTab(tab);
                setMobileSidebarOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReturnToLanding={onReturnToLanding}
              pendingIncidentsCount={pendingIncidentsCount}
              onOpenChatbot={onOpenChatbot}
              onCloseMobileDrawer={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* MAIN OPERATIONS WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <DashboardHeader
          selectedCampus={selectedCampus}
          onSelectCampus={setSelectedCampus}
          onTriggerAlert={triggerSimulatedAlert}
          unreadAlertsCount={pendingIncidentsCount}
          onOpenSearch={() => {}}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenChatbot={onOpenChatbot}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />

        {/* Dynamic Workspace Panes */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] w-full mx-auto">
          {/* ========================================================================= */}
          {/* TAB 1: MAIN OPERATIONS DASHBOARD (Video Screen 1)                         */}
          {/* ========================================================================= */}
          {currentTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Operations Center Hero Banner (Preserves Signature Yellow/Cream/Black theme) */}
              <div className="bg-white dark:bg-darkbg-900 border-3 border-black dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#000] flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-accent/50 dark:bg-amber-500/10 text-black dark:text-cream-accent font-mono text-[11px] font-black uppercase border-2 border-black dark:border-amber-500/30">
                    <span className="w-2 h-2 rounded-full bg-cream-accent border border-black dark:border-none animate-pulse"></span>
                    SECURITY OPERATIONS CENTER • LIVE CAMPUS
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-mono text-black dark:text-white tracking-tight">
                    Drishti AI Security Operations Center
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    Real-time AI-powered campus surveillance and safety intelligence. Transforming
                    existing CCTV infrastructure into an intelligent security network.
                  </p>
                  <div className="flex items-center gap-4 pt-1 font-mono text-xs">
                    <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      System Operational
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold">
                      {campus.cams} connected surveillance endpoints
                    </span>
                  </div>
                </div>

                {/* Big Action Buttons (Yellow/Black Brutalist Styling) */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 font-mono text-xs shrink-0 z-10">
                  <button
                    onClick={triggerSimulatedAlert}
                    className="btn-brutal px-5 py-3 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-black border-2 border-black flex items-center justify-center gap-2.5 cursor-pointer shadow-[3px_3px_0px_#000]"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Simulate Live AI Alert</span>
                  </button>
                  <button
                    onClick={handleRefresh}
                    className="btn-brutal px-5 py-3 rounded-2xl bg-cream-accent hover:bg-yellow-300 text-black font-black border-2 border-black flex items-center justify-center gap-2.5 cursor-pointer shadow-[3px_3px_0px_#000]"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      soundManager.playAcknowledgePing();
                      alert('Generating official forensic incident PDF report...');
                    }}
                    className="btn-brutal px-5 py-3 rounded-2xl bg-black hover:bg-slate-900 text-white font-black border-2 border-black flex items-center justify-center gap-2.5 cursor-pointer shadow-[3px_3px_0px_#000]"
                  >
                    <FileDown className="w-4 h-4 text-cream-accent" />
                    <span>Export PDF Report</span>
                  </button>
                </div>
              </div>

              {/* CAMPUS SECURITY OVERVIEW (6 Big Spacious KPI Cards) */}
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-black dark:text-white uppercase tracking-wider">
                      Campus Security Overview
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Key performance indicators • Updated just now
                    </p>
                  </div>
                  <span className="text-[11px] text-black dark:text-cream-accent font-black bg-cream-200 dark:bg-darkbg-800 px-3 py-1 rounded-xl border-2 border-black">
                    TODAY'S PERFORMANCE
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 font-mono">
                  {/* 1. Total Cameras */}
                  <div className="bg-white dark:bg-darkbg-850 border-2 border-black p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center text-xs text-amber-500 font-bold">
                      <Video className="w-4 h-4" />
                      <span className="text-[10px] sm:text-[11px]">▲ 2.4%</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums truncate">
                      {campus.cams}
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">Total Cameras</div>
                  </div>

                  {/* 2. Active Alerts */}
                  <div className="bg-white dark:bg-darkbg-850 border-2 border-black p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center text-xs text-red-500 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-[10px] sm:text-[11px]">▲ 3.1%</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-red-500 tabular-nums truncate">18</div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">Active Alerts</div>
                  </div>

                  {/* 3. Crowd Alerts */}
                  <div className="bg-white dark:bg-darkbg-850 border-2 border-black p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center text-xs text-amber-500 font-bold">
                      <Users className="w-4 h-4" />
                      <span className="text-[10px] sm:text-[11px]">▲ 8.4%</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums truncate">
                      17
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">Crowd Spikes</div>
                  </div>

                  {/* 4. Unauthorized Entries */}
                  <div className="bg-white dark:bg-darkbg-850 border-2 border-black p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center text-xs text-purple-600 dark:text-purple-400 font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-[10px] sm:text-[11px]">▲ 1.2%</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums truncate">
                      08
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">Perimeter Alerts</div>
                  </div>

                  {/* 5. Fall Detections */}
                  <div className="bg-white dark:bg-darkbg-850 border-2 border-black p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center text-xs text-amber-500 font-bold">
                      <Activity className="w-4 h-4" />
                      <span className="text-[10px] sm:text-[11px]">▼ 14%</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums truncate">
                      06
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">Fall Alerts</div>
                  </div>

                  {/* 6. Campus Safety Score */}
                  <div className="bg-white dark:bg-darkbg-850 border-2 border-black p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-[3px_3px_0px_#000] sm:shadow-[4px_4px_0px_#000] space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center text-xs text-emerald-500 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[10px] sm:text-[11px]">▲ 1.8%</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-500 tabular-nums truncate">
                      {campus.safetyScore}
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase truncate">Safety Score</div>
                  </div>
                </div>
              </div>

              {/* CAMPUS ZONES (8 Big Spacious Cards) */}
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-black dark:text-white uppercase tracking-wider">
                      Campus Zones
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Real-time AI assessment and surveillance status across monitored campus sectors
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playAcknowledgePing();
                      setZones((prev) =>
                        prev.map((z) => ({
                          ...z,
                          riskScore: Math.min(
                            99,
                            Math.max(10, z.riskScore + (Math.floor(Math.random() * 5) - 2))
                          ),
                        }))
                      );
                    }}
                    className="btn-brutal px-3.5 py-1.5 rounded-xl bg-white dark:bg-darkbg-800 text-xs font-black text-black dark:text-white border-2 border-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>LIVE ASSESSMENT</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {zones.map((zone) => {
                    const isCritical = zone.status === 'Critical';
                    const isModerate = zone.status === 'Moderate';

                    return (
                      <div
                        key={zone.id}
                        className={`bg-white dark:bg-darkbg-850 border-2 border-black p-5 rounded-3xl shadow-[4px_4px_0px_#000] space-y-3 ${
                          isCritical
                            ? 'border-l-8 border-l-red-500'
                            : isModerate
                            ? 'border-l-8 border-l-amber-500'
                            : 'border-l-8 border-l-emerald-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-black dark:text-white text-sm">
                            {zone.name}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border ${
                              isCritical
                                ? 'bg-red-100 text-red-700 border-red-500'
                                : isModerate
                                ? 'bg-amber-100 text-amber-700 border-amber-500'
                                : 'bg-emerald-100 text-emerald-700 border-emerald-500'
                            }`}
                          >
                            {zone.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between">
                          <div
                            className={`text-3xl font-black tabular-nums ${
                              isCritical
                                ? 'text-red-500'
                                : isModerate
                                ? 'text-amber-500'
                                : 'text-emerald-500'
                            }`}
                          >
                            {zone.riskScore}
                            <span className="text-xs text-slate-400 font-normal">/100</span>
                          </div>
                          <span className="text-xs text-slate-500 font-bold">
                            {zone.camerasCount} Cameras
                          </span>
                        </div>

                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden border border-black/20">
                          <div
                            className={`h-full rounded-full ${
                              isCritical ? 'bg-red-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${zone.riskScore}%` }}
                          ></div>
                        </div>

                        {zone.alertsCount > 0 ? (
                          <div className="text-[11px] text-red-600 dark:text-red-400 font-black flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{zone.alertsCount} Active Alerts Flagged</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Nominal Activity Monitored</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LIVE CAMERA MONITORING (Video Screen 2 on Dashboard) */}
              <div className="space-y-4 font-mono">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-black dark:text-white uppercase tracking-wider">
                      Live Camera Monitoring
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      All active CCTV surveillance • Existing infrastructure integration
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSkeleton(!showSkeleton)}
                      className={`btn-brutal px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] ${
                        showSkeleton
                          ? 'bg-cream-accent text-black'
                          : 'bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>MediaPipe Skeletons: {showSkeleton ? 'ON' : 'OFF'}</span>
                    </button>

                    <button
                      onClick={() => setIsNightVision(!isNightVision)}
                      className={`btn-brutal px-3.5 py-1.5 rounded-xl border-2 border-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000] ${
                        isNightVision
                          ? 'bg-emerald-400 text-black'
                          : 'bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>Night IR: {isNightVision ? 'ON' : 'OFF'}</span>
                    </button>

                    <span className="btn-brutal px-3.5 py-1.5 rounded-xl bg-red-500 text-white border-2 border-black text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      LIVE FEED
                    </span>
                  </div>
                </div>

                {/* 6 Spacious Live Camera Feeds */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {cameras.slice(0, 6).map((cam) => {
                    const isAlert = cam.riskLevel === 'Critical';
                    const isWarn = cam.riskLevel === 'Moderate';

                    return (
                      <div
                        key={cam.id}
                        className={`bg-white dark:bg-darkbg-850 border-3 border-black rounded-3xl p-4 shadow-[5px_5px_0px_#000] space-y-3 ${
                          isAlert
                            ? 'border-l-8 border-l-red-500'
                            : isWarn
                            ? 'border-l-8 border-l-amber-500'
                            : ''
                        }`}
                      >
                        {/* Feed Top Status Bar */}
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            ONLINE
                          </span>
                          <span className="text-black dark:text-white font-black">{cam.id}</span>
                          <span
                            className={`text-[10px] font-black ${
                              isAlert ? 'text-red-500' : isWarn ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {cam.aiMode}
                          </span>
                        </div>

                        {/* Interactive Canvas Viewport */}
                        <div className="relative group rounded-2xl overflow-hidden border-2 border-black">
                          <CameraStreamCanvas
                            camera={cam}
                            showSkeleton={showSkeleton}
                            isNightVision={isNightVision}
                            onClick={() => setSelectedCameraForModal(cam)}
                            className="w-full aspect-video shadow-inner cursor-pointer"
                          />
                          <button
                            onClick={() => setSelectedCameraForModal(cam)}
                            className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer font-bold border border-white/20"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Enlarge</span>
                          </button>
                        </div>

                        {/* Feed Footer Info */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-xs font-black text-black dark:text-white">
                            <span>{cam.name}</span>
                            <span className="text-amber-600 dark:text-cream-accent font-black">
                              People: {cam.peopleCount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                            <span>Last Activity: {cam.lastActive}</span>
                            <span>
                              {cam.fps} FPS · {cam.confidence}% Conf
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REAL-TIME INCIDENT FEED */}
              <div className="space-y-4 font-mono">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-black text-black dark:text-white uppercase tracking-wider">
                      Real-Time Incident Feed
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Immediate events requiring attention
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('incidents')}
                    className="text-xs font-black text-black dark:text-cream-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all {incidents.length} incidents</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {incidents.slice(0, 4).map((inc) => {
                    const isCritical = inc.severity === 'Critical';
                    const isModerate = inc.severity === 'Moderate';
                    const isAck = inc.status === 'Acknowledged' || inc.status === 'Dispatched';

                    return (
                      <div
                        key={inc.id}
                        className={`bg-white dark:bg-darkbg-850 border-2 border-black p-4 sm:p-5 rounded-3xl shadow-[3px_3px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          isCritical
                            ? 'border-l-8 border-l-red-500'
                            : isModerate
                            ? 'border-l-8 border-l-amber-500'
                            : ''
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <span
                              className={`font-black uppercase tracking-wider ${
                                isCritical ? 'text-red-500' : 'text-amber-500'
                              }`}
                            >
                              {inc.eventType} [{inc.severity}]
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-black dark:text-white font-black">{inc.time}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-black dark:text-cream-accent font-bold">
                              {inc.cameraName} ({inc.cameraId})
                            </span>
                            <span className="text-slate-400">·</span>
                            <span className="text-slate-500 font-bold">Zone: {inc.location}</span>
                          </div>

                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                            {inc.description}
                          </p>

                          <div className="text-[11px] text-slate-500 font-bold flex items-center gap-3">
                            <span>Engine: <strong className="text-black dark:text-white">{inc.modelEngine}</strong></span>
                            <span>Confidence: <strong className="text-emerald-600 dark:text-emerald-400">{inc.confidence}%</strong></span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          {isAck ? (
                            <span className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-500 text-xs font-black flex items-center gap-1.5 shadow-sm">
                              <Check className="w-3.5 h-3.5" />
                              <span>Acknowledged</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAcknowledgeIncident(inc.id)}
                              className="btn-brutal px-4 py-2 rounded-xl bg-cream-accent hover:bg-yellow-300 text-black border-2 border-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#000]"
                            >
                              <span>Acknowledge</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LIVE MONITORING                                                   */}
          {/* ========================================================================= */}
          {currentTab === 'live-monitoring' && (
            <div className="space-y-6 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/15 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white">Full Live Surveillance Wall</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Multi-stream neural vision matrix • Synchronized RTSP H.265 feeds
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-black">
                  <button
                    onClick={() => setShowSkeleton(!showSkeleton)}
                    className={`btn-brutal px-3.5 py-2 rounded-xl border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] ${
                      showSkeleton ? 'bg-cream-accent text-black font-black' : 'bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    MediaPipe Pose Skeletons: {showSkeleton ? 'ACTIVE' : 'OFF'}
                  </button>

                  <button
                    onClick={() => setIsNightVision(!isNightVision)}
                    className={`btn-brutal px-3.5 py-2 rounded-xl border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] ${
                      isNightVision ? 'bg-emerald-400 text-black font-black' : 'bg-white dark:bg-darkbg-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Infrared Night Vision: {isNightVision ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>
              </div>

              {/* 8 Full Camera Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {cameras.map((cam) => (
                  <div
                    key={cam.id}
                    className="bg-white dark:bg-darkbg-850 border-3 border-black rounded-3xl p-4 shadow-[5px_5px_0px_#000] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-black dark:text-white">{cam.name}</span>
                      <span className="text-[10px] text-amber-600 dark:text-cream-accent font-mono">{cam.id}</span>
                    </div>

                    <div className="relative group rounded-2xl overflow-hidden border-2 border-black">
                      <CameraStreamCanvas
                        camera={cam}
                        showSkeleton={showSkeleton}
                        isNightVision={isNightVision}
                        onClick={() => setSelectedCameraForModal(cam)}
                        className="w-full aspect-video cursor-pointer"
                      />
                      <button
                        onClick={() => setSelectedCameraForModal(cam)}
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer font-bold border border-white/20"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>PTZ Controls</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-bold">
                      <span>FPS: <strong className="text-black dark:text-white">{cam.fps}</strong></span>
                      <span>People: <strong className="text-amber-600 dark:text-cream-accent">{cam.peopleCount}</strong></span>
                      <span className={`font-black ${cam.riskLevel === 'Critical' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {cam.riskLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CAMERAS INVENTORY                                                 */}
          {/* ========================================================================= */}
          {currentTab === 'cameras' && (
            <div className="space-y-6 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/15 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white">Connected Camera Infrastructure</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage 128 registered CCTV nodes across SSIPMT Raipur
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedZoneFilter}
                    onChange={(e) => setSelectedZoneFilter(e.target.value)}
                    className="btn-brutal bg-white dark:bg-darkbg-850 border-2 border-black text-black dark:text-white text-xs px-3 py-2 rounded-xl focus:outline-none cursor-pointer font-bold shadow-[2px_2px_0px_#000]"
                  >
                    <option value="all">All Campus Zones</option>
                    <option value="Main Gate">Main Gate</option>
                    <option value="Library">Library</option>
                    <option value="Parking Area">Parking Area</option>
                    <option value="Hostel A">Hostel A</option>
                    <option value="Academic Block">Academic Block</option>
                    <option value="Admin Building">Admin Building</option>
                    <option value="Examination Cell">Examination Cell</option>
                  </select>
                </div>
              </div>

              {/* Cameras Data Table */}
              <div className="bg-white dark:bg-darkbg-850 border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000] text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-cream-200 dark:bg-darkbg-800 text-black dark:text-slate-300 border-b-2 border-black font-black">
                      <tr>
                        <th className="p-4">Camera ID</th>
                        <th className="p-4">Name & Location</th>
                        <th className="p-4">AI Engine Mode</th>
                        <th className="p-4">Resolution / FPS</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">RTSP Endpoint</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 text-slate-800 dark:text-slate-200">
                      {filteredCameras.map((cam) => (
                        <tr key={cam.id} className="hover:bg-cream-100 dark:hover:bg-darkbg-800">
                          <td className="p-4 font-black text-black dark:text-white">{cam.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-black dark:text-white">{cam.name}</div>
                            <div className="text-[11px] text-slate-500 font-medium">{cam.zone}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-lg bg-cream-accent/50 text-black border border-black text-[10px] font-black">
                              {cam.aiMode}
                            </span>
                          </td>
                          <td className="p-4 tabular-nums font-bold">
                            {cam.resolution} · {cam.fps} FPS
                          </td>
                          <td className="p-4">
                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              ONLINE
                            </span>
                          </td>
                          <td className="p-4 font-mono text-[11px] text-slate-500 truncate max-w-xs">
                            {cam.rtspUrl}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedCameraForModal(cam)}
                              className="btn-brutal px-3 py-1.5 bg-cream-accent hover:bg-yellow-300 text-black rounded-xl border-2 border-black cursor-pointer font-black shadow-[2px_2px_0px_#000]"
                            >
                              Live Monitor
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: INCIDENTS MANAGEMENT                                              */}
          {/* ========================================================================= */}
          {currentTab === 'incidents' && (
            <div className="space-y-6 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/15 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white">Active Campus Incidents</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    AI-flagged safety breaches, sudden human falls, and crowd stampede risks
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-black">
                  {(['all', 'Critical', 'Moderate', 'Low'] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setActiveIncidentFilter(sev)}
                      className={`btn-brutal px-3.5 py-1.5 rounded-xl border-2 border-black cursor-pointer capitalize transition-colors shadow-[2px_2px_0px_#000] ${
                        activeIncidentFilter === sev
                          ? 'bg-cream-accent text-black font-black'
                          : 'bg-white dark:bg-darkbg-850 text-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {sev === 'all' ? 'All Severities' : sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Incidents List */}
              <div className="space-y-4">
                {filteredIncidents.map((inc) => {
                  const isCritical = inc.severity === 'Critical';
                  const isModerate = inc.severity === 'Moderate';
                  const isAck = inc.status === 'Acknowledged' || inc.status === 'Dispatched';

                  return (
                    <div
                      key={inc.id}
                      className={`bg-white dark:bg-darkbg-850 border-3 border-black p-6 rounded-3xl shadow-[5px_5px_0px_#000] flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                        isCritical
                          ? 'border-l-8 border-l-red-500'
                          : isModerate
                          ? 'border-l-8 border-l-amber-500'
                          : ''
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-3 text-xs font-black">
                          <span
                            className={`px-2.5 py-0.5 rounded-lg border border-black ${
                              isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {inc.eventType.toUpperCase()} [{inc.severity.toUpperCase()}]
                          </span>
                          <span className="text-black dark:text-white">{inc.time}</span>
                          <span className="text-amber-600 dark:text-cream-accent">{inc.cameraName}</span>
                          <span className="text-slate-500">({inc.cameraId})</span>
                          <span className="text-slate-700 dark:text-slate-300">Zone: {inc.location}</span>
                        </div>

                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                          {inc.description}
                        </p>

                        <div className="text-xs text-slate-500 font-bold flex items-center gap-4">
                          <span>Detection Model: <strong className="text-black dark:text-white">{inc.modelEngine}</strong></span>
                          <span>Inference Confidence: <strong className="text-emerald-600 dark:text-emerald-400">{inc.confidence}%</strong></span>
                          <span>Ticket ID: <strong className="text-slate-700 dark:text-slate-300">{inc.id}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
                        {isAck ? (
                          <span className="px-4 py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-500 text-xs font-black flex items-center gap-2 shadow-sm">
                            <Check className="w-4 h-4" />
                            <span>Acknowledged</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAcknowledgeIncident(inc.id)}
                            className="btn-brutal px-4 py-2.5 rounded-2xl bg-cream-accent hover:bg-yellow-300 text-black border-2 border-black text-xs font-black flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
                          >
                            <span>Acknowledge</span>
                          </button>
                        )}

                        <button
                          onClick={() => {
                            soundManager.playSecurityAlert();
                            alert(`[DISPATCH TICKET]: Security Patrol Team dispatched to ${inc.location}.`);
                            setIncidents((prev) =>
                              prev.map((i) => (i.id === inc.id ? { ...i, status: 'Dispatched' } : i))
                            );
                          }}
                          className="btn-brutal px-4 py-2.5 rounded-2xl bg-red-500 hover:bg-red-400 text-white text-xs font-black border-2 border-black flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
                        >
                          <Radio className="w-4 h-4" />
                          <span>Dispatch Guard</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: RISK ANALYTICS                                                    */}
          {/* ========================================================================= */}
          {currentTab === 'risk-analytics' && <RiskAnalyticsCharts />}

          {/* ========================================================================= */}
          {/* TAB 6: CAMPUS MAP (Schematic Network)                                    */}
          {/* ========================================================================= */}
          {currentTab === 'campus-map' && <SchematicCampusMap />}

          {/* ========================================================================= */}
          {/* TAB 7: HISTORICAL REPORTS                                                */}
          {/* ========================================================================= */}
          {currentTab === 'reports' && (
            <div className="space-y-8 font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black/15 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white">Historical Reports & Audit Logs</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Forensic evidence timeline and telemetry records
                  </p>
                </div>
                <button
                  onClick={() => alert('Downloading official campus safety audit spreadsheet (CSV)...')}
                  className="btn-brutal px-5 py-2.5 rounded-2xl bg-cream-accent hover:bg-yellow-300 text-black font-black text-xs border-2 border-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000]"
                >
                  <FileDown className="w-4 h-4" />
                  <span>Download CSV Log</span>
                </button>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-darkbg-850 border-3 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_#000] text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-cream-200 dark:bg-darkbg-800 text-black dark:text-slate-300 border-b-2 border-black font-black">
                      <tr>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4">Camera</th>
                        <th className="p-4">Event Type</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Confidence</th>
                        <th className="p-4">Severity</th>
                        <th className="p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 text-slate-800 dark:text-slate-200">
                      {incidents.map((inc) => (
                        <tr key={inc.id} className="hover:bg-cream-100 dark:hover:bg-darkbg-800">
                          <td className="p-4 font-black text-black dark:text-white">{inc.time}</td>
                          <td className="p-4 font-mono font-bold text-amber-600 dark:text-cream-accent">{inc.cameraId}</td>
                          <td className="p-4 font-black text-black dark:text-white">{inc.eventType}</td>
                          <td className="p-4 font-medium">{inc.location}</td>
                          <td className="p-4 text-emerald-600 dark:text-emerald-400 font-black">{inc.confidence}%</td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-lg border border-black text-[10px] font-black ${
                                inc.severity === 'Critical'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {inc.severity}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <span className="text-emerald-600 dark:text-emerald-400 font-black">{inc.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white dark:bg-darkbg-850 border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_#000] space-y-6">
                <div className="flex items-center justify-between border-b-2 border-black/15 pb-3">
                  <div>
                    <h4 className="text-lg font-black text-black dark:text-white">System Health & Infrastructure</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Platform AI, processing and camera connectivity metrics
                    </p>
                  </div>
                  <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border-2 border-emerald-500 text-xs font-black flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    ALL SYSTEMS NOMINAL
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                  <div className="p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/20 space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 font-bold">
                      <span>AI Engine Status</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">Operational</span>
                    </div>
                    <div className="text-2xl font-black text-black dark:text-white">99.8%</div>
                    <div className="text-[11px] text-slate-500">Model pipeline uptime</div>
                  </div>

                  <div className="p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/20 space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 font-bold">
                      <span>Detection Accuracy</span>
                      <span className="text-amber-600 dark:text-cream-accent font-black">Optimal</span>
                    </div>
                    <div className="text-2xl font-black text-black dark:text-white">96.8%</div>
                    <div className="text-[11px] text-slate-500">Model benchmark</div>
                  </div>

                  <div className="p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/20 space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 font-bold">
                      <span>Camera Connectivity</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">124 / 128</span>
                    </div>
                    <div className="text-2xl font-black text-black dark:text-white">98.4%</div>
                    <div className="text-[11px] text-slate-500">RTSP Stream stability</div>
                  </div>

                  <div className="p-4 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black/20 space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400 font-bold">
                      <span>Processing Latency</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black">&lt; 15ms</span>
                    </div>
                    <div className="text-2xl font-black text-black dark:text-white">11.4 ms</div>
                    <div className="text-[11px] text-slate-500">Edge TensorRT inference</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: SETTINGS                                                          */}
          {/* ========================================================================= */}
          {currentTab === 'settings' && (
            <div className="space-y-6 font-mono max-w-3xl">
              <div className="border-b-2 border-black/15 pb-4">
                <h3 className="text-2xl font-black text-black dark:text-white">Security & Model Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure AI detection sensitivities and notification dispatch channels
                </p>
              </div>

              <div className="bg-white dark:bg-darkbg-850 border-3 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] space-y-6 text-xs">
                <div className="space-y-4">
                  <h4 className="font-black text-black dark:text-white text-sm uppercase">Detection Thresholds</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-black dark:text-white font-bold">
                      <span>Crowd Surge Density Threshold (Persons / 100m²)</span>
                      <span className="text-amber-600 dark:text-cream-accent font-black">25 Persons</span>
                    </div>
                    <input type="range" min="10" max="60" defaultValue="25" className="w-full accent-cream-accent cursor-pointer" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-black dark:text-white font-bold">
                      <span>Human Fall Stillness Confirmation Window</span>
                      <span className="text-amber-600 dark:text-cream-accent font-black">3.5 Seconds</span>
                    </div>
                    <input type="range" min="1" max="10" step="0.5" defaultValue="3.5" className="w-full accent-cream-accent cursor-pointer" />
                  </div>
                </div>

                <div className="border-t-2 border-black/15 pt-6 space-y-4">
                  <h4 className="font-black text-black dark:text-white text-sm uppercase">Automated Dispatch Channels</h4>
                  
                  <label className="flex items-center justify-between p-3.5 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black cursor-pointer font-bold">
                    <div className="space-y-0.5">
                      <div className="text-black dark:text-white font-black">Telegram Guard Alert Bot</div>
                      <div className="text-[11px] text-slate-500 font-normal">Pushes incident snapshots to on-duty security supervisors</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-cream-accent" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 bg-cream-100 dark:bg-darkbg-700 rounded-2xl border-2 border-black cursor-pointer font-bold">
                    <div className="space-y-0.5">
                      <div className="text-black dark:text-white font-black">Campus Acoustic Siren on Fall Distress</div>
                      <div className="text-[11px] text-slate-500 font-normal">Triggers localized buzzer for instant medical response</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-cream-accent" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FLOATING CRITICAL TOAST (Exact from Video at 00:22) */}
      <div
        className={`fixed bottom-6 right-6 z-50 max-w-md w-full bg-white dark:bg-darkbg-900 border-3 border-red-500 p-5 rounded-3xl shadow-[8px_8px_0px_#000] transition-all duration-300 font-mono ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-48 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shrink-0 text-xl shadow border-2 border-black">
            🚨
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-black text-red-600 uppercase">
              <span>CRITICAL AI SECURITY ALERT</span>
              <span className="px-2 py-0.5 rounded-lg bg-red-100 text-red-700 text-[10px] border border-red-500">
                {toastData.severity}
              </span>
            </div>
            <div className="font-black text-sm text-black dark:text-white">{toastData.title}</div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Location: <strong>{toastData.location}</strong> • Camera: <strong>{toastData.camera}</strong> • Confidence: <span className="text-emerald-600 font-black">{toastData.confidence}%</span>
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setShowToast(false);
                  setCurrentTab('incidents');
                }}
                className="btn-brutal px-3.5 py-1.5 bg-white hover:bg-cream-100 text-black rounded-xl border-2 border-black font-black text-xs cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                View in Incident Feed
              </button>
              <button
                onClick={handleAcknowledgeToast}
                className="btn-brutal px-3.5 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded-xl border-2 border-black font-black text-xs cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                Acknowledge
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-black dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODAL: Fullscreen PTZ Camera Inspector */}
      {selectedCameraForModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 font-mono">
          <div className="bg-white dark:bg-darkbg-900 border-3 border-black rounded-3xl max-w-4xl w-full p-6 shadow-[10px_10px_0px_#000] space-y-5">
            <div className="flex items-center justify-between border-b-2 border-black/15 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-xl font-black text-black dark:text-white">
                    {selectedCameraForModal.name} — {selectedCameraForModal.id}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Zone: {selectedCameraForModal.zone} • {selectedCameraForModal.resolution} • {selectedCameraForModal.fps} FPS
                </p>
              </div>
              <button
                onClick={() => setSelectedCameraForModal(null)}
                className="p-2 rounded-xl bg-black text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border-2 border-black">
              <CameraStreamCanvas
                camera={selectedCameraForModal}
                showSkeleton={showSkeleton}
                isNightVision={isNightVision}
                className="w-full h-full"
              />
            </div>

            {/* PTZ and Lens Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-3 bg-cream-100 dark:bg-darkbg-800 rounded-2xl border-2 border-black space-y-2">
                <span className="text-black dark:text-white font-black block">Digital PTZ Pan & Tilt</span>
                <div className="grid grid-cols-3 gap-1.5 text-center max-w-[120px] mx-auto">
                  <span></span>
                  <button className="p-1.5 bg-black text-white rounded font-bold cursor-pointer">▲</button>
                  <span></span>
                  <button className="p-1.5 bg-black text-white rounded font-bold cursor-pointer">◀</button>
                  <button className="p-1.5 bg-cream-accent text-black rounded text-[10px] font-bold">●</button>
                  <button className="p-1.5 bg-black text-white rounded font-bold cursor-pointer">▶</button>
                  <span></span>
                  <button className="p-1.5 bg-black text-white rounded font-bold cursor-pointer">▼</button>
                  <span></span>
                </div>
              </div>

              <div className="p-3 bg-cream-100 dark:bg-darkbg-800 rounded-2xl border-2 border-black space-y-2">
                <span className="text-black dark:text-white font-black block">Optical Zoom: 2.4x</span>
                <input type="range" min="1" max="10" defaultValue="2.4" className="w-full accent-cream-accent cursor-pointer" />
                <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                  <span>1x Wide</span>
                  <span>10x Telephoto</span>
                </div>
              </div>

              <div className="p-3 bg-cream-100 dark:bg-darkbg-800 rounded-2xl border-2 border-black space-y-2 flex flex-col justify-center">
                <button
                  onClick={() => {
                    soundManager.playAcknowledgePing();
                    alert(`Snapshot captured for ${selectedCameraForModal.id} and saved to forensic archive.`);
                  }}
                  className="btn-brutal w-full py-2.5 rounded-xl bg-cream-accent hover:bg-yellow-300 text-black font-black text-xs border-2 border-black flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000]"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Snapshot</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
