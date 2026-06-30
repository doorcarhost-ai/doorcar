"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { Car } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { VerificationGate } from "@/components/shared/VerificationGate";
import { bookingFormSchema, BookingFormData } from "@/lib/validations";
import { calculateBookingAmount, calculateHours, formatCurrency } from "@/lib/utils";
import { BOOKING_MIN_HOURS } from "@/lib/constants";
import { useVerificationStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  car: Car;
}

function openPicker(ref: React.RefObject<HTMLInputElement | null>) {
  if (!ref.current) return;
  try {
    (ref.current as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
  } catch {
    ref.current.focus();
  }
}

export function BookingForm({ car }: BookingFormProps) {
  const router = useRouter();
  const [rentalAmount, setRentalAmount] = useState(0);
  const [hours, setHours] = useState(0);
  const [verificationGateOpen, setVerificationGateOpen] = useState(false);
  const { userVerificationStatus } = useVerificationStore();

  const pickupDateRef = useRef<HTMLInputElement>(null);
  const pickupTimeRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const returnTimeRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });

  const { pickupDate, pickupTime, returnDate, returnTime } = watch();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (pickupDate && pickupTime && returnDate && returnTime) {
      const h = calculateHours(pickupDate, pickupTime, returnDate, returnTime);
      if (h > 0) {
        const { rentalAmount: base } = calculateBookingAmount(
          h,
          car.hourlyPrice,
          car.minBookingHours,
          car.extraHourCharge
        );
        const extraH = Math.max(0, Math.max(h, car.minBookingHours) - car.minBookingHours);
        setHours(h);
        setRentalAmount(base + extraH * car.extraHourCharge);
      }
    }
  }, [pickupDate, pickupTime, returnDate, returnTime, car]);

  const onSubmit = (data: BookingFormData) => {
    if (userVerificationStatus !== "verified") {
      setVerificationGateOpen(true);
      return;
    }
    const params = new URLSearchParams({
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      returnDate: data.returnDate,
      returnTime: data.returnTime,
      hours: hours.toString(),
    });
    router.push(`/booking/${car.id}?${params.toString()}`);
  };

  const minHoursNotMet = hours > 0 && hours < BOOKING_MIN_HOURS;

  // Get react-hook-form refs merged with our refs
  const pdReg = register("pickupDate");
  const ptReg = register("pickupTime");
  const rdReg = register("returnDate");
  const rtReg = register("returnTime");

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium-lg overflow-hidden sticky top-24">
        {/* Price header */}
        <div className="p-5 border-b border-[#E5E7EB] bg-gradient-to-r from-[#FFF8F3] to-white">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#111827]">{formatCurrency(car.hourlyPrice)}</span>
            <span className="text-[#6B7280]">/hour</span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">
            Min. {car.minBookingHours} hrs · {formatCurrency(car.hourlyPrice * 24)}/day
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3.5">
          {/* Pickup row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Pickup Date */}
            <div>
              <Label
                className="text-xs font-bold text-[#6B7280] mb-1.5 flex items-center gap-1 cursor-pointer"
                onClick={() => openPicker(pickupDateRef)}
              >
                <Calendar className="h-3.5 w-3.5 text-[#FF7A00]" />Pickup Date
              </Label>
              <div
                className={cn(
                  "relative flex items-center h-10 px-3 rounded-xl border bg-[#F8F9FB] cursor-pointer hover:border-[#FF7A00]/50 transition-colors",
                  errors.pickupDate ? "border-red-400" : "border-[#E5E7EB]"
                )}
                onClick={() => openPicker(pickupDateRef)}
              >
                <input
                  type="date"
                  min={today}
                  {...pdReg}
                  ref={(e) => {
                    pdReg.ref(e);
                    (pickupDateRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                  }}
                  className="absolute inset-0 w-full h-full opacity-100 bg-transparent text-sm font-semibold text-[#111827] outline-none px-3 cursor-pointer"
                />
              </div>
            </div>

            {/* Pickup Time */}
            <div>
              <Label
                className="text-xs font-bold text-[#6B7280] mb-1.5 flex items-center gap-1 cursor-pointer"
                onClick={() => openPicker(pickupTimeRef)}
              >
                <Clock className="h-3.5 w-3.5 text-[#FF7A00]" />Pickup Time
              </Label>
              <div
                className="relative flex items-center h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] cursor-pointer hover:border-[#FF7A00]/50 transition-colors"
                onClick={() => openPicker(pickupTimeRef)}
              >
                <input
                  type="time"
                  {...ptReg}
                  ref={(e) => {
                    ptReg.ref(e);
                    (pickupTimeRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                  }}
                  className="absolute inset-0 w-full h-full opacity-100 bg-transparent text-sm font-semibold text-[#111827] outline-none px-3 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Return row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Return Date */}
            <div>
              <Label
                className="text-xs font-bold text-[#6B7280] mb-1.5 flex items-center gap-1 cursor-pointer"
                onClick={() => openPicker(returnDateRef)}
              >
                <Calendar className="h-3.5 w-3.5 text-[#FF7A00]" />Return Date
              </Label>
              <div
                className={cn(
                  "relative flex items-center h-10 px-3 rounded-xl border bg-[#F8F9FB] cursor-pointer hover:border-[#FF7A00]/50 transition-colors",
                  errors.returnDate ? "border-red-400" : "border-[#E5E7EB]"
                )}
                onClick={() => openPicker(returnDateRef)}
              >
                <input
                  type="date"
                  min={pickupDate || today}
                  {...rdReg}
                  ref={(e) => {
                    rdReg.ref(e);
                    (returnDateRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                  }}
                  className="absolute inset-0 w-full h-full opacity-100 bg-transparent text-sm font-semibold text-[#111827] outline-none px-3 cursor-pointer"
                />
              </div>
              {errors.returnDate && (
                <p className="text-xs text-red-500 mt-1">{errors.returnDate.message}</p>
              )}
            </div>

            {/* Return Time */}
            <div>
              <Label
                className="text-xs font-bold text-[#6B7280] mb-1.5 flex items-center gap-1 cursor-pointer"
                onClick={() => openPicker(returnTimeRef)}
              >
                <Clock className="h-3.5 w-3.5 text-[#FF7A00]" />Return Time
              </Label>
              <div
                className="relative flex items-center h-10 px-3 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] cursor-pointer hover:border-[#FF7A00]/50 transition-colors"
                onClick={() => openPicker(returnTimeRef)}
              >
                <input
                  type="time"
                  {...rtReg}
                  ref={(e) => {
                    rtReg.ref(e);
                    (returnTimeRef as React.MutableRefObject<HTMLInputElement | null>).current = e;
                  }}
                  className="absolute inset-0 w-full h-full opacity-100 bg-transparent text-sm font-semibold text-[#111827] outline-none px-3 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {minHoursNotMet && (
            <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Minimum booking duration is {BOOKING_MIN_HOURS} hours.
              </p>
            </div>
          )}

          {hours > 0 && !minHoursNotMet && (
            <div className="rounded-2xl bg-[#FFF8F3] border border-[#FF7A00]/15 p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#6B7280]">Duration</span>
                <span className="text-sm font-bold text-[#111827]">{Math.round(hours)} hours</span>
              </div>
              <Separator className="my-2.5 bg-[#FF7A00]/10" />
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#111827]">Rental Amount</span>
                <span className="text-2xl font-bold text-[#FF7A00]">{formatCurrency(rentalAmount)}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="gradient"
            size="xl"
            className="w-full"
            disabled={!car.available || minHoursNotMet}
          >
            {!car.available ? "Currently Unavailable" : "Book Now"}
          </Button>

          <p className="text-center text-xs text-[#6B7280]">
            Free cancellation · No hidden charges
          </p>
        </form>
      </div>

      <VerificationGate
        open={verificationGateOpen}
        onClose={() => setVerificationGateOpen(false)}
      />
    </>
  );
}
