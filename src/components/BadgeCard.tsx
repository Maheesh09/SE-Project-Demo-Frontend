import { motion } from "framer-motion";
import { Zap, CalendarHeart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserBadge, Badge } from "@/lib/api";

interface BadgeCardProps {
  badge: Badge;
  earnedAt?: string;
  isNew?: boolean;
  className?: string;
}

export function BadgeCard({ badge, earnedAt, isNew, className }: BadgeCardProps) {
  const isEarned = !!earnedAt;
  
  // Format the date to something like "Apr 8, 2026"
  const formattedDate = earnedAt 
    ? new Date(earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <motion.div
      whileHover={{ scale: isEarned ? 1.02 : 1 }}
      whileTap={{ scale: isEarned ? 0.98 : 1 }}
      className={cn(
        "relative rounded-2xl flex flex-col items-center justify-center p-5 text-center transition-all bg-card border border-border/60 shadow-sm",
        isEarned ? "hover:shadow-md hover:border-streak/30" : "opacity-60 grayscale",
        isNew && "ring-2 ring-streak bg-streak/5",
        className
      )}
    >
      {/* Optional 'NEW' badge */}
      {isNew && (
        <span className="absolute -top-2.5 -right-2.5 bg-streak text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm z-10 animate-bounce">
          New!
        </span>
      )}

      {/* Hexagon/Badge icon container */}
      <div className={cn(
        "relative w-24 h-24 mb-4 flex items-center justify-center rounded-2xl",
        isEarned ? "bg-streak/10" : "bg-muted"
      )}>
        {/* Glow effect back */}
        {isEarned && (
          <div className="absolute inset-0 bg-streak/20 blur-xl rounded-full" />
        )}
        
        {badge.image_url ? (
          <img 
            src={badge.image_url} 
            alt={badge.name} 
            className="w-16 h-16 object-contain relative z-10 drop-shadow-md"
            loading="lazy"
          />
        ) : (
           <Zap className={cn("w-10 h-10 relative z-10", isEarned ? "text-streak" : "text-muted-foreground")} />
        )}
      </div>

      <h3 className="font-display font-bold text-base text-foreground mb-1">
        {badge.name}
      </h3>
      
      {isEarned ? (
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mt-1">
          <CalendarHeart className="w-3.5 h-3.5 text-streak" />
          <span>Earned {formattedDate}</span>
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
          {badge.description}
        </p>
      )}
    </motion.div>
  );
}
