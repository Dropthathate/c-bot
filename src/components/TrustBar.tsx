import React from 'react';

const TrustBar = () => {
  const logos = [
    { name: "NIH", detail: "Clinical Standards" },
    { name: "Stanford", detail: "Medical Research" },
    { name: "Johns Hopkins", detail: "Treatment Protocols" },
    { name: "Mayo Clinic", detail: "Evidence-Based" },
    { name: "Oxford", detail: "Orthopaedic Research" }
  ];

  return (
    <div className="w-full bg-muted/30 py-8 border-y border-border/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
          Intelligence trained on global medical & university datasets
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
          {logos.map((logo) => (
            <div key={logo.name} className="flex flex-col items-center">
              <span className="text-xl font-black tracking-tighter text-foreground">{logo.name}</span>
              <span className="text-[10px] font-medium text-primary uppercase">{logo.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;