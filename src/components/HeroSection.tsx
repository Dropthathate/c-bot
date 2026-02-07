import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Brain, FileText, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-soma-purple/20 rounded-full blur-3xl animate-float delay-200" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-soma-blue/15 rounded-full blur-3xl animate-float delay-400" />
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/75" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 animate-fade-in animate-bounce-subtle">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-foreground">Where The West Meets East</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 animate-slide-up leading-tight">
            <span className="gradient-text">SomaSync AI</span>
            <br />
            <span className="text-foreground text-3xl md:text-4xl lg:text-5xl">
              Relieve Pain. Live Better.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up delay-100">
            The first in-ear AI clinical assistant powered by{" "}
            <span className="text-primary font-semibold">Eastern wisdom</span> and{" "}
            <span className="text-soma-purple font-semibold">Western science</span>.
            Oxford Orthopaedics meets traditional pain relief practices—protected by .
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up delay-200">
            <Button variant="hero" size="xl" asChild className="group shadow-glow animate-pulse-glow">
              <Link to="/auth">
                Start Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#pricing">
                View Pricing
              </a>
            </Button>
          </div>

          {/* Feature Pills - Animated */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in delay-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover-lift cursor-default">
              <Mic className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Voice Commands</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover-lift cursor-default">
              <Brain className="w-4 h-4 text-soma-purple" />
              <span className="text-sm font-medium">Dual-Core AI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover-lift cursor-default">
              <FileText className="w-4 h-4 text-soma-green" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-in delay-400">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">276</div>
              <div className="text-sm text-muted-foreground">Video Techniques</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">40+</div>
              <div className="text-sm text-muted-foreground">Clinical Terms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent" />
    </section>
  );
};

export default HeroSection;
