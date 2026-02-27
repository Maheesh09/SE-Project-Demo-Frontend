import { useState, useEffect, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Rocket, Mail, ArrowRight, Sparkles } from "lucide-react";

/* ───────────────────────────────────────────────
   🎯 CUSTOMIZE YOUR LAUNCH DATE HERE
   Format: "YYYY-MM-DDTHH:MM:SS" (local time)
   ─────────────────────────────────────────────── */
const LAUNCH_DATE = new Date("2026-05-01T12:00:00");

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const calculateTimeLeft = (): TimeLeft => {
    const difference = LAUNCH_DATE.getTime() - new Date().getTime();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
};

/* ── Flip Card Component ── */
const FlipCard = ({ value, label }: { value: number; label: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-1.5 sm:gap-2"
    >
        <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-[#A3B18A]/30 to-[#F59E0B]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative w-[60px] h-[70px] sm:w-[80px] sm:h-[92px] md:w-[110px] md:h-[120px] rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-xl bg-amber-50/10 border border-amber-100/20 shadow-xl flex items-center justify-center">
                {/* Top shine */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />

                {/* Divider line */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />

                <span className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tabular-nums drop-shadow-lg">
                    {String(value).padStart(2, "0")}
                </span>
            </div>
        </div>

        <span className="text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/60">
            {label}
        </span>
    </motion.div>
);

/* ── Floating Particle ── */
const FloatingParticle = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
    <motion.div
        className="absolute rounded-full bg-amber-100/10"
        style={{ width: size, height: size, left: x, top: y }}
        animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
        }}
        transition={{
            duration: 5 + delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
        }}
    />
);

/* ── Main Countdown Page ── */
const CountdownPage = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        setIsSubmitting(true);

        try {
            if (!supabase) {
                toast.error("Supabase is not configured. Please add credentials to .env");
                return;
            }

            const { error } = await supabase
                .from("waitlist_emails")
                .insert([{ email: email.trim() }]);

            if (error) {
                if (error.code === "23505") {
                    toast.info("You're already on the waitlist! We'll notify you soon 🎉");
                } else {
                    throw error;
                }
            } else {
                toast.success("You're on the list! We'll notify you when we launch 🚀");
                setIsSubmitted(true);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLaunched = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* ── Background ── */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B2318] via-[#1E1B12] to-[#261E14]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(210,190,150,0.18)_0%,_transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(172,214,99,0.12)_0%,_transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(230,210,170,0.08)_0%,_transparent_50%)]" />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Floating particles */}
            <FloatingParticle delay={0} size={6} x="10%" y="20%" />
            <FloatingParticle delay={1.5} size={4} x="85%" y="15%" />
            <FloatingParticle delay={0.8} size={8} x="70%" y="70%" />
            <FloatingParticle delay={2} size={5} x="25%" y="80%" />
            <FloatingParticle delay={1.2} size={7} x="50%" y="10%" />
            <FloatingParticle delay={0.5} size={3} x="90%" y="55%" />
            <FloatingParticle delay={1.8} size={6} x="15%" y="55%" />

            {/* ── Content ── */}
            <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center text-center">
                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                        <img src="/logo.png" alt="MindUp Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Mind<span className="text-[#acd663]">Up</span>
                        </h2>
                    </div>


                </motion.div>

                {/* Headline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-8 sm:mb-10"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white leading-tight mb-3 sm:mb-4 px-2">
                        {isLaunched ? (
                            <>We're <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3B18A] to-[#F59E0B]">Live!</span></>
                        ) : (
                            <>Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#acd663] to-[#acd663]">Amazing</span> is Coming</>
                        )}
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-lg mx-auto leading-relaxed px-2">
                        {isLaunched
                            ? "MindUp is now live. Start your smart learning journey today!"
                            : "We're building a smarter way to learn. Be the first to experience MindUp when we launch."}
                    </p>
                </motion.div>

                {/* Countdown */}
                {!isLaunched && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-8 sm:mb-12"
                    >
                        <FlipCard value={timeLeft.days} label="Days" />
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white/20 mt-[-20px] sm:mt-[-28px] hidden sm:inline">:</span>
                        <FlipCard value={timeLeft.hours} label="Hours" />
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white/20 mt-[-20px] sm:mt-[-28px] hidden sm:inline">:</span>
                        <FlipCard value={timeLeft.minutes} label="Minutes" />
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white/20 mt-[-20px] sm:mt-[-28px] hidden sm:inline">:</span>
                        <FlipCard value={timeLeft.seconds} label="Seconds" />
                    </motion.div>
                )}

                {/* Email Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="w-full max-w-md"
                >
                    {isSubmitted ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-full bg-[#A3B18A]/20 flex items-center justify-center">
                                <Rocket className="w-6 h-6 text-[#A3B18A]" />
                            </div>
                            <p className="text-white font-semibold">You're on the list!</p>
                            <p className="text-sm text-white/50">We'll send you an email when MindUp launches.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2 p-3 sm:p-1.5 rounded-2xl sm:rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/20 focus-within:border-[#F59E0B]/40 transition-colors duration-300">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="pl-2 sm:pl-4">
                                        <Mail className="w-5 h-5 text-white/30" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm sm:text-base py-2 sm:py-2.5 px-1 disabled:opacity-50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#809c4f] to-[#809c4f] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#F59E0B]/20 hover:shadow-[#F59E0B]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Notify Me
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="mt-4 text-xs text-white/30">
                        No spam, ever. We'll only email you when we launch.
                    </p>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-10 sm:mt-16 text-xs text-white/20"
                >
                    © {new Date().getFullYear()} MindUp. All rights reserved.
                </motion.div>
            </div>
        </div>
    );
};

export default CountdownPage;
