import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="MindUp Logo" className="w-9 h-9 object-contain group-hover:scale-110 transition-all duration-300" />
          <span className="text-xl font-bold text-brown">MindUp</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            onClick={(e) => handleAnchorClick(e, '#features')}
            className="relative text-brown-light hover:text-primary transition-colors text-sm font-medium group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleAnchorClick(e, '#how-it-works')}
            className="relative text-brown-light hover:text-primary transition-colors text-sm font-medium group"
          >
            How it Works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </a>
          <a
            href="#subjects"
            onClick={(e) => handleAnchorClick(e, '#subjects')}
            className="relative text-brown-light hover:text-primary transition-colors text-sm font-medium group"
          >
            Subjects
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" asChild className="hover:bg-primary/10">
            <Link to="/auth">Log In</Link>
          </Button>
          <Button variant="default" asChild className="shadow-md hover:shadow-lg hover:scale-105 transition-all">
            <Link to="/auth?mode=signup">Get Started</Link>
          </Button>
        </div>

        <button
          className="md:hidden text-brown hover:text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-lg border-b border-border px-6 py-4 space-y-3 animate-fade-in-up">
          <a
            href="#features"
            onClick={(e) => handleAnchorClick(e, '#features')}
            className="block text-brown-light hover:text-primary text-sm font-medium py-2 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleAnchorClick(e, '#how-it-works')}
            className="block text-brown-light hover:text-primary text-sm font-medium py-2 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#subjects"
            onClick={(e) => handleAnchorClick(e, '#subjects')}
            className="block text-brown-light hover:text-primary text-sm font-medium py-2 transition-colors"
          >
            Subjects
          </a>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" asChild className="flex-1">
              <Link to="/auth">Log In</Link>
            </Button>
            <Button variant="default" asChild className="flex-1">
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
