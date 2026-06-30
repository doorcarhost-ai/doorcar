"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (pickupDate) params.set("pickup", pickupDate);
    if (returnDate) params.set("return", returnDate);
    router.push(`/cars?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="relative z-20 -mt-8 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-background/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-4 sm:p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Location */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted hover:bg-accent transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                Pickup City
              </p>
              <input
                type="text"
                placeholder="Enter city..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-sm font-semibold w-full outline-none placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Pickup Date */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted hover:bg-accent transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                Pickup Date
              </p>
              <input
                type="date"
                min={today}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="bg-transparent text-sm font-semibold w-full outline-none"
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted hover:bg-accent transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                Pickup Time
              </p>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="bg-transparent text-sm font-semibold w-full outline-none"
              />
            </div>
          </div>

          {/* Return Date */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted hover:bg-accent transition-colors cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">
                Return Date
              </p>
              <input
                type="date"
                min={pickupDate || today}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="bg-transparent text-sm font-semibold w-full outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="gradient"
            size="lg"
            onClick={handleSearch}
            className="w-full sm:w-auto gap-2 h-12 px-8"
          >
            <Search className="h-4 w-4" />
            Search Cars
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
