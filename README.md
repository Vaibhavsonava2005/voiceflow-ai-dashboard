# VoiceFlow AI Dashboard 🎙️🌊

![VoiceFlow AI Dashboard](https://voiceflow-ai-dashboard.vercel.app/pwa-512x512.png)

A highly advanced, production-ready Real-Time Speech-to-Text intelligence dashboard built with modern web technologies. VoiceFlow AI provides a seamless, glassmorphic UI and integrates flawlessly with Nhost for authentication and Deepgram for lightning-fast speech recognition.

## 🚀 Live Demo

**[VoiceFlow AI Live Deployment](https://voiceflow-ai-dashboard.vercel.app)**

## ✨ Features

- **Real-Time Speech-to-Text Streaming**: Powered by Deepgram's Nova-2 model via WebSocket for near-instantaneous transcription.
- **Secure Authentication**: Robust user authentication and session management using Nhost v4.
- **Glassmorphic UI**: A stunning, animated, and responsive user interface built with Tailwind CSS and Framer Motion.
- **Dark Mode Support**: Context-aware theme switching seamlessly integrated into the dashboard.
- **Progressive Web App (PWA)**: Fully installable as an offline-capable PWA on both mobile and desktop.
- **Performance Optimized**: Built with Vite and React 18, utilizing aggressive caching and chunk splitting for maximum speed.

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 & TypeScript
- **Build Tool**: Vite
- **Authentication & Backend**: Nhost / PostgreSQL
- **Speech Intelligence**: Deepgram Live API
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **PWA**: vite-plugin-pwa

## ⚙️ Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vaibhavsonava2005/voiceflow-ai-dashboard.git
   cd voiceflow-ai-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_NHOST_SUBDOMAIN=your_nhost_subdomain
   VITE_NHOST_REGION=your_nhost_region
   VITE_DEEPGRAM_API_KEY=your_deepgram_api_key
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

<div align="center">
  <b>Made by Vaibhav</b>
</div>
