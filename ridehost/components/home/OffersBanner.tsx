"use client";

import { motion } from "framer-motion";
import { Copy, Tag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_OFFERS } from "@/data/mock-data";
import { cn } from "@/lib/utils";

export function OffersBanner() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Exclusive Offers
        </h2>
        <p className="text-muted-foreground">
          Save more on every trip with our best deals
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_OFFERS.map((offer, idx) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={cn(
              "relative rounded-2xl overflow-hidden p-6 text-white bg-gradient-to-br",
              offer.color
            )}
          >
            {/* Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 3px 3px, white 2px, transparent 0)`,
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-2">
                    <Tag className="h-3 w-3 mr-1" />
                    {offer.discount}
                  </Badge>
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                  <p className="text-sm text-white/80 mt-1">
                    {offer.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Promo Code</p>
                    <p className="text-base font-mono font-bold tracking-wider">
                      {offer.code}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCopy(offer.code, offer.id)}
                    className="bg-white/20 hover:bg-white/30 text-white border-0 gap-1.5"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    {copiedId === offer.id ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-white/60 mt-3">
                Valid till {offer.validTill}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
