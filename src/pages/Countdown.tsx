import { useState, useEffect } from "react";

const Countdown = () => {
  const launchDate = new Date("2025-04-15T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const tick = () => {
      const diff = launchDate - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [launchDate]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const blocks = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute w-[400px] h-[400px] bg-[#acd663]/10 rounded-full blur-[80px] -top-24 -left-24 animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute w-[300px] h-[300px] bg-[#acd663]/10 rounded-full blur-[80px] -bottom-20 -right-20 animate-[float_8s_ease-in-out_infinite_3s]" />
      <div className="absolute w-[200px] h-[200px] bg-[#ffb347]/10 rounded-full blur-[80px] top-[40%] right-[10%] animate-[float_8s_ease-in-out_infinite_5s]" />

      <div className="relative z-10 text-center px-6 max-w-xl w-full">
        {/* Logo */}
        <img src="/logo.png" alt="MINDUP" className="h-14 mx-auto mb-8 animate-[fadeDown_1s_ease_forwards]" />

        {/* Heading */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black mb-2 animate-[fadeUp_0.8s_0.2s_ease_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
          Something Big Is <span className="text-[#acd663]">Coming</span>
        </h1>
        <p className="text-foreground/50 text-lg font-semibold mb-10 animate-[fadeUp_0.8s_0.4s_ease_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
          Level Up Your Mind — launching soon
        </p>

        {/* Countdown */}
        <div className="flex justify-center gap-3 sm:gap-4 mb-10 animate-[fadeUp_0.8s_0.6s_ease_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
          {blocks.map((b) => (
            <div
              key={b.label}
              className="bg-white/60 backdrop-blur-sm border border-foreground/5 rounded-2xl px-4 py-5 min-w-[70px] sm:min-w-[85px] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#acd663]/10 transition-all duration-300"
            >
              <div className="font-display text-3xl sm:text-4xl font-black leading-none">{pad(b.value)}</div>
              <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-foreground/35 mt-2">{b.label}</div>
            </div>
          ))}
        </div>

        {/* Email form */}
        <div className="animate-[fadeUp_0.8s_0.8s_ease_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
          {submitted ? (
            <p className="text-[#acd663] font-bold text-base mb-4">You're on the list! We'll notify you at launch.</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="flex gap-2 max-w-sm mx-auto mb-4"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl border border-foreground/10 bg-white/70 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-[#acd663]/40 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#acd663] text-black font-bold text-sm hover:bg-[#96ba50] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#acd663]/30 transition-all duration-300"
              >
                Notify Me
              </button>
            </form>
          )}
          <p className="text-foreground/35 text-sm">Be the first to know when we go live.</p>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
