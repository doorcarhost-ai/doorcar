import { CarCategory, FuelType, SortOption, TransmissionType } from "@/types";

export const APP_NAME = "RideHost";
export const APP_TAGLINE = "Drive Your Way";
export const APP_DESCRIPTION =
  "India's premium self-drive car rental platform. Book top-rated cars for hourly, daily or weekly rentals.";

export const BOOKING_MIN_HOURS = 12;
export const CONVENIENCE_FEE = 99;
export const GST_RATE = 18;

export const CAR_CATEGORIES: {
  id: CarCategory;
  label: string;
  icon: string;
  description: string;
}[] = [
  { id: "suv", label: "SUV", icon: "🚙", description: "Spacious & powerful" },
  { id: "sedan", label: "Sedan", icon: "🚗", description: "Comfortable drive" },
  {
    id: "hatchback",
    label: "Hatchback",
    icon: "🚘",
    description: "City perfect",
  },
  { id: "luxury", label: "Luxury", icon: "✨", description: "Premium class" },
  { id: "ev", label: "Electric", icon: "⚡", description: "Eco friendly" },
  { id: "mpv", label: "MPV", icon: "🚐", description: "Family size" },
];

export const FUEL_TYPES: { id: FuelType; label: string; icon: string }[] = [
  { id: "petrol", label: "Petrol", icon: "⛽" },
  { id: "diesel", label: "Diesel", icon: "🛢️" },
  { id: "electric", label: "Electric", icon: "⚡" },
  { id: "hybrid", label: "Hybrid", icon: "🌿" },
];

export const TRANSMISSION_TYPES: {
  id: TransmissionType;
  label: string;
}[] = [
  { id: "automatic", label: "Automatic" },
  { id: "manual", label: "Manual" },
];

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "price_low", label: "Price: Low to High" },
  { id: "price_high", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
  { id: "trips", label: "Most Popular" },
  { id: "newest", label: "Newest First" },
];

export const CITIES = [
  { id: "bangalore", name: "Bangalore", state: "Karnataka", image: "" },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", image: "" },
  { id: "delhi", name: "Delhi", state: "Delhi", image: "" },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", image: "" },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", image: "" },
  { id: "pune", name: "Pune", state: "Maharashtra", image: "" },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", image: "" },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", image: "" },
];

export const GOVERNMENT_ID_TYPES = [
  { id: "aadhaar", label: "Aadhaar Card" },
  { id: "passport", label: "Passport" },
  { id: "voter_id", label: "Voter ID" },
  { id: "pan", label: "PAN Card" },
];

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Credit/Debit Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
  { id: "wallet", label: "Wallet", icon: "👛" },
];

export const NAV_ITEMS = [
  { label: "Home", href: "/", icon: "Home" },
  { label: "Cars", href: "/cars", icon: "Car" },
  { label: "Trips", href: "/trips", icon: "Map" },
  { label: "Profile", href: "/profile", icon: "User" },
];

export const WHY_CHOOSE_US = [
  {
    title: "Verified Hosts",
    description:
      "Every car and host is thoroughly verified for your safety and peace of mind.",
    icon: "ShieldCheck",
  },
  {
    title: "Best Prices",
    description:
      "Transparent pricing with no hidden charges. Get the best deals guaranteed.",
    icon: "BadgeIndianRupee",
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock customer support to assist you anytime, anywhere.",
    icon: "HeadphonesIcon",
  },
  {
    title: "Easy Booking",
    description:
      "Book in under 2 minutes with our streamlined booking experience.",
    icon: "Zap",
  },
  {
    title: "Flexible Rentals",
    description:
      "Hourly, daily or weekly — rent on your terms with flexible return options.",
    icon: "Clock",
  },
  {
    title: "Fully Insured",
    description:
      "All rides are fully insured. Drive with confidence, we've got you covered.",
    icon: "FileCheck",
  },
];

export const FAQS = [
  {
    question: "How does self-drive car rental work?",
    answer:
      "Simply search for available cars in your city, choose your preferred vehicle, select pickup and return dates, complete your booking with license and ID verification, and pick up the car at the designated location.",
  },
  {
    question: "What documents do I need to rent a car?",
    answer:
      "You need a valid driving license (at least 1 year old), a government-issued photo ID (Aadhaar, Passport, Voter ID), and a security deposit.",
  },
  {
    question: "Is there a minimum rental period?",
    answer:
      "The minimum rental period is 12 hours. You can book by the hour after that.",
  },
  {
    question: "What is the security deposit?",
    answer:
      "The security deposit varies by car category, typically ranging from ₹2,000 to ₹10,000. It is fully refundable after the trip if the car is returned in the same condition.",
  },
  {
    question: "Can I extend my booking?",
    answer:
      "Yes, you can extend your booking through the app up to 2 hours before the scheduled return time, subject to availability.",
  },
  {
    question: "What happens in case of breakdown?",
    answer:
      "Our 24/7 roadside assistance team will be dispatched immediately. We also provide a replacement vehicle if the repair takes more than 2 hours.",
  },
  {
    question: "Is fuel included in the rental?",
    answer:
      "No, fuel is not included. You need to return the car with the same fuel level as when you picked it up.",
  },
  {
    question: "What are the cancellation charges?",
    answer:
      "Free cancellation up to 24 hours before pickup. 50% charge for cancellation within 24 hours. No refund for no-show.",
  },
];
