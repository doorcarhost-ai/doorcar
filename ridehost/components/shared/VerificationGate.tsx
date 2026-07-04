"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Shield, X } from "lucide-react";
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm px-4"
          >
            <div className="bg-white rounded-3xl shadow-premium-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#FF7A00] to-[#FFB547]" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-[#FF7A00]/10 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-[#FF7A00]" />
                  </div>
                  <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <X className="h-4 w-4 text-[#6B7280]" />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-[#111827] mb-2">Profile Verification Required</h2>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
                  Please verify your profile before booking any vehicle. Upload your Driving Licence, Aadhaar card and Selfie to continue.
                </p>
                <div className="bg-[#FFF8F3] border border-[#FF7A00]/20 rounded-xl p-3 mb-5">
                  <p className="text-xs text-[#FF7A00] font-medium">
                    One-time verification. Once approved, book unlimited cars without uploading documents again.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                  <Button variant="gradient" className="flex-1 gap-2" onClick={() => { onClose(); router.push("/profile?tab=verification"); }}>
                    Verify Profile <ArrowRight className="h-4 w-4" />
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
