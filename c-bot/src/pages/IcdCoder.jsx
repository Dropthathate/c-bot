import { useState } from "react";

const ICD_DB = [
  { code: "M54.5",   desc: "Low back pain",                        cat: "Musculoskeletal" },
  { code: "M54.2",   desc: "Cervicalgia",                          cat: "Musculoskeletal" },
  { code: "M54.42",  desc: "Lumbago with sciatica, left side",     cat: "Musculoskeletal" },
  { code: "M54.41",  desc: "Lumbago with sciatica, right side",    cat: "Musculoskeletal" },
  { code: "M62.838", desc: "Muscle spasm, other site",             cat: "Musculoskeletal" },
  { code: "M79.3",   desc: "Panniculitis / myofascial pain",       cat: "Soft Tissue"     },
  { code: "M76.89",  desc: "Other enthesopathies, lower extremity",cat: "Musculoskeletal" },
  { code: "R29.3",   desc: "Abnormal posture",                     cat: "Symptoms"        },
  { code: "R51.9",   desc: "Headache, unspecified",                cat: "Symptoms"        },
  { code: "M47.812", desc: "Spondylosis, cervical region",         cat: "Spine"           },
  { code: "M50.12",  desc: "Cervical disc degeneration, mid-level",cat: "Spine"           },
  { code: "M25.511", desc: "Pain in right shoulder",               cat: "Joint"           },
  { code: "M25.512", desc: "Pain in left shoulder",                cat: "Joint"           },
  { code: "M75.1",   desc: "Rotator cuff syndrome",                cat: "Joint"           },
  { code: "G54.2",   desc: "Cervical root disorders",              cat: "Neurological"    },
  { code: "M54.16",  desc: "Radiculopathy, lumbar region",         cat: "Spine"           },
  { code: "M62.40",  desc: "Contracture of muscle, unspecified",   cat: "Soft Tissue"     },
  { code: "Z96.641", desc: "Presence of right artificial hip",     cat: "Status"          },
];

const COLORS = {
  Musculoskeletal: { bg: "rgba(0,232,154,0.08)",   text: "var(--grn)"    },
  "Soft Tissue":   { bg: "rgba(59,158,255,0.08)",  text: "var(--blue)"   },
  Symptoms:        { bg: "rgba(255,159,10,0.08)",  text: "var(--orange)" },
  Spine:           { bg: "rgba(191,90,242,0.08)",  text: "#bf5af2"       },
  Neurological:    { bg: "rgba(255,69,58,0.08)",   text: "var(--red)"    },
  Joint:           { bg: "rgba(52,199,89,0.08)",   text: "#34c759"       },
  Status:          { bg: "rgba(255,255,255,0.06)", text: "var(--muted)"  },
};

function matchCodes(query) {
  const q = query.toLowerCase();
  return ICD_DB.filter(r =>
    r.code.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.cat.toLowerCase().includes(q)
  );
}

export default function IcdCoder() {
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState([]);
  const [copied, setCopied]     = useState(false);

  const results = query.trim().length > 1 ? matchCodes(query) : [];

  const toggleCode = (item) => {
    setSelected(prev =>
      prev.find(s => s.code === item.code)
        ? prev.filter(s => s.code !== item.code)
        : [...prev, item]
    );
  };

  const handleCopy = () => {
    const text = selected.map(s => `${s.code} — ${s.desc}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">ICD-10-CM Reference Lookup</h1>
          <p className="page-sub">Review diagnostic-code references for documentation — not a diagnosis, coding, billing, coverage, or payer decision</p>
        </div>
      </div>

      <div className="ai-disclaimer-bar">
        ⚠ <strong>ICD-10-CM reference only.</strong> Verify every code against current official guidelines, supporting documentation, payer requirements, and the appropriate licensed clinician or coding professional before any clinical, billing, or coverage use.
      </div>

      <p className="settings-body-text" style={{ margin: "0 0 18px", maxWidth: 900 }}>
        <strong style={{ color: "var(--ink)" }}>Official verification source:</strong>{" "}
        <a href="https://icd10cmtool.cdc.gov/" target="_blank" rel="noreferrer" style={{ color: "var(--blue)" }}>CDC/NCHS ICD-10-CM Browser</a>.
        {" "}This beta screen contains a limited illustrative reference dataset, not the complete current ICD-10-CM release. Confirm the applicable release for the date of service.
      </p>

      <div className="icd-layout">
        <div className="card icd-search-card">
          <div className="card-header">
              <span className="card-title">Search ICD-10-CM References</span>
          </div>
          <input
            className="icd-search-input"
            type="text"
            placeholder='Search by code, condition, or body region — e.g. "low back", "M54", "cervical"'
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <div className="icd-results">
            {query.trim().length > 1 && results.length === 0 && (
              <div className="icd-empty">No codes found for "{query}"</div>
            )}
            {results.map(item => {
              const isSelected = !!selected.find(s => s.code === item.code);
              const color = COLORS[item.cat] ?? COLORS.Status;
              return (
                <div
                  key={item.code}
                  className={`icd-result-row ${isSelected ? "icd-row-selected" : ""}`}
                  onClick={() => toggleCode(item)}
                >
                  <div className="icd-result-left">
                    <span className="icd-result-code" style={{ background: color.bg, color: color.text }}>
                      {item.code}
                    </span>
                    <div>
                      <div className="icd-result-desc">{item.desc}</div>
                      <div className="icd-result-cat">{item.cat}</div>
                    </div>
                  </div>
                  <div className="icd-check">{isSelected ? "✓" : "+"}</div>
                </div>
              );
            })}
            {query.trim().length < 2 && (
              <div className="icd-hint">
                <div className="icd-hint-title">Quick searches</div>
                {["low back", "cervical", "myofascial", "sciatica", "shoulder"].map(t => (
                  <button key={t} className="icd-quick-btn" onClick={() => setQuery(t)}>{t}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="icd-selected-col">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Selected References ({selected.length})</span>
              {selected.length > 0 && (
                <button className="btn-copy" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : "Copy All"}
                </button>
              )}
            </div>
            {selected.length === 0 ? (
              <div className="icd-selected-empty">
                <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
                Click reference codes on the left to add them here
              </div>
            ) : (
              <div className="icd-selected-list">
                {selected.map(item => {
                  const color = COLORS[item.cat] ?? COLORS.Status;
                  return (
                    <div className="icd-selected-row" key={item.code}>
                      <span className="icd-result-code" style={{ background: color.bg, color: color.text }}>
                        {item.code}
                      </span>
                      <div className="icd-result-desc">{item.desc}</div>
                      <button className="icd-remove-btn" onClick={() => toggleCode(item)} title="Remove">×</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
