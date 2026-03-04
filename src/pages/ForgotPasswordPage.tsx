import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import mindupLogo from "@/assets/mindup-logo.png";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.includes("@")) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background elements */}
            <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-20 -left-20 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <Link to="/login" className="flex items-center justify-center gap-3 mb-10 hover:opacity-80 transition-opacity">
                    <img src={mindupLogo} alt="MindUp" className="w-10 h-10 rounded-xl shadow-sm" />
                    <span className="text-xl font-display font-bold text-foreground">MindUp</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="bg-card border border-border/60 rounded-3xl p-8 shadow-xl"
                >
                    {!success ? (
                        <>
                            <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive mb-6 mx-auto">
                                <RefreshCw className="w-6 h-6" />
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-display font-bold text-foreground mb-2">Forgot Password</h2>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    No worries! Enter the email associated with your account and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider mb-1.5 block">
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
                                            className="w-full pl-10 pr-4 py-3 bg-muted/40 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all focus:bg-card"
                                        />
                                    </div>
                                </div>

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

                                <button
                                    type="submit"
                                    disabled={loading || !email}
                                    className="w-full mt-2 flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center text-success mx-auto mb-6">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-foreground mb-3">Check your inbox</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                                We've sent password reset instructions to <span className="font-semibold text-foreground">{email}</span>. Click the link inside to create a new password.
                            </p>
                            <Link to="/login" className="px-8 py-3 bg-muted hover:bg-muted/80 text-foreground font-bold rounded-xl transition-colors inline-block text-sm shadow-sm">
                                Back to Sign in
                            </Link>
                        </motion.div>
                    )}

                    {!success && (
                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            Remember your password?{" "}
                            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
