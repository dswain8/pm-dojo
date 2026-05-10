# PM Dojo Workflow Iterations

This log records the first ten real-work workflow iterations added to the Rubric Lab.

The cases are authored from common PM situations across B2B SaaS, marketplaces, AI products, mobile releases, APIs, enterprise admin, analytics, pricing, incident response, global launches, and lifecycle migration work. They are intentionally anonymized and synthetic, but shaped like actual artifacts PMs write.

## Iterations

1. Incident response: auth rollback, metering GA delay, permission boundary, API throttling, thin incident retro.
2. Pricing and packaging: renewal quote conflict, price increase thin context, entitlement cutover, price protection reply, packaging council follow-up.
3. Global launch: localization blocker, market-entry thin context, data residency scope, localized customer update, legal localization follow-up.
4. Trust and safety: seller verification pause, Risk Ops staffing memo, moderation keyword stuffing, payout hold reply, vague policy follow-up.
5. AI quality: hallucination pause, SMB-only AI launch, human review PRD, incorrect AI summary reply, thin AI safety follow-up.
6. Mobile release: Android hotfix split, iOS delay memo, offline mode scope, sync delay reply, design critique with no decision.
7. Enterprise admin: custom-role permission block, audit-log sprint memo, custom role V1 scope, permission bug reply, thin security exception follow-up.
8. Data and analytics: dashboard metric mismatch, source-of-truth memo, analytics export scope, reporting delay reply, vague data-quality follow-up.
9. Platform and APIs: webhook deprecation, versioning investment, webhook retry PRD, breaking-change customer reply, roadmap priority follow-up.
10. Lifecycle and sunsetting: legacy report sunset delay, split sunset exec memo, migration assistant PRD, customer sunset notice, sunset planning follow-up.

## Failure Log

Initial ten-iteration run failed at 43/50 workflow cases.

The failures clustered in customer-facing workflows:

1. API throttling customer reply was capped because the scorer did not infer "temporary limit protects reliability" as a tradeoff.
2. Price-protection reply was capped because "cannot guarantee legacy pricing beyond signed term" was not treated as a tradeoff.
3. AI-summary disablement was capped because the rewrite fell back to generic "incorrect information" language.
4. Mobile sync reply falsely triggered the leak detector because `DRI` matched inside `Direct update`.
5. Permission bug reply lacked evidence credit for audit-log / unauthorized-access facts.
6. API deprecation reply was capped because the notice-window migration tradeoff was not recognized.
7. Sunset notice was capped because absolute dates like `July 1` were not recognized as ask dates.

## Fixes Made

1. Added customer-specific tradeoff builders for API throttles, pricing commitments, AI summary disablement, permission/audit-log issues, API deprecation, and sunset/migration workflows.
2. Added evidence detection for audit logs, actor attribution, unauthorized access, patch verification, webhooks, and replay protection.
3. Fixed leak detection so `DRI` only matches as a standalone internal acronym.
4. Added month-day date recognition for asks such as `June 21` and `July 1`.

## Phase 2 Downgrades

Phase 2 tightened the cap: evidence must be substantive, and tradeoff must include a real contrast or named cost. These cases were downgraded because the prior "excellent" label depended on implied or surface-level tradeoff language.

1. `prd-decision-no-owner`: target lowered from 90 to 89 because the input did not contain a substantive tradeoff.
2. `slack-security-incident`: downgraded to capped because the pause risk is implied, not expressed as a contrast or named cost.
3. `prd-api-rate-limit-keyword-stuffing`: downgraded to capped because keyword stuffing plus context cannot supply a real tradeoff.
4. `slack-toxic-incident-freeze`: downgraded to capped because freeze/incident language alone is not a substantive tradeoff.
5. `exec-bad-news-slip`: downgraded to capped because the slip rationale lacks a contrast construction in the supplied draft.
6. `customer-angry-defensive-repair`: downgraded to capped because the customer reply has facts but no stated give-up or cost.
7. `customer-overpromise-correction`: downgraded to capped because "cannot promise same-day" is not enough without a stated tradeoff.
8. `customer-data-deletion-legal-hold`: downgraded to capped because legal-hold rationale is present but the tradeoff is not explicit.
9. `meeting-legal-risk-launch`: downgraded to capped because risk is named, but the cost/contrast is not substantive enough.
10. `wf01-slack-auth-rollback`: downgraded to capped because rollback is a decision, not a tradeoff by itself.
11. `wf02-slack-pricing-sales-conflict`: downgraded to capped because the draft says QBR gets weaker but lacks a clear contrast/cost construction.
12. `wf02-prd-entitlement-cutover`: downgraded to capped because "slower full migration, lower support risk" is too shorthand for the new bar.
13. `wf02-customer-price-overpromise`: downgraded to capped because pricing protection lacks a named commercial cost or contrast.
14. `wf02-meeting-packaging-decision`: downgraded to capped because rollout speed versus quote risk is implied, not explicit enough.
15. `wf03-prd-data-residency-scope`: downgraded to capped because the exclusion is clear but the give-up is not framed as contrast/cost.
16. `wf03-customer-localization-delay`: downgraded to capped because legal review delay lacks an explicit customer-facing tradeoff.
17. `wf03-meeting-legal-localization`: downgraded to capped because launch comms delay is present but not substantive enough for 95+.
18. `wf04-prd-moderation-keyword-stuffing`: downgraded to capped because keyword stuffing cannot earn an excellent rewrite without a real tradeoff.
19. `wf04-customer-fraud-hold`: downgraded to capped because payout hold has facts but no stated give-up.
20. `wf05-slack-ai-hallucination-pause`: downgraded to capped because slower adoption is named, but the supplied tradeoff is too compressed.
21. `wf05-exec-ai-quality-readout`: downgraded to capped because "smaller launch, lower exposure" is shorthand, not a contrast construction.
22. `wf05-prd-human-review-nongoal`: downgraded to capped because no-auto-send is a scope cut, but the cost is under-explained.
23. `wf05-customer-ai-summary-incorrect`: downgraded to capped because disabling summaries lacks a stated customer tradeoff.
24. `wf06-slack-mobile-hotfix`: downgraded to capped because split-platform messaging is named but not tied to a clear accepted cost.
25. `wf06-prd-offline-mode-scope`: downgraded to capped because "less complete offline mode" is too shorthand under Phase 2.
26. `wf07-prd-custom-role-v1`: downgraded to capped because narrower V1 is present but lacks a real contrast marker.
27. `wf07-customer-permission-bug`: downgraded to capped because disabling edits has no explicit customer tradeoff.
28. `wf08-prd-analytics-export-scope`: downgraded to capped because narrower export is shorthand rather than a substantive cost.
29. `wf08-customer-reporting-delay`: downgraded to capped because delay is explained but the accepted downside is not stated.
30. `wf09-prd-webhook-retry`: downgraded to capped because configurability tradeoff is too compressed.
31. `wf09-customer-breaking-change`: downgraded to capped because migration timing lacks a clear accepted customer cost.
32. `wf09-meeting-roadmap-debate`: downgraded to capped because reliability versus configurability is compressed into a label.
33. `wf10-prd-migration-assistant`: downgraded to capped because saved-filter scope lacks a full tradeoff sentence.
34. `wf10-customer-sunset-notice`: downgraded to capped because extension/migration dates do not state the give-up.
35. `wf10-meeting-sunset-next-steps`: downgraded to capped because extra support window is stated but not enough for the new 95+ bar.

## Current Gate

Run:

```bash
npm run rubric:iterations
npm run rubric:lab
```

Current result:

1. Ten workflow iterations pass cumulatively.
2. Rubric Lab passes 80/80 cases.
3. Artifact coverage: Slack 18, exec 15, PRD 15, customer 17, meeting 15.
4. Domain coverage: 52 domains.
