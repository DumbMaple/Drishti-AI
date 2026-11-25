import { useEffect, useRef, useState } from 'react';
import { TrendingUp, PieChart, BarChart3, Activity } from 'lucide-react';

export function RiskAnalyticsCharts() {
  const [trendRange, setTrendRange] = useState<'7days' | '24hours'>('7days');
  const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const densityCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Line Chart: Incident Trend Analysis
  useEffect(() => {
    const canvas = lineCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let y = 30; y < h - 25; y += 35) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(w - 20, y);
      ctx.stroke();
    }

    // Series 1: Fall Detections (Blue line)
    const pointsFall = [12, 18, 9, 22, 14, 28, 16];
    // Series 2: Crowd Alerts (Yellow/Amber line)
    const pointsCrowd = [24, 32, 28, 45, 38, 40, 52];

    const maxVal = 60;
    const plotH = h - 60;

    const drawLine = (data: number[], strokeStyle: string, fillGrad: boolean) => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 3;
      ctx.beginPath();

      const step = (w - 70) / (data.length - 1);
      data.forEach((val, i) => {
        const x = 45 + i * step;
        const y = h - 30 - (val / maxVal) * plotH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      if (fillGrad) {
        ctx.lineTo(45 + (data.length - 1) * step, h - 30);
        ctx.lineTo(45, h - 30);
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, 30, 0, h - 30);
        grad.addColorStop(0, strokeStyle.replace('rgb', 'rgba').replace(')', ', 0.25)'));
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw point markers
      data.forEach((val, i) => {
        const x = 45 + i * step;
        const y = h - 30 - (val / maxVal) * plotH;
        ctx.fillStyle = strokeStyle;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0B1120';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    drawLine(pointsCrowd, 'rgb(245, 158, 11)', true);
    drawLine(pointsFall, 'rgb(56, 189, 248)', false);

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px monospace';
    const labels = trendRange === '7days' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];
    labels.forEach((lbl, i) => {
      const step = (w - 70) / (labels.length - 1);
      ctx.fillText(lbl, 35 + i * step, h - 10);
    });
  }, [trendRange]);

  // 2. Donut Chart: Alert Distribution
  useEffect(() => {
    const canvas = donutCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(centerX, centerY) - 25;
    const innerRadius = radius * 0.62;

    const segments = [
      { label: 'Crowd Surge', pct: 0.42, color: '#F59E0B' },
      { label: 'Unauthorized', pct: 0.28, color: '#38BDF8' },
      { label: 'Fall Alert', pct: 0.18, color: '#EF4444' },
      { label: 'Loitering', pct: 0.12, color: '#10B981' },
    ];

    let startAngle = -Math.PI / 2;
    segments.forEach((seg) => {
      const sliceAngle = seg.pct * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Border line between segments
      ctx.strokeStyle = '#0B1120';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      startAngle += sliceAngle;
    });

    // Center total text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('128', centerX, centerY + 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px monospace';
    ctx.fillText('TOTAL ALERTS', centerX, centerY + 18);
  }, []);

  // 3. Spline Area: Campus Crowd Density
  useEffect(() => {
    const canvas = densityCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Hours 8 AM - 10 PM density curve
    const densities = [15, 25, 45, 85, 92, 60, 48, 75, 88, 95, 62, 35, 18];
    const max = 100;

    const step = (w - 60) / (densities.length - 1);
    ctx.beginPath();
    ctx.moveTo(35, h - 25);

    densities.forEach((val, i) => {
      const x = 35 + i * step;
      const y = h - 25 - (val / max) * (h - 50);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.lineTo(35 + (densities.length - 1) * step, h - 25);
    ctx.lineTo(35, h - 25);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 20, 0, h - 25);
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    grad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

    // Peak threshold dashed line
    ctx.strokeStyle = '#EF4444';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(35, h - 25 - (80 / max) * (h - 50));
    ctx.lineTo(w - 20, h - 25 - (80 / max) * (h - 50));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#EF4444';
    ctx.font = '9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('CRITICAL SURGE LIMIT', w - 25, h - 25 - (80 / max) * (h - 50) - 5);
  }, []);

  // 4. Bar Chart: Building Risk Comparison
  useEffect(() => {
    const canvas = barCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const bars = [
      { label: 'Main Gate', val: 42, color: '#10B981' },
      { label: 'Library', val: 12, color: '#10B981' },
      { label: 'Parking', val: 86, color: '#EF4444' },
      { label: 'Hostel A', val: 78, color: '#EF4444' },
      { label: 'Hostel B', val: 24, color: '#10B981' },
      { label: 'Academic', val: 52, color: '#F59E0B' },
      { label: 'Admin', val: 21, color: '#10B981' },
      { label: 'Exam Cell', val: 85, color: '#EF4444' },
    ];

    const plotH = h - 50;
    const barW = (w - 60) / bars.length - 12;

    bars.forEach((b, i) => {
      const x = 35 + i * (barW + 12);
      const barHeight = (b.val / 100) * plotH;
      const y = h - 30 - barHeight;

      // Bar
      ctx.fillStyle = b.color;
      ctx.fillRect(x, y, barW, barHeight);

      // Value label on top
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.val.toString(), x + barW / 2, y - 4);

      // Building label below
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '8px monospace';
      ctx.fillText(b.label.slice(0, 7), x + barW / 2, h - 14);
    });
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-amber-600 dark:text-cream-accent font-black uppercase tracking-wider">
            SECURITY ANALYTICS & INTELLIGENCE
          </span>
          <h3 className="text-2xl font-black text-black dark:text-white">
            Historical Incident & Risk Profiling
          </h3>
        </div>

        {/* Range switcher */}
        <div className="flex items-center gap-1.5 bg-cream-200 dark:bg-darkbg-800 p-1.5 rounded-2xl border-2 border-black text-xs font-black">
          <button
            onClick={() => setTrendRange('7days')}
            className={`btn-brutal px-3.5 py-1.5 rounded-xl border-2 border-black cursor-pointer transition-colors shadow-sm ${
              trendRange === '7days' ? 'bg-cream-accent text-black' : 'bg-transparent text-slate-700 dark:text-slate-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTrendRange('24hours')}
            className={`btn-brutal px-3.5 py-1.5 rounded-xl border-2 border-black cursor-pointer transition-colors shadow-sm ${
              trendRange === '24hours' ? 'bg-cream-accent text-black' : 'bg-transparent text-slate-700 dark:text-slate-300'
            }`}
          >
            24 Hours
          </button>
        </div>
      </div>

      {/* 2x2 Big Spacious Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Incident Trend Analysis */}
        <div className="lg:col-span-8 bg-white dark:bg-darkbg-850 border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="text-base font-black text-black dark:text-white">Incident Trend Analysis</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily incident frequency breakdown</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-black">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-cream-accent">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Crowd Alerts
              </span>
              <span className="flex items-center gap-1.5 text-red-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span> Fall Incidents
              </span>
            </div>
          </div>
          <div className="h-64 w-full bg-slate-950 rounded-2xl p-2 border-2 border-black">
            <canvas ref={lineCanvasRef} width={700} height={256} className="w-full h-full" />
          </div>
        </div>

        {/* Chart 2: Alert Distribution Donut */}
        <div className="lg:col-span-4 bg-white dark:bg-darkbg-850 border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex items-center gap-3">
            <PieChart className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="text-base font-black text-black dark:text-white">Alert Distribution</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Classification by category</p>
            </div>
          </div>
          <div className="h-48 w-full flex items-center justify-center bg-slate-950 rounded-2xl p-2 border-2 border-black">
            <canvas ref={donutCanvasRef} width={260} height={190} className="w-auto h-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-black/15 font-bold">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded bg-amber-400"></span>
              <span>Crowd: 42%</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded bg-sky-400"></span>
              <span>Perimeter: 28%</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded bg-red-400"></span>
              <span>Falls: 18%</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded bg-emerald-400"></span>
              <span>Loitering: 12%</span>
            </div>
          </div>
        </div>

        {/* Chart 3: Campus Crowd Density */}
        <div className="lg:col-span-6 bg-white dark:bg-darkbg-850 border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-500" />
              <div>
                <h4 className="text-base font-black text-black dark:text-white">Campus Crowd Density</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Estimated people monitored throughout the day</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border-2 border-emerald-500 text-xs font-black">
              ● LIVE TREND
            </span>
          </div>
          <div className="h-56 w-full bg-slate-950 rounded-2xl p-2 border-2 border-black">
            <canvas ref={densityCanvasRef} width={500} height={224} className="w-full h-full" />
          </div>
        </div>

        {/* Chart 4: Building Risk Comparison */}
        <div className="lg:col-span-6 bg-white dark:bg-darkbg-850 border-3 border-black p-6 rounded-3xl shadow-[6px_6px_0px_#000] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-red-500" />
              <div>
                <h4 className="text-base font-black text-black dark:text-white">Building Risk Comparison</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI-evaluated risk score by sector</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-cream-200 dark:bg-darkbg-800 text-black dark:text-white border-2 border-black text-xs font-black">
              RISK INDEX
            </span>
          </div>
          <div className="h-56 w-full bg-slate-950 rounded-2xl p-2 border-2 border-black">
            <canvas ref={barCanvasRef} width={500} height={224} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
