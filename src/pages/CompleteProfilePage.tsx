import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle, MapPin, UserSquare2, Mail, User, GraduationCap, Camera, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import mindupLogo from "@/assets/mindup-logo.png";
import { cn } from "@/lib/utils";

const provinces = [
    "Central", "Eastern", "North Central", "Northern", "North Western", "Sabaragamuwa", "Southern", "Uva", "Western"
];

const districtData: Record<string, string[]> = {
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "North Western": ["Kurunegala", "Puttalam"],
    "Sabaragamuwa": ["Kegalle", "Ratnapura"],
    "Southern": ["Galle", "Hambantota", "Matara"],
    "Uva": ["Badulla", "Moneragala"],
    "Western": ["Colombo", "Gampaha", "Kalutara"]
};

const CompleteProfilePage = () => {
    const navigate = useNavigate();
    const { completeProfile } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [grade, setGrade] = useState("");
    const [province, setProvince] = useState("");
    const [district, setDistrict] = useState("");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const availableDistricts = province ? districtData[province] : [];

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !fullName || !grade || !province || !district) {
            setError("Please fill out all required fields.");
            return;
        }

        setError("");
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            completeProfile({ username, email, fullName, grade, province, district, avatar });
            navigate("/");
        }, 1000);
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
                            You're almost<br />ready to go!
                        </h1>
                        <p className="text-sidebar-foreground text-base leading-relaxed max-w-sm">
                            Complete your student profile to personalise your dashboard, track your goals, and join correct leaderboards.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-wrap gap-2 mt-8">
                        {["Personalized Dashboard", "District Leaderboards", "Tailored Goals"].map((f) => (
                            <span key={f} className="px-3 py-1.5 bg-sidebar-accent/60 text-sidebar-accent-foreground text-xs font-semibold rounded-full border border-sidebar-border/30">
                                {f}
                            </span>
                        ))}
                    </motion.div>
                </div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 blur-[100px] rounded-full" />
            </div>

            {/* Right — form */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="w-full max-w-lg py-8 my-auto"
                >
                    <div className="flex items-center gap-2 mb-8 lg:hidden">
                        <img src={mindupLogo} alt="MindUp" className="w-8 h-8 rounded-xl" />
                        <span className="text-lg font-display font-bold text-foreground">MindUp</span>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-display font-bold text-foreground mb-1">Complete Student Profile</h2>
                        <p className="text-sm text-muted-foreground">Setup your final details to access the dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex justify-center mb-2">
                            <label className="relative group cursor-pointer inline-block">
                                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-sm overflow-hidden border-4 border-background">
                                    {avatar ? (
                                        <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-10 h-10 opacity-50" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
                                    <Camera className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                    <UserSquare2 className="w-4 h-4 text-primary" /> Username
                                </label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Enter username" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-primary" /> Full Name
                                </label>
                                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Your full name" />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-primary" /> Email
                            </label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all" placeholder="Enter email address" />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                <GraduationCap className="w-4 h-4 text-accent" /> Grade
                            </label>
                            <select value={grade} onChange={e => setGrade(e.target.value)} className={cn("w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none", !grade && "text-muted-foreground")} style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}>
                                <option value="" disabled>Select your grade</option>
                                {[6, 7, 8, 9, 10, 11].map(g => (
                                    <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                    <Globe className="w-4 h-4 text-xp" /> Province
                                </label>
                                <select value={province} onChange={e => { setProvince(e.target.value); setDistrict(""); }} className={cn("w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none", !province && "text-muted-foreground")} style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}>
                                    <option value="" disabled>Province</option>
                                    {provinces.map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-foreground/80 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-xp" /> District
                                </label>
                                <select value={district} onChange={e => setDistrict(e.target.value)} disabled={!province} className={cn("w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none disabled:opacity-50", !district && "text-muted-foreground")} style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}>
                                    <option value="" disabled>District</option>
                                    {availableDistricts.map(d => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
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
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 gradient-primary text-primary-foreground py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <>Access Dashboard <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CompleteProfilePage;
