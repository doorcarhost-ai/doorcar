"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ─── Particle system ──────────────────────────────────────── */
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 6,
  opacity: 0.2 + Math.random() * 0.5,
}));

/* ─── Cinematic road lane ──────────────────────────────────── */
function CinematicRoad() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none overflow-hidden">
      {/* Asphalt base */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to top, #0f0f0f 0%, #1a1a1a 40%, transparent 100%)" }}
      />
      {/* Road surface with perspective */}
      <svg className="absolute bottom-0 left-0 right-0 w-full" height="200" viewBox="0 0 1440 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="roadGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1c1c1c" />
            <stop offset="100%" stopColor="#2a2a2a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,200 L0,100 L720,60 L1440,100 L1440,200 Z" fill="url(#roadGrad)" />
        {/* Road edge lines */}
        <line x1="0" y1="102" x2="1440" y2="102" stroke="#FF7A00" strokeWidth="1.5" strokeOpacity="0.3" />
        <line x1="0" y1="195" x2="1440" y2="195" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.15" />
      </svg>

      {/* Moving dashes — centre line */}
      <div className="absolute bottom-10 left-0 right-0 h-6 overflow-hidden">
        <div className="flex items-center h-full animate-[roadMove_1.2s_linear_infinite]"
          style={{ width: "200%" }}
        >
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="shrink-0 h-2 rounded-full mx-8"
              style={{ width: 72, background: "rgba(255,255,255,0.55)" }}
            />
          ))}
        </div>
      </div>

      {/* Ground fog / glow */}
      <div className="absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,122,0,0.08) 0%, transparent 70%)" }}
      />
    </div>
  );
}

/* ─── Wheel spinner ────────────────────────────────────────── */
function Wheel({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute rounded-full border-2 border-white/10 overflow-hidden"
      style={{ animation: "wheel-spin 0.7s linear infinite", ...style }}
    >
      {/* Spokes */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 60, 120].map((deg) => (
          <div key={deg} className="absolute w-full h-px"
            style={{ background: "rgba(255,255,255,0.25)", transform: `rotate(${deg}deg)` }}
          />
        ))}
        <div className="h-3 w-3 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

/* ─── Light rays ───────────────────────────────────────────── */
function LightRays() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[30, 45, 60].map((angle, i) => (
        <div key={i} className="absolute top-0 right-1/4"
          style={{
            width: 2,
            height: "60%",
            background: "linear-gradient(to bottom, rgba(255,220,100,0.12), transparent)",
            transform: `rotate(${angle}deg) translateX(${i * 60}px)`,
            filter: "blur(8px)",
            animation: `light-sweep ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Hero ────────────────────────────────────────────── */
export function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 60]);
  const textY = useTransform(scrollY, [0, 500], [0, -30]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0a0a0a]"
      style={{ minHeight: "88vh" }}
    >
      {/* ── Background: highway photograph ── */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {/* Primary cinematic background — highway night/dusk */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1800&q=85')`,
            filter: "brightness(0.45) saturate(0.8)",
          }}
        />
        {/* Colour grade overlay — teal-to-black cinema look */}
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(0,20,40,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(20,5,0,0.5) 100%)" }}
        />
      </motion.div>

      {/* ── Hero car — right half ── */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 pointer-events-none">
        {/* Car image with subtle float */}
        <motion.div
          className="absolute inset-0 flex items-end justify-center lg:justify-end pr-0 lg:pr-8 pb-14"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative w-full max-w-2xl h-64 sm:h-80 lg:h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1617814076229-3a6e24e14f3e?w=1200&q=90"
              alt="Black Land Rover Defender"
              className="w-full h-full object-contain object-bottom drop-shadow-2xl"
              style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=90";
              }}
            />

            {/* Wheel spinner overlays (positioned approximately over wheel positions) */}
            <Wheel style={{ bottom: "6%", left: "14%", width: "14%", aspectRatio: "1" }} />
            <Wheel style={{ bottom: "6%", right: "16%", width: "14%", aspectRatio: "1" }} />

            {/* Under-car glow */}
            <div className="absolute -bottom-2 left-8 right-8 h-6 rounded-full blur-xl"
              style={{ background: "radial-gradient(ellipse, rgba(255,122,0,0.25) 0%, transparent 70%)" }}
            />
          </div>
        </motion.div>

        {/* Light rays coming from upper right */}
        <LightRays />
      </div>

      {/* ── Cinematic road ── */}
      <CinematicRoad />

      {/* ── Dark vignette ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)" }}
      />

      {/* ── Left text overlay ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 70%)" }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{
              y: [-12, 12, -12],
              opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center"
        style={{ minHeight: "88vh" }}
      >
        <motion.div
          style={{ y: textY }}
          className="w-full lg:w-1/2 xl:w-[46%] pt-20 pb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7"
              style={{ background: "rgba(255,122,0,0.15)", border: "1px solid rgba(255,122,0,0.35)" }}
            >
              <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
              <span className="text-[#FFB547] text-sm font-bold tracking-wide">India&apos;s #1 Self-Drive Platform</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bold text-white leading-[1.1] mb-5"
            style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)" }}
          >
            Drive Your
            <br />
            <span className="relative">
              <span style={{ background: "linear-gradient(135deg, #FF7A00, #FFD166)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Dream Car
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(to right, #FF7A00, #FFD166)" }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1, duration: 0.7 }}
              />
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/70 mb-8 max-w-md leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
          >
            Book premium self-drive cars across India. No driver, no hidden charges — pure freedom on your terms.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-9"
          >
            <Link href="/cars">
              <Button
                variant="gradient"
                size="xl"
                className="gap-2 shadow-[0_8px_30px_rgba(255,122,0,0.4)]"
              >
                Explore Cars <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <button
              className="h-14 px-8 rounded-2xl text-base font-bold text-white transition-all"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
            >
              How It Works
            </button>
          </motion.div>

          {/* Trust badges */}
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
              <div key={label} className="flex items-center gap-2 text-sm text-white/70">
                <Icon className="h-4 w-4 text-[#FF7A00]" />{label}
              </div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-6 flex-wrap"
          >
            {[
              { value: "5,000+", label: "Cars" },
              { value: "50+", label: "Cities" },
              { value: "1.2M+", label: "Trips" },
              { value: "4.9★", label: "Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-white/50 mt-0.5 font-medium uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(248,249,251,0.95))" }}
      />
    </section>
  );
}
