import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Trophy, CheckCircle2, Loader2, Check, Zap, Flame } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function StreakDisplay({ className }: { className?: string }) {
    const { streak, isLoading, error, isCompleting, refetch, completeStreak } = useStreak();
    const { toast } = useToast();

    // ── Derived state ───────────────────────────────────────────────────────────
    const current_streak = streak?.current_streak ?? 0;
    const longest_streak = streak?.longest_streak ?? 0;
    const last_completed_date = streak?.last_completed_date ?? streak?.last_activity_date ?? null;

    const isEmpty = current_streak === 0 && longest_streak === 0 && !last_completed_date;
    const isBroken = !isEmpty && current_streak === 0 && longest_streak > 0;
    const isActive = current_streak > 0;

    // Determine if user has already completed today
    const todayStr = new Date().toISOString().split("T")[0];
    const completedToday = last_completed_date === todayStr;

    // Progress to next 7-day milestone
    const milestoneProgress = current_streak % 7;
    const progressPercent = isActive ? ((milestoneProgress || 7) / 7) * 100 : 0;

    // ── Broken streak notification ───────────────────────────────────────────────
    useEffect(() => {
        if (isBroken && !sessionStorage.getItem("broken_streak_toast_shown")) {
            toast({
                title: "Streak Broken",
                description: `Your ${longest_streak}-day streak ended. Start fresh today!`,
                className: "bg-red-500/20 text-red-950 dark:text-red-50 border border-red-500/30 backdrop-blur-md shadow-lg",
            });
            sessionStorage.setItem("broken_streak_toast_shown", "true");
        }
    }, [isBroken, longest_streak, toast]);

    // ── Loading state ──────────────────────────────────────────────────────────
    if (isLoading) {
        return (
            <div
                className={cn(
                    "bg-card border border-border/60 rounded-2xl p-4 md:p-5 flex flex-col justify-center min-h-[160px]",
                    className
                )}
            >
                <div className="animate-pulse flex space-x-4 items-center">
                    <div className="rounded-full bg-muted h-12 w-12" />
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                </div>
            </div>
        );
    }

    // ── Error state ─────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div
                className={cn(
                    "bg-card border border-red-500/20 rounded-2xl p-4 md:p-5 flex flex-col items-center justify-center text-center min-h-[160px]",
                    className
                )}
            >
                <AlertCircle className="w-8 h-8 text-red-500/50 mb-3" />
                <p className="text-sm font-medium text-foreground mb-2">Couldn't load your streak.</p>
                <button
                    onClick={refetch}
                    className="text-xs text-primary hover:underline flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full"
                >
                    <RotateCcw className="w-3 h-3" /> Tap to retry
                </button>
            </div>
        );
    }

    // ── Complete today handler ───────────────────────────────────────────────────
    const handleCompleteToday = async () => {
        const result = await completeStreak();
        if (!result) return;

        if (result.status === "already_completed") {
            toast({ title: "Already done!", description: "You've already completed today's tasks." });
        } else {
            toast({
                title: `${result.current_streak} Day streak!`,
                description:
                    result.current_streak > longest_streak
                        ? "New personal best! Keep it up!"
                        : result.message,
            });
            // Clear broken-streak toast flag so it can re-trigger if needed
            sessionStorage.removeItem("broken_streak_toast_shown");
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-4 md:p-5",
                "bg-gradient-to-br from-card to-card/80",
                "border border-border/30 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-shadow duration-500 hover:shadow-[0_8px_40px_rgba(249,115,22,0.08)]",
                className
            )}
        >
            {/* Background glowing orb */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-[40px] pointer-events-none transition-all duration-700 group-hover:bg-orange-500/15 group-hover:scale-125" />
            
            {/* Outline icon backdrop */}
            <div className="absolute top-4 right-4 opacity-[0.03] pointer-events-none transform rotate-12 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
                <Flame className="w-32 h-32 text-foreground" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    {/* Header line */}
                    <div className="flex flex-row items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg shadow-sm backdrop-blur-md",
                                isActive ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "bg-muted text-muted-foreground border border-border/50"
                            )}>
                                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                            </div>
                            <h3 className="font-bold text-[14px] md:text-[15px] tracking-tight text-foreground/90">
                                Study Streak
                            </h3>
                        </div>
                        {longest_streak > 0 && (
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="text-[11px] font-bold text-amber-600 bg-amber-500/10 dark:text-amber-400 px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-500/20 backdrop-blur-sm select-none"
                            >
                                <Trophy className="w-3 h-3" /> Best: {longest_streak}d
                            </motion.span>
                        )}
                    </div>

                    {/* Streak Numbers Box */}
                    <div className="mt-1 flex flex-col items-start gap-1 p-1">
                        {isEmpty && (
                            <>
                                <p className="text-4xl font-extrabold text-foreground/30 tracking-tighter">0 Days</p>
                                <p className="text-sm font-medium text-muted-foreground">Complete tasks to ignite your streak.</p>
                            </>
                        )}

                        {isBroken && (
                            <>
                                <div className="flex items-center gap-3">
                                    <p className="text-4xl font-extrabold text-foreground/30 tracking-tighter">0 Days</p>
                                    <span className="bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full select-none">
                                        Broken
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">Ready to bounce back? Start a new run today.</p>
                            </>
                        )}

                        {isActive && (
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }} 
                                transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                                className="flex flex-col"
                            >
                                <div className="flex items-end gap-1.5 drop-shadow-sm select-none mt-1">
                                    <span className={cn(
                                        "text-4xl md:text-5xl font-black tracking-tighter leading-none bg-clip-text text-transparent pb-1",
                                        completedToday ? "bg-gradient-to-br from-amber-400 to-amber-600" : "bg-gradient-to-br from-orange-400 via-orange-500 to-red-500"
                                    )}>
                                        {current_streak}
                                    </span>
                                    <span className={cn(
                                        "text-base md:text-lg font-extrabold mb-1 tracking-tight",
                                        completedToday ? "text-amber-500/80" : "text-orange-500/80"
                                    )}>
                                        Day{current_streak !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-foreground/60 mt-1">
                                    {completedToday ? "Streak successfully secured." : "You're on fire! Keep the momentum."}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>

                <div className="mt-4 md:mt-5 space-y-3">
                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] md:text-[11px] text-foreground/50 font-bold tracking-wide uppercase select-none">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className={cn("w-3.5 h-3.5", completedToday ? "text-amber-500" : "text-foreground/30")} /> 
                                Daily Goal
                            </span>
                            <span>{isActive ? (milestoneProgress || 7) : 0}/7 milestone</span>
                        </div>
                        <div className="h-2.5 w-full bg-muted/60 dark:bg-black/20 rounded-full overflow-hidden p-[2px] shadow-inner select-none pointer-events-none">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }} // satisfying bouncy ease
                                className={cn(
                                    "h-full rounded-full relative",
                                    isActive && completedToday ? "bg-gradient-to-r from-amber-400 to-amber-500" : 
                                    isActive ? "bg-gradient-to-r from-orange-400 to-red-500" : "bg-muted-foreground/30 text-white"
                                )}
                            >
                                {/* Shimmer overlay on active bar */}
                                {isActive && (
                                    <motion.div 
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>

                    {/* Button */}
                    <motion.button
                        onClick={handleCompleteToday}
                        disabled={isCompleting || completedToday}
                        whileHover={!completedToday ? { scale: 1.02, y: -1 } : {}}
                        whileTap={!completedToday ? { scale: 0.97, y: 0 } : {}}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 md:py-3 rounded-xl text-xs md:text-[13px] font-bold uppercase tracking-wide transition-all duration-300 relative overflow-hidden select-none",
                            completedToday
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 cursor-default"
                                : "bg-foreground text-background hover:bg-foreground/90 shadow-lg shadow-foreground/10 hover:shadow-orange-500/20 border border-transparent"
                        )}
                    >
                        {!completedToday && (
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                        )}
                        
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isCompleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin opacity-80" />
                                    Saving…
                                </>
                            ) : completedToday ? (
                                <>
                                    <Check className="w-4.5 h-4.5" strokeWidth={3} />
                                    Completed Today
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 fill-current opacity-90" />
                                    Complete Today
                                </>
                            )}
                        </span>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
