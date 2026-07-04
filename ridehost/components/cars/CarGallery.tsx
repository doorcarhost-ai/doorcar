"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarGalleryProps {
  images: string[];
  carName: string;
}

export function CarGallery({ images, carName }: CarGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState(1);

  const goTo = (idx: number) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };
  const next = () => goTo((active + 1) % images.length);
  const prev = () => goTo((active - 1 + images.length) % images.length);

  return (
    <>
      <div className="relative">
        {/* Main image */}
        <div
          className="relative h-64 sm:h-80 md:h-[440px] rounded-3xl overflow-hidden cursor-zoom-in bg-gray-100 group"
          onClick={() => setLightbox(true)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[active]}
                alt={`${carName} ${active + 1}`}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 border border-white shadow-premium hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="h-5 w-5 text-[#111827]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 border border-white shadow-premium hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="h-5 w-5 text-[#111827]" />
              </button>
            </>
          )}

          {/* Counter + zoom */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold backdrop-blur-sm">
              <ZoomIn className="h-3.5 w-3.5" />
              {active + 1} / {images.length}
            </div>
          </div>

          {/* Always visible counter */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-semibold">
            {active + 1}/{images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <motion.button
                key={idx}
                onClick={() => goTo(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative h-16 w-24 rounded-xl overflow-hidden shrink-0 transition-all border-2",
                  idx === active ? "border-[#FF7A00] shadow-orange" : "border-transparent opacity-60 hover:opacity-90"
                )}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" sizes="96px" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 h-11 w-11 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition-colors text-white"
              onClick={() => setLightbox(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute top-4 left-4 text-white/60 text-sm font-semibold">
              {active + 1} / {images.length}
            </div>

            <div className="relative w-full max-w-5xl h-[80vh] mx-4" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0">
                  <Image src={images[active]} alt={carName} fill className="object-contain" sizes="100vw" />
                </motion.div>
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors">
                  <ChevronRight className="h-6 w-6" />
                </button>
                {/* Thumbnail strip */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button key={idx} onClick={(e) => { e.stopPropagation(); goTo(idx); }}
                      className={cn("h-1.5 rounded-full transition-all", idx === active ? "bg-white w-8" : "bg-white/40 w-3")}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
