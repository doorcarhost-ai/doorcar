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
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Find the perfect car for every occasion
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {CAR_CATEGORIES.map((category, idx) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/cars?category=${category.id}`)}
            className={cn(
              "flex flex-col items-center gap-3 p-4 sm:p-5 rounded-2xl border border-border bg-card",
              "hover:border-primary hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer group"
            )}
          >
            <div className="text-3xl sm:text-4xl transition-transform group-hover:scale-110">
              {category.icon}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{category.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                {category.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
