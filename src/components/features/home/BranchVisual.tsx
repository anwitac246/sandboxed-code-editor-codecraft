'use client';
import { useEffect, useRef } from "react";

export function BranchVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const labels = ["Code", "Build", "Run", "Deploy"];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = canvas!.offsetWidth * dpr;
      canvas!.height = canvas!.offsetHeight * dpr;
      ctx!.scale(dpr, dpr);
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;

      ctx!.clearRect(0, 0, w, h);

      const originX = w / 2;
      const originY = h - 30;
      const numBranches = 4;
      const spread = w * 0.85;

      // Draw glowing dot at origin
      const gradient = ctx!.createRadialGradient(originX, originY, 0, originX, originY, 12);
      gradient.addColorStop(0, "hsl(199 89% 68% / 0.9)");
      gradient.addColorStop(1, "hsl(199 89% 68% / 0)");
      ctx!.fillStyle = gradient;
      ctx!.beginPath();
      ctx!.arc(originX, originY, 12, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = "hsl(199 89% 68%)";
      ctx!.beginPath();
      ctx!.arc(originX, originY, 4, 0, Math.PI * 2);
      ctx!.fill();

      // Vertical stem
      ctx!.strokeStyle = "hsl(199 89% 68% / 0.5)";
      ctx!.lineWidth = 1.5;
      ctx!.beginPath();
      ctx!.moveTo(originX, originY);
      ctx!.lineTo(originX, originY - 60);
      ctx!.stroke();

      // Draw branches
      for (let i = 0; i < numBranches; i++) {
        const t = i / (numBranches - 1);
        const targetX = (w - spread) / 2 + t * spread;
        const targetY = 40;

        const cp1x = originX;
        const cp1y = originY - 120 - Math.sin(time * 0.8 + i) * 8;
        const cp2x = targetX;
        const cp2y = targetY + 180 + Math.sin(time * 0.6 + i * 1.2) * 12;

        // Glow layer
        ctx!.strokeStyle = `hsl(199 89% 68% / ${0.06 + Math.sin(time + i) * 0.03})`;
        ctx!.lineWidth = 20;
        ctx!.beginPath();
        ctx!.moveTo(originX, originY - 60);
        ctx!.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY);
        ctx!.stroke();

        // Mid layer
        ctx!.strokeStyle = `hsl(199 89% 68% / ${0.15 + Math.sin(time * 1.2 + i) * 0.05})`;
        ctx!.lineWidth = 3;
        ctx!.beginPath();
        ctx!.moveTo(originX, originY - 60);
        ctx!.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY);
        ctx!.stroke();

        // Sharp line
        ctx!.strokeStyle = `hsl(199 89% 68% / ${0.4 + Math.sin(time * 1.5 + i * 0.8) * 0.15})`;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(originX, originY - 60);
        ctx!.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, targetY);
        ctx!.stroke();

        // Label pill
        const label = labels[i];
        ctx!.font = "500 13px Inter, system-ui, sans-serif";
        const textWidth = ctx!.measureText(label).width;
        const pillW = textWidth + 24;
        const pillH = 30;
        const pillX = targetX - pillW / 2;
        const pillY = targetY - pillH / 2;

        ctx!.strokeStyle = "hsl(199 89% 68% / 0.3)";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.roundRect(pillX, pillY, pillW, pillH, 15);
        ctx!.stroke();

        ctx!.fillStyle = "hsl(199 89% 68% / 0.85)";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(label, targetX, targetY + 1);
      }

      time += 0.015;
      animationId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="relative px-6 pb-8 md:pb-16">
      <div className="mx-auto max-w-5xl">
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: "420px" }}
        />
      </div>
    </section>
  );
}
