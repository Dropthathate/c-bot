import { useEffect, useRef } from 'react'

export default function Landing() {
  const ref = useRef(null)

  useEffect(() => {
    document.title = 'SomaSyncAI — The Gold Standard Clinical OS for Manual Therapists'
    
    // Supabase config
    window.__SOMA_SUPABASE_URL__ = import.meta.env.VITE_SUPABASE_URL || "https://ucqprtpuuyflnxjmatwo.supabase.co"
    window.__SOMA_SUPABASE_KEY__ = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcXBydHB1dXlmbG54am1hdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NjMzMjYsImV4cCI6MjA4ODEyMzMyNn0.rU855zMtb1ZFQgLx5aBUdWd5R8mjmLCwEmmx6KuJvwk"

    if (!document.getElementById('soma-fonts')) {
      const link = document.createElement('link')
      link.id = 'soma-fonts'
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@200;300;400;500;600;700&display=swap'
      document.head.appendChild(link)
    }

    if (!document.getElementById('soma-styles')) {
      const style = document.createElement('style')
      style.id = 'soma-styles'
      style.textContent = CSS
      document.head.appendChild(style)
    }

    let script
    if (ref.current) {
      ref.current.innerHTML = HTML
      script = document.createElement('script')
      script.textContent = JS
      document.body.appendChild(script)
    }

    return () => {
      script?.remove()
      const el = document.getElementById('soma-styles')
      if (el) el.remove()
    }
  }, [])

  return (
    <div
      id="soma-root"
      ref={ref}
      style={{
        all: 'initial',
        display: 'block',
        fontFamily: 'Manrope, sans-serif',
        background: '#050505',
        color: '#f0ede8',
        minHeight: '100vh'
      }}
    />
  )
}

const CSS = `
#soma-root, #soma-root *::before, #soma-root *::after {box-sizing:border-box;margin:0;padding:0}
#soma-root {
  --bg: #050505;
  --ink: #f0ede8;
  --muted: rgba(240,237,232,0.4);
  --dim: rgba(255,255,255,0.03);
  --border: rgba(255,255,255,0.08);
  --accent: #30d9c0;
  --accent-glow: rgba(48,217,192,0.2);
  --blue: #3b9eff;
  --blue-glow: rgba(59,158,255,0.25);
  --grn: #00e89a;
  --r: clamp(20px, 6vw, 100px);
  scroll-behavior: smooth;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Manrope', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

#soma-root .neural-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: 
    radial-gradient(circle at 50% -20%, rgba(48,217,192,0.08) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(59,158,255,0.05) 0%, transparent 40%);
}

#soma-root .grid-overlay {
  position: fixed;
  inset: 0;
  background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 80%);
  opacity: 0.4;
  z-index: 1;
}

#soma-root nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px var(--r);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

#soma-root nav.stuck {
  padding: 15px var(--r);
  background: rgba(5,5,5,0.7);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

#soma-root .n-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--ink);
}

#soma-root .n-logo img {
  height: 38px;
  width: auto;
  filter: drop-shadow(0 0 8px rgba(59,158,255,0.4));
}

#soma-root .n-pill {
  display: flex;
  gap: 30px;
  background: rgba(255,255,255,0.05);
  padding: 8px 24px;
  border-radius: 100px;
  border: 1px solid var(--border);
}

#soma-root .n-pill a {
  text-decoration: none;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.3s;
}

#soma-root .n-pill a:hover { color: var(--accent); }

#soma-root .n-cta {
  background: var(--blue);
  color: #fff;
  padding: 12px 28px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 0 20px rgba(59,158,255,0.2);
}

#soma-root .n-cta:hover {
  background: #1a7ee0;
  transform: scale(1.05);
}

#soma-root section {
  position: relative;
  z-index: 2;
  padding: 100px var(--r);
}

#soma-root #hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding-top: 160px;
}

#soma-root .hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(59,158,255,0.1);
  border: 1px solid rgba(59,158,255,0.2);
  border-radius: 100px;
  color: var(--blue);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 30px;
}

#soma-root .hero-h1 {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(3.5rem, 10vw, 9rem);
  line-height: 0.85;
  letter-spacing: -0.04em;
  margin-bottom: 40px;
}

#soma-root .hero-h1 .out {
  color: transparent;
  -webkit-text-stroke: 1px var(--muted);
}

#soma-root .hero-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#soma-root .hero-top-stats {
  position: absolute;
  top: 160px;
  right: var(--r);
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: right;
}

#soma-root .ts-n { font-family: 'Syne'; font-size: 2rem; font-weight: 800; }
#soma-root .ts-n span { color: var(--grn); }
#soma-root .ts-l { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; }

#soma-root .sec-tag {
  color: var(--blue);
  font-weight: 800;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

#soma-root .sec-tag::before {
  content: '';
  width: 30px;
  height: 2px;
  background: var(--blue);
}

#soma-root .sec-h {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1;
  margin-bottom: 30px;
}

#soma-root .sec-h .g { color: var(--blue); }

#soma-root .sec-sub {
  max-width: 600px;
  color: var(--muted);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 60px;
}

#soma-root .feat-grid, #soma-root .how-grid, #soma-root .road-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

#soma-root .feat-card, #soma-root .how-card, #soma-root .road-card, #soma-root .why-item {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px;
  transition: all 0.4s;
}

#soma-root .feat-card:hover, #soma-root .how-card:hover, #soma-root .road-card:hover {
  border-color: rgba(48,217,192,0.3);
  background: rgba(255,255,255,0.05);
  transform: translateY(-5px);
}

#soma-root .feat-ico { font-size: 2.5rem; margin-bottom: 20px; }
#soma-root .feat-title, #soma-root .how-t, #soma-root .road-t, #soma-root .why-t {
  font-family: 'Syne';
  font-size: 1.25rem;
  margin-bottom: 15px;
}
#soma-root .feat-desc, #soma-root .how-d, #soma-root .road-items, #soma-root .why-d {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

#soma-root .feat-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--grn);
  background: rgba(0,232,154,0.1);
  padding: 4px 12px;
  border-radius: 100px;
  margin-top: 20px;
}

#soma-root .how-n, #soma-root .why-n {
  font-family: 'Syne';
  font-size: 3rem;
  color: var(--blue);
  opacity: 0.3;
  margin-bottom: 10px;
}

#soma-root .road-live {
  color: var(--grn);
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 10px;
}

#soma-root .road-phase {
  color: var(--muted);
  font-size: 0.8rem;
  margin-bottom: 5px;
}

#soma-root .inv-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

#soma-root .why-list { display: flex; flex-direction: column; gap: 20px; }
#soma-root .inv-stats { display: flex; flex-direction: column; gap: 20px; }
#soma-root .inv-stat {
  background: var(--dim);
  padding: 30px;
  border-radius: 20px;
  text-align: center;
}
#soma-root .inv-n { font-family: 'Syne'; font-size: 2.5rem; color: var(--accent); }
#soma-root .inv-l { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; }

#soma-root .deck-link {
  display: inline-block;
  margin-top: 40px;
  color: var(--blue);
  text-decoration: none;
  font-weight: 700;
}

#soma-root #cta { text-align: center; }
#soma-root .cta-h { font-family: 'Syne'; font-size: clamp(3rem, 8vw, 6rem); line-height: 1; margin-bottom: 30px; }
#soma-root .cta-h .out { color: transparent; -webkit-text-stroke: 1px var(--muted); }
#soma-root .cta-sub { color: var(--muted); margin-bottom: 40px; }

#soma-root .cta-btns {
  display: flex;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto;
  background: var(--dim);
  padding: 8px;
  border-radius: 100px;
  border: 1px solid var(--border);
}

#soma-root .cta-b1 {
  background: var(--accent);
  color: var(--bg);
  padding: 12px 30px;
  border-radius: 100px;
  font-weight: 700;
  transition: all 0.3s;
}

#soma-root footer {
  padding: 80px var(--r);
  border-top: 1px solid var(--border);
}

#soma-root .foot-top {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 60px;
  margin-bottom: 60px;
}

#soma-root .foot-col-h { font-family: 'Syne'; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 20px; color: var(--ink); }
#soma-root .foot-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
#soma-root .foot-links a { color: var(--muted); text-decoration: none; font-size: 0.9rem; }
#soma-root .foot-bottom { display: flex; justify-content: space-between; color: var(--muted); font-size: 0.8rem; }

#soma-root .rv {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

#soma-root .rv.in {
  opacity: 1;
  transform: none;
}

@media (max-width: 1024px) {
  #soma-root .inv-grid { grid-template-columns: 1fr; }
  #soma-root .foot-top { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  #soma-root .n-pill { display: none; }
  #soma-root .hero-h1 { font-size: 4rem; }
  #soma-root .hero-top-stats { position: static; text-align: center; margin-bottom: 40px; }
  #soma-root .cta-btns { flex-direction: column; border-radius: 20px; padding: 20px; }
}
`

const HTML = `
<div class="neural-bg"></div>
<div class="grid-overlay"></div>

<nav id="nav">
  <a class="n-logo" href="#">
    <img src="./ss.png" alt="SomaSyncAI" />
  </a>
  <div class="n-pill">
    <a href="#features">Features</a>
    <a href="#roadmap">Roadmap</a>
    <a href="#how">Workflow</a>
    <a href="#investors">Investors</a>
  </div>
  <a class="n-cta" href="/login">Join Beta — Free</a>
</nav>

<section id="hero">
  <div class="hero-top-stats">
    <div><div class="ts-n"><span>87</span>%</div><div class="ts-l">Less charting</div></div>
    <div><div class="ts-n"><span>100</span>%</div><div class="ts-l">Hands-free</div></div>
  </div>
  <div class="hero-inner">
    <div class="hero-badge">Now in Beta — Limited Access</div>
    <h1 class="hero-h1">THE <span class="out">GOLD</span><br><span style="color:var(--blue);text-shadow:0 0 80px var(--blue-glow)">STANDARD</span><br>CLINICAL <span class="out">OS</span></h1>
    <div class="rv" style="margin-top:24px;font-family:'Syne',sans-serif;font-size:clamp(.9rem,1.5vw,1.2rem);font-weight:700;letter-spacing:.04em;color:var(--muted)">The Intelligence of You.</div>
  </div>
</section>

<section id="features">
  <div class="sec-tag">Features</div>
  <h2 class="sec-h rv">Everything you need,<br><span class="g">nothing you don't</span></h2>
  <p class="sec-sub rv">Purpose-built for manual therapy documentation — not a repurposed generic medical EHR.</p>
  <div class="feat-grid">
    <div class="feat-card rv"><div class="feat-ico">🎙</div><div class="feat-title">Hands-Free Voice Capture</div><div class="feat-desc">Talk naturally during a session — no typing, no pausing to take notes.</div><div class="feat-live">Live in Beta</div></div>
    <div class="feat-card rv"><div class="feat-ico">🧠</div><div class="feat-title">AI-Structured SOAP Notes</div><div class="feat-desc">Your session is organized into Subjective, Objective, Assessment, and Plan automatically.</div><div class="feat-live">Live in Beta</div></div>
    <div class="feat-card rv"><div class="feat-ico">🔎</div><div class="feat-title">ICD-10 Reference Lookup</div><div class="feat-desc">Search diagnostic codes for reference — always confirmed with the prescribing provider before use.</div></div>
    <div class="feat-card rv"><div class="feat-ico">🔒</div><div class="feat-title">Built-In PHI Safeguards</div><div class="feat-desc">Clear on-screen reminders to keep identifying client details out of AI-processed notes.</div></div>
    <div class="feat-card rv"><div class="feat-ico">📋</div><div class="feat-title">Session History</div><div class="feat-desc">Every note saved, searchable, and editable — review and refine any past documentation.</div></div>
    <div class="feat-card rv"><div class="feat-ico">⚡</div><div class="feat-title">Minutes, Not Hours</div><div class="feat-desc">Confirm a structured note in seconds instead of typing it from scratch after every session.</div></div>
  </div>
</section>

<section id="how">
  <div class="sec-tag">How It Works</div>
  <h2 class="sec-h rv">From session<br><span class="g">to note</span></h2>
  <p class="sec-sub rv">Four steps. No charting pile-up at the end of the day.</p>
  <div class="how-grid">
    <div class="how-card rv"><div class="how-n">01</div><div class="how-t">Speak</div><div class="how-d">Start a session and talk naturally while you work with your client.</div></div>
    <div class="how-card rv"><div class="how-n">02</div><div class="how-t">AI Structures It</div><div class="how-d">Your session is organized into a standard SOAP note automatically.</div></div>
    <div class="how-card rv"><div class="how-n">03</div><div class="how-t">Review</div><div class="how-d">Every AI draft is reviewed and confirmed by you — your clinical judgment, always.</div></div>
    <div class="how-card rv"><div class="how-n">04</div><div class="how-t">Done</div><div class="how-d">Your note is saved and ready — confirmed in seconds, not typed for minutes.</div></div>
  </div>
</section>

<section id="roadmap">
  <div class="sec-tag">Roadmap</div>
  <h2 class="sec-h rv">Where we're<br><span class="g">headed</span></h2>
  <p class="sec-sub rv">Built with practitioners, in the open.</p>
  <div class="road-grid">
    <div class="road-card rv"><div class="road-live">Live Now</div><div class="road-phase">Phase 1 — Beta</div><div class="road-t">Voice-to-SOAP Documentation</div><ul class="road-items"><li>Hands-free session recording</li><li>AI-structured SOAP notes</li><li>Reference-only ICD-10 lookup</li></ul></div>
    <div class="road-card rv"><div class="road-phase">Phase 2 — Next</div><div class="road-t">Analytics & Practice Insights</div><ul class="road-items"><li>Documentation time savings</li><li>Session trends</li><li>Coding-accuracy tracking</li></ul></div>
    <div class="road-card rv"><div class="road-phase">Phase 3 — Planned</div><div class="road-t">Technique Library</div><ul class="road-items"><li>Searchable manual therapy techniques</li><li>Evidence-based references</li></ul></div>
    <div class="road-card rv"><div class="road-phase">Phase 4 — Planned</div><div class="road-t">Team Accounts</div><ul class="road-items"><li>Multi-practitioner practices</li><li>Shared client records</li><li>Role-based access</li></ul></div>
  </div>
</section>

<section id="investors">
  <div class="sec-tag">Investors</div>
  <h2 class="sec-h rv">Built for a market<br><span class="g">no one's served</span></h2>
  <div class="inv-grid">
    <div class="why-list">
      <div class="why-item rv"><div class="why-n">01</div><div><div class=\"why-t\">Underserved by generic EHRs</div><div class=\"why-d\">Manual therapy has been forced into documentation tools built for physicians, not bodyworkers.</div></div></div>
      <div class="why-item rv"><div class="why-n">02</div><div><div class=\"why-t\">Voice-first, not form-first</div><div class=\"why-d\">Practitioners' hands are on clients, not keyboards — SomaSync AI is built around that reality.</div></div></div>
      <div class="why-item rv"><div class="why-n">03</div><div><div class=\"why-t\">Compliance-aware by design</div><div class=\"why-d\">Reference-only diagnostic coding and PHI safeguards built in from day one, not bolted on later.</div></div></div>
    </div>
    <div class="inv-stats">
      <div class="inv-stat rv"><div class="inv-n">Beta</div><div class="inv-l">Currently Live</div></div>
      <div class="inv-stat rv"><div class="inv-n">4</div><div class="inv-l">Roadmap Phases</div></div>
    </div>
  </div>
  <a class="deck-link rv" href="/investor-pitch.html">View Pitch Deck →</a>
</section>

<section id="cta">
  <div class="sec-tag" style="justify-content:center">Join the Beta</div>
  <h2 class="cta-h rv">Chart <span class="g">less.</span><br>Practice <span class="out">more.</span></h2>
  <p class="cta-sub rv">Limited access beta. Get early updates and an invite when a spot opens up.</p>
  <form id="lead-form" class="cta-btns rv">
    <input id="lead-hp" type="text" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;width:1px;height:1px" aria-hidden="true" />
    <input id="lead-email" type="email" required placeholder="you@practice.com" style="flex:1;background:transparent;border:none;padding:0 25px;color:var(--ink);font-family:inherit;font-size:0.95rem;outline:none" />
    <button type="submit" class="cta-b1" style="border:none;cursor:pointer">Join Beta — Free</button>
  </form>
  <div id="lead-msg" style="margin-top:15px; font-size:0.9rem"></div>
</section>

<footer>
  <div class="foot-top">
    <div>
      <div class="foot-brand"><img src="./ss.png" alt="SomaSyncAI" /></div>
      <div class="foot-tag">Clinical documentation at the speed of conversation, for manual therapy practitioners.</div>
    </div>
    <div>
      <div class="foot-col-h">Product</div>
      <ul class="foot-links"><li><a href="#features">Features</a></li><li><a href="#how">Workflow</a></li><li><a href="#roadmap">Roadmap</a></li></ul>
    </div>
    <div>
      <div class="foot-col-h">Company</div>
      <ul class="foot-links"><li><a href="#investors">Investors</a></li><li><a href="/about.html">About</a></li></ul>
    </div>
    <div>
      <div class="foot-col-h">Legal</div>
      <ul class="foot-links"><li><a href="/privacy">Privacy</a></li><li><a href="/terms">Terms</a></li></ul>
    </div>
  </div>
  <div class="foot-bottom">
    <div>© 2026 SomaSyncAI. All rights reserved.</div>
    <div>Powered by AALIYAH.IO</div>
  </div>
</footer>
`

const JS = `
(() => {
  const nav = document.getElementById('nav');
  
  // Grid interaction
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mx', x + '%');
    document.documentElement.style.setProperty('--my', y + '%');
  });

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('stuck', window.scrollY > 50);
  });

  // Reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.rv').forEach(el => observer.observe(el));

  // Lead Form
  const leadForm = document.getElementById('lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const hp = document.getElementById('lead-hp').value;
      if (hp) return;

      const email = document.getElementById('lead-email').value;
      const msg = document.getElementById('lead-msg');
      const btn = leadForm.querySelector('button');

      btn.disabled = true;
      btn.textContent = 'Processing...';

      try {
        const res = await fetch(window.__SOMA_SUPABASE_URL__ + '/rest/v1/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': window.__SOMA_SUPABASE_KEY__,
            'Authorization': 'Bearer ' + window.__SOMA_SUPABASE_KEY__,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ email })
        });

        if (!res.ok) throw new Error('Failed');

        msg.textContent = "Success! You're on the list.";
        msg.style.color = '#30d9c0';
        leadForm.reset();
      } catch (err) {
        msg.textContent = "Error. Please try again later.";
        msg.style.color = '#ff453a';
        btn.disabled = false;
        btn.textContent = 'Join Beta — Free';
      }
    });
  }
})();
`
