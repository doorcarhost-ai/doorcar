"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Camera, CheckCircle, Clock, Copy,
  ImageIcon, RefreshCw, Shield, UploadCloud, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UPI_CONFIG } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface UpiPaymentProps {
  amount: number;
  purpose: string;
  onSubmit: (data: { utrNumber: string; screenshotUrl: string }) => void;
  isLoading?: boolean;
}

function useCountdown(minutes: number) {
  const totalSec = minutes * 60;
  const [seconds, setSeconds] = useState(totalSec);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setSeconds(totalSec);
  }, [refreshKey, totalSec]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds, refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const pct = (seconds / totalSec) * 100;

  return { mins, secs, expired: seconds <= 0, urgent: seconds <= 60, pct, refresh };
}

export function UpiPayment({ amount, purpose, onSubmit, isLoading }: UpiPaymentProps) {
  const { mins, secs, expired, urgent, pct, refresh } = useCountdown(UPI_CONFIG.reservationMinutes);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [copied, setCopied] = useState<"id" | "amount" | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const upiString = `upi://pay?pa=${UPI_CONFIG.upiId}&pn=${encodeURIComponent(UPI_CONFIG.upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiString)}&color=111827&bgcolor=ffffff&qzone=2`;

  const copy = (text: string, key: "id" | "amount") => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const canSubmit = utr.trim().length >= 10 && !!screenshot && !expired;

  const handleSubmit = () => {
    if (!utr.trim()) { setUtrError("Please enter the UTR number"); return; }
    if (utr.trim().length < 10) { setUtrError("UTR must be at least 10 characters"); return; }
    if (!screenshot) { setUtrError("Please upload payment screenshot"); return; }
    setUtrError("");
    onSubmit({ utrNumber: utr.trim(), screenshotUrl: screenshot });
  };

  return (
    <div className="space-y-4">

      {/* ── Timer ── */}
      <div className={cn(
        "rounded-2xl border p-4 transition-colors",
        expired ? "bg-red-50 border-red-200" : urgent ? "bg-amber-50 border-amber-200" : "bg-white border-[#E5E7EB] shadow-premium"
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className={cn("h-5 w-5", expired ? "text-red-500" : urgent ? "text-amber-500" : "text-[#FF7A00]")} />
            <div>
              <p className="text-sm font-bold text-[#111827]">
                {expired ? "Session Expired" : "Complete payment within"}
              </p>
              <p className="text-xs text-[#6B7280]">
                {expired ? "Please refresh to get a new QR" : "QR reserved exclusively for you"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!expired && (
              <motion.div
                key={`${mins}:${secs}`}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className={cn(
                  "font-mono font-bold text-2xl tabular-nums",
                  urgent ? "text-amber-600" : "text-[#111827]"
                )}
              >
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </motion.div>
            )}
            <button
              onClick={refresh}
              className="h-8 w-8 flex items-center justify-center rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] hover:border-[#FF7A00]/40 transition-colors"
              title="Refresh QR"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#6B7280]" />
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", expired ? "bg-red-400" : urgent ? "bg-amber-400" : "bg-[#FF7A00]")}
            initial={{ width: "100%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* ── Amount card ── */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF9A3C] rounded-3xl p-5 text-white shadow-orange text-center">
        <p className="text-sm font-medium text-white/80 mb-1">{purpose}</p>
        <motion.p
          key={amount}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-bold mb-3"
        >
          {formatCurrency(amount)}
        </motion.p>
        <button
          onClick={() => copy(amount.toString(), "amount")}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-[#FF7A00] font-semibold text-sm hover:bg-orange-50 transition-colors shadow-sm"
        >
          {copied === "amount" ? <><CheckCircle className="h-3.5 w-3.5" />Copied!</> : <><Copy className="h-3.5 w-3.5" />Copy Amount</>}
        </button>
      </div>

      {/* ── QR Code ── */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium p-6">
        <h3 className="font-bold text-[#111827] text-center mb-5">Scan & Pay</h3>

        <AnimatePresence mode="wait">
          <motion.div
            key={expired ? "expired" : "active"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex justify-center mb-5"
          >
            <div className={cn(
              "p-4 rounded-2xl border-2 shadow-premium-lg transition-all",
              expired ? "border-red-200 opacity-30 grayscale" : "border-[#FF7A00]/20"
            )}>
              <Image src={qrUrl} alt="UPI QR" width={200} height={200} className="rounded-xl" unoptimized />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* UPI ID copy */}
        <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#E5E7EB]">
          <p className="text-xs text-[#6B7280] text-center mb-2 font-medium">Or pay using UPI ID</p>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E5E7EB] px-3 py-2">
            <span className="flex-1 text-sm font-mono font-bold text-[#111827] text-center">{UPI_CONFIG.upiId}</span>
            <button
              onClick={() => copy(UPI_CONFIG.upiId, "id")}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 transition-colors shrink-0"
            >
              {copied === "id" ? <CheckCircle className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-[#FF7A00]" />}
            </button>
          </div>
          <p className="text-xs text-[#6B7280] text-center mt-2">
            Name: <span className="font-semibold text-[#111827]">{UPI_CONFIG.upiName}</span>
          </p>
          <p className="text-xs text-center mt-1 text-[#6B7280]">
            Works with PhonePe · GPay · Paytm · BHIM · Any UPI app
          </p>
        </div>
      </div>

      {/* ── Confirm Payment ── */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-premium p-6 space-y-5">
        <div>
          <h3 className="font-bold text-[#111827] mb-1">Confirm Your Payment</h3>
          <p className="text-sm text-[#6B7280]">Enter UTR and upload screenshot after paying</p>
        </div>

        {/* UTR */}
        <div>
          <Label className="text-sm font-semibold text-[#111827] mb-2">
            UTR / Transaction ID <span className="text-red-500">*</span>
          </Label>
          <Input
            value={utr}
            onChange={(e) => { setUtr(e.target.value); setUtrError(""); }}
            placeholder="12-digit UTR number e.g. 123456789012"
            className={cn(
              "font-mono h-12 text-base rounded-xl",
              utr.length >= 10 ? "border-green-400 focus:border-green-500" : ""
            )}
          />
          <div className="flex items-center justify-between mt-1.5">
            <p className="text-xs text-[#6B7280]">Find in your UPI app under Transaction Details</p>
            {utr.length > 0 && (
              <span className={cn("text-xs font-semibold", utr.length >= 10 ? "text-green-600" : "text-[#FF7A00]")}>
                {utr.length}/10+
              </span>
            )}
          </div>
        </div>

        {/* Screenshot drag-drop */}
        <div>
          <Label className="text-sm font-semibold text-[#111827] mb-2">
            Payment Screenshot <span className="text-red-500">*</span>
          </Label>

          {screenshot ? (
            <div className="relative">
              <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-green-400 bg-gray-100">
                <Image src={screenshot} alt="Payment proof" fill className="object-cover" sizes="500px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle className="h-3 w-3" />Screenshot Added
                </div>
              </div>
              <button
                onClick={() => setScreenshot(null)}
                className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-white border border-[#E5E7EB] shadow-sm hover:bg-red-50 transition-colors"
              >
                <X className="h-4 w-4 text-[#6B7280]" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 transition-all text-center",
                dragOver ? "border-[#FF7A00] bg-[#FFF8F3]" : "border-[#E5E7EB] hover:border-[#FF7A00]/50 hover:bg-[#FFF8F3]/50"
              )}
            >
              <div className="flex justify-center mb-3">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center transition-colors", dragOver ? "bg-[#FF7A00]/15" : "bg-[#F8F9FB] border border-[#E5E7EB]")}>
                  <UploadCloud className={cn("h-7 w-7 transition-colors", dragOver ? "text-[#FF7A00]" : "text-[#6B7280]")} />
                </div>
              </div>
              <p className="text-sm font-semibold text-[#111827] mb-1">
                {dragOver ? "Drop your screenshot here" : "Upload Payment Screenshot"}
              </p>
              <p className="text-xs text-[#6B7280] mb-4">Drag & drop or choose from camera / gallery</p>

              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} />
              <input ref={camRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} />

              <div className="flex gap-2 justify-center">
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => fileRef.current?.click()}>
                  <ImageIcon className="h-3.5 w-3.5" />Gallery
                </Button>
                <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={() => camRef.current?.click()}>
                  <Camera className="h-3.5 w-3.5" />Camera
                </Button>
              </div>
            </div>
          )}
        </div>

        {utrError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-700 font-medium">{utrError}</p>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]">
          <Shield className="h-4 w-4 text-[#FF7A00] mt-0.5 shrink-0" />
          <p className="text-xs text-[#6B7280]">
            Your booking is confirmed only after admin verifies the payment. Typically takes <span className="font-semibold text-[#111827]">15–30 minutes</span>.
          </p>
        </div>

        <Button
          variant="gradient"
          size="xl"
          className="w-full gap-2 relative"
          onClick={handleSubmit}
          disabled={!canSubmit || !!isLoading}
        >
          {isLoading ? (
            <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
          ) : (
            <><UploadCloud className="h-4 w-4" />Submit Payment Details</>
          )}
          {!canSubmit && !isLoading && (
            <span className="absolute right-4 text-[10px] text-white/70 hidden sm:block">
              {!utr || utr.length < 10 ? "Enter UTR" : "Upload screenshot"}
            </span>
          )}
        </Button>

        {/* Step indicators */}
        <div className="grid grid-cols-2 gap-2">
          <div className={cn("flex items-center gap-2 p-2 rounded-xl text-xs font-medium", utr.length >= 10 ? "bg-green-50 text-green-700 border border-green-200" : "bg-[#F8F9FB] text-[#6B7280] border border-[#E5E7EB]")}>
            {utr.length >= 10 ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 rounded-full border border-current" />}
            UTR Entered
          </div>
          <div className={cn("flex items-center gap-2 p-2 rounded-xl text-xs font-medium", screenshot ? "bg-green-50 text-green-700 border border-green-200" : "bg-[#F8F9FB] text-[#6B7280] border border-[#E5E7EB]")}>
            {screenshot ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="h-3.5 w-3.5 rounded-full border border-current" />}
            Screenshot Uploaded
          </div>
        </div>
      </div>
    </div>
  );
}
