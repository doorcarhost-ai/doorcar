import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  ChevronLeft,
  Fuel,
  MapPin,
  Settings2,
  Share2,
  Star,
  Users,
  Zap,
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

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CarDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const car = MOCK_CARS.find((c) => c.id === id);
  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.name} — Self Drive Rental`,
    description: `Rent the ${car.name} starting at ${formatCurrency(car.hourlyPrice)}/hr. ${car.description.slice(0, 100)}`,
  };
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = await params;
  const car = MOCK_CARS.find((c) => c.id === id);

  if (!car) notFound();

  const carReviews = MOCK_REVIEWS.filter((r) => r.carName === car.name);
  const allReviews = carReviews.length > 0 ? carReviews : MOCK_REVIEWS.slice(0, 3);

  const fuelLabel =
    car.fuelType === "electric"
      ? `${car.mileage}`
      : `${car.mileage} mileage`;

  const specs = [
    {
      icon: car.fuelType === "electric" ? Zap : Fuel,
      label: "Fuel",
      value: car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1),
    },
    { icon: Settings2, label: "Transmission", value: car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1) },
    { icon: Users, label: "Seats", value: `${car.seats} Seater` },
    { icon: Star, label: "Mileage", value: fuelLabel },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-20 pb-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link
          href="/cars"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Cars
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <CarGallery images={car.images} carName={car.name} />

            {/* Car header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    {car.name}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    {car.available ? (
                      <Badge variant="success">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5" />
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Unavailable</Badge>
                    )}
                    {car.verified && (
                      <Badge variant="info" className="flex items-center gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="outline" className="capitalize">
                      {car.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-foreground">
                    {car.rating}
                  </span>
                  <span>({car.totalTrips} trips)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {car.location}
                </div>
              </div>
            </div>

            {/* Specs */}
            <div>
              <h2 className="text-lg font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-card border border-border rounded-2xl p-4 text-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div>
              <h2 className="text-lg font-bold mb-3">About this Car</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {car.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-lg font-bold mb-4">Vehicle Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {car.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-card text-sm"
                  >
                    <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Model */}
            <div>
              <h2 className="text-lg font-bold mb-4">Pricing</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border">
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Hourly</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(car.hourlyPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground">per hour</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Min. Charge
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(car.hourlyPrice * car.minBookingHours)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {car.minBookingHours}hr minimum
                    </p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Extra Hour
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(car.extraHourCharge)}
                    </p>
                    <p className="text-xs text-muted-foreground">per hour</p>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">
                      Deposit
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(car.securityDeposit)}
                    </p>
                    <p className="text-xs text-muted-foreground">refundable</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Policy */}
            <div>
              <h2 className="text-lg font-bold mb-4">Rental Policy</h2>
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5">
                <ul className="space-y-2">
                  {car.rentalPolicy.map((policy, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      {policy}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Host */}
            <div>
              <h2 className="text-lg font-bold mb-4">Hosted by</h2>
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                <div className="relative h-14 w-14 rounded-full overflow-hidden">
                  <Image
                    src={car.hostAvatar}
                    alt={car.hostName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-semibold">{car.hostName}</p>
                  <StarRating
                    rating={car.hostRating}
                    size="sm"
                    showValue
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-lg font-bold mb-4">
                Reviews ({allReviews.length})
              </h2>
              <div className="space-y-4">
                {allReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 bg-card border border-border rounded-2xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={review.userAvatar}
                          alt={review.userName}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.userName}</p>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />
          </div>

          {/* Booking Form - sidebar */}
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
