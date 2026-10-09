'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Coins, Shield, PieChart, Sparkles } from 'lucide-react';

export function FloatingBackgroundAssets() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -80]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -140]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -60]);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      {/* 3D Glassmorphism Coin/Sphere (Top Right) */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-28 right-8 sm:right-24 flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent p-3 shadow-2xl backdrop-blur-2xl opacity-60 animate-float-slow"
      >
        <Coins className="h-7 w-7 text-emerald-400/80" />
      </motion.div>

      {/* 3D Glassmorphism Security Shield (Middle Left) */}
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[680px] -left-6 sm:left-12 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-tr from-sky-500/20 via-blue-500/10 to-transparent p-4 shadow-2xl backdrop-blur-2xl opacity-50 animate-float-reverse"
      >
        <Shield className="h-8 w-8 text-sky-400/80" />
      </motion.div>

      {/* 3D Glassmorphism Analytic Pie Chart (Bottom Right) */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[1250px] right-6 sm:right-20 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-tr from-amber-500/20 via-rose-500/10 to-transparent p-3 shadow-2xl backdrop-blur-2xl opacity-50 animate-float-slow"
      >
        <PieChart className="h-7 w-7 text-amber-400/80" />
      </motion.div>
    </div>
  );
}
