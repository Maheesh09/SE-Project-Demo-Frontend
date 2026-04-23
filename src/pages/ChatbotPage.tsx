import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, BookOpen, Brain, Clock, ChevronRight,
  AlertCircle, Filter, RotateCcw, ChevronDown, X, Atom, Calculator
} from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type ChatSource, type ChatSubject, type ChatTopic } from "@/lib/api";

const chatbotOwl = "/fox/mascot.png";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  sources?: ChatSource[];
  matched?: boolean;
}

// Each prompt uses a course color token from index.css so they match the
// rest of the Sage & Stone theme automatically (light + dark).
const SUGGESTED_PROMPTS = [
  {
    icon: Atom,
    label: "Explain Newton's Laws",
    subject: "Science",
    iconClass: "text-course-science",
    bgClass: "bg-course-science/10 group-hover:bg-course-science/15",
    pillClass: "bg-course-science/12 text-course-science border-course-science/20",
    accent: "hsl(var(--course-science))",
  },
  {
    icon: BookOpen,
    label: "Summarise the Cold War",
    subject: "History",
    iconClass: "text-course-history",
    bgClass: "bg-course-history/10 group-hover:bg-course-history/15",
    pillClass: "bg-course-history/12 text-course-history border-course-history/20",
    accent: "hsl(var(--course-history))",
  },
  {
    icon: Calculator,
    label: "Help with Algebra",
    subject: "Maths",
    iconClass: "text-course-maths",
    bgClass: "bg-course-maths/10 group-hover:bg-course-maths/15",
    pillClass: "bg-course-maths/12 text-course-maths border-course-maths/20",
    accent: "hsl(var(--course-maths))",
  },
  {
    icon: Clock,
    label: "Make a study schedule",
    subject: "Planning",
    iconClass: "text-course-civics",
    bgClass: "bg-course-civics/10 group-hover:bg-course-civics/15",
    pillClass: "bg-course-civics/12 text-course-civics border-course-civics/20",
    accent: "hsl(var(--course-civics))",
  },
];

const INITIAL_MESSAGE: Message = {
  id: "msg-1",
  role: "bot",
  text: "Hi there! I'm your MindUp AI tutor. How can I help you master your subjects today?",
};

const ChatbotPage = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [subjects, setSubjects] = useState<ChatSubject[]>([]);
  const [topics, setTopics] = useState<ChatTopic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<ChatSubject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<ChatTopic | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { api.getChatSubjects().then(setSubjects).catch(() => {}); }, []);
  useEffect(() => {
    setTopics([]); setSelectedTopic(null);
    if (selectedSubject) api.getChatTopics(selectedSubject.id).then(setTopics).catch(() => {});
  }, [selectedSubject]);

  // Custom RAF-based smooth scroller. scrollIntoView({behavior:'smooth'}) is
  // browser-implementation-dependent and often janky / interruptible. This
  // animates scrollTop on the container directly with our quint easing so the
  // motion always matches the rest of the app.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const start = container.scrollTop;
    const target = container.scrollHeight - container.clientHeight;
    const distance = target - start;
    if (Math.abs(distance) < 2) return;

    const duration = Math.min(450, 200 + Math.abs(distance) * 0.5);
    const startTime = performance.now();
    let rafId = 0;

    // ease-out-quint — same curve as the Tailwind `ease-quint` we wired earlier.
    const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      container.scrollTop = start + distance * easeOutQuint(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [messages, isTyping]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleNewChat = () => { setMessages([INITIAL_MESSAGE]); setSessionId(undefined); inputRef.current?.focus(); };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      const email = user?.primaryEmailAddress?.emailAddress || "";
      const res = await api.askChat(token, {
        question: textToSend, session_id: sessionId, subject: selectedSubject?.name, topic_id: selectedTopic?.id,
      }, user?.id, email);
      setSessionId(res.session_id);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: res.answer, sources: res.sources, matched: res.matched }]);
    } catch (err: unknown) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: err instanceof Error ? err.message : "Something went wrong. Please try again." }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-violet-500/40 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative w-12 h-12 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-sm flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
              <img src={chatbotOwl} alt="AI Tutor" className="w-8 h-8 object-contain" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 leading-tight">MindUp AI Tutor</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Live Assistance</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={cn(
              "lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-card border border-border/60 text-foreground transition-all",
              (selectedSubject || filterOpen) && "border-primary/50 bg-primary/5 text-primary"
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 h-10 px-3.5 rounded-xl bg-card border border-border/60 text-sm font-medium text-foreground hover:bg-muted/50 hover:border-border transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </motion.div>

      {/* ── Mobile Filter Drawer (Inline) ── */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden mb-4 overflow-hidden"
          >
            <div className="bg-card border border-border/60 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Select Subject Context</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select 
                  value={selectedSubject?.id ?? ""} 
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedSubject(subjects.find(s => s.id === id) ?? null);
                  }} 
                  className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/60 text-xs text-foreground focus:ring-2 focus:ring-primary/20 appearance-none transition-all hover:border-primary/30"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {selectedSubject && topics.length > 0 && (
                  <select 
                    value={selectedTopic?.id ?? ""} 
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedTopic(topics.find(t => t.id === id) ?? null);
                    }} 
                    className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/60 text-xs text-foreground focus:ring-2 focus:ring-primary/20 appearance-none transition-all hover:border-primary/30"
                  >
                    <option value="">Select Topic (Optional)</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                )}
              </div>
              {selectedSubject && (
                <button 
                  onClick={() => { setSelectedSubject(null); setSelectedTopic(null); setFilterOpen(false); }}
                  className="w-full py-2 text-[10px] font-bold uppercase text-primary hover:bg-primary/5 rounded-lg transition-colors border border-dashed border-primary/20"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-5 h-[calc(100vh-160px)] min-h-[600px]">

        {/* ── Left sidebar ── */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:flex flex-col gap-0">
          <div className="bg-card border border-border/60 rounded-3xl p-5 h-full flex flex-col shadow-sm">

            {/* Filter */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-between w-full mb-3 group press-shrink"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Filter</span>
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ease-quint", filterOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-3">
                    <select value={selectedSubject?.id ?? ""} onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedSubject(subjects.find(s => s.id === id) ?? null);
                    }} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="">All subjects</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {selectedSubject && topics.length > 0 && (
                      <select value={selectedTopic?.id ?? ""} onChange={(e) => {
                        const id = Number(e.target.value);
                        setSelectedTopic(topics.find(t => t.id === id) ?? null);
                      }} className="w-full px-3 py-2.5 rounded-xl bg-background border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                        <option value="">All topics</option>
                        {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    )}
                    {selectedSubject && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-primary/10 text-[11px] font-medium text-primary border border-primary/20">
                        <Filter className="w-3 h-3" />
                        {selectedSubject.name}{selectedTopic ? ` › ${selectedTopic.name}` : ""}
                        <button onClick={() => { setSelectedSubject(null); setSelectedTopic(null); }} className="ml-auto text-primary/60 hover:text-primary transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-border/40 my-4" />

            {/* Suggested prompts — now full cards with course-color accents */}
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Suggested</span>
            </div>
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto smooth-scroll pr-1 -mr-1">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleSend(p.label)}
                  disabled={isTyping}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex items-center gap-3 p-3 pr-2.5 rounded-2xl border border-border/50 bg-background/60 hover:bg-card hover:border-border hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 ease-quint text-left disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
                  style={{ ['--prompt-accent' as string]: p.accent }}
                >
                  {/* Soft gradient sheen on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(120% 80% at 0% 0%, ${p.accent}14, transparent 60%)` }}
                  />

                  {/* Icon block */}
                  <div className={cn(
                    "relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ease-spring group-hover:scale-110",
                    p.bgClass, p.iconClass
                  )}>
                    <p.icon className="w-[18px] h-[18px]" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 relative">
                    <span className={cn(
                      "inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border",
                      p.pillClass
                    )}>
                      {p.subject}
                    </span>
                    <p className="text-[13px] font-semibold text-foreground leading-snug mt-1.5 truncate">
                      {p.label}
                    </p>
                  </div>

                  <ChevronRight className="relative w-4 h-4 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-quint flex-shrink-0" />
                </motion.button>
              ))}
            </div>

            <div className="pt-4 mt-3 border-t border-border/40">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Tip:</strong> Lock in a subject above to get textbook-grounded answers with page citations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Chat container ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/60 rounded-3xl flex flex-col shadow-md overflow-hidden h-full">

          {/* Active filter bar */}
          {selectedSubject && (
            <div className="px-6 py-3 bg-primary/5 backdrop-blur-md border-b border-border/40 flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase border border-primary/20">
                <Filter className="w-2.5 h-2.5" />
                Context: {selectedSubject.name}{selectedTopic ? ` › ${selectedTopic.name}` : ""}
              </div>
              <button
                onClick={() => { setSelectedSubject(null); setSelectedTopic(null); }}
                className="ml-auto text-[10px] font-bold uppercase tracking-tight text-muted-foreground hover:text-primary transition-colors press-shrink"
              >
                Reset Context
              </button>
            </div>
          )}

          {/* Messages — smooth-scroll utility wires up themed scrollbar + snap padding.
              scroll-fade adds soft top/bottom gradient masks. */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto smooth-scroll scroll-fade px-6 py-7 space-y-5"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("flex items-end gap-3", isUser ? "justify-end" : "justify-start")}
                  >
                    {!isUser && (
                      <div className="w-9 h-9 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                        <img src={chatbotOwl} alt="AI" className="w-6 h-6 object-contain" />
                      </div>
                    )}
                    <div className="relative max-w-[80%]">
                      <div className={cn(
                        "px-5 py-3.5 text-[14px] leading-relaxed whitespace-pre-wrap transition-all",
                        isUser
                          ? "bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground rounded-3xl rounded-br-md font-medium shadow-md shadow-primary/15"
                          : "bg-background/80 border border-border/60 text-foreground rounded-3xl rounded-bl-md shadow-sm"
                      )}>
                        {msg.text}
                      </div>
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-[10px] font-semibold text-primary border border-primary/20">
                              <BookOpen className="w-2.5 h-2.5" />
                              {src.citation || `${src.subject} · p.${src.page_start}–${src.page_end}`}
                            </span>
                          ))}
                        </div>
                      )}
                      {!isUser && msg.matched === false && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <AlertCircle className="w-3 h-3" />
                          <span>General response — not found in textbook</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3">
                <div className="w-9 h-9 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                  <img src={chatbotOwl} alt="AI" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-background/80 border border-border/60 px-5 py-3.5 rounded-3xl rounded-bl-md flex items-center gap-1.5 shadow-sm">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={endRef} className="h-1" />
          </div>

          {/* Input */}
          <div className="p-5 border-t border-border/50 bg-card/40 backdrop-blur-sm">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-3 bg-background border border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 rounded-2xl px-4 py-2 transition-all duration-300 ease-quint shadow-sm focus-within:shadow-md"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedSubject ? `Ask about ${selectedSubject.name}...` : "Ask your tutor anything..."}
                className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 px-2 py-2.5"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 flex-shrink-0 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 ease-spring shadow-md shadow-primary/20"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 translate-x-[1px] translate-y-[-1px]" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ChatbotPage;
