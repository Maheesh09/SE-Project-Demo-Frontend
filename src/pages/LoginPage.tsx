import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, BookOpen, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import mindupLogo from "@/assets/mindup-logo.png";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const ok = await login(email.trim(), password);
        setLoading(false);
        if (ok) {
            navigate("/");
        } else {
            setError("Invalid email or password. Try user@mindup.lk / mindup123");
        }
    };

    return (
        <div className="min-h-screen bg-background flex">

            {/* Left — branding panel */}
            <div className="hidden lg:flex flex-col justify-between w-[44%] gradient-sidebar p-12">
                <div className="flex items-center gap-3">
                    <img src={mindupLogo} alt="MindUp" className="w-10 h-10 rounded-xl shadow" />
                    <span className="text-xl font-display font-bold text-sidebar-accent-foreground">MindUp</span>
                </div>

                <div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h1 className="text-4xl font-display font-black text-sidebar-accent-foreground leading-tight mb-4">
                            Learn smarter.<br />Rise higher.
                        </h1>
                        <p className="text-sidebar-foreground text-base leading-relaxed max-w-sm">
                            MindUp helps Sri Lankan students master every subject through interactive quizzes, AI tutoring, and real-time progress tracking.
                        </p>
                    </motion.div>

                    {/* Feature pills */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-wrap gap-2 mt-8">
                        {["Smart Quizzes", "AI Tutor", "District Rankings", "Progress Analytics", "Daily Streaks"].map((f) => (
                            <span key={f} className="px-3 py-1.5 bg-sidebar-accent/60 text-sidebar-accent-foreground text-xs font-semibold rounded-full border border-sidebar-border/30">
                                {f}
                            </span>
                        ))}
                    </motion.div>
                </div>

                {/* Stats row */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="grid grid-cols-3 gap-4">
                    {[
                        { value: "12,000+", label: "Students" },
                        { value: "9", label: "Provinces" },
                        { value: "98%", label: "Satisfaction" },
                    ].map((s) => (
                        <div key={s.label} className="bg-sidebar-accent/40 rounded-xl p-3 text-center border border-sidebar-border/20">
                            <p className="text-xl font-display font-black text-sidebar-accent-foreground">{s.value}</p>
                            <p className="text-xs text-sidebar-foreground">{s.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Right — login form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <img src={mindupLogo} alt="MindUp" className="w-8 h-8 rounded-xl" />
                        <span className="text-lg font-display font-bold text-foreground">MindUp</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-display font-bold text-foreground mb-1">Welcome back</h2>
                        <p className="text-sm text-muted-foreground">Sign in to continue your learning journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="user@mindup.lk"
                                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-11 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1.5">
                                <Link to="/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="flex items-start gap-2.5 p-3 bg-destructive/10 border border-destructive/20 rounded-xl"
                                >
                                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-destructive font-medium leading-relaxed">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                        {/* Demo hint */}
                        <div className="border border-border/50 rounded-xl p-3 bg-muted/30">
                            <p className="text-[11px] text-muted-foreground text-center">
                                <span className="font-bold text-foreground">Demo credentials — </span>
                                Email: <span className="font-mono text-primary">user@mindup.lk</span> &nbsp;·&nbsp;
                                Password: <span className="font-mono text-primary">mindup123</span>
                            </p>
                        </div>
                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-8">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-primary font-semibold hover:underline">Sign up for free</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
