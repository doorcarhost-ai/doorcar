"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
import { MOCK_REVIEWS } from "@/data/mock-data";
import { getRelativeTime } from "@/lib/utils";

export function Reviews() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-3"
        >
          ❤️ Loved By Customers
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-2xl sm:text-4xl font-bold text-[#111827] mb-3"
        >
          What Our Members Say
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-1 mb-2"
        >
          {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-[#FF7A00] text-[#FF7A00]" />)}
          <span className="ml-2 font-bold text-[#111827]">4.9</span>
          <span className="text-[#6B7280]">· 12,000+ reviews</span>
        </motion.div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_REVIEWS.slice(0, 6).map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
            className="bg-white rounded-3xl border border-[#E5E7EB] p-5 shadow-premium hover:shadow-premium-lg transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-[#FF7A00]/20">
                  <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" sizes="40px" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#111827]">{review.userName}</p>
                  <p className="text-xs text-[#6B7280]">{review.trips} trips · {getRelativeTime(review.date)}</p>
                </div>
              </div>
              <Quote className="h-5 w-5 text-[#FF7A00]/30 shrink-0" />
            </div>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-[#FF7A00] text-[#FF7A00]" />
              ))}
            </div>
            <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">{review.comment}</p>
            {review.carName && (
              <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280]">Rented: <span className="font-semibold text-[#111827]">{review.carName}</span></p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
