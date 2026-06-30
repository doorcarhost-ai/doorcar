import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck, Calendar, ChevronLeft, FileCheck, Fuel,
  MapPin, Settings2, Share2, Star, Users, Zap,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { CarGallery } from "@/components/cars/CarGallery";
import { BookingForm } from "@/components/cars/BookingForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/shared/StarRating";
import { MOCK_CARS, MOCK_REVIEWS } from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = MOCK_CARS.find((c) => c.id === id);
  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.name} — RideHost`,
    description: `Rent ${car.name} from ${formatCurrency(car.hourlyPrice)}/hr. ${car.description.slice(0, 100)}`,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = MOCK_CARS.find((c) => c.id === id);
  if (!car) notFound();

  const reviews = MOCK_REVIEWS.filter((r) => r.carName === car.name);
  const allReviews = reviews.length > 0 ? reviews : MOCK_REVIEWS.slice(0, 3);

  const specs = [
    { icon: car.fuelType === "electric" ? Zap : Fuel, label: "Fuel", value: car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1) },
    { icon: Settings2, label: "Transmission", value: car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1) },
    { icon: Users, label: "Seats", value: `${car.seats} Seater` },
    { icon: Star, label: "Mileage", value: car.mileage },
    { icon: Calendar, label: "Year", value: `${car.year}` },
  ];

  const included = ["24×7 roadside assistance", "100km included daily", "Fuel top-up support", "Contactless key handover"];
  const notIncluded = ["Driver", "Toll charges", "Parking fees", "Traffic fines"];

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB] pt-20 pb-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#FF7A00] transition-colors">
            <ChevronLeft className="h-4 w-4" />Back to Cars
          </Link>
          <Button variant="ghost" size="sm" className="gap-1.5 text-[#6B7280]">
            <Share2 className="h-4 w-4" />Share
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            <CarGallery images={car.images} carName={car.name} />

            {/* Header card */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <div className="flex flex-wrap gap-2 mb-3">
                {car.available ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Available Now
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">Unavailable</span>
                )}
                {car.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF8F3] border border-[#FF7A00]/20 text-[#FF7A00] text-xs font-bold">
                    <BadgeCheck className="h-3.5 w-3.5" />Host Verified
                  </span>
                )}
                <Badge variant="outline" className="capitalize text-xs">{car.category}</Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">{car.name}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
                  <span className="font-bold text-[#111827]">{car.rating}</span>
                  <span>({car.totalTrips.toLocaleString()} trips)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#FF7A00]" />{car.location}
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#E5E7EB] text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7A00]/10 mx-auto mb-2">
                      <Icon className="h-5 w-5 text-[#FF7A00]" />
                    </div>
                    <p className="text-xs text-[#6B7280] mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-[#111827]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-3">About this Car</h2>
              <p className="text-[#6B7280] leading-relaxed">{car.description}</p>
            </div>

            {/* Included / Not included */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">What&apos;s Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                    <BadgeCheck className="h-4 w-4" />Included
                  </p>
                  <ul className="space-y-2">
                    {included.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1.5">
                    <span className="h-4 w-4 text-center">✕</span>Not Included
                  </p>
                  <ul className="space-y-2">
                    {notIncluded.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Vehicle Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {car.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] text-sm text-[#111827]">
                    <BadgeCheck className="h-4 w-4 text-[#FF7A00] shrink-0" />{f}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Rental Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#FFF8F3] to-[#FFF1E6] rounded-2xl p-5 border border-[#FF7A00]/20 text-center">
                  <p className="text-xs text-[#6B7280] mb-1 font-semibold uppercase tracking-wider">Hourly Rate</p>
                  <p className="text-3xl font-bold text-[#FF7A00]">{formatCurrency(car.hourlyPrice)}</p>
                  <p className="text-xs text-[#6B7280] mt-1">per hour</p>
                </div>
                <div className="bg-[#F8F9FB] rounded-2xl p-5 border border-[#E5E7EB] text-center">
                  <p className="text-xs text-[#6B7280] mb-1 font-semibold uppercase tracking-wider">Minimum</p>
                  <p className="text-3xl font-bold text-[#111827]">{car.minBookingHours}hrs</p>
                  <p className="text-xs text-[#6B7280] mt-1">{formatCurrency(car.hourlyPrice * car.minBookingHours)} min charge</p>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-[#FF7A00]" />Cancellation Policy
              </h2>
              <div className="space-y-3">
                {[
                  { condition: "24+ hours before pickup", policy: "Full refund", color: "text-green-700 bg-green-50 border-green-200" },
                  { condition: "Within 24 hours", policy: "50% charge", color: "text-amber-700 bg-amber-50 border-amber-200" },
                  { condition: "No-show", policy: "No refund", color: "text-red-700 bg-red-50 border-red-200" },
                ].map(({ condition, policy, color }) => (
                  <div key={condition} className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm ${color}`}>
                    <span>{condition}</span>
                    <span className="font-bold">{policy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rental Policy */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Rental Policy</h2>
              <ul className="space-y-2">
                {car.rentalPolicy.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF7A00] shrink-0" />{p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Host */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Your Host</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden ring-2 ring-[#FF7A00]/20 shrink-0">
                  <Image src={car.hostAvatar} alt={car.hostName} fill className="object-cover" sizes="64px" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-[#111827]">{car.hostName}</p>
                    <BadgeCheck className="h-4 w-4 text-[#FF7A00]" />
                  </div>
                  <StarRating rating={car.hostRating} size="sm" showValue />
                  <p className="text-xs text-[#6B7280] mt-1">Member since 2022 · Response rate 98%</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#111827]">Reviews ({allReviews.length})</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
                  <span className="font-bold text-[#111827]">{car.rating}</span>
                </div>
              </div>
              <div className="space-y-4">
                {allReviews.map((review) => (
                  <div key={review.id} className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                        <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#111827]">{review.userName}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="text-xs text-[#9CA3AF] shrink-0">{review.date}</span>
                    </div>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
          </div>

          {/* ── Booking Form Sidebar ── */}
          <div className="lg:col-span-1">
            <BookingForm car={car} />
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}
