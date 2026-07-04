"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BookingStatusId } from "./constants";
import type { VerificationStatus } from "@/types";

// ─── Verification ───────────────────────────────────────────────
export interface VerificationRequest {
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAvatar: string;
  drivingLicenseUrl: string | null;
  aadhaarUrl: string | null;
  selfieUrl: string | null;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface VerificationStore {
  requests: VerificationRequest[];
  userVerificationStatus: VerificationStatus;
  submitVerification: (data: Omit<VerificationRequest, "status" | "submittedAt">) => void;
  approveVerification: (userId: string) => void;
  rejectVerification: (userId: string, reason: string) => void;
  setUserVerificationStatus: (status: VerificationStatus) => void;
}

export const useVerificationStore = create<VerificationStore>()(
  persist(
    (set) => ({
      requests: [],
      userVerificationStatus: "not_uploaded",

      submitVerification: (data) =>
        set((state) => {
          const existing = state.requests.findIndex((r) => r.userId === data.userId);
          const newReq: VerificationRequest = {
            ...data,
            status: "pending",
            submittedAt: new Date().toISOString(),
          };
          const requests =
            existing >= 0
              ? state.requests.map((r, i) => (i === existing ? newReq : r))
              : [...state.requests, newReq];
          return { requests, userVerificationStatus: "pending" };
        }),

      approveVerification: (userId) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.userId === userId
              ? { ...r, status: "verified", reviewedAt: new Date().toISOString() }
              : r
          ),
          userVerificationStatus:
            state.requests.find((r) => r.userId === userId)?.userId === "user_1"
              ? "verified"
              : state.userVerificationStatus,
        })),

      rejectVerification: (userId, reason) =>
        set((state) => ({
          requests: state.requests.map((r) =>
            r.userId === userId
              ? { ...r, status: "rejected", rejectionReason: reason, reviewedAt: new Date().toISOString() }
              : r
          ),
          userVerificationStatus:
            state.requests.find((r) => r.userId === userId)?.userId === "user_1"
              ? "rejected"
              : state.userVerificationStatus,
        })),

      setUserVerificationStatus: (status) => set({ userVerificationStatus: status }),
    }),
    { name: "ridehost-verification", storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Bookings ───────────────────────────────────────────────────
export interface BookingEntry {
  id: string;
  bookingRef: string;
  userId: string;
  userName: string;
  userPhone: string;
  carId: string;
  carName: string;
  carImage: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  hours: number;
  rentalAmount: number;
  secondPaymentAmount: number;
  deliveryOption: "self_pickup" | "home_delivery" | null;
  deliveryAddress?: Record<string, string>;
  status: BookingStatusId;
  rentalPaymentUtr?: string;
  rentalPaymentScreenshot?: string;
  rentalPaymentSubmittedAt?: string;
  rentalPaymentRejectionReason?: string;
  secondPaymentUtr?: string;
  secondPaymentScreenshot?: string;
  secondPaymentSubmittedAt?: string;
  secondPaymentRejectionReason?: string;
  createdAt: string;
}

interface BookingStore {
  bookings: BookingEntry[];
  createBooking: (booking: Omit<BookingEntry, "id" | "bookingRef" | "createdAt" | "status">) => string;
  submitRentalPayment: (bookingId: string, utr: string, screenshot: string) => void;
  approveRentalPayment: (bookingId: string) => void;
  rejectRentalPayment: (bookingId: string, reason: string) => void;
  setDelivery: (bookingId: string, option: "self_pickup" | "home_delivery", address?: Record<string, string>) => void;
  submitSecondPayment: (bookingId: string, utr: string, screenshot: string) => void;
  approveSecondPayment: (bookingId: string) => void;
  rejectSecondPayment: (bookingId: string, reason: string) => void;
  updateStatus: (bookingId: string, status: BookingStatusId) => void;
  getBooking: (bookingId: string) => BookingEntry | undefined;
}

function genId() {
  return `RH${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookings: [],

      createBooking: (data) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : genId();
        const bookingRef = genId();
        const booking: BookingEntry = {
          ...data,
          id,
          bookingRef,
          status: "rental_payment_pending",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookings: [...s.bookings, booking] }));
        return id;
      },

      submitRentalPayment: (bookingId, utr, screenshot) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId
              ? { ...b, status: "rental_payment_submitted", rentalPaymentUtr: utr, rentalPaymentScreenshot: screenshot, rentalPaymentSubmittedAt: new Date().toISOString() }
              : b
          ),
        })),

      approveRentalPayment: (bookingId) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "rental_payment_approved" } : b
          ),
        })),

      rejectRentalPayment: (bookingId, reason) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "rental_payment_pending", rentalPaymentRejectionReason: reason, rentalPaymentUtr: undefined, rentalPaymentScreenshot: undefined } : b
          ),
        })),

      setDelivery: (bookingId, option, address) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, deliveryOption: option, deliveryAddress: address, status: "additional_charges_pending" } : b
          ),
        })),

      submitSecondPayment: (bookingId, utr, screenshot) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId
              ? { ...b, status: "additional_charges_submitted", secondPaymentUtr: utr, secondPaymentScreenshot: screenshot, secondPaymentSubmittedAt: new Date().toISOString() }
              : b
          ),
        })),

      approveSecondPayment: (bookingId) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "booking_confirmed" } : b
          ),
        })),

      rejectSecondPayment: (bookingId, reason) =>
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "additional_charges_pending", secondPaymentRejectionReason: reason, secondPaymentUtr: undefined, secondPaymentScreenshot: undefined } : b
          ),
        })),

      updateStatus: (bookingId, status) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === bookingId ? { ...b, status } : b)),
        })),

      getBooking: (bookingId) => get().bookings.find((b) => b.id === bookingId),
    }),
    { name: "ridehost-bookings", storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Notifications ──────────────────────────────────────────────
export interface AppNotification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  createdAt: string;
}

interface NotificationStore {
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "createdAt">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  notifications: [],
  addNotification: (n) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({
      notifications: [{ ...n, id, createdAt: new Date().toISOString() }, ...s.notifications].slice(0, 20),
    }));
    setTimeout(() => set((s) => ({ notifications: s.notifications.filter((x) => x.id !== id) })), 4000);
  },
  removeNotification: (id) => set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
  clearAll: () => set({ notifications: [] }),
}));

