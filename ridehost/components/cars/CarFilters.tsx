"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CAR_CATEGORIES,
  FUEL_TYPES,
  SORT_OPTIONS,
  TRANSMISSION_TYPES,
} from "@/lib/constants";
import { FilterState } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CarFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export function CarFilters({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}: CarFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeCount =
    filters.category.length +
    filters.fuelType.length +
    filters.transmission.length +
    (filters.available ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold mb-3">Sort By</h3>
        <div className="space-y-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onFilterChange({ sortBy: option.id })}
            className={cn(
                        "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors",
                        filters.sortBy === option.id
                          ? "bg-[#FF7A00] text-white font-semibold"
                          : "hover:bg-gray-50 text-[#6B7280]"
                      )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Category */}
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {CAR_CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={filters.category.includes(cat.id)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...filters.category, cat.id]
                    : filters.category.filter((c) => c !== cat.id);
                  onFilterChange({ category: newCategories });
                }}
              />
              <Label
                htmlFor={`cat-${cat.id}`}
                className="text-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">
          Hourly Price
          <span className="font-normal text-muted-foreground ml-2 text-sm">
            {formatCurrency(filters.minPrice)} -{" "}
            {formatCurrency(filters.maxPrice)}
          </span>
        </h3>
        <Slider
          min={0}
          max={500}
          step={10}
          value={[filters.maxPrice]}
          onValueChange={([val]) => onFilterChange({ maxPrice: val })}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>₹0</span>
          <span>₹500/hr</span>
        </div>
      </div>

      <Separator />

      {/* Fuel Type */}
      <div>
        <h3 className="font-semibold mb-3">Fuel Type</h3>
        <div className="space-y-2">
          {FUEL_TYPES.map((fuel) => (
            <div key={fuel.id} className="flex items-center gap-2">
              <Checkbox
                id={`fuel-${fuel.id}`}
                checked={filters.fuelType.includes(fuel.id)}
                onCheckedChange={(checked) => {
                  const newFuels = checked
                    ? [...filters.fuelType, fuel.id]
                    : filters.fuelType.filter((f) => f !== fuel.id);
                  onFilterChange({ fuelType: newFuels });
                }}
              />
              <Label
                htmlFor={`fuel-${fuel.id}`}
                className="text-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>{fuel.icon}</span>
                {fuel.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Transmission */}
      <div>
        <h3 className="font-semibold mb-3">Transmission</h3>
        <div className="space-y-2">
          {TRANSMISSION_TYPES.map((trans) => (
            <div key={trans.id} className="flex items-center gap-2">
              <Checkbox
                id={`trans-${trans.id}`}
                checked={filters.transmission.includes(trans.id)}
                onCheckedChange={(checked) => {
                  const newTrans = checked
                    ? [...filters.transmission, trans.id]
                    : filters.transmission.filter((t) => t !== trans.id);
                  onFilterChange({ transmission: newTrans });
                }}
              />
              <Label
                htmlFor={`trans-${trans.id}`}
                className="text-sm cursor-pointer"
              >
                {trans.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Availability */}
      <div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="available"
            checked={filters.available}
            onCheckedChange={(checked) =>
              onFilterChange({ available: !!checked })
            }
          />
          <Label htmlFor="available" className="text-sm cursor-pointer">
            Available only
          </Label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-20 bg-white border border-[#E5E7EB] rounded-3xl p-5 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-premium">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </h2>
            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-xs text-primary font-medium hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <FilterPanel />
        </div>
      </aside>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4 flex items-center gap-2">
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Filters</span>
                {activeCount > 0 && (
                  <button
                    onClick={onReset}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </DialogTitle>
            </DialogHeader>
            <FilterPanel />
            <Button
              variant="gradient"
              className="w-full mt-4"
              onClick={() => setMobileOpen(false)}
            >
              Show {totalResults} Results
            </Button>
          </DialogContent>
        </Dialog>

        <p className="text-sm text-muted-foreground">
          {totalResults} cars found
        </p>
      </div>
    </>
  );
}
