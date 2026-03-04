import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppLayout from "@/components/AppLayout";
import mindupLogo from "@/assets/mindup-logo.png";

const LogoutPage = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800)); // brief delay for UX
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-[76vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-card border border-border/50 rounded-3xl p-10 w-full max-w-md relative overflow-hidden shadow-lg"
                >
                    {/* Top accent bar */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-7">
                        <img src={mindupLogo} alt="MindUp" className="w-14 h-14 rounded-2xl shadow mb-3" />
                        <p className="text-sm text-muted-foreground">
                            Signed in as <span className="font-semibold text-foreground">{user?.email}</span>
                        </p>
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
                        <LogOut className="w-8 h-8 text-destructive" />
                    </div>

                    <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">Sign out?</h2>
                    <p className="text-sm text-muted-foreground text-center mb-8 leading-relaxed">
                        Are you sure you want to sign out of MindUp?<br />
                        Your progress and streak are safely saved.
                    </p>

                    {/* Safety note */}
                    <div className="flex items-center gap-2.5 bg-success/8 border border-success/20 rounded-xl px-4 py-3 mb-7">
                        <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
                        <p className="text-xs text-success font-medium">Your 7-day streak and 2,450 XP are saved to your account</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-destructive text-destructive-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <><LogOut className="w-4 h-4" /> Yes, Sign Out</>
                            )}
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Go back
                        </button>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
};

export default LogoutPage;
