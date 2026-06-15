# VoiceFlow AI Dashboard

> 🎤 AI-powered real-time speech transcription dashboard built with React, Vite, Nhost Auth, and Deepgram.

![VoiceFlow AI](./public/pwa-512x512.png)

## ✨ Features

- **🔐 Nhost Authentication** — Sign up, login, logout with session persistence
- **🎙️ Real-Time Speech-to-Text** — Deepgram Nova-2 live streaming transcription
- **📝 Transcript Management** — Copy, download (TXT), clear, and history
- **📊 Live Statistics** — Word count, character count, speaking timer
- **🌐 Connection Status** — Real-time WebSocket status indicator
- **🌓 Dark/Light Mode** — Toggle with localStorage persistence
- **📱 PWA Installable** — Install on mobile/desktop as native app
- **🎨 Glassmorphism UI** — Premium SaaS-quality design with Framer Motion animations
- **📱 Responsive** — Full mobile layout support

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Auth | Nhost (nhost-js) |
| Speech | Deepgram Live Streaming API |
| Routing | React Router DOM |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| PWA | vite-plugin-pwa |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- A [Nhost](https://nhost.io) account (free tier)
- A [Deepgram](https://deepgram.com) account (free tier)

### 1. Clone & Install

```bash
cd voiceflow-ai-dashboard
npm install
```

### 2. Set Up Nhost

1. Go to [nhost.io](https://nhost.io) and create a free project
2. Go to your project dashboard → **Settings**
3. Copy your **Subdomain** and **Region**
4. *(Optional)* Go to **Authentication → Settings** and disable "Require verified emails" for easier testing

### 3. Set Up Deepgram

1. Go to [deepgram.com](https://deepgram.com) and create a free account
2. Go to **API Keys** in the dashboard
3. Create a new API key with **Member** permissions
4. Copy the key

### 4. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
VITE_NHOST_SUBDOMAIN=your-nhost-subdomain
VITE_NHOST_REGION=us-east-1
VITE_DEEPGRAM_API_KEY=your-deepgram-api-key
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── auth/
│   └── ProtectedRoute.tsx      # Route guard
├── components/
│   ├── ConnectionStatus.tsx     # WebSocket status indicator
│   ├── GlassCard.tsx           # Glassmorphism card
│   ├── LoadingSpinner.tsx      # Animated spinner
│   ├── Navbar.tsx              # Top navigation
│   ├── SpeakingTimer.tsx       # Recording timer
│   ├── StatsBar.tsx            # Word/char/time stats
│   ├── TranscriptHistory.tsx   # Past sessions
│   └── TranscriptPanel.tsx     # Live transcript display
├── context/
│   ├── AuthContext.tsx          # Nhost auth state
│   ├── ThemeContext.tsx         # Dark/light mode
│   └── TranscriptContext.tsx    # Transcript state
├── hooks/
│   ├── useDeepgram.ts          # Deepgram WebSocket hook
│   └── useTimer.ts             # Speaking timer hook
├── lib/
│   └── nhost.ts                # Nhost client instance
├── pages/
│   ├── DashboardPage.tsx       # Main dashboard
│   ├── LoginPage.tsx           # Login form
│   └── SignUpPage.tsx          # Registration form
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
├── index.css                    # Global styles
└── vite-env.d.ts               # Type declarations
```

## 🌐 Vercel Deployment

### Automatic

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in the Vercel dashboard:
   - `VITE_NHOST_SUBDOMAIN`
   - `VITE_NHOST_REGION`
   - `VITE_DEEPGRAM_API_KEY`
5. Deploy!

### Manual

```bash
npm install -g vercel
vercel
```

## 📱 PWA Installation

1. Open the deployed site in Chrome/Edge
2. Look for the install icon in the address bar
3. Click "Install" to add to your home screen
4. The app works as a standalone native-like application

## ⚠️ Security Note

The Deepgram API key is exposed in client-side code. For production use:
1. Create a backend proxy endpoint
2. Use Deepgram's temporary token API (`/v1/auth/grant`)
3. Pass short-lived tokens to the client

## 📄 License

MIT
