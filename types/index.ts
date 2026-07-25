import type { BookingStatusId } from "@/lib/constants";

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

export interface CarAdminConfig {
  carId: string;
  hourlyPrice: number;
  minimumHours: number;
  includedKm: number;
  extraKmCharge: number;
  extraHourCharge: number;
  securityDeposit: number;
  platformFee: number;
  insuranceFee: number;
  cleaningCharges: number;
  fastagAdvance: number;
  enableHomeDelivery: boolean;
  homeDeliveryFee: number;
  deliveryRadius: number;
  maxDeliveryDistance: number;
  estimatedDeliveryTime: string;
  fuelPolicy: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  pickupMapsUrl: string;
  pickupContactPerson: string;
  pickupContactNumber: string;
  pickupTiming: string;
  additionalCharges?: AdditionalCharge[];
}

export interface AdditionalCharge {
  label: string;
  amount: number;
}

export interface Booking {
  id: string;
  carId: string;
  car: Car;
  userId: string;
  status: BookingStatusId;
  pickupDate: Date;
  pickupTime: string;
  returnDate: Date;
  returnTime: string;
  totalHours: number;
  rentalAmount: number;
  deliveryOption: "self_pickup" | "home_delivery";
  deliveryAddress?: DeliveryAddress;
  securityDeposit: number;
  platformFee: number;
  insuranceFee: number;
  cleaningCharges: number;
  fastagAdvance: number;
  homeDeliveryFee: number;
  additionalCharges: AdditionalCharge[];
  totalAmount: number;
  rentalPaymentUtr?: string;
  secondPaymentUtr?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  customerDetails: CustomerDetails;
  createdAt: Date;
  updatedAt: Date;
  bookingReference: string;
}

export interface DeliveryAddress {
  houseNumber: string;
  buildingName: string;
  street: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  mobileNumber: string;
  specialInstructions: string;
}

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  drivingLicenseNumber?: string;
  drivingLicenseExpiry?: string;
  drivingLicenseImage?: string;
  governmentIdType?: string;
  governmentIdNumber?: string;
  governmentIdImage?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export interface VerificationDocument {
  type: "driving_license" | "aadhaar" | "selfie";
  fileUrl: string;
  status: VerificationStatus;
  uploadedAt: string;
  rejectionReason?: string;
}

export type VerificationStatus = "not_uploaded" | "pending" | "verified" | "rejected";

export interface UserVerification {
  drivingLicense: VerificationDocument | null;
  aadhaar: VerificationDocument | null;
  selfie: VerificationDocument | null;
  overallStatus: VerificationStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  verification: UserVerification;
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

export interface UpiPaymentData {
  utrNumber: string;
  screenshotFile?: File;
  screenshotUrl?: string;
}
