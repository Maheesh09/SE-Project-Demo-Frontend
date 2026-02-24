import { BookOpen, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-secondary-foreground">MindUp</span>
            </div>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mb-4">
              A premier gamified learning platform designed to make education engaging and effective.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {[
                { icon: Github, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-secondary-foreground/10 hover:bg-primary flex items-center justify-center text-secondary-foreground hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                  aria-label="Social link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Platform", links: [{ text: "Features", href: "#features" }, { text: "Subjects", href: "#subjects" }, { text: "Pricing", href: "#pricing" }, { text: "About", href: "#about" }] },
            { title: "Support", links: [{ text: "Help Center", href: "#" }, { text: "Contact Us", href: "#" }, { text: "FAQ", href: "#" }, { text: "Community", href: "#" }] },
            { title: "Legal", links: [{ text: "Privacy Policy", href: "#" }, { text: "Terms of Service", href: "#" }, { text: "Cookie Policy", href: "#" }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-semibold text-secondary-foreground mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-secondary-foreground/60 hover:text-primary text-sm transition-colors inline-block hover:translate-x-1 duration-200"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center text-secondary-foreground/50 text-sm">
          <p>© 2026 MindUp. All rights reserved. Made with ❤️ for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
