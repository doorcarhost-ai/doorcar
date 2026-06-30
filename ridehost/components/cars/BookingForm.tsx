"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Calendar,
  Clock,
  Info,
  Receipt,
} from "lucide-react";
import { Car } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { bookingFormSchema, BookingFormData } from "@/lib/validations";
import {
  calculateBookingAmount,
  calculateGST,
  calculateHours,
  formatCurrency,
} from "@/lib/utils";
import { BOOKING_MIN_HOURS, CONVENIENCE_FEE, GST_RATE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  car: Car;
}

export function BookingForm({ car }: BookingFormProps) {
  const router = useRouter();
  const [bookingCalc, setBookingCalc] = useState({
    hours: 0,
    rentalAmount: 0,
    extraCharges: 0,
    gst: 0,
    total: 0,
  });

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
      const hours = calculateHours(pickupDate, pickupTime, returnDate, returnTime);
      if (hours > 0) {
        const { rentalAmount, extraCharges } = calculateBookingAmount(
          hours,
          car.hourlyPrice,
          car.minBookingHours,
          car.extraHourCharge
        );
        const subtotal = rentalAmount + extraCharges;
        const gst = calculateGST(subtotal + CONVENIENCE_FEE, GST_RATE);
        setBookingCalc({
          hours,
          rentalAmount,
          extraCharges,
          gst,
          total: subtotal + CONVENIENCE_FEE + gst,
        });
      }
    }
  }, [pickupDate, pickupTime, returnDate, returnTime, car]);

  const onSubmit = (data: BookingFormData) => {
    const params = new URLSearchParams({
      pickupDate: data.pickupDate,
      pickupTime: data.pickupTime,
      returnDate: data.returnDate,
      returnTime: data.returnTime,
      hours: bookingCalc.hours.toString(),
    });
    router.push(`/booking/${car.id}?${params.toString()}`);
  };

  const minHoursNotMet =
    bookingCalc.hours > 0 && bookingCalc.hours < BOOKING_MIN_HOURS;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden sticky top-24">
      {/* Header */}
      <div className="p-5 border-b border-border bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-2xl font-bold">
            {formatCurrency(car.hourlyPrice)}
          </span>
          <span className="text-muted-foreground text-sm">/hour</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Min. {car.minBookingHours} hours · {formatCurrency(car.dailyPrice)}
          /day
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        {/* Pickup Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-medium mb-1.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Pickup Date
            </Label>
            <input
              type="date"
              min={today}
              {...register("pickupDate")}
              className={cn(
                "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                errors.pickupDate && "border-destructive"
              )}
            />
            {errors.pickupDate && (
              <p className="text-xs text-destructive mt-1">
                {errors.pickupDate.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Pickup Time
            </Label>
            <input
              type="time"
              {...register("pickupTime")}
              className={cn(
                "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                errors.pickupTime && "border-destructive"
              )}
            />
          </div>
        </div>

        {/* Return Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-medium mb-1.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Return Date
            </Label>
            <input
              type="date"
              min={pickupDate || today}
              {...register("returnDate")}
              className={cn(
                "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                errors.returnDate && "border-destructive"
              )}
            />
            {errors.returnDate && (
              <p className="text-xs text-destructive mt-1">
                {errors.returnDate.message}
              </p>
            )}
          </div>
          <div>
            <Label className="text-xs font-medium mb-1.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Return Time
            </Label>
            <input
              type="time"
              {...register("returnTime")}
              className={cn(
                "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                errors.returnTime && "border-destructive"
              )}
            />
          </div>
        </div>

        {/* Min hours warning */}
        {minHoursNotMet && (
          <div className="flex gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Minimum booking duration is {BOOKING_MIN_HOURS} hours. Please
              extend your return time.
            </p>
          </div>
        )}

        {/* Pricing Breakdown */}
        {bookingCalc.hours > 0 && !minHoursNotMet && (
          <div className="rounded-xl bg-muted/50 p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold mb-3">
              <Receipt className="h-4 w-4" />
              Price Breakdown
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Duration
              </span>
              <span className="font-medium">
                {Math.round(bookingCalc.hours)} hours
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Rental ({car.minBookingHours}hr × {formatCurrency(car.hourlyPrice)})
              </span>
              <span>{formatCurrency(bookingCalc.rentalAmount)}</span>
            </div>

            {bookingCalc.extraCharges > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Extra hours</span>
                <span>{formatCurrency(bookingCalc.extraCharges)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Convenience fee</span>
              <span>{formatCurrency(CONVENIENCE_FEE)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                GST ({GST_RATE}%)
              </span>
              <span>{formatCurrency(bookingCalc.gst)}</span>
            </div>

            <Separator />

            <div className="flex justify-between font-bold">
              <span>Total Payable</span>
              <span className="text-primary">
                {formatCurrency(bookingCalc.total)}
              </span>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              Security deposit {formatCurrency(car.securityDeposit)} collected
              separately
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={!car.available || minHoursNotMet}
        >
          {!car.available ? "Not Available" : "Book Now"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Free cancellation up to 24 hours before pickup
        </p>
      </form>
    </div>
  );
}
