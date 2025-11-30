import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText, Download, Shield, Loader2 } from "lucide-react";

interface LegalTemplate {
  id: string;
  modality: string;
  template_name: string;
  template_type: string;
  pdf_url: string | null;
  description: string | null;
}

const LegalForms = () => {
  const [templates, setTemplates] = useState<LegalTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("legal_templates")
        .select("*")
        .order("modality");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.modality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.template_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consent":
        return "bg-soma-green-light text-soma-green";
      case "waiver":
        return "bg-soma-orange-light text-soma-orange";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <DashboardLayout requiredRole="therapist" requiredTier="pro">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-soma-green-light flex items-center justify-center">
              <Shield className="h-6 w-6 text-soma-green" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Legal Form Finder</h1>
              <p className="text-muted-foreground">
                Search waivers and consent forms by modality
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by modality (e.g., Deep Tissue, Cupping)..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Templates Found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No templates match "${searchQuery}"`
                : "No legal templates available yet."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Badge className={getTypeColor(template.template_type)}>
                      {template.template_type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{template.template_name}</CardTitle>
                  <CardDescription>
                    <span className="font-medium text-primary">{template.modality}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description || "Standard legal template for this modality."}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={!template.pdf_url}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {template.pdf_url ? "Download PDF" : "PDF Coming Soon"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-muted rounded-xl">
          <h3 className="font-semibold text-foreground mb-2">Legal Disclaimer</h3>
          <p className="text-sm text-muted-foreground">
            These templates are provided as general guidance only and may need to be modified to comply 
            with your state's specific regulations. Always consult with a legal professional to ensure 
            compliance with local laws and your specific practice requirements.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LegalForms;