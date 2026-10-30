# GitHub Developer, Maintainer & AI/OSS Talent Lead Enricher

Enriches GitHub usernames or profile URLs into actionable recruiting and DevTools B2B leads: extracts public profile & commit patch emails, company, location, personal website, X/Twitter, top programming languages, total stars, hireable status, and a 0-100 Technical Talent Score.

## Why Use GitHub Developer, Maintainer & AI/OSS Talent Lead Enricher?
- **Production-Grade & Zero Maintenance**: Built specifically for automated workflows in **n8n, Make.com, Zapier, Clay, LangChain, and MCP servers**.
- **Pay-Per-Event (PPE) Transparent Pricing**: Only **$0.005 per enriched result** (`$5.00 per 1,000 results`) with structured JSON, CSV, and Excel export.
- **Fast & Lightweight**: Uses high-concurrency HTTP parsing and structured JSON-LD / API discovery without expensive headless browser overhead.

## Key Features
1. **Deep Structured Extraction**: Automatically normalizes every output record against a strict dataset schema.
2. **Plug-and-Play API & Webhook Integration**: Call directly via `POST https://api.apify.com/v2/acts/huynguyen-data-cloud~github-developer-b2b-talent-enricher/run-sync-get-dataset-items`.
3. **Built-in Data Hygiene**: Deduplicates records, filters false positives, and computes actionable scoring metrics.

## Quick Start (cURL / API)
```bash
curl -X POST "https://api.apify.com/v2/acts/huynguyen-data-cloud~github-developer-b2b-talent-enricher/run-sync-get-dataset-items?token=YOUR_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targets": ["sindresorhus", "shadcn"]}'
```
