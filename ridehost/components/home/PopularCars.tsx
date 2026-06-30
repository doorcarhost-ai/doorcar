"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/cars/CarCard";
import { MOCK_CARS } from "@/data/mock-data";

export function PopularCars() {
  const popularCars = [...MOCK_CARS]
    .sort((a, b) => b.totalTrips - a.totalTrips)
    .slice(0, 4);

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Most Popular
          </h2>
          <p className="text-muted-foreground">
            Cars loved by thousands of happy renters
          </p>
        </div>
        <Link href="/cars?sort=trips">
          <Button variant="ghost" className="gap-1 text-primary hidden sm:flex">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {popularCars.map((car, idx) => (
          <CarCard key={car.id} car={car} index={idx} />
        ))}
      </div>
    </section>
  );
}
