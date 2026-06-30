"use client";

import { useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  Car,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  MapPin,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { customerDetailsSchema, CustomerDetailsFormData } from "@/lib/validations";
import { MOCK_CARS } from "@/data/mock-data";
import {
  formatCurrency,
  formatDateTime,
  calculateBookingAmount,
  calculateGST,
} from "@/lib/utils";
import { BOOKING_MIN_HOURS, CONVENIENCE_FEE, GOVERNMENT_ID_TYPES, GST_RATE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Your Details", icon: User },
  { id: 2, label: "Documents", icon: FileCheck },
  { id: 3, label: "Review", icon: ShieldCheck },
];

interface BookingPageProps {
  params: Promise<{ carId: string }>;
}

export default function BookingPage({ params }: BookingPageProps) {
  const { carId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [licenseFile, setLicenseFile] = useState<string | null>(null);
  const [govIdFile, setGovIdFile] = useState<string | null>(null);

  const car = MOCK_CARS.find((c) => c.id === carId);

  const pickupDate = searchParams.get("pickupDate") || "";
  const pickupTime = searchParams.get("pickupTime") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const returnTime = searchParams.get("returnTime") || "";
  const hours = parseFloat(searchParams.get("hours") || "24");

  const { rentalAmount, extraCharges } = calculateBookingAmount(
    hours,
    car?.hourlyPrice || 0,
    BOOKING_MIN_HOURS,
    car?.extraHourCharge
  );
  const subtotal = rentalAmount + extraCharges;
  const gst = calculateGST(subtotal + CONVENIENCE_FEE, GST_RATE);
  const total = subtotal + CONVENIENCE_FEE + gst;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerDetailsFormData>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "9876543210",
    },
  });

  const termsAccepted = watch("termsAccepted");

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Car not found</p>
      </div>
    );
  }

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "license" | "govId"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "license") setLicenseFile(reader.result as string);
        else setGovIdFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: CustomerDetailsFormData) => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      const bookingParams = new URLSearchParams({
        carId,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        total: total.toString(),
        customerName: data.name,
      });
      router.push(`/payment?${bookingParams.toString()}`);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {step > 1 ? "Back" : "Back to Car"}
        </button>

        <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                      step > s.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : step === s.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      step === s.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 sm:w-16 rounded-full",
                      step > s.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-card border border-border rounded-2xl p-6 space-y-5"
                  >
                    <h2 className="text-lg font-semibold">Personal Details</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1.5">Full Name *</Label>
                        <Input
                          {...register("name")}
                          placeholder="As on driving license"
                          error={errors.name?.message}
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5">Email Address *</Label>
                        <Input
                          type="email"
                          {...register("email")}
                          placeholder="your@email.com"
                          error={errors.email?.message}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1.5">Phone Number *</Label>
                      <Input
                        type="tel"
                        {...register("phone")}
                        placeholder="10-digit mobile number"
                        error={errors.phone?.message}
                      />
                    </div>

                    <Separator />
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                      Emergency Contact
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-1.5">Contact Name *</Label>
                        <Input
                          {...register("emergencyContactName")}
                          placeholder="Full name"
                          error={errors.emergencyContactName?.message}
                        />
                      </div>
                      <div>
                        <Label className="mb-1.5">Contact Phone *</Label>
                        <Input
                          type="tel"
                          {...register("emergencyContactPhone")}
                          placeholder="10-digit number"
                          error={errors.emergencyContactPhone?.message}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-1.5">Relation *</Label>
                      <Input
                        {...register("emergencyContactRelation")}
                        placeholder="e.g. Spouse, Parent, Friend"
                        error={errors.emergencyContactRelation?.message}
                      />
                    </div>

                    <Button type="submit" variant="gradient" className="w-full gap-2">
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-card border border-border rounded-2xl p-6 space-y-5"
                  >
                    <h2 className="text-lg font-semibold">Upload Documents</h2>

                    {/* Driving License */}
                    <div>
                      <Label className="mb-1.5">Driving License Number *</Label>
                      <Input
                        {...register("drivingLicenseNumber")}
                        placeholder="e.g. KA0120230012345"
                        error={errors.drivingLicenseNumber?.message}
                      />
                    </div>

                    <div>
                      <Label className="mb-1.5">License Expiry Date *</Label>
                      <input
                        type="date"
                        {...register("drivingLicenseExpiry")}
                        min={new Date().toISOString().split("T")[0]}
                        className={cn(
                          "w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                          errors.drivingLicenseExpiry && "border-destructive"
                        )}
                      />
                      {errors.drivingLicenseExpiry && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.drivingLicenseExpiry.message}
                        </p>
                      )}
                    </div>

                    {/* License Upload */}
                    <div>
                      <Label className="mb-2">Upload License Photo</Label>
                      <label className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors">
                        {licenseFile ? (
                          <div className="relative h-24 w-full rounded-xl overflow-hidden">
                            <Image
                              src={licenseFile}
                              alt="License"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                              <Upload className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                Upload Driving License
                              </p>
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG or PDF up to 5MB
                              </p>
                            </div>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "license")}
                        />
                      </label>
                    </div>

                    <Separator />

                    {/* Government ID */}
                    <div>
                      <Label className="mb-1.5">Government ID Type *</Label>
                      <Select
                        onValueChange={(val) =>
                          setValue("governmentIdType", val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          {GOVERNMENT_ID_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.governmentIdType && (
                        <p className="text-xs text-destructive mt-1">
                          {errors.governmentIdType.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="mb-1.5">ID Number *</Label>
                      <Input
                        {...register("governmentIdNumber")}
                        placeholder="Enter ID number"
                        error={errors.governmentIdNumber?.message}
                      />
                    </div>

                    {/* Gov ID Upload */}
                    <div>
                      <Label className="mb-2">Upload ID Photo</Label>
                      <label className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-colors">
                        {govIdFile ? (
                          <div className="relative h-24 w-full rounded-xl overflow-hidden">
                            <Image
                              src={govIdFile}
                              alt="Gov ID"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                              <Upload className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                Upload Government ID
                              </p>
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG or PDF up to 5MB
                              </p>
                            </div>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "govId")}
                        />
                      </label>
                    </div>

                    <Button type="submit" variant="gradient" className="w-full gap-2">
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <h2 className="text-lg font-semibold mb-4">
                        Booking Summary
                      </h2>

                      <div className="flex gap-4 mb-5">
                        <div className="relative h-20 w-28 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={car.images[0]}
                            alt={car.name}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{car.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {car.location}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="success">Available</Badge>
                            <Badge variant="secondary" className="capitalize">
                              {car.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator className="mb-4" />

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">Pickup</p>
                            <p className="text-sm font-medium">
                              {formatDateTime(pickupDate, pickupTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">Return</p>
                            <p className="text-sm font-medium">
                              {formatDateTime(returnDate, returnTime)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Duration
                            </p>
                            <p className="text-sm font-medium">
                              {Math.round(hours)} hours
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Car className="h-4 w-4 text-primary mt-0.5" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Category
                            </p>
                            <p className="text-sm font-medium capitalize">
                              {car.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-card border border-border rounded-2xl p-5">
                      <h3 className="font-semibold mb-4">Terms & Conditions</h3>
                      <div className="max-h-40 overflow-y-auto text-sm text-muted-foreground space-y-2 mb-4 pr-2">
                        {car.rentalPolicy.map((policy, idx) => (
                          <p key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {policy}
                          </p>
                        ))}
                        <p>
                          By proceeding, you agree to RideHost&apos;s Terms of
                          Service and Privacy Policy. The security deposit of{" "}
                          {formatCurrency(car.securityDeposit)} will be collected
                          at pickup and refunded within 3-5 business days after
                          trip completion.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="terms"
                          checked={termsAccepted}
                          onCheckedChange={(checked) =>
                            setValue("termsAccepted", !!checked)
                          }
                        />
                        <Label htmlFor="terms" className="text-sm cursor-pointer">
                          I have read and agree to the rental terms, cancellation
                          policy and privacy policy.
                        </Label>
                      </div>
                      {errors.termsAccepted && (
                        <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {errors.termsAccepted.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="gradient"
                      size="xl"
                      className="w-full gap-2"
                      disabled={!termsAccepted}
                    >
                      Proceed to Payment
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-semibold mb-4">Price Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Rental ({Math.max(Math.round(hours), BOOKING_MIN_HOURS)}hr)
                  </span>
                  <span>{formatCurrency(rentalAmount)}</span>
                </div>
                {extraCharges > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extra hours</span>
                    <span>{formatCurrency(extraCharges)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Convenience fee</span>
                  <span>{formatCurrency(CONVENIENCE_FEE)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    GST ({GST_RATE}%)
                  </span>
                  <span>{formatCurrency(gst)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    Security deposit of{" "}
                    {formatCurrency(car.securityDeposit)} is collected
                    separately and refunded after trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}
