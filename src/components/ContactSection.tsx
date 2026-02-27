import { useState } from "react";
import { Mail, Instagram, Linkedin, Facebook, Github } from "lucide-react";

const productLinks = [
  { label: "Learning Platform", href: "#" },
  { label: "AI Tutor", href: "#" },
  { label: "Leaderboards", href: "#" },
  { label: "For Educators", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Help", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Blog", href: "#" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "For Parents", href: "#" },
];

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

const ContactSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer id="contact" className="bg-white/50 border-t border-border/40">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Logo + Quote + Newsletter */}
          <div className="lg:col-span-4">
            <a href="#home" className="inline-block mb-4">
              <img src="/logo.png" alt="MINDUP Logo" className="h-10 w-auto" />
            </a>
            <p className="text-foreground/80 text-lg font-bold leading-relaxed mb-6">
              Level Up Your Mind
            </p>

            {/* Newsletter */}
            <div className="bg-[#acd663]/5 border border-[#acd663]/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="w-4 h-4 text-[#acd663]" />
                <span className="text-sm font-bold text-foreground">Stay Updated!</span>
              </div>
              <p className="text-foreground/45 text-xs mb-3">Get launch updates & study tips</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-white/80 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-[#acd663]/40 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-foreground/10 text-foreground/60 text-sm font-semibold hover:bg-[#acd663] hover:text-black transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Product */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="font-display font-black text-foreground mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-medium text-foreground/70 hover:text-[#acd663] transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-black text-foreground mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-medium text-foreground/70 hover:text-[#acd663] transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h4 className="font-display font-black text-foreground mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-medium text-foreground/70 hover:text-[#acd663] transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-dashed border-foreground/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-foreground/40 text-sm">
            © 2026 MINDUP. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-lg border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-[#acd663] hover:border-[#acd663]/30 transition-all duration-300"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ContactSection;
