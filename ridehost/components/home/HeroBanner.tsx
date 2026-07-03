"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ─── DOOR CAR plate overlay ────────────────────────────── */
function Plate() {
  return (
    <svg
      viewBox="0 0 190 46"
      aria-hidden="true"
      style={{ position: "absolute", width: "13%", bottom: "19%", left: "36%", zIndex: 10,
        filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7))" }}
    >
      <rect x="1" y="1" width="188" height="44" rx="6" fill="#F5EEC8" stroke="#C8A800" strokeWidth="2" />
      {/* IND blue strip */}
      <rect x="3" y="3" width="22" height="38" rx="4" fill="#1b3a9e" />
      <text x="14" y="17" textAnchor="middle" fill="#ffffff" fontSize="8" fontFamily="Arial" fontWeight="bold">🇮🇳</text>
      <text x="14" y="34" textAnchor="middle" fill="#FFD700" fontSize="7.5" fontFamily="Arial" fontWeight="bold">IND</text>
      {/* Plate text */}
      <text x="110" y="31" textAnchor="middle" fill="#0d0d0d" fontSize="20" fontWeight="900"
        fontFamily="'Arial Black', 'Arial Bold', Arial, sans-serif" letterSpacing="4">
        DOOR CAR
      </text>
    </svg>
  );
}

/* ─── Subtle dust motes ─────────────────────────────────── */
const MOTES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 42 + Math.random() * 52,
  y: 15 + Math.random() * 68,
  r: 1 + Math.random() * 2.2,
  delay: Math.random() * 6,
  dur: 7 + Math.random() * 7,
  o: 0.06 + Math.random() * 0.18,
}));

/* ─── Main component ────────────────────────────────────── */
export function HeroBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const imgY  = useTransform(scrollY, [0, 600], [0, 60]);
  const txtY  = useTransform(scrollY, [0, 600], [0, -24]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "95vh", background: "#06090e" }}
    >
      {/* ══════════════════════════════════════════
          FULL-BLEED CAR PHOTOGRAPH
          Premium black SUV on coastal highway
      ══════════════════════════════════════════ */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0"
      >
        {/*
          Primary: Black SUV / Defender-type — front-right low angle
          We try multiple premium automotive Unsplash shots as fallbacks
          The <picture> element lets the browser pick the best source
        */}
        <picture className="w-full h-full">
          {/* WebP first for performance */}
          <source
            srcSet="https://images.unsplash.com/photo-1617814076229-3a6e24e14f3e?w=1920&q=85&fm=webp 1920w, https://images.unsplash.com/photo-1617814076229-3a6e24e14f3e?w=1280&q=85&fm=webp 1280w"
            type="image/webp"
          />
          <img
            src="https://images.unsplash.com/photo-1617814076229-3a6e24e14f3e?w=1920&q=85"
            alt="Black Land Rover Defender on coastal highway"
            className="w-full h-full object-cover"
            style={{
              objectPosition: "60% center",
              filter: "brightness(0.82) contrast(1.06) saturate(0.95)",
            }}
            loading="eager"
            decoding="async"
            onError={(e) => {
              /* cascade through fallbacks */
              const img = e.target as HTMLImageElement;
              const fallbacks = [
                "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1920&q=85",
                "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&q=85",
                "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=85",
              ];
              const tried = parseInt(img.dataset.tried || "0");
              if (tried < fallbacks.length) {
                img.dataset.tried = String(tried + 1);
                img.src = fallbacks[tried];
              }
            }}
          />
        </picture>
      </motion.div>

      {/* ══════════════════════════════════════════
          CINEMATIC GRADE OVERLAYS
      ══════════════════════════════════════════ */}

      {/* Slight warm golden-hour tint on the right (sunlight side) */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
        background: "radial-gradient(ellipse 60% 70% at 78% 42%, rgba(255,145,30,0.09) 0%, transparent 60%)"
      }} />

      {/* Top-edge darkening (cinematic letterbox feel) */}
      <div className="absolute top-0 left-0 right-0 h-28 pointer-events-none" style={{ zIndex: 2,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)"
      }} />

      {/* Vignette all-around */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2,
        background: "radial-gradient(ellipse 110% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.48) 100%)"
      }} />

      {/* Left gradient — protects text */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3,
        background: "linear-gradient(to right, rgba(4,6,10,0.88) 0%, rgba(4,6,10,0.72) 26%, rgba(4,6,10,0.40) 46%, rgba(4,6,10,0.08) 62%, transparent 72%)"
      }} />

      {/* Subtle sun-glow — top-right */}
      <motion.div
        animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute pointer-events-none"
        style={{ top: "6%", right: "7%", zIndex: 4,
          width: 90, height: 90,
          background: "radial-gradient(circle, rgba(255,210,80,0.55) 0%, rgba(255,120,0,0.20) 45%, transparent 70%)",
          filter: "blur(14px)" }}
      />

      {/* ══════════════════════════════════════════
          NUMBER PLATE OVERLAY
      ══════════════════════════════════════════ */}
      <Plate />

      {/* ══════════════════════════════════════════
          DUST MOTES (right side only)
      ══════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {MOTES.map((m) => (
          <motion.div
            key={m.id}
            className="absolute rounded-full"
            style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.r, height: m.r,
              background: "rgba(255,230,160,1)", opacity: m.o }}
            animate={{ y: [-7, 7, -7], opacity: [m.o * 0.4, m.o, m.o * 0.4] }}
            transition={{ duration: m.dur, repeat: Infinity, ease: "easeInOut", delay: m.delay }}
          />
        ))}
      </div>

      {/* ══════════════════════════════════════════
          TEXT CONTENT
      ══════════════════════════════════════════ */}
      <div className="relative w-full" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            style={{ y: txtY }}
            className="w-full lg:w-[48%] xl:w-[44%] pt-24 pb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{ background: "rgba(255,122,0,0.16)", border: "1px solid rgba(255,160,0,0.38)", color: "#FFC866" }}>
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                India&apos;s #1 Self-Drive Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold text-white leading-[1.08] mb-5"
              style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", textShadow: "0 4px 28px rgba(0,0,0,0.55)" }}
            >
              Drive Your
              <br />
              <span className="relative inline-block">
                <span style={{
                  background: "linear-gradient(120deg, #FF7A00 0%, #FFD166 60%, #FF9A3C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Dream Car
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 block h-[3px] rounded-full"
                  style={{ background: "linear-gradient(to right, #FF7A00, #FFD166)", width: "100%" }}
                  initial={{ scaleX: 0, originX: "left" }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.05, duration: 0.75, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.22 }}
              className="max-w-[400px] leading-relaxed mb-8 text-white/72"
              style={{ fontSize: "clamp(1rem, 1.7vw, 1.12rem)" }}
            >
              Book premium self-drive cars across India. No driver, no hidden charges — pure freedom on your terms.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.72, delay: 0.32 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link href="/cars">
                <Button variant="gradient" size="xl" className="gap-2"
                  style={{ boxShadow: "0 8px 30px rgba(255,122,0,0.42), 0 0 0 1px rgba(255,122,0,0.22)" }}>
                  Explore Cars <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <button
                className="h-14 px-8 rounded-2xl text-base font-bold text-white transition-all"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.24)", backdropFilter: "blur(14px)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.10)"; }}
              >
                How It Works
              </button>
            </motion.div>

            {/* Trust */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.68, delay: 0.42 }}
              className="flex flex-wrap gap-5 mb-9"
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.52 }}
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
                    style={{ textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}>{s.value}</div>
                  <div className="text-[11px] text-white/45 mt-0.5 font-semibold uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom blend into page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ zIndex: 11,
        background: "linear-gradient(to bottom, transparent 0%, #F8F9FB 100%)"
      }} />
    </section>
  );
}
