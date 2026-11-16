import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
  maxLife: number;
}

/**
 * Minimalist luminous spark animation. A small orange ember travels forward
 * along a gentle path, leaving a soft warm trail that fades into the background.
 * Lightweight canvas rendering, seamlessly loopable, responsive to container size.
 */
export function SparkTrail({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const particles: Particle[] = [];
    const trail: TrailPoint[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Spark path: travels left-to-right with a gentle vertical drift, looping.
    const cycleMs = 5200;
    const start = performance.now();

    const samplePath = (t: number) => {
      // t in [0,1)
      const x = -40 + (width + 80) * t;
      // Soft sine drift scaled to container height
      const y = height * 0.5 + Math.sin(t * Math.PI * 2.2) * height * 0.16;
      return { x, y };
    };

    let lastEmit = 0;

    const render = (now: number) => {
      const elapsed = now - start;
      const t = (elapsed % cycleMs) / cycleMs;

      // Fade previous frame for a soft, persistent trail that decays smoothly.
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(255, 250, 242, 0.16)';
      ctx.fillRect(0, 0, width, height);

      const pos = samplePath(t);

      // Emit trail points along the spark's path
      if (now - lastEmit > 16) {
        trail.push({ x: pos.x, y: pos.y, life: 1, maxLife: 1 });
        // A few stray warm particles for elegance
        const count = 2;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: pos.x,
            y: pos.y,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35 - 0.05,
            life: 1,
            maxLife: 1,
            size: 0.6 + Math.random() * 1.2,
            hue: 18 + Math.random() * 14,
          });
        }
        lastEmit = now;
      }

      // Draw soft trail line with additive blending for a warm bloom
      ctx.globalCompositeOperation = 'lighter';
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= 0.012;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        const alpha = p.life * 0.5;
        const radius = 1.5 + (1 - p.life) * 6;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 2);
        grad.addColorStop(0, `rgba(255, 180, 120, ${alpha})`);
        grad.addColorStop(0.4, `rgba(231, 108, 47, ${alpha * 0.5})`);
        grad.addColorStop(1, 'rgba(231, 108, 47, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw floating particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.002;
        p.life -= 0.018;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        const alpha = p.life * 0.45;
        const r = p.size * (0.6 + p.life * 0.8);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        grad.addColorStop(0, `hsla(${p.hue}, 95%, 68%, ${alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 95%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw the spark head: a tight luminous core with a soft bloom halo
      const headGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 26);
      headGrad.addColorStop(0, 'rgba(255, 240, 210, 0.95)');
      headGrad.addColorStop(0.25, 'rgba(247, 101, 34, 0.65)');
      headGrad.addColorStop(0.6, 'rgba(231, 108, 47, 0.18)');
      headGrad.addColorStop(1, 'rgba(231, 108, 47, 0)');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 26, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = 'rgba(255, 248, 230, 0.95)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2.1, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
