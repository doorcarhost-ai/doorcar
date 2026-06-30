"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  ChevronLeft,
  CreditCard,
  Lock,
  Tag,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { MOCK_CARS } from "@/data/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CONVENIENCE_FEE, PAYMENT_METHODS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const VALID_COUPONS: Record<string, number> = {
  FIRSTRIDE: 500,
  WEEKEND20: 0.2,
  GOGREEN15: 0.15,
};

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [processing, setProcessing] = useState(false);

  const carId = searchParams.get("carId") || "1";
  const pickupDate = searchParams.get("pickupDate") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const totalStr = searchParams.get("total") || "0";

  const car = MOCK_CARS.find((c) => c.id === carId) || MOCK_CARS[0];
  const baseTotal = parseFloat(totalStr) || 7500;

  const getCouponDiscount = () => {
    if (!couponApplied) return 0;
    const discount = VALID_COUPONS[couponApplied];
    if (!discount) return 0;
    if (discount > 1) return discount;
    return Math.round(baseTotal * discount);
  };

  const discount = getCouponDiscount();
  const finalTotal = baseTotal - discount + car.securityDeposit;

  const handleApplyCoupon = () => {
    const upperCoupon = coupon.toUpperCase();
    if (VALID_COUPONS[upperCoupon] !== undefined) {
      setCouponApplied(upperCoupon);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
      setCouponApplied(null);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    router.push(
      `/booking/success?ref=RH${Date.now().toString(36).toUpperCase()}&car=${car.name}`
    );
  };

  const paymentIcons: Record<string, React.ReactNode> = {
    upi: <BadgeIndianRupee className="h-5 w-5" />,
    card: <CreditCard className="h-5 w-5" />,
    netbanking: <Lock className="h-5 w-5" />,
    wallet: <Wallet className="h-5 w-5" />,
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="text-2xl font-bold mb-6">Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Payment section */}
          <div className="lg:col-span-3 space-y-5">
            {/* Payment methods */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h2 className="font-semibold mb-4">Choose Payment Method</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      {paymentIcons[method.id]}
                    </div>
                    <Label
                      htmlFor={method.id}
                      className="cursor-pointer font-medium flex-1"
                    >
                      {method.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* UPI Details */}
            {paymentMethod === "upi" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <h3 className="font-semibold mb-4">UPI Details</h3>
                <div>
                  <Label className="mb-1.5">UPI ID</Label>
                  <Input placeholder="yourname@upi" />
                </div>
              </motion.div>
            )}

            {/* Card Details */}
            {paymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-5 space-y-4"
              >
                <h3 className="font-semibold">Card Details</h3>
                <div>
                  <Label className="mb-1.5">Card Number</Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="mb-1.5">Expiry</Label>
                    <Input placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <Label className="mb-1.5">CVV</Label>
                    <Input type="password" placeholder="•••" maxLength={4} />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5">Name on Card</Label>
                  <Input placeholder="As on card" />
                </div>
              </motion.div>
            )}

            {/* Secure badge */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <Lock className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400">
                Your payment is secured by 256-bit SSL encryption
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h2 className="font-semibold mb-4">Order Summary</h2>

              {/* Car */}
              <div className="flex gap-3 mb-5">
                <div className="relative h-16 w-24 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={car.images[0]}
                    alt={car.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{car.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pickupDate && formatDate(new Date(pickupDate))} →{" "}
                    {returnDate && formatDate(new Date(returnDate))}
                  </p>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Coupon */}
              <div className="mb-4">
                <Label className="mb-2 flex items-center gap-1.5">
                  <Tag className="h-4 w-4" />
                  Coupon Code
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="uppercase"
                    disabled={!!couponApplied}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={
                      couponApplied
                        ? () => {
                            setCouponApplied(null);
                            setCoupon("");
                          }
                        : handleApplyCoupon
                    }
                    className="shrink-0"
                  >
                    {couponApplied ? "Remove" : "Apply"}
                  </Button>
                </div>
                {couponError && (
                  <p className="text-xs text-destructive mt-1">{couponError}</p>
                )}
                {couponApplied && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    ✓ Coupon &quot;{couponApplied}&quot; applied! Saving{" "}
                    {formatCurrency(discount)}
                  </p>
                )}
              </div>

              <Separator className="mb-4" />

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rental charges</span>
                  <span>
                    {formatCurrency(baseTotal - CONVENIENCE_FEE * 1.18)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Convenience fee
                  </span>
                  <span>{formatCurrency(CONVENIENCE_FEE)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({couponApplied})</span>
                    <span>- {formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Security deposit
                  </span>
                  <span>{formatCurrency(car.securityDeposit)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg mb-5 p-3 bg-primary/5 rounded-xl">
                <span>Total Payable</span>
                <span className="text-primary">{formatCurrency(finalTotal)}</span>
              </div>

              <Badge
                variant="secondary"
                className="w-full justify-center mb-4"
              >
                Deposit is fully refundable after trip
              </Badge>

              <Button
                variant="gradient"
                size="lg"
                className="w-full gap-2"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Pay {formatCurrency(finalTotal)}
                  </>
                )}
              </Button>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
