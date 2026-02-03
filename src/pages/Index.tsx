import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar"; // New component
import CBotSection from "@/components/CBotSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import VocabularySection from "@/components/VocabularySection";
import SpecialTestsSection from "@/components/SpecialTestsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {/* Establish authority immediately after the pitch */}
        <TrustBar /> 
        <CBotSection />
        <FeaturesSection />
        <PricingSection />
        <VocabularySection />
        <SpecialTestsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;