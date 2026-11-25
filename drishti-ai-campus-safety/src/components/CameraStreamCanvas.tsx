import { useEffect, useRef } from 'react';
import { CameraFeed } from '../types';

interface CameraStreamCanvasProps {
  camera: CameraFeed;
  showSkeleton?: boolean;
  isNightVision?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CameraStreamCanvas({
  camera,
  showSkeleton = false,
  isNightVision = false,
  className = "w-full h-full",
  onClick
}: CameraStreamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    // Simulated people agents inside this camera viewport
    const agents = [
      { x: 30, y: 40, speedX: 0.6, speedY: 0.3, label: "PERSON #1", conf: 98.4, isFall: camera.riskLevel === 'Critical' && camera.id === 'CAM-007' },
      { x: 120, y: 70, speedX: -0.4, speedY: 0.2, label: "PERSON #2", conf: 96.1, isFall: false },
      { x: 190, y: 50, speedX: 0.5, speedY: -0.3, label: "PERSON #3", conf: 94.7, isFall: false },
    ];

    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Base background color
      if (isNightVision) {
        ctx.fillStyle = '#06180c'; // Night vision green
      } else if (camera.status === 'alert') {
        ctx.fillStyle = '#100a12'; // Subtle alert dark hue
      } else {
        ctx.fillStyle = '#0a101d'; // Navy surveillance dark
      }
      ctx.fillRect(0, 0, w, h);

      // Perspective floor grid lines
      ctx.strokeStyle = isNightVision ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;

      // Horizon line
      const horizonY = h * 0.45;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(w, horizonY);
      ctx.stroke();

      // Perspective lines converging
      const vanishingX = w * 0.5;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(vanishingX + i * 25, horizonY);
        ctx.lineTo(w * 0.5 + i * (w * 0.25), h);
        ctx.stroke();
      }

      // Horizontal floor depth lines
      for (let y = horizonY + 15; y < h; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Render Agents with YOLO Bounding Boxes
      agents.forEach((agent, idx) => {
        // Move agent
        agent.x += agent.speedX;
        agent.y += agent.speedY;

        // Bounce inside camera view
        if (agent.x < 15 || agent.x > w - 45) agent.speedX *= -1;
        if (agent.y < horizonY - 10 || agent.y > h - 60) agent.speedY *= -1;

        const boxW = agent.isFall ? 60 : 34;
        const boxH = agent.isFall ? 24 : 58;

        // Determine color
        let boxColor = '#10B981'; // Green
        if (agent.isFall) {
          boxColor = '#EF4444'; // Red
        } else if (camera.riskLevel === 'Critical') {
          boxColor = '#EF4444';
        } else if (camera.riskLevel === 'Moderate') {
          boxColor = '#F59E0B';
        }

        if (isNightVision) {
          boxColor = '#22C55E';
        }

        // Bounding Box stroke
        ctx.strokeStyle = boxColor;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(agent.x, agent.y, boxW, boxH);

        // Corner accents
        const cLen = 5;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(agent.x, agent.y + cLen);
        ctx.lineTo(agent.x, agent.y);
        ctx.lineTo(agent.x + cLen, agent.y);
        ctx.stroke();

        // Label Tag
        ctx.fillStyle = boxColor;
        ctx.fillRect(agent.x, agent.y - 14, boxW, 14);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 8px monospace';
        const tagText = agent.isFall ? 'FALL 94%' : `${agent.label.slice(0, 8)} ${agent.conf.toFixed(0)}%`;
        ctx.fillText(tagText, agent.x + 2, agent.y - 3);

        // Skeleton Pose (MediaPipe style wireframe)
        if (showSkeleton) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.2;
          const headX = agent.x + boxW / 2;
          const headY = agent.isFall ? agent.y + boxH * 0.5 : agent.y + boxH * 0.2;
          // Head
          ctx.beginPath();
          ctx.arc(headX, headY, 4, 0, Math.PI * 2);
          ctx.stroke();

          // Spine & Limbs
          if (!agent.isFall) {
            ctx.beginPath();
            ctx.moveTo(headX, headY + 4);
            ctx.lineTo(headX, agent.y + boxH * 0.65); // spine
            ctx.lineTo(headX - 8, agent.y + boxH); // left leg
            ctx.moveTo(headX, agent.y + boxH * 0.65);
            ctx.lineTo(headX + 8, agent.y + boxH); // right leg
            ctx.moveTo(headX - 10, agent.y + boxH * 0.35);
            ctx.lineTo(headX + 10, agent.y + boxH * 0.35); // arms
            ctx.stroke();
          } else {
            // Horizontal fallen posture
            ctx.beginPath();
            ctx.moveTo(headX - 12, headY);
            ctx.lineTo(headX + 18, headY);
            ctx.stroke();
          }
        }
      });

      // Subtle Scanline Effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      for (let sy = 0; sy < h; sy += 4) {
        ctx.fillRect(0, sy, w, 1.5);
      }

      // Moving Radar Scanline Bar
      const scanY = (frame * 1.8) % h;
      const grad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 15, w, 30);

      // CCTV On-Screen Display (OSD)
      // Top Left: REC dot + Camera ID
      const isBlink = Math.floor(frame / 20) % 2 === 0;
      if (isBlink) {
        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.arc(10, 12, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`REC  ${camera.id} [${camera.zone.toUpperCase()}]`, 18, 15);

      // Top Right: Live FPS & AI Status
      ctx.fillStyle = camera.riskLevel === 'Critical' ? '#EF4444' : '#10B981';
      ctx.fillText(`${camera.fps} FPS · ${camera.aiMode.slice(0, 16)}`, w - 140, 15);

      // Bottom Left: Timestamp
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '8px monospace';
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      ctx.fillText(`2026-11-01 ${timeStr} · CONF: ${camera.confidence}%`, 10, h - 8);

      // Bottom Right: People Counter
      ctx.fillStyle = '#FACC15';
      ctx.fillText(`COUNT: ${camera.peopleCount.toString().padStart(2, '0')}`, w - 60, h - 8);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [camera, showSkeleton, isNightVision]);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-slate-950 rounded-xl select-none ${onClick ? 'cursor-pointer' : ''}`}
    >
      <canvas
        ref={canvasRef}
        width={320}
        height={180}
        className={className}
      />
    </div>
  );
}
