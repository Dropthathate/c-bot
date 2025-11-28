import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";
import { specialTests, posturalPatterns } from "@/data/specialTests";
import { Badge } from "@/components/ui/badge";

const SpecialTestsSection = () => {
  const [expandedTest, setExpandedTest] = useState<string | null>("slr");
  const [activeTab, setActiveTab] = useState<"tests" | "patterns">("tests");

  return (
    <section id="tests" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Clinical Knowledge Base
          </h2>
          <p className="text-lg text-muted-foreground">
            Expert clinical logic that links special test results and postural patterns 
            to their underlying anatomical implications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab("tests")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "tests"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Special Tests
            </button>
            <button
              onClick={() => setActiveTab("patterns")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "patterns"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Postural Patterns
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {activeTab === "tests" ? (
            /* Special Tests List */
            <div className="space-y-4">
              {specialTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">
                          {test.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{test.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {test.implication}
                        </p>
                      </div>
                    </div>
                    {expandedTest === test.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedTest === test.id && (
                    <div className="px-6 pb-6 pt-2 border-t border-border animate-fade-in">
                      {/* Implication */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-soma-orange" />
                          Implication
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {test.implication}
                        </p>
                      </div>

                      {/* Clinical Notes */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Clinical Notes
                        </h4>
                        <ul className="space-y-2">
                          {test.clinicalNotes.map((note, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-soma-green shrink-0 mt-0.5" />
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Associated Structures */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">
                          Associated Structures to Check
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {test.associatedStructures.map((structure, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {structure}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Postural Patterns List */
            <div className="space-y-4">
              {posturalPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="bg-card rounded-xl border border-border shadow-sm p-6"
                >
                  <h3 className="font-semibold text-foreground text-lg mb-4">
                    {pattern.name}
                  </h3>
                  <div className="space-y-3">
                    {pattern.associatedFindings.map((finding, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <span className="font-medium text-sm">{finding.tissue}</span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            finding.expectedState.includes("Tight") || finding.expectedState.includes("Overactive")
                              ? "border-soma-orange/30 text-soma-orange bg-soma-orange-light"
                              : "border-soma-blue/30 text-soma-blue bg-soma-blue-light"
                          }`}
                        >
                          {finding.expectedState}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SpecialTestsSection;
