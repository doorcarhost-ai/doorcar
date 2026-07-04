import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFF8F3] border border-[#FF7A00]/20 mb-5">
        <Icon className="h-9 w-9 text-[#FF7A00]" />
      </div>
      <h3 className="text-xl font-bold text-[#111827] mb-2">{title}</h3>
      <p className="text-[#6B7280] max-w-xs mb-6 leading-relaxed">{description}</p>
      {action && (
        <Button variant="gradient" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
