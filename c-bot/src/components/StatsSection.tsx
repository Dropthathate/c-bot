import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Clock, Brain, FileText, Headphones, Sparkles, TrendingUp, GraduationCap } from "lucide-react";

const timeComparisonData = [
  { task: "SOAP Notes", traditional: 25, withAliyah: 5 },
  { task: "Clinical Lookup", traditional: 15, withAliyah: 2 },
  { task: "Documentation", traditional: 20, withAliyah: 4 },
  { task: "Treatment Planning", traditional: 12, withAliyah: 3 },
];

const knowledgeBaseData = [
  { name: "Clinical Terms", value: 2000, color: "hsl(var(--primary))" },
  { name: "Trigger Points", value: 400, color: "hsl(var(--soma-purple))" },
  { name: "Techniques", value: 276, color: "hsl(var(--soma-blue))" },
  { name: "Protocols", value: 150, color: "hsl(var(--soma-green))" },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5">
            <TrendingUp className="w-4 h-4 mr-2" />
            Proven Results
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Measurable Clinical Impact</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Save <span className="text-primary font-semibold">10+ minutes per session</span> with the first-ever 
            In-Ear AI neuromuscular clinical assistant—real-time suggestions, insights, and documentation.
          </p>
        </div>

        {/* In-Ear Highlight Banner */}
        <div className="mb-12 relative">
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-primary/20 shadow-glow">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center animate-pulse-glow shrink-0">
                <Headphones className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                  First-Ever In-Ear Clinical Intelligence
                </h3>
                <p className="text-muted-foreground">
                  Hands-free neuromuscular assistant delivering <strong>real-time suggestions</strong>, 
                  <strong> clinical insights</strong>, and <strong>medical documentation</strong> as you work.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Voice-Activated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Training Background */}
        <div className="mb-12">
          <Card className="glass-card border-primary/10">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-soma-purple/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6 text-soma-purple" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Trained on Leading Clinical Research
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base">
                    ΛΛLIYΛH.IO is trained on datasets from the <strong>NIH (National Institutes of Health)</strong>, 
                    <strong> Stanford Medicine</strong>, <strong>Mayo Clinic</strong>, <strong>Johns Hopkins</strong>, 
                    and other leading clinical research institutions—ensuring <span className="text-primary font-medium">insurance-compliant</span> and 
                    <span className="text-primary font-medium"> medically accurate</span> documentation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="glass-card hover-lift text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">2,000+</div>
            <div className="text-muted-foreground">Clinical Terms</div>
          </Card>
          
          <Card className="glass-card hover-lift text-center p-6">
            <div className="w-16 h-16 rounded-full bg-soma-green/10 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-soma-green" />
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">10+</div>
            <div className="text-muted-foreground">Minutes Saved/Session</div>
          </Card>
          
          <Card className="glass-card hover-lift text-center p-6">
            <div className="w-16 h-16 rounded-full bg-soma-purple/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-soma-purple" />
            </div>
            <div className="text-4xl font-bold gradient-text mb-2">85%</div>
            <div className="text-muted-foreground">Faster Workflow</div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Time Comparison Bar Chart */}
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Time Saved Per Task</h3>
              <p className="text-sm text-muted-foreground mb-6">Minutes comparison: Traditional vs. With ΛΛLIYΛH</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis dataKey="task" type="category" width={100} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="traditional" fill="hsl(var(--muted-foreground))" name="Traditional" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="withAliyah" fill="hsl(var(--primary))" name="With ΛΛLIYΛH" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted-foreground" />
                  <span className="text-muted-foreground">Traditional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary" />
                  <span className="text-muted-foreground">With ΛΛLIYΛH</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Base Pie Chart */}
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Clinical Knowledge Base</h3>
              <p className="text-sm text-muted-foreground mb-6">Comprehensive coverage across all domains</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={knowledgeBaseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {knowledgeBaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {knowledgeBaseData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}: {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
