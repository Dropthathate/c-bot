import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Crown, Zap, LucideIcon } from "lucide-react";

interface Tier {
  name: string;
  price: string;
  period?: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  checkBg: string;
  checkColor: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    description: "For patients exploring holistic relief",
    icon: Zap,
    iconBg: "bg-soma-green-light",
    iconColor: "text-soma-green",
    checkBg: "bg-soma-green-light",
    checkColor: "text-soma-green",
    features: [
      "Basic SomaSync AI Chat",
      "Symptom Checker",
      "C-Bot Safety Screening",
      "5 AI conversations/month",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Active Recovery",
    price: "$19",
    period: "/month",
    description: "Full access to the pain-relief toolkit",
    icon: Sparkles,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    checkBg: "bg-primary/10",
    checkColor: "text-primary",
    features: [
      "Everything in Free",
      "Full 1/276 Video Library",
      "Travell Trigger Point Maps",
      "Unlimited AI conversations",
      "Personalized recovery plans",
      "Progress tracking",
    ],
    cta: "Start Recovery",
    popular: true,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Built for professional therapists",
    icon: Crown,
    iconBg: "bg-soma-purple-light",
    iconColor: "text-soma-purple",
    checkBg: "bg-soma-purple-light",
    checkColor: "text-soma-purple",
    features: [
      "Everything in Active Recovery",
      "C-Bot Legal Audits (Unlimited)",
      "SOAP Note Generator",
      "Dynamic Form Finder",
      "Client PDF Management",
      "Scope of Practice Compliance",
      "Priority support",
    ],
    cta: "Go Pro",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Animated background accents */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-soma-purple/10 rounded-full blur-3xl animate-float delay-300" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6 animate-bounce-subtle">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">Simple, Transparent Pricing</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Choose Your Pain Relief Path</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you're relieving your own pain or supporting others, we have a plan that fits.
          </p>
        </div>

        {/* Pricing Cards - Greyed out for MVP */}
        <div className="relative">
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="bg-card/95 backdrop-blur-sm border border-border rounded-2xl px-8 py-6 shadow-xl text-center">
              <span className="text-2xl font-bold gradient-text">Coming Soon</span>
              <p className="text-muted-foreground mt-2">Early Access available now!</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto opacity-30 pointer-events-none select-none">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-8 grayscale ${
                  tier.popular
                    ? "gradient-border bg-card shadow-glow"
                    : "bg-card border border-border shadow-lg"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${tier.iconBg} flex items-center justify-center mb-6`}>
                  <tier.icon className={`w-7 h-7 ${tier.iconColor}`} />
                </div>

                {/* Tier Info */}
                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                <p className="text-muted-foreground mb-4">{tier.description}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-5xl font-bold ${tier.popular ? "gradient-text" : "text-foreground"}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground">{tier.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full ${tier.checkBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className={`w-3 h-3 ${tier.checkColor}`} />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className="w-full"
                  variant={tier.popular ? "default" : "outline"}
                  size="lg"
                  disabled
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Trusted by therapists and patients worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-foreground">Oxford</div>
            <div className="text-2xl font-bold text-foreground">Travell</div>
            <div className="text-2xl font-bold text-foreground">HIPAA</div>
            <div className="text-2xl font-bold text-foreground">Secure</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
