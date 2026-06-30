"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, Calendar, Car, CheckCircle, Clock,
  Download, HeadphonesIcon, MapPin, MoreHorizontal,
  Phone, Plus, Star, Timer, XCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { MOCK_BOOKINGS } from "@/data/mock-data";
import { Booking } from "@/types";
import { BOOKING_STATUSES, BookingStatusId } from "@/lib/constants";
import { useBookingStore } from "@/lib/store";
import { formatCurrency, formatDate, formatDateTime, formatHours } from "@/lib/utils";
import { cn } from "@/lib/utils";

const UPCOMING: BookingStatusId[] = [
  "rental_payment_pending", "rental_payment_submitted", "rental_payment_approved",
  "complete_booking", "additional_charges_pending", "additional_charges_submitted",
  "additional_charges_approved", "booking_confirmed", "vehicle_ready",
];
const ONGOING: BookingStatusId[] = ["trip_started"];
const DONE: BookingStatusId[] = ["trip_completed", "deposit_refunded"];

// Status timeline for display
const STATUS_TIMELINE: { id: BookingStatusId; label: string; icon: React.ElementType }[] = [
  { id: "rental_payment_pending", label: "Rental Payment Pending", icon: Clock },
  { id: "rental_payment_submitted", label: "Rental Payment Submitted", icon: ArrowRight },
  { id: "rental_payment_approved", label: "Rental Payment Approved", icon: CheckCircle },
  { id: "complete_booking", label: "Complete Booking", icon: ArrowRight },
  { id: "additional_charges_pending", label: "Remaining Charges Pending", icon: Clock },
  { id: "additional_charges_submitted", label: "Remaining Charges Submitted", icon: ArrowRight },
  { id: "booking_confirmed", label: "Booking Confirmed", icon: CheckCircle },
  { id: "vehicle_ready", label: "Vehicle Ready", icon: Car },
  { id: "trip_started", label: "Trip Started", icon: MapPin },
  { id: "trip_completed", label: "Trip Completed", icon: Star },
  { id: "deposit_refunded", label: "Deposit Refunded", icon: CheckCircle },
];

function StatusTimeline({ currentStatus }: { currentStatus: BookingStatusId }) {
  const currentIdx = STATUS_TIMELINE.findIndex((s) => s.id === currentStatus);
  const visible = STATUS_TIMELINE.slice(0, Math.min(currentIdx + 4, STATUS_TIMELINE.length));

  return (
    <div className="space-y-2">
      {visible.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center gap-3">
            <div className={cn(
              "h-7 w-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all",
              done ? "bg-[#FF7A00] border-[#FF7A00]" : active ? "bg-[#FF7A00]/10 border-[#FF7A00]" : "bg-white border-[#E5E7EB]"
            )}>
              {done ? (
                <CheckCircle className="h-3.5 w-3.5 text-white" />
              ) : (
                <Icon className={cn("h-3.5 w-3.5", active ? "text-[#FF7A00]" : "text-[#9CA3AF]")} />
              )}
            </div>
            <span className={cn(
              "text-sm transition-colors",
              done ? "text-[#6B7280]" : active ? "font-bold text-[#111827]" : "text-[#9CA3AF]"
            )}>
              {step.label}
            </span>
            {active && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-auto text-xs font-semibold text-[#FF7A00]"
              >
                Current
              </motion.span>
            )}
          </div>
        );
      })}
      {currentIdx < STATUS_TIMELINE.length - 1 && (
        <p className="text-xs text-[#9CA3AF] pl-10">
          +{STATUS_TIMELINE.length - visible.length} more steps
        </p>
      )}
    </div>
  );
}

function statusLabel(id: BookingStatusId) {
  return BOOKING_STATUSES.find((s) => s.id === id)?.label || id;
}

function statusVariant(id: BookingStatusId): "success" | "warning" | "info" | "secondary" | "destructive" | "default" | "outline" {
  const color = BOOKING_STATUSES.find((s) => s.id === id)?.color || "secondary";
  const map: Record<string, "success" | "warning" | "info" | "secondary" | "destructive"> = {
    success: "success", warning: "warning", info: "info", secondary: "secondary", destructive: "destructive",
  };
  return map[color] || "secondary";
}

export default function TripsPage() {
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);

  const { bookings: storeBookings } = useBookingStore();

  const allBookings: Booking[] = [
    ...MOCK_BOOKINGS,
    ...storeBookings.map((b) => ({
      id: b.id,
      carId: b.carId,
      car: {
        name: b.carName, images: [b.carImage], location: "", category: "suv" as const,
        id: b.carId, brand: "", model: "", year: 2023, rating: 4.8, totalTrips: 100,
        fuelType: "petrol" as const, transmission: "automatic" as const, seats: 5,
        hourlyPrice: b.rentalAmount / Math.max(b.hours, 12), dailyPrice: 1000,
        minBookingHours: 12, extraHourCharge: 90, city: "", available: true, verified: true,
        features: [], description: "", rentalPolicy: [], securityDeposit: 0, mileage: "",
        engineCC: 0, color: "", licensePlate: "", hostName: "", hostAvatar: "", hostRating: 5,
      },
      userId: b.userId,
      status: b.status,
      pickupDate: new Date(b.pickupDate),
      pickupTime: b.pickupTime,
      returnDate: new Date(b.returnDate),
      returnTime: b.returnTime,
      totalHours: b.hours,
      rentalAmount: b.rentalAmount,
      deliveryOption: b.deliveryOption || "self_pickup",
      securityDeposit: 0, platformFee: 0, insuranceFee: 0,
      cleaningCharges: 0, fastagAdvance: 0, homeDeliveryFee: 0,
      additionalCharges: [],
      totalAmount: b.rentalAmount + b.secondPaymentAmount,
      rentalPaymentUtr: b.rentalPaymentUtr,
      secondPaymentUtr: b.secondPaymentUtr,
      paymentMethod: "upi" as const, paymentStatus: "paid" as const,
      customerDetails: { name: b.userName, email: "", phone: b.userPhone, emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelation: "" },
      createdAt: new Date(b.createdAt), updatedAt: new Date(b.createdAt),
      bookingReference: b.bookingRef,
    })),
  ];

  const upcoming = allBookings.filter((b) => UPCOMING.includes(b.status));
  const ongoing = allBookings.filter((b) => ONGOING.includes(b.status));
  const done = allBookings.filter((b) => DONE.includes(b.status));
  const cancelled = allBookings.filter((b) => b.status === "cancelled");

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">My Trips</h1>
          <Link href="/cars">
            <Button variant="gradient" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />New Booking
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="w-full grid grid-cols-4 mb-6 bg-white border border-[#E5E7EB] p-1 rounded-2xl">
            {[
              { val: "upcoming", label: "Upcoming", count: upcoming.length },
              { val: "ongoing", label: "Ongoing", count: ongoing.length },
              { val: "completed", label: "Done", count: done.length },
              { val: "cancelled", label: "Cancelled", count: cancelled.length },
            ].map(({ val, label, count }) => (
              <TabsTrigger key={val} value={val} className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white data-[state=inactive]:text-[#6B7280] text-xs sm:text-sm font-semibold">
                {label}
                {count > 0 && (
                  <span className="ml-1 h-5 w-5 rounded-full bg-current/20 text-[10px] font-bold flex items-center justify-center">
                    {count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <EmptyState icon={Calendar} title="No upcoming trips" description="Book a car to see your trips here"
                action={{ label: "Browse Cars", onClick: () => (window.location.href = "/cars") }}
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map((b, i) => (
                  <TripCard key={b.id} booking={b} index={i}
                    onViewDetails={() => setDetailBooking(b)}
                    onCancel={() => { setDetailBooking(b); setCancelDialog(true); }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing">
            {ongoing.length === 0 ? (
              <EmptyState icon={Car} title="No ongoing trips" description="Active trips will appear here" />
            ) : (
              <div className="space-y-4">
                {ongoing.map((b, i) => <TripCard key={b.id} booking={b} index={i} onViewDetails={() => setDetailBooking(b)} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {done.length === 0 ? (
              <EmptyState icon={Star} title="No completed trips" description="Completed trips appear here"
                action={{ label: "Book a Car", onClick: () => (window.location.href = "/cars") }}
              />
            ) : (
              <div className="space-y-4">
                {done.map((b, i) => <TripCard key={b.id} booking={b} index={i} onViewDetails={() => setDetailBooking(b)} />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {cancelled.length === 0 ? (
              <EmptyState icon={XCircle} title="No cancelled trips" description="Cancelled bookings appear here" />
            ) : (
              <div className="space-y-4">
                {cancelled.map((b, i) => <TripCard key={b.id} booking={b} index={i} onViewDetails={() => setDetailBooking(b)} />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailBooking && !cancelDialog} onOpenChange={() => setDetailBooking(null)}>
        {detailBooking && (
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#111827]">Booking Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              {/* Car */}
              <div className="flex gap-3">
                <div className="relative h-20 w-28 rounded-2xl overflow-hidden shrink-0">
                  <Image src={detailBooking.car.images[0]} alt={detailBooking.car.name} fill className="object-cover" sizes="112px" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111827]">{detailBooking.car.name}</h3>
                  {detailBooking.car.location && (
                    <div className="flex items-center gap-1 mt-1"><MapPin className="h-3.5 w-3.5 text-[#6B7280]" /><span className="text-sm text-[#6B7280]">{detailBooking.car.location}</span></div>
                  )}
                  <Badge variant={statusVariant(detailBooking.status)} className="mt-1.5 text-xs">{statusLabel(detailBooking.status)}</Badge>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#E5E7EB]">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Booking Progress</p>
                <StatusTimeline currentStatus={detailBooking.status} />
              </div>

              <Separator />

              {/* Trip details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-[#F8F9FB] rounded-xl p-3 border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Booking ID</p>
                  <p className="font-mono font-bold text-[#111827] text-xs">{detailBooking.bookingReference}</p>
                </div>
                <div className="bg-[#F8F9FB] rounded-xl p-3 border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Duration</p>
                  <p className="font-bold text-[#111827]">{formatHours(detailBooking.totalHours)}</p>
                </div>
                <div className="bg-[#F8F9FB] rounded-xl p-3 border border-[#E5E7EB] col-span-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-0.5">Pickup</p>
                      <p className="text-xs font-semibold text-[#111827]">{formatDateTime(detailBooking.pickupDate, detailBooking.pickupTime)}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#9CA3AF] self-center" />
                    <div className="text-right">
                      <p className="text-xs text-[#6B7280] mb-0.5">Return</p>
                      <p className="text-xs font-semibold text-[#111827]">{formatDateTime(detailBooking.returnDate, detailBooking.returnTime)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#6B7280]">Rental Amount</span><span>{formatCurrency(detailBooking.rentalAmount)}</span></div>
                {detailBooking.homeDeliveryFee > 0 && <div className="flex justify-between"><span className="text-[#6B7280]">Home Delivery</span><span>{formatCurrency(detailBooking.homeDeliveryFee)}</span></div>}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-[#111827]">Total</span>
                  <span className="text-[#FF7A00]">{formatCurrency(detailBooking.totalAmount)}</span>
                </div>
              </div>

              {/* Actions */}
              {(detailBooking.status === "rental_payment_approved" || detailBooking.status === "additional_charges_pending") && (
                <Link href={`/booking/complete?carId=${detailBooking.carId}&bookingId=${detailBooking.id}`}>
                  <Button variant="gradient" className="w-full gap-2">
                    Complete Booking <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              {(detailBooking.status === "rental_payment_submitted" || detailBooking.status === "additional_charges_submitted") && (
                <div className="w-full h-11 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
                  <div className="h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  Waiting for Admin Approval
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => alert("Downloading invoice...")}>
                  <Download className="h-4 w-4" />Invoice
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Phone className="h-4 w-4" />Support
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="text-[#111827]">Cancel Booking</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-[#6B7280]">Are you sure you want to cancel this booking?</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-700">Free cancellation if cancelled 24+ hours before pickup. 50% charge within 24 hours.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setCancelDialog(false)}>Keep Booking</Button>
              <Button variant="destructive" className="flex-1 bg-red-600 text-white hover:bg-red-700 border-0" onClick={() => { setCancelDialog(false); setDetailBooking(null); }}>Cancel Booking</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
  const completePath = `/booking/complete?carId=${booking.carId}&bookingId=${booking.id}`;
  const needsCompleteBooking = booking.status === "rental_payment_approved" || booking.status === "additional_charges_pending";
  const waitingApproval = booking.status === "rental_payment_submitted" || booking.status === "additional_charges_submitted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-premium hover:shadow-premium-lg transition-shadow"
    >
      <div className="flex gap-4 p-4">
        <div className="relative h-24 w-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
          <Image src={booking.car.images[0]} alt={booking.car.name} fill className="object-cover" sizes="128px" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-[#111827] truncate">{booking.car.name}</h3>
              {booking.car.location && (
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-[#6B7280]" />
                  <span className="text-xs text-[#6B7280] truncate">{booking.car.location}</span>
                </div>
              )}
            </div>
            <Badge variant={statusVariant(booking.status)} className="text-[10px] shrink-0 whitespace-nowrap">
              {statusLabel(booking.status)}
            </Badge>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(booking.pickupDate)}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatHours(booking.totalHours)}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5">
            <p className="text-xs text-[#6B7280] font-mono">{booking.bookingReference}</p>
          </div>
        </div>
      </div>

      {/* Prominent Complete Booking CTA — spans full width */}
      {needsCompleteBooking && (
        <div className="px-4 pb-3">
          <Link href={completePath} className="block">
            <Button variant="gradient" className="w-full gap-2 h-11 text-sm font-bold shadow-orange">
              Complete Booking <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      {/* Waiting for approval — full width disabled state */}
      {waitingApproval && (
        <div className="px-4 pb-3">
          <div className="w-full h-11 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold">
            <div className="h-4 w-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            Waiting for Admin Approval
          </div>
        </div>
      )}

      {/* Standard actions row */}
      <div className="border-t border-[#F8F9FB] px-4 py-3 flex items-center justify-between bg-gray-50/50">
        <div>
          <p className="text-xs text-[#6B7280]">Rental Paid</p>
          <p className="font-bold text-[#111827]">{formatCurrency(booking.rentalAmount)}</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {UPCOMING.includes(booking.status)
            && !needsCompleteBooking
            && !waitingApproval
            && booking.status !== "booking_confirmed"
            && booking.status !== "vehicle_ready"
            && booking.status !== "additional_charges_approved"
            && onCancel && (
            <Button variant="outline" size="sm" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {booking.status === "trip_completed" && (
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
              <Star className="h-3.5 w-3.5 text-[#FF7A00]" />Rate
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={onViewDetails}>
            <MoreHorizontal className="h-3.5 w-3.5" />Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
