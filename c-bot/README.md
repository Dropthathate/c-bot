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

## Compliance and deployment boundary

The current beta is **not authorized for PHI or client-identifying information**. Its voice-consent gate, AI-draft warnings, private dashboard, and no-PHI notices are product guardrails; they are not HIPAA certification, a legal conclusion, or an authorization to process PHI. Before any production PHI workflow is enabled, the operating organization must complete the required contracting, vendor assessment, risk analysis, deployment controls, training, and validation.

| Repository resource | Purpose |
| --- | --- |
| [`docs/BAA_TEMPLATE.md`](docs/BAA_TEMPLATE.md) | Downstream Business Associate Agreement draft for attorney review and execution. |
| [`docs/HIPAA_READINESS.md`](docs/HIPAA_READINESS.md) | HIPAA-oriented production readiness conditions and product-specific boundaries. |
| [`docs/logo-and-trust-indicator-policy.md`](docs/logo-and-trust-indicator-policy.md) | Rules for avoiding unauthorized association, school, government, and HIPAA compliance marks. |
| [`public/robots.txt`](public/robots.txt), [`public/sitemap.xml`](public/sitemap.xml), and [`public/site.webmanifest`](public/site.webmanifest) | Portable SEO/GEO discovery and official-brand favicon assets. |

The public landing page uses plain-language, non-certification trust indicators. It does **not** display AMTA, NHI, HHS, HIPAA, or other third-party logos without verified permission and an accurate basis for use. The c-bot dashboard includes a protected **Compliance** route that summarizes these operational boundaries for signed-in users.

## Clinical API boundary

The static frontend now sends speech and note-draft requests through the sibling [`../api`](../api) Express service. The browser uses its authenticated session only; transcription, model, database, and encryption credentials remain server-side. The API supports a container deployment path for AWS, a private encrypted PostgreSQL schema, Deepgram requests with `no_store=true`, and an Amazon Bedrock Claude 3 SOAP generator. See [`../api/README.md`](../api/README.md) and [`../api/deploy/AWS_DEPLOYMENT.md`](../api/deploy/AWS_DEPLOYMENT.md) before configuring any production environment.
