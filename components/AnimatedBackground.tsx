"use client";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient animate-gradient">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900" />
      </div>

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="orb-1" />
        <div className="orb-2" />
        <div className="orb-3" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
    </div>
  );
}
