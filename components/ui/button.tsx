"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl",
    "text-sm font-semibold leading-none",
    "ring-offset-background transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "active:scale-[0.98]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Orange gradient — white text always
        default:
          "bg-[#FF7A00] text-white font-semibold shadow-sm hover:bg-[#E86E00] disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none",

        // Orange-to-amber gradient — white text always
        gradient:
          "bg-gradient-to-r from-[#FF7A00] to-[#FF9A3C] text-white font-bold shadow-[0_4px_14px_0_rgba(255,122,0,0.3)] hover:from-[#E86E00] hover:to-[#E88030] hover:shadow-[0_4px_18px_0_rgba(255,122,0,0.4)] hover:scale-[1.02] disabled:from-gray-200 disabled:to-gray-200 disabled:text-gray-400 disabled:shadow-none disabled:scale-100",

        // White/light — dark text, subtle border
        outline:
          "bg-white text-[#111827] font-semibold border border-[#E5E7EB] shadow-sm hover:border-[#FF7A00] hover:text-[#FF7A00] disabled:bg-gray-50 disabled:text-gray-300 disabled:border-gray-200",

        // Dark background — white text
        secondary:
          "bg-[#111827] text-white font-semibold hover:bg-[#1f2937] disabled:bg-gray-200 disabled:text-gray-400",

        // Transparent — dark text
        ghost:
          "bg-transparent text-[#6B7280] font-medium hover:bg-gray-100 hover:text-[#111827] disabled:text-gray-300",

        // Text link — orange
        link:
          "bg-transparent text-[#FF7A00] font-medium hover:text-[#E86E00] underline-offset-4 hover:underline p-0 h-auto disabled:text-gray-300",

        // White card-style — dark text
        white:
          "bg-white text-[#111827] font-semibold border border-[#E5E7EB] shadow-sm hover:bg-gray-50 hover:border-[#E5E7EB] disabled:opacity-50",

        // Danger/destructive — white background, red text
        destructive:
          "bg-white text-red-600 font-semibold border border-red-200 hover:bg-red-50 hover:border-red-400 disabled:opacity-50",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-8 rounded-xl px-4 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-base font-bold",
        icon: "h-10 w-10 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
