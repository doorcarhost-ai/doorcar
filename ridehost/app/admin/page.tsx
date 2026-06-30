"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck, Car, CheckCircle, ChevronDown, ChevronUp,
  ExternalLink, FileText, Home, RefreshCw, Save, Settings,
  Shield, Timer, Users, XCircle, AlertTriangle, Eye, Zap,
  RotateCcw, Plus, FlaskConical,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MOCK_CARS, MOCK_CAR_ADMIN_CONFIGS, MOCK_USER } from "@/data/mock-data";
import { CarAdminConfig } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_CAR_ADMIN_CONFIG } from "@/lib/constants";
import { useVerificationStore, useBookingStore, useNotificationStore, VerificationRequest } from "@/lib/store";
import { cn } from "@/lib/utils";

// ── Reject Reason Dialog ────────────────────────────────────────
function RejectDialog({
  open,
  onClose,
  onConfirm,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
}) {
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#111827]">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Label className="text-sm">Rejection Reason *</Label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for rejection..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-[#E5E7EB] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/20 focus:border-[#FF7A00]"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={!reason.trim()}
            onClick={() => { onConfirm(reason.trim()); setReason(""); onClose(); }}
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Document Viewer Dialog ──────────────────────────────────────
function DocViewer({
  open, onClose, request,
}: {
  open: boolean;
  onClose: () => void;
  request: VerificationRequest | null;
}) {
  if (!request) return null;
  const docs = [
    { label: "Driving Licence", url: request.drivingLicenseUrl },
    { label: "Aadhaar Card", url: request.aadhaarUrl },
    { label: "Selfie", url: request.selfieUrl },
  ].filter((d) => d.url);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Documents — {request.userName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          {docs.map((doc) => (
            <div key={doc.label}>
              <p className="text-xs font-semibold text-[#6B7280] mb-2">{doc.label}</p>
              <div className="relative h-48 bg-gray-100 rounded-2xl overflow-hidden border border-[#E5E7EB]">
                <Image src={doc.url!} alt={doc.label} fill className="object-cover" sizes="500px" />
              </div>
            </div>
          ))}
          {docs.length === 0 && <p className="text-sm text-[#6B7280]">No documents uploaded yet.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Car Config Card ─────────────────────────────────────────────
function CarConfigCard({ car, initialConfig }: { car: (typeof MOCK_CARS)[0]; initialConfig: CarAdminConfig }) {
  const [expanded, setExpanded] = useState(false);
  const [config, setConfig] = useState(initialConfig);
  const [saved, setSaved] = useState(false);
  const { addNotification } = useNotificationStore();

  const update = (key: keyof CarAdminConfig, value: string | boolean | number) => {
    const strFields = new Set(["fuelPolicy", "pickupAddress", "pickupMapsUrl", "pickupContactPerson", "pickupContactNumber", "pickupTiming", "estimatedDeliveryTime"]);
    setConfig((prev) => ({ ...prev, [key]: typeof value === "string" && !strFields.has(key) ? parseFloat(value) || 0 : value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    addNotification({ type: "success", title: "Configuration Saved", message: `${car.name} settings updated.` });
    setTimeout(() => setSaved(false), 2500);
  };

  const Field = ({ label, field, suffix, prefix, hint, type = "number" }: { label: string; field: keyof CarAdminConfig; suffix?: string; prefix?: string; hint?: string; type?: string }) => (
    <div>
      <Label className="text-xs font-semibold text-[#6B7280] mb-1">{label}</Label>
      <div className="flex items-center gap-1">
        {prefix && <span className="text-sm text-[#6B7280] shrink-0">{prefix}</span>}
        <Input type={type} value={config[field] as string | number} onChange={(e) => update(field, e.target.value)} className="h-9 text-sm" />
        {suffix && <span className="text-xs text-[#6B7280] shrink-0">{suffix}</span>}
      </div>
      {hint && <p className="text-xs text-[#9CA3AF] mt-0.5">{hint}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-premium">
      <div className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="relative h-14 w-20 rounded-xl overflow-hidden shrink-0">
          <Image src={car.images[0]} alt={car.name} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#111827] truncate">{car.name}</p>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs text-[#6B7280]">{formatCurrency(config.hourlyPrice)}/hr</span>
            <span className="text-xs text-[#6B7280]">·</span>
            <span className="text-xs text-[#6B7280]">Min {config.minimumHours}hr</span>
            {config.enableHomeDelivery && <Badge variant="info" className="text-[10px] py-0">Delivery</Badge>}
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-[#6B7280] shrink-0" /> : <ChevronDown className="h-4 w-4 text-[#6B7280] shrink-0" />}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="border-t border-[#E5E7EB] p-5 space-y-5">
              <div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Pricing</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Field label="Hourly Price" field="hourlyPrice" prefix="₹" suffix="/hr" />
                  <Field label="Minimum Hours" field="minimumHours" suffix="hrs" />
                  <Field label="Extra Hour Rate" field="extraHourCharge" prefix="₹" suffix="/hr" />
                  <Field label="Included KM" field="includedKm" suffix="km" />
                  <Field label="Extra KM Charge" field="extraKmCharge" prefix="₹" suffix="/km" />
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Charges</p>
                <p className="text-xs text-[#9CA3AF] mb-3">Set to 0 to hide a charge in the booking flow</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Field label="Security Deposit" field="securityDeposit" prefix="₹" hint="Refundable" />
                  <Field label="Platform Fee" field="platformFee" prefix="₹" />
                  <Field label="Insurance Fee" field="insuranceFee" prefix="₹" />
                  <Field label="Cleaning Charges" field="cleaningCharges" prefix="₹" />
                  <Field label="FASTag Advance" field="fastagAdvance" prefix="₹" />
                </div>
              </div>
              <Separator />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Home Delivery</p>
                  <Switch checked={config.enableHomeDelivery} onCheckedChange={(v) => update("enableHomeDelivery", v)} />
                </div>
                {config.enableHomeDelivery && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="Delivery Fee" field="homeDeliveryFee" prefix="₹" hint="0 = free delivery" />
                    <Field label="Delivery Radius" field="deliveryRadius" suffix="km" />
                    <Field label="Max Distance" field="maxDeliveryDistance" suffix="km" />
                    <Field label="Est. Time" field="estimatedDeliveryTime" type="text" />
                  </div>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Pickup Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Pickup Address" field="pickupAddress" type="text" />
                  <Field label="Google Maps URL" field="pickupMapsUrl" type="text" />
                  <Field label="Contact Person" field="pickupContactPerson" type="text" />
                  <Field label="Contact Number" field="pickupContactNumber" type="text" />
                  <Field label="Pickup Timing" field="pickupTiming" type="text" />
                  <Field label="Fuel Policy" field="fuelPolicy" type="text" />
                </div>
              </div>
              <Button variant={saved ? "default" : "gradient"} className="w-full gap-2" onClick={handleSave}>
                {saved ? <><CheckCircle className="h-4 w-4" />Saved!</> : <><Save className="h-4 w-4" />Save Configuration</>}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Admin Page ─────────────────────────────────────────────
export default function AdminPage() {
  const { requests, approveVerification, rejectVerification } = useVerificationStore();
  const { bookings, approveRentalPayment, rejectRentalPayment, approveSecondPayment, rejectSecondPayment, createBooking, submitRentalPayment } = useBookingStore();
  const { addNotification } = useNotificationStore();

  const [rejectDialog, setRejectDialog] = useState<{ open: boolean; type: "verification" | "rental" | "second"; id: string }>({ open: false, type: "verification", id: "" });
  const [docViewerId, setDocViewerId] = useState<string | null>(null);
  const [verifyFilter, setVerifyFilter] = useState<"all" | "pending" | "verified" | "rejected">("all");

  const viewRequest = docViewerId ? requests.find((r) => r.userId === docViewerId) ?? null : null;
  const pendingVerifications = requests.filter((r) => r.status === "pending");
  const rentalPaymentRequests = bookings.filter((b) => b.status === "rental_payment_submitted");
  const secondPaymentRequests = bookings.filter((b) => b.status === "additional_charges_submitted");
  const totalPending = pendingVerifications.length + rentalPaymentRequests.length + secondPaymentRequests.length;

  const stats = [
    { label: "Total Cars", value: MOCK_CARS.length, icon: Car, color: "bg-blue-50 text-blue-600" },
    { label: "Active Bookings", value: bookings.filter(b => ["trip_started", "booking_confirmed", "vehicle_ready"].includes(b.status)).length, icon: Timer, color: "bg-[#FFF8F3] text-[#FF7A00]" },
    { label: "Pending Approval", value: totalPending, icon: Shield, color: "bg-amber-50 text-amber-600" },
    { label: "Verifications", value: requests.length, icon: Users, color: "bg-green-50 text-green-600" },
  ];

  function handleRejectConfirm(reason: string) {
    const { type, id } = rejectDialog;
    if (type === "verification") {
      rejectVerification(id, reason);
      addNotification({ type: "info", title: "Verification Rejected", message: `Customer notified with reason: "${reason}"` });
    } else if (type === "rental") {
      rejectRentalPayment(id, reason);
      addNotification({ type: "info", title: "Rental Payment Rejected", message: `Booking ${id.slice(0, 8)} rejected. Customer can re-submit.` });
    } else {
      rejectSecondPayment(id, reason);
      addNotification({ type: "info", title: "Second Payment Rejected", message: `Booking ${id.slice(0, 8)} second payment rejected.` });
    }
  }

  // ── Test Mode: demo data generators ───────────────────────────
  const isDev = process.env.NODE_ENV === "development";

  function generateDemoVerification() {
    const { submitVerification } = useVerificationStore.getState();
    submitVerification({
      userId: "user_1",
      userName: MOCK_USER.name,
      userEmail: MOCK_USER.email,
      userPhone: MOCK_USER.phone,
      userAvatar: MOCK_USER.avatar,
      drivingLicenseUrl: MOCK_USER.avatar,
      aadhaarUrl: MOCK_USER.avatar,
      selfieUrl: MOCK_USER.avatar,
    });
    addNotification({ type: "success", title: "Demo Verification Created", message: "Check Verification tab." });
  }

  function approveAllDocs() {
    const { requests, approveVerification } = useVerificationStore.getState();
    requests.filter(r => r.status === "pending").forEach(r => approveVerification(r.userId));
    addNotification({ type: "success", title: "All Documents Approved", message: "All pending verifications approved." });
  }

  function generateDemoBooking() {
    const car = MOCK_CARS[0];
    const id = createBooking({
      userId: "user_1",
      userName: MOCK_USER.name,
      userPhone: MOCK_USER.phone,
      carId: car.id,
      carName: car.name,
      carImage: car.images[0],
      pickupDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      pickupTime: "10:00",
      returnDate: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0],
      returnTime: "10:00",
      hours: 24,
      rentalAmount: car.hourlyPrice * 24,
      secondPaymentAmount: 5000 + 199 + 299,
      deliveryOption: null,
    });
    submitRentalPayment(id, `UTR${Date.now()}`, MOCK_USER.avatar);
    addNotification({ type: "success", title: "Demo Booking Created", message: "Check Rental Payment tab." });
  }

  function approveAllPayments() {
    const { bookings } = useBookingStore.getState();
    bookings.filter(b => b.status === "rental_payment_submitted").forEach(b => approveRentalPayment(b.id));
    bookings.filter(b => b.status === "additional_charges_submitted").forEach(b => approveSecondPayment(b.id));
    addNotification({ type: "success", title: "All Payments Approved", message: "All pending payments approved." });
  }

  function resetAll() {
    useBookingStore.setState({ bookings: [] });
    useVerificationStore.setState({ requests: [], userVerificationStatus: "not_uploaded" });
    addNotification({ type: "info", title: "Data Reset", message: "All bookings and verifications cleared." });
  }

  const filteredVerifications = requests.filter((r) => verifyFilter === "all" || r.status === verifyFilter);

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      {/* Admin Header */}
      <header className="bg-[#111827] text-white border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#FF7A00] flex items-center justify-center shadow-orange">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">RideHost Admin</h1>
              <p className="text-xs text-white/50">Management Console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {totalPending > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF7A00]/20 text-[#FF7A00] text-sm font-semibold">
                <AlertTriangle className="h-3.5 w-3.5" />{totalPending} pending
              </div>
            )}
            <Link href="/">
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Home className="h-4 w-4 mr-1.5" />App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-premium"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-[#111827]">{s.value}</p>
                <p className="text-sm text-[#6B7280]">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        <Tabs defaultValue="verification">
          <TabsList className="mb-6 bg-white border border-[#E5E7EB] p-1 rounded-2xl">
            <TabsTrigger value="verification" className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
              Verification {pendingVerifications.length > 0 && <span className="ml-1.5 h-5 w-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">{pendingVerifications.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="rental" className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
              Rental Payment {rentalPaymentRequests.length > 0 && <span className="ml-1.5 h-5 w-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">{rentalPaymentRequests.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="second" className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">
              Second Payment {secondPaymentRequests.length > 0 && <span className="ml-1.5 h-5 w-5 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">{secondPaymentRequests.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="cars" className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">Car Config</TabsTrigger>
            {isDev && <TabsTrigger value="testmode" className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white">🧪 Test Mode</TabsTrigger>}
          </TabsList>

          {/* ── VERIFICATION TAB ── */}
          <TabsContent value="verification">
            <div className="flex gap-2 mb-4 flex-wrap">
              {(["all", "pending", "verified", "rejected"] as const).map((f) => (
                <button key={f} onClick={() => setVerifyFilter(f)}
                  className={cn("px-4 py-1.5 rounded-xl text-sm font-semibold border capitalize transition-all",
                    verifyFilter === f ? "bg-[#FF7A00] text-white border-[#FF7A00]" : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#FF7A00]/40"
                  )}
                >
                  {f} {f !== "all" && `(${requests.filter(r => r.status === f).length})`}
                </button>
              ))}
            </div>

            {filteredVerifications.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-12 text-center shadow-premium">
                <Shield className="h-12 w-12 text-[#E5E7EB] mx-auto mb-4" />
                <p className="text-[#111827] font-semibold">No verification requests</p>
                <p className="text-sm text-[#6B7280] mt-1">Customer verification requests will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVerifications.map((req) => (
                  <div key={req.userId} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-premium">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0">
                        <Image src={req.userAvatar} alt={req.userName} fill className="object-cover" sizes="48px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-[#111827]">{req.userName}</p>
                          {req.status === "pending" && <Badge variant="warning" className="text-xs">Pending Review</Badge>}
                          {req.status === "verified" && <Badge variant="success" className="text-xs flex items-center gap-1"><BadgeCheck className="h-3 w-3" />Verified</Badge>}
                          {req.status === "rejected" && <Badge variant="destructive" className="text-xs">Rejected</Badge>}
                        </div>
                        <p className="text-sm text-[#6B7280]">{req.userEmail} · {req.userPhone}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">Submitted: {new Date(req.submittedAt).toLocaleString("en-IN")}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        { label: "Driving Licence", url: req.drivingLicenseUrl },
                        { label: "Aadhaar", url: req.aadhaarUrl },
                        { label: "Selfie", url: req.selfieUrl },
                      ].map((doc) => (
                        <span key={doc.label} className={cn("flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border font-medium",
                          doc.url ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-[#E5E7EB] text-[#9CA3AF]"
                        )}>
                          {doc.url ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {doc.label}
                        </span>
                      ))}
                    </div>

                    {req.rejectionReason && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-red-700"><span className="font-semibold">Rejection reason:</span> {req.rejectionReason}</p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => setDocViewerId(req.userId)}>
                        <Eye className="h-3.5 w-3.5" />View Docs
                      </Button>
                      {req.status === "pending" && (
                        <>
                          <Button size="sm" variant="gradient" className="gap-1.5"
                            onClick={() => {
                              approveVerification(req.userId);
                              addNotification({ type: "success", title: "Verification Approved", message: `${req.userName} is now verified and can book cars.` });
                            }}>
                            <CheckCircle className="h-3.5 w-3.5" />Approve
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => setRejectDialog({ open: true, type: "verification", id: req.userId })}>
                            <XCircle className="h-3.5 w-3.5" />Reject
                          </Button>
                        </>
                      )}
                      {req.status === "verified" && (
                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                          <BadgeCheck className="h-3.5 w-3.5" />Approved{req.reviewedAt && ` · ${new Date(req.reviewedAt).toLocaleDateString("en-IN")}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── RENTAL PAYMENT TAB ── */}
          <TabsContent value="rental">
            {rentalPaymentRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-12 text-center shadow-premium">
                <FileText className="h-12 w-12 text-[#E5E7EB] mx-auto mb-4" />
                <p className="text-[#111827] font-semibold">No rental payment requests</p>
                <p className="text-sm text-[#6B7280] mt-1">Customer rental payments will appear here for approval.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rentalPaymentRequests.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-premium">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative h-16 w-24 rounded-xl overflow-hidden shrink-0">
                        <Image src={b.carImage} alt={b.carName} fill className="object-cover" sizes="96px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-[#111827]">{b.carName}</p>
                            <p className="text-sm text-[#6B7280]">{b.userName} · {b.userPhone}</p>
                            <p className="text-xs text-[#9CA3AF] mt-0.5 font-mono">{b.bookingRef}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold text-[#FF7A00]">{formatCurrency(b.rentalAmount)}</p>
                            <Badge variant="warning" className="text-xs mt-1">Rental Payment</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                      <div className="bg-[#F8F9FB] rounded-xl p-3">
                        <p className="text-xs text-[#6B7280]">Pickup</p>
                        <p className="text-sm font-semibold text-[#111827]">{b.pickupDate} {b.pickupTime}</p>
                      </div>
                      <div className="bg-[#F8F9FB] rounded-xl p-3">
                        <p className="text-xs text-[#6B7280]">Return</p>
                        <p className="text-sm font-semibold text-[#111827]">{b.returnDate} {b.returnTime}</p>
                      </div>
                      <div className="bg-[#F8F9FB] rounded-xl p-3">
                        <p className="text-xs text-[#6B7280]">Duration</p>
                        <p className="text-sm font-semibold text-[#111827]">{b.hours}hrs</p>
                      </div>
                    </div>

                    <div className="bg-[#F8F9FB] rounded-xl p-3 mb-4">
                      <p className="text-xs text-[#6B7280] mb-1">UTR Number</p>
                      <p className="font-mono font-bold text-[#111827]">{b.rentalPaymentUtr}</p>
                    </div>

                    {b.rentalPaymentScreenshot && (
                      <div className="relative h-32 rounded-xl overflow-hidden mb-4 bg-gray-100 border border-[#E5E7EB]">
                        <Image src={b.rentalPaymentScreenshot} alt="Payment screenshot" fill className="object-cover" sizes="400px" />
                        <div className="absolute inset-0 flex items-end p-2">
                          <span className="text-xs bg-black/60 text-white px-2 py-1 rounded-lg">Payment Screenshot</span>
                        </div>
                      </div>
                    )}

                    {b.rentalPaymentSubmittedAt && (
                      <p className="text-xs text-[#9CA3AF] mb-3">Submitted: {new Date(b.rentalPaymentSubmittedAt).toLocaleString("en-IN")}</p>
                    )}

                    <div className="flex gap-3">
                      <Button variant="gradient" className="flex-1 gap-1.5"
                        onClick={() => {
                          approveRentalPayment(b.id);
                          addNotification({ type: "success", title: "Rental Payment Approved", message: `Booking ${b.bookingRef} approved. Customer can complete booking.` });
                        }}>
                        <CheckCircle className="h-4 w-4" />Approve Payment
                      </Button>
                      <Button variant="outline" className="flex-1 gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setRejectDialog({ open: true, type: "rental", id: b.id })}>
                        <XCircle className="h-4 w-4" />Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── SECOND PAYMENT TAB ── */}
          <TabsContent value="second">
            {secondPaymentRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-12 text-center shadow-premium">
                <FileText className="h-12 w-12 text-[#E5E7EB] mx-auto mb-4" />
                <p className="text-[#111827] font-semibold">No second payment requests</p>
                <p className="text-sm text-[#6B7280] mt-1">Second payment (deposit + charges) will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {secondPaymentRequests.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-premium">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative h-16 w-24 rounded-xl overflow-hidden shrink-0">
                        <Image src={b.carImage} alt={b.carName} fill className="object-cover" sizes="96px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-[#111827]">{b.carName}</p>
                            <p className="text-sm text-[#6B7280]">{b.userName} · {b.userPhone}</p>
                            <p className="text-xs text-[#9CA3AF] font-mono">{b.bookingRef}</p>
                            <p className="text-xs text-[#6B7280] mt-0.5 capitalize">Delivery: {b.deliveryOption?.replace("_", " ") || "not selected"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold text-[#FF7A00]">{formatCurrency(b.secondPaymentAmount)}</p>
                            <Badge variant="info" className="text-xs mt-1">2nd Payment</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F8F9FB] rounded-xl p-3 mb-4">
                      <p className="text-xs text-[#6B7280] mb-1">UTR Number</p>
                      <p className="font-mono font-bold text-[#111827]">{b.secondPaymentUtr}</p>
                    </div>

                    {b.secondPaymentScreenshot && (
                      <div className="relative h-32 rounded-xl overflow-hidden mb-4 bg-gray-100 border border-[#E5E7EB]">
                        <Image src={b.secondPaymentScreenshot} alt="Payment" fill className="object-cover" sizes="400px" />
                      </div>
                    )}

                    {b.secondPaymentSubmittedAt && (
                      <p className="text-xs text-[#9CA3AF] mb-3">Submitted: {new Date(b.secondPaymentSubmittedAt).toLocaleString("en-IN")}</p>
                    )}

                    <div className="flex gap-3">
                      <Button variant="gradient" className="flex-1 gap-1.5"
                        onClick={() => {
                          approveSecondPayment(b.id);
                          addNotification({ type: "success", title: "Booking Confirmed! 🎉", message: `${b.bookingRef} — Booking is fully confirmed. Vehicle will be ready.` });
                        }}>
                        <CheckCircle className="h-4 w-4" />Confirm Booking
                      </Button>
                      <Button variant="outline" className="flex-1 gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => setRejectDialog({ open: true, type: "second", id: b.id })}>
                        <XCircle className="h-4 w-4" />Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── CAR CONFIG TAB ── */}
          <TabsContent value="cars">
            <div className="space-y-3">
              {MOCK_CARS.map((car) => {
                const config = MOCK_CAR_ADMIN_CONFIGS.find((c) => c.carId === car.id) || { ...DEFAULT_CAR_ADMIN_CONFIG, carId: car.id };
                return <CarConfigCard key={car.id} car={car} initialConfig={config} />;
              })}
            </div>
          </TabsContent>

          {/* ── TEST MODE TAB ── */}
          {isDev && (
            <TabsContent value="testmode">
              <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FlaskConical className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-[#111827]">Developer Test Mode</h2>
                    <p className="text-sm text-[#6B7280]">Quick tools to test the complete booking flow. Only visible in development.</p>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200">DEV ONLY</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
                    <h3 className="font-semibold text-[#111827] mb-1">Verification Flow</h3>
                    <p className="text-xs text-[#6B7280] mb-3">Generate a demo customer verification request and approve it.</p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5 w-full" onClick={generateDemoVerification}>
                        <Plus className="h-3.5 w-3.5" />Generate Demo Verification
                      </Button>
                      <Button size="sm" variant="gradient" className="gap-1.5 w-full" onClick={approveAllDocs}>
                        <CheckCircle className="h-3.5 w-3.5" />Approve All Documents
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
                    <h3 className="font-semibold text-[#111827] mb-1">Payment Flow</h3>
                    <p className="text-xs text-[#6B7280] mb-3">Generate a demo booking with submitted rental payment.</p>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5 w-full" onClick={generateDemoBooking}>
                        <Plus className="h-3.5 w-3.5" />Generate Demo Booking
                      </Button>
                      <Button size="sm" variant="gradient" className="gap-1.5 w-full" onClick={approveAllPayments}>
                        <CheckCircle className="h-3.5 w-3.5" />Approve All Payments
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-2xl border border-red-200 sm:col-span-2">
                    <h3 className="font-semibold text-red-700 mb-1">⚠️ Danger Zone</h3>
                    <p className="text-xs text-red-600 mb-3">Reset all data. This clears all bookings and verifications from localStorage.</p>
                    <Button size="sm" variant="destructive" className="gap-1.5 w-full sm:w-auto" onClick={resetAll}>
                      <RotateCcw className="h-3.5 w-3.5" />Reset All Data
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Zap className="h-4 w-4" />Complete Flow Test</h3>
                  <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Click &quot;Generate Demo Verification&quot; → Go to Verification tab → Approve</li>
                    <li>Go to /cars → Select any car → Enter dates → Click Book Now</li>
                    <li>Complete rental payment (use any UTR + any screenshot)</li>
                    <li>Return here → Rental Payment tab → Click Approve Payment</li>
                    <li>Go to /trips → Click &quot;Complete&quot; → Choose delivery → Pay second payment</li>
                    <li>Return here → Second Payment tab → Click Confirm Booking</li>
                    <li>Booking status shows &quot;Booking Confirmed&quot; in /trips</li>
                  </ol>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Reject Dialog */}
      <RejectDialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog((p) => ({ ...p, open: false }))}
        onConfirm={handleRejectConfirm}
        title={
          rejectDialog.type === "verification"
            ? "Reject Verification"
            : rejectDialog.type === "rental"
            ? "Reject Rental Payment"
            : "Reject Second Payment"
        }
      />

      {/* Doc Viewer */}
      <DocViewer open={!!docViewerId} onClose={() => setDocViewerId(null)} request={viewRequest} />
    </main>
  );
}
