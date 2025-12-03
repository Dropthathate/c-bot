import { Activity, Mail, Twitter, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  return (
    <footer id="about" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Soma<span className="text-primary">Sync</span> AI
              </span>
            </div>
            <p className="text-background/70 mb-6 max-w-md">
              Empowering physical therapists with AI-powered clinical documentation. 
              Streamline assessments, reduce paperwork, and focus on what matters most — your patients.
            </p>
            <div className="mt-4">
              <Badge
                variant="outline"
                className="inline-flex flex-col items-start gap-0.5 rounded-full bg-background/90 px-4 py-2 text-xs md:text-sm border border-background/20 shadow-sm"
              >
                <span className="font-semibold">
                  Neuromuscular Practitioner + Holistic Health Educator
                </span>
                <span className="opacity-80">
                  Credential #168806 • 1200+ hrs hands-on training across Eastern and Western modalities
                </span>
              </Badge>
            </div>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
              <li><a href="#vocabulary" className="hover:text-background transition-colors">Vocabulary</a></li>
              <li><a href="#tests" className="hover:text-background transition-colors">Clinical Tests</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-background transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} SomaSync AI. All rights reserved.
          </p>
          <p className="text-sm text-background/60">
            Phase I Development • Controlled Vocabulary System
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
