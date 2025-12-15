import { FileText, BarChart3, Globe, Users, Target, ShieldCheck, Zap, Layers, TrendingUp, Search, Clock, Check } from 'lucide-react';

export const siteConfig = {
  brand: {
    name: "MAQON",
    tagline: "International Operators. Not Marketers.",
    description: "VC-grade fundraising assets and predictable growth systems for ambitious teams.",
    contactEmail: "hello@maqon.com",
    contactPhone: "+971 50 123 4567",
    socials: {
      linkedin: "https://linkedin.com/company/maqon-placeholder",
    }
  },
  locations: [
    {
      city: "Dubai",
      country: "UAE",
      desc: "Regional HQ & Capital Network",
      address: "DIFC, Gate Avenue, Dubai",
      phone: "+971 4 123 4567",
      email: "dubai@maqoncapital.com"
    },
    {
      city: "Melbourne",
      country: "Australia",
      desc: "Asia-Pacific Operations",
      address: "120 Collins Street, Melbourne",
      phone: "+61 3 9876 5432",
      email: "melb@maqoncapital.com"
    },
    {
      city: "Frankfurt",
      country: "Germany",
      desc: "European Wealth Relationships",
      address: "OpernTurm, Frankfurt",
      phone: "+49 69 1234 5678",
      email: "eu@maqoncapital.com"
    }
  ],
  team: [
    {
      name: "Muhammad Raza",
      role: "Managing Partner",
      identity: "VC/PE Operator. Fundraising clarity.",
      bio: "Operator with deep experience in financial modeling and growth infrastructure. Builds the defensible models and decks that pass IC scrutiny.",
      bullets: [
        "Built DCF/LBO-grade models & investment memos for high-growth sectors",
        "Led growth systems & positioning for fast-scaling e-commerce brands",
        "Deep ops background (supply chain, compliance) — not 'marketing only'"
      ],
      linkedin: "https://www.linkedin.com/in/muhammad-raza-30a717193/"
    },
    {
      name: "Hasnain Ayaz",
      role: "Executive Partner",
      identity: "Execution Engine. Funnel Ops + AI.",
      bio: "The engine builder. Specializes in turning strategy into deployed funnels, CRM architectures, and automated AI lead workflows.",
      bullets: [
        "Deployed AI voice agents achieving 22% answer rate & 11 qualified leads/week",
        "Reduced cost per qualified lead by ~30% via script optimization",
        "Supported growth strategy for 8-figure D2C portfolio"
      ],
      linkedin: "https://www.linkedin.com/in/hasnain-ayaz-322177175/"
    },
    {
      name: "Finena",
      role: "Partner (Germany)",
      identity: "Relationships + Capital Access (DACH).",
      bio: "Based in Frankfurt. Bridges the gap to European family offices and UHNW networks. Focused on access and relationship building.",
      bullets: [
        "Bridges DACH-based family offices to vetted opportunities",
        "Introduces only when a company is 'investor-ready'",
        "Focus: long-term trust and high-integrity deal flow"
      ],
      linkedin: "#"
    }
  ],
  services: [
    {
      id: "investment-readiness",
      title: "Investment Readiness Sprint",
      tagline: "Raise with clarity.",
      shortDesc: "Fundable narrative, VC-grade deck, defensible model.",
      duration: "4 Weeks",
      priceStart: "Scope confirmed after diagnostic",
      icon: FileText,
      target: "Startups (Pre-Seed/Seed)",
      description: "We transform founders into fundable assets. From financial modeling to narrative construction, we prepare you for the VC grilling.",
      deliverables: [
        "Financial Modeling (DCF / 3-Statement)",
        "TAM/SAM/SOM & Defensible Assumptions",
        "Data Room Architecture",
        "Pitch Deck Narrative & Rewrite",
        "Mock IC Committee Simulation"
      ],
      path: "/services/investment-readiness",
      bestFor: [
        "Pre-Seed / Seed founders raising $50k-$500k",
        "Founders getting 'maybe' instead of term sheets",
        "Teams needing a defensible valuation model",
        "First-time founders facing institutional DD"
      ],
      timeline: [
        { week: "Week 1", title: "Audit & Immersion", desc: "We tear down your current deck and model. We align on the core narrative." },
        { week: "Week 2", title: "Financial Build", desc: "We build the 3-statement model and valuation logic." },
        { week: "Week 3", title: "Narrative & Design", desc: "We rewrite the deck and restructure the data room." },
        { week: "Week 4", title: "The Grilling", desc: "Mock IC session. We grill you before investors do. Final handover." }
      ],
      faqs: [
        { q: "Do you guarantee investment?", a: "No. We guarantee your assets will meet the highest global standards. Funding depends on your business fundamentals." },
        { q: "Do I need a lead investor first?", a: "No. This sprint is designed to help you get that lead investor." }
      ]
    },
    {
      id: "revenue-engine",
      title: "Revenue Engine Overhaul",
      tagline: "Grow with systems.",
      shortDesc: "Funnel architecture, CRM, and automated qualification.",
      duration: "2–6 Weeks",
      priceStart: "Scope confirmed after diagnostic",
      icon: BarChart3,
      target: "SMEs & Established Brands",
      description: "Stop relying on word-of-mouth. We install predictable growth infrastructure, from funnel architecture to automated lead qualification.",
      deliverables: [
        "Website & Funnel Conversion Audit",
        "CRM Setup & Pipeline Architecture",
        "Automated Lead Qualification (WhatsApp/AI)",
        "Measurement Plan (GA4/Events)",
        "SOP Handover for Internal Teams"
      ],
      path: "/services/revenue-engine",
      bestFor: [
        "SMEs stuck at $10k-$50k MRR",
        "Teams relying on manual referrals",
        "Businesses with high traffic but low conversion",
        "Real Estate, Education, or D2C brands"
      ],
      timeline: [
        { week: "Week 1", title: "Funnel Audit", desc: "Full breakdown of current conversion leaks and data tracking." },
        { week: "Week 2", title: "Architecture", desc: "We map the new flow: Ads -> LP -> CRM -> Automation." },
        { week: "Week 3", title: "Build & Integration", desc: "We connect the pipes (Zapier, HubSpot, WhatsApp API)." },
        { week: "Week 4-6", title: "Launch & SOPs", desc: "Live testing. We train your team. Handover." }
      ],
      faqs: [
        { q: "Which CRMs do you support?", a: "We primarily build on HubSpot and Pipedrive, but can work with Salesforce for enterprise clients." },
        { q: "Do you run the ads?", a: "No. We build the engine that converts the traffic. We can refer you to ad buying partners." }
      ]
    }
  ],
  stats: [
    { label: "Models Built", value: "50+" },
    { label: "Funnels Shipped", value: "120+" },
    { label: "Avg Uplift", value: "35%" },
  ],
  testimonials: [
    {
      quote: "MAQON didn't just fix our deck. They fixed our business model. We raised our seed round 6 weeks after the sprint.",
      author: "Sarah J.",
      role: "Founder, Fintech",
      location: "Dubai",
      company: "Series Seed"
    },
    {
      quote: "Finally, an agency that speaks 'operator'. No fluff, just systems that actually print leads.",
      author: "Michael K.",
      role: "CEO, Real Estate",
      location: "Melbourne",
      company: "$10M+ Revenue"
    }
  ],
  pricing: {
    audit: "Free",
    diagnostic: "Free (15 min)"
  }
};

export const caseStudies = [
  {
    id: "fishlist-growth",
    title: "Marketplace Scale-Up",
    location: "Global / Dubai",
    metric: "3x",
    label: "Revenue Growth",
    tags: ["Growth Systems", "Positioning", "Lifecycle Marketing"],
    desc: "Led growth systems and positioning for a fast-scaling marketplace, building full lifecycle marketing and investor narrative.",
    fullDesc: "A high-potential marketplace needed to transition from early traction to scalable revenue. We overhauled the positioning, deployed lifecycle marketing infrastructure, and rebuilt the investor narrative to align with growth metrics.",
    results: ["3x Revenue Multiplier", "Full Lifecycle Architecture", "Investor-Ready Narrative"]
  },
  {
    id: "ai-lead-gen",
    title: "AI Outbound Systems",
    location: "Global",
    metric: "22%",
    label: "Answer Rate",
    tags: ["AI Automation", "Lead Gen", "Cost Reduction"],
    desc: "Deployed AI voice agents for outbound lead generation, optimizing scripts and qualification logic to reduce human overhead.",
    fullDesc: "Traditional manual SDR calling was inefficient and costly. We deployed AI voice agents with optimized scripts to qualify leads at scale, significantly reducing human overhead while increasing connection rates.",
    results: ["11 Qualified Leads/Week", "30% Cost Reduction per Lead", "22% Answer Rate vs Industry Avg"]
  },
  {
    id: "mega-foods-ops",
    title: "International Trade Ops",
    location: "UAE / Global",
    metric: "$2M+",
    label: "Contracts Secured",
    tags: ["Supply Chain", "Compliance", "B2B Sales"],
    desc: "Structured supply chain performance, compliance, and contracts to secure major B2B partnerships.",
    fullDesc: "Navigating complex international trade compliance and supply chain logistics to unlock enterprise-tier contracts. We structured the commercial agreements and operational workflows required to service high-volume B2B clients.",
    results: ["$2M+ B2B Contracts", "Compliance Framework", "Supply Chain Optimization"]
  },
  {
    id: "ijk-pe-modeling",
    title: "VC/PE Investment Memos",
    location: "Dubai, UAE",
    metric: "VC/PE",
    label: "Asset Grade",
    tags: ["Financial Modeling", "Due Diligence", "Deal Flow"],
    desc: "Built DCF/LBO-grade models, investment memos, and diligence materials for high-growth sector acquisitions.",
    fullDesc: "Supported an investment firm with rigorous financial modeling (DCF/LBO) and investment committee memos. Ensured all diligence materials met institutional standards for high-stakes acquisitions.",
    results: ["Institutional Grade Models", "Streamlined DD Process", "Defensible Valuation Logic"]
  },
  {
    id: "imm-d2c",
    title: "D2C Portfolio Strategy",
    location: "Global / Asia",
    metric: "8-Fig",
    label: "Portfolio Scale",
    tags: ["Strategy", "Funnel Ops", "Profitability"],
    desc: "Supported growth strategy for an 8-figure D2C portfolio, improving funnel performance and profitability.",
    fullDesc: "Working with a major D2C portfolio to optimize unit economics. We analyzed funnel leakage and implemented strategic improvements to drive profitability across multiple brands.",
    results: ["Funnel Optimization", "Profitability Uplift", "Portfolio-Wide Strategy"]
  },
  {
    id: "camal-trade",
    title: "Cross-Border Trade Systems",
    location: "Global",
    metric: "100%",
    label: "Compliance",
    tags: ["Market Research", "Supplier Systems", "Ops"],
    desc: "Established supplier systems and conducted deep market research to facilitate cross-border trade operations.",
    fullDesc: "Required a robust framework for supplier verification and market entry research. We built the operational back-end to ensure seamless cross-border transactions and strict compliance adherence.",
    results: ["Verified Supplier Network", "Market Entry Strategy", "Operational SOPs"]
  }
];

export const insights = [
  {
    id: "pitch-deck-mistakes",
    title: "What 90% of Pitch Decks Get Wrong",
    tag: "Capital",
    readTime: "5 min",
    date: "Oct 12, 2023",
    excerpt: "Why most decks fail before the first meeting — and how institutional investors actually process risk.",
    content: [
      { type: 'paragraph', text: "Investors do not 'read' pitch decks. They scan for disqualifiers." },
      { type: 'paragraph', text: "The average partner spends under three minutes deciding whether a company deserves further cognitive effort. Most founders waste those minutes explaining vision instead of removing risk." },
      { type: 'heading', text: "1. Storytelling Without Financial Control" },
      { type: 'paragraph', text: "Most decks are emotionally compelling and financially fragile." },
      { type: 'paragraph', text: "A narrative without a model signals that the founder hasn't reconciled ambition with mechanics. Institutional investors interpret this as execution risk — not creativity." },
      { type: 'callout', text: "Operator signal: You can articulate growth and explain how it stresses cash." },
      { type: 'heading', text: "2. Market Size Slides That Don’t Survive Diligence" },
      { type: 'paragraph', text: "TAM ≠ justification. Top-down market sizing is ignored unless it ties directly to:" },
      { type: 'list', items: ["Customer acquisition channels", "Realistic conversion rates", "Capital efficiency at scale"] },
      { type: 'callout', text: "Operator signal: Your market size emerges from behavior, not slides." },
      { type: 'heading', text: "3. Traction Without Unit Economics" },
      { type: 'paragraph', text: "Revenue growth alone is no longer impressive. Investors are underwriting:" },
      { type: 'list', items: ["Contribution margin", "Payback period", "Repeatability by cohort"] },
      { type: 'callout', text: "Operator signal: You know why growth happens, not just that it does." },
      { type: 'heading', text: "Bottom Line" },
      { type: 'paragraph', text: "Pitch decks fail because they optimize for persuasion instead of survivability. A strong deck doesn't excite investors — it removes reasons to say no." },
      { type: 'callout', text: "Preparing for investor scrutiny? We rebuild decks, models, and data rooms to institutional standard. → Book a Diagnostic" }
    ]
  },
  {
    id: "growth-stack-2024",
    title: "The 2024 Growth Stack for Emerging Markets",
    tag: "Systems",
    readTime: "7 min",
    date: "Nov 05, 2023",
    excerpt: "Why scalable growth in 2024 comes from infrastructure, not headcount.",
    content: [
      { type: 'paragraph', text: "In Dubai and Southeast Asia, 'growth' is still mistaken for hiring more salespeople. This scales revenue — briefly — and chaos permanently. Modern operators scale systems, not bodies." },
      { type: 'heading', text: "1. CRM as the Source of Truth" },
      { type: 'paragraph', text: "If it's not in the CRM, it didn't happen." },
      { type: 'paragraph', text: "Companies doing $5M+ on Google Sheets aren't scrappy — they're exposed. A centralized CRM (HubSpot / Pipedrive) enforces process discipline across the funnel." },
      { type: 'callout', text: "Operator signal: Your company has memory beyond individuals." },
      { type: 'heading', text: "2. WhatsApp Automation as a Revenue Layer" },
      { type: 'paragraph', text: "Email is declining. WhatsApp is where intent lives." },
      { type: 'paragraph', text: "Using the WhatsApp Business API, we automate lead qualification, budget validation, and timeline confirmation. This replaces manual SDR labor with instant signal extraction." },
      { type: 'callout', text: "Operator signal: You optimize response time, not effort." },
      { type: 'heading', text: "3. Unified Data Layer" },
      { type: 'paragraph', text: "Fragmented data creates false confidence. Ads, CRM, and commerce data must reconcile in one place." },
      { type: 'paragraph', text: "A lightweight ETL → warehouse → dashboard stack enables daily visibility into CAC and LTV by channel. The goal: One dashboard that explains your business today, not last quarter." },
      { type: 'callout', text: "Operator signal: Decisions are data-driven, not anecdotal." },
      { type: 'heading', text: "Bottom Line" },
      { type: 'paragraph', text: "In emerging markets, the winners won't hire faster — they'll instrument better." },
      { type: 'callout', text: "We install this stack in 2–6 weeks for founders who want predictable growth. → Request a Diagnostic" }
    ]
  },
  {
    id: "valuation-defense",
    title: "Defending Your Valuation in a Down Market",
    tag: "Capital",
    readTime: "6 min",
    date: "Dec 01, 2023",
    excerpt: "How to defend valuation with math, not momentum.",
    content: [
      { type: 'paragraph', text: "In down markets, valuation is no longer negotiated — it is justified. Investors are underwriting downside, not optimism." },
      { type: 'heading', text: "1. The 3-Statement Model Is Non-Negotiable" },
      { type: 'paragraph', text: "A P&L shows ambition. A 3-statement model shows control." },
      { type: 'paragraph', text: "Growth consumes cash. Investors want proof you understand working capital, burn dynamics, and financing inflection points." },
      { type: 'callout', text: "Operator signal: You model failure modes before investors do." },
      { type: 'heading', text: "2. Unit Economics Determine the Multiple" },
      { type: 'paragraph', text: "Valuation follows efficiency. Strong unit economics allow investors to justify higher forward multiples — even in hostile markets." },
      { type: 'list', items: ["CAC Payback < 12 months", "LTV:CAC > 3:1", "Gross Margin > 70% (SaaS) / > 40% (D2C)"] },
      { type: 'callout', text: "Operator signal: You know profitability at the customer level." },
      { type: 'heading', text: "3. Sensitivity Analysis Builds Trust" },
      { type: 'paragraph', text: "Hockey-stick-only models destroy credibility. Founders who show base and bear cases demonstrate realism — and maturity." },
      { type: 'callout', text: "Operator signal: You are preparing for IC questions, not reacting to them." },
      { type: 'heading', text: "Bottom Line" },
      { type: 'paragraph', text: "In 2024, valuation is defended by mechanics, not momentum." },
      { type: 'callout', text: "We run an Investment Readiness Sprint to rebuild models, narratives, and defenses. → Book a Diagnostic" }
    ]
  }
];

export const methodology = [
  {
    title: "Audit & Deconstruct",
    outcome: "Absolute clarity on what’s broken",
    desc: "We deconstruct your deck or funnel against global benchmarks to expose structural weaknesses.",
    icon: Target
  },
  {
    title: "Strategy & Model",
    outcome: "A defensible roadmap for growth",
    desc: "We build the financial logic and conversion architecture required to scale predictably.",
    icon: Layers
  },
  {
    title: "Execution Build",
    outcome: "Institutional-grade assets",
    desc: "Partner-led delivery of models, decks, and systems. No outsourcing. No junior teams.",
    icon: Zap
  },
  {
    title: "Handover & SOPs",
    outcome: "You own the engine",
    desc: "We train your team and transfer full ownership of all IP, data, and workflows.",
    icon: ShieldCheck
  }
];
