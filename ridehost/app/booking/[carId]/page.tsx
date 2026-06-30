"use client";

import { useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Car, CheckCircle, ChevronLeft, Clock, CreditCard, MapPin, Truck } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeliveryOption } from "@/components/booking/DeliveryOption";
import { UpiPayment } from "@/components/booking/UpiPayment";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS, MOCK_USER } from "@/data/mock-data";
import { useBookingStore, useNotificationStore } from "@/lib/store";
import { DeliveryAddress } from "@/types";
import { formatCurrency, formatDateTime, calculateBookingAmount } from "@/lib/utils";
import { BOOKING_MIN_HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Review", icon: Car },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Done", icon: CheckCircle },
];

interface BookingPageProps {
  params: Promise<{ carId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const { carId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { createBooking, submitRentalPayment } = useBookingStore();
  const { addNotification } = useNotificationStore();

  const car = MOCK_CARS.find((c) => c.id === carId);
  const adminConfig = MOCK_CAR_ADMIN_CONFIGS.find((c) => c.carId === carId);

  const pickupDate = searchParams.get("pickupDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const returnTime = searchParams.get("returnTime") || "";
  const hours = parseFloat(searchParams.get("hours") || "24");

  if (!car || !adminConfig) {
    return <main className="min-h-screen flex items-center justify-center"><p>Car not found</p></main>;
  }

  const { rentalAmount } = calculateBookingAmount(hours, adminConfig.hourlyPrice, adminConfig.minimumHours, adminConfig.extraHourCharge);
  const extraH = Math.max(0, Math.max(hours, adminConfig.minimumHours) - adminConfig.minimumHours);
  const totalRental = rentalAmount + extraH * adminConfig.extraHourCharge;

  const handlePaymentSubmit = async (data: { utrNumber: string; screenshotUrl: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));

    // Create booking in store
    const id = createBooking({
      userId: MOCK_USER.id,
      userName: MOCK_USER.name,
      userPhone: MOCK_USER.phone,
      carId: car.id,
      carName: car.name,
      carImage: car.images[0],
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      hours,
      rentalAmount: totalRental,
      secondPaymentAmount: adminConfig.securityDeposit + adminConfig.platformFee + adminConfig.insuranceFee + adminConfig.cleaningCharges,
      deliveryOption: null,
    });

    submitRentalPayment(id, data.utrNumber, data.screenshotUrl);
    setBookingId(id);
    setSubmitting(false);
    setStep(3);
    addNotification({ type: "success", title: "Rental Payment Submitted!", message: "Admin will verify and approve your payment shortly." });
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <button onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#FF7A00] mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />{step > 1 ? "Back" : "Back to Car"}
        </button>

        <h1 className="text-2xl font-bold text-[#111827] mb-6">Book Your Car</h1>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                    done ? "bg-[#FF7A00] border-[#FF7A00] text-white" : active ? "bg-[#FF7A00]/10 border-[#FF7A00] text-[#FF7A00]" : "border-[#E5E7EB] text-[#6B7280]"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={cn("text-sm font-semibold hidden sm:block", active ? "text-[#111827]" : "text-[#6B7280]")}>{s.label}</span>
                </div>
                {idx < STEPS.length - 1 && <div className={cn("h-0.5 w-8 sm:w-16 rounded-full mx-1", done ? "bg-[#FF7A00]" : "bg-[#E5E7EB]")} />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium space-y-5">
                    <h2 className="text-lg font-bold text-[#111827]">Booking Summary</h2>
                    <div className="flex gap-4">
                      <div className="relative h-24 w-32 rounded-2xl overflow-hidden shrink-0">
                        <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="128px" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg text-[#111827]">{car.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-[#6B7280]" />
                          <span className="text-sm text-[#6B7280]">{car.location}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="success">Available</Badge>
                          <Badge variant="outline" className="capitalize text-xs">{car.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: Calendar, label: "Pickup", val: formatDateTime(pickupDate, pickupTime) },
                        { icon: Calendar, label: "Return", val: formatDateTime(returnDate, returnTime) },
                        { icon: Clock, label: "Duration", val: `${Math.round(hours)} hours` },
                      ].map(({ icon: Icon, label, val }) => (
                        <div key={label} className="flex items-start gap-2">
                          <Icon className="h-4 w-4 text-[#FF7A00] mt-0.5" />
                          <div><p className="text-xs text-[#6B7280]">{label}</p><p className="text-sm font-bold text-[#111827]">{val}</p></div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#FFF8F3] border border-[#FF7A00]/15 rounded-2xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">Rental Amount</p>
                          <p className="text-xs text-[#6B7280] mt-0.5">Pay only this now. Deposit & charges after approval.</p>
                        </div>
                        <p className="text-2xl font-bold text-[#FF7A00]">{formatCurrency(totalRental)}</p>
                      </div>
                    </div>
                    <Button variant="gradient" size="lg" className="w-full" onClick={() => setStep(2)}>
                      Proceed to Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <UpiPayment
                    amount={totalRental}
                    purpose={`Rental Payment — ${car.name}`}
                    onSubmit={handlePaymentSubmit}
                    isLoading={submitting}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 text-center shadow-premium">
                    <div className="relative inline-flex mb-6">
                      <div className="h-20 w-20 rounded-full bg-[#FFF8F3] flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-[#FF7A00]" />
                      </div>
                      <motion.div className="absolute inset-0 rounded-full bg-[#FF7A00] opacity-20"
                        initial={{ scale: 0.8 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-[#111827] mb-2">Rental Payment Submitted!</h2>
                    <p className="text-[#6B7280] mb-6">Admin will verify your payment and notify you to complete the booking with remaining charges.</p>
                    <div className="bg-[#F8F9FB] rounded-2xl p-4 mb-6 text-left space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Status</span>
                        <Badge variant="warning">Rental Payment Submitted</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Car</span>
                        <span className="font-semibold text-[#111827]">{car.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Rental Paid</span>
                        <span className="font-bold text-[#FF7A00]">{formatCurrency(totalRental)}</span>
                      </div>
                      {bookingId && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#6B7280]">Booking ID</span>
                          <span className="font-mono font-bold text-[#111827]">{bookingId.slice(0, 8).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <Button variant="gradient" className="w-full" onClick={() => router.push("/trips")}>Track Booking Status</Button>
                      <Button variant="outline" className="w-full" onClick={() => router.push("/")}>Back to Home</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sticky top-24 shadow-premium">
              <h3 className="font-bold text-[#111827] mb-4">Price Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Base rental ({Math.max(Math.round(hours), BOOKING_MIN_HOURS)}hr)</span>
                  <span className="font-medium text-[#111827]">{formatCurrency(rentalAmount)}</span>
                </div>
                {extraH > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Extra hours</span>
                    <span>{formatCurrency(extraH * adminConfig.extraHourCharge)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-[#111827]">Pay Now</span>
                  <span className="text-[#FF7A00]">{formatCurrency(totalRental)}</span>
                </div>
                <div className="mt-3 p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] font-semibold mb-1">After Admin Approval:</p>
                  <p className="text-xs text-[#6B7280]">Security deposit + platform fee + insurance + other charges will be shown on the complete booking page.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}
