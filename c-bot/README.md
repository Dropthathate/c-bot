 🎧 SomaSync AI

#The First Live In-Ear Neuromuscular Assistant

Real-time, hands-free postural assessment and clinical documentation for bodywork practitioners using voice AI technology.

🌟 What is This?

SomaSync AI is a voice-controlled assistant that lives in your **Bluetooth earpiece** and helps bodywork practitioners:

- 🎤 Document hands-free** while treating clients
- 🧠 Get real-time insights** on patterns like Upper Crossed Syndrome
- 📝 Auto-generate SOAP notes** from your voice observations
- 🌐 See population trends** with SomaSphere 3D visualization
- 📚 Learn instantly** with SyncLearn contextual modules

 🎤 Voice Commands

- "Start session" - Begin recording
- "Pause" - Pause recording
- "Resume" - Continue recording
- "End session" - Finish and generate SOAP note
- "Open SomaSphere" - View 3D patterns
- "Show SyncLearn" - Access learning modules

 🎧 Why In-Ear?

Traditional documentation interrupts your workflow. SomaSync AI works through a wireless earpiece so:

✅ Both hands stay free for treatment
✅ Private audio feedback only you hear
✅ Document while you work, not after
✅ No tablets or keyboards on the treatment table

 🚀 Status

Under Active Development - Building the first live in-ear neuromuscular assistant for bodywork professionals.

 Planned Features:
- [ ] Voice-controlled SOAP/DAP note generation
- [ ] Real-time pattern recognition (TCM + Western anatomy)
- [ ] ICD-10 code suggestions
- [ ] SomaSphere 3D visualization
- [ ] SyncLearn educational modules
- [ ] Bluetooth earpiece integration

 🛠️ Tech Stack

- Voice: Web Speech API
- Frontend: React + TailwindCSS
- 3D: Three.js
- AI: GPT-4/Claude for pattern recognition

 📄 License

MIT License - Open Source

---

**Made with ❤️ for bodywork practitioners worldwide**

⭐ Star this repo if you're interested in voice-first clinical documentation!

## Production Source and Verification Guide

This directory is the **active Vercel project root** for the public `www.somasyncai.com` deployment. Public-site changes must be made here, not in the repository's legacy or duplicate source directories.

| Area | Location | Purpose |
|---|---|---|
| Public marketing site | `src/Landing.jsx` | Public landing page, beta waitlist, investor link, and footer navigation. |
| Public routes | `src/main.jsx` | Routes for the landing page, About page, member sign-in, and therapist application. |
| Member sign-in | `src/pages/Auth.tsx` | Invitation-only beta member sign-in interface. Self-service registration is intentionally not exposed in the UI. |
| Public legal pages | `public/*.html` | Privacy policy, terms, AI disclaimer, and investor pitch content. |
| Deployment/security configuration | `vercel.json` | Build settings, SPA fallback, and response-security headers. |
| Browser regression checks | `tests/public-routes.spec.mjs` | Public-route and critical-flow smoke tests. |

### Local validation

The application requires public Supabase configuration at build time. Use non-production placeholder values for UI-only route validation; do not commit credentials.

```bash
cd c-bot
npm ci
VITE_SUPABASE_URL='https://example.supabase.co' \
VITE_SUPABASE_PUBLISHABLE_KEY='local-validation-key' \
npm run build
npm run test:routes
```

### Deployment guardrails

The browser test suite runs in continuous integration for changes that affect this application or its deployment configuration. It verifies that public routes have page-specific content, the beta CTA reaches the waitlist, legal pages resolve, and the invitation-only sign-in page remains available.

> **Operational note:** The sign-in page intentionally does not offer self-service registration. To enforce invitation-only access at the identity-provider layer as well, keep public sign-up disabled in the Supabase Auth dashboard and provision or invite beta members through the approved internal process.
