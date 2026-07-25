import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Search } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail?: string;
}

const VIDEOS: Video[] = [
  {
    id: "1",
    title: "Proper Assessment Techniques",
    description: "Learn the fundamentals of clinical assessment and documentation.",
    category: "Assessment",
    duration: "12:45",
  },
  {
    id: "2",
    title: "SOAP Note Best Practices",
    description: "Master the structure and content of effective SOAP documentation.",
    category: "Documentation",
    duration: "18:30",
  },
  {
    id: "3",
    title: "ICD-10 Coding Essentials",
    description: "Navigate ICD-10 coding with confidence and accuracy.",
    category: "Coding",
    duration: "15:20",
  },
  {
    id: "4",
    title: "Patient Communication Skills",
    description: "Enhance your patient interaction and intake process.",
    category: "Communication",
    duration: "22:15",
  },
  {
    id: "5",
    title: "Clinical Reasoning & Documentation",
    description: "Connect clinical reasoning to clear, concise documentation.",
    category: "Documentation",
    duration: "19:50",
  },
  {
    id: "6",
    title: "Compliance & Legal Considerations",
    description: "Understand compliance requirements and legal documentation standards.",
    category: "Compliance",
    duration: "14:00",
  },
];

const CATEGORIES = ["All", ...new Set(VIDEOS.map(v => v.category))];

export default function VideoLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos = VIDEOS.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Video Library</h1>
        <p className="text-muted-foreground mt-2">Training materials · techniques · best practices</p>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map(video => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 aspect-video flex items-center justify-center">
              <Play className="h-12 w-12 text-primary opacity-60" />
            </div>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-tight flex-1">{video.title}</h3>
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {video.duration}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {video.category}
                </Badge>
                <Button size="sm" variant="ghost">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <Card>
          <CardContent className="pt-8 text-center">
            <p className="text-muted-foreground">No videos found matching your search.</p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">About This Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This video library contains training materials, clinical techniques, and best practices
            to help you get the most out of SomaSync AI. Videos are updated regularly with new content
            and advanced techniques.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
