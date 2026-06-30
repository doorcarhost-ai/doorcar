export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  images: string[];
  rating: number;
  totalTrips: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  seats: number;
  hourlyPrice: number;
  dailyPrice: number;
  minBookingHours: number;
  extraHourCharge: number;
  location: string;
  city: string;
  available: boolean;
  verified: boolean;
  features: string[];
  description: string;
  rentalPolicy: string[];
  securityDeposit: number;
  mileage: string;
  engineCC: number;
  color: string;
  licensePlate: string;
  hostName: string;
  hostAvatar: string;
  hostRating: number;
}

export type CarCategory = "suv" | "sedan" | "hatchback" | "luxury" | "ev" | "mpv";
export type FuelType = "petrol" | "diesel" | "electric" | "hybrid";
export type TransmissionType = "manual" | "automatic";

export interface Booking {
  id: string;
  carId: string;
  car: Car;
  userId: string;
  status: BookingStatus;
  pickupDate: Date;
  pickupTime: string;
  returnDate: Date;
  returnTime: string;
  totalHours: number;
  rentalAmount: number;
  securityDeposit: number;
  convenienceFee: number;
  gst: number;
  discount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerDetails: CustomerDetails;
  createdAt: Date;
  updatedAt: Date;
  bookingReference: string;
}

export type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  drivingLicenseNumber: string;
  drivingLicenseExpiry: string;
  drivingLicenseImage?: string;
  governmentIdType: string;
  governmentIdNumber: string;
  governmentIdImage?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  drivingLicense?: string;
  governmentId?: string;
  savedAddresses: Address[];
  paymentMethods: SavedPaymentMethod[];
  totalTrips: number;
  memberSince: string;
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethod;
  label: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  carName?: string;
  trips?: number;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validTill: string;
  color: string;
  image?: string;
}

export interface FilterState {
  category: CarCategory[];
  fuelType: FuelType[];
  transmission: TransmissionType[];
  minPrice: number;
  maxPrice: number;
  seats: number[];
  rating: number;
  available: boolean;
  sortBy: SortOption;
}

export type SortOption = "price_low" | "price_high" | "rating" | "trips" | "newest";

export interface BookingFormData {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
}

export interface City {
  id: string;
  name: string;
  state: string;
  image: string;
}
