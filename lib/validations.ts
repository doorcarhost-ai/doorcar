import { z } from "zod";

export const bookingFormSchema = z
  .object({
    pickupDate: z.string().min(1, "Pickup date is required"),
    pickupTime: z.string().min(1, "Pickup time is required"),
    returnDate: z.string().min(1, "Return date is required"),
    returnTime: z.string().min(1, "Return time is required"),
  })
  .refine(
    (data) => {
      const pickup = new Date(`${data.pickupDate}T${data.pickupTime}`);
      const returnD = new Date(`${data.returnDate}T${data.returnTime}`);
      return returnD > pickup;
    },
    { message: "Return time must be after pickup time", path: ["returnDate"] }
  )
  .refine(
    (data) => {
      const pickup = new Date(`${data.pickupDate}T${data.pickupTime}`);
      const returnD = new Date(`${data.returnDate}T${data.returnTime}`);
      const hours = (returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60);
      return hours >= 12;
    },
    {
      message: "Minimum booking duration is 12 hours",
      path: ["returnDate"],
    }
  );

export const customerDetailsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  drivingLicenseNumber: z
    .string()
    .min(6, "Enter valid license number")
    .max(20, "License number too long"),
  drivingLicenseExpiry: z
    .string()
    .min(1, "License expiry date is required")
    .refine(
      (val) => new Date(val) > new Date(),
      "Driving license must not be expired"
    ),
  governmentIdType: z.string().min(1, "Select ID type"),
  governmentIdNumber: z
    .string()
    .min(4, "Enter valid ID number")
    .max(20, "ID number too long"),
  emergencyContactName: z
    .string()
    .min(2, "Emergency contact name is required"),
  emergencyContactPhone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  emergencyContactRelation: z
    .string()
    .min(1, "Relation is required"),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const couponSchema = z.object({
  coupon: z
    .string()
    .min(4, "Enter a valid coupon code")
    .max(20, "Coupon code too long")
    .toUpperCase(),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
export type CustomerDetailsFormData = z.infer<typeof customerDetailsSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
