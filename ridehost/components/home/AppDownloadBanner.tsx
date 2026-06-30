"use client";

import { motion } from "framer-motion";
import { ArrowRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppDownloadBanner() {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF7A00] to-[#FF9A3C] p-8 sm:p-12"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-6 w-6 text-white/80" />
                <span className="text-sm font-bold text-white/80 uppercase tracking-widest">RideHost App</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Book Cars on the Go
              </h2>
              <p className="text-white/80 max-w-sm">
                Download the RideHost app and get ₹200 off your first booking. Available on iOS and Android.
              </p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Button variant="white" className="gap-2 font-bold">
                App Store <ArrowRight className="h-4 w-4" />
              </Button>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-0 gap-2">
                Google Play <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
