import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Search, Video, BookOpen, Play, Loader2, Filter } from "lucide-react";

interface Technique {
  id: string;
  technique_number: number;
  technique_name: string;
  body_part: string;
  video_url: string | null;
  indication: string | null;
  oxford_reference_page: string | null;
  travell_reference: string | null;
}

const VideoLibrary = () => {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bodyPartFilter, setBodyPartFilter] = useState<string>("all");
  const location = useLocation();
  const { isTherapist, hasActiveRecovery } = useAuth();

  useEffect(() => {
    fetchTechniques();
  }, []);

  const fetchTechniques = async () => {
    try {
      const { data, error } = await supabase
        .from("mobilization_techniques")
        .select("*")
        .order("technique_number");

      if (error) throw error;
      setTechniques(data || []);
    } catch (error) {
      console.error("Error fetching techniques:", error);
    } finally {
      setLoading(false);
    }
  };

  const bodyParts = [...new Set(techniques.map((t) => t.body_part))];

  const filteredTechniques = techniques.filter((technique) => {
    const matchesSearch =
      technique.technique_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technique.indication?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      technique.technique_number.toString().includes(searchQuery);
    const matchesBodyPart =
      bodyPartFilter === "all" || technique.body_part === bodyPartFilter;
    return matchesSearch && matchesBodyPart;
  });

  const getBodyPartColor = (bodyPart: string) => {
    const colors: Record<string, string> = {
      Neck: "bg-soma-purple-light text-soma-purple",
      "Thoracic Spine": "bg-soma-blue-light text-soma-blue",
      "Lower Back": "bg-soma-orange-light text-soma-orange",
      Hip: "bg-soma-green-light text-soma-green",
      Knee: "bg-soma-teal-light text-primary",
      Ankle: "bg-secondary text-secondary-foreground",
      Shoulder: "bg-soma-purple-light text-soma-purple",
      Elbow: "bg-soma-blue-light text-soma-blue",
      Wrist: "bg-soma-green-light text-soma-green",
    };
    return colors[bodyPart] || "bg-secondary text-secondary-foreground";
  };

  // Determine required tier based on route
  const requiredTier = location.pathname.includes("/therapist") ? undefined : "active_recovery";
  const requiredRole = location.pathname.includes("/therapist") ? "therapist" : "patient";

  return (
    <DashboardLayout requiredRole={requiredRole} requiredTier={requiredTier as any}>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <Video className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                1/276 Mobilization Library
              </h1>
              <p className="text-muted-foreground">
                Evidence-based techniques with Oxford & Travell references
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, indication, or technique number..."
              className="pl-10"
            />
          </div>
          <Select value={bodyPartFilter} onValueChange={setBodyPartFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by body part" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Body Parts</SelectItem>
              {bodyParts.map((part) => (
                <SelectItem key={part} value={part}>
                  {part}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredTechniques.length} of {techniques.length} techniques
        </p>

        {/* Techniques Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTechniques.length === 0 ? (
          <div className="text-center py-16">
            <Video className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Techniques Found</h3>
            <p className="text-muted-foreground">
              {searchQuery || bodyPartFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No techniques available yet."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTechniques.map((technique) => (
              <Card key={technique.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className="font-mono">
                      #{technique.technique_number}
                    </Badge>
                    <Badge className={getBodyPartColor(technique.body_part)}>
                      {technique.body_part}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{technique.technique_name}</CardTitle>
                  <CardDescription>{technique.indication}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Video Placeholder */}
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {technique.video_url ? (
                      <Button variant="ghost" size="icon" className="h-12 w-12">
                        <Play className="h-6 w-6" />
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">Video Coming Soon</span>
                    )}
                  </div>

                  {/* References */}
                  <div className="space-y-2 text-xs">
                    {technique.oxford_reference_page && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span>Oxford: {technique.oxford_reference_page}</span>
                      </div>
                    )}
                    {technique.travell_reference && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        <span>Travell: {technique.travell_reference}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VideoLibrary;