import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { muscles, tendons, joints, nerves, softTissues, clinicalFindings, commands } from "@/data/vocabulary";

const categories = [
  { id: "all", label: "All", count: 0 },
  { id: "muscle", label: "Muscles", count: muscles.length },
  { id: "tendon", label: "Tendons", count: tendons.length },
  { id: "joint", label: "Joints", count: joints.length },
  { id: "nerve", label: "Nerves", count: nerves.length },
  { id: "soft-tissue", label: "Soft Tissues", count: softTissues.length },
  { id: "finding", label: "Findings", count: clinicalFindings.length },
  { id: "command", label: "Commands", count: commands.length },
];

const allItems = [...muscles, ...tendons, ...joints, ...nerves, ...softTissues, ...clinicalFindings, ...commands];
categories[0].count = allItems.length;

const categoryColors: Record<string, string> = {
  muscle: "bg-soma-teal-light text-soma-teal border-soma-teal/20",
  tendon: "bg-soma-blue-light text-soma-blue border-soma-blue/20",
  joint: "bg-soma-purple-light text-soma-purple border-soma-purple/20",
  nerve: "bg-soma-orange-light text-soma-orange border-soma-orange/20",
  "soft-tissue": "bg-soma-green-light text-soma-green border-soma-green/20",
  finding: "bg-accent text-primary border-primary/20",
  command: "bg-muted text-muted-foreground border-border",
};

const VocabularySection = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="vocabulary" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Controlled Vocabulary
          </h2>
          <p className="text-lg text-muted-foreground">
            A validated set of anatomical terms, clinical findings, and voice commands 
            recognized by SomaSync AI for accurate documentation.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vocabulary..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                {category.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredItems.slice(0, 30).map((item, index) => (
              <div
                key={index}
                className={`px-4 py-3 rounded-lg border ${categoryColors[item.category]} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
              >
                <p className="font-medium text-sm">{item.term}</p>
                {item.subcategory && (
                  <p className="text-xs opacity-70 mt-0.5">{item.subcategory}</p>
                )}
              </div>
            ))}
          </div>
          
          {filteredItems.length > 30 && (
            <div className="text-center mt-6">
              <p className="text-muted-foreground text-sm">
                Showing 30 of {filteredItems.length} terms
              </p>
            </div>
          )}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No terms found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VocabularySection;
