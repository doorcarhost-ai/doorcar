"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

// 20 premium illustrated avatars using DiceBear API (always available)
const AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera&backgroundColor=d1d4f9",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya&backgroundColor=ffd5dc",
];

const ALL_REVIEWS = [
  { name: "Arjun Sharma", rating: 5, text: "Absolutely seamless experience! The BMW M4 was in perfect condition. Pure driving joy.", car: "BMW M4", trips: 8 },
  { name: "Priya Kapoor", rating: 5, text: "Best self-drive platform in India. The Mercedes was spotless and the booking took under 2 minutes.", car: "Mercedes C-Class", trips: 12 },
  { name: "Rahul Verma", rating: 5, text: "DoorCar is incredible. Booked a Creta for a road trip — flawless experience from start to finish.", car: "Hyundai Creta", trips: 5 },
  { name: "Sneha Reddy", rating: 5, text: "The Innova Crysta was perfect for our family. Spotless interior, great mileage and smooth pickup.", car: "Innova Crysta", trips: 3 },
  { name: "Vikram Singh", rating: 5, text: "Premium platform with no hidden charges. The electric Nexon was a revelation — silent and powerful.", car: "Tata Nexon EV", trips: 15 },
  { name: "Kavya Nair", rating: 5, text: "I love the transparent pricing. Booked the BMW for a corporate event. Everyone was impressed!", car: "BMW 3 Series", trips: 7 },
  { name: "Aditya Kumar", rating: 5, text: "Verified cars, verified hosts — this is how car rental should work. Highly recommended.", car: "Mahindra XUV700", trips: 9 },
  { name: "Meera Pillai", rating: 5, text: "The Range Rover experience was breathtaking. DoorCar is my go-to platform from now on.", car: "Range Rover", trips: 4 },
  { name: "Rohit Joshi", rating: 5, text: "Super easy to use. Booked, picked up and drove — all without any friction. Amazing product.", car: "Hyundai Creta", trips: 6 },
  { name: "Ananya Mehta", rating: 5, text: "The 24x7 support saved my trip when I needed help. Excellent service and premium vehicles.", car: "Toyota Fortuner", trips: 2 },
  { name: "Suresh Patel", rating: 5, text: "Clean cars, honest hosts, transparent pricing. DoorCar is far ahead of any competitor.", car: "Maruti Swift", trips: 20 },
  { name: "Divya Krishnan", rating: 5, text: "Drove the Porsche 911 for my anniversary. The experience was absolutely cinematic.", car: "Porsche 911", trips: 11 },
  { name: "Kiran Rao", rating: 5, text: "Rented an EV for the first time. Nexon EV is amazing — quiet, powerful and eco-friendly.", car: "Tata Nexon EV", trips: 4 },
  { name: "Pooja Singh", rating: 5, text: "The QR payment system is genius. Simple, fast and no gateway fees. Love the UX.", car: "Honda City", trips: 3 },
  { name: "Ajay Mishra", rating: 5, text: "Brilliant platform. The home delivery feature saved me a lot of time. Will use again.", car: "Hyundai Creta", trips: 7 },
  { name: "Lakshmi Iyer", rating: 5, text: "Zero drama booking experience. Car was waiting exactly where they said. Great platform.", car: "BMW M4", trips: 5 },
  { name: "Manish Gupta", rating: 5, text: "DoorCar is the Airbnb of cars. Premium experience, trustworthy hosts, excellent value.", car: "Mahindra Thar", trips: 8 },
  { name: "Neha Chopra", rating: 5, text: "Drove the Defender through the Western Ghats — life-changing experience made possible by DoorCar.", car: "Land Rover Defender", trips: 2 },
  { name: "Sanjay Kumar", rating: 5, text: "Every detail was perfect — clean car, responsive support and seamless return. 10/10.", car: "Toyota Innova", trips: 14 },
  { name: "Tanya Shah", rating: 5, text: "Finally a car rental that actually cares about the customer. Verified, safe and premium.", car: "Mercedes GLA", trips: 6 },
];

// Assign avatars in order
const reviewsWithAvatars = ALL_REVIEWS.map((r, i) => ({
  ...r,
  avatar: AVATARS[i % AVATARS.length],
}));

// Split into two rows
const ROW1 = reviewsWithAvatars.slice(0, 10);
const ROW2 = reviewsWithAvatars.slice(10, 20);

interface ReviewCardProps {
  review: (typeof reviewsWithAvatars)[0];
}

function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-premium mx-2">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="h-11 w-11 rounded-full border-2 border-[#FF7A00]/20 bg-gray-50"
          loading="lazy"
        />
        <div>
          <p className="font-bold text-sm text-[#111827]">{review.name}</p>
          <p className="text-xs text-[#6B7280]">{review.trips} trips · {review.car}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-2.5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-[#FF7A00] text-[#FF7A00]" />
        ))}
      </div>
      <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3">{review.text}</p>
    </div>
  );
}

interface MarqueeRowProps {
  reviews: typeof reviewsWithAvatars;
  direction: "left" | "right";
}

function MarqueeRow({ reviews, direction }: MarqueeRowProps) {
  // Duplicate array for seamless loop
  const doubled = [...reviews, ...reviews];

  return (
    <div className="overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
      <div className={direction === "left" ? "marquee-left flex" : "marquee-right flex"}>
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export function Reviews() {
  return (
    <section className="py-20 overflow-hidden">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto text-center mb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-3"
        >
          ❤️ Loved By Members
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-4xl font-bold text-[#111827] mb-3"
        >
          What Our Members Say
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-1 mb-1"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-5 w-5 fill-[#FF7A00] text-[#FF7A00]" />
          ))}
          <span className="ml-2 font-bold text-[#111827]">4.9</span>
          <span className="text-[#6B7280]">· 12,000+ reviews</span>
        </motion.div>
      </div>

      <div className="space-y-4">
        <MarqueeRow reviews={ROW1} direction="left" />
        <MarqueeRow reviews={ROW2} direction="right" />
      </div>
    </section>
  );
}
