"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/cars/CarCard";
import { MOCK_CARS } from "@/data/mock-data";

interface CarSectionProps {
  title: string;
  subtitle: string;
  badge: string;
  cars: typeof MOCK_CARS;
  viewAllHref?: string;
}

function CarSection({ title, subtitle, badge, cars, viewAllHref = "/cars" }: CarSectionProps) {
  return (
    <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-2">{badge}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-1">{title}</h2>
          <p className="text-[#6B7280]">{subtitle}</p>
        </div>
        <Link href={viewAllHref}>
          <Button variant="ghost" className="hidden sm:flex gap-1 text-[#FF7A00] hover:text-[#E86E00] hover:bg-[#FF7A00]/5">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cars.map((car, idx) => <CarCard key={car.id} car={car} index={idx} />)}
      </div>
      <div className="mt-5 sm:hidden">
        <Link href={viewAllHref}>
          <Button variant="outline" className="w-full gap-1">View All Cars <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    </section>
  );
}

export function FeaturedCars() {
  const featured = MOCK_CARS.filter((c) => c.available && c.rating >= 4.7).slice(0, 3);
  return (
    <CarSection
      badge="✦ Featured"
      title="Top Picks This Week"
      subtitle="Hand-picked premium vehicles with exceptional ratings"
      cars={featured}
    />
  );
}

export function LuxuryCollection() {
  const luxury = MOCK_CARS.filter((c) => c.category === "luxury");
  if (!luxury.length) return null;
  return (
    <section className="py-14 bg-gradient-to-br from-[#111827] to-[#1f2937]">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-2">✦ Premium Class</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Luxury Collection</h2>
            <p className="text-gray-400">Experience the pinnacle of automotive excellence</p>
          </div>
          <Link href="/cars?category=luxury">
            <Button variant="outline" className="hidden sm:flex gap-1 bg-white/10 border-white/20 text-white hover:bg-white/20">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {luxury.map((car, idx) => <CarCard key={car.id} car={car} index={idx} />)}
        </div>
      </div>
    </section>
  );
}

export function SuvCollection() {
  const suvs = MOCK_CARS.filter((c) => c.category === "suv").slice(0, 3);
  if (!suvs.length) return null;
  return (
    <CarSection
      badge="🚙 SUV Class"
      title="SUV Collection"
      subtitle="Bold, spacious and built for every terrain"
      cars={suvs}
      viewAllHref="/cars?category=suv"
    />
  );
}

export function EvCollection() {
  const evs = MOCK_CARS.filter((c) => c.category === "ev" || c.fuelType === "electric").slice(0, 3);
  if (!evs.length) return null;
  return (
    <section className="py-14 bg-gradient-to-br from-[#F0FDF4] to-[#F8F9FB]">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-bold text-green-600 uppercase tracking-widest mb-2">⚡ Go Green</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-1">Electric Fleet</h2>
            <p className="text-[#6B7280]">Zero emissions, full performance — the future of driving</p>
          </div>
          <Link href="/cars?category=ev">
            <Button variant="outline" className="hidden sm:flex gap-1 text-green-600 border-green-200 hover:bg-green-50">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {evs.map((car, idx) => <CarCard key={car.id} car={car} index={idx} />)}
        </div>
      </div>
    </section>
  );
}

export function PopularCars() {
  const popular = [...MOCK_CARS].sort((a, b) => b.totalTrips - a.totalTrips).slice(0, 3);
  return (
    <CarSection
      badge="🔥 Trending"
      title="Most Popular"
      subtitle="Loved by thousands of happy renters"
      cars={popular}
      viewAllHref="/cars?sort=trips"
    />
  );
}
