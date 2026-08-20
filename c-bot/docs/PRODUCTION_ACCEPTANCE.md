# Production Acceptance Record

> This is an operational acceptance record—not a self-certification. The accountable executive, security lead, and counsel must complete and retain their own evidence before authorizing PHI.

## Launch Gate

| Control area | Accountable owner | Evidence required | Status |
| --- | --- | --- | --- |
| BAA and legal review | Founder and counsel | Executed BAAs, approved privacy notice, terms, and data-use posture. | Open |
| Vendor inventory | Security or privacy lead | Documented processors, PHI role, agreement status, region, retention, subprocessors, and contacts. | Open |
| Identity and access | Engineering lead | MFA decision, role model, least-privilege review, joiner/mover/leaver procedure, and access-review cadence. | Open |
| Infrastructure security | Engineering lead | Private RDS, TLS, encryption at rest, secrets management, backups, logging, vulnerability remediation, and tested recovery. | Open |
| Incident response | Security or privacy lead | Named response team, 24/7 contact path, triage workflow, communication plan, and tabletop exercise. | Open |
| Risk analysis | Privacy or security lead | Documented HIPAA Security Rule risk analysis, risk treatment decisions, and leadership acceptance. | Open |
| Clinical governance | Clinical lead | Clinician review policy, training record, test evidence, and clear billing/diagnosis limitations. | Open |

## Deployment Acceptance

The team must confirm that the browser has no cloud provider, transcription, model, database, encryption, or secret-management credentials; that no PHI appears in telemetry or application logs; and that the production API verifies user identity before calling any downstream processor. Retain build version, deployment configuration review, test evidence, and approver names with the release record.

At the completion of this implementation pass, the API production-dependency audit returned no known vulnerabilities; the frontend production-dependency audit returned two moderate findings. The frontend findings must be triaged, remediated or formally risk-accepted, and re-audited before a PHI-enabled release.

## Incident Response Minimum

On a suspected security or privacy incident, preserve relevant evidence, stop unsafe processing, document the timeline, determine whether PHI was involved, engage the designated privacy/security owner, notify counsel and affected parties according to the approved plan, and record remediation. Do not use this checklist as a substitute for a legally reviewed incident-response plan.
