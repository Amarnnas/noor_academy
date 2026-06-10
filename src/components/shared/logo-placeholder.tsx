import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoPlaceholderProps {
  variant?: "symbol" | "full";
  className?: string;
  width?: number;
  height?: number;
}

export function LogoPlaceholder({ variant = "symbol", className, width = 48, height = 48 }: LogoPlaceholderProps) {
  if (variant === "full") {
    return (
      <div
        className={cn("flex items-center gap-2", className)}
        style={{ width, height: height || 48 }}
        data-logo-placeholder="full"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shrink-0">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="text-sm font-bold text-teal-600 dark:text-teal-400 whitespace-nowrap">
          أكاديمية نور
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white", className)}
      style={{ width, height }}
      data-logo-placeholder="symbol"
      aria-label="أكاديمية نور"
    >
      <GraduationCap className="w-1/2 h-1/2" />
    </div>
  );
}
