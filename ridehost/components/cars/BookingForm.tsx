"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Calendar, Clock, Shield } from "lucide-react";
import { Car } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { VerificationGate } from "@/components/shared/VerificationGate";
import { bookingFormSchema, BookingFormData } from "@/lib/validations";
import { calculateBookingAmount, calculateHours, formatCurrency } from "@/lib/utils";
import { BOOKING_MIN_HOURS } from "@/lib/constants";
import { MOCK_USER } from "@/data/mock-data";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  car: Car;
}

export function BookingForm({ car }: BookingFormProps) {
  const router = useRouter();
  const [rentalAmount, setRentalAmount] = useState(0);
  const [hours, setHours] = useState(0);
  const [verificationGateOpen, setVerificationGateOpen] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });

  const { pickupDate, pickupTime, returnDate, returnTime } = watch();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (pickupDate && pickupTime && returnDate && returnTime) {
      const h = calculateHours(pickupDate, pickupTime, returnDate, returnTime);
      if (h > 0) {
        const { rentalAmount: base } = calculateBookingAmount(h, car.hourlyPrice, car.minBookingHours, car.extraHourCharge);
        const extraH = Math.max(0, Math.max(h, car.minBookingHours) - car.minBookingHours);
        setHours(h);
        setRentalAmount(base + extraH * car.extraHourCharge);
      }
    }
  }, [pickupDate, pickupTime, returnDate, returnTime, car]);

  const onSubmit = (data: BookingFormData) => {
    const isVerified = MOCK_USER.verification.overallStatus === "verified";
    if (!isVerified) { setVerificationGateOpen(true); return; }
    const params = new URLSearchParams({ pickupDate: data.pickupDate, pickupTime: data.pickupTime, returnDate: data.returnDate, returnTime: data.returnTime, hours: hours.toString() });
    router.push(`/booking/${car.id}?${params.toString()}`);
  };

  const minHoursNotMet = hours > 0 && hours < BOOKING_MIN_HOURS;

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium-lg overflow-hidden sticky top-24">
        {/* Price header */}
        <div className="p-5 border-b border-[#E5E7EB] bg-gradient-to-r from-[#FFF8F3] to-[#FFFAF5]">
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-bold text-[#111827]">{formatCurrency(car.hourlyPrice)}</span>
            <span className="text-[#6B7280] text-sm">/hour</span>
          </div>
          <p className="text-sm text-[#6B7280]">Min. {car.minBookingHours} hrs · {formatCurrency(car.hourlyPrice * 24)}/day</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />Pickup Date
              </Label>
              <input type="date" min={today} {...register("pickupDate")}
                className={cn("w-full h-10 px-3 rounded-xl border bg-[#F8F9FB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] transition-colors",
                  errors.pickupDate ? "border-red-400" : "border-[#E5E7EB]")}
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />Pickup Time
              </Label>
              <input type="time" {...register("pickupTime")}
                className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />Return Date
              </Label>
              <input type="date" min={pickupDate || today} {...register("returnDate")}
                className={cn("w-full h-10 px-3 rounded-xl border bg-[#F8F9FB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] transition-colors",
                  errors.returnDate ? "border-red-400" : "border-[#E5E7EB]")}
              />
              {errors.returnDate && <p className="text-xs text-red-500 mt-1">{errors.returnDate.message}</p>}
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#6B7280] mb-1.5 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />Return Time
              </Label>
              <input type="time" {...register("returnTime")}
                className="w-full h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00] transition-colors"
              />
            </div>
          </div>

          {minHoursNotMet && (
            <div className="flex gap-2 p-3 rounded-xl bg-[#FFF8F3] border border-[#FF7A00]/20">
              <AlertCircle className="h-4 w-4 text-[#FF7A00] shrink-0 mt-0.5" />
              <p className="text-xs text-[#FF7A00]">Minimum booking is {BOOKING_MIN_HOURS} hours.</p>
            </div>
          )}

          {/* Rental Amount — ONLY show rental, no deposit */}
          {hours > 0 && !minHoursNotMet && (
            <div className="rounded-2xl bg-[#FFF8F3] border border-[#FF7A00]/20 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#6B7280]">Duration</span>
                <span className="text-sm font-semibold text-[#111827]">{Math.round(hours)} hours</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#111827]">Rental Amount</span>
                <span className="text-xl font-bold text-[#FF7A00]">{formatCurrency(rentalAmount)}</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-2 flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Other charges collected after booking approval
              </p>
            </div>
          )}

          <Button type="submit" variant="gradient" size="xl" className="w-full" disabled={!car.available || minHoursNotMet}>
            {!car.available ? "Currently Unavailable" : "Book Now"}
          </Button>
          <p className="text-center text-xs text-[#6B7280]">Free cancellation up to 24 hours before pickup</p>
        </form>
      </div>

      <VerificationGate open={verificationGateOpen} onClose={() => setVerificationGateOpen(false)} />
    </>
  );
}
