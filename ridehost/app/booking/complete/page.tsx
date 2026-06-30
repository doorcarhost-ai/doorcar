"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ChevronLeft, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UpiPayment } from "@/components/booking/UpiPayment";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

function CompleteBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const carId = searchParams.get("carId") || "1";
  const deliveryOption = searchParams.get("delivery") || "self_pickup";

  const car = MOCK_CARS.find((c) => c.id === carId) || MOCK_CARS[0];
  const config = MOCK_CAR_ADMIN_CONFIGS.find((c) => c.carId === carId) || MOCK_CAR_ADMIN_CONFIGS[0];

  const deliveryFee = deliveryOption === "home_delivery" && config.enableHomeDelivery ? config.homeDeliveryFee : 0;

  const charges: { label: string; amount: number; refundable?: boolean }[] = [
    { label: "Security Deposit", amount: config.securityDeposit, refundable: true },
    { label: "Platform Fee", amount: config.platformFee },
    { label: "Insurance Fee", amount: config.insuranceFee },
    { label: "Cleaning Charges", amount: config.cleaningCharges },
    { label: "FASTag Advance", amount: config.fastagAdvance },
    { label: "Home Delivery Fee", amount: deliveryFee },
    ...(config.additionalCharges || []).map((c) => ({ label: c.label, amount: c.amount })),
  ].filter((c) => c.amount > 0);

  const total = charges.reduce((sum, c) => sum + c.amount, 0);

  const handlePayment = async (data: { utrNumber: string; screenshotUrl: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setPaid(true);
  };

  if (paid) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-12 px-4 sm:px-6 max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
            <div className="relative inline-flex mb-6">
              <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <motion.div className="absolute inset-0 rounded-full bg-green-400 opacity-40" initial={{ scale: 0.8 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Your second payment is under admin verification. Your booking will be confirmed once approved.
            </p>
            <Badge variant="warning" className="mb-6">Additional Charges Submitted</Badge>
            <div className="space-y-3">
              <Button variant="gradient" className="w-full" onClick={() => router.push("/trips")}>View My Trips</Button>
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
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />Back
        </button>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Complete Your Booking</h1>
          <Badge variant="success">Rental Approved</Badge>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Your rental payment has been approved!</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              Please complete the booking by paying the remaining charges below. Your booking will be confirmed after admin verifies this payment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UpiPayment
              amount={total}
              purpose={`Complete Booking — ${car.name}`}
              onSubmit={handlePayment}
              isLoading={submitting}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-semibold mb-4">Charges Breakdown</h3>
              <div className="space-y-3">
                {charges.map((charge, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">{charge.label}</span>
                      {charge.refundable && (
                        <span className="ml-1 text-xs text-green-600">(refundable)</span>
                      )}
                    </div>
                    <span className="font-medium">{formatCurrency(charge.amount)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground">
                  Security deposit of {formatCurrency(config.securityDeposit)} is fully refundable within 3-5 business days after trip completion.
                </p>
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

export default function CompleteBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CompleteBookingContent />
    </Suspense>
  );
}
