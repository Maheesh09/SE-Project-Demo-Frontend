import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, AlertCircle, MapPin, UserSquare2,
    Mail, User, GraduationCap, Camera, Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import mindupLogo from "@/assets/mindup-logo.png";

const provinces = [
    "Central", "Eastern", "North Central", "Northern",
    "North Western", "Sabaragamuwa", "Southern", "Uva", "Western"
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

const dropdownArrow = `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`;

const dropdownStyle = {
    backgroundImage: dropdownArrow,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 1rem top 50%",
    backgroundSize: "0.6rem auto",
};

const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px 12px 44px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.55)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    fontSize: "14px",
    color: "#444",
    outline: "none",
    transition: "all 0.2s ease",
};

const selectStyle: React.CSSProperties = {
    ...fieldStyle,
    paddingLeft: "44px",
    appearance: "none" as const,
    ...dropdownStyle,
    backgroundImage: `${dropdownArrow}, none`,
};

const labelStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "#5a7a58",
    marginBottom: "6px",
};

const CompleteProfilePage = () => {
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();

    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [grade, setGrade] = useState((user?.unsafeMetadata?.grade as string) || "");
    const [province, setProvince] = useState((user?.unsafeMetadata?.province as string) || "");
    const [district, setDistrict] = useState((user?.unsafeMetadata?.district as string) || "");
    const [avatar, setAvatar] = useState<string | null>(user?.imageUrl || null);
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

        try {
            if (user && isLoaded) {
                // Determine first and last name from full name
                const nameParts = fullName.trim().split(" ");
                const firstName = nameParts[0];
                const lastName = nameParts.slice(1).join(" ");

                await user.update({
                    firstName: firstName || user.firstName,
                    lastName: lastName || user.lastName,
                    unsafeMetadata: {
                        ...user.unsafeMetadata,
                        grade,
                        province,
                        district,
                    },
                });
            }
            navigate("/dashboard");
        } catch (err: any) {
            setError("Failed to complete profile. " + (err.message || ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #b8ddd0 0%, #d4ecb0 20%, #e8f0c0 40%, #f0e0d8 60%, #e0d0f0 80%, #c8e8e0 100%)"
            }}
        >
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: "blur(60px)", transform: "scale(1.1)" }}>
                <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "700px", height: "700px", borderRadius: "50%", background: "#56c8b0", opacity: 0.85 }} />
                <div style={{ position: "absolute", top: "-40px", left: "28%", width: "520px", height: "520px", borderRadius: "50%", background: "#a8e060", opacity: 0.75 }} />
                <div style={{ position: "absolute", top: "5%", right: "-80px", width: "600px", height: "600px", borderRadius: "50%", background: "#c8b0e8", opacity: 0.80 }} />
                <div style={{ position: "absolute", bottom: "-60px", right: "-40px", width: "550px", height: "550px", borderRadius: "50%", background: "#f0c898", opacity: 0.85 }} />
                <div style={{ position: "absolute", bottom: "-60px", left: "0%", width: "600px", height: "600px", borderRadius: "50%", background: "#80c878", opacity: 0.75 }} />
                <div style={{ position: "absolute", top: "35%", left: "25%", width: "500px", height: "500px", borderRadius: "50%", background: "#f0e880", opacity: 0.65 }} />
                <div style={{ position: "absolute", top: "20%", left: "45%", width: "400px", height: "400px", borderRadius: "50%", background: "#78d8c0", opacity: 0.60 }} />
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(255,255,255,0.15)" }} />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full mx-4 my-8"
                style={{ maxWidth: "520px" }}
            >
                <div className="flex justify-center mb-[-38px] relative z-20">
                    <label className="relative group cursor-pointer inline-block">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shadow-xl border-4 border-white"
                            style={{ background: "linear-gradient(135deg, #90bf60 0%, #5a9030 100%)" }}
                        >
                            {avatar ? (
                                <img src={avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-9 h-9 text-white opacity-90" />
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/35 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <div
                            className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow"
                            style={{ background: "#6aaa3a" }}
                        >
                            <Camera className="w-3.5 h-3.5 text-white" />
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                </div>

                <div
                    className="rounded-3xl px-8 pb-8 pt-14 shadow-2xl"
                    style={{
                        background: "rgba(255, 255, 255, 0.38)",
                        backdropFilter: "blur(28px)",
                        WebkitBackdropFilter: "blur(28px)",
                        border: "1px solid rgba(255,255,255,0.65)",
                        boxShadow: "0 8px 48px rgba(60,80,60,0.12), 0 2px 12px rgba(255,255,255,0.4) inset",
                    }}
                >
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <img src={mindupLogo} alt="MindUp" className="w-7 h-7 rounded-lg shadow" />
                            <span className="font-bold text-base" style={{ color: "#3d5c3a" }}>MindUp</span>
                        </div>
                        <h2 className="text-2xl font-black mb-1" style={{ color: "#2e3e2a" }}>Complete Student Profile</h2>
                        <p className="text-sm" style={{ color: "#7a9070" }}>Setup your final details to access the dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label style={labelStyle}>
                                    <UserSquare2 size={13} /> Username
                                </label>
                                <div className="relative">
                                    <UserSquare2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        style={fieldStyle}
                                        onFocus={e => { e.currentTarget.style.border = "1px solid rgba(86,160,211,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.75)"; }}
                                        onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.55)"; }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    <User size={13} /> Full Name
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Your full name"
                                        style={fieldStyle}
                                        onFocus={e => { e.currentTarget.style.border = "1px solid rgba(86,160,211,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.75)"; }}
                                        onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.55)"; }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                <Mail size={13} /> Email
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter email address"
                                    style={{ ...fieldStyle, opacity: 0.7, cursor: "not-allowed" }}
                                    onFocus={e => { e.currentTarget.style.border = "1px solid rgba(86,160,211,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.75)"; }}
                                    onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.55)"; }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                <GraduationCap size={13} /> Grade
                            </label>
                            <div className="relative">
                                <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select
                                    value={grade}
                                    onChange={e => setGrade(e.target.value)}
                                    style={{ ...selectStyle, color: grade ? "#444" : "#aaa" }}
                                    onFocus={e => { e.currentTarget.style.border = "1px solid rgba(86,160,211,0.7)"; e.currentTarget.style.background = `rgba(255,255,255,0.75)`; }}
                                    onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.6)"; e.currentTarget.style.background = `rgba(255,255,255,0.55)`; }}
                                >
                                    <option value="" disabled>Select your grade</option>
                                    {[6, 7, 8, 9, 10, 11].map(g => (
                                        <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label style={labelStyle}>
                                    <Globe size={13} /> Province
                                </label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        value={province}
                                        onChange={e => { setProvince(e.target.value); setDistrict(""); }}
                                        style={{ ...selectStyle, color: province ? "#444" : "#aaa" }}
                                        onFocus={e => { e.currentTarget.style.border = "1px solid rgba(86,160,211,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.75)"; }}
                                        onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.55)"; }}
                                    >
                                        <option value="" disabled>Province</option>
                                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>
                                    <MapPin size={13} /> District
                                </label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        value={district}
                                        onChange={e => setDistrict(e.target.value)}
                                        disabled={!province}
                                        style={{ ...selectStyle, color: district ? "#444" : "#aaa", opacity: !province ? 0.5 : 1, cursor: !province ? "not-allowed" : "pointer" }}
                                        onFocus={e => { if (province) { e.currentTarget.style.border = "1px solid rgba(86,160,211,0.7)"; e.currentTarget.style.background = "rgba(255,255,255,0.75)"; } }}
                                        onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.55)"; }}
                                    >
                                        <option value="" disabled>District</option>
                                        {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                    className="flex items-start gap-2 p-3 rounded-xl"
                                    style={{ background: "rgba(220,60,60,0.1)", border: "1px solid rgba(220,60,60,0.2)" }}
                                >
                                    <AlertCircle size={15} style={{ color: "#c0392b", flexShrink: 0, marginTop: "1px" }} />
                                    <p style={{ fontSize: "12px", color: "#c0392b", fontWeight: 500, lineHeight: 1.4 }}>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.97 }}
                            className="w-full flex items-center justify-center gap-2 mt-1 font-bold text-sm rounded-2xl py-3.5 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{
                                background: "linear-gradient(135deg, #8fcc55 0%, #5a9030 100%)",
                                boxShadow: "0 4px 20px rgba(80,150,40,0.40)",
                                letterSpacing: "0.02em",
                            }}
                        >
                            {loading ? (
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                                <>Access Dashboard <ArrowRight size={16} /></>
                            )}
                        </motion.button>

                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CompleteProfilePage;
