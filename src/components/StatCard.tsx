import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode | string;
  subtitle?: string;
  subtitleTrend?: "up" | "down" | "neutral";
  /** Tailwind text color class, e.g. "text-amber-500" */
  colorClass?: string;
  /** Hex or CSS color for the left accent border */
  accentColor?: string;
  /** Tailwind bg+opacity class for the icon pill, e.g. "bg-amber-500/10" */
  iconBgClass?: string;
  delay?: number;
  size?: "lg" | "sm";
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  colorClass = "text-primary",
  accentColor,
  iconBgClass,
  delay = 0,
  size = "lg",
}: StatCardProps) => {
  if (size === "sm") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className="bg-card border border-border/60 rounded-xl p-3 flex items-center gap-3 hover:shadow-sm hover:border-border transition-all duration-200"
      >
        <div className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
          colorClass,
          iconBgClass ?? "bg-muted"
        )}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-foreground tabular-nums leading-none">{value}</p>
          <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">{label}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={cn(
        "group relative bg-card border border-border/60 rounded-2xl md:rounded-2xl",
        "p-4 md:p-5 flex items-center gap-3.5 md:flex-col md:items-start md:gap-3",
        "shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-quint",
        "active:translate-y-0 active:scale-[0.99] active:duration-100",
        "overflow-hidden",
        accentColor ? "border-l-[3px]" : ""
      )}
      style={accentColor ? { borderLeftColor: accentColor } : undefined}
    >
      {/* Hover sheen — radial highlight that fades in on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: accentColor
            ? `radial-gradient(120% 80% at 100% 0%, ${accentColor}14, transparent 60%)`
            : "radial-gradient(120% 80% at 100% 0%, hsl(var(--primary) / 0.08), transparent 60%)",
        }}
      />

      {/* Icon */}
      <div className={cn(
        "relative w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-spring group-hover:scale-110",
        colorClass,
        iconBgClass ?? "bg-muted"
      )}>
        <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
      </div>

      <div className="relative min-w-0 flex-1 md:w-full">
        <p className="text-2xl md:text-3xl font-bold text-foreground leading-none tabular-nums">
          {value}
        </p>
        <p className="text-[11px] md:text-xs text-muted-foreground font-semibold mt-1.5 truncate">{label}</p>
        {subtitle && (
          <p className="text-[10px] text-muted-foreground/70 mt-1 truncate hidden md:block">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
