import React, { useEffect, useRef } from 'react';

export default function CanvasBubbles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Bioluminescent particles & rising microbubbles
    const particleCount = 45;
    const particles = [];

    const colors = [
      'rgba(0, 240, 255, 0.4)',  // Cyan
      'rgba(0, 255, 213, 0.35)', // Emerald/Teal
      'rgba(56, 189, 248, 0.25)', // Sky blue
      'rgba(168, 85, 247, 0.2)',  // Violet deep glow
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        glowRadius: Math.random() * 12 + 6,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time + p.pulseOffset) * 0.25;

        // Wrap around bottom if floated above top
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        // Mouse gentle repel
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        const currentGlow = p.glowRadius * (1 + 0.3 * Math.sin(time * 2 + p.pulseOffset));

        // Draw outer glow gradient
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentGlow);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentGlow, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw sharp bubble core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
