import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, BookOpen, Brain, Clock, ChevronRight, AlertCircle } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import BlurText from "@/components/BlurText";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api, type ChatSource } from "@/lib/api";

const chatbotOwl = "/fox/mascot.png";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  sources?: ChatSource[];
  matched?: boolean;
}

const suggestedPrompts = [
  { icon: Brain, label: "Explain Newton's Laws", subject: "Science", color: "text-xp" },
  { icon: BookOpen, label: "Summarise the Cold War", subject: "History", color: "text-accent" },
  { icon: Sparkles, label: "Help with Algebra", subject: "Maths", color: "text-primary" },
  { icon: Clock, label: "Make a study schedule", subject: "Planning", color: "text-streak" },
];

const ChatbotPage = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    { id: "msg-1", role: "bot", text: "Hi there! I'm your MindUp AI tutor. How can I help you master your subjects today?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
      const res = await api.askChat(
        token,
        { question: textToSend, session_id: sessionId },
        user?.id,
        email
      );

      setSessionId(res.session_id);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: res.answer,
          sources: res.sources,
          matched: res.matched,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: err.message || "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AppLayout>

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-card border border-border/50 flex items-center justify-center shadow-sm">
          <img src={chatbotOwl} alt="AI Chatbot" className="w-10 h-10 object-contain drop-shadow-sm" />
        </div>
        <div>
          <BlurText text="MindUp AI Tutor" delay={40} animateBy="words" direction="top" className="text-3xl font-display font-bold text-foreground" />
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-sm font-semibold text-success tracking-wide">Online & Ready to help</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-190px)]">

        {/* ── Left Sidebar (Suggestions) ── */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:flex flex-col gap-4">
          <div className="glass rounded-2xl p-5 border border-border/40 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-foreground">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
              <h2 className="text-sm font-display font-bold uppercase tracking-wider">Suggested Prompts</h2>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
              {suggestedPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.label)}
                  disabled={isTyping}
                  className="group flex flex-col items-start gap-1 p-3.5 rounded-xl bg-card border border-border/30 hover:border-primary/40 hover:bg-primary/[0.03] transition-all text-left w-full h-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <p.icon className={cn("w-3.5 h-3.5", p.color)} />
                      <span className="text-muted-foreground">{p.subject}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-semibold text-foreground leading-snug">{p.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 mt-auto border-t border-border/40">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Tip:</strong> Ask questions about your school subjects and get answers from your textbooks.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Chat Container ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 glass rounded-2xl flex flex-col border border-border/40 shadow-sm overflow-hidden h-full">

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn("flex items-end gap-3", isUser ? "justify-end" : "justify-start")}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-card border border-border/50 flex items-center justify-center flex-shrink-0 mb-1">
                        <img src={chatbotOwl} alt="AI" className="w-5 h-5 object-contain" />
                      </div>
                    )}

                    <div className={cn("relative max-w-[75%]", isUser ? "" : "")}>
                      <div
                        className={cn(
                          "px-5 py-3.5 text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                          isUser
                            ? "gradient-primary text-primary-foreground rounded-2xl rounded-br-sm font-medium"
                            : "bg-card border border-border/50 text-foreground rounded-2xl rounded-bl-sm"
                        )}
                      >
                        {msg.text}
                      </div>

                      {/* Source citations */}
                      {!isUser && msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-[10px] font-semibold text-primary"
                            >
                              <BookOpen className="w-2.5 h-2.5" />
                              {src.subject} · p.{src.page_start}–{src.page_end}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Not matched warning */}
                      {!isUser && msg.matched === false && (
                        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <AlertCircle className="w-3 h-3" />
                          <span>Answer not found in textbooks — this is a general response</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-xl bg-card border border-border/50 flex items-center justify-center flex-shrink-0 mb-1">
                  <img src={chatbotOwl} alt="AI" className="w-5 h-5 object-contain" />
                </div>
                <div className="bg-card border border-border/50 px-5 py-4 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                </div>
              </motion.div>
            )}
            <div ref={endOfMessagesRef} className="h-2" />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-card/60 border-t border-border/40 backdrop-blur-md">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center gap-3 bg-background border border-border/60 hover:border-primary/40 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-2xl p-2 transition-all shadow-sm"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your tutor anything..."
                className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 px-3 py-2"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 flex-shrink-0 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
