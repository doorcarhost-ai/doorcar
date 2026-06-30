"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDIA_CITIES } from "@/lib/cities";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");
  const [cityOpen, setCityOpen] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);
  const pickupDateRef = useRef<HTMLInputElement>(null);
  const pickupTimeRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const returnTimeRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const filtered = location
    ? INDIA_CITIES.filter((c) => c.name.toLowerCase().includes(location.toLowerCase())).slice(0, 8)
    : INDIA_CITIES.slice(0, 8);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function openPicker(ref: React.RefObject<HTMLInputElement | null>) {
    if (!ref.current) return;
    try { (ref.current as HTMLInputElement & { showPicker?: () => void }).showPicker?.(); }
    catch { ref.current.focus(); }
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (pickupDate) params.set("pickup", pickupDate);
    if (returnDate) params.set("return", returnDate);
    router.push(`/cars?${params.toString()}`);
  };

  const hasValues = location || pickupDate || returnDate;

  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="glass rounded-3xl shadow-premium-lg border border-white/60 p-4 sm:p-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {/* City */}
          <div ref={cityRef} className="relative lg:col-span-1">
            <div className={cn(
              "flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border transition-colors cursor-text",
              cityOpen ? "border-[#FF7A00] shadow-sm" : "border-[#E5E7EB] hover:border-[#FF7A00]/40"
            )}>
              <div className="h-8 w-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-[#FF7A00]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-0.5">Pickup City</p>
                <input
                  type="text"
                  placeholder="Where?"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setCityOpen(true); }}
                  onFocus={() => setCityOpen(true)}
                  className="bg-transparent text-sm font-semibold text-[#111827] w-full outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
              {location && (
                <button onClick={() => { setLocation(""); setCityOpen(false); }} className="shrink-0 text-[#9CA3AF] hover:text-[#6B7280]">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {cityOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-premium-lg z-50 overflow-hidden">
                {filtered.length === 0 && <p className="px-4 py-3 text-sm text-[#6B7280]">No cities found</p>}
                {filtered.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-[#FFF8F3] hover:text-[#FF7A00] transition-colors text-left"
                    onMouseDown={(e) => { e.preventDefault(); setLocation(city.name); setCityOpen(false); }}
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
                    <span className="font-medium text-[#111827]">{city.name}</span>
                    <span className="text-xs text-[#9CA3AF] ml-auto">{city.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pickup Date */}
          <div
            className={cn("flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border transition-colors cursor-pointer", pickupDate ? "border-[#FF7A00]/30" : "border-[#E5E7EB] hover:border-[#FF7A00]/40")}
            onClick={() => openPicker(pickupDateRef)}
          >
            <div className="h-8 w-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0 pointer-events-none">
              <Calendar className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-0.5 pointer-events-none">Pickup Date</p>
              <input
                ref={pickupDateRef}
                type="date"
                min={today}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-[#111827] w-full outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Pickup Time */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#FF7A00]/40 transition-colors cursor-pointer"
            onClick={() => openPicker(pickupTimeRef)}
          >
            <div className="h-8 w-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0 pointer-events-none">
              <Clock className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-0.5 pointer-events-none">Pickup Time</p>
              <input
                ref={pickupTimeRef}
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="bg-transparent text-sm font-semibold text-[#111827] w-full outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Return Date */}
          <div
            className={cn("flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border transition-colors cursor-pointer", returnDate ? "border-[#FF7A00]/30" : "border-[#E5E7EB] hover:border-[#FF7A00]/40")}
            onClick={() => openPicker(returnDateRef)}
          >
            <div className="h-8 w-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0 pointer-events-none">
              <Calendar className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-0.5 pointer-events-none">Return Date</p>
              <input
                ref={returnDateRef}
                type="date"
                min={pickupDate || today}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="bg-transparent text-sm font-semibold text-[#111827] w-full outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Search CTA */}
          <Button
            type="button"
            variant="gradient"
            size="lg"
            onClick={handleSearch}
            className="w-full h-full min-h-[64px] gap-2 text-base font-bold shadow-orange"
          >
            <Search className="h-5 w-5" />Search Cars
          </Button>
        </div>

        {/* Quick city suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-[#9CA3AF] font-medium">Popular:</span>
          {["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"].map((city) => (
            <button
              key={city}
              onClick={() => setLocation(city)}
              className={cn(
                "text-xs px-3 py-1 rounded-full border transition-colors font-medium",
                location === city ? "bg-[#FF7A00] text-white border-[#FF7A00]" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#FF7A00]/40 hover:text-[#FF7A00]"
              )}
            >
              {city}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
