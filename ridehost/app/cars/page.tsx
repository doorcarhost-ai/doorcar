"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Car, Search, SlidersHorizontal } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { CarCard } from "@/components/cars/CarCard";
import { CarFilters } from "@/components/cars/CarFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { CarCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { CAR_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
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
    sortBy: (searchParams.get("sort") as FilterState["sortBy"]) || "trips",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => setFilters((p) => ({ ...p, ...newFilters }));
  const handleReset = () => { setFilters(DEFAULT_FILTERS); setSearchQuery(""); };

  const filteredCars = useMemo(() => {
    let cars = [...MOCK_CARS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cars = cars.filter((c) => c.name.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q));
    }
    if (filters.category.length) cars = cars.filter((c) => filters.category.includes(c.category));
    if (filters.fuelType.length) cars = cars.filter((c) => filters.fuelType.includes(c.fuelType as FuelType));
    if (filters.transmission.length) cars = cars.filter((c) => filters.transmission.includes(c.transmission as TransmissionType));
    cars = cars.filter((c) => c.hourlyPrice <= filters.maxPrice);
    if (filters.available) cars = cars.filter((c) => c.available);
    switch (filters.sortBy) {
      case "price_low": cars.sort((a, b) => a.hourlyPrice - b.hourlyPrice); break;
      case "price_high": cars.sort((a, b) => b.hourlyPrice - a.hourlyPrice); break;
      case "rating": cars.sort((a, b) => b.rating - a.rating); break;
      case "trips": cars.sort((a, b) => b.totalTrips - a.totalTrips); break;
      case "newest": cars.sort((a, b) => b.year - a.year); break;
    }
    return cars;
  }, [filters, searchQuery]);

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />

      {/* Page hero */}
      <div className="bg-white border-b border-[#E5E7EB] pt-20 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#111827] mb-1">Explore Cars</h1>
          <p className="text-[#6B7280]">{MOCK_CARS.length} cars available · Find your perfect ride</p>

          {/* Search */}
          <div className="mt-5 relative max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search by brand, model, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 h-11 rounded-2xl bg-[#F8F9FB] border border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <button
            onClick={() => handleFilterChange({ category: [] })}
            className={cn("shrink-0 px-4 py-2 rounded-2xl text-sm font-semibold border transition-all",
              filters.category.length === 0 ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-orange" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#FF7A00]/40"
            )}
          >
            All Cars
          </button>
          {CAR_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange({ category: filters.category.includes(cat.id) ? [] : [cat.id] })}
              className={cn("shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold border transition-all",
                filters.category.includes(cat.id)
                  ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-orange"
                  : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#FF7A00]/40"
              )}
            >
              <span>{cat.icon}</span>{cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          <CarFilters filters={filters} onFilterChange={handleFilterChange} onReset={handleReset} totalResults={filteredCars.length} />

          <div className="flex-1 min-w-0">
            {/* Sort + count */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <p className="text-sm text-[#6B7280]">
                <span className="font-bold text-[#111827]">{filteredCars.length}</span> cars found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#6B7280] hidden sm:block">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterState["sortBy"] })}
                  className="text-sm font-semibold text-[#111827] bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)}
              </div>
            ) : filteredCars.length === 0 ? (
              <EmptyState icon={Car} title="No cars found" description="Try adjusting your filters or search term"
                action={{ label: "Reset Filters", onClick: handleReset }}
              />
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredCars.map((car, idx) => (
                    <motion.div key={car.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" /></div>}>
      <CarsContent />
    </Suspense>
  );
}
