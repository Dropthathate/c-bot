/**
 * The Operator’s Ledger: black-and-brass authority, nightlife creator ambition, and
 * precise operating systems. Every choice reinforces ownership, leverage, and action.
 */
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CircleCheck,
  FileText,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const checkoutUrl = "https://payhip.com/b/ZQbYD";

const mechanics = [
  {
    number: "01",
    title: "The Casino Matrix",
    eyebrow: "THE COMPLETE ROOM",
    copy: "Build the whole house: public attention, live interaction, paid access, recognition, and a reason to come back for the next room.",
    note: "A strategic metaphor—not gambling, wagering, or a promise of income.",
  },
  {
    number: "02",
    title: "The Ticket Show Funnel",
    eyebrow: "THE DECISION EVENT",
    copy: "Make your next offer feel like the move to make—with a defined outcome, a visible asset, and a deadline that actually means something.",
    note: "Includes the exact 72-hour pre-event sequence and host script.",
  },
  {
    number: "03",
    title: "Tip Menu Gamification",
    eyebrow: "THE PARTICIPATION MENU",
    copy: "Give the room choices that pull people into the action. Every free or paid move has a clear effect, price, and delivery rule.",
    note: "Built for transparent choices, visible delivery, and clean LIVE pacing.",
  },
  {
    number: "04",
    title: "King of the Hill",
    eyebrow: "THE RECOGNITION LAYER",
    copy: "Put real contributors on the board. Build status, shout-outs, and repeat energy without making the whole room a spending contest.",
    note: "Includes fair-board rules, badges, and a 15-minute challenge format.",
  },
];

const inclusions = [
  "The 15-page Digital Tycoon Playbook PDF",
  "The two-page Quick-Win Checklist bonus PDF",
  "Four build worksheets for the core mechanics",
  "Host scripts, menu frameworks, and a 30-day build sequence",
];

function ScrollLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="micro-link transition-colors hover:text-[#c99b4a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c99b4a]"
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0a] text-[#f7f1e4]">
      <header className="relative z-30 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-9">
          <a href="#top" className="flex items-center gap-3" aria-label="The Digital Tycoon Playbook home">
            <img
              src="/manus-storage/tycoon-operator-mark_adfd9ad4.png"
              alt="Four-part Operator’s Ledger mark"
              className="h-10 w-10 object-contain"
            />
            <span className="font-display text-[18px] tracking-[0.09em] text-[#f7f1e4]">THE TYCOON PLAYBOOK</span>
          </a>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
            <ScrollLink href="#mechanics">THE SYSTEMS</ScrollLink>
            <ScrollLink href="#inside">INSIDE THE PLAYBOOK</ScrollLink>
            <ScrollLink href="#standard">THE STANDARD</ScrollLink>
          </nav>
          <a href={checkoutUrl} className="nav-cta" target="_blank" rel="noreferrer">
            GET THE PLAYBOOK <ArrowUpRight size={15} strokeWidth={1.7} />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-ledger relative isolate overflow-hidden">
          <img
            src="/manus-storage/tycoon-hero-ledger_49b69e4c.png"
            alt="Black operator ledger, brass tokens, and premium ticket stubs"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 -z-10 bg-[#0a0a0a]/70" />
          <div className="absolute bottom-0 left-0 top-0 w-[20%] border-r border-white/10" />
          <div className="absolute bottom-0 right-[9%] top-0 hidden w-px bg-[#c99b4a]/30 lg:block" />

          <div className="mx-auto grid min-h-[740px] max-w-[1440px] grid-cols-1 px-5 pb-14 pt-12 md:px-9 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:pb-20 lg:pt-20">
            <div className="relative flex max-w-[760px] flex-col justify-between lg:pl-[6vw]">
              <div>
                <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.23em] text-[#c99b4a]">
                  <span className="h-px w-9 bg-[#c99b4a]" />
                  A DROP THE HATE BLUEPRINT / VOL. 01
                </div>
                <h1 className="mt-7 max-w-[720px] font-display text-[clamp(3.3rem,7.3vw,7.4rem)] leading-[0.83] tracking-[-0.055em] text-[#f7f1e4]">
                  Turn attention into a <em className="font-normal text-[#d7b36a]">system</em> people want to enter.
                </h1>
                <p className="mt-8 max-w-[550px] text-[17px] leading-7 text-[#ded5c4] md:text-[19px]">
                  You already know how to hold attention. This is the game board that turns that attention into paid participation, clear access, visible status, and a room people come back to ready to move.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end">
                <a href={checkoutUrl} className="primary-cta" target="_blank" rel="noreferrer">
                  <span>TAKE THE BOARD — $17</span>
                  <ArrowUpRight size={21} strokeWidth={1.5} />
                </a>
                <div className="border-l border-[#c99b4a]/50 pl-4 font-mono text-[11px] leading-5 tracking-[0.12em] text-[#d9cfbc]">
                  FOR LIVE + SUBSCRIPTION CREATORS<br />
                  <span className="text-[#c99b4a]">$17.00 USD</span> / NO WAITING / INSTANT DELIVERY
                </div>
              </div>
            </div>

            <div className="relative mt-14 flex min-h-[400px] items-end justify-center lg:mt-0 lg:justify-end">
              <div className="book-halo absolute bottom-[7%] right-[12%] h-[70%] w-[68%] border border-[#c99b4a]/30" />
              <div className="book-halo absolute bottom-[10%] right-[8%] h-[70%] w-[68%] border border-white/10" />
              <div className="relative mr-2 w-[min(72vw,390px)] rotate-[2.5deg] pb-2 lg:mr-[8%]">
                <img
                  src="/manus-storage/tycoon-book-cover-1600x2400_ad1407d4.png"
                  alt="The Digital Tycoon Playbook black-and-gold hardcover cover"
                  className="book-cover w-full"
                />
                <div className="absolute -bottom-4 -left-11 hidden border border-[#c99b4a]/60 bg-[#0a0a0a] px-4 py-3 font-mono text-[10px] tracking-[0.16em] text-[#eadfc9] shadow-2xl md:block">
                  FIELD MANUAL<br /><span className="text-[#c99b4a]">FOUR LIVE SYSTEMS</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-[6%] font-mono text-[10px] tracking-[0.24em] text-[#b9ae9c] lg:left-auto lg:right-[3%] lg:rotate-90">
                OPERATOR ISSUE / 2026
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#2d2921] bg-[#15130f] px-5 py-14 md:px-9 lg:py-18">
          <div className="mx-auto grid max-w-[1260px] grid-cols-1 overflow-hidden border border-[#3e3629] lg:grid-cols-[1.04fr_0.96fr]">
            <div className="relative min-h-[370px] overflow-hidden border-b border-[#3e3629] lg:border-b-0 lg:border-r">
              <img src="/manus-storage/tycoon-creator-room_f44f27db.png" alt="Confident adult creator entrepreneurs building a live-show strategy together" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[#090806]/20" />
              <p className="absolute left-5 top-5 border border-[#d8b45d]/65 bg-[#0a0a0a]/85 px-3 py-2 font-mono text-[10px] tracking-[0.18em] text-[#f1e6d3]">NO FREE GAME / JUST A BETTER ONE</p>
            </div>
            <div className="flex flex-col justify-between px-6 py-9 md:px-10 md:py-11">
              <div>
                <p className="section-kicker">FOR CREATORS WHO KNOW THEY ARE THE BRAND</p>
                <h2 className="mt-5 max-w-[580px] font-display text-5xl leading-[0.88] tracking-[-0.05em] text-[#f7f1e4] md:text-6xl">You are already the show. Now make the room work for you.</h2>
                <p className="mt-6 max-w-[530px] text-[16px] leading-7 text-[#cdc2b0]">No more throwing content at the wall, going LIVE with no plan, or letting your audience decide what your energy is worth. Set the role. Set the access. Set the next move.</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3 font-mono text-[10px] tracking-[0.17em] text-[#c99b4a]">
                <span>LIVE HOSTS</span><span>SUBSCRIPTION CREATORS</span><span>NIGHTLIFE ENTREPRENEURS</span>
              </div>
            </div>
          </div>
        </section>

        <section id="mechanics" className="border-y border-[#24221e] bg-[#0a0a0a]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[0.76fr_1.24fr]">
            <div className="border-b border-[#24221e] px-5 py-16 md:px-9 lg:border-b-0 lg:border-r lg:px-[max(2.25rem,8vw)] lg:py-24">
              <p className="section-kicker">THE OPERATING SYSTEM</p>
              <h2 className="mt-5 max-w-[390px] font-display text-5xl leading-[0.91] tracking-[-0.05em] text-[#f7f1e4] md:text-6xl">
                Four moves.<br />One paid room.
              </h2>
              <p className="mt-7 max-w-[380px] leading-7 text-[#c9c0b1]">
                This is not another list of “content tips.” It is a connected system that tells you what to say, what the audience does next, what they pay for, and why they return.
              </p>
              <div className="mt-10 flex items-start gap-3 border-l border-[#c99b4a] pl-4 text-sm leading-6 text-[#e9dfcc]">
                <ShieldCheck className="mt-0.5 shrink-0 text-[#c99b4a]" size={17} />
                Bold energy. Clear rules. Real value. No fake timers or mystery charges.
              </div>
            </div>
            <div className="divide-y divide-[#24221e]">
              {mechanics.map((mechanic) => (
                <article key={mechanic.number} className="mechanic-row group relative grid grid-cols-[64px_1fr] gap-4 px-5 py-9 transition-colors hover:bg-[#11110f] md:grid-cols-[100px_1fr_220px] md:gap-8 md:px-9 md:py-10">
                  <span className="font-mono text-[12px] tracking-[0.2em] text-[#c99b4a]">{mechanic.number}</span>
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-[#958a76]">{mechanic.eyebrow}</p>
                    <h3 className="mt-3 font-display text-[clamp(2.15rem,4vw,3.8rem)] leading-none tracking-[-0.045em] text-[#f7f1e4]">{mechanic.title}</h3>
                    <p className="mt-4 max-w-[580px] leading-7 text-[#cbc2b2]">{mechanic.copy}</p>
                  </div>
                  <p className="col-start-2 mt-1 border-l border-[#c99b4a]/35 pl-4 text-sm leading-6 text-[#a69b87] md:col-start-auto md:self-end">{mechanic.note}</p>
                  <ArrowDownRight className="absolute right-6 top-9 text-[#c99b4a] opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:opacity-100" size={20} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="inside" className="bg-[#f2eadb] px-5 py-20 text-[#171511] md:px-9 lg:py-28">
          <div className="mx-auto max-w-[1260px]">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <div>
                <p className="section-kicker-dark">THE FIELD MANUAL</p>
                <h2 className="mt-5 font-display text-6xl leading-[0.86] tracking-[-0.055em] md:text-7xl">
                  No fluff.<br /><em className="font-normal">The actual money moves.</em>
                </h2>
              </div>
              <p className="max-w-[610px] border-l border-[#c99b4a] pl-5 text-lg leading-8 text-[#4d473d]">
                This is not a motivational PDF you skim and forget. Every system ends with the exact host language, price-menu logic, and worksheet you need to build the move inside your own business.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
              <div className="relative min-h-[430px] overflow-hidden border border-[#c7b99e] bg-[#ded3be]">
                <img src="/manus-storage/tycoon-ticket-system_25360d91.png" alt="Premium black ticket cards laid out on a strategy ledger" className="h-full w-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-[#171511]/90 px-6 py-5 text-[#f2eadb]">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[#d3ad59]">INCLUDED / TICKET SHOW ARCHITECTURE</p>
                  <p className="mt-2 font-display text-3xl">The event begins before the invitation.</p>
                </div>
              </div>
              <div className="border border-[#c7b99e] bg-[#f7f1e4] p-7 md:p-10">
                <p className="font-mono text-[10px] tracking-[0.2em] text-[#776a57]">YOUR PURCHASE INCLUDES</p>
                <ul className="mt-7 divide-y divide-[#d8cfbe]">
                  {inclusions.map((item, index) => (
                    <li key={item} className="flex items-start gap-4 py-5 first:pt-0">
                      <span className="font-mono text-[11px] tracking-[0.15em] text-[#b18027]">0{index + 1}</span>
                      <span className="text-[17px] leading-6 text-[#28231c]">{item}</span>
                      <Check className="ml-auto mt-1 shrink-0 text-[#a87925]" size={18} strokeWidth={1.6} />
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-[#d8cfbe] pt-6">
                  <a href={checkoutUrl} className="text-link-dark" target="_blank" rel="noreferrer">GET INSTANT ACCESS <ArrowUpRight size={17} /></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="standard" className="bg-[#11110f] px-5 py-20 md:px-9 lg:py-28">
          <div className="mx-auto grid max-w-[1260px] grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
            <div className="relative order-2 min-h-[530px] overflow-hidden border border-[#39352c] lg:order-1">
              <img src="/manus-storage/tycoon-nightlife-operator_5304e6e8.png" alt="Confident adult nightlife entrepreneur with a brass strategy notebook" className="h-full w-full object-cover opacity-90" />
              <div className="absolute left-6 top-6 border border-[#c99b4a]/70 bg-[#0a0a0a]/90 px-4 py-3 font-mono text-[10px] tracking-[0.18em] text-[#e5d4b6]">ROOM STANDARD / 04</div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="section-kicker">THE OPERATOR’S STANDARD</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.9] tracking-[-0.05em] text-[#f7f1e4] md:text-6xl">
                Big energy is easy. A system that pays is the flex.
              </h2>
              <div className="mt-9 space-y-6">
                {[
                  "Every paid move says what it does, what it costs, and when it lands.",
                  "Every deadline has a real reason—not a countdown you recycle every week.",
                  "Every shout-out rewards contribution, not only whoever spends the most.",
                ].map((line) => (
                  <div key={line} className="flex gap-4 border-t border-white/10 pt-5 text-[16px] leading-7 text-[#d2c8b7]">
                    <CircleCheck className="mt-1 shrink-0 text-[#c99b4a]" size={18} strokeWidth={1.5} />
                    {line}
                  </div>
                ))}
              </div>
              <p className="mt-10 font-display text-3xl leading-tight text-[#f1e5d0]">“Make the audience feel seen. Make the next move obvious. Make every ounce of energy count.”</p>
            </div>
          </div>
        </section>

        <section className="bg-[#c99b4a] px-5 py-16 text-[#15130f] md:px-9 lg:py-20">
          <div className="mx-auto grid max-w-[1260px] grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] tracking-[0.24em] text-[#4a371d]">THE COMPLETE OPERATOR PACK / $17 USD</p>
              <h2 className="mt-5 max-w-[720px] font-display text-[clamp(3.5rem,6.5vw,6.5rem)] leading-[0.82] tracking-[-0.055em]">Stop going live for free. Start running the room.</h2>
            </div>
            <div className="lg:pb-1">
              <p className="max-w-[430px] text-[17px] leading-7 text-[#3e2d17]">Get the full money-moves manual plus the quick-win checklist. Both files land instantly after checkout—so you can set up the next room today.</p>
              <a href={checkoutUrl} className="final-cta" target="_blank" rel="noreferrer"><span>GET THE PLAYBOOK — $17</span><ArrowUpRight size={22} /></a>
              <p className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.13em] text-[#4a371d]"><FileText size={13} /> INSTANT PDF DELIVERY VIA PAYHIP</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0a0a0a] px-5 py-8 text-[#aaa08f] md:px-9">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-4 border-t border-white/10 pt-7 text-[11px] font-mono tracking-[0.12em] md:flex-row">
          <span>THE DIGITAL TYCOON PLAYBOOK / A DROP THE HATE BLUEPRINT</span>
          <span className="flex items-center gap-2"><Sparkles size={13} className="text-[#c99b4a]" /> BUILT FOR VOLUNTARY, CLEAR PARTICIPATION</span>
        </div>
      </footer>
    </div>
  );
}
