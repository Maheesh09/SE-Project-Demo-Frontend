import { motion } from "framer-motion";
import { LogOut, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import BlurText from "@/components/BlurText";
import AppLayout from "@/components/AppLayout";

const LogoutPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app, clear auth tokens here
        // Redirect to landing page/login
        navigate("/");
    };

    return (
        <AppLayout>
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="glass rounded-3xl p-10 w-full relative overflow-hidden flex flex-col items-center"
                >
                    <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary" />

                    <div className="w-20 h-20 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6 shadow-glow">
                        <LogOut className="w-10 h-10 ml-1" />
                    </div>

                    <BlurText
                        text="Logging out?"
                        delay={50}
                        animateBy="words"
                        direction="top"
                        className="text-3xl font-display font-bold text-foreground mb-3"
                    />

                    <p className="text-muted-foreground mb-8">
                        Are you sure you want to log out of MindUp? Your progress is saved.
                    </p>

                    <div className="w-full space-y-3">
                        <button
                            onClick={handleLogout}
                            className="w-full flex justify-center items-center gap-2 py-3.5 bg-destructive hover:opacity-90 transition-opacity text-destructive-foreground font-bold rounded-xl shadow-sm"
                        >
                            Sign Out
                        </button>

                        <Link
                            to="/"
                            className="w-full flex justify-center items-center gap-2 py-3.5 bg-muted hover:bg-muted/80 text-foreground transition-colors font-semibold rounded-xl"
                        >
                            <ArrowLeft className="w-4 h-4" /> Cancel, stay logged in
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
};

export default LogoutPage;
