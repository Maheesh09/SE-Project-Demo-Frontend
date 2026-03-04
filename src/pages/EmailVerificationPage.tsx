import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle, Mail, KeyRound } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import mindupLogo from "@/assets/mindup-logo.png";

const EmailVerificationPage = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent pasting multiple chars into one box initially handled simple
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus next
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const verificationCode = code.join("");
        if (verificationCode.length !== 6) {
            setError("Please enter all 6 digits.");
            return;
        }

        setError("");
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            navigate("/complete-profile");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background elements */}
            <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-1/2 -right-20 w-[300px] h-[300px] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <Link to="/login" className="flex items-center justify-center gap-3 mb-10 hover:opacity-80 transition-opacity">
                    <img src={mindupLogo} alt="MindUp" className="w-10 h-10 rounded-xl shadow-sm" />
                    <span className="text-xl font-display font-bold text-foreground">MindUp</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="bg-card border border-border/60 rounded-3xl p-8 shadow-xl"
                >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 mx-auto">
                        <Mail className="w-6 h-6" />
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Check your email</h2>
                        <p className="text-sm text-muted-foreground">
                            We've sent a 6-digit verification code to <span className="font-semibold text-foreground">kasun@mindup.lk</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex justify-between gap-2">
                            {code.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`code-${idx}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    className="w-12 h-14 text-center text-xl font-bold bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all focus:bg-card"
                                />
                            ))}
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
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                "Verify Email"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-xs text-muted-foreground">
                        <p className="mb-2">Didn't receive the email?</p>
                        <button className="text-primary font-semibold hover:underline">Click to resend code</button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
