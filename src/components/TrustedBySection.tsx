import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

// Institution/Partner logos - using placeholder SVGs for now
const trustedLogos = [
  { name: "NIH", subtitle: "National Institutes of Health" },
  { name: "Stanford Medicine", subtitle: "Stanford University" },
  { name: "Mayo Clinic", subtitle: "Rochester, MN" },
  { name: "Johns Hopkins", subtitle: "Medicine" },
  { name: "Cleveland Clinic", subtitle: "Ohio" },
  { name: "UCSF Health", subtitle: "San Francisco" },
];

const partnerLogos = [
  { name: "Partner 1", subtitle: "Supporting Company" },
  { name: "Partner 2", subtitle: "Clinical Partner" },
  { name: "Partner 3", subtitle: "Healthcare Network" },
  { name: "Partner 4", subtitle: "Research Institute" },
];

// Duplicate for seamless infinite scroll
const allLogos = [...trustedLogos, ...partnerLogos, ...trustedLogos, ...partnerLogos];

const TrustedBySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset when we've scrolled half the content (since we duplicated)
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="py-16 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center">
          <Badge variant="outline" className="mb-4 px-4 py-1.5">
            <Building2 className="w-4 h-4 mr-2" />
            Trusted By & Trained On
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Backed by World-Class Medical Research
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Our AI is trained on datasets from leading healthcare institutions and research centers
          </p>
        </div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling Logos */}
        <div 
          ref={scrollRef}
          className="flex gap-8 md:gap-12 overflow-x-hidden py-6"
          style={{ scrollBehavior: 'auto' }}
        >
          {allLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="w-40 md:w-48 h-24 md:h-28 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 grayscale hover:grayscale-0">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Building2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center px-2">
                  <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-full">
                    {logo.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-full">
                    {logo.subtitle}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="container mx-auto px-4 mt-10">
        <p className="text-center text-sm text-muted-foreground">
          <span className="text-primary font-medium">Insurance-compliant</span> and 
          <span className="text-primary font-medium"> medically accurate</span> documentation powered by peer-reviewed research
        </p>
      </div>
    </section>
  );
};

export default TrustedBySection;
