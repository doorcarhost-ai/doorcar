"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Clock,
  Copy,
  ImageIcon,
  Info,
  Upload,
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
  const totalSeconds = minutes * 60;
  const [seconds, setSeconds] = useState(totalSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const expired = seconds <= 0;
  const urgent = seconds <= 60;

  return { mins, secs, expired, urgent, seconds };
}

export function UpiPayment({ amount, purpose, onSubmit, isLoading }: UpiPaymentProps) {
  const { mins, secs, expired, urgent } = useCountdown(UPI_CONFIG.reservationMinutes);
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const upiString = `upi://pay?pa=${UPI_CONFIG.upiId}&pn=${encodeURIComponent(UPI_CONFIG.upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(purpose)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScreenshot(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!utr.trim()) { setUtrError("Please enter the UTR number"); return; }
    if (utr.trim().length < 10) { setUtrError("UTR number must be at least 10 characters"); return; }
    if (!screenshot) { setUtrError("Please upload payment screenshot"); return; }
    setUtrError("");
    onSubmit({ utrNumber: utr.trim(), screenshotUrl: screenshot });
  };

  return (
    <div className="space-y-5">
      {/* Timer */}
      <div className={cn(
        "flex items-center justify-between p-4 rounded-2xl border",
        expired
          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
          : urgent
          ? "bg-[#FFF8F3] dark:bg-[#FFF8F3]/20 border-[#FF7A00]/20 dark:border-[#FF7A00]/20"
          : "bg-card border-border"
      )}>
        <div className="flex items-center gap-2">
          <Clock className={cn("h-5 w-5", expired ? "text-red-500" : urgent ? "text-[#FF7A00]" : "text-primary")} />
          <div>
            <p className="text-sm font-semibold">
              {expired ? "Reservation Expired" : "Complete payment within"}
            </p>
            <p className="text-xs text-muted-foreground">
              {expired ? "Please refresh the page" : "QR & UPI ID reserved for you"}
            </p>
          </div>
        </div>
        {!expired && (
          <div className={cn(
            "font-mono font-bold text-xl tabular-nums",
            urgent ? "text-[#FF7A00]" : "text-foreground"
          )}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF9A3C] rounded-2xl p-5 text-white text-center">
        <p className="text-sm font-medium text-white/80 mb-1">{purpose}</p>
        <p className="text-4xl font-bold">{formatCurrency(amount)}</p>
      </div>

      {/* QR Code */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold mb-4 text-center">Scan QR Code to Pay</h3>
        <div className="flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl shadow-md mb-4 border border-border">
            <Image
              src={qrUrl}
              alt="UPI QR Code"
              width={180}
              height={180}
              className="rounded-xl"
              unoptimized
            />
          </div>
          <p className="text-xs text-muted-foreground text-center mb-2">
            Scan using any UPI app • PhonePe • GPay • Paytm • BHIM
          </p>
        </div>

        <div className="border-t border-border pt-4 mt-2">
          <p className="text-xs text-muted-foreground mb-2 text-center">Or pay directly via UPI ID</p>
          <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
            <span className="flex-1 text-sm font-mono font-semibold text-center">
              {UPI_CONFIG.upiId}
            </span>
            <button
              onClick={() => handleCopy(UPI_CONFIG.upiId)}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-background transition-colors shrink-0"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Account Name: <span className="font-semibold">{UPI_CONFIG.upiName}</span>
          </p>
        </div>
      </div>

      {/* UTR Input */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="font-semibold mb-1">Confirm Payment</h3>
          <p className="text-xs text-muted-foreground">Enter the UTR/Transaction ID after paying</p>
        </div>

        <div>
          <Label className="mb-1.5">UTR / Transaction ID *</Label>
          <Input
            value={utr}
            onChange={(e) => { setUtr(e.target.value); setUtrError(""); }}
            placeholder="e.g. 123456789012"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Find UTR in your UPI app under transaction details
          </p>
        </div>

        <div>
          <Label className="mb-2">Payment Screenshot *</Label>
          {screenshot ? (
            <div className="relative">
              <div className="relative h-40 rounded-xl overflow-hidden border border-border">
                <Image src={screenshot} alt="Payment screenshot" fill className="object-cover" sizes="400px" />
              </div>
              <button
                onClick={() => setScreenshot(null)}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-destructive text-white flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors"
              >
                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">Gallery</span>
              </button>
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors"
              >
                <Camera className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">Camera</span>
              </button>
            </div>
          )}
        </div>

        {utrError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-700 dark:text-red-400">{utrError}</p>
          </div>
        )}

        <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Your booking will be confirmed only after admin verifies the payment. This usually takes 15-30 minutes.
          </p>
        </div>

        <Button
          variant="gradient"
          size="lg"
          className="w-full gap-2"
          onClick={handleSubmit}
          disabled={isLoading || expired}
        >
          {isLoading ? (
            <><div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
          ) : (
            <><Upload className="h-4 w-4" />Submit Payment Details</>
          )}
        </Button>
      </div>
    </div>
  );
}
