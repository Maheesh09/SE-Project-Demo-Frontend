import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import chatbotOwl from "@/assets/chatbot-owl.png";

interface Message {
  role: "bot" | "user";
  text: string;
}

const ChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi there! I'm your MindUp AI assistant. How can I help you with your studies today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "bot", text: "Thanks for your question! I'm a demo assistant — connect me to a backend to get real answers." },
    ]);
    setInput("");
  };

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <img src={chatbotOwl} alt="AI Chatbot" className="w-10 h-10 object-contain" />
          <h1 className="text-3xl font-display font-bold text-foreground">AI Chatbot</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-sm font-medium text-success">Online</span>
          </div>
        </div>
      </motion.div>

      <div className="glass rounded-2xl flex flex-col" style={{ height: "calc(100vh - 180px)" }}>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <img src={chatbotOwl} alt="Bot" className="w-8 h-8 object-contain mr-2 flex-shrink-0 mt-1" />
              )}
              <div
                className={`max-w-md px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "gradient-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleSend}
              className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatbotPage;
