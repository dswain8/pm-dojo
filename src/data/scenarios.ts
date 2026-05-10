export type Difficulty = "easy" | "medium" | "hard" | "nightmare";

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: "Intern",
  medium: "Mid-Level PM",
  hard: "Senior PM",
  nightmare: "Executive Stakes",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "text-dojo-green",
  medium: "text-dojo-blue",
  hard: "text-dojo-purple",
  nightmare: "text-dojo-red",
};

export const DIFFICULTY_TIME: Record<Difficulty, number> = {
  easy: 180,
  medium: 150,
  hard: 120,
  nightmare: 90,
};

// --- QUICK DRAW ---

export interface QuickDrawScenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  setup: string;
  task: string;
  principles: string[];
  modelAnswer: string;
  gradingHints: {
    clarity: string;
    strategy: string;
    substance: string;
  };
}

export const QUICK_DRAW_SCENARIOS: QuickDrawScenario[] = [
  {
    id: "qd-e1",
    title: "The Status Update",
    difficulty: "easy",
    setup:
      "Your manager asked for a weekly project update on the billing migration. You're on track — 60% done, one minor blocker (waiting on API docs from another team). No risks to the timeline.",
    task: "Write a 3-4 sentence Slack message to your manager.",
    principles: [
      "Front-load the point",
      "Conciseness",
      "Proactive communication",
    ],
    modelAnswer:
      "Billing migration is on track — 60% complete, targeting [date] as planned. One blocker: waiting on API docs from Platform (pinged Raj Tuesday, following up today). No risk to timeline yet, but will flag if docs slip past Friday.",
    gradingHints: {
      clarity:
        "Did they lead with status (on track)? Is it scannable? Any preamble?",
      strategy:
        "Did they preemptively address the blocker? Show they're on top of it?",
      substance:
        "Did they include the specific blocker, what they've done about it, and a risk threshold?",
    },
  },
  {
    id: "qd-e2",
    title: "The Feature Request Reply",
    difficulty: "easy",
    setup:
      "A customer success rep DMed you: \"Hey, customer XYZ is asking if we can add CSV export to the reports page. They said it's a dealbreaker.\" You're not going to build this in the next quarter.",
    task: "Write the Slack reply.",
    principles: [
      "Solutions-oriented framing",
      "Saying no constructively",
      "Conciseness",
    ],
    modelAnswer:
      "CSV export isn't on the roadmap this quarter — we're focused on [X] and [Y] which affect more customers. Two options for XYZ: (1) they can use the API to pull report data now, or (2) I can add their vote to the feature request so they're notified when we prioritize it. Which works better for them?",
    gradingHints: {
      clarity: "Did they state the decision (no) upfront? Or did they bury it?",
      strategy:
        "Did they give the CS rep something to go back to the customer with? Alternatives?",
      substance:
        "Did they explain why (briefly) and offer a concrete path forward?",
    },
  },
  {
    id: "qd-m1",
    title: "The Slipping Timeline",
    difficulty: "medium",
    setup:
      "Your project is 2 weeks behind schedule. Root cause: the API dependency you flagged 3 weeks ago wasn't prioritized by the platform team. Your manager doesn't know yet. You have a leadership review in 4 days.",
    task: "Write the Slack DM to your manager right now.",
    principles: [
      "No-surprise rule",
      "Solutions-oriented escalation",
      "Managing up",
    ],
    modelAnswer:
      "Heads up — billing project is ~2 weeks behind. Root cause: the Platform API dependency I flagged on [date] hasn't been prioritized. I've followed up with Raj twice, no movement.\n\nMy recommendation: I'll set up a meeting with Raj's manager tomorrow to escalate. If that doesn't unblock by Wednesday, we should bring it to the leadership review Thursday with a revised timeline.\n\nWanted you to know before the review. Happy to discuss approach.",
    gradingHints: {
      clarity:
        "Did they lead with the news (behind schedule)? Or build up to it?",
      strategy:
        'Did they tell their manager before the review (no-surprise rule)? Frame it as "I\'m handling it" not "help me"?',
      substance:
        "Did they include: what happened, what they've tried, what they recommend, and the timeline impact?",
    },
  },
  {
    id: "qd-m2",
    title: "The Controversial Decision",
    difficulty: "medium",
    setup:
      "After analyzing the data, you've decided to kill a feature that the sales team has been promising to prospects. Usage is 3% of customers, maintenance cost is high, and it blocks the new architecture. Sales will be upset.",
    task: "Write the announcement to the cross-functional Slack channel.",
    principles: [
      "Anti-sell posture",
      "Lead with the decision",
      "Audience adaptation",
    ],
    modelAnswer:
      "We're deprecating [Feature X] effective [date].\n\nI know this impacts active sales conversations, so here's the reasoning and what we're doing about it:\n\n**Why:** 3% usage, high maintenance cost, and it's the primary blocker for the new architecture that unlocks [benefits sales cares about].\n\n**The tradeoff I weighed:** Keeping it means 2 more quarters before we can ship [thing sales wants more]. Cutting it means short-term pain for faster delivery on the bigger bet.\n\n**For affected deals:** I'm working with [Sales Lead] on a migration path and talking points. Will share by [date].\n\nI'm available for questions — and genuinely want to hear if I'm missing context on deal impact.",
    gradingHints: {
      clarity: "Did they lead with the decision? Is the structure scannable?",
      strategy:
        "Did they anti-sell (name the downside to sales)? Adapt the framing for a sales audience (what's in it for them)?",
      substance:
        "Did they include data, the tradeoff reasoning, and a concrete plan for affected deals?",
    },
  },
  {
    id: "qd-h1",
    title: "The Exec Hallway Ambush",
    difficulty: "hard",
    setup:
      "Your VP stopped you in the hallway: \"I heard the new pricing model isn't going well. What's happening?\" Reality: it IS going well — adoption is at 40% in month 1 — but there was one loud complaint from a large customer that reached the VP through sales.",
    task: "Write what you would say (spoken response, 30 seconds max).",
    principles: [
      "Managing up under pressure",
      "Front-load the truth",
      "Steelmanning the concern",
    ],
    modelAnswer:
      "\"Actually, it's going well — 40% adoption in month 1, ahead of target. I think what you're hearing is the Acme complaint, which is real — they're on a legacy plan that doesn't map cleanly to the new tiers. I'm working with their AM on a migration path this week. Happy to send you the full dashboard if you want the complete picture.\"",
    gradingHints: {
      clarity:
        "Did they correct the narrative immediately (it's going well) without being defensive?",
      strategy:
        "Did they steelman the concern (acknowledge the Acme issue is real) while reframing the overall picture?",
      substance:
        "Did they have specifics (40%, Acme, migration plan) ready? Or was it vague reassurance?",
    },
  },
  {
    id: "qd-h2",
    title: "The Apology",
    difficulty: "hard",
    setup:
      "Your team shipped a billing bug that double-charged 200 customers. It was caught in 4 hours and refunded, but the VP of Customer Success is angry because their team fielded 50 support tickets. You need to own it without being a doormat.",
    task: "Write the Slack message to the VP of Customer Success.",
    principles: [
      "Delivering bad news",
      "Apology structure",
      "Solutions-oriented framing",
    ],
    modelAnswer:
      "We shipped a billing bug yesterday that double-charged 200 customers. Your team bore the brunt — 50 tickets in 4 hours. That's on us, and I'm sorry for the fire drill.\n\nWhat we've done: All charges refunded within 4 hours of detection. Root cause identified (race condition in the charge retry logic).\n\nWhat we're doing: Shipping a fix this week + adding a pre-deploy charge validation check so this class of bug can't reach production again. I'll share the postmortem by Friday.\n\nIf any customers need direct outreach from the billing team, send them my way.",
    gradingHints: {
      clarity:
        "Did they lead with what happened (not with an apology)? Is the structure clear?",
      strategy:
        "Did they own it without over-apologizing? Show accountability without being a doormat?",
      substance:
        "Did they cover: what happened, impact, what's been done, what's being done, and a concrete offer?",
    },
  },
  {
    id: "qd-n1",
    title: "The CEO Pivot",
    difficulty: "nightmare",
    setup:
      "The CEO just came back from a conference and wants to \"pivot to AI\" across all products. Your roadmap doesn't include AI because the customer problems you're solving don't need it. Half the leadership team is already scrambling to add AI features. Your VP asks you: \"What's our AI story?\"",
    task: "Write the email to your VP making the case for NOT adding AI to your product area right now.",
    principles: [
      "Pushing back on leadership",
      "Anti-sell",
      "Analytical rigor",
      "Conviction under pressure",
    ],
    modelAnswer:
      "Subject: Billing AI story — my recommendation is to wait\n\nI've thought about where AI fits in billing. My recommendation: not this quarter, and here's why.\n\n**The honest case for AI in billing:** There are real opportunities — anomaly detection on invoices, natural language queries on billing data, smart dunning optimization. These are worth exploring in H2.\n\n**Why not now:** Our top 3 customer pain points (invoice accuracy, payment failures, self-serve plan changes) are all deterministic problems. AI adds complexity without improving outcomes. Shipping AI features here would be a \"looks good in a deck\" move, not a \"solves customer problems\" move.\n\n**The risk I'm naming:** If every team ships AI features and we don't, it could look like we're behind. I think that's a perception risk worth taking — I'd rather ship the things that actually move retention and NPS this quarter.\n\n**My proposal:** Focus Q2 on the current roadmap. I'll scope an AI exploration sprint for Q3 targeting the three opportunities above.\n\nOpen to pushback — if you see something I'm missing, I want to hear it.",
    gradingHints: {
      clarity:
        "Did they lead with the recommendation (not now)? Is the email scannable?",
      strategy:
        "Did they anti-sell (steelman the case FOR AI)? Name the political risk? Show they've thought about the CEO's perspective?",
      substance:
        "Did they have a structured argument with specifics? Offer a concrete alternative (Q3 exploration)? Avoid being dismissive of AI entirely?",
    },
  },
];

// --- REWRITE ARENA ---

export interface RewriteScenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  original: string;
  flaws: { tag: string; description: string }[];
  modelRewrite: string;
}

export const REWRITE_SCENARIOS: RewriteScenario[] = [
  {
    id: "rw-1",
    title: "The Preamble Monster",
    difficulty: "easy",
    original:
      "Hi team, I wanted to follow up on our conversation from last week about the dashboard redesign. As you may recall, we discussed several options during the meeting and there were a few different perspectives shared. I've been thinking about this a lot since then and after considering all the angles, I think it might make sense to potentially go with Option B for the new layout. Of course, this is just my initial thought and I'm totally open to hearing other opinions. Let me know if you have any questions or concerns about this direction!",
    flaws: [
      {
        tag: "PREAMBLE",
        description: "First two sentences are pure throat-clearing",
      },
      { tag: "BURIED POINT", description: "Decision is in sentence 4 of 6" },
      {
        tag: "WEAK WORDS",
        description:
          '"might make sense", "potentially", "just my initial thought", "totally open"',
      },
      {
        tag: "THROAT-CLEARING CLOSE",
        description: '"Let me know if you have any questions"',
      },
    ],
    modelRewrite:
      "We're going with Option B for the dashboard layout. It scored highest on the usability metrics we discussed last week. If anyone has blocking concerns, flag them by Thursday — otherwise we'll kick off implementation Friday.",
  },
  {
    id: "rw-2",
    title: "The Blame Dodger",
    difficulty: "medium",
    original:
      "Hey Sarah, I wanted to loop you in on something. So the reporting feature release that was supposed to go out this week is going to be delayed. The engineering team ran into some unexpected technical challenges with the database migration that turned out to be more complex than initially anticipated. I know this is probably not ideal timing given the customer commitments, and I apologize for any inconvenience this might cause. We're working on figuring out a new timeline and I'll keep you posted as we learn more. Happy to jump on a call if that would be helpful!",
    flaws: [
      {
        tag: "PREAMBLE",
        description:
          '"I wanted to loop you in on something" — just say the thing',
      },
      {
        tag: "PASSIVE BLAME",
        description: '"The engineering team ran into..." — own it',
      },
      {
        tag: "WEAK WORDS",
        description: '"probably not ideal", "might cause", "figuring out"',
      },
      {
        tag: "NO RECOMMENDATION",
        description: "What's the new timeline? What's the plan?",
      },
      {
        tag: "THROAT-CLEARING CLOSE",
        description: '"Happy to jump on a call"',
      },
    ],
    modelRewrite:
      "Sarah — reporting feature is delayed 1 week, shipping next Thursday instead of this Friday.\n\nRoot cause: the database migration was more complex than we scoped. That's on me — I should have built more buffer given the unknowns.\n\nI've already adjusted the engineering plan. No impact to the customer pilot on the 15th — we have margin. I'll send you the updated timeline today.",
  },
  {
    id: "rw-3",
    title: "The Decision Avoider",
    difficulty: "medium",
    original:
      "Team, I've been looking into the question of whether we should build the integration in-house or use the third-party vendor. There are pros and cons to both approaches. Building in-house gives us more control and customization but takes longer and requires dedicated engineering resources. The vendor solution is faster to implement but has some limitations around configurability and there's the ongoing cost to consider. I think there are valid arguments on both sides and it would be great to get everyone's input. What does the team think we should do? Maybe we can discuss in our next team meeting?",
    flaws: [
      {
        tag: "NO RECOMMENDATION",
        description: 'Classic "what do you want me to do?" framing',
      },
      {
        tag: "LAZY THINKING",
        description: "Listed pros and cons without analysis or weighting",
      },
      {
        tag: "DEFERRED DECISION",
        description: "Punting to a meeting instead of proposing a direction",
      },
      {
        tag: "WEAK WORDS",
        description: '"I think there are valid arguments on both sides"',
      },
    ],
    modelRewrite:
      "Recommendation: go with the vendor for the integration.\n\nThe build option gives us more control, but we don't need that control right now — our requirements are standard. The vendor ships in 2 weeks vs. 8 weeks for in-house, and the $12K/year cost is less than the engineering time we'd burn building it.\n\nThe risk: if our requirements get complex in 6 months, we may need to migrate. I think that's worth it — we learn what we actually need from v1 before investing in a custom build.\n\nI'll move forward with the vendor unless someone has a blocking concern by EOD Wednesday.",
  },
  {
    id: "rw-4",
    title: "The Over-Apologizer",
    difficulty: "hard",
    original:
      "Hi Marcus, I'm really sorry about this, but I need to let you know that we won't be able to include the SSO feature in the Q3 release. I know your team has been counting on this and I feel terrible about having to deliver this news. We really tried to make it work but with the other priorities and the resource constraints, it just wasn't possible. I completely understand if you're frustrated — I would be too. I want to make sure you know that this is absolutely still a priority for us and we're committed to getting it done in Q4. I'm so sorry again and please don't hesitate to reach out if you want to talk about this further.",
    flaws: [
      {
        tag: "OVER-APOLOGIZING",
        description: "Three apologies in one message — undermines credibility",
      },
      {
        tag: "SELF-EXPRESSION",
        description: '"I feel terrible" — your feelings aren\'t the message',
      },
      {
        tag: "NO PLAN",
        description: '"Committed to Q4" is vague — what specifically?',
      },
      {
        tag: "WEAK WORDS",
        description: '"just wasn\'t possible", "absolutely still a priority"',
      },
      {
        tag: "DOORMAT POSTURE",
        description:
          "Inviting frustration rather than channeling it productively",
      },
    ],
    modelRewrite:
      "Marcus — SSO isn't making Q3. I know your team was counting on it, and I want to be straight about why and what's next.\n\nWe deprioritized it for [X] and [Y], which had higher impact on revenue retention this quarter. That was my call, and I own the tradeoff.\n\nFor Q4: SSO is locked into Sprint 1 (October). I'm not going to let it slip again — I'll share the eng plan with you next week so you can hold me to it.\n\nIf there are specific deals at risk, let me know and I'll work with your team on interim solutions.",
  },
  {
    id: "rw-5",
    title: "The Wall of Context",
    difficulty: "hard",
    original:
      "Hi Sarah, I wanted to give you some context before our skip-level meeting tomorrow. Over the past quarter, the team has been working on three major workstreams: the invoice redesign (which started in January after we identified usability issues in the Q4 customer satisfaction survey), the payment processing migration (driven by the platform team's decision to deprecate the old payment gateway, which was communicated in November), and the self-serve cancellation flow (which came out of the churn analysis the data team completed in December). The invoice redesign is going well — we shipped phase 1 two weeks ago and early metrics show a 15% reduction in support tickets related to invoice confusion. The payment migration hit a snag when we discovered that 12% of our customers are on legacy billing plans that aren't compatible with the new gateway, which required us to build a migration path we hadn't originally scoped. The cancellation flow is in design review. Overall I'd say we're in decent shape but there are some risks I'd like to flag around the payment migration timeline.",
    flaws: [
      {
        tag: "WALL OF TEXT",
        description: "One enormous paragraph — no structure, no scanability",
      },
      {
        tag: "BURIED LEDE",
        description:
          "The important thing (payment migration risk) is the last sentence",
      },
      {
        tag: "EXCESSIVE CONTEXT",
        description: "Reader doesn't need the origin story of each workstream",
      },
      {
        tag: "WEAK WORDS",
        description:
          "\"I'd say we're in decent shape\" — commit to an assessment",
      },
    ],
    modelRewrite:
      "Sarah — quick prep for tomorrow's skip-level. One risk to flag, two things going well.\n\n**Risk: Payment migration timeline**\n12% of customers are on legacy plans incompatible with the new gateway. We're building a migration path we didn't originally scope. I'm assessing the timeline impact this week — may need to discuss resourcing.\n\n**On track:**\n- Invoice redesign: Phase 1 shipped, 15% drop in invoice-related support tickets\n- Cancellation flow: In design review, on schedule\n\nHappy to go deeper on any of these tomorrow.",
  },
];

// --- CONCEPT CLINIC ---

export interface ConceptScenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  situation: string;
  bestAnswer: {
    principle: string;
    source: string;
    explanation: string;
  };
  relatedPrinciples: string[];
}

export const CONCEPT_SCENARIOS: ConceptScenario[] = [
  {
    id: "cc-e1",
    title: "The Hedger",
    difficulty: "easy",
    situation:
      'A PM sends their manager this message: "The project might be a little behind. I think maybe we should consider pushing the deadline? Let me know what you think."',
    bestAnswer: {
      principle: "Weak words / Hedging",
      source: "Communication and Writing (Wes Kao)",
      explanation:
        '"Might be", "a little", "I think maybe", "consider" — all undermine the message. Rewrite with commitment: "The project is 1 week behind. I recommend pushing the deadline to [date]. Here\'s why."',
    },
    relatedPrinciples: ["Front-load the point", "Be solutions-oriented"],
  },
  {
    id: "cc-e3",
    title: "The Helpless PM",
    difficulty: "easy",
    situation:
      'A PM brings a problem to their manager: "The platform team deprioritized our API dependency. I\'m not sure what to do."',
    bestAnswer: {
      principle: 'Eliminate "what do you want me to do?"',
      source: "Analytical Thinking (Shreyas Doshi) + Managing Up (Wes Kao)",
      explanation:
        "Never bring a problem without a proposed path. Frame as: \"Here's the issue, here's what I've tried, here's what I recommend.\"",
    },
    relatedPrinciples: [
      "Solutions-oriented escalation",
      "Structured reasoning",
    ],
  },
  {
    id: "cc-m1",
    title: "The Overseller",
    difficulty: "medium",
    situation:
      "A PM is presenting a new feature proposal to leadership. They spend 10 minutes explaining why it's great, covering every benefit. They don't mention any risks, tradeoffs, or reasons it might fail. The leadership team starts poking holes.",
    bestAnswer: {
      principle: "The Genuine Anti-Sell",
      source: "Influence and Leadership (Wes Kao)",
      explanation:
        "Name the tradeoffs yourself before anyone else does. Steelman the counterarguments. \"The risk here is X. Here's why I think it's worth taking.\"",
    },
    relatedPrinciples: ["Steelmanning", "Audience adaptation"],
  },
  {
    id: "cc-m2",
    title: "The Blindside",
    difficulty: "medium",
    situation:
      "A PM's manager was blindsided in a cross-functional meeting when another team brought up a delay in the PM's project. The manager didn't know about the delay.",
    bestAnswer: {
      principle: "The No-Surprise Rule",
      source: "Managing Up (Wes Kao)",
      explanation:
        '"If your manager would be surprised to learn about it from someone else, you should have already told them." Proactive communication is the fix.',
    },
    relatedPrinciples: ["Proactive communication", "Trust through consistency"],
  },
  {
    id: "cc-h1",
    title: "The False Humble",
    difficulty: "hard",
    situation:
      "A PM disagrees with their VP's strategic direction but the VP is passionate about it. The PM has data supporting a different approach but hasn't shared it because \"it's not my place to push back on the VP.\"",
    bestAnswer: {
      principle: "The Humility Trap",
      source: "Self-Development and Mindset (Shreyas Doshi) + Managing Up",
      explanation:
        "False humility is not a virtue — it's avoidance disguised as respect. Frame the pushback analytically: \"I want to share some data that might change the picture. Here's what I'm seeing.\"",
    },
    relatedPrinciples: [
      "Analytical rigor",
      "Escalation framing",
      "Anti-sell posture",
    ],
  },
  {
    id: "cc-h2",
    title: "The Feelings Postmortem",
    difficulty: "hard",
    situation:
      "After a product launch goes badly, a PM writes a postmortem email that opens with: \"First, I want to say that I feel really bad about how this went. I know everyone worked so hard and I'm sorry the outcome didn't match our expectations.\"",
    bestAnswer: {
      principle: "Communication is Strategy, Not Self-Expression",
      source: "Feedback and Difficult Conversations (Wes Kao)",
      explanation:
        "The PM's feelings are not the message. The reader needs: what happened, why, what we learned, what we're doing differently. Lead with the facts, not the feelings.",
    },
    relatedPrinciples: ["Front-load the point", "Audience adaptation"],
  },
  {
    id: "cc-n1",
    title: "The Project Funeral",
    difficulty: "nightmare",
    situation:
      "A PM has been told their project will be cancelled due to budget cuts. They need to communicate this to their team of 5 engineers who've been working on it for 4 months. Two of them joined the company specifically for this project.",
    bestAnswer: {
      principle: "Delivering Bad News + Listening",
      source: "Feedback and Difficult Conversations + Listening",
      explanation:
        "Lead with the news, don't bury it. But after delivering it, the most important thing is to listen — not fill silence with platitudes. Frame for the outcome you want: team stays motivated, trust preserved. Acknowledge the emotional weight without performing grief.",
    },
    relatedPrinciples: [
      "Communication as strategy",
      "Audience adaptation",
      "Active listening",
    ],
  },
];

// --- SCENARIO REPLAY ---

export interface ScenarioChoice {
  label: string;
  text: string;
  trustDelta: number;
  effectivenessDelta: number;
  outcome: string;
  principle: string;
}

export interface ScenarioStep {
  narration: string;
  choices: ScenarioChoice[];
}

export interface ReplayScenario {
  id: string;
  title: string;
  difficulty: Difficulty;
  premise: string;
  steps: ScenarioStep[];
  debrief: string;
}

export const REPLAY_SCENARIOS: ReplayScenario[] = [
  {
    id: "sr-1",
    title: "The Roadmap Ambush",
    difficulty: "medium",
    premise:
      "You're presenting your Q3 roadmap to the leadership team. Two minutes in, Marcus (VP Sales) interrupts: \"Before we go further — three enterprise deals are at risk if we don't ship SSO by August.\" This isn't on your roadmap. You deprioritized SSO based on usage data. But Marcus has the CEO's ear. The room is looking at you.",
    steps: [
      {
        narration:
          'Marcus just dropped the SSO bomb. The CEO is watching. Your slide deck is frozen on "Q3 Priorities" — none of which say SSO. What do you do?',
        choices: [
          {
            label: "A",
            text: '"Thanks Marcus. Let me finish the presentation and we\'ll discuss SSO at the end."',
            trustDelta: -10,
            effectivenessDelta: 0,
            outcome:
              "Marcus feels dismissed. The CEO notices you dodged it. The rest of your presentation is overshadowed by the unresolved SSO question. People are half-listening, half-thinking about Marcus's deals.",
            principle:
              "Avoiding the conversation in real-time rarely works — the room's attention has already shifted. (Meetings & Real-Time)",
          },
          {
            label: "B",
            text: "\"That's a fair flag. Can you share the specific deal data? I deprioritized SSO based on usage — I'd love to compare signals.\"",
            trustDelta: 15,
            effectivenessDelta: 10,
            outcome:
              "Marcus respects the ask. The CEO likes that you're data-driven, not defensive. The conversation shifts from confrontation to collaboration. Marcus promises to send deal details after the meeting.",
            principle:
              'Analytical thinking under pressure: "What would need to be true for this to change my mind?" + Anti-sell: acknowledging your own data might be incomplete. (Analytical Thinking, Influence)',
          },
          {
            label: "C",
            text: '"We looked at SSO and decided other items had higher impact. Here\'s why..."',
            trustDelta: -5,
            effectivenessDelta: 5,
            outcome:
              "Technically correct, but it sounds defensive. Marcus feels like you're dismissing his input. The CEO senses a turf war forming. You're now debating SSO in a meeting that was supposed to be about Q3 priorities.",
            principle:
              "Being right isn't enough — how the message lands matters more than what you say. (Communication as Strategy)",
          },
          {
            label: "D",
            text: '"Let me take that offline with you after this meeting."',
            trustDelta: -5,
            effectivenessDelta: -5,
            outcome:
              "Classic dodge. Marcus is annoyed — he raised it here because he wants leadership visibility. The room reads it as avoidance. The CEO makes a mental note that you didn't engage.",
            principle:
              '"Take it offline" is the meeting equivalent of "let me know if you have questions" — it signals you don\'t want to deal with it. (Meetings & Real-Time)',
          },
        ],
      },
      {
        narration:
          "The meeting continues. At the end, the CEO says: \"I want to see a revised Q3 plan that accounts for Marcus's SSO concern by Friday.\" You have 3 days. Your current roadmap is already at full capacity. What's your next move?",
        choices: [
          {
            label: "A",
            text: "Meet with Marcus 1:1 to get the deal data, then build a tradeoff analysis showing what gets cut if SSO is added.",
            trustDelta: 10,
            effectivenessDelta: 15,
            outcome:
              "You get the real numbers from Marcus: 2 of 3 deals are actually at risk for other reasons too. SSO is a factor, not THE factor. You build a tradeoff doc that shows the CEO exactly what gets delayed. The CEO respects the rigor and makes an informed call.",
            principle:
              'Analytical thinking: separate signal from noise. The first question is always "what\'s the actual problem?" not "how do I respond to the loudest voice?" (Analytical Thinking)',
          },
          {
            label: "B",
            text: "Add SSO to the roadmap and figure out how to make it all fit — maybe the team can absorb it with some overtime.",
            trustDelta: -10,
            effectivenessDelta: -15,
            outcome:
              "You've just committed to an unrealistic plan. The team is demoralized when they hear about the scope increase. Two months later, everything is behind. Your credibility takes a bigger hit than if you'd pushed back now.",
            principle:
              'The "say yes and figure it out later" trap. This is how products fail through loss of focus. (Product Strategy — Why Products Fail: Lack of Focus)',
          },
          {
            label: "C",
            text: "Write the revised plan showing three options: (1) add SSO, cut Feature X; (2) add SSO, delay Feature Y by 6 weeks; (3) keep current plan, address SSO in Q4.",
            trustDelta: 5,
            effectivenessDelta: 10,
            outcome:
              'Good structure. The CEO has clear options with real tradeoffs. But without Marcus\'s deal data, the options feel abstract. The CEO asks "which one do YOU recommend?" — are you ready for that?',
            principle:
              'Options without a recommendation is a form of "what do you want me to do?" — always lead with your recommendation, then show alternatives. (Analytical Thinking, Managing Up)',
          },
          {
            label: "D",
            text: "Go directly to the CEO with your analysis of why SSO shouldn't be prioritized.",
            trustDelta: -15,
            effectivenessDelta: -5,
            outcome:
              "You've gone around Marcus and skipped your own manager. Even if your analysis is right, the political cost is high. The CEO wonders why you didn't work with Marcus first. Your manager is blindsided.",
            principle:
              "Managing up rule: no surprises for your manager. And influence requires working WITH stakeholders, not around them. (Managing Up, Influence)",
          },
        ],
      },
      {
        narration:
          "It's Friday. You're presenting the revised plan. The CEO asks: \"What's your recommendation?\" Everyone is watching.",
        choices: [
          {
            label: "A",
            text: "\"I recommend we keep the current Q3 plan and fast-track SSO as the first item in Q4. Here's why: [data]. The deals Marcus flagged have other factors too — SSO alone won't close them. But I want to be wrong about this, so here's what would change my mind: if Marcus's team confirms SSO is the sole blocker for even one of those deals, we reprioritize immediately.\"",
            trustDelta: 20,
            effectivenessDelta: 15,
            outcome:
              "The CEO nods. Marcus appreciates being heard. Your manager is proud. You've shown conviction backed by data, while leaving the door open for new information. This is senior PM territory.",
            principle:
              'Full toolkit: Anti-sell (named the risk), analytical rigor (data-backed), solutions-oriented (concrete proposal), and humility without doormat energy ("I want to be wrong"). (All principles)',
          },
          {
            label: "B",
            text: '"I think we should probably add SSO to Q3. Marcus makes a good point about the deals."',
            trustDelta: -10,
            effectivenessDelta: -10,
            outcome:
              "You caved. The CEO reads it as lack of conviction. Marcus got what he wanted but doesn't respect you more for it. Your team will pay the price in crunch.",
            principle:
              "Loss of conviction mid-flight. If your analysis was sound, stand behind it — with humility, not rigidity. Caving without new data is not collaboration, it's capitulation. (Product Strategy, Self-Development)",
          },
          {
            label: "C",
            text: '"Here are three options..." [present all three without a recommendation]',
            trustDelta: -5,
            effectivenessDelta: -10,
            outcome:
              "The CEO is frustrated: \"I asked what YOU recommend.\" You've had a week and you're still not committing. This reads as either indecision or political risk-aversion.",
            principle:
              'The CEO asked "what\'s your recommendation?" — this is a test. PMs who present options without recommendations are doing half the job. (Analytical Thinking, Managing Up)',
          },
        ],
      },
    ],
    debrief:
      "This scenario tests your ability to handle a public challenge, gather data under pressure, and make a recommendation with conviction. The key principles: anti-sell (name your own risks), analytical rigor (get the data before deciding), managing up (no surprises, solutions-oriented), and conviction (stand behind your analysis while staying genuinely open to new information).",
  },
  {
    id: "sr-2",
    title: "The Skip-Level Trap",
    difficulty: "hard",
    premise:
      "Your skip-level manager pulls you into a 1:1 and says: \"Your manager thinks the metered billing project is on track. I've heard from engineering it's actually behind. What's really going on?\" Reality: you ARE behind by two weeks, and your manager knows — you flagged it last Friday. But the skip-level is testing you. How you answer will shape trust for months.",
    steps: [
      {
        narration:
          "The skip-level is watching your face. You have about 5 seconds before silence gets awkward.",
        choices: [
          {
            label: "A",
            text: "\"We're two weeks behind — I flagged it to [manager] last Friday. Root cause is the payments API dependency. Here's the recovery plan we agreed on.\"",
            trustDelta: 20,
            effectivenessDelta: 15,
            outcome:
              "The skip-level nods. You've just demonstrated three things: you're honest, your manager isn't being kept in the dark, and you have a plan. This is exactly the answer that builds trust at this altitude.",
            principle:
              "No-surprise rule applied upward AND across. Never undermine your manager by revealing problems your skip thinks your manager doesn't know about. (Managing Up — Wes Kao)",
          },
          {
            label: "B",
            text: "\"It's on track. There are some dependencies we're managing but nothing major.\"",
            trustDelta: -20,
            effectivenessDelta: -10,
            outcome:
              "The skip-level already knows from engineering that you're behind. You just lied to a VP. Your credibility takes a hit that will take a year to repair. Later they'll ask your manager: \"Does your PM always hide problems?\"",
            principle:
              "Never lie up. Even small dodges to executives get detected — engineers talk, and executives compare notes. (Influence and Leadership)",
          },
          {
            label: "C",
            text: '"Honestly, engineering is dropping the ball on the payments dependency. I\'ve been blocked for weeks."',
            trustDelta: -15,
            effectivenessDelta: -15,
            outcome:
              "You just threw engineering under the bus and positioned yourself as a victim. The skip-level now sees you as someone who assigns blame instead of solving problems. Trust drops with both the skip AND engineering when they hear about it.",
            principle:
              '"Passive blame" framing — good PMs own problems they didn\'t create. The skip-level is evaluating your leadership, not your ability to find scapegoats. (Influence, Self-Development)',
          },
          {
            label: "D",
            text: '"Let me pull up the current status and walk you through it." (Opens laptop, starts scrolling through Jira)',
            trustDelta: -5,
            effectivenessDelta: -10,
            outcome:
              "You're stalling. The skip-level asked a direct question and you responded with a procedure. In the 45 seconds of scrolling, the skip forms the view that you either don't know your own project or you're hiding something.",
            principle:
              "When a senior leader asks a direct question, answer it in the first sentence. Stalling = hiding. (Managing Up, Meetings & Real-Time)",
          },
        ],
      },
      {
        narration:
          "The skip-level leans in: \"Okay. Here's what I'm hearing from the field: sales is losing three deals because metered billing isn't ready. Why shouldn't I reassign this project to a different PM who can move faster?\"",
        choices: [
          {
            label: "A",
            text: "\"That's a fair question. Here's why the two-week slip is real and unavoidable: [specific reason]. A new PM would hit the same dependency — and lose another 4 weeks ramping. The fastest path is staying the course and escalating the payments dependency, which I'm doing tomorrow with [name]. Can I get your backing on that escalation?\"",
            trustDelta: 15,
            effectivenessDelta: 20,
            outcome:
              "You didn't get defensive. You acknowledged the question was fair, made the analytical case against reassignment, and converted the threat into asking for help on the real blocker. The skip-level respects the pushback and commits support.",
            principle:
              'Steelman the threat, then make your case with data, then ask for what you actually need. "What would need to be true?" frame applied in reverse. (Analytical Thinking, Managing Up)',
          },
          {
            label: "B",
            text: '"I\'ve worked really hard on this project and I think I can get it back on track if you give me more time."',
            trustDelta: -10,
            effectivenessDelta: -15,
            outcome:
              "You made the argument about YOU, not the project. The skip doesn't care how hard you've worked — they care about the deals. You've just confirmed you don't understand what matters at this altitude.",
            principle:
              "Communication is strategy, not self-expression. The skip doesn't care about your feelings or effort — they care about outcomes. (Feedback & Difficult Conversations — Wes Kao)",
          },
          {
            label: "C",
            text: '"Whatever you think is best. I\'ll support whatever decision you make."',
            trustDelta: -15,
            effectivenessDelta: -10,
            outcome:
              "You just told a VP you have no conviction about your own project. They don't want servility — they want a PM who'll push back with rigor. The false-humility posture reads as lack of judgment.",
            principle:
              "The Humility Trap. False humility isn't a virtue — it's avoidance disguised as respect. (Self-Development — Shreyas Doshi)",
          },
        ],
      },
      {
        narration:
          "The skip-level stands up to end the meeting: \"Send me a one-pager by EOD tomorrow with the recovery plan and what you need from me. If I don't see it, I'm reassigning.\" What's the first thing you do when you leave the room?",
        choices: [
          {
            label: "A",
            text: 'DM your manager immediately: "Skip pulled me into a 1:1 — here\'s what was asked and what I committed to. Want to sync before I send the one-pager tomorrow."',
            trustDelta: 15,
            effectivenessDelta: 15,
            outcome:
              "Exactly right. Your manager will not be surprised by the skip's next conversation. You've preserved trust on both sides and set up a quick alignment before the deliverable.",
            principle:
              "The no-surprise rule runs in every direction. If your skip-level just asked you for something, your manager learns about it from YOU, not from the skip. (Managing Up)",
          },
          {
            label: "B",
            text: "Write the one-pager tonight and send it to the skip tomorrow morning, copying your manager.",
            trustDelta: 0,
            effectivenessDelta: -5,
            outcome:
              "Your manager reads the one-pager cold and learns for the first time that the skip has concerns about reassigning the PM. They're blindsided in front of their boss. You technically met the deadline but damaged trust with your direct manager.",
            principle:
              "Cc'ing your manager on a skip-level deliverable is NOT the same as looping them in. They need a heads-up first, not a fait accompli. (Managing Up)",
          },
          {
            label: "C",
            text: "Call the engineering lead and vent about how ridiculous the skip is being.",
            trustDelta: -10,
            effectivenessDelta: -10,
            outcome:
              'You just turned a solvable pressure situation into a political one. The eng lead mentions it in standup, word spreads, and you\'re now "the PM who complains about leadership." Professional tone matters everywhere, always.',
            principle:
              "Venting to partners about leadership is how PMs kill their credibility with the engineering team without realizing it. (Influence, Self-Development)",
          },
          {
            label: "D",
            text: "Do nothing yet — you want to think about it overnight and start the one-pager fresh tomorrow.",
            trustDelta: -5,
            effectivenessDelta: -5,
            outcome:
              "Your manager will hear about the skip 1:1 before you get around to telling them. Procrastination on communication IS a communication choice — and usually the wrong one. (Managing Up)",
            principle:
              "Speed matters in proactive communication. Waiting until you have the perfect message is how the no-surprise rule breaks.",
          },
        ],
      },
    ],
    debrief:
      "Skip-level 1:1s are high-stakes trust events. The principles at play: (1) never lie up, (2) never undermine your manager by revealing they don't know something, (3) answer direct questions directly, (4) steelman threats before responding to them, (5) loop your manager in the moment a skip asks you for anything. Getting any of these wrong costs months of trust rebuilding.",
  },
  {
    id: "sr-3",
    title: "The Launch-Day Bug",
    difficulty: "medium",
    premise:
      "You're 2 hours into the launch of a new pricing model when a customer success manager pings you: \"Seven enterprise customers just got double-charged. Refund buttons aren't working. People are tweeting.\" You have a leadership all-hands in 90 minutes where you were going to announce the launch. What do you do?",
    steps: [
      {
        narration:
          "The first decision is about the next 10 minutes. What's the move?",
        choices: [
          {
            label: "A",
            text: "Rollback the launch immediately. Then: tell your manager, tell the CSM team, draft a customer comms, prep leadership.",
            trustDelta: 15,
            effectivenessDelta: 20,
            outcome:
              "Correct order. Stop the bleeding first. Every minute the broken launch is live, more customers get double-charged. The rollback buys time to do everything else properly.",
            principle:
              'When in an incident, stop the bleed before you communicate. "Rollback fast, explain carefully" is the P0 principle. (Product Strategy — Incident Response)',
          },
          {
            label: "B",
            text: "Call an emergency huddle with engineering to debug the refund button while keeping the launch live.",
            trustDelta: -15,
            effectivenessDelta: -20,
            outcome:
              "30 more customers get double-charged while you debug. The revenue team is now dealing with a full-blown crisis, and you're trying to fix forward instead of stopping the damage. This is the textbook wrong move.",
            principle:
              "Fixing forward on a revenue-impacting bug is almost always wrong. The rollback is reversible; the customer trust damage is not. (Product Strategy)",
          },
          {
            label: "C",
            text: "Update Twitter/social media to acknowledge the issue before rolling back, so customers know you're on it.",
            trustDelta: -5,
            effectivenessDelta: -10,
            outcome:
              "You've just made the incident more visible while it's still happening. PR before containment amplifies the damage. The correct sequence is contain → internal comms → customer comms → public comms.",
            principle:
              "Comms sequence in an incident: contain, inform internally, inform affected customers, then (only if needed) inform publicly. (Crisis Comms)",
          },
          {
            label: "D",
            text: "Cancel the all-hands announcement, then huddle with engineering to decide what to do.",
            trustDelta: 0,
            effectivenessDelta: -10,
            outcome:
              "You prioritized avoiding bad optics over stopping customer harm. Canceling the all-hands can wait — stopping the double-charges cannot. This is the wrong thing to prioritize first.",
            principle:
              "In incidents, prioritize customer harm > internal optics > your reputation. Always. (Crisis Comms)",
          },
        ],
      },
      {
        narration:
          'Rollback is in flight. Your manager asks: "The all-hands is in 75 minutes. Do you still want to announce, or do we cancel it?"',
        choices: [
          {
            label: "A",
            text: "\"Cancel the announcement. I'll use the slot to brief leadership on the incident, what we're doing about it, and the revised launch plan.\"",
            trustDelta: 15,
            effectivenessDelta: 15,
            outcome:
              "Leadership gets the news from you, in the scheduled slot, with a plan. You turned a reputational crisis into a trust-building moment. This is how senior PMs handle bad days.",
            principle:
              "Don't waste a crisis — use the existing leadership time to brief honestly, show you're in control, and propose next steps. (Managing Up, Influence)",
          },
          {
            label: "B",
            text: "\"Let's proceed with the announcement but mention the minor bug we\'re fixing.\"",
            trustDelta: -20,
            effectivenessDelta: -15,
            outcome:
              "Announcing a launch that just got rolled back reads as either delusional or dishonest. Someone in the all-hands will have already seen the customer tweets and call you out. You've undermined your own credibility.",
            principle:
              "Don\'t announce something that isn\'t true anymore. Your deck is not the source of truth — reality is. (Communication as Strategy)",
          },
          {
            label: "C",
            text: '"Cancel the all-hands slot entirely. I\'ll update leadership over email later today."',
            trustDelta: -5,
            effectivenessDelta: -10,
            outcome:
              "You gave up a captive audience of 40 leaders who wanted to hear from you. Email won't land the way in-person does. Leadership will ask each other in the hallway what happened, and speculation will be worse than the truth.",
            principle:
              "In-person > Slack > email for bad news. Use the channel with the most signal and the most trust. (Communication as Strategy)",
          },
        ],
      },
    ],
    debrief:
      "Incident response reveals what kind of PM someone is. The principles here: contain before you communicate, prioritize customer harm over internal optics, and use every available forum to demonstrate you're in control — even (especially) when you're not. The PMs who handle bad days well build more trust than the ones who handle good days well.",
  },
];
