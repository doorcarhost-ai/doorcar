"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationGateProps {
  open: boolean;
  onClose: () => void;
}

export function VerificationGate({ open, onClose }: VerificationGateProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm mx-4"
          >
            <div className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
              {/* Top accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-500" />

              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-950/40">
                    <ShieldCheck className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                  </div>
                  <button
                    onClick={onClose}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <h2 className="text-xl font-bold mb-2">
                  Profile Verification Required
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  Please verify your profile before booking any vehicle. Upload your driving licence, Aadhaar card, and selfie to continue.
                </p>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Verification is a one-time process. Once verified, you can book any car instantly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1 gap-2"
                    onClick={() => {
                      onClose();
                      router.push("/profile?tab=verification");
                    }}
                  >
                    Verify Profile
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
