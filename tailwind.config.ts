import React, { useState } from 'react';

const icd10Codes = [
  { code: 'M54.2', desc: 'Cervicalgia' },
  { code: 'M54.50', desc: 'Low Back Pain' },
  { code: 'M79.1', desc: 'Myalgia' },
  { code: 'M54.6', desc: 'Thoracic Pain' },
  { code: 'M25.511', desc: 'Shoulder (R)' },
  { code: 'M62.838', desc: 'Spasm' },
  { code: 'M43.6', desc: 'Torticollis' },
  { code: 'G44.209', desc: 'Tension HA' },
  { code: 'M77.9', desc: 'Tendonitis' },
  { code: 'R51.9', desc: 'Headache' }
];

const Intake = () => {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const toggleCode = (code: string) => {
    setSelectedCodes(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="min-h-screen bg-white p-8 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-2">Clinical Intake</h1>
          <h2 className="text-3xl font-light">Select diagnostic context.</h2>
        </header>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {icd10Codes.map((item) => (
            <div
              key={item.code}
              onClick={() => toggleCode(item.code)}
              className={`cursor-pointer border-b-2 p-4 transition-all duration-300 ${
                selectedCodes.includes(item.code) 
                ? 'border-blue-600 bg-blue-50/30' 
                : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-bold tracking-tight">{item.code}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <footer className="mt-20 flex justify-between items-center border-t border-slate-100 pt-8">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest">
            {selectedCodes.length} Codes Selected
          </div>
          <button className="text-xs font-bold uppercase tracking-[0.3em] hover:text-blue-600 transition-colors">
            Initialize Session →
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Intake;