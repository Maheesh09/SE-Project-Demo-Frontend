import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
];

const Navbar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(window.scrollY / 200, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const merged = scrollProgress > 0.8;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center py-3 px-4">
      <div
        className="flex items-center justify-between rounded-full px-4 py-2 w-full"
        style={{
          maxWidth: `${1400 - scrollProgress * 700}px`,
          backgroundColor: `rgba(255,255,255,${0.85 + scrollProgress * 0.15})`,
          backdropFilter: `blur(${scrollProgress * 20}px)`,
          WebkitBackdropFilter: `blur(${scrollProgress * 20}px)`,
          border: `1px solid rgba(0,0,0,${scrollProgress * 0.08})`,
          boxShadow: `0 2px ${8 * scrollProgress}px rgba(0,0,0,${scrollProgress * 0.06})`,
          transition: 'max-width 1s cubic-bezier(0.16,1,0.3,1), background-color 0.6s ease, backdrop-filter 0.6s ease, border 0.6s ease',
        }}
      >
        {/* Logo */}
        <a href="#home" className="flex items-center">
          <img src="/logo.png" alt="MINDUP Logo" className="h-8 sm:h-10 w-auto transition-all duration-500" />
        </a>

        <div
          className="hidden md:flex items-center gap-1 rounded-full px-2 py-1 transition-all duration-700"
          style={{
            backgroundColor: merged ? 'transparent' : 'rgba(255,255,255,0.06)',
            border: merged ? '1px solid transparent' : '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 lg:px-4 py-2 text-[15px] lg:text-base font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50"
            >
              {link.label}
            </a>
          ))}

          {/* Clerk Auth */}
          <SignedOut>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 text-[15px] lg:text-base font-bold rounded-full bg-[#acd663] text-black hover:bg-[#96ba50] transition-all duration-300 ml-2"
            >
              Login
            </button>
          </SignedOut>
          <SignedIn>
            <div className="ml-2">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 w-[calc(100%-2rem)] max-w-md rounded-2xl bg-background/95 backdrop-blur-md border border-border">
          <div className="flex flex-col items-center gap-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="w-full text-center px-6 py-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <SignedOut>
              <button
                onClick={() => { setMobileOpen(false); navigate("/login"); }}
                className="w-[80%] mt-2 px-6 py-2.5 rounded-full bg-[#acd663] text-black font-bold hover:bg-[#96ba50] transition-all"
              >
                Login
              </button>
            </SignedOut>
            <SignedIn>
              <div className="mt-2">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
