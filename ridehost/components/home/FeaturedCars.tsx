"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/cars/CarCard";
import { MOCK_CARS } from "@/data/mock-data";

export function FeaturedCars() {
  const featuredCars = MOCK_CARS.filter((car) => car.available).slice(0, 3);

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Featured Cars
          </h2>
          <p className="text-muted-foreground">
            Hand-picked premium vehicles for an exceptional experience
          </p>
        </div>
        <Link href="/cars">
          <Button variant="ghost" className="gap-1 text-primary hidden sm:flex">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredCars.map((car, idx) => (
          <CarCard key={car.id} car={car} index={idx} />
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link href="/cars">
          <Button variant="outline" className="w-full gap-1">
            View All Cars
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
