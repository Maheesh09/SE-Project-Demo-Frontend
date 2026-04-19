import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Sparkles, BookOpen, Brain, Clock, ChevronRight,
  AlertCircle, Filter, RotateCcw, ChevronDown, X
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

const SUGGESTED_PROMPTS = [
  { icon: Brain, label: "Explain Newton's Laws", subject: "Science", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: BookOpen, label: "Summarise the Cold War", subject: "History", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { icon: Sparkles, label: "Help with Algebra", subject: "Maths", color: "text-primary", bg: "bg-primary/10" },
  { icon: Clock, label: "Make a study schedule", subject: "Planning", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
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

  useEffect(() => { api.getChatSubjects().then(setSubjects).catch(() => {}); }, []);
  useEffect(() => {
    setTopics([]); setSelectedTopic(null);
    if (selectedSubject) api.getChatTopics(selectedSubject.id).then(setTopics).catch(() => {});
  }, [selectedSubject]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
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
    } catch (err: any) {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "bot", text: err.message || "Something went wrong. Please try again." }]);
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
          <div className="w-11 h-11 rounded-xl bg-card border border-border/60 flex items-center justify-center shadow-sm flex-shrink-0">
            <img src={chatbotOwl} alt="AI Tutor" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">MindUp AI Tutor</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border/60 text-sm font-medium text-foreground hover:bg-muted/50 hover:border-border transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-210px)] min-h-[500px]">

        {/* ── Left sidebar ── */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:flex flex-col gap-0">
          <div className="bg-card border border-border/60 rounded-2xl p-4 h-full flex flex-col">

            {/* Filter */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-between w-full mb-3"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Filter</span>
              </div>
              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", filterOpen && "rotate-180")} />
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
                    }} className="w-full px-3 py-2 rounded-lg bg-background border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="">All subjects</option>
                      {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    {selectedSubject && topics.length > 0 && (
                      <select value={selectedTopic?.id ?? ""} onChange={(e) => {
                        const id = Number(e.target.value);
                        setSelectedTopic(topics.find(t => t.id === id) ?? null);
                      }} className="w-full px-3 py-2 rounded-lg bg-background border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option value="">All topics</option>
                        {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    )}
                    {selectedSubject && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/8 text-[11px] font-medium text-primary">
                        <Filter className="w-3 h-3" />
                        {selectedSubject.name}{selectedTopic ? ` › ${selectedTopic.name}` : ""}
                        <button onClick={() => { setSelectedSubject(null); setSelectedTopic(null); }} className="ml-auto text-primary/60 hover:text-primary">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-border/40 my-3" />

            {/* Suggested prompts */}
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Suggested</span>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.label)}
                  disabled={isTyping}
                  className="group flex flex-col items-start gap-1 p-3 rounded-xl border border-border/40 hover:border-primary/30 hover:bg-primary/[0.03] transition-all text-left disabled:opacity-50"
                >
                  <div className={cn("flex items-center gap-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full", p.bg, p.color)}>
                    <p.icon className="w-2.5 h-2.5" />{p.subject}
                  </div>
                  <div className="flex items-center justify-between w-full gap-1">
                    <span className="text-xs font-medium text-foreground leading-snug">{p.label}</span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-3 mt-auto border-t border-border/40">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Tip:</strong> Select a subject above for more accurate answers.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Chat container ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 bg-card border border-border/60 rounded-2xl flex flex-col shadow-sm overflow-hidden h-full">

          {/* Active filter bar */}
          {selectedSubject && (
            <div className="px-5 py-2.5 bg-primary/5 border-b border-border/40 flex items-center gap-2">
              <Filter className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                {selectedSubject.name}{selectedTopic ? ` › ${selectedTopic.name}` : ""}
              </span>
              <button onClick={() => { setSelectedSubject(null); setSelectedTopic(null); }} className="ml-auto text-xs text-primary/60 hover:text-primary">
                Clear
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex items-end gap-2.5", isUser ? "justify-end" : "justify-start")}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-xl bg-muted border border-border/60 flex items-center justify-center flex-shrink-0 mb-1">
                        <img src={chatbotOwl} alt="AI" className="w-5 h-5 object-contain" />
                      </div>
                    )}
                    <div className="relative max-w-[78%]">
                      <div className={cn(
                        "px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                        isUser
                          ? "gradient-primary text-primary-foreground rounded-2xl rounded-br-sm font-medium"
                          : "bg-card border border-border/50 text-foreground rounded-2xl rounded-bl-sm"
                      )}>
                        {msg.text}
                      </div>
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {msg.sources.map((src, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/8 text-[10px] font-medium text-primary">
                              <BookOpen className="w-2.5 h-2.5" />{src.subject} · p.{src.page_start}–{src.page_end}
                            </span>
                          ))}
                        </div>
                      )}
                      {!isUser && msg.matched === false && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
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
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-muted border border-border/60 flex items-center justify-center flex-shrink-0 mb-1">
                  <img src={chatbotOwl} alt="AI" className="w-5 h-5 object-contain" />
                </div>
                <div className="bg-muted/40 border border-border/50 px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay }} className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={endRef} className="h-1" />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/50 bg-background/60">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-3 bg-card border border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 rounded-2xl px-4 py-2 transition-all shadow-sm"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedSubject ? `Ask about ${selectedSubject.name}...` : "Ask your tutor anything..."}
                className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 px-2 py-2"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 flex-shrink-0 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-3.5 h-3.5 translate-x-[1px] translate-y-[-1px]" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ChatbotPage;
