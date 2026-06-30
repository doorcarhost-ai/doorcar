"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Heart,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  X,
  Car,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CITIES, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MOCK_USER } from "@/data/mock-data";

const navLinks = [
  { href: "/cars", label: "Explore Cars" },
  { href: "/trips", label: "My Trips" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityDropdown, setCityDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setCityDropdown(false);
    setProfileDropdown(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600">
                <Car className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {APP_NAME}
              </span>
            </Link>

            {/* City Selector - desktop */}
            <div className="hidden md:block relative">
              <button
                onClick={() => {
                  setCityDropdown(!cityDropdown);
                  setProfileDropdown(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-accent transition-colors"
              >
                <MapPin className="h-4 w-4 text-primary" />
                <span>{selectedCity}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    cityDropdown && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {cityDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-popover border border-border rounded-2xl shadow-xl p-2 z-50"
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1 mb-1">
                      Select City
                    </p>
                    {CITIES.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city.name);
                          setCityDropdown(false);
                        }}
                        className={cn(
                          "flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors",
                          selectedCity === city.name && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        {city.name}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {city.state}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Nav Links - desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 dark:hidden" />
                <Moon className="h-4 w-4 hidden dark:block" />
              </button>

              {/* Notifications */}
              <Link
                href="/trips"
                className="h-9 w-9 hidden md:flex items-center justify-center rounded-xl hover:bg-accent transition-colors relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              </Link>

              {/* Profile - desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => {
                    setProfileDropdown(!profileDropdown);
                    setCityDropdown(false);
                  }}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-accent transition-colors"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                    <AvatarFallback>
                      {MOCK_USER.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {MOCK_USER.name.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform",
                      profileDropdown && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-2xl shadow-xl p-2 z-50"
                    >
                      <div className="px-3 py-2 mb-2">
                        <p className="font-semibold">{MOCK_USER.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {MOCK_USER.email}
                        </p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {MOCK_USER.totalTrips} trips completed
                        </Badge>
                      </div>
                      <div className="border-t border-border pt-2 space-y-0.5">
                        <DropdownItem
                          href="/profile"
                          icon={User}
                          label="My Profile"
                        />
                        <DropdownItem
                          href="/trips"
                          icon={Car}
                          label="My Trips"
                        />
                        <DropdownItem
                          href="/profile"
                          icon={Heart}
                          label="Wishlist"
                        />
                        <DropdownItem
                          href="/profile"
                          icon={Settings}
                          label="Settings"
                        />
                        <div className="border-t border-border pt-2 mt-2">
                          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl hover:bg-accent transition-colors"
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border md:hidden overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* City picker */}
              <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-muted">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Location: {selectedCity}</span>
                <button
                  onClick={() => setCityDropdown(!cityDropdown)}
                  className="ml-auto text-xs text-primary font-semibold"
                >
                  Change
                </button>
              </div>

              {cityDropdown && (
                <div className="grid grid-cols-2 gap-2 px-1">
                  {CITIES.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city.name);
                        setCityDropdown(false);
                      }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-border hover:border-primary transition-colors",
                        selectedCity === city.name && "border-primary bg-primary/10 text-primary"
                      )}
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      {city.name}
                    </button>
                  ))}
                </div>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border pt-3 mt-3 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={MOCK_USER.avatar} />
                  <AvatarFallback>{MOCK_USER.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{MOCK_USER.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {MOCK_USER.email}
                  </p>
                </div>
                <Link href="/profile" className="ml-auto">
                  <Button size="sm" variant="outline">
                    Profile
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdowns */}
      {(cityDropdown || profileDropdown) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setCityDropdown(false);
            setProfileDropdown(false);
          }}
        />
      )}
    </>
  );
}

function DropdownItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-accent transition-colors"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </Link>
  );
}
