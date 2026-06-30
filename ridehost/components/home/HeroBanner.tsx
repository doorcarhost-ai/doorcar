"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const SHOWCASE_CARS = [
  {
    name: "BMW M4 Competition",
    tag: "Luxury Sports",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=85",
    color: "#1C2951",
  },
  {
    name: "Mercedes AMG GT",
    tag: "Premium Class",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=85",
    color: "#0D1117",
  },
  {
    name: "Porsche 911 Carrera",
    tag: "Iconic Design",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=900&q=85",
    color: "#1A1A2E",
  },
  {
    name: "Range Rover Vogue",
    tag: "Luxury SUV",
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=85",
    color: "#1C1C1E",
  },
  {
    name: "Audi RS7 Sportback",
    tag: "Performance",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&q=85",
    color: "#101828",
  },
  {
    name: "Mahindra Thar",
    tag: "Adventure Ready",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&q=85",
    color: "#1A2332",
  },
];

const stats = [
  { value: "5,000+", label: "Cars Available" },
  { value: "50+", label: "Cities" },
  { value: "24×7", label: "Support" },
  { value: "4.9★", label: "Rating" },
];

const badges = [
  { icon: Shield, label: "Verified Cars" },
  { icon: Zap, label: "Instant Booking" },
  { icon: Star, label: "Top Rated" },
];

export function HeroBanner() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % SHOWCASE_CARS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  const car = SHOWCASE_CARS[active];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Subtle background bleed from car color */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${active}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 70% at 80% 50%, ${car.color}18 0%, transparent 70%)`,
          }}
        />
      </AnimatePresence>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #111 1px, transparent 0)", backgroundSize: "32px 32px" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-10 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">

          {/* ── Left Content ── */}
          <div className="order-2 lg:order-1 py-8 lg:py-16">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-sm font-bold mb-6 tracking-wide">
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                India&apos;s #1 Self-Drive Platform
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-bold text-[#111827] leading-[1.1] mb-4"
            >
              Drive Your
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB547] bg-clip-text text-transparent">Dream Car</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF7A00] to-[#FFB547] rounded-full origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-[#6B7280] mb-8 max-w-md leading-relaxed"
            >
              Book premium self-drive cars across India. No driver, no hidden fees — pure freedom on your terms.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
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

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap gap-5 mb-10"
            >
              {badges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-[#6B7280]">
                  <Icon className="h-4 w-4 text-[#FF7A00]" />{label}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="grid grid-cols-4 gap-4"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#111827]">{s.value}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Car Showcase ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative flex flex-col items-center"
          >
            {/* 3D floating showcase */}
            <div className="relative w-full max-w-xl mx-auto">
              {/* Glow ring */}
              <div className="absolute inset-6 rounded-3xl blur-2xl opacity-25 transition-all duration-1000"
                style={{ background: `radial-gradient(ellipse, ${car.color} 0%, transparent 70%)` }}
              />

              {/* Main image container */}
              <div className="relative h-[300px] sm:h-[380px] lg:h-[440px] rounded-3xl overflow-hidden shadow-premium-lg">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={active}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 60, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: direction * -60, scale: 0.97 }}
                    transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Car name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`label-${active}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                    >
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.15em]">{car.tag}</span>
                      <p className="text-white font-bold text-xl drop-shadow-md">{car.name}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Progress indicator */}
                <div className="absolute top-4 right-4 z-10 flex gap-1.5">
                  {SHOWCASE_CARS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === active ? "bg-white w-6" : "bg-white/40 w-1.5"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Reflection */}
              <div className="relative h-12 mx-4 overflow-hidden opacity-30">
                <div
                  className="absolute inset-0 scale-y-[-1]"
                  style={{ filter: "blur(8px) brightness(1.2)", maskImage: "linear-gradient(to bottom, black, transparent)" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`ref-${active}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image src={car.image} alt="" fill className="object-cover object-bottom" sizes="600px" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-4 top-12 glass border border-white/60 rounded-2xl px-4 py-3 shadow-premium-lg z-20"
              >
                <p className="text-xs text-[#6B7280]">Starting from</p>
                <p className="text-lg font-bold text-[#111827]">₹45<span className="text-xs font-normal text-[#6B7280]">/hr</span></p>
              </motion.div>

              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-2 sm:-right-6 bottom-20 glass border border-white/60 rounded-2xl px-4 py-3 shadow-premium-lg z-20"
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                    <Star className="h-4 w-4 fill-green-500 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">4.9 Rating</p>
                    <p className="text-xs text-[#6B7280]">12k+ reviews</p>
                  </div>
                </div>
              </motion.div>

              {/* Nav arrows */}
              <div className="flex items-center justify-center gap-3 mt-5">
                {SHOWCASE_CARS.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === active ? "bg-[#FF7A00] w-8" : "bg-[#E5E7EB] w-2 hover:bg-[#FF7A00]/40"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
