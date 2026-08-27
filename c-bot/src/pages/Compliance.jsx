/**
 * c-bot compliance-center page: presents operational readiness, not a certification claim.
 * It keeps PHI use blocked in beta and links the team to the repository BAA template.
 */
import { readinessItems, statusLabels } from "../compliance/readiness";

const CSS = `
.compliance-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:22px 0 26px}.compliance-card{min-height:205px;padding:23px;border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.025)}.compliance-kicker{display:flex;align-items:center;gap:8px;margin-bottom:23px;color:var(--muted);font:700 .6rem 'Manrope',sans-serif;letter-spacing:.11em;text-transform:uppercase}.compliance-dot{width:7px;height:7px;border-radius:50%;background:var(--orange)}.compliance-card.active .compliance-dot{background:var(--grn);box-shadow:0 0 8px var(--grn)}.compliance-card h3{margin:0 0 10px;font-family:'Syne',sans-serif;font-size:1rem;color:var(--ink)}.compliance-card p{margin:0;color:var(--muted);font-size:.78rem;line-height:1.65}.compliance-card .detail{margin-top:14px;padding-top:13px;border-top:1px solid var(--border);color:rgba(240,237,232,.5);font-size:.69rem}.compliance-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}.compliance-link{display:inline-flex;align-items:center;justify-content:center;padding:10px 13px;border:1px solid rgba(59,158,255,.25);border-radius:9px;color:var(--blue);font-size:.72rem;font-weight:700;text-decoration:none}.compliance-link:hover{background:rgba(59,158,255,.08)}.compliance-notice{margin-top:16px;padding:18px 20px;border-left:3px solid var(--orange);border-radius:0 12px 12px 0;background:rgba(255,159,10,.055);color:var(--muted);font-size:.78rem;line-height:1.7}.compliance-notice strong{color:var(--ink)}@media(max-width:800px){.compliance-grid{grid-template-columns:1fr}}
`;

export default function Compliance() {
  return (
    <div className="page">
      <style>{CSS}</style>
      <div className="page-header">
        <div>
          <h1 className="page-title">Compliance readiness</h1>
          <p className="page-sub">Operational boundaries, BAA workflow, and production requirements</p>
        </div>
        <span className="beta-warning">Beta · PHI not authorized</span>
      </div>

      <div className="disclaimer-card">
        <div className="disclaimer-title">A scoped readiness view—not a certification badge</div>
        <p className="disclaimer-text">This page describes the current product boundary and work that must be completed before a practice processes PHI. It does not represent HIPAA, CMIA, SOC 2, governmental, or medical-device certification. Consult qualified legal and compliance professionals for the organization’s final program.</p>
      </div>

      <div className="compliance-grid">
        {readinessItems.map((item) => (
          <article className={`compliance-card ${item.state === "active-control" ? "active" : ""}`} key={item.id}>
            <div className="compliance-kicker"><span className="compliance-dot" />{statusLabels[item.state]}</div>
            <h3>{item.label}</h3>
            <p>{item.summary}</p>
            <p className="detail">{item.detail}</p>
          </article>
        ))}
      </div>

      <section className="card settings-card">
        <div className="settings-section-title">Downstream Business Associate Agreement</div>
        <p className="settings-body-text">The repository includes a working BAA template based on standard HIPAA contract concepts. It defines SomaSync AI as the Business Associate and a subscribing therapist or clinic as the Covered Entity. The template needs counsel review, completed party details, and execution before reliance.</p>
        <div className="compliance-actions">
          <a className="compliance-link" href="https://github.com/Dropthathate/c-bot/blob/main/c-bot/docs/BAA_TEMPLATE.md" target="_blank" rel="noreferrer">Open BAA template ↗</a>
          <a className="compliance-link" href="https://github.com/Dropthathate/c-bot/blob/main/c-bot/docs/HIPAA_READINESS.md" target="_blank" rel="noreferrer">Read readiness guide ↗</a>
        </div>
      </section>

      <div className="compliance-notice"><strong>Before PHI enablement:</strong> execute applicable BAAs; confirm vendor and subcontractor arrangements; implement production authentication, least privilege, audit logging, encryption, incident response, and retention controls; perform a documented risk analysis; and validate the deployed system with responsible counsel and compliance leadership.</div>
    </div>
  );
}
