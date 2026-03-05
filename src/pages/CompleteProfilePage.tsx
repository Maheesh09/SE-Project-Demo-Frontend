import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, AlertCircle, MapPin, UserSquare2,
    Mail, User, GraduationCap, Camera, Globe, BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import mindupLogo from "@/assets/mindup-logo.png";
import { api, type Province, type District, type Grade, type Subject } from "@/lib/api";

const AVATAR_KEYS = ["avatar_1", "avatar_2", "avatar_3", "avatar_4"];

// ─── Styles ───────────────────────────────────────────────────────────────────
const dropdownArrow = `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`;

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
    appearance: "none" as const,
    backgroundImage: `${dropdownArrow}, none`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem top 50%",
    backgroundSize: "0.6rem auto",
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

// ─── Component ────────────────────────────────────────────────────────────────
const CompleteProfilePage = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();

    const [username, setUsername] = useState(user?.username || "");
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [avatarKey, setAvatarKey] = useState(AVATAR_KEYS[0]);
    const [gradeId, setGradeId] = useState<number | "">("");
    const [provinceId, setProvinceId] = useState<number | "">("");
    const [districtId, setDistrictId] = useState<number | "">("");
    const [subjectIds, setSubjectIds] = useState<number[]>([]);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.imageUrl || null);

    const [grades, setGrades] = useState<Grade[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [metaLoading, setMetaLoading] = useState(false);

    const email = user?.primaryEmailAddress?.emailAddress || "";

    // Load provinces and grades on mount from database
    useEffect(() => {
        (async () => {
            setMetaLoading(true);
            try {
                const [g, p] = await Promise.all([
                    api.getGrades(),
                    api.getProvinces(),
                ]);
                setGrades(g);
                setProvinces(p);
            } catch (e) {
                console.error("Failed to load meta data:", e);
                setError("Failed to load initial data. Please try again.");
            } finally {
                setMetaLoading(false);
            }
        })();
    }, []);

    // Load districts when province changes from database
    useEffect(() => {
        if (!provinceId) { setDistricts([]); setDistrictId(""); return; }
        (async () => {
            try {
                const d = await api.getDistricts(Number(provinceId));
                setDistricts(d);
                setDistrictId("");
            } catch (e) {
                console.error("Failed to load districts:", e);
            }
        })();
    }, [provinceId]);

    // Load subjects when grade changes from database
    useEffect(() => {
        if (!gradeId) { setSubjects([]); setSubjectIds([]); return; }
        api.getAvailableSubjects(Number(gradeId))
            .then(setSubjects)
            .catch(() => setSubjects([]));
    }, [gradeId]);

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const toggleSubject = (id: number) => {
        setSubjectIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !fullName.trim() || !gradeId || !provinceId || !districtId) {
            setError("Please fill out all required fields.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated.");
            await api.completOnboarding(
                token,
                {
                    full_name: fullName.trim(),
                    username: username.trim(),
                    grade_id: Number(gradeId),
                    province_id: Number(provinceId),
                    district_id: Number(districtId),
                    avatar_key: avatarKey,
                    subject_ids: subjectIds,
                },
                user?.id,
                email
            );
            navigate("/dashboard");
        } catch (err: any) {
            setError("Failed to save profile: " + (err.message || "Unknown error"));
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
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ filter: "blur(60px)", transform: "scale(1.1)" }}>
                <div style={{ position: "absolute", top: "-80px", left: "-80px", width: "700px", height: "700px", borderRadius: "50%", background: "#56c8b0", opacity: 0.85 }} />
                <div style={{ position: "absolute", top: "-40px", left: "28%", width: "520px", height: "520px", borderRadius: "50%", background: "#a8e060", opacity: 0.75 }} />
                <div style={{ position: "absolute", top: "5%", right: "-80px", width: "600px", height: "600px", borderRadius: "50%", background: "#c8b0e8", opacity: 0.80 }} />
                <div style={{ position: "absolute", bottom: "-60px", right: "-40px", width: "550px", height: "550px", borderRadius: "50%", background: "#f0c898", opacity: 0.85 }} />
                <div style={{ position: "absolute", bottom: "-60px", left: "0%", width: "600px", height: "600px", borderRadius: "50%", background: "#80c878", opacity: 0.75 }} />
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(255,255,255,0.15)" }} />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full mx-4 my-8"
                style={{ maxWidth: "560px" }}
            >
                {/* Avatar circle */}
                <div className="flex justify-center mb-[-38px] relative z-20">
                    <label className="relative group cursor-pointer inline-block">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden shadow-xl border-4 border-white"
                            style={{ background: "linear-gradient(135deg, #90bf60 0%, #5a9030 100%)" }}
                        >
                            {avatarPreview
                                ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                : <User className="w-9 h-9 text-white opacity-90" />
                            }
                        </div>
                        <div className="absolute inset-0 bg-black/35 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow" style={{ background: "#6aaa3a" }}>
                            <Camera className="w-3.5 h-3.5 text-white" />
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                </div>

                <div
                    className="rounded-3xl px-8 pb-8 pt-14 shadow-2xl"
                    style={{
                        background: "rgba(255,255,255,0.38)",
                        backdropFilter: "blur(28px)",
                        WebkitBackdropFilter: "blur(28px)",
                        border: "1px solid rgba(255,255,255,0.65)",
                        boxShadow: "0 8px 48px rgba(60,80,60,0.12), 0 2px 12px rgba(255,255,255,0.4) inset",
                    }}
                >
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <img src={mindupLogo} alt="MindUp" className="w-7 h-7 rounded-lg shadow" />
                            <span className="font-bold text-base" style={{ color: "#3d5c3a" }}>MindUp</span>
                        </div>
                        <h2 className="text-2xl font-black mb-1" style={{ color: "#2e3e2a" }}>Complete Student Profile</h2>
                        <p className="text-sm" style={{ color: "#7a9070" }}>Setup your final details to access the dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Username + Full Name */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label style={labelStyle}><UserSquare2 size={13} /> Username</label>
                                <div className="relative">
                                    <UserSquare2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                        style={fieldStyle}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}><User size={13} /> Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="Your full name"
                                        style={fieldStyle}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label style={labelStyle}><Mail size={13} /> Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={email} readOnly style={{ ...fieldStyle, opacity: 0.7, cursor: "not-allowed" }} />
                            </div>
                        </div>

                        {/* Avatar selection */}
                        <div>
                            <label style={labelStyle}><Camera size={13} /> Avatar</label>
                            <div className="flex gap-2 flex-wrap">
                                {AVATAR_KEYS.map(key => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setAvatarKey(key)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${avatarKey === key ? "border-green-500 bg-green-100 text-green-700" : "border-gray-200 bg-white/50 text-gray-500"}`}
                                    >
                                        {key.replace("_", " ")}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Grade */}
                        <div>
                            <label style={labelStyle}><GraduationCap size={13} /> Grade</label>
                            <div className="relative">
                                <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                <select
                                    value={gradeId}
                                    onChange={e => setGradeId(Number(e.target.value))}
                                    style={{ ...selectStyle, color: gradeId ? "#444" : "#aaa" }}
                                    disabled={metaLoading}
                                >
                                    <option value="" disabled>{metaLoading ? "Loading grades..." : "Select your grade"}</option>
                                    {grades.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Province + District */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label style={labelStyle}><Globe size={13} /> Province</label>
                                <div className="relative">
                                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        value={provinceId}
                                        onChange={e => setProvinceId(Number(e.target.value))}
                                        style={{ ...selectStyle, color: provinceId ? "#444" : "#aaa" }}
                                        disabled={metaLoading}
                                    >
                                        <option value="" disabled>{metaLoading ? "Loading..." : "Province"}</option>
                                        {provinces.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}><MapPin size={13} /> District</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <select
                                        value={districtId}
                                        onChange={e => setDistrictId(Number(e.target.value))}
                                        disabled={!provinceId || metaLoading}
                                        style={{ ...selectStyle, color: districtId ? "#444" : "#aaa", opacity: !provinceId ? 0.5 : 1 }}
                                    >
                                        <option value="" disabled>District</option>
                                        {districts.map(d => (
                                            <option key={d.id} value={d.id}>{d.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Subjects (shown when grade selected and backend is up) */}
                        {subjects.length > 0 && (
                            <div>
                                <label style={labelStyle}><BookOpen size={13} /> Subjects (select at least 1)</label>
                                <div className="flex flex-wrap gap-2">
                                    {subjects.map(s => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => toggleSubject(s.id)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${subjectIds.includes(s.id) ? "border-green-500 bg-green-100 text-green-700" : "border-gray-200 bg-white/50 text-gray-500 hover:border-green-300"}`}
                                        >
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Error */}
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

                        {/* Submit */}
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
                            {loading
                                ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                : <><span>Access Dashboard</span> <ArrowRight size={16} /></>
                            }
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CompleteProfilePage;
