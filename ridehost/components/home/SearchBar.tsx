"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDIA_CITIES } from "@/lib/cities";

export function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openPicker(ref: React.RefObject<HTMLInputElement | null>) {
    if (!ref.current) return;
    try {
      (ref.current as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      ref.current.focus();
      ref.current.click();
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("city", location);
    if (pickupDate) params.set("pickup", pickupDate);
    if (returnDate) params.set("return", returnDate);
    router.push(`/cars?${params.toString()}`);
  };

  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65 }}
        className="glass rounded-3xl shadow-premium-lg border border-white/60 p-4 sm:p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {/* City Picker */}
          <div ref={cityRef} className="relative lg:col-span-1">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#FF7A00]/40 transition-colors cursor-text">
              <div className="h-8 w-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-[#FF7A00]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#6B7280] mb-0.5">Pickup City</p>
                <input
                  type="text"
                  placeholder="Where?"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setCityOpen(true); }}
                  onFocus={() => setCityOpen(true)}
                  className="bg-transparent text-sm font-semibold text-[#111827] w-full outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>
            {cityOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-premium-lg z-50 overflow-hidden max-h-56 overflow-y-auto">
                {filtered.length === 0 && (
                  <p className="px-4 py-3 text-sm text-[#6B7280]">No cities found</p>
                )}
                {filtered.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-[#FFF8F3] hover:text-[#FF7A00] transition-colors text-left"
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevent blur
                      setLocation(city.name);
                      setCityOpen(false);
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#6B7280] shrink-0" />
                    <span className="font-medium text-[#111827]">{city.name}</span>
                    <span className="text-xs text-[#9CA3AF] ml-auto">{city.state}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Pickup Date */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#FF7A00]/40 transition-colors cursor-pointer"
            onClick={() => openPicker(pickupDateRef)}
          >
            <div className="h-8 w-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0 pointer-events-none">
              <Calendar className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#6B7280] mb-0.5 pointer-events-none">Pickup Date</p>
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
              <p className="text-xs font-semibold text-[#6B7280] mb-0.5 pointer-events-none">Pickup Time</p>
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
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#FF7A00]/40 transition-colors cursor-pointer"
            onClick={() => openPicker(returnDateRef)}
          >
            <div className="h-8 w-8 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center shrink-0 pointer-events-none">
              <Calendar className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#6B7280] mb-0.5 pointer-events-none">Return Date</p>
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

          {/* Search */}
          <div className="lg:col-span-1">
            <Button
              type="button"
              variant="gradient"
              size="lg"
              onClick={handleSearch}
              className="w-full h-full min-h-[60px] gap-2 text-base"
            >
              <Search className="h-4 w-4" />Search Cars
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
