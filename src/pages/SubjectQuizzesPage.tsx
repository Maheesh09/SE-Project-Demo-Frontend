import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Brain, Clock, HelpCircle, Star, Target, CheckCircle2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";

type TopicData = Record<string, { id: string; title: string; subtopics: { id: string; title: string; quizzes: number; xp: number; }[] }[]>;
const topicData: TopicData = {
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

type TermData = Record<string, { id: string; title: string; quizzes: number; xp: number; time: string; }[]>;
const termData: TermData = {
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
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
                <button
                    onClick={() => navigate(`/subject/${id}`)}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ChevronLeft className="w-4 h-4" /> Back to {subjectName}
                </button>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{subjectName} Quizzes</h1>
                <p className="text-sm text-muted-foreground mt-1">Master the subject through topic-specific and term-wise assessments.</p>
            </motion.div>

            {/* ── Tabs ── */}
            <div className="flex bg-card border border-border/60 p-1 rounded-xl shadow-sm w-fit mb-6">
                {(["topic-wise", "term-wise"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 flex items-center gap-1.5",
                            activeTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab === "topic-wise" ? <Target className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
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
                        <div className="flex flex-col gap-3">
                            {topics.map((topic: TopicData[string][0], i: number) => {
                                const isExpanded = expandedTopic === topic.id;
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                        key={topic.id}
                                        className="bg-card border border-border/60 rounded-2xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                                            className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-semibold text-foreground">{topic.title}</h3>
                                                    <p className="text-xs text-muted-foreground">{topic.subtopics.length} subtopics</p>
                                                </div>
                                            </div>
                                            <div className={cn("w-7 h-7 rounded-full bg-muted flex items-center justify-center transition-transform", isExpanded && "rotate-90")}>
                                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden border-t border-border/40"
                                                >
                                                    <div className="p-4 flex flex-col gap-2">
                                                        {topic.subtopics.map((sub: TopicData[string][0]['subtopics'][0]) => (
                                                            <div key={sub.id} className="flex items-center justify-between p-3.5 bg-background border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                                                                <div>
                                                                    <p className="text-sm font-medium text-foreground">{sub.title}</p>
                                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                                        <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" /> {sub.quizzes} quizzes</span>
                                                                        <span className="flex items-center gap-1 text-amber-600 font-medium"><Star className="w-3 h-3" /> {sub.xp} XP</span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => navigate("/quizzes")}
                                                                    className="px-4 py-1.5 gradient-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                                                                >
                                                                    Take Quiz
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {terms.map((term: TermData[string][0], i: number) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                                    key={term.id}
                                    className="bg-card border border-border/60 border-l-[3px] rounded-2xl p-5 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                    style={{ borderLeftColor: "#a78bfa" }}
                                >
                                    <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center mb-4">
                                        <Brain className="w-5 h-5 text-violet-600" />
                                    </div>
                                    <h3 className="font-semibold text-foreground mb-2">{term.title}</h3>
                                    <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-5 flex-1">
                                        <span className="flex items-center gap-1.5"><HelpCircle className="w-3 h-3" /> {term.quizzes} quizzes</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> ~{term.time} duration</span>
                                        <span className="flex items-center gap-1.5 text-amber-600 font-medium"><Star className="w-3 h-3" /> {term.xp} XP reward</span>
                                    </div>
                                    <button
                                        onClick={() => navigate("/quizzes")}
                                        className="w-full py-2 text-sm font-semibold gradient-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
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
