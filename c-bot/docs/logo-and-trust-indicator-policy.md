# Logo and Trust-Indicator Policy

## Verified Findings

| Mark or authority | What the official source says | c-bot implementation decision |
| --- | --- | --- |
| American Massage Therapy Association (AMTA) | AMTA states that its member logo is trademarked, may not be altered, and may be used by members in marketing materials or to describe their background. It may not be used to endorse, sponsor, or recommend a product or service. | Do not display AMTA’s mark unless Nate Santos provides current AMTA membership and the official member-supplied asset. If enabled later, render it only as “AMTA member” and not as a c-bot endorsement. |
| U.S. Department of Health and Human Services (HHS) | HHS says its seal and logo are for official HHS use and not for private-sector materials; private-sector use can imply government endorsement. | Do not display any HHS, HIPAA, or government “compliance” logo. Use plain-language, accurately scoped controls and links to HHS guidance instead. |
| National Holistic Institute (NHI) | The founder credential references graduation from NHI, but no verified public trademark license was obtained for use of NHI branding. | Use the supplied credential in text only. Do not display NHI’s logo without written permission or a published license. |

## Implementation Rule

c-bot may display its own **SomaSync** mark, factual educational background, and custom non-certification trust indicators such as “BAA-ready workflow,” “TLS in transit,” “RDS encryption design,” and “Clinician review required.” These must be contextualized as system design and operational requirements—not as certification, legal advice, governmental endorsement, or a guarantee of HIPAA compliance.

## Existing Official SomaSync Asset

The repository already contains a transparent SomaSyncAI brand mark at `public/ss.png`, with a matching `public/favicon.png`. The current mark combines the branded S symbol with the SomaSyncAI wordmark. It is appropriate as the organization’s own visual identity, but a cropped or compact derivative should be used for browser favicon contexts where the full wordmark cannot remain legible.

## Sources

[1] [AMTA, Branding and Graphics Tools](https://www.amtamassage.org/resources/business-financial-tools/marketing-toolkit/branding-graphics-tools-amta-logos-members-can-download/)  
[2] [HHS, Use of HHS Logo, Seal and Symbol by Private Sector Partners](https://www.hhs.gov/branding/logos/contractors/index.html)
