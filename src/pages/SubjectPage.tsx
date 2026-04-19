import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen, FileText, Brain, ChevronLeft, Download, Eye,
    ArrowRight, Calendar, ExternalLink, AlertCircle, Loader2
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type Resource } from "@/lib/api";
import { useProfile } from "@/hooks/useProfile";

// ─── Color palette per subject index ────────────────────────────────────────
const SUBJECT_COLORS = [
    "from-[#b2c59d] to-[#9cb282]",
    "from-[#eed4b5] to-[#d6bc99]",
    "from-[#bac8e0] to-[#99aec4]",
    "from-[#d4b8e0] to-[#bb9cce]",
    "from-[#e0c5b5] to-[#c8a996]",
    "from-[#b5dce0] to-[#96c4c8]",
];

// Derive a colour index from the subject name string
const colorForName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
};

// ─── Open PDF in new tab ─────────────────────────────────────────────────────
const openPdf = (resource: Resource) => {
    const url = resource.view_url || resource.file_url;
    if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
    } else {
        alert("No viewable URL available for this resource.");
    }
};

// ─── Component ───────────────────────────────────────────────────────────────
const SubjectPage = () => {
    const { id } = useParams<{ id: string }>();   // e.g. "science" or "8" (subject id)
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { user } = useUser();
    const { profile } = useProfile();

    const [view, setView] = useState<"overview" | "textbooks" | "past-papers">("overview");
    const [resources, setResources] = useState<Resource[]>([]);
    const [loadingResources, setLoadingResources] = useState(false);
    const [resourceError, setResourceError] = useState<string | null>(null);

    // Derive readable subject name from URL param
    const subjectName = id
        ? id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
        : "Subject";
    const subjectColor = colorForName(subjectName);

    // Find the subject id from the profile's enrolled subjects
    // The route is /subject/:id where :id is the subject ID (number)
    const subjectId = id ? parseInt(id) : NaN;

    // Fetch resources when entering textbooks or past-papers view
    useEffect(() => {
        if (view === "overview" || isNaN(subjectId)) return;

        let cancelled = false;
        setLoadingResources(true);
        setResourceError(null);

        (async () => {
            try {
                const token = await getToken();
                if (!token) throw new Error("Not authenticated");

                const email = user?.primaryEmailAddress?.emailAddress || "";
                const rtype = view === "textbooks" ? "textbook" : "past_paper";
                const data = await api.getResources(token, subjectId, rtype, user?.id, email);
                if (!cancelled) setResources(data);
            } catch (e: unknown) {
                if (!cancelled) setResourceError(e instanceof Error ? e.message : "Failed to load resources.");
            } finally {
                if (!cancelled) setLoadingResources(false);
            }
        })();

        return () => { cancelled = true; };
    }, [view, subjectId, getToken, user]);

    // ── Textbooks list ───────────────────────────────────────────────────────
    const renderTextbooks = () => {
        if (loadingResources) return <LoadingGrid />;
        if (resourceError) return <ErrorBanner message={resourceError} />;
        if (resources.length === 0) return <EmptyState type="textbooks" />;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.map((book, i) => (
                    <motion.div
                        key={book.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-card glass border border-border/50 hover:border-primary/30 rounded-2xl p-5 flex flex-col transition-all shadow-sm group"
                    >
                        {/* Cover */}
                        <div
                            className={cn(
                                "h-32 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] cursor-pointer",
                                subjectColor
                            )}
                            onClick={() => openPdf(book)}
                            title="Click to open"
                        >
                            <BookOpen className="w-10 h-10 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
                        </div>

                        <h3 className="font-bold text-foreground line-clamp-2 min-h-[40px] leading-tight mb-1">
                            {book.title}
                        </h3>
                        {book.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                                {book.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {book.type.replace("_", " ")}
                            </span>
                            <div className="flex gap-2">
                                {/* View — opens in new tab */}


                                {/* Download */}
                                {book.file_url && (
                                    <a
                                        href={book.file_url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                        title="Download"
                                    >
                                        <Download className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        );
    };

    // ── Past Papers list ────────────────────────────────────────────────────
    const renderPastPapers = () => {
        if (loadingResources) return <LoadingGrid />;
        if (resourceError) return <ErrorBanner message={resourceError} />;
        if (resources.length === 0) return <EmptyState type="past papers" />;

        // Group by year extracted from title (e.g. "2023 Term 1") – fallback to "Other"
        const withYear = resources.map(r => {
            const m = r.title.match(/\b(20\d{2})\b/);
            return { ...r, year: m ? m[1] : "Other" };
        });
        const years = Array.from(new Set(withYear.map(r => r.year))).sort().reverse();

        return (
            <div className="flex flex-col gap-6">
                {years.map(year => (
                    <div key={year} className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-5 py-3 border-b border-border/40 bg-muted/20 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <h4 className="font-bold text-sm text-foreground">{year} Past Papers</h4>
                        </div>
                        <div className="divide-y divide-border/40">
                            {withYear.filter(r => r.year === year).map((paper, i) => (
                                <motion.div
                                    key={paper.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 items-center hover:bg-muted/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-sm text-foreground truncate">{paper.title}</p>
                                            {paper.description && (
                                                <p className="text-xs text-muted-foreground truncate">{paper.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <span className="px-2.5 py-1 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                                        {paper.type.replace("_", " ")}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {/* Open in new tab */}
                                        <button
                                            onClick={() => openPdf(paper)}
                                            disabled={!paper.view_url && !paper.file_url}
                                            className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold hover:bg-primary/5 hover:border-primary/30 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                            title="Open in new tab"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </button>
                                        {paper.file_url && (
                                            <a
                                                href={paper.file_url}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5"
                                            >
                                                <Download className="w-3.5 h-3.5" /> Download
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Count helpers for overview cards
    const textbookCount = "–";   // loaded lazily
    const pastPaperCount = "–";

    return (
    <AppLayout>
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
                <button
                    onClick={() => view === "overview" ? navigate("/courses") : setView("overview")}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ChevronLeft className="w-4 h-4" />
                    {view === "overview" ? "My Subjects" : `${subjectName} Overview`}
                </button>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {view === "overview" ? subjectName : view === "textbooks" ? "Textbooks" : "Past Papers"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {view === "overview" && "Access all learning materials, past papers, and quizzes."}
                    {view === "textbooks" && `Official ${profile?.grade?.name ?? ""} ${subjectName} textbooks.`}
                    {view === "past-papers" && `Previous examination papers for ${subjectName}.`}
                </p>
            </motion.div>

            {/* ── Content ── */}
            <AnimatePresence mode="wait">
                {view === "overview" ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-5"
                    >
                        {/* Textbooks */}
                        <div
                            onClick={() => setView("textbooks")}
                            className="group cursor-pointer bg-card border border-border/60 border-l-[3px] rounded-2xl p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            style={{ borderLeftColor: "#acd663" }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                                <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-1.5">Textbooks</h3>
                            <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                                Official textbooks and reference materials for your studies.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">PDF Books</span>
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* Past Papers */}
                        <div
                            onClick={() => setView("past-papers")}
                            className="group cursor-pointer bg-card border border-border/60 border-l-[3px] rounded-2xl p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            style={{ borderLeftColor: "#60a5fa" }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-5">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-1.5">Past Papers</h3>
                            <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                                Practice with previous papers categorized by year and term.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">Yearly Collection</span>
                                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* Quizzes */}
                        <div
                            onClick={() => navigate(`/subject/${id}/quizzes`)}
                            className="group cursor-pointer bg-card border border-border/60 border-l-[3px] rounded-2xl p-6 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                            style={{ borderLeftColor: "#f59e0b" }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-5">
                                <Brain className="w-5 h-5 text-amber-600" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-1.5">Go to Quizzes</h3>
                            <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                                Take topic-wise or term-wise quizzes and earn XP rewards.
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">+XP Available</span>
                                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        {view === "textbooks" ? renderTextbooks() : renderPastPapers()}
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
};

// ─── Helper sub-components ───────────────────────────────────────────────────
const LoadingGrid = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading resources…</p>
    </div>
);

const ErrorBanner = ({ message }: { message: string }) => (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/20">
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
            <p className="font-semibold text-sm text-destructive">Failed to load resources</p>
            <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
        </div>
    </div>
);

const EmptyState = ({ type }: { type: string }) => (
    <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-border/60 rounded-2xl">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-muted-foreground/50" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">No {type} found</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
            No {type} have been uploaded for this subject yet.
        </p>
    </div>
);

export default SubjectPage;
