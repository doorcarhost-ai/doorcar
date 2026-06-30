"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, Map, User } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cars", label: "Cars", icon: Car },
  { href: "/trips", label: "Trips", icon: Map },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E5E7EB]">
      <div className="grid grid-cols-4 py-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 py-2 relative">
              <div className="relative">
                {isActive && (
                  <motion.div layoutId="nav-indicator" className="absolute -inset-2 rounded-xl bg-[#FF7A00]/10" initial={false} transition={{ type: "spring", duration: 0.4 }} />
                )}
                <Icon className={cn("h-5 w-5 relative z-10 transition-colors", isActive ? "text-[#FF7A00]" : "text-[#6B7280]")} />
              </div>
              <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-[#FF7A00]" : "text-[#6B7280]")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
