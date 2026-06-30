"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Bell,
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
  Settings,
  Shield,
  Star,
  Sun,
  User,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_USER } from "@/data/mock-data";
import { APP_NAME } from "@/lib/constants";

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [name, setName] = useState(MOCK_USER.name);

  type ProfileItem =
    | { icon: React.ElementType; label: string; value: string; action?: () => void; badge?: string; badgeVariant?: string; toggle?: never; toggleValue?: never; onToggle?: never }
    | { icon: React.ElementType; label: string; toggle: true; toggleValue: boolean; onToggle: (val: boolean) => void; value?: never; action?: never; badge?: never; badgeVariant?: never };

  const profileSections: { title: string; items: ProfileItem[] }[] = [
    {
      title: "Personal",
      items: [
        {
          icon: User,
          label: "Personal Information",
          value: MOCK_USER.name,
          action: () => setEditOpen(true),
        },
        {
          icon: Shield,
          label: "Driving Licence",
          value: MOCK_USER.drivingLicense
            ? `*****${MOCK_USER.drivingLicense.slice(-4)}`
            : "Not added",
          badge: MOCK_USER.drivingLicense ? "Verified" : "Add",
          badgeVariant: MOCK_USER.drivingLicense ? "success" : "warning",
        },
        {
          icon: FileCheck,
          label: "Government ID",
          value: MOCK_USER.governmentId
            ? `*****${MOCK_USER.governmentId.slice(-4)}`
            : "Not added",
          badge: MOCK_USER.governmentId ? "Verified" : "Add",
          badgeVariant: MOCK_USER.governmentId ? "success" : "warning",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: MapPin,
          label: "Saved Addresses",
          value: `${MOCK_USER.savedAddresses.length} addresses`,
        },
        {
          icon: CreditCard,
          label: "Payment Methods",
          value: `${MOCK_USER.paymentMethods.length} saved`,
        },
      ],
    },
    {
      title: "Settings",
      items: [
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
        {
          icon: Settings,
          label: "App Settings",
          value: "",
        },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Support", value: "" },
        { icon: HeartHandshake, label: "Give Feedback", value: "" },
        { icon: Star, label: "Rate Us", value: "" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="pt-20 pb-12 px-4 sm:px-6 max-w-2xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 text-white mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarImage src={MOCK_USER.avatar} alt={MOCK_USER.name} />
                <AvatarFallback className="text-2xl bg-violet-400">
                  {MOCK_USER.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-md">
                <Edit className="h-3.5 w-3.5 text-violet-600" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold truncate">{name}</h1>
                {MOCK_USER.drivingLicense && (
                  <BadgeCheck className="h-5 w-5 text-green-300 shrink-0" />
                )}
              </div>
              <p className="text-white/70 text-sm">{MOCK_USER.email}</p>
              <p className="text-white/70 text-sm">+91 {MOCK_USER.phone}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">{MOCK_USER.totalTrips}</p>
              <p className="text-xs text-white/70">Trips</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-2xl font-bold">4.9</p>
              <p className="text-xs text-white/70">Rating</p>
            </div>
            <div className="bg-white/15 rounded-2xl p-3 text-center">
              <p className="text-xs font-semibold">{MOCK_USER.memberSince}</p>
              <p className="text-xs text-white/70 mt-0.5">Member since</p>
            </div>
          </div>
        </motion.div>

        {/* Verification Banner */}
        {!MOCK_USER.drivingLicense && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Complete Your Profile
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Add your documents to start booking
              </p>
            </div>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white shrink-0"
            >
              Verify Now
            </Button>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-4">
          {profileSections.map((section) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </p>
              </div>

              <div className="divide-y divide-border">
                {section.items.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={
                        item.toggle
                          ? "flex items-center justify-between px-4 py-3.5"
                          : "flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 cursor-pointer transition-colors"
                      }
                      onClick={
                        !item.toggle
                          ? item.action || (() => {})
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{item.label}</p>
                          {item.value !== undefined && !item.toggle && (
                            <p className="text-xs text-muted-foreground truncate">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant as "success" | "warning"}
                            className="text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {item.toggle ? (
                          <Switch
                            checked={item.toggleValue}
                            onCheckedChange={item.onToggle}
                          />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Saved Addresses */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mt-4">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Saved Addresses
            </p>
            <button className="text-xs text-primary font-medium flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add New
            </button>
          </div>
          <div className="divide-y divide-border">
            {MOCK_USER.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-start gap-3 px-4 py-3.5"
              >
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{addr.label}</p>
                    {addr.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {addr.address}, {addr.city} - {addr.pincode}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mt-4">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Payment Methods
            </p>
            <button className="text-xs text-primary font-medium flex items-center gap-1">
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
          <div className="divide-y divide-border">
            {MOCK_USER.paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">
                    {pm.type}
                  </p>
                  <p className="text-xs text-muted-foreground">{pm.label}</p>
                </div>
                {pm.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-5" />

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:bg-destructive/10 hover:border-destructive gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {APP_NAME} v1.0.0 · Made in India 🇮🇳
        </p>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-2">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={MOCK_USER.avatar} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                  <Edit className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-1.5">Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label className="mb-1.5">Email</Label>
              <Input
                type="email"
                defaultValue={MOCK_USER.email}
                placeholder="Email"
              />
            </div>
            <div>
              <Label className="mb-1.5">Phone</Label>
              <Input
                type="tel"
                defaultValue={MOCK_USER.phone}
                placeholder="Phone"
              />
            </div>
            <Button
              variant="gradient"
              className="w-full"
              onClick={() => setEditOpen(false)}
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
      <div className="h-16 md:hidden" />
    </main>
  );
}
