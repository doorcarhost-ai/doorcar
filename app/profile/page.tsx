"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeCheck, Bell, Camera, ChevronRight, CreditCard, Edit, FileCheck,
  HeartHandshake, HelpCircle, LogOut, MapPin, Moon, Plus, RefreshCw,
  Settings, Shield, Star, Sun, User, XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_USER } from "@/data/mock-data";
import { APP_NAME } from "@/lib/constants";
import { VerificationStatus } from "@/types";
import { useVerificationStore, useNotificationStore } from "@/lib/store";
import { FileUploadField } from "@/components/shared/FileUploadField";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: VerificationStatus }) {
  const m = {
    not_uploaded: { label: "Not Uploaded", variant: "secondary" as const, icon: null },
    pending: { label: "Pending Review", variant: "warning" as const, icon: RefreshCw },
    verified: { label: "Verified", variant: "success" as const, icon: BadgeCheck },
    rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
  };
  const { label, variant, icon: Icon } = m[status];
  return (
    <Badge variant={variant} className="flex items-center gap-1 text-xs">
      {Icon && <Icon className="h-3 w-3" />}{label}
    </Badge>
  );
}

interface DocUploadCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  fileUrl: string | null;
  status: VerificationStatus;
  onUpload: (file: File) => void;
  rejectionReason?: string;
}

function DocUploadCard({ title, description, icon: Icon, fileUrl, status, onUpload, rejectionReason }: DocUploadCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-premium">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FFF8F3] flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-[#FF7A00]" />
          </div>
          <div>
            <p className="font-bold text-sm text-[#111827]">{title}</p>
            <p className="text-xs text-[#6B7280]">{description}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {status === "rejected" && rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
          <p className="text-xs text-red-700 font-medium">Rejected: {rejectionReason}</p>
          <p className="text-xs text-red-600 mt-0.5">Please upload a clearer document and resubmit.</p>
        </div>
      )}
      {status === "pending" && (
        <div className="bg-[#FFF8F3] border border-[#FF7A00]/20 rounded-xl p-3 mb-3">
          <p className="text-xs text-[#FF7A00] font-medium">Under admin review. Usually 2–4 hours.</p>
        </div>
      )}
      {status === "verified" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
          <p className="text-xs text-green-700 font-medium flex items-center gap-1"><BadgeCheck className="h-3.5 w-3.5" />Approved by admin</p>
        </div>
      )}

      {status !== "verified" && (
        <FileUploadField
          value={fileUrl}
          onChange={(url) => {
            if (url) {
              // Convert data URL to a fake File for the handler
              onUpload(new File([url], "doc.jpg", { type: "image/jpeg" }));
            }
          }}
        />
      )}
    </div>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "verification" ? "verification" : "profile";
  const { theme, setTheme } = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState(MOCK_USER.name);

  const { requests, userVerificationStatus, submitVerification } = useVerificationStore();
  const { addNotification } = useNotificationStore();

  const myRequest = requests.find((r) => r.userId === MOCK_USER.id);
  const overallStatus: VerificationStatus = userVerificationStatus;

  const [docUrls, setDocUrls] = useState<{ dl: string | null; aadhaar: string | null; selfie: string | null }>({
    dl: myRequest?.drivingLicenseUrl ?? null,
    aadhaar: myRequest?.aadhaarUrl ?? null,
    selfie: myRequest?.selfieUrl ?? null,
  });

  const handleUpload = (type: "dl" | "aadhaar" | "selfie", file: File) => {
    const url = URL.createObjectURL(file);
    setDocUrls((p) => ({ ...p, [type]: url }));
    addNotification({ type: "info", title: `${type === "dl" ? "Driving Licence" : type === "aadhaar" ? "Aadhaar" : "Selfie"} uploaded`, message: "Submit all documents to send for verification." });
  };

  const handleSubmitVerification = () => {
    if (!docUrls.dl || !docUrls.aadhaar || !docUrls.selfie) {
      addNotification({ type: "warning", title: "Upload All Documents", message: "Please upload all 3 documents before submitting." });
      return;
    }
    submitVerification({
      userId: MOCK_USER.id,
      userName: name,
      userEmail: MOCK_USER.email,
      userPhone: MOCK_USER.phone,
      userAvatar: MOCK_USER.avatar,
      drivingLicenseUrl: docUrls.dl,
      aadhaarUrl: docUrls.aadhaar,
      selfieUrl: docUrls.selfie,
    });
    addNotification({ type: "success", title: "Verification Submitted!", message: "Admin will review your documents within 2-4 hours." });
  };

  const allDocsUploaded = docUrls.dl && docUrls.aadhaar && docUrls.selfie;

  type SettingItem =
    | { icon: React.ElementType; label: string; value?: string; action?: () => void; badge?: string; toggle?: never; toggleValue?: never; onToggle?: never }
    | { icon: React.ElementType; label: string; toggle: true; toggleValue: boolean; onToggle: (v: boolean) => void; value?: never; action?: never; badge?: never };

  const settingsItems: SettingItem[] = [
    { icon: Bell, label: "Push Notifications", toggle: true as const, toggleValue: notifications, onToggle: setNotifications },
    { icon: theme === "dark" ? Moon : Sun, label: "Dark Mode", toggle: true as const, toggleValue: theme === "dark", onToggle: (v) => setTheme(v ? "dark" : "light") },
    { icon: Settings, label: "App Settings" },
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-6 text-white mb-6 shadow-premium-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00]/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-[#FF7A00]/40">
                  <AvatarImage src={MOCK_USER.avatar} />
                  <AvatarFallback className="bg-gray-700 text-2xl">{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button onClick={() => setEditOpen(true)}
                  className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#FF7A00] flex items-center justify-center shadow-md"
                >
                  <Edit className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="text-xl font-bold truncate">{name}</h1>
                  {overallStatus === "verified" && <BadgeCheck className="h-5 w-5 text-[#FF7A00] shrink-0" />}
                </div>
                <p className="text-white/60 text-sm">{MOCK_USER.email}</p>
                <p className="text-white/60 text-sm">+91 {MOCK_USER.phone}</p>
                <div className="mt-2"><StatusBadge status={overallStatus} /></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-5">
              {[
                { val: MOCK_USER.totalTrips, label: "Trips" },
                { val: "4.9", label: "Rating" },
                { val: MOCK_USER.memberSince.split(" ")[0], label: "Member Since" },
              ].map((s) => (
                <div key={s.label} className="bg-white/8 rounded-2xl p-3 text-center">
                  <p className="text-xl font-bold">{s.val}</p>
                  <p className="text-xs text-white/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-white border border-[#E5E7EB] p-1 rounded-2xl">
            <TabsTrigger value="profile" className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white data-[state=inactive]:text-[#6B7280] font-semibold">Profile</TabsTrigger>
            <TabsTrigger value="verification" className="rounded-xl data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white data-[state=inactive]:text-[#6B7280] font-semibold relative">
              Verification
              {overallStatus === "not_uploaded" && <span className="ml-1.5 h-2 w-2 rounded-full bg-[#FF7A00] inline-block" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {overallStatus !== "verified" && (
              <div className="bg-gradient-to-r from-[#FF7A00]/10 to-[#FFB547]/10 border border-[#FF7A00]/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#FF7A00]">
                    {overallStatus === "not_uploaded" ? "Complete Verification to Book" : "Verification Under Review"}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">
                    {overallStatus === "not_uploaded" ? "Upload DL, Aadhaar & Selfie" : "Admin will approve within 2-4 hours"}
                  </p>
                </div>
                {overallStatus === "not_uploaded" && (
                  <Button size="sm" variant="gradient" className="shrink-0" onClick={() => {}}>Verify Now</Button>
                )}
              </div>
            )}

            {/* Addresses */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-premium">
              <div className="px-4 py-3 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Saved Addresses</p>
                <button className="text-xs text-[#FF7A00] font-bold flex items-center gap-1"><Plus className="h-3.5 w-3.5" />Add</button>
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {MOCK_USER.savedAddresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-3 px-4 py-3.5">
                    <div className="h-9 w-9 rounded-xl bg-[#F8F9FB] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                      <MapPin className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><p className="text-sm font-semibold text-[#111827]">{addr.label}</p>{addr.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}</div>
                      <p className="text-xs text-[#6B7280] truncate">{addr.address}, {addr.city} - {addr.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-premium">
              <div className="px-4 py-3 border-b border-[#E5E7EB] bg-gray-50/50 flex items-center justify-between">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Payment Methods</p>
                <button className="text-xs text-[#FF7A00] font-bold flex items-center gap-1"><Plus className="h-3.5 w-3.5" />Add</button>
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {MOCK_USER.paymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="h-9 w-9 rounded-xl bg-[#F8F9FB] flex items-center justify-center border border-[#E5E7EB]">
                      <CreditCard className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <div className="flex-1"><p className="text-sm font-semibold text-[#111827] capitalize">{pm.type}</p><p className="text-xs text-[#6B7280]">{pm.label}</p></div>
                    {pm.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-premium">
              <div className="px-4 py-3 border-b border-[#E5E7EB] bg-gray-50/50">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Settings</p>
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {settingsItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className={cn("flex items-center gap-3 px-4 py-3.5", !item.toggle && "hover:bg-gray-50 cursor-pointer transition-colors")}>
                      <div className="h-9 w-9 rounded-xl bg-[#F8F9FB] flex items-center justify-center shrink-0 border border-[#E5E7EB]">
                        <Icon className="h-4 w-4 text-[#6B7280]" />
                      </div>
                      <p className="text-sm font-medium text-[#111827] flex-1">{item.label}</p>
                      {item.toggle ? <Switch checked={item.toggleValue} onCheckedChange={item.onToggle} /> : <ChevronRight className="h-4 w-4 text-[#6B7280]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-premium">
              <div className="px-4 py-3 border-b border-[#E5E7EB] bg-gray-50/50">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Support</p>
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {[
                  { icon: HelpCircle, label: "Help & Support" },
                  { icon: HeartHandshake, label: "Give Feedback" },
                  { icon: Star, label: "Rate Us" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="h-9 w-9 rounded-xl bg-[#F8F9FB] flex items-center justify-center border border-[#E5E7EB]">
                      <item.icon className="h-4 w-4 text-[#6B7280]" />
                    </div>
                    <p className="text-sm font-medium text-[#111827] flex-1">{item.label}</p>
                    <ChevronRight className="h-4 w-4 text-[#6B7280]" />
                  </div>
                ))}
              </div>
            </div>

            <Separator />
            <Button variant="destructive" className="w-full gap-2">
              <LogOut className="h-4 w-4" />Sign Out
            </Button>
            <p className="text-center text-xs text-[#6B7280]">{APP_NAME} v1.0.0 · Made in India 🇮🇳</p>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-premium">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-[#FFF8F3] flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#FF7A00]" />
                </div>
                <div>
                  <h2 className="font-bold text-[#111827]">Identity Verification</h2>
                  <p className="text-xs text-[#6B7280]">One-time process. Upload once, book unlimited cars.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={overallStatus} />
                {overallStatus === "verified" && <p className="text-xs text-green-600 font-medium">All documents approved. You can book any car!</p>}
                {overallStatus === "pending" && <p className="text-xs text-[#6B7280]">Your documents are under admin review.</p>}
              </div>
            </div>

            <DocUploadCard
              title="Driving Licence"
              description="Clear photo of front side"
              icon={FileCheck}
              fileUrl={docUrls.dl}
              status={myRequest?.status ?? (docUrls.dl ? "pending" : "not_uploaded")}
              onUpload={(f) => handleUpload("dl", f)}
              rejectionReason={myRequest?.rejectionReason}
            />
            <DocUploadCard
              title="Aadhaar Card"
              description="Clear photo of front side"
              icon={Shield}
              fileUrl={docUrls.aadhaar}
              status={myRequest?.status ?? (docUrls.aadhaar ? "pending" : "not_uploaded")}
              onUpload={(f) => handleUpload("aadhaar", f)}
              rejectionReason={myRequest?.rejectionReason}
            />
            <DocUploadCard
              title="Selfie with ID"
              description="Take selfie holding your Aadhaar"
              icon={Camera}
              fileUrl={docUrls.selfie}
              status={myRequest?.status ?? (docUrls.selfie ? "pending" : "not_uploaded")}
              onUpload={(f) => handleUpload("selfie", f)}
              rejectionReason={myRequest?.rejectionReason}
            />

            {overallStatus !== "pending" && overallStatus !== "verified" && (
              <Button variant="gradient" size="lg" className="w-full gap-2" onClick={handleSubmitVerification} disabled={!allDocsUploaded}>
                <Shield className="h-4 w-4" />
                {allDocsUploaded ? "Submit for Verification" : "Upload All 3 Documents First"}
              </Button>
            )}

            <div className="bg-[#F8F9FB] rounded-2xl p-4 border border-[#E5E7EB]">
              <p className="text-xs font-bold text-[#6B7280] mb-2">Verification Guidelines</p>
              <ul className="space-y-1.5">
                {["Documents must be clear and fully visible", "No watermarks or edits", "Selfie must show your face and ID clearly", "Driving licence must be valid", "Admin reviews within 2-4 hours"].map((g, i) => (
                  <li key={i} className="text-xs text-[#6B7280] flex items-start gap-2">
                    <span className="text-[#FF7A00] mt-0.5">•</span>{g}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <Avatar className="h-20 w-20"><AvatarImage src={MOCK_USER.avatar} /><AvatarFallback>{name.charAt(0)}</AvatarFallback></Avatar>
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-[#FF7A00] flex items-center justify-center">
                  <Edit className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
            <div><Label className="mb-1.5">Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label className="mb-1.5">Email</Label><Input type="email" defaultValue={MOCK_USER.email} /></div>
            <div><Label className="mb-1.5">Phone</Label><Input type="tel" defaultValue={MOCK_USER.phone} /></div>
            <Button variant="gradient" className="w-full" onClick={() => setEditOpen(false)}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
