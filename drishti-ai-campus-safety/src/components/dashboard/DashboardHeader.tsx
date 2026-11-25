import { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Bell,
  ChevronDown,
  X,
  MessageSquare,
  Menu
} from 'lucide-react';
import { RaipurCampusKey } from '../../types';
import { RAIPUR_CAMPUSES } from '../../data/mockData';

interface DashboardHeaderProps {
  selectedCampus: RaipurCampusKey;
  onSelectCampus: (campus: RaipurCampusKey) => void;
  onTriggerAlert: () => void;
  unreadAlertsCount: number;
  onOpenSearch: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenChatbot: () => void;
  onToggleMobileSidebar?: () => void;
}

export function DashboardHeader({
  selectedCampus,
  onSelectCampus,
  unreadAlertsCount,
  searchQuery,
  setSearchQuery,
  onOpenChatbot,
  onToggleMobileSidebar,
}: DashboardHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>('12:08:41 am');
  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).toLowerCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const campus = RAIPUR_CAMPUSES[selectedCampus];

  return (
    <header className="bg-cream-50/95 dark:bg-darkbg-900/95 border-b-2 border-black/10 dark:border-darkbg-border px-4 sm:px-6 py-3 sticky top-0 z-30 flex items-center justify-between gap-3 font-mono text-xs backdrop-blur-md">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Navigation Drawer Toggle */}
        <button
          onClick={onToggleMobileSidebar}
          className="btn-brutal lg:hidden p-2 rounded-xl bg-cream-accent hover:bg-yellow-300 text-black border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] flex items-center justify-center shrink-0"
          aria-label="Toggle Dashboard Menu"
        >
          <Menu className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Campus Selector Dropdown (Signature Yellow pill) */}
        <div className="relative">
          <button
            onClick={() => setShowCampusDropdown(!showCampusDropdown)}
            className="btn-brutal flex items-center gap-1.5 sm:gap-2 bg-cream-accent text-black border-2 border-black px-2.5 sm:px-3.5 py-1.5 rounded-xl font-black cursor-pointer shadow-[2px_2px_0px_#000] text-[11px] sm:text-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">{campus.shortName}</span>
            <ChevronDown className="w-3 h-3 text-black shrink-0" />
          </button>

        {showCampusDropdown && (
          <div className="absolute left-0 top-full mt-2 w-72 bg-white dark:bg-darkbg-850 border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000] py-2 z-50">
            <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase font-black">
              Select Monitored Raipur College
            </div>
            {(Object.keys(RAIPUR_CAMPUSES) as RaipurCampusKey[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  onSelectCampus(key);
                  setShowCampusDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-cream-200 dark:hover:bg-darkbg-700 flex items-center justify-between cursor-pointer ${
                  selectedCampus === key
                    ? 'text-black dark:text-cream-accent bg-cream-100 dark:bg-darkbg-800 font-black'
                    : 'text-slate-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold">{RAIPUR_CAMPUSES[key].name}</div>
                  <div className="text-[10px] text-slate-500">{RAIPUR_CAMPUSES[key].location}</div>
                </div>
                <span className="text-[10px] text-slate-500 font-bold ml-2">
                  {RAIPUR_CAMPUSES[key].cams} Cams
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
        <div className="w-full relative flex items-center bg-white dark:bg-darkbg-850 border-2 border-black dark:border-darkbg-border focus-within:border-black rounded-xl px-3.5 py-1.5 text-slate-700 dark:text-slate-300 shadow-[2px_2px_0px_#000]">
          <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cameras, incidents, locations..."
            className="bg-transparent flex-1 focus:outline-none text-black dark:text-white placeholder-slate-400 text-xs font-bold"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-black dark:hover:text-white cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden lg:inline-block text-[10px] bg-cream-200 dark:bg-darkbg-700 text-black dark:text-slate-300 border border-black/20 px-1.5 py-0.5 rounded font-mono font-bold">
              Ctrl+K
            </kbd>
          )}
        </div>
      </div>

      {/* Right Utility Bar */}
      <div className="flex items-center gap-3 font-bold">
        {/* Real-time Clock */}
        <div className="text-black dark:text-slate-300 tabular-nums px-2.5 py-1.5 bg-white dark:bg-darkbg-850 rounded-xl border-2 border-black dark:border-white/10 shadow-[2px_2px_0px_#000]">
          {timeStr}
        </div>

        {/* System Healthy Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border-2 border-emerald-500 text-[11px] font-black">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Healthy</span>
        </div>

        {/* Chatbot Launcher Button in Header */}
        <button
          onClick={onOpenChatbot}
          className="btn-brutal p-2 rounded-xl bg-cream-accent hover:bg-yellow-300 text-black border-2 border-black cursor-pointer shadow-[2px_2px_0px_#000] flex items-center gap-1.5 font-bold"
          title="Open SSIPMT Campus Assistant & Directions"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden xl:inline">Campus Guide</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-brutal p-2 rounded-xl bg-white dark:bg-darkbg-850 hover:bg-cream-100 text-black dark:text-white border-2 border-black cursor-pointer relative shadow-[2px_2px_0px_#000]"
            title="Active Security Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-black animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-darkbg-850 border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000] p-4 z-50 space-y-3">
              <div className="flex justify-between items-center border-b border-black/15 pb-2">
                <span className="font-black text-black dark:text-white text-xs">
                  Security Notifications
                </span>
                <span className="text-[10px] text-amber-600 dark:text-cream-accent font-black">
                  {unreadAlertsCount} active
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border-2 border-red-500 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-red-600 dark:text-red-400 flex justify-between">
                    <span>Hostel A • Fall Detected</span>
                    <span className="text-[10px]">Just now</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    CAM-007 triggered posture collapse alert (93.8% conf).
                  </p>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-amber-700 dark:text-amber-400 flex justify-between">
                    <span>Main Gate • Crowd Surge</span>
                    <span className="text-[10px]">12m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300">
                    Density exceeded 30 persons/100m² at entry gates.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black text-cream-accent font-black flex items-center justify-center text-xs shadow border-2 border-black">
            AD
          </div>
          <div className="hidden xl:block text-left leading-tight">
            <div className="text-[11px] text-black dark:text-white font-black">Admin</div>
            <div className="text-[9px] text-slate-500">SSIPMT Security</div>
          </div>
        </div>
      </div>
    </header>
  );
}
