"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Car,
  CheckCircle,
  Clock,
  Download,
  MapPin,
  MoreHorizontal,
  Plus,
  Star,
  Timer,
  XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { StarRating } from "@/components/shared/StarRating";
import { MOCK_BOOKINGS } from "@/data/mock-data";
import { Booking } from "@/types";
import { useBookingStore } from "@/lib/store";
import { BOOKING_STATUSES, BookingStatusId } from "@/lib/constants";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const UPCOMING_STATUSES: BookingStatusId[] = [
  "rental_payment_pending",
  "rental_payment_submitted",
  "rental_payment_approved",
  "complete_booking",
  "additional_charges_pending",
  "additional_charges_submitted",
  "additional_charges_approved",
  "booking_confirmed",
  "vehicle_ready",
];

const ONGOING_STATUSES: BookingStatusId[] = ["trip_started"];
const COMPLETED_STATUSES: BookingStatusId[] = ["trip_completed", "deposit_refunded"];

function statusConfig(status: BookingStatusId) {
  const s = BOOKING_STATUSES.find((b) => b.id === status);
  return s || { label: status, color: "secondary" };
}

function BookingStatusTimeline({ status }: { status: BookingStatusId }) {
  const steps = BOOKING_STATUSES.filter((s) => s.id !== "cancelled");
  const currentIdx = steps.findIndex((s) => s.id === status);

  return (
    <div className="relative">
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {steps.slice(0, Math.min(currentIdx + 3, steps.length)).map((step, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className={cn(
                "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                done ? "bg-green-500 border-green-500" : active ? "bg-primary border-primary" : "border-muted-foreground/30"
              )}>
                {done && <CheckCircle className="h-3 w-3 text-white" />}
                {active && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <span className={cn(
                "text-xs",
                done ? "text-muted-foreground" : active ? "font-semibold text-foreground" : "text-muted-foreground/50"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TripsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);

  const { bookings: storeBookings } = useBookingStore();

  // Merge store bookings (as mock Booking type) with MOCK_BOOKINGS
  const allBookings: Booking[] = [
    ...MOCK_BOOKINGS,
    ...storeBookings.map((b) => ({
      id: b.id,
      carId: b.carId,
      car: { name: b.carName, images: [b.carImage], location: "", category: "suv", id: b.carId, brand: "", model: "", year: 2023, rating: 4.8, totalTrips: 100, fuelType: "petrol", transmission: "automatic", seats: 5, hourlyPrice: b.rentalAmount / Math.max(b.hours, 12), dailyPrice: 1000, minBookingHours: 12, extraHourCharge: 90, city: "", available: true, verified: true, features: [], description: "", rentalPolicy: [], securityDeposit: 0, mileage: "", engineCC: 0, color: "", licensePlate: "", hostName: "", hostAvatar: "", hostRating: 5 } as Booking["car"],
      userId: b.userId,
      status: b.status,
      pickupDate: new Date(b.pickupDate),
      pickupTime: b.pickupTime,
      returnDate: new Date(b.returnDate),
      returnTime: b.returnTime,
      totalHours: b.hours,
      rentalAmount: b.rentalAmount,
      deliveryOption: b.deliveryOption || "self_pickup",
      securityDeposit: 0,
      platformFee: 0,
      insuranceFee: 0,
      cleaningCharges: 0,
      fastagAdvance: 0,
      homeDeliveryFee: 0,
      additionalCharges: [],
      totalAmount: b.rentalAmount + b.secondPaymentAmount,
      rentalPaymentUtr: b.rentalPaymentUtr,
      secondPaymentUtr: b.secondPaymentUtr,
      paymentMethod: "upi" as const,
      paymentStatus: "paid" as const,
      customerDetails: { name: b.userName, email: "", phone: b.userPhone, emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelation: "" },
      createdAt: new Date(b.createdAt),
      updatedAt: new Date(b.createdAt),
      bookingReference: b.bookingRef,
    })),
  ];

  const upcoming = allBookings.filter((b) => UPCOMING_STATUSES.includes(b.status));
  const ongoing = allBookings.filter((b) => ONGOING_STATUSES.includes(b.status));
  const completed = allBookings.filter((b) => COMPLETED_STATUSES.includes(b.status));
  const cancelled = allBookings.filter((b) => b.status === "cancelled");

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Trips</h1>

        <Tabs defaultValue="upcoming">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming
              {upcoming.length > 0 && (
                <span className="ml-1 h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center">{upcoming.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <EmptyState icon={Calendar} title="No upcoming trips" description="Book a car and your upcoming trips will appear here"
                action={{ label: "Browse Cars", onClick: () => (window.location.href = "/cars") }}
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map((b, idx) => (
                  <TripCard key={b.id} booking={b} index={idx} onViewDetails={() => setSelectedBooking(b)}
                    onCancel={() => { setSelectedBooking(b); setCancelDialog(true); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing">
            {ongoing.length === 0 ? (
              <EmptyState icon={Car} title="No ongoing trips" description="Your active trips will show up here" />
            ) : (
              <div className="space-y-4">
                {ongoing.map((b, idx) => <TripCard key={b.id} booking={b} index={idx} onViewDetails={() => setSelectedBooking(b)} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completed.length === 0 ? (
              <EmptyState icon={Star} title="No completed trips" description="Completed trips will appear here"
                action={{ label: "Book a Car", onClick: () => (window.location.href = "/cars") }}
              />
            ) : (
              <div className="space-y-4">
                {completed.map((b, idx) => <TripCard key={b.id} booking={b} index={idx} onViewDetails={() => setSelectedBooking(b)} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {cancelled.length === 0 ? (
              <EmptyState icon={XCircle} title="No cancelled trips" description="Cancelled bookings appear here" />
            ) : (
              <div className="space-y-4">
                {cancelled.map((b, idx) => <TripCard key={b.id} booking={b} index={idx} onViewDetails={() => setSelectedBooking(b)} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking && !cancelDialog} onOpenChange={() => setSelectedBooking(null)}>
        {selectedBooking && (
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative h-20 w-28 rounded-xl overflow-hidden shrink-0">
                  <Image src={selectedBooking.car.images[0]} alt={selectedBooking.car.name} fill className="object-cover" sizes="112px" />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedBooking.car.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{selectedBooking.car.location}</span>
                  </div>
                  <Badge variant="secondary" className="mt-1 text-xs">{statusConfig(selectedBooking.status).label}</Badge>
                </div>
              </div>

              <Separator />
              <BookingStatusTimeline status={selectedBooking.status} />
              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Booking ID</p>
                  <p className="font-mono font-semibold">{selectedBooking.bookingReference}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Duration</p>
                  <p className="font-semibold">{selectedBooking.totalHours}hrs</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Pickup</p>
                  <p className="font-semibold text-xs">{formatDateTime(selectedBooking.pickupDate, selectedBooking.pickupTime)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Return</p>
                  <p className="font-semibold text-xs">{formatDateTime(selectedBooking.returnDate, selectedBooking.returnTime)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Delivery</p>
                  <p className="font-semibold capitalize text-xs">{selectedBooking.deliveryOption?.replace("_", " ")}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rental Amount</span>
                  <span>{formatCurrency(selectedBooking.rentalAmount)}</span>
                </div>
                {selectedBooking.securityDeposit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Security Deposit</span>
                    <span>{formatCurrency(selectedBooking.securityDeposit)}</span>
                  </div>
                )}
                {selectedBooking.platformFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span>{formatCurrency(selectedBooking.platformFee)}</span>
                  </div>
                )}
                {selectedBooking.homeDeliveryFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Home Delivery</span>
                    <span>{formatCurrency(selectedBooking.homeDeliveryFee)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(selectedBooking.totalAmount)}</span>
                </div>
              </div>

              {/* Action buttons */}
              {selectedBooking.status === "rental_payment_approved" && (
                <Link href={`/booking/complete?carId=${selectedBooking.carId}&bookingId=${selectedBooking.id}`}>
                  <Button variant="gradient" className="w-full gap-2">
                    Complete Booking <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => alert("Downloading...")}>
                  <Download className="h-4 w-4" />Invoice
                </Button>
                {(selectedBooking.status === "booking_confirmed" || selectedBooking.status === "vehicle_ready") && (
                  <Button variant="gradient" size="sm" className="gap-1.5">
                    <Timer className="h-4 w-4" />Extend
                  </Button>
                )}
                {selectedBooking.status === "trip_completed" && (
                  <Button variant="gradient" size="sm" className="gap-1.5">
                    <Star className="h-4 w-4" />Rate
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Cancel Booking</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Are you sure you want to cancel this booking?</p>
            <div className="bg-[#FFF8F3] dark:bg-[#FFF8F3]/20 border border-[#FF7A00]/20 dark:border-[#FF7A00]/20 rounded-xl p-3">
              <p className="text-xs text-[#FF7A00] dark:text-[#FF7A00]">Free cancellation if cancelled 24+ hours before pickup. 50% charge within 24 hours.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelDialog(false)}>Keep Booking</Button>
              <Button variant="destructive" className="flex-1" onClick={() => { setCancelDialog(false); setSelectedBooking(null); }}>Cancel Booking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Link href="/cars">
        <button className="fixed bottom-24 right-4 md:bottom-8 h-14 w-14 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF9A3C] text-white shadow-xl shadow-orange/30 flex items-center justify-center hover:shadow-orange/50 transition-shadow">
          <Plus className="h-6 w-6" />
        </button>
      </Link>

      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}

interface TripCardProps {
  booking: Booking;
  index: number;
  onViewDetails: () => void;
  onCancel?: () => void;
}

function TripCard({ booking, index, onViewDetails, onCancel }: TripCardProps) {
  const sc = statusConfig(booking.status);
  const colorMap: Record<string, string> = {
    success: "success",
    warning: "warning",
    info: "info",
    secondary: "secondary",
    destructive: "destructive",
  };
  const badgeVariant = (colorMap[sc.color] || "secondary") as "success" | "warning" | "info" | "secondary" | "destructive" | "default" | "outline";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-28 rounded-xl overflow-hidden shrink-0">
          <Image src={booking.car.images[0]} alt={booking.car.name} fill className="object-cover" sizes="112px" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">{booking.car.name}</h3>
            <Badge variant={badgeVariant} className="text-xs shrink-0 capitalize">{sc.label}</Badge>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">{booking.car.location}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(booking.pickupDate)}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{booking.totalHours}hrs</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="font-bold text-sm">{formatCurrency(booking.totalAmount)}</p>
        </div>
        <div className="flex gap-2">
          {booking.status === "rental_payment_approved" && (
            <Link href={`/booking/complete?carId=${booking.carId}&bookingId=${booking.id}`}>
              <Button variant="gradient" size="sm" className="h-8 text-xs gap-1">
                Complete <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {(UPCOMING_STATUSES.includes(booking.status) && booking.status !== "rental_payment_approved") && onCancel && (
            <Button variant="outline" size="sm" className="h-8 text-xs text-destructive hover:bg-destructive/10" onClick={onCancel}>Cancel</Button>
          )}
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={onViewDetails}>
            <MoreHorizontal className="h-3.5 w-3.5" />Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
