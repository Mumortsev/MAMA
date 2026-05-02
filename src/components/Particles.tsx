"use client";

import { useEffect, useRef } from "react";

interface ParticlesProps {
  className?: string;
  variant?: "mist" | "deep";
}

export default function Particles({ className = "", variant = "mist" }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const isMobile = variant === "deep";
    const particleCount = isMobile ? 80 : 60;
    const baseColor = isMobile ? [156, 175, 136] : [212, 175, 55];

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;
      opacity: number;
      baseOpacity: number;
      phase: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const size = isMobile ? Math.random() * 100 + 50 : Math.random() * 80 + 30;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
        vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
        size: size,
        baseSize: size,
        opacity: isMobile ? 0.03 : Math.random() * 0.15 + 0.05,
        baseOpacity: isMobile ? 0.03 : Math.random() * 0.15 + 0.05,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let tiltX = 0;
    let tiltY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      tiltX = e.gamma || 0;
      tiltY = e.beta || 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (variant === "deep") {
        const gradient = ctx.createRadialGradient(
          width / 2 + tiltX * 2, height / 2 + (tiltY - 45) * 2, 0,
          width / 2, height / 2, Math.max(width, height)
        );
        gradient.addColorStop(0, "rgba(156, 175, 136, 0.1)");
        gradient.addColorStop(1, "rgba(156, 175, 136, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      particles.forEach((p) => {
        p.phase += 0.01;
        
        p.x += p.vx;
        p.y += p.vy;

        if (variant === "mist") {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.vx -= (dx / dist) * force * 0.03;
            p.vy -= (dy / dist) * force * 0.03;
          }
          p.opacity = p.baseOpacity * (0.8 + Math.sin(p.phase) * 0.2);
        } else {
          p.x += tiltX * 0.05;
          p.y += (tiltY - 45) * 0.05;
          p.opacity = p.baseOpacity;
        }

        p.vx *= 0.98;
        p.vy *= 0.98;

        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;

        if (p.x < -p.size) p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = height + p.size;
        if (p.y > height + p.size) p.y = -p.size;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${p.opacity})`);
        gradient.addColorStop(1, `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
      window.removeEventListener("resize", handleResize);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className={className} />;
}