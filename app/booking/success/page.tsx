"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar, CheckCircle, Clock, Download, FileText,
  HeadphonesIcon, Home, Receipt, Share2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

const NEXT_STEPS = [
  { icon: CheckCircle, text: "Admin verifies your UTR and screenshot" },
  { icon: Clock, text: "Rental payment approved (15–30 min)" },
  { icon: Receipt, text: "Notification to complete booking" },
  { icon: Calendar, text: "Choose delivery → pay remaining charges" },
  { icon: CheckCircle, text: "Booking confirmed — vehicle ready!" },
];

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { bookings } = useBookingStore();

  const ref = searchParams.get("ref") || "";
  const carName = searchParams.get("car") || "Your Car";
  const bookingId = searchParams.get("bookingId") || "";

  // Try to get data from store
  const booking = bookingId ? bookings.find((b) => b.id === bookingId) : null;
  const rentalAmount = booking?.rentalAmount;
  const bookingRef = booking?.bookingRef || ref || `RH${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const submittedAt = booking?.rentalPaymentSubmittedAt
    ? new Date(booking.rentalPaymentSubmittedAt).toLocaleTimeString("en-IN")
    : new Date().toLocaleTimeString("en-IN");

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-xl mx-auto">
        {/* Success animation */}
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full bg-[#FF7A00]"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.5 + i * 0.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF9A3C] flex items-center justify-center shadow-orange"
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h1 className="text-3xl font-bold text-[#111827] mb-2">Payment Submitted!</h1>
            <p className="text-[#6B7280]">Your rental payment is under admin review</p>
          </motion.div>
        </div>

        {/* Booking reference card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#FF7A00] to-[#FF9A3C] rounded-3xl p-6 text-white text-center mb-5 shadow-orange"
        >
          <p className="text-sm text-white/80 font-medium mb-2">Booking Reference</p>
          <p className="text-3xl font-mono font-bold tracking-widest mb-3">{bookingRef}</p>
          <Badge className="bg-white text-[#FF7A00] border-0 text-sm px-4 py-1 font-semibold">
            <span className="h-2 w-2 rounded-full bg-green-300 mr-2 inline-block animate-pulse" />
            Under Admin Review
          </Badge>
        </motion.div>

        {/* Details grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium p-5 mb-5"
        >
          <h3 className="font-bold text-[#111827] mb-4">Payment Details</h3>
          <div className="space-y-3">
            {[
              { label: "Car", value: carName },
              ...(rentalAmount !== undefined ? [{ label: "Rental Amount Paid", value: formatCurrency(rentalAmount), highlight: true }] : []),
              { label: "Expected Approval", value: "Within 15–30 minutes" },
              { label: "Submitted At", value: submittedAt },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#F8F9FB] last:border-0">
                <span className="text-sm text-[#6B7280]">{label}</span>
                <span className={`text-sm font-semibold ${highlight ? "text-[#FF7A00] text-base" : "text-[#111827]"}`}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium p-5 mb-5"
        >
          <h3 className="font-bold text-[#111827] mb-4">What Happens Next?</h3>
          <div className="space-y-3">
            {NEXT_STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-8 w-8 rounded-full bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-[#FF7A00]">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-[#6B7280]">{step.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#FFF8F3] border border-[#FF7A00]/20 rounded-2xl p-4 mb-5 flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-xl bg-[#FF7A00]/15 flex items-center justify-center shrink-0">
            <HeadphonesIcon className="h-5 w-5 text-[#FF7A00]" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#111827]">Need help?</p>
            <p className="text-sm text-[#6B7280]">📞 1800-DOORCAR (24×7 Support)</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="gap-1.5 h-11" onClick={() => alert("Downloading invoice...")}>
              <Download className="h-4 w-4" />Invoice
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-11"
              onClick={() => {
                navigator.share?.({ title: "DoorCar Booking", text: `Booking ${bookingRef}` });
              }}
            >
              <Share2 className="h-4 w-4" />Share
            </Button>
          </div>

          <Button
            variant="gradient"
            size="xl"
            className="w-full gap-2"
            onClick={() => router.push("/trips")}
          >
            <Receipt className="h-5 w-5" />Track Booking Status
          </Button>

          <Link href="/">
            <Button variant="outline" className="w-full gap-2">
              <Home className="h-4 w-4" />Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>

      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
