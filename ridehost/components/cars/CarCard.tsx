"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Fuel,
  Heart,
  MapPin,
  Settings2,
  Shield,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Car } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CarCardProps {
  car: Car;
  index?: number;
}

export function CarCard({ car, index = 0 }: CarCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  const fuelIconMap: Record<string, React.ReactNode> = {
    electric: <Zap className="h-3.5 w-3.5" />,
    petrol: <Fuel className="h-3.5 w-3.5" />,
    diesel: <Fuel className="h-3.5 w-3.5" />,
    hybrid: <Fuel className="h-3.5 w-3.5" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={car.images[0]}
          alt={car.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {car.available ? (
            <Badge variant="success" className="shadow-sm">
              Available
            </Badge>
          ) : (
            <Badge variant="secondary">Unavailable</Badge>
          )}
          {car.verified && (
            <Badge
              variant="info"
              className="shadow-sm flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-base truncate">{car.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground truncate">
                {car.location}
              </span>
            </div>
          </div>
        </div>

        {/* Rating & Trips */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{car.rating}</span>
          </div>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span className="text-xs text-muted-foreground">
            {car.totalTrips.toLocaleString()} trips
          </span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-muted font-medium">
            {fuelIconMap[car.fuelType]}
            <span className="capitalize">{car.fuelType}</span>
          </span>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-muted font-medium">
            <Settings2 className="h-3.5 w-3.5" />
            <span className="capitalize">{car.transmission}</span>
          </span>
          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-muted font-medium">
            <Users className="h-3.5 w-3.5" />
            {car.seats} Seats
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">
                {formatCurrency(car.hourlyPrice)}
              </span>
              <span className="text-xs text-muted-foreground">/hr</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Min. {car.minBookingHours}hr booking
            </p>
          </div>
          <Link href={`/cars/${car.id}`}>
            <Button
              variant="gradient"
              size="sm"
              disabled={!car.available}
              className="shrink-0"
            >
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
