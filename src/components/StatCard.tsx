import { motion } from "framer-motion"; //stat
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  subtitleTrend?: "up" | "down" | "neutral";
  colorClass?: string;
  delay?: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  subtitleTrend = "neutral",
  colorClass = "text-primary",
  delay = 0,
}: StatCardProps) => {
  const TrendIcon =
    subtitleTrend === "up" ? TrendingUp :
      subtitleTrend === "down" ? TrendingDown : Minus;

  const trendColor =
    subtitleTrend === "up" ? "text-success bg-success/10" :
      subtitleTrend === "down" ? "text-destructive bg-destructive/10" :
        "text-muted-foreground bg-muted";

  const iconBg = colorClass.replace("text-", "bg-").replace(/text-\[.+\]/, "bg-primary") + "/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={cn(
        "bg-card border border-border/60 rounded-xl transition-all duration-300",
        // Mobile: compact horizontal row
        "p-3 flex items-center gap-3 hover:shadow-sm hover:-translate-y-0.5",
        // Desktop: vertical card with larger content
        "md:p-5 md:flex-col md:items-start md:gap-3 md:hover:shadow-md md:rounded-2xl"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "rounded-lg flex items-center justify-center flex-shrink-0",
        "w-8 h-8 md:w-10 md:h-10 md:rounded-xl",
        colorClass,
        iconBg
      )}>
        <Icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>

      {/* Mobile: value + label inline | Desktop: stacked with subtitle badge */}
      <div className="min-w-0 flex-1 md:w-full">
        {/* Desktop top row: value + trend badge */}
        <div className="md:flex md:items-start md:justify-between md:gap-2 md:mb-1">
          <p className={cn(
            "font-display font-bold text-foreground leading-tight tabular-nums",
            "text-lg md:text-3xl"
          )}>
            {value}
          </p>
          {/* Trend badge — hidden on mobile to save space */}
          {subtitle && (
            <span className={cn(
              "hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0",
              trendColor
            )}>
              <TrendIcon className="w-3 h-3" />
              <span className="truncate max-w-[60px]">{subtitle}</span>
            </span>
          )}
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground font-medium truncate">{label}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
