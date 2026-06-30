"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, Receipt, Tag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UpiPayment } from "@/components/booking/UpiPayment";
import { MOCK_CARS } from "@/data/mock-data";
import { useBookingStore, useNotificationStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CONVENIENCE_FEE } from "@/lib/constants";

const VALID_COUPONS: Record<string, number> = {
  FIRSTRIDE: 500,
  WEEKEND20: 0.2,
  GOGREEN15: 0.15,
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { bookings, submitRentalPayment } = useBookingStore();
  const { addNotification } = useNotificationStore();

  const carId = searchParams.get("carId") || "1";
  const bookingId = searchParams.get("bookingId") || "";
  const totalStr = searchParams.get("total") || "0";

  const car = MOCK_CARS.find((c) => c.id === carId) || MOCK_CARS[0];
  const booking = bookingId ? bookings.find((b) => b.id === bookingId) : null;
  const pickupDate = searchParams.get("pickupDate") || "";
  const returnDate = searchParams.get("returnDate") || "";

  const baseAmount = parseFloat(totalStr) || booking?.rentalAmount || 1020;

  const getCouponDiscount = () => {
    if (!appliedCoupon) return 0;
    const d = VALID_COUPONS[appliedCoupon];
    if (!d) return 0;
    return d > 1 ? d : Math.round(baseAmount * d);
  };

  const discount = getCouponDiscount();
  const finalAmount = Math.max(0, baseAmount - discount);

  const handleApplyCoupon = () => {
    const upper = coupon.toUpperCase().trim();
    if (VALID_COUPONS[upper] !== undefined) {
      setAppliedCoupon(upper);
      setCouponError("");
      addNotification({ type: "success", title: "Coupon Applied!", message: `Saving ₹${getCouponDiscount()}` });
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const handlePayment = async (data: { utrNumber: string; screenshotUrl: string }) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (bookingId) submitRentalPayment(bookingId, data.utrNumber, data.screenshotUrl);
    setSubmitting(false);
    addNotification({ type: "success", title: "Payment Submitted!", message: "Admin will verify within 15–30 minutes." });
    const params = new URLSearchParams({ ref: bookingId || "", car: car.name, bookingId: bookingId || "" });
    router.push(`/booking/success?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#FF7A00] mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />Back
        </button>

        <h1 className="text-2xl font-bold text-[#111827] mb-6">Complete Rental Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment */}
          <div className="lg:col-span-3">
            <UpiPayment
              amount={finalAmount}
              purpose={`Rental — ${car.name}`}
              onSubmit={handlePayment}
              isLoading={submitting}
            />
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium p-5 sticky top-24 space-y-4">
              <h3 className="font-bold text-[#111827] flex items-center gap-2">
                <Receipt className="h-4 w-4 text-[#FF7A00]" />Order Summary
              </h3>

              {/* Car */}
              <div className="flex gap-3 p-3 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
                <div className="relative h-14 w-20 rounded-xl overflow-hidden shrink-0">
                  <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-[#111827] truncate">{car.name}</p>
                  {pickupDate && returnDate && (
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {formatDate(new Date(pickupDate))} → {formatDate(new Date(returnDate))}
                    </p>
                  )}
                </div>
              </div>

              {/* Coupon */}
              <div>
                <Label className="text-sm font-semibold text-[#111827] mb-2 flex items-center gap-1.5">
                  <Tag className="h-4 w-4 text-[#FF7A00]" />Coupon Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="FIRSTRIDE"
                    className="uppercase font-mono h-10"
                    disabled={!!appliedCoupon}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 h-10"
                    onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCoupon(""); } : handleApplyCoupon}
                  >
                    {appliedCoupon ? "Remove" : "Apply"}
                  </Button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    ✓ &quot;{appliedCoupon}&quot; applied — saving {formatCurrency(discount)}!
                  </p>
                )}
              </div>

              <Separator />

              {/* Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Rental charges</span>
                  <span className="font-medium text-[#111827]">{formatCurrency(baseAmount)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon})</span>
                    <span className="font-semibold">− {formatCurrency(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-[#111827]">Total Payable</span>
                  <span className="text-[#FF7A00]">{formatCurrency(finalAmount)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280]">
                  Security deposit & other charges are collected separately after admin approves this payment.
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

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" /></div>}>
      <PaymentContent />
    </Suspense>
  );
}
