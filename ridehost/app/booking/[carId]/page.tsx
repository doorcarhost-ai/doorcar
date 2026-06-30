"use client";

import { useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, Calendar, Car, CheckCircle, ChevronLeft, Clock,
  CreditCard, MapPin, Receipt,
} from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookingProgress, type BookingStep } from "@/components/booking/BookingProgress";
import { UpiPayment } from "@/components/booking/UpiPayment";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS, MOCK_USER } from "@/data/mock-data";
import { useBookingStore, useNotificationStore } from "@/lib/store";
import { formatCurrency, formatDateTime, calculateBookingAmount, formatHours } from "@/lib/utils";
import { BOOKING_MIN_HOURS } from "@/lib/constants";

interface BookingPageProps {
  params: Promise<{ carId: string }>;
}

const STEP_MAP: BookingStep[] = ["review", "payment", "submitted"];

export default function BookingPage({ params }: BookingPageProps) {
  const { carId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stepIdx, setStepIdx] = useState(0);
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
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-[#6B7280]">Car not found.</p>
      </main>
    );
  }

  const { rentalAmount } = calculateBookingAmount(
    hours, adminConfig.hourlyPrice, adminConfig.minimumHours, adminConfig.extraHourCharge
  );
  const extraH = Math.max(0, Math.max(hours, adminConfig.minimumHours) - adminConfig.minimumHours);
  const extraCharges = extraH * adminConfig.extraHourCharge;
  const totalRental = rentalAmount + extraCharges;

  const handlePaymentSubmit = async (data: { utrNumber: string; screenshotUrl: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
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
    setStepIdx(2);
    addNotification({
      type: "success",
      title: "Payment Details Submitted!",
      message: "Admin will verify your rental payment within 15–30 minutes.",
    });
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">

        {/* Back */}
        <button
          onClick={() => (stepIdx > 0 ? setStepIdx(s => s - 1) : router.back())}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#FF7A00] mb-5 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {stepIdx > 0 ? "Back" : "Back to Car"}
        </button>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-premium mb-6">
          <BookingProgress currentStep={STEP_MAP[stepIdx]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* ── Step 1: Review ── */}
              {stepIdx === 0 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium overflow-hidden">
                    {/* Car hero */}
                    <div className="relative h-52 sm:h-64 overflow-hidden">
                      <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="800px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1 capitalize">{car.category}</p>
                            <h2 className="text-2xl font-bold text-white">{car.name}</h2>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">{formatCurrency(totalRental)}</p>
                            <p className="text-white/70 text-xs">Rental amount</p>
                          </div>
                        </div>
                      </div>
                      {car.verified && (
                        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-[#FF7A00] text-xs font-bold shadow">
                          <BadgeCheck className="h-3.5 w-3.5" />Verified
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Location */}
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <MapPin className="h-4 w-4 text-[#FF7A00] shrink-0" />
                        {car.location}
                      </div>

                      <Separator />

                      {/* Trip details */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { icon: Calendar, label: "Pickup", val: formatDateTime(pickupDate, pickupTime) },
                          { icon: Calendar, label: "Return", val: formatDateTime(returnDate, returnTime) },
                          { icon: Clock, label: "Duration", val: formatHours(hours) },
                          { icon: Car, label: "Category", val: car.category.toUpperCase() },
                        ].map(({ icon: Icon, label, val }) => (
                          <div key={label} className="bg-[#F8F9FB] rounded-2xl p-3.5 border border-[#E5E7EB]">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Icon className="h-3.5 w-3.5 text-[#FF7A00]" />
                              <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{label}</span>
                            </div>
                            <p className="text-sm font-bold text-[#111827] leading-tight">{val}</p>
                          </div>
                        ))}
                      </div>

                      <Button variant="gradient" size="xl" className="w-full gap-2" onClick={() => setStepIdx(1)}>
                        <CreditCard className="h-5 w-5" />
                        Proceed to Pay {formatCurrency(totalRental)}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Payment ── */}
              {stepIdx === 1 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <UpiPayment
                    amount={totalRental}
                    purpose={`Rental — ${car.name}`}
                    onSubmit={handlePaymentSubmit}
                    isLoading={submitting}
                  />
                </motion.div>
              )}

              {/* ── Step 3: Submitted ── */}
              {stepIdx === 2 && (
                <motion.div key="submitted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium overflow-hidden">
                    {/* Animated success header */}
                    <div className="relative bg-gradient-to-br from-[#FF7A00] to-[#FF9A3C] p-8 text-center overflow-hidden">
                      <div className="absolute inset-0 overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute rounded-full bg-white/10"
                            style={{ width: 40 + i * 30, height: 40 + i * 30, left: `${15 + i * 13}%`, top: "10%" }}
                            animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
                          />
                        ))}
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="relative inline-flex mb-4"
                      >
                        <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/40">
                          <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <motion.div
                          className="absolute inset-0 rounded-full bg-white"
                          initial={{ scale: 0.5, opacity: 0.6 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white mb-1 relative">Payment Submitted!</h2>
                      <p className="text-white/80 text-sm relative">Admin is verifying your payment</p>
                    </div>

                    <div className="p-6 space-y-4">
                      {/* Details */}
                      <div className="space-y-3">
                        {[
                          { label: "Status", val: <Badge variant="warning">Under Review</Badge> },
                          { label: "Booking ID", val: <span className="font-mono font-bold text-[#111827]">{bookingId?.slice(0, 8).toUpperCase() || "RH" + Date.now().toString(36).toUpperCase().slice(-6)}</span> },
                          { label: "Car", val: <span className="font-semibold text-[#111827]">{car.name}</span> },
                          { label: "Rental Paid", val: <span className="font-bold text-[#FF7A00]">{formatCurrency(totalRental)}</span> },
                          { label: "Expected Approval", val: <span className="text-[#111827] font-medium">Within 15–30 minutes</span> },
                          { label: "Submitted At", val: <span className="text-[#111827]">{new Date().toLocaleTimeString("en-IN")}</span> },
                        ].map(({ label, val }) => (
                          <div key={label} className="flex items-center justify-between py-2 border-b border-[#F8F9FB]">
                            <span className="text-sm text-[#6B7280]">{label}</span>
                            <div className="text-sm">{val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Support */}
                      <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#E5E7EB]">
                        <p className="text-xs text-[#6B7280] mb-1">Need help? Contact Support</p>
                        <p className="text-sm font-bold text-[#111827]">📞 1800-RIDEHOST (24×7)</p>
                      </div>

                      {/* What's next */}
                      <div className="bg-[#FFF8F3] border border-[#FF7A00]/20 rounded-2xl p-4">
                        <p className="text-sm font-bold text-[#FF7A00] mb-2">What happens next?</p>
                        <ol className="space-y-1.5 text-xs text-[#6B7280] list-none">
                          {[
                            "Admin verifies your UTR and screenshot",
                            "Rental payment approved (15–30 min)",
                            "You will be notified to proceed",
                            "Booking confirmed — vehicle ready!",
                          ].map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="h-5 w-5 rounded-full bg-[#FF7A00]/15 text-[#FF7A00] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="gradient" className="gap-2" onClick={() => router.push("/trips")}>
                          <Receipt className="h-4 w-4" />Track Status
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/")}>
                          Back to Home
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium p-5 sticky top-24">
              <h3 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#FF7A00]" />Price Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Base rental ({formatHours(Math.max(hours, BOOKING_MIN_HOURS))} × {formatCurrency(adminConfig.hourlyPrice)})</span>
                  <span className="font-medium text-[#111827]">{formatCurrency(rentalAmount)}</span>
                </div>
                {extraCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Extra {formatHours(extraH)} × {formatCurrency(adminConfig.extraHourCharge)}</span>
                    <span className="font-medium">{formatCurrency(extraCharges)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#111827]">Pay Now</span>
                  <span className="text-xl font-bold text-[#FF7A00]">{formatCurrency(totalRental)}</span>
                </div>
              </div>

              {/* Car info */}
              <div className="mt-4 flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]">
                <div className="relative h-12 w-16 rounded-xl overflow-hidden shrink-0">
                  <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#111827] truncate">{car.name}</p>
                  <p className="text-xs text-[#6B7280]">{car.year} · {car.transmission}</p>
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
