import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SearchBar } from "@/components/home/SearchBar";
import { Categories } from "@/components/home/Categories";
import { FeaturedCars, LuxuryCollection, SuvCollection, EvCollection, PopularCars } from "@/components/home/FeaturedCars";
import { OffersBanner } from "@/components/home/OffersBanner";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Reviews } from "@/components/home/Reviews";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/layout/Footer";
import { AppDownloadBanner } from "@/components/home/AppDownloadBanner";

export const metadata: Metadata = {
  title: "DoorCar — Book Premium Self Drive Cars Across India",
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroBanner />
      <SearchBar />
      <Categories />
      <FeaturedCars />
      <LuxuryCollection />
      <OffersBanner />
      <SuvCollection />
      <EvCollection />
      <PopularCars />
      <WhyChooseUs />
      <Reviews />
      <AppDownloadBanner />
      <FAQ />
      <Footer />
      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}
