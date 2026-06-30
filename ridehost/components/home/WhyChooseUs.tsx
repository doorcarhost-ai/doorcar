"use client";

import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  Clock,
  FileCheck,
  Headphones,
  ShieldCheck,
  Zap,
} from "lucide-react";
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
  "from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400",
  "from-green-500/10 to-emerald-500/10 text-green-600 dark:text-green-400",
  "from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400",
  "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
  "from-pink-500/10 to-rose-500/10 text-pink-600 dark:text-pink-400",
  "from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400",
];

export function WhyChooseUs() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold mb-3"
          >
            Why Choose{" "}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              RideHost?
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            We&apos;re committed to providing the safest, most convenient and
            affordable self-drive experience in India
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
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-md hover:shadow-primary/5 transition-all group"
            >
              <div
                className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br mb-5 ${colors[idx]}`}
              >
                {iconMap[item.icon]}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
