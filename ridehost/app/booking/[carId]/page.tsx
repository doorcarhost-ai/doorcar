"use client";

import { useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  MapPin,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeliveryOption } from "@/components/booking/DeliveryOption";
import { UpiPayment } from "@/components/booking/UpiPayment";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS } from "@/data/mock-data";
import { DeliveryAddress } from "@/types";
import { formatCurrency, formatDateTime, calculateBookingAmount } from "@/lib/utils";
import { BOOKING_MIN_HOURS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Review", icon: Car },
  { id: 2, label: "Delivery", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Done", icon: CheckCircle },
];

interface BookingPageProps {
  params: Promise<{ carId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const { carId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState<"self_pickup" | "home_delivery" | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress | undefined>();
  const [submitting, setSubmitting] = useState(false);

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
        <p>Car not found</p>
      </main>
    );
  }

  const { rentalAmount } = calculateBookingAmount(hours, adminConfig.hourlyPrice, adminConfig.minimumHours, adminConfig.extraHourCharge);
  const extraHours = Math.max(0, Math.max(hours, adminConfig.minimumHours) - adminConfig.minimumHours);
  const extraCharges = extraHours * adminConfig.extraHourCharge;
  const totalRentalAmount = rentalAmount + extraCharges;
  const deliveryFee = deliveryOption === "home_delivery" && adminConfig.enableHomeDelivery ? adminConfig.homeDeliveryFee : 0;

  const handleDeliverySelect = (option: "self_pickup" | "home_delivery", address?: DeliveryAddress) => {
    setDeliveryOption(option);
    setDeliveryAddress(address);
    setStep(3);
  };

  const handlePaymentSubmit = async (data: { utrNumber: string; screenshotUrl: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setStep(4);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {step > 1 ? "Back" : "Back to Car"}
        </button>

        <h1 className="text-2xl font-bold mb-6">Book Your Car</h1>

        {/* Stepper */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center gap-1 shrink-0">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                    done ? "bg-primary border-primary text-primary-foreground" : active ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={cn("text-sm font-medium hidden sm:block", active ? "text-foreground" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={cn("h-0.5 w-6 sm:w-12 rounded-full mx-1", done ? "bg-primary" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Review */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold">Booking Summary</h2>
                    <div className="flex gap-4">
                      <div className="relative h-24 w-32 rounded-xl overflow-hidden shrink-0">
                        <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="128px" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg">{car.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{car.location}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="success">Available</Badge>
                          <Badge variant="outline" className="capitalize">{car.category}</Badge>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Pickup</p>
                          <p className="text-sm font-semibold">{formatDateTime(pickupDate, pickupTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Return</p>
                          <p className="text-sm font-semibold">{formatDateTime(returnDate, returnTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="text-sm font-semibold">{Math.round(hours)} hours</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1">First Payment: Rental Only</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        You pay only the rental amount now. Security deposit & other charges are collected after admin approves your rental payment.
                      </p>
                    </div>
                    <Button variant="gradient" size="lg" className="w-full" onClick={() => setStep(2)}>
                      Continue to Delivery
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <DeliveryOption config={adminConfig} onSelect={handleDeliverySelect} />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <UpiPayment
                    amount={totalRentalAmount}
                    purpose={`Rental Payment — ${car.name}`}
                    onSubmit={handlePaymentSubmit}
                    isLoading={submitting}
                  />
                </motion.div>
              )}

              {/* Step 4: Submitted */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-card border border-border rounded-2xl p-8 text-center">
                    <div className="relative inline-flex mb-6">
                      <div className="h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                        <CheckCircle className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                      </div>
                      <motion.div className="absolute inset-0 rounded-full bg-amber-400 opacity-40" initial={{ scale: 0.8 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Payment Submitted!</h2>
                    <p className="text-muted-foreground mb-1">Your rental payment details have been submitted.</p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Admin will verify your payment and approve your booking. You will be notified to complete the booking with remaining charges.
                    </p>

                    <div className="bg-muted/50 rounded-2xl p-4 mb-6 text-left space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="warning">Rental Payment Submitted</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Car</span>
                        <span className="font-medium">{car.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Rental Amount Paid</span>
                        <span className="font-semibold text-primary">{formatCurrency(totalRentalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium capitalize">{deliveryOption?.replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button variant="gradient" className="w-full" onClick={() => router.push("/trips")}>
                        Track Booking Status
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                        Back to Home
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-semibold mb-4">Price Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rental ({Math.max(Math.round(hours), BOOKING_MIN_HOURS)}hr × {formatCurrency(adminConfig.hourlyPrice)})</span>
                  <span>{formatCurrency(rentalAmount)}</span>
                </div>
                {extraCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra hours</span>
                    <span>{formatCurrency(extraCharges)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Pay Now</span>
                  <span className="text-primary">{formatCurrency(totalRentalAmount)}</span>
                </div>
                {step >= 3 && deliveryOption && (
                  <>
                    <Separator />
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">After Approval (2nd Payment)</p>
                    {adminConfig.securityDeposit > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Security Deposit</span>
                        <span>{formatCurrency(adminConfig.securityDeposit)}</span>
                      </div>
                    )}
                    {adminConfig.platformFee > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Platform Fee</span>
                        <span>{formatCurrency(adminConfig.platformFee)}</span>
                      </div>
                    )}
                    {adminConfig.insuranceFee > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Insurance</span>
                        <span>{formatCurrency(adminConfig.insuranceFee)}</span>
                      </div>
                    )}
                    {adminConfig.cleaningCharges > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Cleaning</span>
                        <span>{formatCurrency(adminConfig.cleaningCharges)}</span>
                      </div>
                    )}
                    {deliveryFee > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Home Delivery</span>
                        <span>{formatCurrency(deliveryFee)}</span>
                      </div>
                    )}
                  </>
                )}
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
