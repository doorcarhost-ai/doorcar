import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string, time: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${formatDate(d)}, ${time}`;
}

export function calculateHours(
  pickupDate: string,
  pickupTime: string,
  returnDate: string,
  returnTime: string
): number {
  const pickup = new Date(`${pickupDate}T${pickupTime}`);
  const returnD = new Date(`${returnDate}T${returnTime}`);
  const diffMs = returnD.getTime() - pickup.getTime();
  return Math.max(0, diffMs / (1000 * 60 * 60));
}

export function calculateBookingAmount(
  hours: number,
  hourlyRate: number,
  minHours: number = 12,
  extraHourRate?: number
): {
  rentalAmount: number;
  extraCharges: number;
  subtotal: number;
} {
  const billableHours = Math.max(hours, minHours);
  const baseAmount = minHours * hourlyRate;
  const extraHours = Math.max(0, billableHours - minHours);
  const extraCharges = extraHours * (extraHourRate || hourlyRate);
  const rentalAmount = baseAmount + extraCharges;

  return {
    rentalAmount: baseAmount,
    extraCharges,
    subtotal: rentalAmount,
  };
}

export function calculateGST(amount: number, rate: number = 18): number {
  return Math.round((amount * rate) / 100);
}

export function generateBookingId(): string {
  const prefix = "RH";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h} hrs`;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m`;
}

export function parseHoursSafe(val: string | number): number {
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? 0 : n;
}
