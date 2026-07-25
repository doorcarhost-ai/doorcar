"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Car, ExternalLink, Home, MapPin, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CarAdminConfig, DeliveryAddress } from "@/types";
import { formatCurrency } from "@/lib/utils";

const deliverySchema = z.object({
  houseNumber: z.string().min(1, "Required"),
  buildingName: z.string(),
  street: z.string().min(2, "Required"),
  area: z.string().min(2, "Required"),
  landmark: z.string(),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter valid 6-digit PIN"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Enter valid mobile number"),
  specialInstructions: z.string(),
});

type DeliveryFormData = {
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
};

interface DeliveryOptionProps {
  config: CarAdminConfig;
  onSelect: (option: "self_pickup" | "home_delivery", address?: DeliveryAddress) => void;
}

export function DeliveryOption({ config, onSelect }: DeliveryOptionProps) {
  const [selected, setSelected] = useState<"self_pickup" | "home_delivery" | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema) as any,
    defaultValues: { buildingName: "", landmark: "", specialInstructions: "" },
  });

  const onDeliverySubmit = (data: DeliveryFormData) => {
    onSelect("home_delivery", {
      houseNumber: data.houseNumber,
      buildingName: data.buildingName || "",
      street: data.street,
      area: data.area,
      landmark: data.landmark || "",
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      mobileNumber: data.mobileNumber,
      specialInstructions: data.specialInstructions || "",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Choose Delivery Option</h2>

      <div className="grid grid-cols-1 gap-3">
        {/* Self Pickup */}
        <button
          type="button"
          onClick={() => setSelected("self_pickup")}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
            selected === "self_pickup"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
            selected === "self_pickup" ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}>
            <Car className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold">Self Pickup</p>
              <span className="text-sm font-semibold text-green-600">FREE</span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Collect vehicle from our pickup point</p>
          </div>
        </button>

        {/* Home Delivery */}
        {config.enableHomeDelivery && (
          <button
            type="button"
            onClick={() => setSelected("home_delivery")}
            className={`flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
              selected === "home_delivery"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${
              selected === "home_delivery" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}>
              <Home className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Home Delivery</p>
                <span className="text-sm font-semibold text-primary">
                  {config.homeDeliveryFee > 0 ? `+${formatCurrency(config.homeDeliveryFee)}` : "FREE"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Delivered to your address within {config.estimatedDeliveryTime}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Available within {config.deliveryRadius} km radius
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Self Pickup Details */}
      <AnimatePresence>
        {selected === "self_pickup" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold">Pickup Details</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pickup Address</p>
                    <p className="text-sm font-medium">{config.pickupAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Person</p>
                    <p className="text-sm font-medium">{config.pickupContactPerson}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact Number</p>
                    <p className="text-sm font-medium">{config.pickupContactNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Car className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pickup Timing</p>
                    <p className="text-sm font-medium">{config.pickupTiming}</p>
                  </div>
                </div>
              </div>

              {config.pickupMapsUrl && (
                <a
                  href={config.pickupMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on Google Maps
                </a>
              )}

              <Button variant="gradient" className="w-full" onClick={() => onSelect("self_pickup")}>
                Confirm Self Pickup
              </Button>
            </div>
          </motion.div>
        )}

        {selected === "home_delivery" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-4">Delivery Address</h3>
              <form onSubmit={handleSubmit(onDeliverySubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1.5">House / Flat No. *</Label>
                    <Input {...register("houseNumber")} placeholder="e.g. 42B" />
                    {errors.houseNumber && <p className="text-xs text-destructive mt-1">{errors.houseNumber.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5">Building Name</Label>
                    <Input {...register("buildingName")} placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-1.5">Street *</Label>
                  <Input {...register("street")} placeholder="Street name" />
                  {errors.street && <p className="text-xs text-destructive mt-1">{errors.street.message}</p>}
                </div>
                <div>
                  <Label className="text-xs mb-1.5">Area / Locality *</Label>
                  <Input {...register("area")} placeholder="Area name" />
                  {errors.area && <p className="text-xs text-destructive mt-1">{errors.area.message}</p>}
                </div>
                <div>
                  <Label className="text-xs mb-1.5">Landmark</Label>
                  <Input {...register("landmark")} placeholder="Near any landmark" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1.5">City *</Label>
                    <Input {...register("city")} placeholder="City" />
                    {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5">State *</Label>
                    <Input {...register("state")} placeholder="State" />
                    {errors.state && <p className="text-xs text-destructive mt-1">{errors.state.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1.5">PIN Code *</Label>
                    <Input {...register("pincode")} placeholder="6-digit PIN" maxLength={6} />
                    {errors.pincode && <p className="text-xs text-destructive mt-1">{errors.pincode.message}</p>}
                  </div>
                  <div>
                    <Label className="text-xs mb-1.5">Mobile Number *</Label>
                    <Input type="tel" {...register("mobileNumber")} placeholder="10-digit" maxLength={10} />
                    {errors.mobileNumber && <p className="text-xs text-destructive mt-1">{errors.mobileNumber.message}</p>}
                  </div>
                </div>
                <div>
                  <Label className="text-xs mb-1.5">Special Instructions</Label>
                  <Input {...register("specialInstructions")} placeholder="Any delivery instructions" />
                </div>
                <Button type="submit" variant="gradient" className="w-full">
                  Confirm Home Delivery
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
