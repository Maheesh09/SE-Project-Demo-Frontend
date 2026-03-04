import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, FileText, Brain, ChevronLeft, Download, Eye, ArrowRight, Star, Clock, Calendar } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";

// Mock data
const subjectData: any = {
    science: {
        name: "Science",
        color: "from-[#b2c59d] to-[#9cb282]",
        textbooks: [
            { id: 1, title: "Grade 10 Science - Part 1", type: "PDF", size: "12 MB" },
            { id: 2, title: "Grade 10 Science - Part 2", type: "PDF", size: "15 MB" },
            { id: 3, title: "Science Practical Handbook", type: "PDF", size: "8 MB" },
        ],
        pastPapers: [
            { id: 1, year: "2023", term: "Term 3", type: "PDF" },
            { id: 2, year: "2023", term: "Term 2", type: "PDF" },
            { id: 3, year: "2023", term: "Term 1", type: "PDF" },
            { id: 4, year: "2022", term: "Term 3", type: "PDF" },
            { id: 5, year: "2022", term: "Term 2", type: "PDF" },
        ]
    },
    english: {
        name: "English",
        color: "from-[#eed4b5] to-[#d6bc99]",
        textbooks: [
            { id: 1, title: "Pupil's Book", type: "PDF", size: "10 MB" },
            { id: 2, title: "Workbook", type: "PDF", size: "7 MB" },
        ],
        pastPapers: [
            { id: 1, year: "2023", term: "O/L Past Paper", type: "PDF" },
            { id: 2, year: "2022", term: "O/L Past Paper", type: "PDF" },
        ]
    },
    maths: {
        name: "Maths",
        color: "from-[#eed4b5] to-[#d6bc99]",
        textbooks: [
            { id: 1, title: "Grade 10 Mathematics - Part 1", type: "PDF", size: "18 MB" },
            { id: 2, title: "Grade 10 Mathematics - Part 2", type: "PDF", size: "20 MB" },
        ],
        pastPapers: [
            { id: 1, year: "2023", term: "Term 3", type: "PDF" },
            { id: 2, year: "2022", term: "Term 3", type: "PDF" },
        ]
    }
};

const SubjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [view, setView] = useState<"overview" | "textbooks" | "past-papers">("overview");

    // Default to a generic subject if not found in mock data
    const subject = subjectData[id || "science"] || subjectData.science;

    const renderTextbooks = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subject.textbooks.map((book: any, i: number) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                    key={book.id}
                    className="bg-card glass border border-border/50 hover:border-primary/30 rounded-2xl p-5 flex flex-col transition-all shadow-sm"
                >
                    <div className={cn("h-32 rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]", subject.color)}>
                        <BookOpen className="w-10 h-10 text-white drop-shadow-md" />
                    </div>
                    <h3 className="font-bold text-foreground line-clamp-2 min-h-[40px] leading-tight mb-1">{book.title}</h3>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{book.type} · {book.size}</span>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                                <Eye className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    const renderPastPapers = () => {
        // Group by year
        const years = Array.from(new Set(subject.pastPapers.map((p: any) => p.year))).sort().reverse();

        return (
            <div className="flex flex-col gap-6">
                {years.map((year: any) => (
                    <div key={year} className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-5 py-3 border-b border-border/40 bg-muted/20 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <h4 className="font-bold text-sm text-foreground">{year} Past Papers</h4>
                        </div>
                        <div className="divide-y divide-border/40">
                            {subject.pastPapers.filter((p: any) => p.year === year).map((paper: any, i: number) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    key={paper.id}
                                    className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-muted/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <p className="font-semibold text-sm text-foreground">{subject.name} - {paper.term}</p>
                                    </div>
                                    <div className="text-center">
                                        <span className="px-2.5 py-1 rounded-md bg-muted text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{paper.type}</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="px-4 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </button>
                                        <button className="px-4 py-1.5 rounded-lg bg-background border border-border text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5">
                                            <Download className="w-3.5 h-3.5" /> Download
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <AppLayout>
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <button
                    onClick={() => view === "overview" ? navigate("/") : setView("overview")}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ChevronLeft className="w-4 h-4" /> {view === "overview" ? "Back to Dashboard" : `Back to ${subject.name} Overview`}
                </button>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <BlurText text={view === "overview" ? subject.name : (view === "textbooks" ? "Textbooks" : "Past Papers")} delay={50} animateBy="words" direction="top" className="text-4xl font-display font-bold text-foreground mb-1" />
                        <p className="text-sm text-muted-foreground">
                            {view === "overview" && "Access all learning materials, past papers, and quizzes."}
                            {view === "textbooks" && `Official Grade 9 ${subject.name} textbooks for the current curriculum.`}
                            {view === "past-papers" && `Collection of previous examination papers for ${subject.name}.`}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ── Content ── */}
            <AnimatePresence mode="wait">
                {view === "overview" ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* 1. Textbooks Card */}
                        <div
                            onClick={() => setView("textbooks")}
                            className="group cursor-pointer bg-card border border-border/50 rounded-2xl p-6 flex flex-col hover:border-primary/40 transition-all shadow-sm hover:translate-y-[-4px]"
                        >
                            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <BookOpen className="w-7 h-7 text-primary-foreground" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-foreground mb-2">Textbooks</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Official textbooks and reference materials for your studies.</p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase tracking-widest">{subject.textbooks.length} Books</span>
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        {/* 2. Past Papers Card */}
                        <div
                            onClick={() => setView("past-papers")}
                            className="group cursor-pointer bg-card border border-border/50 rounded-2xl p-6 flex flex-col hover:border-accent/40 transition-all shadow-sm hover:translate-y-[-4px]"
                        >
                            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-accent-foreground" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-foreground mb-2">Past Papers</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Practise with previous papers categorized by year and term.</p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase tracking-widest">Yearly Collection</span>
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        {/* 3. Quizzes Card */}
                        <div
                            onClick={() => navigate(`/subject/${id}/quizzes`)}
                            className="group cursor-pointer bg-card border border-border/50 rounded-2xl p-6 flex flex-col hover:border-xp/40 transition-all shadow-sm hover:translate-y-[-4px]"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-xp to-[#b59a68] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Brain className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-foreground mb-2">Go to Quizzes</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">Take topic-wise or term-wise quizzes to earn XP rewards.</p>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full uppercase tracking-widest">+500 XP Available</span>
                                <div className="w-8 h-8 rounded-full bg-xp/10 flex items-center justify-center text-xp opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-4 h-4" strokeWidth={3} />
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

export default SubjectPage;
