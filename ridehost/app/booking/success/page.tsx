"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Car,
  CheckCircle,
  Download,
  FileText,
  Home,
  MapPin,
  Share2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ref = searchParams.get("ref") || "RHABCDEF1234";
  const carName = searchParams.get("car") || "Your Car";

  const steps = [
    {
      icon: CheckCircle,
      label: "Booking Confirmed",
      desc: "Your booking is confirmed",
      done: true,
    },
    {
      icon: Car,
      label: "Get Ready",
      desc: "Documents verified on pickup",
      done: false,
    },
    {
      icon: MapPin,
      label: "Pickup",
      desc: "Collect car at location",
      done: false,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative inline-flex"
          >
            <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            {/* Ripple */}
            <motion.div
              className="absolute inset-0 rounded-full bg-green-400"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, delay: 0.3, repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold mt-5 mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your {carName} booking is confirmed. Have a safe trip!
            </p>
          </motion.div>
        </div>

        {/* Booking Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800 rounded-2xl p-6 text-center mb-6"
        >
          <p className="text-sm text-muted-foreground mb-2">Booking Reference</p>
          <p className="text-3xl font-mono font-bold tracking-widest text-primary">
            {ref}
          </p>
          <Badge variant="success" className="mt-3">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Payment Successful
          </Badge>
        </motion.div>

        {/* Journey steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-5 mb-5"
        >
          <h3 className="font-semibold mb-4">What&apos;s Next?</h3>
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      step.done
                        ? "bg-green-100 dark:bg-green-950"
                        : "bg-muted"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        step.done
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                  {step.done && (
                    <Badge
                      variant="success"
                      className="ml-auto text-xs"
                    >
                      Done
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Important info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border rounded-2xl p-5 mb-5"
        >
          <h3 className="font-semibold mb-3">Important Information</h3>
          <div className="space-y-2.5">
            {[
              "Carry original driving license at pickup",
              "Arrive 15 minutes before pickup time",
              "Car inspection will be done before handover",
              "Security deposit collected at pickup",
              "24/7 helpline: 1800-RideHost",
            ].map((info, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{info}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                alert("Invoice download started!");
              }}
            >
              <Download className="h-4 w-4" />
              Invoice
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                alert("Rental agreement download started!");
              }}
            >
              <FileText className="h-4 w-4" />
              Agreement
            </Button>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "My RideHost Booking",
                  text: `I just booked ${carName} on RideHost! Reference: ${ref}`,
                });
              }
            }}
          >
            <Share2 className="h-4 w-4" />
            Share Booking
          </Button>

          <Separator />

          <Link href="/trips">
            <Button variant="gradient" className="w-full gap-2" size="lg">
              <Car className="h-4 w-4" />
              View My Trips
            </Button>
          </Link>

          <Link href="/">
            <Button variant="ghost" className="w-full gap-2">
              <Home className="h-4 w-4" />
              Back to Home
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
