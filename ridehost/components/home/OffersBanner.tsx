"use client";

import { motion } from "framer-motion";
import { Copy, Tag, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MOCK_OFFERS } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const OFFER_STYLES = [
  { bg: "from-[#FF7A00] to-[#FF9A3C]", text: "text-white" },
  { bg: "from-[#111827] to-[#374151]", text: "text-white" },
  { bg: "from-[#059669] to-[#10B981]", text: "text-white" },
];

export function OffersBanner() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-sm font-bold text-[#FF7A00] uppercase tracking-widest mb-2">🎁 Special Deals</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">Exclusive Offers</h2>
        <p className="text-[#6B7280] mt-1">Save more on every trip with our best deals</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_OFFERS.map((offer, idx) => {
          const style = OFFER_STYLES[idx % OFFER_STYLES.length];
          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -3 }}
              className={cn("relative rounded-3xl overflow-hidden p-6 bg-gradient-to-br", style.bg)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                  <Tag className="h-3 w-3" />{offer.discount}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{offer.title}</h3>
                <p className="text-sm text-white/80 mb-5">{offer.description}</p>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/15 border border-white/20">
                  <div>
                    <p className="text-xs text-white/70">Promo Code</p>
                    <p className="text-base font-mono font-bold text-white tracking-widest">{offer.code}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => copy(offer.code, offer.id)}
                    className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5 text-xs"
                  >
                    {copiedId === offer.id ? <CheckCircle className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedId === offer.id ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-xs text-white/50 mt-3">Valid till {offer.validTill}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
