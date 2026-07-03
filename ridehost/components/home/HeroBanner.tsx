"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────
   Floating dust particles
───────────────────────────────────────────── */
const DUST = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: 35 + Math.random() * 60,       // right side only
  y: 10 + Math.random() * 80,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 8,
  dur: 6 + Math.random() * 8,
  opacity: 0.08 + Math.random() * 0.22,
}));

/* ─────────────────────────────────────────────
   Number-plate SVG overlay
───────────────────────────────────────────── */
function NumberPlate() {
  return (
    <svg
      viewBox="0 0 160 38"
      className="absolute"
      style={{
        width: "11%",
        bottom: "24.5%",
        left: "37%",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.7))",
        zIndex: 6,
      }}
    >
      <rect x="1" y="1" width="158" height="36" rx="5" fill="#F5F0D0" stroke="#B8A800" strokeWidth="1.5" />
      <rect x="4" y="4" width="20" height="30" rx="3" fill="#003399" />
      <text x="13" y="13" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">🇮🇳</text>
      <text x="13" y="30" textAnchor="middle" fill="#FFD700" fontSize="6" fontWeight="bold" fontFamily="Arial">IND</text>
      <text x="96" y="26" textAnchor="middle" fill="#111" fontSize="18" fontWeight="900"
        fontFamily="'Arial Black', Arial, sans-serif" letterSpacing="3">
        DOOR CAR
      </text>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Sun glow burst
───────────────────────────────────────────── */
function SunGlow() {
  return (
    <div className="absolute pointer-events-none" style={{ top: "8%", right: "5%", zIndex: 3 }}>
      {/* Core */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="rounded-full"
        style={{ width: 70, height: 70, background: "radial-gradient(circle, #FFE566 0%, #FF8C00 40%, transparent 70%)", filter: "blur(2px)" }}
      />
      {/* Halo */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute inset-0 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,200,60,0.4) 0%, transparent 70%)", transform: "scale(2.5)", filter: "blur(12px)" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Cinematic light rays
───────────────────────────────────────────── */
function LightRays() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {[
        { rotate: -28, right: "8%", opacity: 0.13, w: 3, h: "55%", delay: 0 },
        { rotate: -20, right: "12%", opacity: 0.09, w: 5, h: "60%", delay: 1.5 },
        { rotate: -35, right: "3%", opacity: 0.07, w: 2, h: "45%", delay: 0.8 },
      ].map((ray, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [ray.opacity * 0.5, ray.opacity, ray.opacity * 0.5] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: ray.delay }}
          className="absolute top-0"
          style={{
            right: ray.right,
            width: ray.w,
            height: ray.h,
            background: "linear-gradient(to bottom, rgba(255,200,80,0.8), transparent)",
            transform: `rotate(${ray.rotate}deg)`,
            transformOrigin: "top center",
            filter: "blur(6px)",
          }}
        />
      ))}
      {/* Wide warm wash from right */}
      <div className="absolute top-0 right-0 h-full"
        style={{ width: "55%", background: "linear-gradient(to left, rgba(255,130,0,0.07) 0%, transparent 60%)", pointerEvents: "none" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero
───────────────────────────────────────────── */
export function HeroBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);
  const carY = useTransform(scrollY, [0, 600], [0, 40]);
  const textY = useTransform(scrollY, [0, 600], [0, -28]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: "95vh", background: "#0d0b08" }}
    >
      {/* ══ BACKGROUND LAYERS ══════════════════════════ */}

      {/* Layer 1 — Coastal highway panorama */}
      <motion.div className="absolute inset-0" style={{ y: bgY, zIndex: 1 }}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=88&fm=webp"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.52) saturate(1.1) sepia(0.18)" }}
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Layer 2 — Golden-hour atmospheric colour grade */}
      <div className="absolute inset-0" style={{ zIndex: 2,
        background: "linear-gradient(160deg, rgba(10,6,2,0.55) 0%, rgba(30,12,0,0.35) 40%, rgba(180,80,0,0.12) 75%, transparent 100%)"
      }} />

      {/* ══ SUN & LIGHT ════════════════════════════════ */}
      <SunGlow />
      <LightRays />

      {/* ══ CAR — RIGHT SIDE ═══════════════════════════ */}
      <motion.div
        className="absolute bottom-0 right-0"
        style={{ y: carY, zIndex: 5, width: "58%", maxWidth: 900 }}
      >
        {/* Defender image — front-right 3/4 view */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <img
            src="https://images.unsplash.com/photo-1617814076229-3a6e24e14f3e?w=1400&q=90&fm=webp"
            alt="Black Land Rover Defender — DOOR CAR"
            className="w-full h-auto object-contain object-bottom"
            style={{
              filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(255,120,0,0.18))",
              maxHeight: "80vh",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1400&q=90&fm=webp";
            }}
            loading="eager"
            decoding="async"
          />
        </motion.div>

        {/* DOOR CAR number plate */}
        <NumberPlate />

        {/* Ground reflection / shadow */}
        <div className="absolute bottom-0 left-4 right-4 h-14 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 100%, rgba(0,0,0,0.5) 0%, transparent 80%)", filter: "blur(8px)" }}
        />
        {/* Warm undercar glow */}
        <div className="absolute bottom-2 left-1/4 right-1/4 h-8 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,100,0,0.2) 0%, transparent 70%)", filter: "blur(12px)" }}
        />
      </motion.div>

      {/* ══ FLOATING DUST PARTICLES ══════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 4 }}>
        {DUST.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-amber-100"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, opacity: p.opacity }}
            animate={{ y: [-8, 8, -8], opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          />
        ))}
      </div>

      {/* ══ LEFT TEXT GRADIENT ════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6,
        background: "linear-gradient(to right, rgba(5,3,1,0.80) 0%, rgba(5,3,1,0.68) 28%, rgba(5,3,1,0.35) 52%, transparent 72%)"
      }} />

      {/* ══ CONTENT ═══════════════════════════════════ */}
      <div className="relative flex items-center" style={{ zIndex: 10, minHeight: "95vh" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div
            style={{ y: textY }}
            className="w-full lg:w-1/2 xl:w-[46%] pt-24 pb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-7"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide"
                style={{ background: "rgba(255,122,0,0.18)", border: "1px solid rgba(255,160,0,0.4)", color: "#FFD166" }}>
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                India&apos;s #1 Self-Drive Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold text-white leading-[1.08] mb-5"
              style={{ fontSize: "clamp(2.6rem, 5.2vw, 4rem)", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
            >
              Drive Your
              <br />
              <span className="relative inline-block">
                <span style={{
                  background: "linear-gradient(125deg, #FF7A00 0%, #FFD166 55%, #FF9A3C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Dream Car
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: "linear-gradient(to right, #FF7A00, #FFD166)" }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.1, duration: 0.7, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/75 mb-9 max-w-[420px] leading-relaxed"
              style={{ fontSize: "clamp(1rem, 1.8vw, 1.15rem)" }}
            >
              Book premium self-drive cars across India. No driver, no hidden charges — pure freedom on your terms.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-9"
            >
              <Link href="/cars">
                <Button variant="gradient" size="xl" className="gap-2"
                  style={{ boxShadow: "0 8px 32px rgba(255,122,0,0.45), 0 0 0 1px rgba(255,122,0,0.2)" }}>
                  Explore Cars <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <motion.button
                whileHover={{ background: "rgba(255,255,255,0.18)" }}
                className="h-14 px-8 rounded-2xl text-base font-bold text-white transition-all"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  backdropFilter: "blur(16px)",
                }}
              >
                How It Works
              </motion.button>
            </motion.div>

            {/* Trust */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-5 mb-10"
            >
              {[
                { icon: Shield, label: "Verified Cars" },
                { icon: Zap, label: "Instant Booking" },
                { icon: Star, label: "Top Rated" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/65">
                  <Icon className="h-4 w-4 text-[#FF9A3C]" />{label}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex gap-7 flex-wrap"
            >
              {[
                { value: "5,000+", label: "Cars" },
                { value: "50+", label: "Cities" },
                { value: "1.2M+", label: "Trips" },
                { value: "4.9★", label: "Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-xl sm:text-2xl font-bold text-white"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>{s.value}</div>
                  <div className="text-xs text-white/45 mt-0.5 font-semibold uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ══ BOTTOM BLEND ══════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none" style={{ zIndex: 11,
        background: "linear-gradient(to bottom, transparent 0%, #F8F9FB 100%)"
      }} />

      {/* ══ ROAD GROUND LINE ══════════════════════════ */}
      <div className="absolute bottom-24 left-0 right-0 h-px pointer-events-none" style={{ zIndex: 5,
        background: "linear-gradient(to right, transparent 0%, rgba(255,160,60,0.15) 30%, rgba(255,160,60,0.25) 50%, rgba(255,160,60,0.15) 70%, transparent 100%)"
      }} />
    </section>
  );
}
