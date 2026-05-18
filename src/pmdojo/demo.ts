import type { PracticeInput } from './practice'

export const BUILDATHON_DEMO_SOURCE_IDS = ['bad-news', 'minto-scr', 'communicating-tradeoffs', 'evals']

export const BUILDATHON_DEMO_INPUT: PracticeInput = {
  artifact: 'Slack update',
  audience: 'CEO, eng lead, and customer success lead',
  situation:
    'Northwind, a top-5 customer, escalated an API ceiling to the CEO. The ceiling was deprioritized last sprint, renewal is at risk, and the CEO wants an internal answer before the customer reply goes out.',
  draft: `Quick update: Northwind is upset about the API limit and escalated it to the CEO.

We are looking into options with eng and will share more soon.

This is urgent because renewal is coming up.`,
  judgment: {
    recommendation: 'Ship a temporary 5x API limit by Thursday, then schedule the full fix next cycle.',
    nonGoals: 'Do not promise the permanent fix this week or blame engineering for the earlier deprioritization.',
    evidence: 'Northwind is a top-5 customer, renewal is at risk, and the issue reached the CEO.',
    tradeoff: 'We accept three days of migration distraction to reduce renewal risk, while deferring the full fix.',
    ask: '@sahar confirms feasibility by 1pm, @derek confirms precedent, and CEO gets the internal call before 2pm.',
    changeMind: 'If engineering finds the temporary raise is unsafe or precedent blocks it, send a narrower customer-safe path.',
  },
}

export const BUILDATHON_DEMO_REWRITE_PREVIEW = `Rec: ship a temporary 5x API limit by Thursday, then schedule the full fix next cycle.

Why: Northwind is a top-5 customer, renewal is at risk, and the issue reached the CEO.

Tradeoff: we take three days of migration distraction to reduce renewal risk; we are not promising the permanent fix this week.

Need @sahar feasibility by 1pm, @derek precedent check, and CEO alignment before I reply by 2pm.`
