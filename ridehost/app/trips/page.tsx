"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Car,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/EmptyState";
import { StarRating } from "@/components/shared/StarRating";
import { MOCK_BOOKINGS } from "@/data/mock-data";
import { Booking } from "@/types";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

export default function TripsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);

  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === "upcoming");
  const ongoing = MOCK_BOOKINGS.filter((b) => b.status === "ongoing");
  const completed = MOCK_BOOKINGS.filter((b) => b.status === "completed");
  const cancelled = MOCK_BOOKINGS.filter((b) => b.status === "cancelled");

  const statusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "info";
      case "ongoing":
        return "success";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Trips</h1>

        <Tabs defaultValue="upcoming">
          <TabsList className="w-full grid grid-cols-4 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming{" "}
              {upcoming.length > 0 && (
                <span className="ml-1 h-4 w-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center">
                  {upcoming.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming trips"
                description="Book a car and your upcoming trips will appear here"
                action={{
                  label: "Browse Cars",
                  onClick: () => (window.location.href = "/cars"),
                }}
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map((booking, idx) => (
                  <TripCard
                    key={booking.id}
                    booking={booking}
                    index={idx}
                    onViewDetails={() => setSelectedBooking(booking)}
                    onCancel={() => {
                      setSelectedBooking(booking);
                      setCancelDialog(true);
                    }}
                    statusColor={statusColor(booking.status)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing">
            {ongoing.length === 0 ? (
              <EmptyState
                icon={Car}
                title="No ongoing trips"
                description="Your active trips will show up here"
              />
            ) : (
              <div className="space-y-4">
                {ongoing.map((booking, idx) => (
                  <TripCard
                    key={booking.id}
                    booking={booking}
                    index={idx}
                    onViewDetails={() => setSelectedBooking(booking)}
                    statusColor={statusColor(booking.status)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completed.length === 0 ? (
              <EmptyState
                icon={Star}
                title="No completed trips"
                description="Trips you&apos;ve completed will appear here"
                action={{
                  label: "Book a Car",
                  onClick: () => (window.location.href = "/cars"),
                }}
              />
            ) : (
              <div className="space-y-4">
                {completed.map((booking, idx) => (
                  <TripCard
                    key={booking.id}
                    booking={booking}
                    index={idx}
                    onViewDetails={() => setSelectedBooking(booking)}
                    statusColor={statusColor(booking.status)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {cancelled.length === 0 ? (
              <EmptyState
                icon={XCircle}
                title="No cancelled trips"
                description="Cancelled bookings will appear here"
              />
            ) : (
              <div className="space-y-4">
                {cancelled.map((booking, idx) => (
                  <TripCard
                    key={booking.id}
                    booking={booking}
                    index={idx}
                    onViewDetails={() => setSelectedBooking(booking)}
                    statusColor={statusColor(booking.status)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Detail Dialog */}
      <Dialog
        open={!!selectedBooking && !cancelDialog}
        onOpenChange={() => setSelectedBooking(null)}
      >
        {selectedBooking && (
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative h-20 w-28 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={selectedBooking.car.images[0]}
                    alt={selectedBooking.car.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedBooking.car.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedBooking.car.location}
                    </span>
                  </div>
                  <Badge
                    variant={statusColor(selectedBooking.status) as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}
                    className="mt-1 capitalize"
                  >
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">
                    Booking ID
                  </p>
                  <p className="font-mono font-semibold">
                    {selectedBooking.bookingReference}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">
                    Duration
                  </p>
                  <p className="font-semibold">
                    {selectedBooking.totalHours}hrs
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Pickup</p>
                  <p className="font-semibold text-xs">
                    {formatDateTime(
                      selectedBooking.pickupDate,
                      selectedBooking.pickupTime
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Return</p>
                  <p className="font-semibold text-xs">
                    {formatDateTime(
                      selectedBooking.returnDate,
                      selectedBooking.returnTime
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rental Amount</span>
                  <span>{formatCurrency(selectedBooking.rentalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Security Deposit
                  </span>
                  <span>{formatCurrency(selectedBooking.securityDeposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST</span>
                  <span>{formatCurrency(selectedBooking.gst)}</span>
                </div>
                {selectedBooking.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- {formatCurrency(selectedBooking.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span className="text-primary">
                    {formatCurrency(selectedBooking.totalAmount)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => alert("Downloading invoice...")}
                >
                  <Download className="h-4 w-4" />
                  Invoice
                </Button>
                {selectedBooking.status === "upcoming" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-destructive hover:bg-destructive/10"
                    onClick={() => setCancelDialog(true)}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </Button>
                )}
                {selectedBooking.status === "ongoing" && (
                  <Button
                    variant="gradient"
                    size="sm"
                    className="gap-1.5"
                  >
                    <Timer className="h-4 w-4" />
                    Extend
                  </Button>
                )}
                {selectedBooking.status === "completed" && (
                  <Button variant="gradient" size="sm" className="gap-1.5">
                    <Star className="h-4 w-4" />
                    Rate
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
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel this booking?
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Free cancellation if cancelled 24+ hours before pickup. 50%
                charge within 24 hours.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCancelDialog(false)}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  setCancelDialog(false);
                  setSelectedBooking(null);
                }}
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAB */}
      <Link href="/cars">
        <button className="fixed bottom-24 right-4 md:bottom-8 h-14 w-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-violet-500/40 transition-shadow">
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
  statusColor: string;
}

function TripCard({
  booking,
  index,
  onViewDetails,
  onCancel,
  statusColor,
}: TripCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4 p-4">
        <div className="relative h-20 w-28 rounded-xl overflow-hidden shrink-0">
          <Image
            src={booking.car.images[0]}
            alt={booking.car.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold truncate">{booking.car.name}</h3>
            <Badge
              variant={statusColor as "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"}
              className="capitalize shrink-0 text-xs"
            >
              {booking.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">
              {booking.car.location}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(booking.pickupDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {booking.totalHours}hrs
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Total Paid</p>
          <p className="font-bold text-sm">
            {formatCurrency(booking.totalAmount)}
          </p>
        </div>
        <div className="flex gap-2">
          {booking.status === "upcoming" && onCancel && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-destructive hover:bg-destructive/10"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={onViewDetails}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
            Details
          </Button>
        </div>
      </div>

      {booking.status === "completed" && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground mb-1.5">
            Rate your experience
          </p>
          <StarRating rating={0} size="md" className="gap-2" />
        </div>
      )}
    </motion.div>
  );
}
