import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

// Custom SVG logo components for each institution
const NIHLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="currentColor">
    <text x="0" y="28" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24">NIH</text>
    <text x="0" y="38" fontFamily="Arial, sans-serif" fontSize="6" fill="currentColor" opacity="0.7">National Institutes of Health</text>
  </svg>
);

const StanfordLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 140 40" fill="currentColor">
    <text x="0" y="24" fontFamily="Georgia, serif" fontWeight="bold" fontSize="16">STANFORD</text>
    <text x="0" y="36" fontFamily="Georgia, serif" fontSize="10" fill="currentColor" opacity="0.8">MEDICINE</text>
  </svg>
);

const MayoClinicLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="currentColor">
    <text x="0" y="20" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14">MAYO</text>
    <text x="0" y="34" fontFamily="Arial, sans-serif" fontSize="12">CLINIC</text>
  </svg>
);

const JohnsHopkinsLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 140 45" fill="currentColor">
    <text x="0" y="18" fontFamily="Georgia, serif" fontWeight="bold" fontSize="12">JOHNS HOPKINS</text>
    <text x="0" y="32" fontFamily="Georgia, serif" fontSize="10" fill="currentColor" opacity="0.8">MEDICINE</text>
  </svg>
);

const ClevelandClinicLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 140 40" fill="currentColor">
    <text x="0" y="18" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="11">CLEVELAND</text>
    <text x="0" y="32" fontFamily="Arial, sans-serif" fontSize="14">CLINIC</text>
  </svg>
);

const UCSFLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 120 40" fill="currentColor">
    <text x="0" y="24" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="20">UCSF</text>
    <text x="0" y="36" fontFamily="Arial, sans-serif" fontSize="8" fill="currentColor" opacity="0.8">HEALTH</text>
  </svg>
);

// Institution logos with their components
const trustedLogos = [
  { name: "NIH", subtitle: "National Institutes of Health", Logo: NIHLogo },
  { name: "Stanford Medicine", subtitle: "Stanford University", Logo: StanfordLogo },
  { name: "Mayo Clinic", subtitle: "Rochester, MN", Logo: MayoClinicLogo },
  { name: "Johns Hopkins", subtitle: "Medicine", Logo: JohnsHopkinsLogo },
  { name: "Cleveland Clinic", subtitle: "Ohio", Logo: ClevelandClinicLogo },
  { name: "UCSF Health", subtitle: "San Francisco", Logo: UCSFLogo },
];

// Duplicate for seamless infinite scroll
const allLogos = [...trustedLogos, ...trustedLogos];

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
              <div className="w-44 md:w-52 h-24 md:h-28 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-center px-4 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 grayscale hover:grayscale-0">
                <logo.Logo className="w-full h-12 md:h-14 text-muted-foreground group-hover:text-primary transition-colors" />
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
