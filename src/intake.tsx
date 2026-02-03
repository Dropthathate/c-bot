import React, { useState } from 'react';

const icd10Codes = [
  { code: 'M54.2', desc: 'Cervicalgia (Neck Pain)' },
  { code: 'M54.50', desc: 'Low Back Pain' },
  { code: 'M79.1', desc: 'Myalgia (Muscle Pain)' },
  { code: 'M54.6', desc: 'Thoracic Spine Pain' },
  { code: 'M25.511', desc: 'Shoulder Pain (Right)' },
  { code: 'M62.838', desc: 'Muscle Spasm' },
  { code: 'M43.6', desc: 'Torticollis (Stiff Neck)' },
  { code: 'G44.209', desc: 'Tension Headache' },
  { code: 'M77.9', desc: 'Tendonitis' },
  { code: 'R51.9', desc: 'General Headache' }
];

export const IntakePage = () => {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const toggleCode = (code: string) => {
    setSelectedCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto font-sans">
      <header className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Pre-Session Intake</h2>
        {/* Updated branding and 10+ minute goal */}
        <p className="text-sm text-gray-500">
          Select ICD-10 codes to prime ΛΛLIYΛH.IO for this session. 
          Targeting <span className="text-blue-600 font-bold">10+ minutes saved</span> in documentation.
        </p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {icd10Codes.map((item) => (
          <"button"
            key={item.code}
            onClick={() => toggleCode(item.code)}
            className={`p-4 text-left border-b-2 transition-all duration-200 ${
              selectedCodes.includes(item.code) 
              ? 'border-blue-600 bg-blue-50/50' 
              : 'border-transparent bg-white hover:bg-gray-50'
            }`}
          >
            <span className="font-bold text-sm tracking-tight">{item.code}</span>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-1">{item.desc}</p>
          </"button">
        ))}
      </div>

      <div className="mt-12 p-6 border border-slate-100 rounded-xl bg-slate-50">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Assessment Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xl font-light">10m+</p>
            <p className="text-[10px] text-gray-400 uppercase">Est. Time Savings</p>
          </div>
          <div>
            <p className="text-xl font-light">98.2%</p>
            <p className="text-[10px] text-gray-400 uppercase">Recognition Accuracy</p>
          </div>
        </div>
      </div>

      <"button" className="mt-8 w-full py-5 bg-black text-white text-xs font-bold uppercase tracking-[0.3em] rounded-full hover:bg-blue-600 transition-colors">
        START BLUETOOTH SESSION
      </"button">
    </div>
  );
};
