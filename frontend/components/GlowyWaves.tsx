"use client";

import React, { useEffect, useRef } from "react";

export default function GlowyWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Store mouse/touch positions
    const mousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const targetMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    // Constants for responsiveness and motion
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const waveAmplitude = isReducedMotion ? 10 : 70;
    const repelRadius = isReducedMotion ? 160 : 320;
    const lerpFactor = isReducedMotion ? 0.04 : 0.1;

    // Theme colors: Deep background with glowing waves
    const bgGradientTop = "#0c1018";
    const bgGradientBottom = "#060709";
    const wavePalette = [
      {
        frequency: 0.005,
        amplitude: waveAmplitude * 0.5,
        offset: 0,
        color: "rgba(90, 209, 255, 0.4)", // Cyan
        opacity: 0.6,
      },
      {
        frequency: 0.007,
        amplitude: waveAmplitude * 0.7,
        offset: 2,
        color: "rgba(150, 120, 255, 0.3)", // Purple
        opacity: 0.5,
      },
      {
        frequency: 0.006,
        amplitude: waveAmplitude * 0.6,
        offset: 1,
        color: "rgba(90, 209, 255, 0.2)",
        opacity: 0.3,
      },
      {
        frequency: 0.009,
        amplitude: waveAmplitude * 0.8,
        offset: 3,
        color: "rgba(150, 120, 255, 0.15)",
        opacity: 0.2,
      }
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const recenterMouse = () => {
      const center = { x: canvas.width / 2, y: canvas.height / 2 };
      mousePos.x = center.x;
      mousePos.y = center.y;
      targetMousePos.x = center.x;
      targetMousePos.y = center.y;
    };

    const handleResize = () => {
      resizeCanvas();
      recenterMouse();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMousePos.x = e.clientX;
      targetMousePos.y = e.clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetMousePos.x = e.touches[0].clientX;
        targetMousePos.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      recenterMouse();
    };

    resizeCanvas();
    recenterMouse();

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchend", handleMouseLeave);

    const drawWave = (wave: typeof wavePalette[0]) => {
      ctx.save();
      ctx.beginPath();
      
      for (let x = 0; x <= canvas.width; x += 4) {
        // Calculate distance from current point to mouse
        const dx = x - mousePos.x;
        const dy = (canvas.height / 2) - mousePos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Repel effect based on mouse distance
        const repelIntensity = Math.max(0, 1 - distance / repelRadius) * waveAmplitude * Math.sin(time * 0.001 + x * 0.01 + wave.offset);
        
        // Calculate wave height (Y position)
        const y = 
          canvas.height / 2 + 
          Math.sin(x * wave.frequency + time * 0.002 + wave.offset) * wave.amplitude +
          Math.sin(x * wave.frequency * 0.4 + time * 0.003) * (wave.amplitude * 0.45) +
          repelIntensity;
          
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = wave.color;
      ctx.globalAlpha = wave.opacity;
      
      // The Luminous glow
      ctx.shadowBlur = 35;
      ctx.shadowColor = wave.color;
      
      ctx.stroke();
      ctx.restore();
    };

    const animate = () => {
      time += 1;
      
      // Smoothly interpolate mouse position
      mousePos.x += (targetMousePos.x - mousePos.x) * lerpFactor;
      mousePos.y += (targetMousePos.y - mousePos.y) * lerpFactor;
      
      // Draw background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, bgGradientTop);
      gradient.addColorStop(1, bgGradientBottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Reset alpha and shadow for background, then draw waves
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      
      wavePalette.forEach(drawWave);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchend", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-hidden="true"
      />
      
      {/* Subtle ambient overlays to blend the edges of the canvas */}
      <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/[0.02] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] rounded-full bg-[#5ad1ff]/[0.015] blur-[150px] pointer-events-none" />
    </div>
  );
}
