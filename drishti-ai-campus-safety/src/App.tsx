/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ShowcaseLanding } from './components/ShowcaseLanding';
import { DashboardView } from './components/DashboardView';
import { CampusChatbot } from './components/CampusChatbot';

export default function App() {
  const [view, setView] = useState<'landing' | 'console'>('landing');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [highlightedBuildingId, setHighlightedBuildingId] = useState<string | undefined>(undefined);

  // Sync dark class on html tag
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSelectBuildingFromBot = (buildingId: string) => {
    setHighlightedBuildingId(buildingId);
  };

  return (
    <div className="min-h-screen w-full relative">
      {view === 'landing' ? (
        <ShowcaseLanding
          onEnterConsole={() => {
            setView('console');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          highlightedBuildingId={highlightedBuildingId}
          onSelectBuilding={setHighlightedBuildingId}
          onOpenChatbot={() => setChatbotOpen(true)}
        />
      ) : (
        <DashboardView
          onReturnToLanding={() => {
            setView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isDark={isDark}
          onToggleTheme={toggleTheme}
          onOpenChatbot={() => setChatbotOpen(true)}
        />
      )}

      {/* Stable Bottom-Left Floating Theme Icon (No text label as requested) */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 z-40 btn-brutal p-3.5 rounded-2xl bg-cream-accent hover:bg-yellow-300 dark:bg-darkbg-850 dark:hover:bg-darkbg-800 text-black dark:text-cream-accent border-2 border-black shadow-[4px_4px_0px_#000] cursor-pointer transition-transform hover:scale-105 active:scale-95"
        title={isDark ? 'Switch to Yellow/Cream Mode' : 'Switch to Dark Mode'}
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-cream-accent stroke-[2.4]" />
        ) : (
          <Moon className="w-5 h-5 text-black stroke-[2.4]" />
        )}
      </button>

      {/* Global SSIPMT Campus Assistant Chatbot */}
      <CampusChatbot
        isOpen={chatbotOpen}
        onOpen={() => setChatbotOpen(true)}
        onClose={() => setChatbotOpen(false)}
        onSelectBuilding={handleSelectBuildingFromBot}
      />
    </div>
  );
}
