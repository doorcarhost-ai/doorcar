"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CAR_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Categories() {
  const router = useRouter();
  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-2">Browse Categories</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">Find the Perfect Car</h2>
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {CAR_CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.07 }}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/cars?category=${cat.id}`)}
            className={cn(
              "flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] bg-white",
              "hover:border-[#FF7A00] hover:shadow-premium hover:shadow-[#FF7A00]/10 transition-all cursor-pointer group"
            )}
          >
            <div className="text-3xl sm:text-4xl transition-transform group-hover:scale-110">{cat.icon}</div>
            <div className="text-center">
              <p className="text-sm font-bold text-[#111827]">{cat.label}</p>
              <p className="text-xs text-[#6B7280] hidden sm:block mt-0.5">{cat.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
