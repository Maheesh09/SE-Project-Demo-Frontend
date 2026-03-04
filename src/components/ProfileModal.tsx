import { useState } from "react";
import { X, Camera, MapPin, Globe, GraduationCap, User, UserSquare2, Mail, CheckCircle2, Upload, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

// Assuming initial values for demo
const defaultData = {
    username: "mindupstudent",
    fullName: "Student User",
    email: "student@mindup.edu",
    grade: "Grade 9",
    province: "Western",
    district: "Colombo"
};

const ProfileModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [data, setData] = useState(defaultData);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const availableDistricts = data.province ? districtData[data.province] : [];

    const update = (key: keyof typeof defaultData, value: string) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                onClose();
            }, 1000);
        }, 800);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Background Blur Overlay - Professional Green/Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#0a1a0a]/60 backdrop-blur-[20px]"
                        onClick={onClose}
                    />

                    {/* Floating Decorative Elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-2xl bg-card border border-white/10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
                    >
                        {/* Header Section */}
                        <div className="px-8 py-6 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-display font-black text-foreground tracking-tight">Edit Profile</h2>
                                <p className="text-sm text-muted-foreground mt-0.5">Customise your public identity on MindUp</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form Content */}
                        <div className="p-8 overflow-y-auto max-h-[75vh] flex flex-col gap-8 custom-scrollbar">

                            {/* Profile Image Section */}
                            <div className="flex flex-col md:flex-row items-center gap-8 bg-muted/20 p-6 rounded-2xl border border-border/50">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-card shadow-xl gradient-primary flex items-center justify-center text-4xl font-black text-primary-foreground">
                                        {profileImage ? (
                                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            data.fullName[0]
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                                        <Camera className="w-5 h-5" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-bold text-lg text-foreground mb-1">Upload Photo</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Make sure it's a clear photo of yourself so friends can recognise you.</p>
                                    <div className="flex items-center justify-center md:justify-start gap-3">
                                        <label className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-2">
                                            <Upload className="w-3.5 h-3.5" /> Upload Image
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                        {profileImage && (
                                            <button
                                                onClick={() => setProfileImage(null)}
                                                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive font-bold text-xs hover:bg-destructive/20 transition-all flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Username (Auto-filled) */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Username</label>
                                    <div className="relative">
                                        <UserSquare2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                        <input
                                            type="text"
                                            value={data.username}
                                            onChange={e => update("username", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border/60 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
                                            placeholder="Choose a unique username"
                                        />
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                        <input
                                            type="text"
                                            value={data.fullName}
                                            onChange={e => update("fullName", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border/60 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
                                            placeholder="Your display name"
                                        />
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => update("email", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-background border border-border/60 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-inner"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Selection Row */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Grade</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                                        <select
                                            value={data.grade}
                                            onChange={e => update("grade", e.target.value)}
                                            className="w-full pl-11 pr-10 py-3 bg-background border border-border/60 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer shadow-inner"
                                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
                                        >
                                            {[6, 7, 8, 9, 10, 11].map(g => (
                                                <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Province</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-xp" />
                                        <select
                                            value={data.province}
                                            onChange={e => { update("province", e.target.value); update("district", ""); }}
                                            className="w-full pl-11 pr-10 py-3 bg-background border border-border/60 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer shadow-inner"
                                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
                                        >
                                            {provinces.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">District</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-xp" />
                                        <select
                                            value={data.district}
                                            onChange={e => update("district", e.target.value)}
                                            disabled={!data.province}
                                            className="w-full pl-11 pr-10 py-3 bg-background border border-border/60 rounded-xl text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer disabled:opacity-50 shadow-inner"
                                            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem top 50%", backgroundSize: "0.65rem auto" }}
                                        >
                                            {availableDistricts.map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Footer */}
                        <div className="px-8 py-5 border-t border-border/40 bg-muted/30 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
                            >
                                Cancel Changes
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || saved}
                                className="flex items-center justify-center min-w-[160px] gradient-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                ) : saved ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-white">
                                        <CheckCircle2 className="w-5 h-5" /> Saved Successfully!
                                    </motion.div>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
