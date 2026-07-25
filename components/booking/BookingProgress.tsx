"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type BookingStep =
  | "review"
  | "payment"
  | "submitted"
  | "approved"
  | "complete"
  | "delivery"
  | "second_payment"
  | "confirmed";

const STEPS: { id: BookingStep; label: string; shortLabel: string }[] = [
  { id: "review", label: "Review Booking", shortLabel: "Review" },
  { id: "payment", label: "Rental Payment", shortLabel: "Payment" },
  { id: "submitted", label: "Submitted", shortLabel: "Submitted" },
  { id: "approved", label: "Approved", shortLabel: "Approved" },
  { id: "complete", label: "Complete Booking", shortLabel: "Complete" },
  { id: "confirmed", label: "Confirmed", shortLabel: "Done" },
];

interface BookingProgressProps {
  currentStep: BookingStep;
  className?: string;
}

export function BookingProgress({ currentStep, className }: BookingProgressProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#E5E7EB] z-0" />
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-[#FF7A00] to-[#FFB547] z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {STEPS.map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 relative z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: active ? 1.15 : 1,
                  backgroundColor: done ? "#FF7A00" : active ? "#FF7A00" : "#E5E7EB",
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                  done ? "border-[#FF7A00] bg-[#FF7A00]" : active ? "border-[#FF7A00] bg-white" : "border-[#E5E7EB] bg-white"
                )}
              >
                {done ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <span className={cn("text-xs font-bold", active ? "text-[#FF7A00]" : "text-[#9CA3AF]")}>
                    {idx + 1}
                  </span>
                )}
              </motion.div>
              <span className={cn(
                "text-[10px] font-semibold text-center leading-tight hidden sm:block max-w-[64px]",
                active ? "text-[#FF7A00]" : done ? "text-[#6B7280]" : "text-[#9CA3AF]"
              )}>
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
