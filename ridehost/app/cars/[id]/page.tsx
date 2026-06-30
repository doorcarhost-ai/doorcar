import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, ChevronLeft, Fuel, MapPin, Settings2, Share2, Star, Users, Zap } from "lucide-react";
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
  return { title: `${car.name} — RideHost`, description: `Rent the ${car.name} from ${formatCurrency(car.hourlyPrice)}/hr` };
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
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-20 pb-4 px-4 sm:px-6 max-w-7xl mx-auto bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between">
          <Link href="/cars" className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#FF7A00] transition-colors">
            <ChevronLeft className="h-4 w-4" />Back to Cars
          </Link>
          <Button variant="ghost" size="sm" className="gap-1.5 text-[#6B7280]">
            <Share2 className="h-4 w-4" />Share
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <CarGallery images={car.images} carName={car.name} />

            {/* Car title */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">{car.name}</h1>
              </div>
              <div className="flex items-center flex-wrap gap-2 mb-4">
                {car.available ? (
                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">✓ Available</span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">Unavailable</span>
                )}
                {car.verified && (
                  <span className="px-3 py-1 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] text-xs font-bold flex items-center gap-1 border border-[#FF7A00]/20">
                    <BadgeCheck className="h-3.5 w-3.5" />Host Verified
                  </span>
                )}
                <Badge variant="outline" className="capitalize text-xs">{car.category}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
                  <span className="font-bold text-[#111827]">{car.rating}</span>
                  <span>({car.totalTrips} trips)</span>
                </div>
                <div className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{car.location}</div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-[#F8F9FB] rounded-2xl p-4 text-center border border-[#E5E7EB]">
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
              <p className="text-[#6B7280] text-sm leading-relaxed">{car.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {car.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#E5E7EB] bg-[#F8F9FB] text-sm text-[#111827]">
                    <BadgeCheck className="h-4 w-4 text-[#FF7A00] shrink-0" />{f}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing — ONLY show hourly rate and duration info, NO deposit */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Rental Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FFF8F3] rounded-2xl p-4 border border-[#FF7A00]/20">
                  <p className="text-xs text-[#6B7280] mb-1">Hourly Rate</p>
                  <p className="text-2xl font-bold text-[#FF7A00]">{formatCurrency(car.hourlyPrice)}</p>
                  <p className="text-xs text-[#6B7280]">per hour</p>
                </div>
                <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#E5E7EB]">
                  <p className="text-xs text-[#6B7280] mb-1">Minimum Booking</p>
                  <p className="text-2xl font-bold text-[#111827]">{car.minBookingHours}</p>
                  <p className="text-xs text-[#6B7280]">hours minimum</p>
                </div>
              </div>
              <p className="text-xs text-[#6B7280] mt-4 p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]">
                * Security deposit and other charges are collected only after your rental payment is approved. No hidden fees.
              </p>
            </div>

            {/* Rental Policy */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Rental Policy</h2>
              <ul className="space-y-2">
                {car.rentalPolicy.map((policy, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF7A00] shrink-0" />{policy}
                  </li>
                ))}
              </ul>
            </div>

            {/* Host */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Hosted by</h2>
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-[#FF7A00]/20">
                  <Image src={car.hostAvatar} alt={car.hostName} fill className="object-cover" sizes="56px" />
                </div>
                <div>
                  <p className="font-bold text-[#111827]">{car.hostName}</p>
                  <StarRating rating={car.hostRating} size="sm" showValue className="mt-1" />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
              <h2 className="text-lg font-bold text-[#111827] mb-4">Reviews ({allReviews.length})</h2>
              <div className="space-y-4">
                {allReviews.map((review) => (
                  <div key={review.id} className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#111827]">{review.userName}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="ml-auto text-xs text-[#6B7280]">{review.date}</span>
                    </div>
                    <p className="text-sm text-[#6B7280]">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
          </div>

          {/* Sidebar — Booking form */}
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
