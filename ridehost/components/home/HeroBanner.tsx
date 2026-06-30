"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Cars Available", value: "2,500+" },
  { label: "Happy Customers", value: "1.2M+" },
  { label: "Cities", value: "50+" },
  { label: "Avg Rating", value: "4.8★" },
];

const trustBadges = [
  { icon: Shield, label: "Fully Verified" },
  { icon: Zap, label: "Instant Booking" },
  { icon: Star, label: "Top Rated" },
];

export function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[10%] h-64 w-64 rounded-full bg-violet-500/10 blur-3xl"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-[5%] h-48 w-48 rounded-full bg-purple-500/15 blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                2,500+ cars available near you
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Drive Your{" "}
              <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                Dream Car
              </span>{" "}
              Today
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed"
            >
              India&apos;s most trusted self-drive car rental platform. Book
              top-rated vehicles by the hour or day — no driver, pure freedom.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <Link href="/cars">
                <Button
                  variant="gradient"
                  size="lg"
                  className="gap-2 shadow-2xl"
                >
                  Explore Cars
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                How It Works
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-white/70 text-sm"
                >
                  <Icon className="h-4 w-4 text-violet-300" />
                  {label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Hero image placeholder with gradient overlay */}
              <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-violet-800/50 to-purple-900/50 backdrop-blur-sm border border-white/10 p-8">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">🚗</div>
                    <p className="text-white/60 text-sm">
                      Premium Self-Drive Experience
                    </p>
                  </div>
                </div>

                {/* Floating card */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-8 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-2xl"
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    Active Bookings
                  </p>
                  <p className="text-2xl font-bold">3,241</p>
                  <p className="text-xs text-green-500 font-medium">
                    ↑ 12% this week
                  </p>
                </motion.div>

                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-2xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">4.9/5.0</p>
                      <p className="text-xs text-muted-foreground">
                        12k reviews
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
