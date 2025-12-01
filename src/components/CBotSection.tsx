import { Shield, Brain, Sparkles, AlertTriangle, BookOpen, Leaf } from "lucide-react";

const CBotSection = () => {
  return (
    <section id="cbot" className="py-24 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-soma-purple/5 via-transparent to-primary/5" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-soma-purple/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float delay-300" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soma-purple/10 border border-soma-purple/20 mb-6">
            <Shield className="w-4 h-4 text-soma-purple" />
            <span className="text-sm font-medium text-soma-purple">Dual-Core Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Meet <span className="gradient-text">C-Bot</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Your AI guardian that screens every input for safety while drawing from the 
            world's most comprehensive healing knowledge—where{" "}
            <span className="text-primary font-semibold">Western medicine</span> meets{" "}
            <span className="text-soma-orange font-semibold">Eastern tradition</span>.
          </p>
        </div>

        {/* Dual Knowledge Base */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Western Medicine */}
          <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Western Science</h3>
                <p className="text-muted-foreground">Evidence-Based Medicine</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">Oxford Handbook of Orthopaedics & Trauma</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">Janet Travell's Trigger Point Manual</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">Latest Meta-Analyses (5 years)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-foreground">Clinical Biomechanics Research</span>
              </li>
            </ul>
          </div>

          {/* Eastern Medicine */}
          <div className="group p-8 rounded-2xl bg-card border border-border hover:border-soma-orange/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-slide-up delay-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-soma-orange/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="w-8 h-8 text-soma-orange" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Eastern Wisdom</h3>
                <p className="text-muted-foreground">Traditional Healing Arts</p>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-soma-orange" />
                <span className="text-foreground">Traditional Chinese Medicine (TCM)</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-soma-orange" />
                <span className="text-foreground">Meridian & Acupressure Point Maps</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-soma-orange" />
                <span className="text-foreground">Ayurvedic Body Constitution</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-soma-orange" />
                <span className="text-foreground">Holistic Mind-Body Integration</span>
              </li>
            </ul>
          </div>
        </div>

        {/* C-Bot Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 animate-slide-up delay-200">
            <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Safety First Filter</h4>
            <p className="text-muted-foreground text-sm">
              Every input is screened for red flags—fractures, infections, severe symptoms—before 
              reaching the AI. Your safety is non-negotiable.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-soma-purple/5 border border-soma-purple/20 animate-slide-up delay-300">
            <Shield className="w-10 h-10 text-soma-purple mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Scope of Practice Guard</h4>
            <p className="text-muted-foreground text-sm">
              C-Bot ensures therapists stay within their license. LMTs get gentle redirects 
              when venturing into adjustment territory.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-primary/5 border border-primary/20 animate-slide-up delay-400">
            <Brain className="w-10 h-10 text-primary mb-4" />
            <h4 className="text-lg font-semibold text-foreground mb-2">Empathic Intelligence</h4>
            <p className="text-muted-foreground text-sm">
              Beyond compliance, SomaSync delivers warm, non-judgmental guidance that 
              treats the whole person—body, mind, and spirit.
            </p>
          </div>
        </div>

        {/* Philosophy Quote */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <blockquote className="text-xl md:text-2xl italic text-muted-foreground">
            "The body has an innate wisdom. We simply help you{" "}
            <span className="text-primary font-medium not-italic">listen</span> to it."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— SomaSync Philosophy</p>
        </div>
      </div>
    </section>
  );
};

export default CBotSection;
