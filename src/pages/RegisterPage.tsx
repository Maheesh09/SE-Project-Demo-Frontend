import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import mindupLogo from "@/assets/mindup-logo.png";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate("/verify-email");
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left — branding panel */}
            <div className="hidden lg:flex flex-col justify-between w-[44%] gradient-sidebar p-12 relative overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                    <img src={mindupLogo} alt="MindUp" className="w-10 h-10 rounded-xl shadow" />
                    <span className="text-xl font-display font-bold text-sidebar-accent-foreground">MindUp</span>
                </div>

                <div className="relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h1 className="text-4xl font-display font-black text-sidebar-accent-foreground leading-tight mb-4">
                            Start your learning<br />journey today.
                        </h1>
                        <p className="text-sidebar-foreground text-base leading-relaxed max-w-sm">
                            Join thousands of Sri Lankan students mastering their subjects with personalized AI tutoring.
                        </p>
                    </motion.div>

                    {/* Feature pills */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-wrap gap-2 mt-8">
                        {["Free to Start", "Gamified Learning", "Premium Subjects"].map((f) => (
                            <span key={f} className="px-3 py-1.5 bg-sidebar-accent/60 text-sidebar-accent-foreground text-xs font-semibold rounded-full border border-sidebar-border/30">
                                {f}
                            </span>
                        ))}
                    </motion.div>
                </div>
                {/* Background visual flair */}
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/20 blur-[100px] rounded-full" />
                <div className="absolute top-1/4 -left-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full" />
            </div>

            {/* Right — register form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="w-full max-w-md py-8"
                >
                    {/* Mobile logo */}
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <img src={mindupLogo} alt="MindUp" className="w-8 h-8 rounded-xl" />
                        <span className="text-lg font-display font-bold text-foreground">MindUp</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-display font-bold text-foreground mb-1">Create an account</h2>
                        <p className="text-sm text-muted-foreground">Sign up to access your personalized dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        <div className="grid grid-cols-2 gap-4">
                            {/* First Name */}
                            <div>
                                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        placeholder="Kasun"
                                        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            {/* Last Name */}
                            <div>
                                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-1.5 block">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        placeholder="Perera"
                                        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

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
                                    placeholder="kasun@mindup.lk"
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
                                    placeholder="Create a strong password"
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
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
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
                            className="w-full flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <>Sign Up <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>

                    </form>

                    <p className="text-xs text-muted-foreground text-center mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
