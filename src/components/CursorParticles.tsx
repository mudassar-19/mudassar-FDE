import { useEffect, useRef } from "react";
import { prefersReducedEffects } from "../utils/motionPreference";

const PARTICLE_COUNT = 45;
const REPEL_RADIUS = 110;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

const CursorParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedEffects()) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.6 + 0.6,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    let rafId = requestAnimationFrame(function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(194, 164, 255, 0.55)";
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.x += (dx / dist) * force * 2.2;
          p.y += (dy / dist) * force * 2.2;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (prefersReducedEffects()) return null;

  return <canvas ref={canvasRef} className="cursor-particles" aria-hidden="true" />;
};

export default CursorParticles;
