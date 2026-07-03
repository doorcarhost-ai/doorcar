"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ─── Static particle data (no random on every render) ──────── */
const MOTES = [
  { x: 55, y: 20, r: 1.8, delay: 0,   dur: 8,  o: 0.14 },
  { x: 68, y: 35, r: 1.2, delay: 1.5, dur: 10, o: 0.10 },
  { x: 74, y: 55, r: 2.0, delay: 3,   dur: 7,  o: 0.18 },
  { x: 82, y: 18, r: 1.4, delay: 0.8, dur: 9,  o: 0.12 },
  { x: 63, y: 70, r: 1.6, delay: 2.2, dur: 11, o: 0.09 },
  { x: 90, y: 42, r: 1.0, delay: 4,   dur: 8,  o: 0.13 },
  { x: 78, y: 62, r: 2.2, delay: 1,   dur: 12, o: 0.08 },
  { x: 50, y: 48, r: 1.3, delay: 3.5, dur: 9,  o: 0.11 },
  { x: 86, y: 28, r: 1.7, delay: 2,   dur: 7,  o: 0.15 },
  { x: 61, y: 82, r: 1.1, delay: 5,   dur: 13, o: 0.07 },
];

export function HeroBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY   = useTransform(scrollY, [0, 600], [0, 70]);
  const textY = useTransform(scrollY, [0, 600], [0, -26]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: "93vh", backgroundColor: "#07090d" }}
    >
      {/* ═══════════════════════════════════════════
          BACKGROUND: Premium automotive photograph
      ═══════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1617814076229-3a6e24e14f3e?w=1920&q=88"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "55% center", filter: "brightness(0.80) contrast(1.05) saturate(0.9)" }}
          loading="eager"
          decoding="async"
          onError={(e) => {
            const el = e.currentTarget;
            const list = [
              "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1920&q=88",
              "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1920&q=88",
              "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=88",
            ];
            const n = Number(el.dataset.n || 0);
            if (n < list.length) { el.dataset.n = String(n + 1); el.src = list[n]; }
          }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════
          CINEMATIC COLOUR OVERLAYS
      ═══════════════════════════════════════════ */}

      {/* All-around vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse 110% 105% at 50% 50%, transparent 42%, rgba(0,0,0,0.52) 100%)",
        }}
      />

      {/* Top darkening */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 2,
          height: "30%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.48) 0%, transparent 100%)",
        }}
      />

      {/* Warm golden side-wash (right) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse 55% 65% at 82% 38%, rgba(255,138,24,0.09) 0%, transparent 60%)",
        }}
      />

      {/* Left text gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background:
            "linear-gradient(to right, rgba(3,5,9,0.90) 0%, rgba(3,5,9,0.75) 25%, rgba(3,5,9,0.42) 46%, rgba(3,5,9,0.10) 60%, transparent 70%)",
        }}
      />

      {/* Sun glow — top right */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{ zIndex: 4, top: "5%", right: "6%", width: 100, height: 100,
          background: "radial-gradient(circle, rgba(255,210,70,0.50) 0%, rgba(255,110,0,0.18) 45%, transparent 70%)",
          filter: "blur(18px)" }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ═══════════════════════════════════════════
          DOOR CAR NUMBER PLATE
          SVG rendered directly — no emoji, no picture element
      ═══════════════════════════════════════════ */}
      <div
        className="absolute pointer-events-none"
        style={{ zIndex: 8, bottom: "20%", left: "38%", width: "11%", minWidth: 80 }}
      >
        <svg viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.75))" }}>
          <rect x="1" y="1" width="198" height="48" rx="7" fill="#F2E8B0" stroke="#C4A700" strokeWidth="2" />
          {/* Blue IND strip */}
          <rect x="3" y="3" width="24" height="44" rx="5" fill="#1a3699" />
          <text x="15" y="20" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Arial" fontWeight="bold">IN</text>
          <text x="15" y="40" textAnchor="middle" fill="#FFD700" fontSize="8" fontFamily="Arial" fontWeight="bold">IND</text>
          {/* Plate letters */}
          <text
            x="116"
            y="34"
            textAnchor="middle"
            fill="#0a0a0a"
            fontSize="21"
            fontWeight="900"
            fontFamily="Arial Black, Arial, sans-serif"
            letterSpacing="3"
          >
            DOOR CAR
          </text>
        </svg>
      </div>

      {/* ═══════════════════════════════════════════
          DUST MOTES
      ═══════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
        {MOTES.map((m, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.r * 2,
              height: m.r * 2,
              backgroundColor: "rgba(255, 225, 140, 1)",
              opacity: m.o,
            }}
            animate={{ y: [-8, 8, -8], opacity: [m.o * 0.4, m.o, m.o * 0.4] }}
            transition={{ duration: m.dur, repeat: Infinity, ease: "easeInOut", delay: m.delay }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════
          TEXT CONTENT
      ═══════════════════════════════════════════ */}
      <div
        className="relative flex items-center"
        style={{ zIndex: 10, minHeight: "93vh" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div
            style={{ y: textY }}
            className="w-full lg:w-[50%] xl:w-[45%] pt-24 pb-20"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="mb-7"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{
                  background: "rgba(255,122,0,0.16)",
                  border: "1px solid rgba(255,160,0,0.38)",
                  color: "#FFC866",
                }}
              >
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                India&apos;s #1 Self-Drive Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold text-white leading-tight mb-5"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.85rem)",
                lineHeight: 1.08,
                textShadow: "0 4px 24px rgba(0,0,0,0.5)",
              }}
            >
              Drive Your
              <br />
              <span className="relative inline-block">
                <span
                  style={{
                    background: "linear-gradient(120deg, #FF7A00 0%, #FFD166 60%, #FF9A3C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Dream Car
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 block h-[3px] rounded-full"
                  style={{ background: "linear-gradient(to right, #FF7A00, #FFD166)", width: "100%" }}
                  initial={{ scaleX: 0, originX: "left" }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.05, duration: 0.7, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="leading-relaxed mb-8 max-w-[400px]"
              style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(1rem, 1.7vw, 1.12rem)" }}
            >
              Book premium self-drive cars across India. No driver, no hidden charges — pure freedom on your terms.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="flex flex-wrap gap-3 mb-9"
            >
              <Link href="/cars">
                <Button
                  variant="gradient"
                  size="xl"
                  className="gap-2"
                  style={{ boxShadow: "0 8px 32px rgba(255,122,0,0.44), 0 0 0 1px rgba(255,122,0,0.2)" }}
                >
                  Explore Cars <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <button
                className="h-14 px-8 rounded-2xl text-base font-bold text-white transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.24)",
                  backdropFilter: "blur(14px)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.10)";
                }}
              >
                How It Works
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.42 }}
              className="flex flex-wrap gap-5 mb-10"
            >
              {[
                { Icon: Shield, label: "Verified Cars" },
                { Icon: Zap,    label: "Instant Booking" },
                { Icon: Star,   label: "Top Rated" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  <Icon className="h-4 w-4 text-[#FF9A3C]" />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.62, delay: 0.52 }}
              className="flex gap-7 flex-wrap"
            >
              {[
                { value: "5,000+", label: "Cars" },
                { value: "50+",    label: "Cities" },
                { value: "1.2M+",  label: "Trips" },
                { value: "4.9★",   label: "Rating" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="text-xl sm:text-2xl font-bold text-white"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-xs font-semibold uppercase tracking-widest mt-0.5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom page blend */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 11,
          height: "100px",
          background: "linear-gradient(to bottom, transparent 0%, #F8F9FB 100%)",
        }}
      />
    </section>
  );
}
