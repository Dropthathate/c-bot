# Digital Tycoon Launch Kit

This repository folder contains the complete delivery set for **The Digital Tycoon Playbook** funnel: the finished digital products, the responsive sales-page source, visual assets, TikTok monetization package, and the fully scripted 14-day traffic calendar.

## Live Revenue Link

**Payhip product page / checkout:** https://payhip.com/b/ZQbYD

The current product includes the substantive playbook PDF and the Quick-Win Checklist bonus. The product is priced at **$17 USD**.

## Asset Map

| Location | Contents |
|---|---|
| `production/` | Final ebook PDF, Quick-Win Checklist PDF, Payhip cover image, TikTok monetization package, 14-day calendar in Markdown and DOCX, and the editable Typst PDF-production projects. |
| `website/` | React + Vite + Tailwind source for the Operator’s Ledger sales page, including the Payhip checkout CTA and design notes. |
| `visual-assets/` | Brand mark, hero imagery, creator-focused editorial artwork, and the final 1600 × 2400 book cover. |

## Website Development

The sales page is a static React project. From `website/`, install dependencies and start the development server with:

```bash
pnpm install
pnpm dev
```

The primary checkout constant appears in `website/client/src/pages/Home.tsx`:

```ts
const checkoutUrl = "https://payhip.com/b/ZQbYD";
```

Keep this URL in sync with Payhip if the product link changes.

## TikTok Deliverables

`production/TikTok_Community_Monetization_Package.md` contains the Operator’s Room Subscription positioning, subscriber-badge system, 12 emote concepts, weekly LIVE schedule, and a 12-video premium Series outline.

`production/14_Day_TikTok_Traffic_Calendar.docx` is formatted for direct upload and conversion to Google Docs. The Markdown version remains available for editing in plain text. The calendar routes Days 1–7 to the Payhip Playbook and Days 8–14 to the premium Series and Subscription offer.

## Legal-Topic Content Boundary

The Family-Court Readiness Series is written as general educational organization and preparation content. It is not legal advice, legal representation, or a promised court result. Keep the existing disclaimer in the trailer, Series description, and relevant individual posts; local rules and circumstances must be reviewed with a qualified local legal professional.

## Launch Checklist

- Confirm the Payhip product page displays the current cover, final 15-page playbook, bonus checklist, description, and price.
- Publish the sales page from the saved project checkpoint in the Manus management UI.
- Build the 12 approved Subscription emotes and configure the current in-app perks available to the account.
- Upload the Series trailer and premium videos only after the account’s TikTok Studio eligibility review.

## Source References

The monetization package links directly to the public TikTok Creator Academy and TikTok Support sources used for Subscription and Series structure.
