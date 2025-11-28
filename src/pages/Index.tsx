import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import VocabularySection from "@/components/VocabularySection";
import SpecialTestsSection from "@/components/SpecialTestsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <VocabularySection />
        <SpecialTestsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
