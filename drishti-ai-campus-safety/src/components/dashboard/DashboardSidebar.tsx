import {
  ScanEye,
  ArrowLeft,
  LayoutDashboard,
  Video,
  Cctv,
  AlertTriangle,
  TrendingUp,
  Map,
  FileText,
  Settings,
  LogOut,
  Cpu,
  MessageSquare,
  X
} from 'lucide-react';
import { ConsoleTab } from '../../types';

interface DashboardSidebarProps {
  currentTab: ConsoleTab;
  onTabChange: (tab: ConsoleTab) => void;
  onReturnToLanding: () => void;
  pendingIncidentsCount: number;
  onOpenChatbot: () => void;
  onCloseMobileDrawer?: () => void;
}

export function DashboardSidebar({
  currentTab,
  onTabChange,
  onReturnToLanding,
  pendingIncidentsCount,
  onOpenChatbot,
  onCloseMobileDrawer,
}: DashboardSidebarProps) {
  const navItems: { id: ConsoleTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: <Video className="w-4 h-4" /> },
    { id: 'cameras', label: 'Cameras', icon: <Cctv className="w-4 h-4" /> },
    {
      id: 'incidents',
      label: 'Incidents',
      icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
      badge: pendingIncidentsCount || 15,
    },
    { id: 'risk-analytics', label: 'Risk Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'campus-map', label: 'Campus Map', icon: <Map className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleItemClick = (id: ConsoleTab) => {
    onTabChange(id);
    if (onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  return (
    <aside className="w-64 shrink-0 bg-cream-50 dark:bg-darkbg-900 border-r-2 border-black/10 dark:border-darkbg-border flex flex-col justify-between z-40 h-full select-none font-mono">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b-2 border-black/10 dark:border-darkbg-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cream-accent border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                <ScanEye className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-wider text-black dark:text-white leading-none">
                  Drishti <span className="text-amber-500 dark:text-cream-accent">AI</span>
                </h2>
                <span className="text-[8px] tracking-widest uppercase text-slate-500 font-bold block mt-1">
                  CAMPUS INTELLIGENCE
                </span>
              </div>
            </div>

            {/* Mobile Close Drawer Button */}
            {onCloseMobileDrawer && (
              <button
                onClick={onCloseMobileDrawer}
                className="lg:hidden p-1.5 rounded-xl border-2 border-black bg-white dark:bg-darkbg-850 text-black dark:text-white cursor-pointer shadow-[2px_2px_0px_#000]"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Back to Front Showcase Button */}
          <button
            onClick={() => {
              onReturnToLanding();
              if (onCloseMobileDrawer) onCloseMobileDrawer();
            }}
            className="btn-brutal w-full py-2.5 px-3 rounded-xl bg-white dark:bg-darkbg-850 hover:bg-cream-100 text-black dark:text-white border-2 border-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-[2px_2px_0px_#000]"
          >
            <ArrowLeft className="w-4 h-4 text-black dark:text-white" />
            <span>Back to Front Page</span>
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="px-3 py-4 space-y-6 text-xs font-bold">
          <div>
            <div className="text-[10px] text-slate-500 uppercase px-3 mb-2 tracking-wider">
              MAIN
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`btn-brutal w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-cream-accent dark:bg-darkbg-800 text-black dark:text-cream-accent border-2 border-black shadow-[2px_2px_0px_#000] font-black'
                        : 'text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-cream-200 dark:hover:bg-darkbg-800 border-2 border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500 text-white border border-black text-[10px] font-black shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 uppercase px-3 mb-2 tracking-wider">
              MANAGEMENT & AI
            </div>
            <div className="space-y-1.5">
              <button
                onClick={onOpenChatbot}
                className="btn-brutal w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left cursor-pointer bg-cream-200 dark:bg-darkbg-800 text-black dark:text-cream-accent border-2 border-black shadow-[2px_2px_0px_#000] font-black"
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-amber-600 dark:text-cream-accent" />
                  <span>Campus Assistant</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </button>

              <button
                onClick={() => onTabChange('settings')}
                className={`btn-brutal w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-left cursor-pointer transition-all ${
                  currentTab === 'settings'
                    ? 'bg-cream-accent dark:bg-darkbg-800 text-black dark:text-cream-accent border-2 border-black font-black shadow-[2px_2px_0px_#000]'
                    : 'text-slate-700 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-cream-200 dark:hover:bg-darkbg-800 border-2 border-transparent'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Engine Status Card */}
      <div className="p-3 border-t-2 border-black/10 dark:border-darkbg-border space-y-2">
        <div className="p-3 bg-white dark:bg-darkbg-850 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-bold">
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span>AI ENGINE</span>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Operational
            </span>
          </div>
          <div className="text-[10px] text-black dark:text-slate-200 font-bold">All systems running</div>
          <div className="text-[9px] text-slate-500 font-mono">
            Pipeline: yolo-v8 + mediapipe
          </div>
        </div>

        <button
          onClick={onReturnToLanding}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-cream-200 dark:hover:bg-darkbg-800 text-[11px] font-bold cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Front Page</span>
        </button>
      </div>
    </aside>
  );
}
