import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export function StarRating({ rating, max = 5, size = "md", showValue = false, className }: StarRatingProps) {
  const sizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={cn(sizes[size], i < Math.floor(rating) ? "fill-[#FF7A00] text-[#FF7A00]" : i < rating ? "fill-[#FFB547] text-[#FFB547]" : "text-[#E5E7EB]")} />
      ))}
      {showValue && <span className={cn("font-bold ml-1 text-[#111827]", textSizes[size])}>{rating.toFixed(1)}</span>}
    </div>
  );
}
