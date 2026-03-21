import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Plus, Trash2, Check, ExternalLink, LogOut, Upload, Loader2, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY ?? "change-me";

interface Option {
    id: string;
    option_text: string;
    is_correct: boolean;
}

interface SubjectItem {
    id: number;
    name: string;
}

interface TopicItem {
    id: number;
    name: string;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // ── Dynamic subjects & topics from database ──
    const [subjects, setSubjects] = useState<SubjectItem[]>([]);
    const [topics, setTopics] = useState<TopicItem[]>([]);
    const [subjectsLoading, setSubjectsLoading] = useState(true);
    const [topicsLoading, setTopicsLoading] = useState(false);

    // ── Student count from Supabase students table ──
    const [studentCount, setStudentCount] = useState<number | null>(null);
    const [countLoading, setCountLoading] = useState(true);

    // Fetch subjects from the database on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(`${API_BASE}/api/v1/subjects/available?grade_id=1`);
                if (res.ok) {
                    const data: SubjectItem[] = await res.json();
                    if (!cancelled) {
                        setSubjects(data);
                        if (data.length > 0) {
                            setSubjectId(data[0].id.toString());
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch subjects:", err);
            } finally {
                if (!cancelled) setSubjectsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await api.getStudentCount(ADMIN_API_KEY);
                if (!cancelled) setStudentCount(data.count);
            } catch (err) {
                console.error("Failed to fetch student count:", err);
            } finally {
                if (!cancelled) setCountLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Form State
    const [subjectId, setSubjectId] = useState<string>("");
    const [topicId, setTopicId] = useState<string>("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [questionText, setQuestionText] = useState("");
    const [explanation, setExplanation] = useState("");
    const [xpValue, setXpValue] = useState<string>("10");

    // Fetch topics whenever the selected subject changes
    useEffect(() => {
        if (!subjectId) return;
        let cancelled = false;
        setTopicsLoading(true);
        setTopicId(""); // reset topic selection
        (async () => {
            try {
                const data = await api.getTopics(parseInt(subjectId));
                if (!cancelled) {
                    setTopics(data);
                    if (data.length > 0) {
                        setTopicId(data[0].id.toString());
                    }
                }
            } catch (err) {
                console.error("Failed to fetch topics:", err);
                if (!cancelled) setTopics([]);
            } finally {
                if (!cancelled) setTopicsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [subjectId]);

    const [options, setOptions] = useState<Option[]>([
        { id: "1", option_text: "", is_correct: true },
        { id: "2", option_text: "", is_correct: false },
        { id: "3", option_text: "", is_correct: false },
        { id: "4", option_text: "", is_correct: false },
    ]);

    const handleLogout = () => {
        localStorage.removeItem("admin-token");
        navigate("/admin/login");
    };

    const handleAddOption = () => {
        setOptions([...options, { id: Date.now().toString(), option_text: "", is_correct: false }]);
    };

    const handleRemoveOption = (id: string) => {
        if (options.length <= 2) {
            toast.error("A question must have at least 2 options.");
            return;
        }
        setOptions(options.filter(o => o.id !== id));
    };

    const setCorrectOption = (id: string) => {
        setOptions(options.map(o => ({
            ...o,
            is_correct: o.id === id
        })));
    };

    const updateOptionText = (id: string, text: string) => {
        setOptions(options.map(o => o.id === id ? { ...o, option_text: text } : o));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!questionText.trim()) {
            toast.error("Please enter the question text.");
            return;
        }
        if (options.some(o => !o.option_text.trim())) {
            toast.error("Please fill in all option texts.");
            return;
        }
        const correctCount = options.filter(o => o.is_correct).length;
        if (correctCount !== 1) {
            toast.error("Exactly one option must be marked as correct.");
            return;
        }

        setLoading(true);

        const payload = {
            subject_id: parseInt(subjectId),
            topic_id: parseInt(topicId),
            difficulty,
            question_text: questionText,
            explanation: explanation.trim() || null,
            xp_value: xpValue && parseInt(xpValue) > 0 ? parseInt(xpValue) : null,
            created_by: 1, // Default admin user ID
            options: options.map(o => ({
                option_text: o.option_text,
                is_correct: o.is_correct
            }))
        };

        try {
            const response = await fetch(`${API_BASE}/api/v1/admin/questions/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Question successfully added to the Question Bank!");
                // Reset form
                setQuestionText("");
                setExplanation("");
                setOptions([
                    { id: Date.now().toString() + "1", option_text: "", is_correct: true },
                    { id: Date.now().toString() + "2", option_text: "", is_correct: false },
                    { id: Date.now().toString() + "3", option_text: "", is_correct: false },
                    { id: Date.now().toString() + "4", option_text: "", is_correct: false },
                ]);
            } else {
                const errData = await response.json();
                console.error("Backend Error:", errData);
                toast.error(`Failed to add: ${errData?.detail || "Unknown error from server"}`);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Could not reach the backend server. Please ensure it is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden font-sans">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />

            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-card/60 backdrop-blur-xl border-r border-border/50 p-6 flex flex-col z-10 sticky top-0 h-auto md:h-screen">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                        <BrainCircuit className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-foreground leading-tight tracking-tight">MindUp</h2>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Admin Portal</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {/* ── Registered Students Count ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shadow-sm">
                                <Users className="w-5 h-5 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                    Registered Students
                                </p>
                                {countLoading ? (
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                        <span className="text-xs text-muted-foreground">Loading…</span>
                                    </div>
                                ) : studentCount !== null ? (
                                    <p className="text-2xl font-display font-black text-primary leading-tight">
                                        {studentCount.toLocaleString()}
                                    </p>
                                ) : (
                                    <p className="text-xs text-destructive font-medium mt-0.5">
                                        Could not load
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2">
                            Total students in the system
                        </p>
                    </motion.div>

                    <Button variant="secondary" className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20">
                        <Plus className="w-4 h-4" />
                        Insert Question
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                        <Upload className="w-4 h-4" />
                        Bulk Upload
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                        <Save className="w-4 h-4" />
                        Question Bank
                    </Button>
                </nav>

                <div className="mt-8 pt-6 border-t border-border/50">
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto z-10">
                <div className="max-w-4xl mx-auto">

                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Add New Question</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Create an interactive question to add to the student quiz engine.</p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Metadata Card */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 border border-border/60">
                            <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">1</span>
                                Question Attributes
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select value={subjectId} onValueChange={setSubjectId} disabled={subjectsLoading}>
                                        <SelectTrigger className="bg-background/50 border-border/50">
                                            <SelectValue placeholder={subjectsLoading ? "Loading subjects…" : "Select subject"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map(s => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Topic</Label>
                                    <Select value={topicId} onValueChange={setTopicId} disabled={topicsLoading || topics.length === 0}>
                                        <SelectTrigger className="bg-background/50 border-border/50">
                                            <SelectValue placeholder={topicsLoading ? "Loading topics…" : topics.length === 0 ? "No topics for this subject" : "Select topic"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {topics.map(t => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <Select value={difficulty} onValueChange={(val: "easy" | "medium" | "hard") => setDifficulty(val)}>
                                        <SelectTrigger className="bg-background/50 border-border/50">
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easy">Easy (10 XP)</SelectItem>
                                            <SelectItem value="medium">Medium (20 XP)</SelectItem>
                                            <SelectItem value="hard">Hard (30 XP)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Custom XP (Optional)</Label>
                                    <Input
                                        type="number"
                                        value={xpValue}
                                        onChange={(e) => setXpValue(e.target.value)}
                                        placeholder="Leave blank for default"
                                        className="bg-background/50 border-border/50"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Content Card */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6 border border-border/60">
                            <h3 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">2</span>
                                Question Content
                            </h3>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Question Text</Label>
                                    <Textarea
                                        value={questionText}
                                        onChange={e => setQuestionText(e.target.value)}
                                        placeholder="Enter the main question here..."
                                        className="min-h-[100px] bg-background/50 border-border/50 resize-y text-base"
                                        required
                                    />
                                </div>

                                <div className="space-y-2 pt-2">
                                    <Label>Explanation (Optional)</Label>
                                    <p className="text-[11px] text-muted-foreground mb-2 -mt-1">This will be shown to students after they answer to help them learn.</p>
                                    <Textarea
                                        value={explanation}
                                        onChange={e => setExplanation(e.target.value)}
                                        placeholder="Why is the correct answer right?..."
                                        className="min-h-[80px] bg-background/50 border-border/50 resize-y"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Options Card */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-2xl p-6 border border-border/60">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">3</span>
                                    Answers & Options
                                </h3>
                                <Button type="button" variant="outline" size="sm" onClick={handleAddOption} className="h-8 text-xs font-semibold gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                                    <Plus className="w-3.5 h-3.5" /> Add Option
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {options.map((opt, index) => (
                                        <motion.div
                                            key={opt.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${opt.is_correct
                                                ? "bg-success/5 border-success/30 ring-1 ring-success/20"
                                                : "bg-background/40 border-border/50 hover:bg-background/60"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center gap-2 mt-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${opt.is_correct ? 'text-success' : 'text-muted-foreground'}`}>
                                                    {opt.is_correct ? 'Correct' : 'Wrong'}
                                                </span>
                                                <Switch
                                                    checked={opt.is_correct}
                                                    onCheckedChange={() => setCorrectOption(opt.id)}
                                                    className={opt.is_correct ? "data-[state=checked]:bg-success" : ""}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <Label className="sr-only">Option {index + 1}</Label>
                                                <Input
                                                    value={opt.option_text}
                                                    onChange={(e) => updateOptionText(opt.id, e.target.value)}
                                                    placeholder={`Option ${index + 1} text`}
                                                    className={`w-full ${opt.is_correct ? 'border-success/30 bg-success/[0.02]' : 'bg-background/50'}`}
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveOption(opt.id)}
                                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1"
                                                disabled={options.length <= 2}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Action Bar */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                            <Button type="button" variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Go to App
                            </Button>
                            <Button type="submit" disabled={loading} className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Question
                                    </>
                                )}
                            </Button>
                        </motion.div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
