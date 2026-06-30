"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { MOCK_REVIEWS } from "@/data/mock-data";
import { StarRating } from "@/components/shared/StarRating";
import { getRelativeTime } from "@/lib/utils";

export function Reviews() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold mb-3"
        >
          What Our Customers Say
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Over 1.2 million happy customers and counting
        </motion.p>

        {/* Aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3 mt-4"
        >
          <StarRating rating={4.8} size="lg" showValue />
          <span className="text-muted-foreground text-sm">
            based on 12,000+ reviews
          </span>
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
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={review.userAvatar}
                    alt={review.userName}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm">{review.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {review.trips} trips · {getRelativeTime(review.date)}
                  </p>
                </div>
              </div>
              <Quote className="h-5 w-5 text-primary/30 shrink-0" />
            </div>

            <StarRating rating={review.rating} size="sm" className="mb-3" />

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {review.comment}
            </p>

            {review.carName && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Rented:{" "}
                  <span className="font-medium text-foreground">
                    {review.carName}
                  </span>
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
