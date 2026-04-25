// ── StudentSection.jsx ────────────────────────────────────────────────────
// Drop this inside Landing.jsx right after the closing </section> of the hero
// Import it at the top: import StudentSection from './StudentSection'
// Then add <StudentSection /> wherever you want it in the JSX
// ─────────────────────────────────────────────────────────────────────────

export default function StudentSection() {
  return (
    <>
      <style>{CSS}</style>

      {/* ── HERO VISUAL BANNER ── */}
      <div className="ss-hero-banner">
        <div className="ss-hero-bg" />
        <div className="ss-hero-inner">
          <div className="ss-hero-left">
            <div className="ss-hero-tag">
              <span className="ss-tag-dot" />
              For Massage Therapy Students
            </div>
            <h2 className="ss-hero-h2">
              Graduate<br />
              <span className="ss-hero-accent">Ready</span><br />
              for Business
            </h2>
            <p className="ss-hero-sub">
              Professional branding, websites, and launch tools built specifically
              for students — at prices that make sense before you start earning.
            </p>
            <div className="ss-hero-stats">
              <div className="ss-stat">
                <div className="ss-stat-num">$49</div>
                <div className="ss-stat-label">Entry package</div>
              </div>
              <div className="ss-stat-divider" />
              <div className="ss-stat">
                <div className="ss-stat-num">3</div>
                <div className="ss-stat-label">Tiers available</div>
              </div>
              <div className="ss-stat-divider" />
              <div className="ss-stat">
                <div className="ss-stat-num">24h</div>
                <div className="ss-stat-label">Turnaround</div>
              </div>
            </div>
            <a href="/compare.html" className="ss-hero-cta">
              Compare All Packages →
            </a>
          </div>
          <div className="ss-hero-right">
            {/* Animated mockup card */}
            <div className="ss-mockup">
              <div className="ss-mockup-bar">
                <div className="ss-mockup-dots">
                  <span /><span /><span />
                </div>
                <div className="ss-mockup-url">somasyncai.com/students</div>
              </div>
              <div className="ss-mockup-body">
                <div className="ss-mockup-badge">🎓 Student Pricing</div>
                <div className="ss-mockup-title">Brand Kickstart</div>
                <div className="ss-mockup-price">$49</div>
                <div className="ss-mockup-items">
                  {['Logo Design','Brand Colors','Professional Bio','Service Menu','Business Name'].map(item => (
                    <div key={item} className="ss-mockup-item">
                      <span className="ss-mockup-check">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="ss-mockup-btn">Get Started →</div>
                <div className="ss-mockup-pulse">
                  <span className="ss-pulse-dot" />
                  DROPTHEĦATE™ · Powered by Nate Santos
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PACKAGE CARDS ── */}
      <section className="ss-section" id="student-packages">
        <div className="ss-inner">

          <div className="ss-eyebrow">
            <span>🎓 Student Pricing — Limited Time</span>
          </div>

          <div className="ss-headline">
            <h2>Pick Your <em>Package</em></h2>
          </div>

          <p className="ss-sub">
            All packages are one-time payments. No subscriptions. Apply in 2 minutes
            and we follow up within 24 hours.
          </p>

          <div className="ss-cards">

            {/* STARTER */}
            <a href="/starter.html" className="ss-card green-card">
              <div className="ss-dot green" />
              <div className="ss-pkg-name">Starter</div>
              <div className="ss-pkg-title">Brand Kickstart</div>
              <div className="ss-price-row">
                <div className="ss-price green">$49</div>
                <div className="ss-price-was">$149</div>
              </div>
              <ul className="ss-features">
                <li>Basic Logo Design</li>
                <li>Brand Colors &amp; Fonts</li>
                <li>Business Name Help</li>
                <li>Professional Bio Written</li>
                <li>Service Menu Layout</li>
              </ul>
              <div className="ss-btn green">Get Started →</div>
            </a>

            {/* GROWTH */}
            <a href="/growth.html" className="ss-card blue-card popular">
              <div className="ss-popular-tag">⭐ Most Popular</div>
              <div className="ss-dot blue" />
              <div className="ss-pkg-name">Growth</div>
              <div className="ss-pkg-title">AMTA Site Upgrade</div>
              <div className="ss-price-row">
                <div className="ss-price blue">$119</div>
                <div className="ss-price-was">$299</div>
              </div>
              <ul className="ss-features">
                <li>Everything in Starter</li>
                <li>AMTA Website Redesign</li>
                <li>Homepage Optimization</li>
                <li>Booking Call-To-Action</li>
                <li>SEO + Meta Description</li>
                <li>Intake &amp; Cancellation Templates</li>
              </ul>
              <div className="ss-btn blue">Apply for Growth →</div>
            </a>

            {/* SUPER PACK */}
            <a href="/super-pack.html" className="ss-card purple-card">
              <div className="ss-dot purple" />
              <div className="ss-pkg-name">Super Pack</div>
              <div className="ss-pkg-title">Graduate Ready</div>
              <div className="ss-price-row">
                <div className="ss-price purple">$189</div>
                <div className="ss-price-was">$499</div>
              </div>
              <ul className="ss-features">
                <li>Everything in Growth</li>
                <li>Instagram Setup + 6 Posts</li>
                <li>Google Business Profile</li>
                <li>Brand Guideline Sheet</li>
                <li>30-Day Launch Strategy</li>
                <li>Priority Turnaround</li>
              </ul>
              <div className="ss-btn purple">Get Super Pack →</div>
            </a>

          </div>

          <div className="ss-bottom">
            <a href="/compare.html" className="ss-compare-link">Compare all packages side by side →</a>
            <span className="ss-divider-dot">·</span>
            <span className="ss-payment-note">💛 Super Pack: split into $99 + $90</span>
            <span className="ss-divider-dot">·</span>
            <a href="https://formspree.io/f/xdaygbyo" className="ss-compare-link">Questions? Contact us</a>
          </div>
<StudentSection />
        </div>
      </section>
    </>
  )
}

const CSS = `
/* ── HERO BANNER ─────────────────────────────────────────────── */
.ss-hero-banner {
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(255,255,255,0.06);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.ss-hero-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 80% at 0% 50%, rgba(34,197,94,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 50% 60% at 100% 50%, rgba(168,85,247,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 50% 0%, rgba(59,130,246,0.06) 0%, transparent 50%);
  pointer-events: none;
}
.ss-hero-inner {
  max-width: 1080px;
  margin: 0 auto;
  padding: 100px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
}
.ss-hero-tag {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: #22c55e;
  margin-bottom: 20px;
}
.ss-tag-dot {
  width: 6px; height: 6px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(34,197,94,0.6);
  animation: ss-pulse 2s infinite;
  display: inline-block;
}
@keyframes ss-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.ss-hero-h2 {
  font-family: 'Syne', 'Bebas Neue', sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 6vw, 5.5rem);
  line-height: 0.88;
  letter-spacing: -0.04em;
  color: #f1f5f9;
  margin-bottom: 24px;
}
.ss-hero-accent { color: #22c55e; }
.ss-hero-sub {
  font-size: 1rem;
  color: #94a3b8;
  line-height: 1.75;
  max-width: 440px;
  margin-bottom: 36px;
}
.ss-hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 36px;
}
.ss-stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #22c55e;
  line-height: 1;
}
.ss-stat-label {
  font-size: 0.72rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 4px;
}
.ss-stat-divider {
  width: 1px; height: 40px;
  background: rgba(255,255,255,0.08);
}
.ss-hero-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  background: #22c55e;
  color: #020617;
  border-radius: 100px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 0 24px rgba(34,197,94,0.3);
}
.ss-hero-cta:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(34,197,94,0.5);
}

/* ── MOCKUP CARD ─────────────────────────────────────────────── */
.ss-mockup {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05);
  animation: ss-float 4s ease-in-out infinite;
}
@keyframes ss-float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.ss-mockup-bar {
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  padding: 12px 16px;
  display: flex; align-items: center; gap: 10px;
}
.ss-mockup-dots { display: flex; gap: 5px; }
.ss-mockup-dots span {
  width: 9px; height: 9px; border-radius: 50%;
}
.ss-mockup-dots span:nth-child(1) { background: #ff5f57; }
.ss-mockup-dots span:nth-child(2) { background: #ffbd2e; }
.ss-mockup-dots span:nth-child(3) { background: #28c840; }
.ss-mockup-url {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 5px;
  padding: 4px 10px;
  font-size: 0.65rem;
  color: #64748b;
}
.ss-mockup-body { padding: 24px; }
.ss-mockup-badge {
  display: inline-block;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.25);
  color: #22c55e;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 100px;
  margin-bottom: 16px;
}
.ss-mockup-title {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: #f1f5f9;
  margin-bottom: 4px;
}
.ss-mockup-price {
  font-family: 'Syne', sans-serif;
  font-size: 2.8rem;
  font-weight: 800;
  color: #22c55e;
  line-height: 1;
  margin-bottom: 20px;
}
.ss-mockup-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.ss-mockup-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.78rem;
  color: #94a3b8;
}
.ss-mockup-check { color: #22c55e; font-size: 0.7rem; font-weight: 700; }
.ss-mockup-btn {
  background: #22c55e;
  color: #020617;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 11px;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 14px;
}
.ss-mockup-pulse {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.62rem;
  color: #475569;
  letter-spacing: 0.05em;
}
.ss-pulse-dot {
  width: 5px; height: 5px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(34,197,94,0.6);
  animation: ss-pulse 1.5s infinite;
  display: inline-block;
}

/* ── PACKAGES SECTION ────────────────────────────────────────── */
.ss-section {
  background: #020617;
  padding: 80px 24px;
  font-family: 'DM Sans', 'Manrope', sans-serif;
  position: relative;
  overflow: hidden;
}
.ss-section::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 50% -10%, rgba(34,197,94,0.08) 0%, transparent 60%);
  pointer-events: none;
}
.ss-inner { max-width: 1080px; margin: 0 auto; position: relative; }
.ss-eyebrow { text-align: center; margin-bottom: 12px; }
.ss-eyebrow span {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 18px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.25);
  border-radius: 100px;
  font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: #22c55e;
}
.ss-headline { text-align: center; margin-bottom: 16px; }
.ss-headline h2 {
  font-family: 'Syne', 'Bebas Neue', sans-serif;
  font-weight: 800;
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  line-height: 1;
  color: #f1f5f9;
  letter-spacing: 0.03em;
}
.ss-headline h2 em { font-style: normal; color: #22c55e; }
.ss-sub {
  text-align: center;
  color: #94a3b8;
  font-size: 1rem;
  max-width: 520px;
  margin: 0 auto 48px;
  line-height: 1.7;
}
.ss-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}
.ss-card {
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 32px 28px;
  display: flex; flex-direction: column;
  position: relative; overflow: hidden;
  transition: all 0.25s;
  text-decoration: none;
  color: #f1f5f9;
}
.ss-card:hover { transform: translateY(-5px); }
.ss-card.popular {
  border-color: rgba(59,130,246,0.35);
  box-shadow: 0 0 40px rgba(59,130,246,0.12);
}
.ss-card.popular:hover { box-shadow: 0 0 60px rgba(59,130,246,0.2); }
.ss-popular-tag {
  position: absolute; top: 16px; right: 16px;
  padding: 4px 12px;
  background: #3b82f6;
  border-radius: 100px;
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: white;
}
.ss-dot { width: 12px; height: 12px; border-radius: 100px; margin-bottom: 20px; flex-shrink: 0; }
.ss-dot.green { background: #22c55e; box-shadow: 0 0 12px rgba(34,197,94,0.5); }
.ss-dot.blue  { background: #3b82f6; box-shadow: 0 0 12px rgba(59,130,246,0.5); }
.ss-dot.purple{ background: #a855f7; box-shadow: 0 0 12px rgba(168,85,247,0.5); }
.ss-pkg-name {
  font-size: 0.72rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: #94a3b8; margin-bottom: 6px;
}
.ss-pkg-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem; color: #f1f5f9;
  margin-bottom: 16px; line-height: 1.2;
}
.ss-price-row { display: flex; align-items: baseline; gap: 8px; margin-bottom: 20px; }
.ss-price { font-family: 'Syne', 'Bebas Neue', sans-serif; font-size: 3rem; line-height: 1; }
.ss-price.green { color: #22c55e; }
.ss-price.blue  { color: #3b82f6; }
.ss-price.purple{ color: #a855f7; }
.ss-price-was { font-size: 0.82rem; color: #64748b; text-decoration: line-through; }
.ss-features { list-style: none; padding: 0; margin: 0 0 28px; flex: 1; }
.ss-features li {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 0.83rem; color: #94a3b8;
  padding: 7px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  line-height: 1.4;
}
.ss-features li:last-child { border-bottom: none; }
.ss-features li::before { content: '✓'; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 1px; }
.ss-card.green-card .ss-features li::before { color: #22c55e; }
.ss-card.blue-card  .ss-features li::before { color: #3b82f6; }
.ss-card.purple-card .ss-features li::before { color: #a855f7; }
.ss-btn {
  display: block; width: 100%; padding: 13px;
  border-radius: 12px;
  font-size: 0.88rem; font-weight: 700;
  text-align: center; text-decoration: none;
  transition: all 0.2s; border: none; cursor: pointer;
}
.ss-btn.green  { background: #22c55e; color: #020617; }
.ss-btn.blue   { background: #3b82f6; color: white; }
.ss-btn.purple { background: #a855f7; color: white; }
.ss-btn:hover  { opacity: 0.88; transform: translateY(-1px); }
.ss-bottom {
  display: flex; align-items: center; justify-content: center;
  gap: 20px; flex-wrap: wrap;
}
.ss-compare-link {
  font-size: 0.88rem; color: #94a3b8;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 2px;
  transition: color 0.2s;
}
.ss-compare-link:hover { color: #f1f5f9; }
.ss-divider-dot { color: rgba(255,255,255,0.15); }
.ss-payment-note { display: inline-flex; align-items: center; gap: 6px; font-size: 0.82rem; color: #f59e0b; }

@media (max-width: 900px) {
  .ss-hero-inner { grid-template-columns: 1fr; gap: 48px; padding: 70px 24px; }
  .ss-hero-right { display: none; }
  .ss-cards { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto 32px; }
  .ss-section { padding: 60px 20px; }
}
@media (max-width: 500px) {
  .ss-cards { max-width: 100%; }
  .ss-hero-h2 { font-size: 2.8rem; }
}
`
