"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, Car, CheckCircle, ChevronLeft, Clock, ExternalLink,
  Home, Info, MapPin, Phone, Receipt, Shield, User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { UpiPayment } from "@/components/booking/UpiPayment";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS } from "@/data/mock-data";
import { useBookingStore, useNotificationStore } from "@/lib/store";
import { DeliveryAddress } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const deliverySchema = z.object({
  houseNumber: z.string().min(1, "Required"),
  buildingName: z.string().default(""),
  street: z.string().min(2, "Required"),
  area: z.string().min(2, "Required"),
  landmark: z.string().default(""),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit PIN"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Valid mobile number required"),
  specialInstructions: z.string().default(""),
});

type DeliveryForm = {
  houseNumber: string; buildingName: string; street: string; area: string;
  landmark: string; city: string; state: string; pincode: string;
  mobileNumber: string; specialInstructions: string;
};

type Stage = "delivery" | "payment" | "done";

function CompleteBookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("delivery");
  const [deliveryChoice, setDeliveryChoice] = useState<"self_pickup" | "home_delivery" | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const bookingId = searchParams.get("bookingId") || "";
  const carId = searchParams.get("carId") || "1";

  const { setDelivery, submitSecondPayment, getBooking } = useBookingStore();
  const { addNotification } = useNotificationStore();

  const car = MOCK_CARS.find((c) => c.id === carId) || MOCK_CARS[0];
  const config = MOCK_CAR_ADMIN_CONFIGS.find((c) => c.carId === carId) || MOCK_CAR_ADMIN_CONFIGS[0];

  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryForm>({
    resolver: zodResolver(deliverySchema) as any,
    defaultValues: { buildingName: "", landmark: "", specialInstructions: "" },
  });

  const deliveryFee = deliveryChoice === "home_delivery" && config.enableHomeDelivery ? config.homeDeliveryFee : 0;

  const charges: { label: string; amount: number; refundable?: boolean }[] = [
    { label: "Security Deposit", amount: config.securityDeposit, refundable: true },
    { label: "Platform Fee", amount: config.platformFee },
    { label: "Insurance Fee", amount: config.insuranceFee },
    { label: "Cleaning Charges", amount: config.cleaningCharges },
    { label: "FASTag Advance", amount: config.fastagAdvance },
    { label: "Home Delivery Fee", amount: deliveryFee },
    ...(config.additionalCharges || []),
  ].filter((c) => c.amount > 0);

  const total = charges.reduce((s, c) => s + c.amount, 0);

  const handleDeliveryForm = (data: DeliveryForm) => {
    const address = data as unknown as Record<string, string>;
    if (bookingId) setDelivery(bookingId, "home_delivery", address);
    setStage("payment");
  };

  const handleSelfPickup = () => {
    setDeliveryChoice("self_pickup");
    if (bookingId) setDelivery(bookingId, "self_pickup");
    setStage("payment");
  };

  const handlePayment = async (data: { utrNumber: string; screenshotUrl: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (bookingId) submitSecondPayment(bookingId, data.utrNumber, data.screenshotUrl);
    setSubmitting(false);
    setStage("done");
    addNotification({ type: "success", title: "Payment Submitted!", message: "Admin will confirm your booking soon." });
  };

  if (stage === "done") {
    return (
      <main className="min-h-screen bg-[#F8F9FB]">
        <Header />
        <div className="pt-24 pb-12 px-4 sm:px-6 max-w-lg mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
            {/* Animated check */}
            <div className="relative inline-flex mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="h-24 w-24 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FFB547] flex items-center justify-center shadow-orange"
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
              {[1, 2, 3].map(i => (
                <motion.div key={i} className="absolute inset-0 rounded-full bg-[#FF7A00]"
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 1.5 + i * 0.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                />
              ))}
            </div>

            <h1 className="text-2xl font-bold text-[#111827] mb-2">Second Payment Submitted!</h1>
            <p className="text-[#6B7280] mb-5">Admin will verify and confirm your booking shortly.</p>
            <Badge variant="info" className="mb-6 text-sm px-4 py-1.5">Additional Charges Under Review</Badge>

            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-6 shadow-premium text-left space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Total Paid</span>
                <span className="font-bold text-[#FF7A00]">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Delivery</span>
                <span className="font-medium text-[#111827] capitalize">{deliveryChoice?.replace("_", " ") || "Self Pickup"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Expected Confirmation</span>
                <span className="font-medium text-[#111827]">15–30 minutes</span>
              </div>
            </div>

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
        <button
          onClick={() => (stage === "payment" ? setStage("delivery") : router.back())}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#FF7A00] mb-5 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />Back
        </button>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-premium mb-6">
          <BookingProgress currentStep={stage === "delivery" ? "complete" : "second_payment"} />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">Complete Your Booking</h1>
          <Badge variant="success">Rental Approved ✓</Badge>
        </div>

        <div className="bg-[#FFF8F3] border border-[#FF7A00]/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Info className="h-5 w-5 text-[#FF7A00] mt-0.5 shrink-0" />
          <p className="text-sm text-[#6B7280]">
            {stage === "delivery"
              ? "Great! Your rental payment is approved. Choose how you'd like to receive the vehicle, then complete the remaining payment."
              : "Review the charges and complete your final payment to confirm the booking."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* ── Delivery Selection ── */}
              {stage === "delivery" && (
                <motion.div key="delivery" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <h2 className="text-lg font-bold text-[#111827]">Choose Delivery Option</h2>

                  {/* Self Pickup Card */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    onClick={deliveryChoice === "self_pickup" ? undefined : () => setDeliveryChoice("self_pickup")}
                    className={cn(
                      "bg-white rounded-3xl border-2 p-5 cursor-pointer shadow-premium transition-all",
                      deliveryChoice === "self_pickup" ? "border-[#FF7A00] shadow-orange" : "border-[#E5E7EB] hover:border-[#FF7A00]/40"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors", deliveryChoice === "self_pickup" ? "bg-[#FF7A00] text-white" : "bg-[#F8F9FB] text-[#6B7280]")}>
                        <Car className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-[#111827] text-lg">Self Pickup</h3>
                          <span className="text-base font-bold text-green-600">FREE</span>
                        </div>
                        <p className="text-sm text-[#6B7280] mt-1">Collect the vehicle directly from the pickup point</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {deliveryChoice === "self_pickup" && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-5 space-y-3 p-4 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
                            <h4 className="font-bold text-[#111827] text-sm">Pickup Details</h4>
                            {[
                              { icon: MapPin, label: "Address", val: config.pickupAddress },
                              { icon: User, label: "Contact", val: config.pickupContactPerson },
                              { icon: Phone, label: "Phone", val: config.pickupContactNumber },
                              { icon: Clock, label: "Timing", val: config.pickupTiming },
                            ].map(({ icon: Icon, label, val }) => (
                              <div key={label} className="flex items-start gap-2.5">
                                <Icon className="h-4 w-4 text-[#FF7A00] mt-0.5 shrink-0" />
                                <div>
                                  <p className="text-xs text-[#6B7280]">{label}</p>
                                  <p className="text-sm font-semibold text-[#111827]">{val}</p>
                                </div>
                              </div>
                            ))}
                            {config.pickupMapsUrl && (
                              <a href={config.pickupMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#FF7A00] hover:underline mt-1">
                                <ExternalLink className="h-3.5 w-3.5" />View on Google Maps
                              </a>
                            )}
                          </div>
                          <Button variant="gradient" className="w-full mt-4" onClick={handleSelfPickup}>
                            Confirm Self Pickup
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Home Delivery Card */}
                  {config.enableHomeDelivery && (
                    <motion.div
                      whileHover={{ y: -2 }}
                      onClick={() => { setDeliveryChoice("home_delivery"); setShowAddressForm(true); }}
                      className={cn(
                        "bg-white rounded-3xl border-2 p-5 cursor-pointer shadow-premium transition-all",
                        deliveryChoice === "home_delivery" ? "border-[#FF7A00] shadow-orange" : "border-[#E5E7EB] hover:border-[#FF7A00]/40"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors", deliveryChoice === "home_delivery" ? "bg-[#FF7A00] text-white" : "bg-[#F8F9FB] text-[#6B7280]")}>
                          <Home className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-[#111827] text-lg">Home Delivery</h3>
                            <span className="text-base font-bold text-[#FF7A00]">
                              {config.homeDeliveryFee > 0 ? `+${formatCurrency(config.homeDeliveryFee)}` : "FREE"}
                            </span>
                          </div>
                          <p className="text-sm text-[#6B7280] mt-1">
                            Vehicle delivered to your address within {config.estimatedDeliveryTime}
                          </p>
                          <p className="text-xs text-[#9CA3AF] mt-0.5">Available within {config.deliveryRadius} km radius</p>
                        </div>
                      </div>

                      <AnimatePresence>
                        {deliveryChoice === "home_delivery" && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <form onSubmit={handleSubmit(handleDeliveryForm)} className="mt-5 space-y-3" onClick={(e) => e.stopPropagation()}>
                              <h4 className="font-bold text-[#111827]">Delivery Address</h4>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs mb-1">House/Flat No. *</Label>
                                  <Input {...register("houseNumber")} placeholder="42B" className="h-10" />
                                  {errors.houseNumber && <p className="text-xs text-red-500 mt-1">{errors.houseNumber.message}</p>}
                                </div>
                                <div>
                                  <Label className="text-xs mb-1">Building Name</Label>
                                  <Input {...register("buildingName")} placeholder="Optional" className="h-10" />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs mb-1">Street *</Label>
                                <Input {...register("street")} placeholder="Street / Road name" className="h-10" />
                                {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street.message}</p>}
                              </div>
                              <div>
                                <Label className="text-xs mb-1">Area / Locality *</Label>
                                <Input {...register("area")} placeholder="Area name" className="h-10" />
                                {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area.message}</p>}
                              </div>
                              <div>
                                <Label className="text-xs mb-1">Landmark</Label>
                                <Input {...register("landmark")} placeholder="Near any landmark" className="h-10" />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs mb-1">City *</Label>
                                  <Input {...register("city")} placeholder="City" className="h-10" />
                                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                                </div>
                                <div>
                                  <Label className="text-xs mb-1">State *</Label>
                                  <Input {...register("state")} placeholder="State" className="h-10" />
                                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs mb-1">PIN Code *</Label>
                                  <Input {...register("pincode")} placeholder="6-digit PIN" maxLength={6} className="h-10" />
                                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                                </div>
                                <div>
                                  <Label className="text-xs mb-1">Mobile *</Label>
                                  <Input type="tel" {...register("mobileNumber")} placeholder="10-digit" className="h-10" />
                                  {errors.mobileNumber && <p className="text-xs text-red-500 mt-1">{errors.mobileNumber.message}</p>}
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs mb-1">Special Instructions</Label>
                                <Input {...register("specialInstructions")} placeholder="Delivery instructions" className="h-10" />
                              </div>
                              <Button type="submit" variant="gradient" className="w-full">Confirm Home Delivery</Button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ── Second Payment ── */}
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
              <h3 className="font-bold text-[#111827] mb-4 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#FF7A00]" />Charges
              </h3>

              {/* Car preview */}
              <div className="flex items-center gap-3 p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB] mb-4">
                <div className="relative h-12 w-16 rounded-xl overflow-hidden shrink-0">
                  <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#111827] truncate">{car.name}</p>
                  <p className="text-xs text-[#6B7280]">Delivery: <span className="capitalize font-medium">{deliveryChoice?.replace("_", " ") || "—"}</span></p>
                </div>
              </div>

              {charges.length === 0 ? (
                <p className="text-sm text-[#6B7280]">Select delivery option to see charges.</p>
              ) : (
                <div className="space-y-2.5 text-sm">
                  {charges.map((c, i) => (
                    <div key={i} className="flex justify-between">
                      <div className="text-[#6B7280]">
                        {c.label}
                        {c.refundable && <span className="ml-1 text-xs text-green-600">(refundable)</span>}
                      </div>
                      <span className="font-semibold text-[#111827]">{formatCurrency(c.amount)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span className="text-[#111827]">Total</span>
                    <span className="text-[#FF7A00]">{formatCurrency(total)}</span>
                  </div>
                </div>
              )}

              {charges.some((c) => c.refundable) && (
                <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-xs text-green-700 flex items-start gap-1.5">
                    <BadgeCheck className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    Deposit fully refundable within 3–5 days after trip completion
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
