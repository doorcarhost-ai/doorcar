"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Bell,
  Camera,
  ChevronRight,
  CreditCard,
  Edit,
  FileCheck,
  HeartHandshake,
  HelpCircle,
  LogOut,
  MapPin,
  Moon,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Star,
  Sun,
  Upload,
  User,
  XCircle,
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
import { VerificationDocument, VerificationStatus } from "@/types";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: VerificationStatus }) {
  const map = {
    not_uploaded: { label: "Not Uploaded", variant: "secondary" as const, icon: null },
    pending: { label: "Pending Review", variant: "warning" as const, icon: RefreshCw },
    verified: { label: "Verified", variant: "success" as const, icon: BadgeCheck },
    rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
  };
  const { label, variant, icon: Icon } = map[status];
  return (
    <Badge variant={variant} className="flex items-center gap-1 text-xs">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </Badge>
  );
}

interface DocUploadCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  doc: VerificationDocument | null;
  onUpload: (file: File) => void;
}

function DocUploadCard({ title, description, icon: Icon, doc, onUpload }: DocUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#FFF8F3] dark:bg-[#FFF8F3]/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-[#FF7A00] dark:text-[#FF7A00]" />
          </div>
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <StatusBadge status={doc?.status ?? "not_uploaded"} />
      </div>

      {doc?.fileUrl ? (
        <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-muted">
          <Image src={doc.fileUrl} alt={title} fill className="object-cover" sizes="400px" />
        </div>
      ) : null}

      {doc?.status === "rejected" && doc.rejectionReason && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-3">
          <p className="text-xs text-red-700 dark:text-red-400">
            Rejected: {doc.rejectionReason}
          </p>
        </div>
      )}

      {doc?.status !== "verified" && (
        <>
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => { if (e.target.files?.[0]) onUpload(e.target.files[0]); }} />
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            {doc?.fileUrl ? "Re-upload" : "Upload Document"}
          </Button>
        </>
      )}

      {doc?.status === "pending" && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Under review. Admin approval pending.
        </p>
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
  const [verification, setVerification] = useState(MOCK_USER.verification);

  const handleDocUpload = (type: "driving_license" | "aadhaar" | "selfie", file: File) => {
    const url = URL.createObjectURL(file);
    setVerification((prev) => ({
      ...prev,
      [type === "driving_license" ? "drivingLicense" : type === "aadhaar" ? "aadhaar" : "selfie"]: {
        type,
        fileUrl: url,
        status: "pending" as VerificationStatus,
        uploadedAt: new Date().toISOString(),
      },
      overallStatus: "pending" as VerificationStatus,
    }));
  };

  const allDocsUploaded =
    verification.drivingLicense !== null &&
    verification.aadhaar !== null &&
    verification.selfie !== null;

  type ProfileItem =
    | { icon: React.ElementType; label: string; value: string; action?: () => void; badge?: string; badgeVariant?: "success" | "warning" | "secondary"; toggle?: never; toggleValue?: never; onToggle?: never }
    | { icon: React.ElementType; label: string; toggle: true; toggleValue: boolean; onToggle: (val: boolean) => void; value?: never; action?: never; badge?: never; badgeVariant?: never };

  const settingsItems: ProfileItem[] = [
    {
      icon: Bell,
      label: "Push Notifications",
      toggle: true as const,
      toggleValue: notifications,
      onToggle: setNotifications,
    },
    {
      icon: theme === "dark" ? Moon : Sun,
      label: "Dark Mode",
      toggle: true as const,
      toggleValue: theme === "dark",
      onToggle: (val: boolean) => setTheme(val ? "dark" : "light"),
    },
    { icon: Settings, label: "App Settings", value: "" },
  ];

  const supportItems: ProfileItem[] = [
    { icon: HelpCircle, label: "Help & Support", value: "" },
    { icon: HeartHandshake, label: "Give Feedback", value: "" },
    { icon: Star, label: "Rate Us", value: "" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Profile Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-3xl p-6 text-white mb-6 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-[#FF7A00]/20/40">
                <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                <AvatarFallback className="text-2xl bg-gray-700">{MOCK_USER.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => setEditOpen(true)}
                className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF9A3C] flex items-center justify-center shadow-md"
              >
                <Edit className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold truncate">{name}</h1>
                {verification.overallStatus === "verified" && (
                  <BadgeCheck className="h-5 w-5 text-[#FF7A00] shrink-0" />
                )}
              </div>
              <p className="text-white/60 text-sm">{MOCK_USER.email}</p>
              <p className="text-white/60 text-sm">+91 {MOCK_USER.phone}</p>
              <div className="mt-2">
                <StatusBadge status={verification.overallStatus} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/8 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{MOCK_USER.totalTrips}</p>
              <p className="text-xs text-white/50">Trips</p>
            </div>
            <div className="bg-white/8 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-xs text-white/50">Rating</p>
            </div>
            <div className="bg-white/8 rounded-2xl p-3 text-center">
              <p className="text-xs font-semibold leading-tight">{MOCK_USER.memberSince}</p>
              <p className="text-xs text-white/50 mt-0.5">Member since</p>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full grid grid-cols-2 mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="verification" className="relative">
              Verification
              {verification.overallStatus === "not_uploaded" && (
                <span className="ml-1.5 h-2 w-2 rounded-full bg-[#FFF8F3]" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {/* Verification CTA */}
            {verification.overallStatus !== "verified" && (
              <div className="bg-gradient-to-r from-[#FF7A00]/10 to-[#FF9A3C]/10 border border-[#FF7A00]/20 dark:border-[#FF7A00]/20 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#FF7A00] dark:text-[#FF7A00]">
                    {verification.overallStatus === "not_uploaded" ? "Complete Verification" : "Verification In Progress"}
                  </p>
                  <p className="text-xs text-[#FF7A00] dark:text-[#FF7A00] mt-0.5">
                    {verification.overallStatus === "not_uploaded"
                      ? "Upload your documents to start booking"
                      : "Your documents are under admin review"}
                  </p>
                </div>
                {verification.overallStatus === "not_uploaded" && (
                  <Button size="sm" variant="gradient" className="shrink-0" onClick={() => {}}>
                    Verify Now
                  </Button>
                )}
              </div>
            )}

            {/* Addresses */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved Addresses</p>
                <button className="text-xs text-primary font-medium flex items-center gap-1"><Plus className="h-3.5 w-3.5" />Add</button>
              </div>
              <div className="divide-y divide-border">
                {MOCK_USER.savedAddresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-3 px-4 py-3.5">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{addr.label}</p>
                        {addr.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{addr.address}, {addr.city} - {addr.pincode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/20 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Methods</p>
                <button className="text-xs text-primary font-medium flex items-center gap-1"><Plus className="h-3.5 w-3.5" />Add</button>
              </div>
              <div className="divide-y divide-border">
                {MOCK_USER.paymentMethods.map((pm) => (
                  <div key={pm.id} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{pm.type}</p>
                      <p className="text-xs text-muted-foreground">{pm.label}</p>
                    </div>
                    {pm.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</p>
              </div>
              <div className="divide-y divide-border">
                {settingsItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5",
                        !item.toggle && "hover:bg-muted/30 cursor-pointer transition-colors"
                      )}
                    >
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium flex-1">{item.label}</p>
                      {item.toggle ? (
                        <Switch checked={item.toggleValue} onCheckedChange={item.onToggle} />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support</p>
              </div>
              <div className="divide-y divide-border">
                {supportItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors">
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium flex-1">{item.label}</p>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="my-2" />
            <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:border-destructive gap-2">
              <LogOut className="h-4 w-4" />Sign Out
            </Button>
            <p className="text-center text-xs text-muted-foreground">{APP_NAME} v1.0.0 · Made in India 🇮🇳</p>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            {/* Verification header */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-[#FFF8F3] dark:bg-[#FFF8F3]/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#FF7A00]" />
                </div>
                <div>
                  <h2 className="font-bold">Identity Verification</h2>
                  <p className="text-xs text-muted-foreground">One-time process. Upload once, book forever.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <StatusBadge status={verification.overallStatus} />
                {verification.overallStatus === "pending" && (
                  <p className="text-xs text-muted-foreground">Your documents are under admin review. Usually takes 2-4 hours.</p>
                )}
                {verification.overallStatus === "verified" && (
                  <p className="text-xs text-green-600">All documents verified. You can book any car!</p>
                )}
              </div>

              {allDocsUploaded && verification.overallStatus === "not_uploaded" && (
                <div className="mt-3 p-3 bg-[#FFF8F3] dark:bg-[#FFF8F3]/20 border border-[#FF7A00]/20 dark:border-[#FF7A00]/20 rounded-xl">
                  <p className="text-xs text-[#FF7A00] dark:text-[#FF7A00]">
                    All documents uploaded. Awaiting admin approval. You will be notified once verified.
                  </p>
                </div>
              )}
            </div>

            {/* Document uploads */}
            <DocUploadCard
              title="Driving Licence"
              description="Front side of your valid DL"
              icon={FileCheck}
              doc={verification.drivingLicense}
              onUpload={(f) => handleDocUpload("driving_license", f)}
            />
            <DocUploadCard
              title="Aadhaar Card"
              description="Front side of your Aadhaar"
              icon={Shield}
              doc={verification.aadhaar}
              onUpload={(f) => handleDocUpload("aadhaar", f)}
            />
            <DocUploadCard
              title="Selfie with ID"
              description="Take a selfie holding your Aadhaar"
              icon={Camera}
              doc={verification.selfie}
              onUpload={(f) => handleDocUpload("selfie", f)}
            />

            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-semibold text-sm mb-2">Verification Guidelines</h3>
              <ul className="space-y-1.5">
                {[
                  "Documents must be clear and fully visible",
                  "No watermarks or edits on documents",
                  "Selfie must show your face and ID clearly",
                  "Driving licence must be valid and not expired",
                  "Admin reviews documents within 2-4 hours",
                ].map((g, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-[#FF7A00] mt-0.5">•</span>{g}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-2">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={MOCK_USER.avatar} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF9A3C] flex items-center justify-center">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
