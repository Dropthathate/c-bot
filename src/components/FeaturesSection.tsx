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
    description: "40+ validated anatomical terms ensure accurate recognition and clinical consistency.",
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
    title: "Save 5+ Minutes Per Session",
    description: "Reduce documentation time significantly compared to manual note-taking methods.",
    color: "bg-accent text-primary",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Clinical Excellence
          </h2>
          <p className="text-lg text-muted-foreground">
            SomaSync AI combines voice recognition, clinical knowledge, and intelligent documentation 
            to transform how you conduct postural assessments.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
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
