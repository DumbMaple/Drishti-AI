import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_ZONES } from '../../data/mockData';
import { ZoneRisk } from '../../types';

interface SchematicCampusMapProps {
  onSelectZone?: (zoneName: string) => void;
}

export function SchematicCampusMap({ onSelectZone }: SchematicCampusMapProps) {
  const [selectedZone, setSelectedZone] = useState<ZoneRisk>(INITIAL_ZONES[2]); // Default Parking Area

  // Exact topography zones matching hand-drawn blueprint (image_b68541e7.png)
  const ssipmtZones = [
    // Top Row (North / Back Road Sector)
    { id: 'medical', name: 'Medical Room', sector: 'Back Road', status: 'Safe', risk: 8, cams: 2, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'canteen', name: 'Canteen & Cafeteria', sector: 'North Corridor', status: 'Moderate', risk: 48, cams: 4, alerts: 1, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'girls_hostel', name: 'Girls Hostel', sector: 'North-East Flank', status: 'Safe', risk: 14, cams: 5, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'back_road', name: 'Back Road Patrol', sector: 'Perimeter Lane', status: 'Safe', risk: 18, cams: 3, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },

    // Middle Row (Core Linear Academic Row - Left to Right)
    { id: 'temple', name: 'Campus Temple', sector: 'Far West Lawn', status: 'Safe', risk: 10, cams: 2, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'basketball_court', name: 'Basketball Court', sector: 'Sports Arena', status: 'Safe', risk: 22, cams: 3, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'boys_hostel', name: 'Boys Hostel', sector: 'Residential West', status: 'Safe', risk: 34, cams: 6, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'management_block', name: 'Management Block', sector: 'MBA Dept', status: 'Safe', risk: 28, cams: 4, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'admin', name: 'Admin Block', sector: 'HQ Core', status: 'Safe', risk: 24, cams: 8, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'academic_block', name: 'Academic Block', sector: 'Engineering Wing', status: 'Moderate', risk: 52, cams: 8, alerts: 2, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'parking', name: 'Parking & Main Road', sector: 'Transit Corridor', status: 'Critical', risk: 86, cams: 5, alerts: 6, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },
    { id: 'new_building', name: 'New Building (IDEA Lab)', sector: 'East Extension', status: 'Safe', risk: 16, cams: 6, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-3' },

    // Bottom Row (South Entrance & Arterial Highway)
    { id: 'main_gate', name: 'Main Gate Checkpoint', sector: 'West Entrance', status: 'Safe', risk: 38, cams: 4, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-4' },
    { id: 'front_road', name: 'Front Road (Divider)', sector: 'South Boundary', status: 'Safe', risk: 20, cams: 4, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-4' },
    { id: 'planet_city', name: 'Way to Planet City', sector: 'South Branch Road', status: 'Safe', risk: 12, cams: 2, alerts: 0, col: 'col-span-12 sm:col-span-6 lg:col-span-4' },
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Top Section with Title and Legend */}
      <div className="bg-white dark:bg-darkbg-850 border-2 sm:border-3 border-black p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-[5px_5px_0px_#000] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cream-accent border border-black animate-pulse"></span>
              <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white leading-tight">
                SSIPMT Campus — Spatial Security Schematic
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Accurate topological layout matching the SSIPMT Raipur masterplan
            </p>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs font-black">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate
            </span>
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical
            </span>
          </div>
        </div>

        {/* Schematic Grid of Campus Blocks */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 pt-2">
          {ssipmtZones.map((z, idx) => {
            const isCritical = z.status === 'Critical';
            const isModerate = z.status === 'Moderate';
            const isSelected = selectedZone.name.toLowerCase().includes(z.name.toLowerCase().split(' ')[0]);

            let borderStyle = 'border-black/30 dark:border-white/10 hover:border-black';
            let badgeBg = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
            let cardBg = 'bg-white dark:bg-darkbg-800';

            if (isCritical) {
              borderStyle = 'border-red-500 bg-red-50 dark:bg-red-950/20';
              badgeBg = 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40';
              cardBg = 'bg-red-50/50 dark:bg-red-950/20';
            } else if (isModerate) {
              borderStyle = 'border-amber-500 bg-amber-50 dark:bg-amber-950/20';
              badgeBg = 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/40';
              cardBg = 'bg-amber-50/50 dark:bg-amber-950/20';
            }

            if (isSelected) {
              borderStyle += ' ring-2 ring-black dark:ring-cream-accent';
            }

            return (
              <div
                key={idx}
                onClick={() => {
                  const match = INITIAL_ZONES.find((iz) =>
                    iz.name.toLowerCase().includes(z.name.toLowerCase().split(' ')[0])
                  );
                  if (match) setSelectedZone(match);
                  if (onSelectZone) onSelectZone(z.name);
                }}
                className={`${z.col} ${borderStyle} ${cardBg} border-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 select-none space-y-2.5 relative overflow-hidden shadow-[2px_2px_0px_#000]`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block truncate">
                      {z.sector}
                    </span>
                    <span className="text-sm font-black text-black dark:text-white truncate block">
                      {z.name}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black border shrink-0 ${badgeBg}`}>
                    {z.status.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <div className="text-slate-500 dark:text-slate-400 font-bold">
                    <span className="text-base font-black text-black dark:text-white tabular-nums">{z.cams}</span> Cams
                  </div>
                  {z.alerts > 0 ? (
                    <span className="text-[11px] font-bold text-red-500 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {z.alerts} Alerts
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Normal
                    </span>
                  )}
                </div>

                {/* Risk Meter */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCritical ? 'bg-red-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${z.risk}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
