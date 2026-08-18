import { useEffect, useRef } from 'react'

export default function Landing() {
  const ref = useRef(null)

  useEffect(() => {
    document.title = 'SomaSyncAI — The Gold Standard Clinical OS'
    
    // Ensure fallbacks for Supabase variables
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

const CSS = \`
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

#soma-root .logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--ink);
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
}

#soma-root .logo-icon {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, var(--accent), var(--blue));
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 20px var(--accent-glow);
}

#soma-root .nav-links {
  display: flex;
  gap: 30px;
}

#soma-root .nav-links a {
  text-decoration: none;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.3s;
}

#soma-root .nav-links a:hover { color: var(--accent); }

#soma-root .btn-login {
  background: var(--ink);
  color: var(--bg);
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s;
  border: 1px solid var(--ink);
}

#soma-root .btn-login:hover {
  background: transparent;
  color: var(--ink);
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

#soma-root .badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(48,217,192,0.1);
  border: 1px solid rgba(48,217,192,0.2);
  border-radius: 100px;
  color: var(--accent);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 30px;
}

#soma-root .hero-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: clamp(3.5rem, 10vw, 9rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 40px;
}

#soma-root .hero-title span {
  display: block;
}

#soma-root .hero-title .outline {
  color: transparent;
  -webkit-text-stroke: 1px var(--muted);
}

#soma-root .hero-desc {
  max-width: 600px;
  font-size: 1.1rem;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 50px;
}

#soma-root .glass-card {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 40px;
  transition: all 0.4s;
}

#soma-root .glass-card:hover {
  border-color: rgba(48,217,192,0.3);
  background: rgba(255,255,255,0.05);
  transform: translateY(-5px);
}

#soma-root .features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

#soma-root .feature-icon {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--accent);
}

#soma-root .feature-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.25rem;
  margin-bottom: 15px;
}

#soma-root .feature-text {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.6;
}

#soma-root #lead-capture {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

#soma-root .input-group {
  display: flex;
  gap: 10px;
  max-width: 500px;
  margin: 40px auto 20px;
  background: var(--dim);
  padding: 8px;
  border-radius: 100px;
  border: 1px solid var(--border);
}

#soma-root input[type="email"] {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0 25px;
  color: var(--ink);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
}

#soma-root .btn-submit {
  background: var(--accent);
  color: var(--bg);
  border: none;
  padding: 12px 30px;
  border-radius: 100px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

#soma-root .btn-submit:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--accent-glow);
}

#soma-root footer {
  padding: 60px var(--r);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--muted);
  font-size: 0.8rem;
}

#soma-root .rv {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

#soma-root .rv.in {
  opacity: 1;
  transform: none;
}

@media (max-width: 768px) {
  #soma-root .nav-links { display: none; }
  #soma-root .hero-title { font-size: 4rem; }
  #soma-root .input-group { flex-direction: column; border-radius: 20px; padding: 20px; }
  #soma-root .btn-submit { width: 100%; }
}
\`

const HTML = \`
<div class="neural-bg"></div>
<div class="grid-overlay"></div>

<nav id="nav">
  <a href="#" class="logo">
    <div class="logo-icon">S</div>
    SomaSyncAI
  </a>
  <div class="nav-links">
    <a href="#features">Features</a>
    <a href="#workflow">Workflow</a>
    <a href="#investors">Investors</a>
  </div>
  <a href="/login" class="btn-login">Member Sign In</a>
</nav>

<section id="hero">
  <div class="badge rv">Now in Private Beta</div>
  <h1 class="hero-title rv">
    <span>CLINICAL OS</span>
    <span class="outline">FOR MANUAL</span>
    <span>THERAPISTS</span>
  </h1>
  <p class="hero-desc rv">
    The first voice-first clinical documentation engine designed for hands-on practitioners. 
    Chart less, practice more, and stay present with your clients.
  </p>
  <a href="#cta" class="btn-submit rv" style="text-decoration:none">Request Access</a>
</section>

<section id="features">
  <div class="sec-tag rv" style="color:var(--accent); font-weight:800; margin-bottom:20px">01 / CAPABILITIES</div>
  <h2 class="rv" style="font-family:'Syne'; font-size:3rem; margin-bottom:40px">Built for your hands.</h2>
  <div class="features-grid">
    <div class="glass-card rv">
      <div class="feature-icon">🎙</div>
      <h3 class="feature-title">Voice Capture</h3>
      <p class="feature-text">High-fidelity ambient recording optimized for treatment rooms. No typing required.</p>
    </div>
    <div class="glass-card rv">
      <div class="feature-icon">🧠</div>
      <h3 class="feature-title">AI SOAP Notes</h3>
      <p class="feature-text">Automatically convert session audio into structured, clinical-grade SOAP notes in seconds.</p>
    </div>
    <div class="glass-card rv">
      <div class="feature-icon">🔒</div>
      <h3 class="feature-title">HIPAA Ready</h3>
      <p class="feature-text">Built-in PHI safeguards and enterprise-grade encryption for total client privacy.</p>
    </div>
  </div>
</section>

<section id="cta">
  <div id="lead-capture" class="glass-card rv" style="background: linear-gradient(135deg, rgba(48,217,192,0.05), transparent);">
    <h2 style="font-family:'Syne'; font-size:2.5rem; margin-bottom:20px">Join the Beta.</h2>
    <p style="color:var(--muted)">We're rolling out access to a select group of practitioners. Get on the list.</p>
    <form id="lead-form">
      <div class="input-group">
        <input id="lead-hp" type="text" style="display:none" tabIndex="-1" />
        <input id="lead-email" type="email" placeholder="you@practice.com" required />
        <button type="submit" class="btn-submit">Join Beta</button>
      </div>
      <div id="lead-msg" style="margin-top:15px; font-size:0.9rem"></div>
    </form>
  </div>
</section>

<footer>
  <div>© 2026 SomaSyncAI. All rights reserved.</div>
  <div style="display:flex; gap:20px">
    <a href="/privacy" style="color:inherit; text-decoration:none">Privacy</a>
    <a href="/terms" style="color:inherit; text-decoration:none">Terms</a>
  </div>
</footer>
\`

const JS = \`
(() => {
  const nav = document.getElementById('nav');
  const root = document.getElementById('soma-root');
  
  // Grid interaction
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mx', x + '%');
    document.documentElement.style.setProperty('--my', y + '%');
  });

  window.addEventListener('scroll', () => {
    nav.classList.toggle('stuck', window.scrollY > 50);
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
        btn.textContent = 'Join Beta';
      }
    });
  }
})();
\`
