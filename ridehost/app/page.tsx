import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SearchBar } from "@/components/home/SearchBar";
import { Categories } from "@/components/home/Categories";
import { FeaturedCars } from "@/components/home/FeaturedCars";
import { PopularCars } from "@/components/home/PopularCars";
import { OffersBanner } from "@/components/home/OffersBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Reviews } from "@/components/home/Reviews";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "RideHost — Drive Your Way",
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroBanner />
      <SearchBar />
      <Categories />
      <FeaturedCars />
      <OffersBanner />
      <PopularCars />
      <WhyChooseUs />
      <Reviews />
      <FAQ />
      <Footer />
      <BottomNav />
      {/* Bottom nav spacer */}
      <div className="h-16 md:hidden" />
    </main>
  );
}
