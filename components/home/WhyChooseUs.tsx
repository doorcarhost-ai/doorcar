"use client";

import { motion } from "framer-motion";
import { BadgeIndianRupee, Clock, FileCheck, Headphones, ShieldCheck, Zap } from "lucide-react";
import { WHY_CHOOSE_US } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  BadgeIndianRupee: <BadgeIndianRupee className="h-6 w-6" />,
  HeadphonesIcon: <Headphones className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  Clock: <Clock className="h-6 w-6" />,
  FileCheck: <FileCheck className="h-6 w-6" />,
};

const iconColors = [
  "bg-[#FF7A00]/10 text-[#FF7A00]",
  "bg-green-50 text-green-600",
  "bg-blue-50 text-blue-600",
  "bg-orange-50 text-orange-600",
  "bg-rose-50 text-rose-600",
  "bg-teal-50 text-teal-600",
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-[#F8F9FB]">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-3"
          >
            Why Choose Us
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl font-bold text-[#111827] mb-3"
          >
            The DoorCar Difference
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="text-[#6B7280] max-w-lg mx-auto"
          >
            We&apos;re building India&apos;s most trusted self-drive car rental experience
          </motion.p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_CHOOSE_US.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.09 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-premium hover:shadow-premium-lg transition-all"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl mb-4 ${iconColors[idx]}`}>
                {iconMap[item.icon]}
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-2">{item.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
