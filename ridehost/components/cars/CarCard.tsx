"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Fuel, Heart, MapPin, Settings2, Star, Users, Zap, BadgeCheck } from "lucide-react";
import { Car } from "@/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CarCardProps {
  car: Car;
  index?: number;
  variant?: "default" | "featured" | "compact";
}

export function CarCard({ car, index = 0, variant = "default" }: CarCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const fuelMap: Record<string, React.ReactNode> = {
    electric: <Zap className="h-3 w-3" />,
    petrol: <Fuel className="h-3 w-3" />,
    diesel: <Fuel className="h-3 w-3" />,
    hybrid: <Fuel className="h-3 w-3" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-premium hover:shadow-premium-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          className={cn("object-cover transition-transform duration-700", hovered && "scale-110")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {car.available ? (
            <span className="px-2.5 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-wide">
              Available
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-gray-500 text-white text-[10px] font-bold uppercase tracking-wide">
              Booked
            </span>
          )}
          {car.verified && (
            <span className="px-2.5 py-1 rounded-full bg-white/90 text-[#FF7A00] text-[10px] font-bold flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" />Verified
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors shadow-sm"
        >
          <Heart className={cn("h-4 w-4 transition-colors", wishlisted ? "fill-red-500 text-red-500" : "text-[#6B7280]")} />
        </button>

        {/* Price bottom-left */}
        <div className="absolute bottom-3 left-3">
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-xl font-bold drop-shadow">{formatCurrency(car.hourlyPrice)}</span>
            <span className="text-xs opacity-80">/hr</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <h3 className="font-bold text-[#111827] truncate text-[15px]">{car.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-[#6B7280] shrink-0" />
              <span className="text-xs text-[#6B7280] truncate">{car.location}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-[#FF7A00] text-[#FF7A00]" />
            <span className="text-sm font-bold text-[#111827]">{car.rating}</span>
          </div>
          <span className="text-xs text-[#6B7280]">{car.totalTrips.toLocaleString()} trips</span>
          <span className="text-xs capitalize text-[#6B7280]">{car.category}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {[
            { icon: fuelMap[car.fuelType], label: car.fuelType },
            { icon: <Settings2 className="h-3 w-3" />, label: car.transmission },
            { icon: <Users className="h-3 w-3" />, label: `${car.seats}` },
          ].map((spec, i) => (
            <span key={i} className="flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] bg-gray-50 border border-[#E5E7EB] px-2.5 py-1 rounded-lg capitalize">
              {spec.icon}{spec.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link href={`/cars/${car.id}`}>
          <Button
            variant="gradient"
            className="w-full"
            disabled={!car.available}
          >
            {car.available ? "Book Now" : "Unavailable"}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
