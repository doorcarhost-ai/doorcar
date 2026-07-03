"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Six luxury cars for the showcase carousel
const CARS = [
  {
    name: "Land Rover Defender",
    tag: "Luxury SUV",
    image: "https://images.unsplash.com/photo-1617814076229-3a6e24e14f3e?w=1200&q=90",
    fallback: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=90",
  },
  {
    name: "BMW M4 Competition",
    tag: "Sports Luxury",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=90",
    fallback: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=90",
  },
  {
    name: "Mercedes AMG GT",
    tag: "Premium Class",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=90",
    fallback: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=90",
  },
  {
    name: "Porsche 911",
    tag: "Iconic Sports",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90",
    fallback: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=90",
  },
  {
    name: "Range Rover Vogue",
    tag: "Ultra Luxury",
    image: "https://images.unsplash.com/photo-1690389100671-f4bb2a65eac0?w=1200&q=90",
    fallback: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=90",
  },
  {
    name: "Audi RS7",
    tag: "Performance",
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=90",
    fallback: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1200&q=90",
  },
];

const STATS = [
  { value: "5,000+", label: "Premium Cars" },
  { value: "50+", label: "Cities" },
  { value: "24×7", label: "Support" },
  { value: "4.9★", label: "Rating" },
];

export function HeroBanner() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prev, setPrev] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number, dir: 1 | -1 = 1) => {
    setPrev(activeIdx);
    setDirection(dir);
    setActiveIdx(idx);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIdx((i) => {
        setPrev(i);
        setDirection(1);
        return (i + 1) % CARS.length;
      });
    }, 4500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const car = CARS[activeIdx];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Luxury gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FFFAF6] to-[#F8F4EF]" />

      {/* Ambient light from car side */}
      <motion.div
        key={activeIdx}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute right-0 top-0 w-2/3 h-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 80% 50%, rgba(255,122,0,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Faint grid texture */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "36px 36px" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)]">

          {/* ── LEFT: text ── */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-sm font-bold mb-6 tracking-wide">
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                India&apos;s #1 Self-Drive Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-[3.5rem] font-bold text-[#111827] leading-[1.1] mb-4"
            >
              Drive Your
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB547] bg-clip-text text-transparent">
                  Dream Car
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF7A00] to-[#FFB547] rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-[#6B7280] mb-8 max-w-md leading-relaxed"
            >
              Book premium self-drive cars across India. No driver. No hidden charges. Pure freedom.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link href="/cars">
                <Button variant="gradient" size="xl" className="gap-2 shadow-orange">
                  Explore Cars <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="white" size="xl">How It Works</Button>
            </motion.div>

            {/* Trust */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-5 mb-10"
            >
              {[
                { icon: Shield, label: "Verified Cars" },
                { icon: Zap, label: "Instant Booking" },
                { icon: Star, label: "Top Rated" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Icon className="h-4 w-4 text-[#FF7A00]" />{label}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-4 gap-3"
            >
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#111827]">{s.value}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: Cinematic car showcase ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              {/* Outer glow */}
              <motion.div
                key={`glow-${activeIdx}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }}
                className="absolute inset-0 rounded-3xl blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,122,0,0.12) 0%, transparent 70%)" }}
              />

              {/* Main car stage */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 border border-[#E5E7EB] shadow-premium-lg"
                style={{ minHeight: 380 }}
              >
                {/* Sky / horizon gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#E8F0F8] via-[#F2F5F8] to-[#E0D8CC]" />

                {/* Distant mountains */}
                <svg className="absolute bottom-24 left-0 right-0 w-full opacity-20" viewBox="0 0 800 120" preserveAspectRatio="none">
                  <path d="M0,120 L0,60 L80,20 L160,55 L240,15 L320,50 L400,10 L480,45 L560,25 L640,60 L720,30 L800,55 L800,120 Z" fill="#94A3B8" />
                </svg>

                {/* Road surface */}
                <div className="absolute bottom-0 left-0 right-0 h-28"
                  style={{ background: "linear-gradient(to bottom, #B8B0A0, #8A8278)" }}
                >
                  {/* Road markings — animated */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="road-animate flex items-center gap-0" style={{ width: "200%", height: "100%", position: "absolute" }}>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} style={{ width: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                          <div style={{ width: 48, height: 6, background: "rgba(255,255,255,0.6)", borderRadius: 3, marginTop: -8 }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Road shine */}
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)" }} />
                </div>

                {/* Car wrapper — floating */}
                <div className="car-float absolute bottom-14 left-0 right-0 flex justify-center items-end px-6">
                  <div className="relative w-full max-w-lg">
                    {/* Car image — slide in/out */}
                    <div className="relative" style={{ aspectRatio: "16/9" }}>
                      {CARS.map((c, idx) => (
                        <motion.div
                          key={c.name}
                          initial={false}
                          animate={{
                            opacity: idx === activeIdx ? 1 : 0,
                            x: idx === activeIdx ? 0 : direction * 60,
                            scale: idx === activeIdx ? 1 : 0.96,
                          }}
                          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                          className="absolute inset-0"
                          style={{ pointerEvents: idx === activeIdx ? "auto" : "none" }}
                        >
                          <Image
                            src={c.image}
                            alt={c.name}
                            fill
                            className="object-contain drop-shadow-2xl"
                            sizes="(max-width: 768px) 90vw, 500px"
                            priority={idx === 0}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.src = c.fallback;
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Wheel spin overlays — purely decorative blur circles */}
                    <div className="absolute bottom-0 left-[12%] w-14 h-14 rounded-full opacity-0 wheel-spin"
                      style={{ background: "radial-gradient(circle, rgba(0,0,0,0.15) 60%, transparent 100%)", filter: "blur(1px)" }}
                    />
                    <div className="absolute bottom-0 right-[12%] w-14 h-14 rounded-full opacity-0 wheel-spin"
                      style={{ background: "radial-gradient(circle, rgba(0,0,0,0.15) 60%, transparent 100%)", filter: "blur(1px)" }}
                    />

                    {/* Ground shadow */}
                    <div className="absolute -bottom-2 left-8 right-8 h-4 rounded-full bg-black/20 blur-md" />
                  </div>
                </div>

                {/* Headlight beams */}
                <div className="light-sweep absolute bottom-20 right-4 w-40 h-24 pointer-events-none"
                  style={{
                    background: "conic-gradient(from 200deg at 95% 80%, rgba(255,240,180,0.25) 0deg, transparent 40deg)",
                    filter: "blur(12px)",
                  }}
                />

                {/* Car name overlay */}
                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between">
                  <motion.div
                    key={`label-${activeIdx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.15em]">{car.tag}</p>
                    <p className="text-base font-bold text-[#111827]">{car.name}</p>
                  </motion.div>

                  {/* Dot navigation */}
                  <div className="flex gap-1.5">
                    {CARS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goTo(idx, idx > activeIdx ? 1 : -1)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeIdx ? "bg-[#FF7A00] w-6" : "bg-[#6B7280]/40 w-1.5 hover:bg-[#FF7A00]/50"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Speed lines — cinematic feel */}
                <div className="absolute top-1/3 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 40 }}>
                  <div className="road-animate flex items-center" style={{ width: "200%", gap: 40 }}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-px flex-shrink-0" style={{ width: 60 + Math.random() * 40, background: "rgba(255,122,0,0.08)" }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -left-4 top-12 glass border border-white/60 rounded-2xl px-4 py-3 shadow-premium-lg z-20"
              >
                <p className="text-xs text-[#6B7280]">Starting from</p>
                <p className="text-lg font-bold text-[#111827]">₹45<span className="text-xs font-normal text-[#6B7280]">/hr</span></p>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-2 sm:-right-5 bottom-16 glass border border-white/60 rounded-2xl px-3 py-3 shadow-premium-lg z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
                    <Star className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">4.9 / 5</p>
                    <p className="text-xs text-[#6B7280]">12k reviews</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
