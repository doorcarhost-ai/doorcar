import { CarCategory, FuelType, SortOption, TransmissionType } from "@/types";

export const APP_NAME = "DoorCar";
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
  { id: "hatchback", label: "Hatchback", icon: "🚘", description: "City perfect" },
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

export const TRANSMISSION_TYPES: { id: TransmissionType; label: string }[] = [
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
    description: "Every car and host is thoroughly verified for your safety and peace of mind.",
    icon: "ShieldCheck",
  },
  {
    title: "Best Prices",
    description: "Transparent pricing with no hidden charges. Get the best deals guaranteed.",
    icon: "BadgeIndianRupee",
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you anytime, anywhere.",
    icon: "HeadphonesIcon",
  },
  {
    title: "Easy Booking",
    description: "Book in under 2 minutes with our streamlined booking experience.",
    icon: "Zap",
  },
  {
    title: "Flexible Rentals",
    description: "Hourly, daily or weekly — rent on your terms with flexible return options.",
    icon: "Clock",
  },
  {
    title: "Fully Insured",
    description: "All rides are fully insured. Drive with confidence, we've got you covered.",
    icon: "FileCheck",
  },
];

export const FAQS = [
  {
    question: "How does self-drive car rental work?",
    answer: "Simply search for available cars in your city, choose your preferred vehicle, complete profile verification, select pickup and return dates, pay the rental amount via UPI, and pick up the car at the designated location after admin approval.",
  },
  {
    question: "What documents do I need to rent a car?",
    answer: "You need a valid driving license (at least 1 year old), Aadhaar card, and a selfie for verification. All documents are uploaded once from your Profile section.",
  },
  {
    question: "Is there a minimum rental period?",
    answer: "The minimum rental period is 12 hours. You can book by the hour after that.",
  },
  {
    question: "How does the payment work?",
    answer: "DoorCar uses a custom UPI payment system. First, you pay only the rental amount via UPI. After admin approves, you pay the security deposit and additional charges. Your booking is confirmed only after the second payment is approved.",
  },
  {
    question: "Can I get home delivery?",
    answer: "Yes, home delivery is available for select cars. The delivery fee is configured per vehicle and added to your second payment. You can also choose self-pickup at no extra charge.",
  },
  {
    question: "What is the security deposit?",
    answer: "The security deposit varies by car category and is collected as part of the second payment (after rental approval). It is fully refundable after the trip.",
  },
  {
    question: "Can I extend my booking?",
    answer: "Yes, you can extend your booking through the app up to 2 hours before the scheduled return time, subject to availability.",
  },
  {
    question: "What are the cancellation charges?",
    answer: "Free cancellation up to 24 hours before pickup. 50% charge for cancellation within 24 hours. No refund for no-show.",
  },
];

// Booking status flow
export const BOOKING_STATUSES = [
  { id: "draft", label: "Draft", color: "secondary" },
  { id: "rental_payment_pending", label: "Rental Payment Pending", color: "warning" },
  { id: "rental_payment_submitted", label: "Rental Payment Submitted", color: "info" },
  { id: "rental_payment_approved", label: "Rental Payment Approved", color: "success" },
  { id: "complete_booking", label: "Complete Booking", color: "info" },
  { id: "additional_charges_pending", label: "Additional Charges Pending", color: "warning" },
  { id: "additional_charges_submitted", label: "Additional Charges Submitted", color: "info" },
  { id: "additional_charges_approved", label: "Additional Charges Approved", color: "success" },
  { id: "booking_confirmed", label: "Booking Confirmed", color: "success" },
  { id: "vehicle_ready", label: "Vehicle Ready", color: "success" },
  { id: "trip_started", label: "Trip Started", color: "success" },
  { id: "trip_completed", label: "Trip Completed", color: "secondary" },
  { id: "deposit_refunded", label: "Deposit Refunded", color: "secondary" },
  { id: "cancelled", label: "Cancelled", color: "destructive" },
] as const;

export type BookingStatusId = (typeof BOOKING_STATUSES)[number]["id"];

// Default admin config for a car
export const DEFAULT_CAR_ADMIN_CONFIG = {
  hourlyPrice: 85,
  minimumHours: 12,
  includedKm: 200,
  extraKmCharge: 12,
  extraHourCharge: 90,
  securityDeposit: 5000,
  platformFee: 199,
  insuranceFee: 299,
  cleaningCharges: 0,
  fastagAdvance: 0,
  enableHomeDelivery: true,
  homeDeliveryFee: 499,
  deliveryRadius: 20,
  maxDeliveryDistance: 25,
  estimatedDeliveryTime: "60-90 mins",
  fuelPolicy: "Same level return",
  pickupAddress: "HSR Layout, Bangalore - 560102",
  pickupLat: 12.9116,
  pickupLng: 77.6389,
  pickupMapsUrl: "https://maps.google.com",
  pickupContactPerson: "Host Name",
  pickupContactNumber: "9876543210",
  pickupTiming: "6:00 AM - 10:00 PM",
};

// UPI config (admin configures)
export const UPI_CONFIG = {
  upiId: "doorcar@upi",
  upiName: "DoorCar Rentals",
  reservationMinutes: 10,
};
