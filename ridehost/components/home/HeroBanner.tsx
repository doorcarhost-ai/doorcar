"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "5000+", label: "Cars Available" },
  { value: "50+", label: "Cities" },
  { value: "24x7", label: "Support" },
  { value: "4.9★", label: "Rating" },
];

const badges = [
  { icon: Shield, label: "Verified Cars" },
  { icon: Zap, label: "Instant Booking" },
  { icon: Star, label: "Top Rated" },
];

export function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-[#FFF8F3] to-[#F8F9FB]">
      {/* Soft background shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#FF7A00]/6 via-[#FFB547]/4 to-transparent" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF7A00]/5 rounded-full blur-3xl" />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-[#FFB547]/8 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left */}
          <div className="order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-sm font-semibold mb-6">
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] animate-pulse" />
                2,500+ Premium Cars Ready
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl xl:text-6xl font-bold text-[#111827] leading-[1.15] mb-4"
            >
              Drive Your{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-[#FF7A00] to-[#FFB547] bg-clip-text text-transparent">Dream Car</span>
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#FF7A00] to-[#FFB547] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#6B7280] mb-3 font-medium"
            >
              Book Premium Self Drive Cars Across India
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base text-[#6B7280] mb-8 max-w-md leading-relaxed"
            >
              No driver. No hidden charges. Pure freedom. Choose from hatchbacks to luxury SUVs — by the hour or by the day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link href="/cars">
                <Button variant="gradient" size="xl" className="gap-2 shadow-orange">
                  Explore Cars <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="white" size="xl">
                How It Works
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-5"
            >
              {badges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-[#6B7280] text-sm">
                  <Icon className="h-4 w-4 text-[#FF7A00]" />{label}
                </div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-4 gap-3 mt-10"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-[#111827]">{stat.value}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — car image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              {/* Floating glow */}
              <div className="absolute inset-8 bg-[#FF7A00]/15 rounded-full blur-3xl" />

              {/* Main car image */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="relative h-64 sm:h-80 lg:h-[420px] rounded-3xl overflow-hidden shadow-premium-lg">
                  <Image
                    src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=90"
                    alt="Premium Car"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 lg:-left-8 glass rounded-2xl p-3.5 shadow-premium-lg z-20 border border-white/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center">
                    <MapPin className="h-4.5 w-4.5 text-[#FF7A00]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">Pickup Ready</p>
                    <p className="text-sm font-bold text-[#111827]">Bangalore</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass rounded-2xl p-3.5 shadow-premium-lg z-20 border border-white/60"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center">
                    <Star className="h-4 w-4 fill-green-500 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">4.9/5.0</p>
                    <p className="text-xs text-[#6B7280]">12k+ Reviews</p>
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
