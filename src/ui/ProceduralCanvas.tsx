import React, { useEffect, useRef } from 'react';
import { WorldModule } from '../types';

interface ProceduralCanvasProps {
  world: WorldModule;
  className?: string;
}

export const ProceduralCanvas: React.FC<ProceduralCanvasProps> = ({ world, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system customized per world
    const isVaelen = world.id === 'vaelen';
    const isVespera = world.id === 'vespera';

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (isVespera ? 0.3 : 0.6),
      vy: isVaelen ? -0.4 - Math.random() * 0.5 : (Math.random() - 0.5) * 0.4,
      size: Math.random() * (isVaelen ? 3 : 2.5) + 1,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Dynamic World Gradients
      if (isVaelen) {
        // Deep gothic ocean chiaroscuro
        const bgGrad = ctx.createRadialGradient(
          width * 0.5,
          height * 0.6,
          50,
          width * 0.5,
          height * 0.5,
          width * 0.8
        );
        bgGrad.addColorStop(0, '#0d1527');
        bgGrad.addColorStop(0.5, '#070b14');
        bgGrad.addColorStop(1, '#030508');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Water caustic / brine wave effect
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          const yOffset = height * (0.65 + i * 0.08);
          for (let x = 0; x <= width; x += 40) {
            const wave = Math.sin(x * 0.005 + t + i) * 20 + Math.cos(x * 0.003 - t * 0.5) * 15;
            if (x === 0) ctx.moveTo(x, yOffset + wave);
            else ctx.lineTo(x, yOffset + wave);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (isVespera) {
        // Victorian gaslight & rain soot
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#090706');
        bgGrad.addColorStop(0.4, '#15100c');
        bgGrad.addColorStop(0.8, '#1f150d');
        bgGrad.addColorStop(1, '#0a0705');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Amber gaslight lanterns glow
        const glow = ctx.createRadialGradient(
          width * 0.75,
          height * 0.35,
          20,
          width * 0.75,
          height * 0.35,
          width * 0.45
        );
        glow.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
        glow.addColorStop(0.5, 'rgba(217, 119, 6, 0.06)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);

        // Faint rotating gear silhouette in background
        ctx.save();
        ctx.translate(width * 0.85, height * 0.25);
        ctx.rotate(t * 0.1);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.arc(0, 0, 160, 0, Math.PI * 2);
        ctx.stroke();
        for (let g = 0; g < 12; g++) {
          ctx.save();
          ctx.rotate((g * Math.PI) / 6);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.04)';
          ctx.fillRect(150, -10, 25, 20);
          ctx.restore();
        }
        ctx.restore();
      } else {
        // Astral myth: nebula & floating cosmos
        const bgGrad = ctx.createRadialGradient(
          width * 0.4,
          height * 0.4,
          50,
          width * 0.5,
          height * 0.5,
          width * 0.9
        );
        bgGrad.addColorStop(0, '#131138');
        bgGrad.addColorStop(0.5, '#0b0922');
        bgGrad.addColorStop(1, '#04030d');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Luminous cyan nebula streak
        const nebula = ctx.createRadialGradient(
          width * 0.35,
          height * 0.45,
          40,
          width * 0.35,
          height * 0.45,
          width * 0.5
        );
        nebula.addColorStop(0, 'rgba(129, 140, 248, 0.15)');
        nebula.addColorStop(0.5, 'rgba(56, 189, 248, 0.07)');
        nebula.addColorStop(1, 'transparent');
        ctx.fillStyle = nebula;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Animated floating motes / stars
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        if (isVaelen) {
          ctx.fillStyle = `rgba(56, 189, 248, ${currentAlpha})`;
        } else if (isVespera) {
          ctx.fillStyle = `rgba(253, 230, 138, ${currentAlpha})`;
        } else {
          ctx.fillStyle = `rgba(224, 231, 255, ${currentAlpha})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [world.id]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
};
