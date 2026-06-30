"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronLeft, Info, MapPin, Truck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeliveryOption } from "@/components/booking/DeliveryOption";
import { UpiPayment } from "@/components/booking/UpiPayment";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS } from "@/data/mock-data";
import { useBookingStore, useNotificationStore } from "@/lib/store";
import { DeliveryAddress } from "@/types";
import { formatCurrency } from "@/lib/utils";

type Stage = "delivery" | "payment" | "done";

function CompleteBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("delivery");
  const [deliveryChoice, setDeliveryChoice] = useState<"self_pickup" | "home_delivery" | null>(null);
  const [deliveryAddr, setDeliveryAddr] = useState<DeliveryAddress | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const bookingId = searchParams.get("bookingId") || "";
  const carId = searchParams.get("carId") || "1";

  const { setDelivery, submitSecondPayment, getBooking } = useBookingStore();
  const { addNotification } = useNotificationStore();

  const car = MOCK_CARS.find((c) => c.id === carId) || MOCK_CARS[0];
  const config = MOCK_CAR_ADMIN_CONFIGS.find((c) => c.carId === carId) || MOCK_CAR_ADMIN_CONFIGS[0];
  const booking = bookingId ? getBooking(bookingId) : null;

  const deliveryFee = deliveryChoice === "home_delivery" && config.enableHomeDelivery ? config.homeDeliveryFee : 0;

  // All charges (only non-zero shown)
  const charges: { label: string; amount: number; refundable?: boolean }[] = [
    { label: "Security Deposit", amount: config.securityDeposit, refundable: true },
    { label: "Platform Fee", amount: config.platformFee },
    { label: "Insurance Fee", amount: config.insuranceFee },
    { label: "Cleaning Charges", amount: config.cleaningCharges },
    { label: "FASTag Advance", amount: config.fastagAdvance },
    { label: "Home Delivery Fee", amount: deliveryFee },
    ...(config.additionalCharges || []).map((c) => ({ label: c.label, amount: c.amount })),
  ].filter((c) => c.amount > 0);

  const total = charges.reduce((s, c) => s + c.amount, 0);

  const handleDeliverySelect = (option: "self_pickup" | "home_delivery", address?: DeliveryAddress) => {
    setDeliveryChoice(option);
    setDeliveryAddr(address);
    if (bookingId) setDelivery(bookingId, option, address as unknown as Record<string, string>);
    setStage("payment");
  };

  const handlePayment = async (data: { utrNumber: string; screenshotUrl: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (bookingId) submitSecondPayment(bookingId, data.utrNumber, data.screenshotUrl);
    setSubmitting(false);
    setStage("done");
    addNotification({ type: "success", title: "Second Payment Submitted!", message: "Admin will verify and confirm your booking." });
  };

  if (stage === "done") {
    return (
      <main className="min-h-screen bg-[#F8F9FB]">
        <Header />
        <div className="pt-24 pb-12 px-4 sm:px-6 max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
            <div className="relative inline-flex mb-6">
              <div className="h-24 w-24 rounded-full bg-[#FFF8F3] flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-[#FF7A00]" />
              </div>
              <motion.div className="absolute inset-0 rounded-full bg-[#FF7A00] opacity-20"
                initial={{ scale: 0.8 }} animate={{ scale: 1.7, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] mb-2">Payment Submitted!</h1>
            <p className="text-[#6B7280] mb-5">Admin will verify and confirm your booking. You&apos;ll be notified once confirmed.</p>
            <Badge variant="warning" className="mb-6 text-sm">Additional Charges Submitted</Badge>
            <div className="space-y-3">
              <Button variant="gradient" size="lg" className="w-full" onClick={() => router.push("/trips")}>View My Trips</Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/")}>Back to Home</Button>
            </div>
          </motion.div>
        </div>
        <BottomNav />
        <div className="h-16 md:hidden" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <button onClick={() => (stage === "payment" ? setStage("delivery") : router.back())}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#FF7A00] mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">Complete Your Booking</h1>
          <Badge variant="success">Rental Approved ✓</Badge>
        </div>

        <div className="bg-[#FFF8F3] border border-[#FF7A00]/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-[#FF7A00] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-[#FF7A00]">Rental payment approved! Complete your booking.</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {stage === "delivery" ? "Choose how you'd like to receive the vehicle, then pay the remaining charges." : "Pay the security deposit and other charges to confirm your booking."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {stage === "delivery" && (
                <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
                    <DeliveryOption config={config} onSelect={handleDeliverySelect} />
                  </div>
                </motion.div>
              )}

              {stage === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <UpiPayment
                    amount={total}
                    purpose={`Complete Booking — ${car.name}`}
                    onSubmit={handlePayment}
                    isLoading={submitting}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Charges sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 sticky top-24 shadow-premium">
              <h3 className="font-bold text-[#111827] mb-4">Charges Breakdown</h3>
              {charges.length === 0 ? (
                <p className="text-sm text-[#6B7280]">No additional charges for this booking.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  {charges.map((c, i) => (
                    <div key={i} className="flex justify-between">
                      <div>
                        <span className="text-[#6B7280]">{c.label}</span>
                        {c.refundable && <span className="ml-1 text-xs text-green-600">(refundable)</span>}
                      </div>
                      <span className="font-semibold text-[#111827]">{formatCurrency(c.amount)}</span>
                    </div>
                  ))}
                  {deliveryChoice && (
                    <div className="flex justify-between text-xs text-[#6B7280]">
                      <span>Delivery</span>
                      <span className="capitalize font-medium text-[#111827]">{deliveryChoice.replace("_", " ")}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span className="text-[#111827]">Total</span>
                    <span className="text-[#FF7A00]">{formatCurrency(total)}</span>
                  </div>
                </div>
              )}
              {charges.some((c) => c.refundable) && (
                <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-xs text-green-700">
                    Security deposit of {formatCurrency(config.securityDeposit)} is fully refundable within 3-5 days after trip.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}

export default function CompleteBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" /></div>}>
      <CompleteBookingContent />
    </Suspense>
  );
}
