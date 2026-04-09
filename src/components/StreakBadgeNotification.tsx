import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Sparkles } from "lucide-react";
import { useStreakBadge } from "@/hooks/useStreakBadge";

export function StreakBadgeNotification() {
  const { streakBadge, newlyEarned, dismissToast } = useStreakBadge();

  return (
    <AnimatePresence>
      {newlyEarned && streakBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-6 right-6 z-[100] max-w-sm w-full bg-card border-l-4 border-l-streak border-y border-r border-y-border/60 border-r-border/60 rounded-2xl p-4 shadow-2xl drop-shadow-[0_0_15px_rgba(212,168,122,0.3)] overflow-hidden"
        >
          {/* Confetti / background flair */}
          <div className="absolute top-0 right-0 p-8 pt-6 pointer-events-none opacity-20">
             <Trophy className="w-24 h-24 text-streak -rotate-12" />
          </div>
          
          <button
            onClick={dismissToast}
            className="absolute top-3 right-3 p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors z-10"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 relative z-10">
            {/* Badge Icon */}
            <div className="w-14 h-14 rounded-xl bg-streak/15 flex items-center justify-center flex-shrink-0 shadow-inner">
              {streakBadge.badge.image_url ? (
                <img 
                  src={streakBadge.badge.image_url} 
                  alt={streakBadge.badge.name} 
                  className="w-10 h-10 object-contain drop-shadow" 
                />
              ) : (
                <Sparkles className="w-7 h-7 text-streak" />
              )}
            </div>

            <div className="flex-1 min-w-0 pr-4">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-streak/10 text-[10px] font-bold text-streak uppercase tracking-wider mb-1.5 border border-streak/20">
                <Sparkles className="w-3 h-3 fill-current" />
                Badge Unlocked
              </span>
              <h3 className="text-sm font-display font-black text-foreground leading-tight mb-1">
                {streakBadge.badge.name}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {streakBadge.badge.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
