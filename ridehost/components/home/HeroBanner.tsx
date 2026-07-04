"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * ─── REPLACE THIS PATH to use your own uploaded image ──────────────────────
 * Drop your image into /public/images/ and change the path below.
 * Recommended: /images/hero-defender.jpg  (1920×1080, WebP/JPEG)
 */
const HERO_IMAGE = "/images/hero-defender.png";

/* ─── Static dust motes (right side only) ────────────────────── */
const MOTES = [
  { x: 58, y: 22, r: 1.6, delay: 0,   dur: 9,  o: 0.12 },
  { x: 70, y: 38, r: 1.2, delay: 2,   dur: 11, o: 0.09 },
  { x: 80, y: 55, r: 2.0, delay: 1,   dur: 8,  o: 0.14 },
  { x: 65, y: 72, r: 1.4, delay: 3.5, dur: 10, o: 0.10 },
  { x: 88, y: 18, r: 1.8, delay: 0.5, dur: 7,  o: 0.13 },
  { x: 75, y: 85, r: 1.0, delay: 4,   dur: 12, o: 0.07 },
  { x: 92, y: 46, r: 1.5, delay: 1.8, dur: 9,  o: 0.11 },
  { x: 53, y: 60, r: 1.3, delay: 2.8, dur: 8,  o: 0.08 },
];

export function HeroBanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY   = useTransform(scrollY, [0, 600], [0, 65]);
  const txtY  = useTransform(scrollY, [0, 600], [0, -22]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ minHeight: "93vh", background: "#05080d" }}
    >

      {/* ═══════════════════════════════════════════════════════
          BACKGROUND IMAGE — local asset, no external dependency
      ═══════════════════════════════════════════════════════ */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: "65% center",
            filter: "brightness(0.75) contrast(1.08) saturate(0.90)",
          }}
          loading="eager"
          decoding="async"
          onError={(e) => {
            /* Fallback chain if local image fails */
            const el = e.currentTarget;
            const fallbacks = [
              "/images/hero-bg-2.jpg",
              "/images/hero-defender.png",
            ];
            const n = Number(el.dataset.n ?? 0);
            if (n < fallbacks.length) {
              el.dataset.n = String(n + 1);
              el.src = fallbacks[n];
            }
          }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          CINEMATIC GRADE OVERLAYS
      ═══════════════════════════════════════════════════════ */}

      {/* Top vignette — darkens sky, adds cinematic letterbox feel */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 2,
          height: "32%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, transparent 100%)",
        }}
      />

      {/* All-around vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse 105% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.50) 100%)",
        }}
      />

      {/* LEFT text-protection gradient — strong left, fades by 68% */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background:
            "linear-gradient(to right, rgba(2,4,8,0.92) 0%, rgba(2,4,8,0.78) 24%, rgba(2,4,8,0.45) 45%, rgba(2,4,8,0.12) 60%, transparent 70%)",
        }}
      />

      {/* Warm golden-hour wash on the right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse 55% 60% at 85% 36%, rgba(255,135,20,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Subtle sun glow — top right */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          zIndex: 4,
          top: "5%",
          right: "6%",
          width: 110,
          height: 110,
          background:
            "radial-gradient(circle, rgba(255,215,70,0.48) 0%, rgba(255,105,0,0.18) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ opacity: [0.65, 1, 0.65], scale: [1, 1.12, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ═══════════════════════════════════════════════════════
          DUST MOTES
      ═══════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 5 }}
      >
        {MOTES.map((m, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: m.r * 2,
              height: m.r * 2,
              background: "rgba(255, 225, 130, 1)",
              opacity: m.o,
            }}
            animate={{
              y: [-8, 8, -8],
              opacity: [m.o * 0.3, m.o, m.o * 0.3],
            }}
            transition={{
              duration: m.dur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: m.delay,
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          HERO CONTENT — left half
      ═══════════════════════════════════════════════════════ */}
      <div
        className="relative flex items-center"
        style={{ zIndex: 10, minHeight: "93vh" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <motion.div
            style={{ y: txtY }}
            className="w-full lg:w-[50%] xl:w-[46%] pt-24 pb-20"
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
                  border: "1px solid rgba(255,160,0,0.40)",
                  color: "#FFC866",
                }}
              >
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                India&apos;s #1 Self-Drive Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.88, delay: 0.10, ease: [0.22, 1, 0.36, 1] }}
              className="font-bold text-white leading-tight mb-5"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.85rem)",
                lineHeight: 1.08,
                textShadow: "0 4px 28px rgba(0,0,0,0.55)",
              }}
            >
              Drive Your
              <br />
              <span className="relative inline-block">
                <span
                  style={{
                    background: "linear-gradient(120deg, #FF7A00 0%, #FFD166 58%, #FF9A3C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Dream Car
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 block h-[3px] rounded-full"
                  style={{
                    background: "linear-gradient(to right, #FF7A00, #FFD166)",
                    width: "100%",
                  }}
                  initial={{ scaleX: 0, originX: "left" }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.05, duration: 0.72, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.70, delay: 0.22 }}
              className="leading-relaxed mb-8 max-w-[400px]"
              style={{
                color: "rgba(255,255,255,0.72)",
                fontSize: "clamp(1rem, 1.7vw, 1.12rem)",
              }}
            >
              Book premium self-drive cars across India. No driver, no hidden charges — pure freedom on your terms.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.70, delay: 0.32 }}
              className="flex flex-wrap gap-3 mb-9"
            >
              <Link href="/cars">
                <Button
                  variant="gradient"
                  size="xl"
                  className="gap-2"
                  style={{
                    boxShadow: "0 8px 32px rgba(255,122,0,0.44), 0 0 0 1px rgba(255,122,0,0.2)",
                  }}
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
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(255,255,255,0.10)";
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
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
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
                    style={{ textShadow: "0 2px 14px rgba(0,0,0,0.45)" }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-xs font-semibold uppercase tracking-widest mt-0.5"
                    style={{ color: "rgba(255,255,255,0.42)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM BLEND — transitions into page background
      ═══════════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 11,
          height: 100,
          background: "linear-gradient(to bottom, transparent 0%, #F8F9FB 100%)",
        }}
      />
    </section>
  );
}
