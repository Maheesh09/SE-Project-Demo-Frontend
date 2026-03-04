import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Brain, Clock, HelpCircle, Star, Target, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";

const topicData: any = {
    science: [
        {
            id: "t1",
            title: "Physics",
            subtopics: [
                { id: "s1", title: "Forces and Motion", quizzes: 3, xp: 150 },
                { id: "s2", title: "Electricity & Magnetism", quizzes: 4, xp: 200 },
            ]
        },
        {
            id: "t2",
            title: "Chemistry",
            subtopics: [
                { id: "s3", title: "Atomic Structure", quizzes: 2, xp: 100 },
                { id: "s4", title: "Chemical Reactions", quizzes: 3, xp: 150 },
            ]
        }
    ]
};

const termData: any = {
    science: [
        { id: "term1", title: "Term 1 Assessment", quizzes: 5, xp: 250, time: "45m" },
        { id: "term2", title: "Term 2 Mid-Term", quizzes: 4, xp: 200, time: "40m" },
        { id: "term3", title: "Term 3 Final Review", quizzes: 8, xp: 400, time: "60m" },
    ]
};

const SubjectQuizzesPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"topic-wise" | "term-wise">("topic-wise");
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    const subjectName = id ? id.charAt(0).toUpperCase() + id.slice(1) : "Subject";
    const topics = topicData[id || "science"] || topicData.science;
    const terms = termData[id || "science"] || termData.science;

    return (
        <AppLayout>
            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <button
                    onClick={() => navigate(`/subject/${id}`)}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to {subjectName}
                </button>
                <div>
                    <BlurText text={`${subjectName} Quizzes`} delay={50} animateBy="words" direction="top" className="text-4xl font-display font-bold text-foreground mb-1" />
                    <p className="text-sm text-muted-foreground">Master the subject through topic-specific and term-wise assessments.</p>
                </div>
            </motion.div>

            {/* ── Tabs ── */}
            <div className="flex bg-card border border-border/50 p-1.5 rounded-xl shadow-sm w-fit mb-8">
                {(["topic-wise", "term-wise"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 flex items-center gap-2",
                            activeTab === tab ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab === "topic-wise" ? <Target className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        {tab.replace("-", " ")}
                    </button>
                ))}
            </div>

            {/* ── Content ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "topic-wise" && (
                        <div className="flex flex-col gap-4">
                            {topics.map((topic: any, i: number) => {
                                const isExpanded = expandedTopic === topic.id;
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        key={topic.id}
                                        className="bg-card glass border border-border/50 rounded-2xl overflow-hidden shadow-sm"
                                    >
                                        <button
                                            onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                                            className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/10 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shadow-sm">
                                                    <CheckCircle2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-display font-bold text-foreground mb-0.5">{topic.title}</h3>
                                                    <p className="text-xs text-muted-foreground">{topic.subtopics.length} Subtopics</p>
                                                </div>
                                            </div>
                                            <div className={cn("w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-transform", isExpanded && "rotate-90")}>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden border-t border-border/40 bg-muted/5"
                                                >
                                                    <div className="p-4 flex flex-col gap-3">
                                                        {topic.subtopics.map((sub: any) => (
                                                            <div key={sub.id} className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                                                                <div className="flex flex-col">
                                                                    <p className="font-semibold text-sm text-foreground mb-1">{sub.title}</p>
                                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                                        <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> {sub.quizzes} Quizzes</span>
                                                                        <span className="flex items-center gap-1.5 text-xp font-medium"><Star className="w-3.5 h-3.5 fill-xp/20" /> {sub.xp} XP</span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => navigate("/quizzes")}
                                                                    className="px-5 py-2 gradient-primary text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                                                                >
                                                                    Take Quizzes
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === "term-wise" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {terms.map((term: any, i: number) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                    key={term.id}
                                    className="bg-card border border-border/50 hover:border-accent/40 rounded-2xl p-5 flex flex-col transition-all shadow-sm"
                                >
                                    <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center mb-4 shadow-sm">
                                        <Brain className="w-6 h-6 text-accent-foreground" />
                                    </div>
                                    <h3 className="font-bold font-display text-lg text-foreground mb-2">{term.title}</h3>
                                    <div className="flex flex-col gap-2 text-xs text-muted-foreground mb-6">
                                        <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> {term.quizzes} Comprehensive Quizzes</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ~{term.time} Duration</span>
                                        <span className="flex items-center gap-1.5 text-xp font-medium"><Star className="w-3.5 h-3.5 fill-xp/20" /> {term.xp} XP Total Reward</span>
                                    </div>
                                    <button
                                        onClick={() => navigate("/quizzes")}
                                        className="mt-auto w-full py-2.5 gradient-accent text-accent-foreground font-bold rounded-xl text-sm hover:opacity-90 transition-opacity shadow-sm"
                                    >
                                        Start Assessment
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </AppLayout>
    );
};

export default SubjectQuizzesPage;
