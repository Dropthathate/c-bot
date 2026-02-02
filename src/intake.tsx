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
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Pre-Session Intake</h2>
      <p className="text-sm text-gray-500 mb-6">Select ICD-10 codes to prime ΛΛLIYΛH.IO for this session.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {icd10Codes.map((item) => (
          <button
            key={item.code}
            onClick={() => toggleCode(item.code)}
            className={`p-3 text-left border rounded-lg transition-colors ${
              selectedCodes.includes(item.code) ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className="font-bold">{item.code}</span>
            <p className="text-xs opacity-80">{item.desc}</p>
          </button>
        ))}
      </div>

      <button className="mt-8 w-full py-4 bg-black text-white font-bold rounded-full">
        START BLUETOOTH SESSION
      </button>
    </div>
  );
};