"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { CarCard } from "@/components/cars/CarCard";
import { CarFilters } from "@/components/cars/CarFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { CarCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { CAR_CATEGORIES } from "@/lib/constants";
import { MOCK_CARS } from "@/data/mock-data";
import { FilterState, CarCategory, FuelType, TransmissionType } from "@/types";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: FilterState = {
  category: [],
  fuelType: [],
  transmission: [],
  minPrice: 0,
  maxPrice: 500,
  seats: [],
  rating: 0,
  available: false,
  sortBy: "trips",
};

function CarsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as CarCategory | null;

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: initialCategory ? [initialCategory] : [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery("");
  };

  const filteredCars = useMemo(() => {
    let cars = [...MOCK_CARS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cars = cars.filter(
        (car) =>
          car.name.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q)
      );
    }

    if (filters.category.length > 0) {
      cars = cars.filter((car) => filters.category.includes(car.category));
    }

    if (filters.fuelType.length > 0) {
      cars = cars.filter((car) =>
        filters.fuelType.includes(car.fuelType as FuelType)
      );
    }

    if (filters.transmission.length > 0) {
      cars = cars.filter((car) =>
        filters.transmission.includes(car.transmission as TransmissionType)
      );
    }

    cars = cars.filter((car) => car.hourlyPrice <= filters.maxPrice);

    if (filters.available) {
      cars = cars.filter((car) => car.available);
    }

    switch (filters.sortBy) {
      case "price_low":
        cars.sort((a, b) => a.hourlyPrice - b.hourlyPrice);
        break;
      case "price_high":
        cars.sort((a, b) => b.hourlyPrice - a.hourlyPrice);
        break;
      case "rating":
        cars.sort((a, b) => b.rating - a.rating);
        break;
      case "trips":
        cars.sort((a, b) => b.totalTrips - a.totalTrips);
        break;
      case "newest":
        cars.sort((a, b) => b.year - a.year);
        break;
    }

    return cars;
  }, [filters, searchQuery]);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Page header */}
      <div className="bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950 pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Cars</h1>
          <p className="text-white/70">
            {MOCK_CARS.length} cars available in your city
          </p>

          {/* Search input */}
          <div className="mt-6 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by brand, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Category quick filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <button
            onClick={() => handleFilterChange({ category: [] })}
            className={cn(
              "shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-colors",
              filters.category.length === 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary"
            )}
          >
            All Cars
          </button>
          {CAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const isSelected = filters.category.includes(cat.id);
                handleFilterChange({
                  category: isSelected ? [] : [cat.id],
                });
              }}
              className={cn(
                "shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors",
                filters.category.includes(cat.id)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary"
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <CarFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            totalResults={filteredCars.length}
          />

          {/* Car grid */}
          <div className="flex-1 min-w-0">
            <div className="hidden lg:flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {filteredCars.length}
                </span>{" "}
                cars found
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CarCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCars.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No cars found"
                description="Try adjusting your filters or search for a different term."
                action={{ label: "Reset Filters", onClick: handleReset }}
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredCars.map((car, idx) => (
                    <motion.div
                      key={car.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CarCard car={car} index={idx} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}

export default function CarsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsContent />
    </Suspense>
  );
}
