"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Car,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Edit,
  Home,
  MapPin,
  Plus,
  Save,
  Settings,
  Shield,
  Timer,
  Users,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS, MOCK_BOOKINGS, MOCK_USER } from "@/data/mock-data";
import { CarAdminConfig } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BOOKING_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

function ConfigField({
  label,
  value,
  onChange,
  type = "number",
  suffix,
  prefix,
  hint,
}: {
  label: string;
  value: number | string;
  onChange: (v: string) => void;
  type?: string;
  suffix?: string;
  prefix?: string;
  hint?: string;
}) {
  return (
    <div>
      <Label className="text-xs mb-1.5">{label}</Label>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-muted-foreground px-2">{prefix}</span>}
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 text-sm"
        />
        {suffix && <span className="text-sm text-muted-foreground px-2 shrink-0">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function CarConfigCard({ car, initialConfig }: { car: (typeof MOCK_CARS)[0]; initialConfig: CarAdminConfig }) {
  const [expanded, setExpanded] = useState(false);
  const [config, setConfig] = useState(initialConfig);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof CarAdminConfig, value: string | boolean | number) => {
    setConfig((prev) => ({
      ...prev,
      [key]: typeof value === "string" && key !== "fuelPolicy" && key !== "pickupAddress" && key !== "pickupMapsUrl" && key !== "pickupContactPerson" && key !== "pickupContactNumber" && key !== "pickupTiming" && key !== "estimatedDeliveryTime"
        ? parseFloat(value) || 0
        : value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="relative h-14 w-20 rounded-xl overflow-hidden shrink-0">
          <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{car.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{formatCurrency(config.hourlyPrice)}/hr</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">Min {config.minimumHours}hr</span>
            {config.enableHomeDelivery && (
              <Badge variant="info" className="text-xs">Delivery</Badge>
            )}
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </div>

      {expanded && (
        <div className="border-t border-border p-5 space-y-6">
          {/* Pricing */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pricing</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ConfigField label="Hourly Price" value={config.hourlyPrice} onChange={(v) => update("hourlyPrice", v)} prefix="₹" suffix="/hr" />
              <ConfigField label="Minimum Hours" value={config.minimumHours} onChange={(v) => update("minimumHours", v)} suffix="hrs" />
              <ConfigField label="Extra Hour Charge" value={config.extraHourCharge} onChange={(v) => update("extraHourCharge", v)} prefix="₹" suffix="/hr" />
              <ConfigField label="Included KM" value={config.includedKm} onChange={(v) => update("includedKm", v)} suffix="km" />
              <ConfigField label="Extra KM Charge" value={config.extraKmCharge} onChange={(v) => update("extraKmCharge", v)} prefix="₹" suffix="/km" />
            </div>
          </div>

          <Separator />

          {/* Charges */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Charges</h4>
            <p className="text-xs text-muted-foreground mb-3">Set to 0 to hide the charge</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <ConfigField label="Security Deposit" value={config.securityDeposit} onChange={(v) => update("securityDeposit", v)} prefix="₹" hint="Refundable" />
              <ConfigField label="Platform Fee" value={config.platformFee} onChange={(v) => update("platformFee", v)} prefix="₹" />
              <ConfigField label="Insurance Fee" value={config.insuranceFee} onChange={(v) => update("insuranceFee", v)} prefix="₹" />
              <ConfigField label="Cleaning Charges" value={config.cleaningCharges} onChange={(v) => update("cleaningCharges", v)} prefix="₹" />
              <ConfigField label="FASTag Advance" value={config.fastagAdvance} onChange={(v) => update("fastagAdvance", v)} prefix="₹" />
            </div>
          </div>

          <Separator />

          {/* Home Delivery */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Home Delivery</h4>
              <Switch
                checked={config.enableHomeDelivery}
                onCheckedChange={(v) => update("enableHomeDelivery", v)}
              />
            </div>
            {config.enableHomeDelivery && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ConfigField label="Delivery Fee" value={config.homeDeliveryFee} onChange={(v) => update("homeDeliveryFee", v)} prefix="₹" hint="Set 0 for free delivery" />
                <ConfigField label="Delivery Radius" value={config.deliveryRadius} onChange={(v) => update("deliveryRadius", v)} suffix="km" />
                <ConfigField label="Max Distance" value={config.maxDeliveryDistance} onChange={(v) => update("maxDeliveryDistance", v)} suffix="km" />
                <ConfigField label="Est. Delivery Time" value={config.estimatedDeliveryTime} onChange={(v) => update("estimatedDeliveryTime", v)} type="text" />
              </div>
            )}
          </div>

          <Separator />

          {/* Pickup Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pickup Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ConfigField label="Pickup Address" value={config.pickupAddress} onChange={(v) => update("pickupAddress", v)} type="text" />
              <ConfigField label="Google Maps URL" value={config.pickupMapsUrl} onChange={(v) => update("pickupMapsUrl", v)} type="text" />
              <ConfigField label="Contact Person" value={config.pickupContactPerson} onChange={(v) => update("pickupContactPerson", v)} type="text" />
              <ConfigField label="Contact Number" value={config.pickupContactNumber} onChange={(v) => update("pickupContactNumber", v)} type="text" />
              <ConfigField label="Pickup Timing" value={config.pickupTiming} onChange={(v) => update("pickupTiming", v)} type="text" />
              <ConfigField label="Fuel Policy" value={config.fuelPolicy} onChange={(v) => update("fuelPolicy", v)} type="text" />
            </div>
          </div>

          <Button
            variant={saved ? "default" : "gradient"}
            className="w-full gap-2"
            onClick={handleSave}
          >
            {saved ? (
              <><CheckCircle className="h-4 w-4" />Configuration Saved!</>
            ) : (
              <><Save className="h-4 w-4" />Save Configuration</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [verificationFilter, setVerificationFilter] = useState<"all" | "pending" | "verified">("all");

  const pendingBookings = MOCK_BOOKINGS.filter((b) =>
    b.status === "rental_payment_submitted" || b.status === "additional_charges_submitted"
  );

  const stats = [
    { label: "Total Cars", value: MOCK_CARS.length, icon: Car, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
    { label: "Active Bookings", value: 3, icon: Timer, color: "text-[#FF7A00] bg-[#FFF8F3] dark:bg-[#FFF8F3]/30" },
    { label: "Pending Approval", value: pendingBookings.length + 2, icon: Shield, color: "text-orange-600 bg-orange-50 dark:bg-orange-950/30" },
    { label: "Total Users", value: 1241, icon: Users, color: "text-green-600 bg-green-50 dark:bg-green-950/30" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-secondary text-secondary-foreground border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FF9A3C] flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">RideHost Admin</h1>
              <p className="text-xs text-white/50">Management Console</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Home className="h-4 w-4 mr-1.5" />Back to App
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Booking Approvals</TabsTrigger>
            <TabsTrigger value="cars">Car Configuration</TabsTrigger>
            <TabsTrigger value="verification">User Verification</TabsTrigger>
          </TabsList>

          {/* Booking Approvals */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {/* Mock pending payment */}
              {[
                {
                  ref: "RH3DQCR4J",
                  car: MOCK_CARS[0],
                  user: "Rahul Kumar",
                  amount: 1020,
                  type: "Rental Payment",
                  utr: "UTR987654321",
                  time: "10 mins ago",
                  status: "rental_payment_submitted",
                },
                {
                  ref: "RH4ERCS5K",
                  car: MOCK_CARS[2],
                  user: "Priya Shah",
                  amount: 16198,
                  type: "Additional Charges",
                  utr: "UTR123456789",
                  time: "25 mins ago",
                  status: "additional_charges_submitted",
                },
              ].map((booking) => (
                <div key={booking.ref} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-20 rounded-xl overflow-hidden">
                        <Image src={booking.car.images[0]} alt={booking.car.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div>
                        <p className="font-semibold">{booking.car.name}</p>
                        <p className="text-sm text-muted-foreground">{booking.user} · {booking.ref}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{booking.time}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-primary">{formatCurrency(booking.amount)}</p>
                      <Badge variant="warning" className="text-xs mt-1">{booking.type}</Badge>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">UTR Number</p>
                      <p className="font-mono font-semibold text-sm">{booking.utr}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="gradient" size="sm" className="flex-1 gap-1.5">
                      <CheckCircle className="h-4 w-4" />Approve
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-destructive hover:bg-destructive/10">
                      <XCircle className="h-4 w-4" />Reject
                    </Button>
                  </div>
                </div>
              ))}

              {MOCK_BOOKINGS.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">No pending approvals</div>
              )}
            </div>
          </TabsContent>

          {/* Car Configuration */}
          <TabsContent value="cars">
            <div className="space-y-3">
              {MOCK_CARS.map((car) => {
                const config = MOCK_CAR_ADMIN_CONFIGS.find((c) => c.carId === car.id)!;
                return <CarConfigCard key={car.id} car={car} initialConfig={config} />;
              })}
            </div>
          </TabsContent>

          {/* User Verification */}
          <TabsContent value="verification">
            <div className="mb-4 flex gap-2">
              {(["all", "pending", "verified"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setVerificationFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-sm font-medium border transition-colors capitalize",
                    verificationFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {/* Mock verification requests */}
              {[
                { name: "Alex Johnson", email: "alex@example.com", docs: ["Driving Licence", "Aadhaar", "Selfie"], status: "pending", time: "2 hours ago", avatar: MOCK_USER.avatar },
                { name: "Priya Sharma", email: "priya@example.com", docs: ["Driving Licence", "Aadhaar", "Selfie"], status: "pending", time: "5 hours ago", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80" },
                { name: "Rahul Verma", email: "rahul@example.com", docs: ["Driving Licence", "Aadhaar", "Selfie"], status: "verified", time: "1 day ago", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" },
              ]
                .filter((u) => verificationFilter === "all" || u.status === verificationFilter)
                .map((user, idx) => (
                  <div key={idx} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.status === "verified" ? "success" : "warning"} className="capitalize">
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap mb-4">
                      {user.docs.map((doc) => (
                        <span key={doc} className="text-xs px-2.5 py-1 rounded-lg bg-muted flex items-center gap-1">
                          <BadgeCheck className="h-3.5 w-3.5 text-primary" />{doc}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">Submitted: {user.time}</p>
                    {user.status === "pending" && (
                      <div className="flex gap-3">
                        <Button size="sm" variant="gradient" className="flex-1 gap-1.5">
                          <CheckCircle className="h-4 w-4" />Verify
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 gap-1.5 text-destructive hover:bg-destructive/10">
                          <XCircle className="h-4 w-4" />Reject
                        </Button>
                      </div>
                    )}
                    {user.status === "verified" && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />Verified and approved
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
