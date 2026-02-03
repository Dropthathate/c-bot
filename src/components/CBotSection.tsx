import React, { useState } from 'react';
import { Shield, Brain, Sparkles, AlertTriangle, BookOpen, Leaf, Mic, StopCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Ensure your supabase client is initialized

const CBotSection = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionNote, setSessionNote] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'emergency' | 'referral', message: string } | null>(null);

  const handleInitializeSession = async () => {
    // In a real build, this would trigger your STT (Speech-to-Text) logic
    setIsRecording(true);
    setAlert(null);
    console.log("SomaSync AI: Initializing Global Clinical Session...");
  };

  const handleGenerateNote = async (transcript: string) => {
    setIsRecording(false);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('somasync-documentation', {
        body: { 
          messages: [{ role: "user", content: transcript }],
          mode: "soap" // Defaulting to SOAP as per your index.ts protocol
        },
      });

      if (error) throw error;

      // Handle the Emergency Red Flags from your index.ts
      if (data?.choices?.[0]?.message?.content.includes("🚨 EMERGENCY ALERT")) {
        setAlert({ type: 'emergency', message: data.choices[0].message.content });
      } else {
        setSessionNote(data?.choices?.[0]?.message?.content);
      }
    } catch (err) {
      console.error("Clinical Documentation Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="cbot" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-soma-purple/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-soma-purple/10 border border-soma-purple/20 mb-6">
            <Shield className="w-4 h-4 text-soma-purple" />
            <span className="text-sm font-medium text-soma-purple">Dual-Core Intelligence</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Meet <span className="gradient-text">C-Bot</span>
          </h2>
          
          {/* Action Button: Initialize Session */}
          <div className="flex justify-center gap-4 mt-8">
            {!isRecording ? (
              <button 
                onClick={handleInitializeSession}
                className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:shadow-glow transition-all animate-bounce-subtle"
              >
                <Mic className="w-5 h-5" />
                Initialize Clinical Session
              </button>
            ) : (
              <button 
                onClick={() => handleGenerateNote("Sample transcript for build test")}
                className="flex items-center gap-2 bg-destructive text-white px-8 py-4 rounded-full font-bold animate-pulse"
              >
                <StopCircle className="w-5 h-5" />
                Stop & Generate SOAP Note
              </button>
            )}
          </div>
          
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 mt-4 text-primary font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              Sourcing NIH & University Datasets...
            </div>
          )}
        </div>

        {/* Emergency Alert Display */}
        {alert && (
          <div className="max-w-4xl mx-auto mb-12 p-6 rounded-xl bg-destructive text-white border-2 border-white shadow-2xl animate-slide-up">
            <pre className="whitespace-pre-wrap font-sans font-bold text-lg">
              {alert.message}
            </pre>
          </div>
        )}

        {/* Standard Knowledge Cards (Original Content) */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          <div className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <BookOpen className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold">Western Science</h3>
            </div>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>• Oxford Handbook of Orthopaedics</li>
              <li>• Janet Travell's Trigger Point Manual</li>
              <li>• NIH Clinical Benchmarks</li>
            </ul>
          </div>

          <div className="group p-8 rounded-2xl bg-card border border-border hover:border-soma-orange/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <Leaf className="w-8 h-8 text-soma-orange" />
              <h3 className="text-2xl font-bold">Eastern Wisdom</h3>
            </div>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>• Meridian & Acupressure Point Maps</li>
              <li>• Ayurvedic Body Constitution</li>
              <li>• Holistic Mind-Body Integration</li>
            </ul>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className={`p-6 rounded-xl border transition-all ${alert ? 'bg-destructive/20 border-destructive animate-pulse' : 'bg-destructive/5 border-destructive/20'}`}>
            <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
            <h4 className="text-lg font-semibold mb-2">Safety First Filter</h4>
            <p className="text-muted-foreground text-sm">Screens for Red Flags like fractures or slurred speech.</p>
          </div>
          {/* ... Other features stay the same ... */}
        </div>
      </div>
    </section>
  );
};

export default CBotSection;