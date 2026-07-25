"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Car, ChevronDown, LogOut, MapPin, Menu, Moon, Search,
  Settings, Sun, User, X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { INDIA_CITIES } from "@/lib/cities";
import { cn } from "@/lib/utils";
import { MOCK_USER } from "@/data/mock-data";

const navLinks = [
  { href: "/cars", label: "Explore Cars" },
  { href: "/trips", label: "My Trips" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCityOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const filteredCities = citySearch
    ? INDIA_CITIES.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 8)
    : INDIA_CITIES.slice(0, 10);

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-xl border-b border-[#E5E7EB] shadow-sm" : "bg-white/80 backdrop-blur-sm"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF7A00] shadow-orange">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#111827] tracking-tight">
                Door<span className="text-[#FF7A00]">Car</span>
              </span>
            </Link>

            {/* City — desktop */}
            <div ref={cityRef} className="hidden md:block relative">
              <button
                onClick={() => { setCityOpen(!cityOpen); setProfileOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors"
              >
                <MapPin className="h-4 w-4 text-[#FF7A00]" />
                <span className="text-[#111827] font-semibold">{selectedCity}</span>
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", cityOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {cityOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-2xl shadow-premium-lg p-3 z-50"
                  >
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B7280]" />
                      <input
                        autoFocus
                        placeholder="Search city..."
                        value={citySearch}
                        onChange={(e) => setCitySearch(e.target.value)}
                        className="w-full pl-8 pr-3 h-8 text-sm bg-gray-50 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
                      />
                    </div>
                    {!citySearch && <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider px-2 py-1">Popular Cities</p>}
                    <div className="max-h-52 overflow-y-auto space-y-0.5">
                      {filteredCities.map((city) => (
                        <button key={city.id} onClick={() => { setSelectedCity(city.name); setCityOpen(false); setCitySearch(""); }}
                          className={cn("flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm transition-colors",
                            selectedCity === city.name ? "bg-[#FF7A00]/10 text-[#FF7A00] font-semibold" : "hover:bg-gray-50 text-[#111827]"
                          )}
                        >
                          <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-[#6B7280]" />{city.name}</span>
                          <span className="text-xs text-[#6B7280]">{city.state.slice(0, 6)}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "bg-[#FF7A00]/10 text-[#FF7A00]"
                      : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 flex items-center justify-center rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="h-4 w-4 hidden dark:block" />
              </button>

              <Link href="/trips" className="h-9 w-9 hidden md:flex items-center justify-center rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#FF7A00]" />
              </Link>

              {/* Profile dropdown — desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setCityOpen(false); }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={MOCK_USER.avatar} />
                    <AvatarFallback className="bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-bold">{MOCK_USER.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold text-[#111827]">{MOCK_USER.name.split(" ")[0]}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-[#6B7280] transition-transform", profileOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-52 bg-white border border-[#E5E7EB] rounded-2xl shadow-premium-lg p-2 z-50"
                    >
                      <div className="px-3 py-2.5 mb-1 border-b border-[#E5E7EB]">
                        <p className="font-semibold text-sm text-[#111827]">{MOCK_USER.name}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{MOCK_USER.email}</p>
                      </div>
                      {[
                        { href: "/profile", icon: User, label: "My Profile" },
                        { href: "/trips", icon: Car, label: "My Trips" },
                        { href: "/admin", icon: Settings, label: "Admin Panel" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[#6B7280] hover:text-[#111827] hover:bg-gray-50 transition-colors">
                          <item.icon className="h-4 w-4" />{item.label}
                        </Link>
                      ))}
                      <div className="border-t border-[#E5E7EB] mt-1 pt-1">
                        <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="h-4 w-4" />Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors text-[#6B7280]">
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#E5E7EB] md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-gray-50">
                <MapPin className="h-4 w-4 text-[#FF7A00]" />
                <span className="text-sm font-semibold text-[#111827]">{selectedCity}</span>
                <button onClick={() => setCityOpen(!cityOpen)} className="ml-auto text-xs text-[#FF7A00] font-bold">Change</button>
              </div>
              {cityOpen && (
                <div className="p-2 bg-gray-50 rounded-xl">
                  <input
                    placeholder="Search city..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full px-3 h-8 text-sm bg-white rounded-lg border border-[#E5E7EB] focus:outline-none mb-2"
                  />
                  <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                    {filteredCities.map((city) => (
                      <button key={city.id} onClick={() => { setSelectedCity(city.name); setCityOpen(false); setCitySearch(""); setMenuOpen(false); }}
                        className={cn("px-3 py-2 rounded-lg text-sm text-left transition-colors", selectedCity === city.name ? "bg-[#FF7A00] text-white font-semibold" : "bg-white text-[#111827] border border-[#E5E7EB]")}
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className={cn("flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname.startsWith(link.href) ? "bg-[#FF7A00]/10 text-[#FF7A00]" : "text-[#6B7280] hover:text-[#111827] hover:bg-gray-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 px-3 py-3 border-t border-[#E5E7EB] mt-2 pt-4">
                <Avatar className="h-10 w-10"><AvatarImage src={MOCK_USER.avatar} /><AvatarFallback>{MOCK_USER.name.charAt(0)}</AvatarFallback></Avatar>
                <div><p className="font-semibold text-sm">{MOCK_USER.name}</p><p className="text-xs text-[#6B7280]">{MOCK_USER.email}</p></div>
                <Link href="/profile" className="ml-auto"><Button size="sm" variant="outline">Profile</Button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(cityOpen || profileOpen) && (
        <div className="fixed inset-0 z-30" onClick={() => { setCityOpen(false); setProfileOpen(false); }} />
      )}
    </>
  );
}
