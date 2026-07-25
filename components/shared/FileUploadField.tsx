"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle, ImageIcon, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FileUploadFieldProps {
  label?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  className?: string;
}

export function FileUploadField({
  label,
  value,
  onChange,
  accept = "image/*",
  className,
}: FileUploadFieldProps) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <p className="text-sm font-semibold text-[#111827] mb-2">{label}</p>
      )}

      <AnimatePresence mode="wait">
        {value ? (
          /* Preview state */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative"
          >
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border-2 border-green-400 bg-gray-100 shadow-premium">
              <Image
                src={value}
                alt="Uploaded document"
                fill
                className="object-cover"
                sizes="400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                <CheckCircle className="h-3.5 w-3.5" />Uploaded Successfully
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <input ref={galleryRef} type="file" accept={accept} className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }} />
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#6B7280] hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-colors"
              >
                <Upload className="h-4 w-4" />Replace
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="h-10 w-10 flex items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Upload state */
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            {/* Hidden inputs */}
            <input
              ref={galleryRef}
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
            />
            <input
              ref={cameraRef}
              type="file"
              accept={accept}
              capture="environment"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) processFile(e.target.files[0]); }}
            />

            {/* Drag-drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center transition-all",
                dragOver
                  ? "border-[#FF7A00] bg-[#FFF8F3]"
                  : "border-[#E5E7EB] hover:border-[#FF7A00]/50 hover:bg-[#FFF8F3]/50"
              )}
            >
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors",
                dragOver ? "bg-[#FF7A00]/15" : "bg-[#F8F9FB] border border-[#E5E7EB]"
              )}>
                <Upload className={cn("h-6 w-6 transition-colors", dragOver ? "text-[#FF7A00]" : "text-[#6B7280]")} />
              </div>
              <p className="text-sm font-semibold text-[#111827] mb-0.5">
                {dragOver ? "Drop to upload" : "Drag & drop or choose below"}
              </p>
              <p className="text-xs text-[#6B7280] mb-4">JPG, PNG, PDF up to 10MB</p>

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-colors shadow-sm"
                >
                  <Camera className="h-4 w-4" />Take Photo
                </button>
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#111827] hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-colors shadow-sm"
                >
                  <ImageIcon className="h-4 w-4" />Gallery
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
