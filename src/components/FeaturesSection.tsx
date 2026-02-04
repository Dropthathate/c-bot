import { Mic, Brain, Zap, Shield, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-Activated Documentation",
    description: "Use natural voice commands like 'Mark:', 'Note:', or 'Restriction:' to log findings hands-free during assessments.",
    color: "bg-soma-teal-light text-soma-teal",
  },
  {
    icon: Brain,
    title: "Clinical Pattern Recognition",
    description: "AI-powered suggestions link observed deviations to commonly associated structures and conditions.",
    color: "bg-soma-purple-light text-soma-purple",
  },
  {
    icon: Zap,
    title: "Instant Prompts",
    description: "Receive contextual assistant prompts suggesting related structures based on your observations.",
    color: "bg-soma-orange-light text-soma-orange",
  },
  {
    icon: Shield,
    title: "Controlled Vocabulary",
    description: "2,000+ validated anatomical terms ensure accurate recognition and clinical consistency.",
    color: "bg-soma-green-light text-soma-green",
  },
  {
    icon: BarChart3,
    title: "Assessment Metrics",
    description: "Track recognition accuracy, documentation time savings, and therapist satisfaction scores.",
    color: "bg-soma-blue-light text-soma-blue",
  },
  {
    icon: Clock,
    title: "Save 10+ Minutes Per Session",
    description: "Reduce documentation time significantly compared to manual note-taking methods.",
    color: "bg-accent text-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Trained on NIH, Stanford, Mayo Clinic & Johns Hopkins
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Built for Clinical Excellence</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            SomaSync AI is trained on datasets from the NIH, Stanford Medicine, Mayo Clinic, and Johns Hopkins—combining 
            Oxford Orthopaedics & Travell's Trigger Point methodology for insurance-compliant, medically accurate documentation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
