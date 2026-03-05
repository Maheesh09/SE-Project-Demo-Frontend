import { useState, useEffect, useMemo } from "react";

const Countdown = () => {
  // Set launch date to May 1, 2026
  const launchDate = new Date("2026-05-01T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  // Twinkling stars (same as landing page)
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${2.5 + Math.random() * 5}s`,
        size: Math.random() > 0.85 ? 3 : Math.random() > 0.5 ? 2 : 1,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    []
  );

  useEffect(() => {
    const tick = () => {
      const diff = launchDate - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
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
    { value: timeLeft.days, label: "DAYS" },
    { value: timeLeft.hours, label: "HOURS" },
    { value: timeLeft.minutes, label: "MINUTES" },
    { value: timeLeft.seconds, label: "SECONDS" },
  ];

  return (
    <div className="countdown-page" style={{
      minHeight: "100vh",
      background: "#f7f5df",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', 'Rajdhani', sans-serif",
    }}>
      {/* Background image — same hero bg as landing page, subtle */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('/hero-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: "scaleX(-1)",
        opacity: 0.15,
        pointerEvents: "none",
      }} />
      {/* Cream overlay gradient */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 30%, rgba(247,245,223,0.7) 0%, #f7f5df 70%)",
        pointerEvents: "none",
      }} />

      {/* Twinkling stars like landing page */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: "absolute",
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.4)",
              opacity: star.opacity,
              animation: `twinkle ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        padding: "0 24px",
        maxWidth: "720px",
        width: "100%",
      }}>
        {/* Logo only — no text */}
        <div style={{
          marginBottom: "40px",
          animation: "countdownSlideDown 0.8s ease forwards",
        }}>
          <img
            src="/logo.png"
            alt="MINDUP"
            style={{
              height: "72px",
              margin: "0 auto",
              display: "block",
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.08))",
            }}
          />
        </div>

        {/* Heading */}
        <h1 style={{
          fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
          fontSize: "clamp(30px, 5vw, 52px)",
          fontWeight: 800,
          color: "#1a1a0a",
          lineHeight: 1.15,
          marginBottom: "16px",
          letterSpacing: "-0.5px",
          animation: "countdownSlideUp 0.8s 0.2s ease forwards",
          opacity: 0,
        }}>
          Something <span style={{ color: "#acd663" }}>Amazing</span> is Coming
        </h1>

        {/* Subheading */}
        <p style={{
          color: "rgba(26,26,10,0.5)",
          fontSize: "clamp(14px, 2vw, 17px)",
          maxWidth: "480px",
          margin: "0 auto 44px",
          lineHeight: 1.7,
          fontWeight: 500,
          animation: "countdownSlideUp 0.8s 0.35s ease forwards",
          opacity: 0,
        }}>
          We're building a smarter way to learn. Be the first to
          <br />
          experience MindUp when we launch.
        </p>

        {/* Countdown blocks */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0",
          marginBottom: "48px",
          animation: "countdownSlideUp 0.8s 0.5s ease forwards",
          opacity: 0,
        }}>
          {blocks.map((b, i) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  className="countdown-block"
                  style={{
                    background: "rgba(26,26,10,0.85)",
                    border: "1px solid rgba(172,214,99,0.25)",
                    borderRadius: "16px",
                    padding: "20px 10px",
                    minWidth: "82px",
                    transition: "all 0.3s ease",
                    cursor: "default",
                  }}
                >
                  <div style={{
                    fontFamily: "'Orbitron', 'Rajdhani', sans-serif",
                    fontSize: "clamp(30px, 4vw, 46px)",
                    fontWeight: 700,
                    color: "#f0ecd0",
                    lineHeight: 1,
                  }}>
                    {pad(b.value)}
                  </div>
                </div>
                <div style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "3px",
                  color: "rgba(26,26,10,0.3)",
                  marginTop: "12px",
                  fontFamily: "'Inter', sans-serif",
                }}>
                  {b.label}
                </div>
              </div>
              {i < blocks.length - 1 && (
                <span style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "clamp(26px, 3.5vw, 38px)",
                  fontWeight: 700,
                  color: "rgba(26,26,10,0.25)",
                  padding: "0 10px",
                  marginBottom: "28px",
                  animation: "colonPulse 1s ease-in-out infinite",
                }}>:</span>
              )}
            </div>
          ))}
        </div>

        {/* Email form */}
        <div style={{
          animation: "countdownSlideUp 0.8s 0.65s ease forwards",
          opacity: 0,
        }}>
          {submitted ? (
            <div style={{
              background: "linear-gradient(135deg, rgba(172,214,99,0.2) 0%, rgba(172,214,99,0.08) 100%)",
              border: "1px solid rgba(172,214,99,0.4)",
              borderRadius: "16px",
              padding: "20px 32px",
              maxWidth: "480px",
              margin: "0 auto 16px",
            }}>
              <p style={{ color: "#5a7a20", fontWeight: 700, fontSize: "15px", margin: 0 }}>
                🎉 You're on the list! We'll notify you at launch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="countdown-form"
              style={{
                display: "flex",
                gap: "0",
                maxWidth: "480px",
                margin: "0 auto 16px",
                background: "rgba(26,26,10,0.85)",
                border: "1px solid rgba(172,214,99,0.2)",
                borderRadius: "14px",
                overflow: "hidden",
                transition: "border-color 0.3s ease",
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                padding: "0 16px",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(240,236,208,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "16px 12px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#f0ecd0",
                    fontSize: "14px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </div>
              <button
                type="submit"
                className="countdown-btn"
                style={{
                  padding: "16px 28px",
                  background: "#acd663",
                  border: "none",
                  color: "#1a1a0a",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Notify Me
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </form>
          )}
          <p style={{ color: "rgba(26,26,10,0.35)", fontSize: "13px", marginTop: "8px" }}>
            No spam, ever. We'll only email you before launch.
          </p>
        </div>

        {/* Footer */}
        <p style={{
          color: "rgba(26,26,10,0.2)",
          fontSize: "12px",
          marginTop: "56px",
          animation: "countdownSlideUp 0.8s 0.8s ease forwards",
          opacity: 0,
        }}>
          © 2026 MindUp. All rights reserved.
        </p>
      </div>

      {/* Scoped animations & hover styles */}
      <style>{`
        @keyframes countdownSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes countdownSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes colonPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.7; }
        }
        .countdown-block:hover {
          transform: translateY(-4px);
          border-color: rgba(172,214,99,0.5) !important;
          box-shadow: 0 8px 32px rgba(172,214,99,0.15);
        }
        .countdown-form:focus-within {
          border-color: rgba(172,214,99,0.45) !important;
          box-shadow: 0 0 20px rgba(172,214,99,0.08);
        }
        .countdown-btn:hover {
          background: #96ba50 !important;
          box-shadow: 0 4px 20px rgba(172,214,99,0.3);
          transform: translateY(-1px);
        }
        .countdown-page input::placeholder {
          color: rgba(240,236,208,0.3) !important;
        }
        @media (max-width: 480px) {
          .countdown-block {
            min-width: 60px !important;
            padding: 14px 6px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Countdown;
