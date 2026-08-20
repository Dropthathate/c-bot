# HIPAA-Oriented Readiness Guide

> **Operational guidance, not legal advice or certification.** This repository’s controls and documents support a HIPAA-oriented design discussion; they do not establish HIPAA compliance, a government approval, or permission to process PHI. Obtain qualified legal, security, privacy, and compliance review before enabling PHI.

## Current Product Boundary

The current c-bot beta is **not authorized for PHI or client-identifying information**. The dashboard visibly enforces a no-PHI beta notice, an AI-draft review requirement, and a voice-capture consent acknowledgement. These are useful product controls, but they do not replace a covered entity’s legal obligations or an organization-wide security program.

## Readiness Conditions Before Processing PHI

| Workstream | Required operational outcome |
| --- | --- |
| Contracting | Execute the appropriate BAA with each Covered Entity and obtain BAAs or equivalent required agreements with every relevant vendor and subcontractor. |
| Identity and access | Enforce unique user identity, MFA where appropriate, role-based least privilege, access review, session protection, and secure offboarding. |
| Data architecture | Document PHI data flows; minimize collection; define retention and deletion; encrypt data in transit and at rest; separate environments; and eliminate PHI from logs, analytics, support tools, and test data. |
| Vendor management | Verify each processor’s contract status, applicable regions, retention controls, subprocessors, security posture, incident commitments, and any account-level configuration necessary for the intended workload. |
| Security operations | Maintain risk analysis, asset inventory, secure configuration, vulnerability management, audit logging, monitoring, incident response, backups, and business continuity testing. |
| Privacy and clinical governance | Establish authorized use cases, minimum-necessary policy, consent/notice workflow, clinician review policy, user training, complaint handling, and a process for individual rights requests where applicable. |
| Validation | Test the deployed system, document residual risk, obtain organizational approval, and review the program periodically and after material changes. |

## Product-Specific Controls in This Repository

The beta includes a voice-consent acknowledgement before recording, an AI draft disclaimer, an ICD-10-CM reference-only warning, private dashboard access, and a compliance readiness center. In the planned production architecture, browser keys are not used for provider or database secrets; trusted backend services should handle speech, model, and database interactions using approved credentials and encryption.

## Important Scope Limit

There is **no official HHS or HIPAA compliance logo** that c-bot may use to certify itself. The HHS seal and logo are reserved for official government use. The product therefore uses plain-language trust indicators and links to source guidance rather than a government or third-party endorsement mark.[1]

## References

[1] [HHS: Use of HHS Logo, Seal and Symbol by Private Sector Partners](https://www.hhs.gov/branding/logos/contractors/index.html)  
[2] [HHS: Business Associate Contracts](https://www.hhs.gov/hipaa/for-professionals/covered-entities/sample-business-associate-agreement-provisions/index.html)  
[3] [HHS: Breach Notification Rule](https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html)
