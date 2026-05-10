<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# JSTeam - Run and deploy your AI Studio app

This is a modern React + Vite application powered by Google Gemini AI, ready to deploy on Vercel.

**Live Demo:** https://js-team.vercel.app  
**View in AI Studio:** https://ai.studio/apps/15ef0bf1-d9f7-4d08-8cb3-cf95f34c2462

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- npm or yarn
- Gemini API Key ([Get here](https://aistudio.google.com))

### Run Locally

1. **Clone & Install:**
   ```bash
   git clone https://github.com/whylaugh707-arch/JSTeam.git
   cd JSTeam
   npm install
   ```

2. **Setup Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Check TypeScript types
- `npm run clean` - Remove build artifacts

## 🌐 Deploy to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push your changes to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Add Environment Variables:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your Gemini API key
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

Then add your `GEMINI_API_KEY` when prompted or in the Vercel dashboard.

## 🛠 Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4 + Framer Motion
- **AI:** Google Gemini API
- **Backend:** Express.js
- **Hosting:** Vercel

## 📁 Project Structure

```
JSTeam/
├── src/               # React components & pages
├── dist/              # Production build (Vercel deploys this)
├── server.ts          # Express backend
├── package.json       # Dependencies
├── vite.config.ts     # Vite configuration
├── tsconfig.json      # TypeScript configuration
├── vercel.json        # Vercel deployment config
└── .env.example       # Environment variables template
```

## ⚙️ Environment Variables

### Required
- `GEMINI_API_KEY` - Your Google Gemini API key from [aistudio.google.com](https://aistudio.google.com)

## 🐛 Troubleshooting

**API Key Error?**
- Ensure `GEMINI_API_KEY` is set in `.env.local`
- Check that the API key is valid at [aistudio.google.com](https://aistudio.google.com)

**Build failing on Vercel?**
- Clear build cache: Vercel Dashboard → Settings → Git → Clear all builds
- Check build logs in Vercel Dashboard
- Ensure all environment variables are set

**Port already in use?**
- Change port in `server.ts` or run: `npm run dev -- --port 3001`

## 📄 License

MIT

## 📞 Support

For issues or questions:
- GitHub Issues: [Create Issue](https://github.com/whylaugh707-arch/JSTeam/issues)
- Gemini API Docs: [documentation](https://ai.google.dev/docs)
