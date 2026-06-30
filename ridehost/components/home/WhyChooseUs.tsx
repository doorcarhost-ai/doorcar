"use client";

import { motion } from "framer-motion";
import { BadgeIndianRupee, Clock, FileCheck, Headphones, ShieldCheck, Zap } from "lucide-react";
import { WHY_CHOOSE_US } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="h-7 w-7" />,
  BadgeIndianRupee: <BadgeIndianRupee className="h-7 w-7" />,
  HeadphonesIcon: <Headphones className="h-7 w-7" />,
  Zap: <Zap className="h-7 w-7" />,
  Clock: <Clock className="h-7 w-7" />,
  FileCheck: <FileCheck className="h-7 w-7" />,
};

const colors = [
  "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
  "bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400",
  "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
  "bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400",
  "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400",
  "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400",
];

export function WhyChooseUs() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-3 text-white"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              RideHost?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 max-w-xl mx-auto"
          >
            We&apos;re committed to providing the safest, most convenient and affordable self-drive experience in India
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-5 ${colors[idx]}`}>
                {iconMap[item.icon]}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
