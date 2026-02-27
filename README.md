# MINDUP — Level Up Your Mind 🧠

A gamified self-learning platform that makes education feel like playing. Built with modern web technologies and designed with a premium, animated UI.

**🌐 Domain:** [mindup.lk](https://mindup.lk)

---

## ✨ Features

- **Gamified Learning** — XP, badges, streaks, and leaderboards
- **AI-Powered Tutor** — Personalized learning paths that adapt to your pace
- **Weekly Leaderboard** — Compete with learners and earn real merch rewards
- **Clerk Authentication** — Secure login/signup with Google, email, and more
- **Countdown Page** — Coming soon page at `/countdown`

## 🛠 Tech Stack

| Technology        | Purpose                  |
| ----------------- | ------------------------ |
| **React 18**      | UI framework             |
| **TypeScript**    | Type safety              |
| **Vite**          | Build tool & dev server  |
| **Tailwind CSS**  | Utility-first styling    |
| **Framer Motion** | Animations & transitions |
| **Clerk**         | Authentication           |
| **shadcn/ui**     | UI components            |
| **Lucide React**  | Icons                    |

## 🎨 Design

- **Background:** `#f7f5df` (warm cream)
- **Accent:** `#acd663` (fresh green)
- **Text:** Dark black/gray on light background
- **Style:** Glassmorphism, micro-animations, hover effects, floating orbs

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Maheesh09/SE-Project-Demo-Frontend.git
cd SE-Project-Demo-Frontend

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your Clerk publishable key:
# VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Start dev server
npm run dev
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.tsx           # Navigation with Clerk auth
│   ├── HeroSection.tsx      # Hero with typing animation buttons
│   ├── AboutSection.tsx     # "Why MINDUP?" features section
│   ├── EventsSection.tsx    # Leaderboard + merch rewards
│   ├── BlogsSection.tsx     # Testimonials carousel
│   ├── BoardSection.tsx     # Pricing (it's all free!)
│   └── ContactSection.tsx   # Footer with newsletter
├── pages/
│   ├── Index.tsx            # Main landing page
│   ├── Countdown.tsx        # Coming soon countdown
│   └── NotFound.tsx         # 404 page
└── App.tsx                  # Routes + ClerkProvider
```

## 📦 Deployment

```bash
npm run build
```

Deploy the `dist/` folder to Vercel, Netlify, or Cloudflare Pages, then point your domain DNS accordingly.

## 👨‍💻 Team

MINDUP — by SEDS SLIIT

---

© 2026 MINDUP. All rights reserved.
