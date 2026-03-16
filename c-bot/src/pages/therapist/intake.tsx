import React, { useState } from 'react';

const icd10Codes = [
  { code: 'M54.2', desc: 'Cervicalgia (Neck Pain)', rationale: '100% prevalence in non-specific neck pain cases per NIH data.' },
  { code: 'M54.50', desc: 'Low Back Pain', rationale: 'Linked to postural overload of Type I muscle fibers.' },
  { code: 'M79.1', desc: 'Myalgia (Muscle Pain)', rationale: 'Indicator of systemic metabolic crisis and ACh overload.' },
  { code: 'M62.838', desc: 'Muscle Spasm', rationale: 'Direct result of sustained neuromuscular junction firing.' }
];

const Intake = () => {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans text-slate-900">
      <header className="mb-12">
        <div className="text-xs font-black tracking-[0.3em] text-blue-600 mb-2">ΛΛLIYΛH.IO // NMT ENGINE</div>
        <h1 className="text-4xl font-light tracking-tight">Clinical Intake</h1>
        <p className="text-slate-500 mt-2">Targeting 10+ minutes saved via NIH-backed diagnostic priming.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Area */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {icd10Codes.map((item) => (
            <button type="button"
              key={item.code}
              onClick={() => setSelectedCodes(prev => prev.includes(item.code) ? prev.filter(c => c !== item.code) : [...prev, item.code])}
              className={`p-6 text-left border-b-2 transition-all ${
                selectedCodes.includes(item.code) ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className="font-bold tracking-tighter">{item.code}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Clinical Reasoning Panel (NIH/NMT Data) */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-6">NIH Clinical Reasoning</h3>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase mb-1">Metabolic Crisis</p>
              <p className="text-[11px] leading-relaxed text-slate-400">Aaliyah monitors for ACh-induced ischemia and metabolic overload in Type I fibers.</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase mb-1">Sensitization Track</p>
              <p className="text-[11px] leading-relaxed text-slate-400">Differentiating between peripheral trigger points and central sensitization patterns.</p>
            </div>
          </div>
          <button type="button" className="mt-12 w-full py-4 bg-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-blue-500 transition-all">
            Initialize 10m+ Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intake;
