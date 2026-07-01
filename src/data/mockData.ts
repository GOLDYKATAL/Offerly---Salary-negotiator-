import { Job } from "../types";

export const ROLE_OPTIONS = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Marketing Manager",
  "Sales Executive",
  "Financial Analyst",
  "HR Specialist"
];

export const LOCATION_OPTIONS = [
  "San Francisco, CA (High Cost)",
  "New York, NY (High Cost)",
  "Austin, TX (Medium Cost)",
  "Chicago, IL (Medium Cost)",
  "Denver, CO (Medium Cost)",
  "Remote, US (Flexible)",
  "Seattle, WA (High Cost)",
  "Atlanta, GA (Medium Cost)"
];

export const EXPERIENCE_LEVELS = [
  { value: "Entry", label: "Entry Level (0-2 years)" },
  { value: "Mid", label: "Mid Level (3-5 years)" },
  { value: "Senior", label: "Senior Level (6-10 years)" },
  { value: "Lead", label: "Lead / Principal (10+ years)" },
  { value: "Director", label: "Director / Executive" }
];

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Software Engineer",
    company: "FinOptima Systems",
    location: "Austin, TX (Hybrid)",
    salaryRange: { min: 140000, max: 185000, median: 165000 },
    description: "Lead development on our core enterprise fintech platform. You will scale high-throughput ledger APIs and collaborate with product teams on real-time transaction processing systems.",
    requirements: [
      "6+ years of software engineering experience in Go, Java, or Node.js",
      "Expertise building AWS cloud-native distributed microservices",
      "Strong foundation in database designs (PostgreSQL, Redis)"
    ],
    benefits: [
      "Competitive base salary with annual performance bonus",
      "0.05% - 0.15% equity options",
      "Comprehensive medical, dental, and vision insurance with 100% premium coverage",
      "401(k) matching (4% dollar-for-dollar)",
      "Flexible work-from-home policy (2 days in-office per week)"
    ]
  },
  {
    id: "job-2",
    title: "Product Manager II",
    company: "EcoSystem Solutions",
    location: "Remote, US",
    salaryRange: { min: 115000, max: 150000, median: 132000 },
    description: "Own the growth strategy and feature roadmap for our high-impact carbon offsets tracker platform. Drive metrics around daily active use and carbon accounting integrity.",
    requirements: [
      "3+ years in product management with SaaS or climate-tech models",
      "Strong quantitative mindset with SQL or Mixpanel analytics experience",
      "Incredible storytelling and cross-functional team management skills"
    ],
    benefits: [
      "Full remote setup stipend ($1,500 one-time)",
      "Generous health reimbursement account (HRA)",
      "Unlimited PTO (minimum 3 weeks mandated)",
      "Co-working space allowance up to $300/month"
    ]
  },
  {
    id: "job-3",
    title: "Lead UX Designer",
    company: "HealthSphere Tech",
    location: "New York, NY (Onsite)",
    salaryRange: { min: 155000, max: 210000, median: 180000 },
    description: "Redefine patient care software. You will establish the design system and lead user research for next-generation clinical workflows and patient portal dashboards.",
    requirements: [
      "8+ years designing sophisticated enterprise interfaces or healthcare apps",
      "Strong portfolio highlighting user journey research and complex systems design",
      "Expert skills in Figma, component library architecture, and CSS tokens"
    ],
    benefits: [
      "Top-tier salary with executive-track incentive options",
      "Pre-IPO stock options package",
      "Premium wellness center membership in Manhattan",
      "Generous parental leave policy (16 weeks fully paid)"
    ]
  },
  {
    id: "job-4",
    title: "Data Scientist",
    company: "TechGlobal AI",
    location: "San Francisco, CA (Hybrid)",
    salaryRange: { min: 130000, max: 175000, median: 152000 },
    description: "Train, refine, and deploy predictive models powering our conversational analytics suite. Collaborate directly with ML engineers to push models to low-latency edge servers.",
    requirements: [
      "M.S. or Ph.D. in Computer Science, Statistics, or similar field",
      "Strong fluency in Python (PyTorch, pandas, scikit-learn)",
      "Experience setting up feature stores and running automated A/B tests"
    ],
    benefits: [
      "Vibrant SOMA office with gourmet lunches provided daily",
      "Generous hardware budget (new MacBook Pro, dual monitors)",
      "Annual education & conference travel budget ($2,500)",
      "Full health/vision/dental and mental health services support"
    ]
  },
  {
    id: "job-5",
    title: "Marketing Manager",
    company: "SaaSify Logistics",
    location: "Denver, CO (Hybrid)",
    salaryRange: { min: 95000, max: 130000, median: 112000 },
    description: "Supercharge our digital lead generation channels. Oversee SEO, paid media campaigns, and webinar series targeting logistics decision-makers in North America.",
    requirements: [
      "4+ years of growth marketing experience in B2B SaaS",
      "Deep understanding of Google Ads, HubSpot, and marketing automation",
      "Exceptional copywriting skills and eye for landing page layouts"
    ],
    benefits: [
      "Standard competitive salary with quarterly performance bonus (up to 15%)",
      "401(k) with 3% matching",
      "Health savings account (HSA) with company contribution",
      "Dog-friendly office with active social outings"
    ]
  }
];

export const MOCK_COMPANY_HEALTH = {
  "FinOptima Systems": {
    score: 88,
    risk: "Low Risk",
    funding: "Series C ($45M raised)",
    growth: "+40% headcount YoY",
    cashRunway: "36+ months",
    recommendation: "Highly stable. Leverage their fresh capital to negotiate a larger sign-on bonus and competitive equity."
  },
  "EcoSystem Solutions": {
    score: 72,
    risk: "Moderate Risk",
    funding: "Series A ($12M raised)",
    growth: "+15% headcount YoY",
    cashRunway: "18 months",
    recommendation: "Early-stage stability. Focus negotiation heavily on equity options and flexible remote perks, as cash budget might have hard ceilings."
  },
  "HealthSphere Tech": {
    score: 94,
    risk: "Minimal Risk",
    funding: "Profitable / Self-Sustaining",
    growth: "+25% revenue YoY",
    cashRunway: "Unlimited",
    recommendation: "Extremely strong financial footing. Confidently ask for top-of-market base salary and premium wellness stipends."
  },
  "TechGlobal AI": {
    score: 91,
    risk: "Low Risk",
    funding: "Series D ($120M raised)",
    growth: "+65% headcount YoY",
    cashRunway: "40+ months",
    recommendation: "Very well-funded with immense strategic priority on AI. Push for a competitive base salary and significant equity grants."
  },
  "SaaSify Logistics": {
    score: 64,
    risk: "Elevated Risk",
    funding: "Bootstrapped / Tight Cashflow",
    growth: "Flat YoY",
    cashRunway: "12 months",
    recommendation: "Pre-profitable. Avoid pushing too aggressively on cash base. Optimize for performance-based bonuses, remote autonomy, and structured 6-month review cycles."
  }
};

export const RECRUITER_MOCK_RESPONSES = [
  {
    triggers: ["hello", "hi", "hey"],
    response: "Hi there! I'm Brenda, the lead recruiter for this role. We are absolutely thrilled with your interview rounds. How are you feeling about the offer we put together?"
  },
  {
    triggers: ["salary", "more money", "base", "increase", "higher", "pay", "compensation"],
    response: "I understand compensation is very important. Our $150,000 offer was calibrated to our internal equity for this role level. However, if we were to look at shifting things, what target base were you hoping to reach, and what is your core reasoning?"
  },
  {
    triggers: ["remote", "wfh", "home", "hybrid", "flexible", "days"],
    response: "Our standard policy is 3 days in the office, but we have some flexibility for key talent. Would a 1-day remote extension satisfy your needs, or were you looking for a fully remote arrangement?"
  },
  {
    triggers: ["equity", "stock", "options", "shares", "grant"],
    response: "We are very proud of our upside potential! I can speak to the compensation committee about increasing your equity grant by 15-20%, but we might need to hold the base salary steady. Would that trade-off work for you?"
  },
  {
    triggers: ["bonus", "sign-on", "signing", "incentive"],
    response: "A sign-on bonus is certainly something we can discuss to help offset any unvested equity or bonuses you're walking away from. Could you share what amount would help you make this decision today?"
  },
  {
    triggers: ["benefits", "401k", "pto", "health", "insurance"],
    response: "Our benefits package is globally applied, so things like medical premiums and 401(k) match ratios are fixed for compliance. However, we could look at one-off professional development allowances or gym stipends."
  },
  {
    triggers: ["yes", "accept", "deal", "sounds good", "perfect", "agree"],
    response: "That's wonderful to hear! I am absolutely delighted. If we can finalize these details, I will draft the revised written offer letter and send it over by the end of today."
  },
  {
    triggers: ["no", "decline", "cannot", "won't", "walk away", "insufficient"],
    response: "I completely respect your stance, and we definitely want this to be a mutually beneficial relationship. Let me take this back to the hiring manager and see if we can unlock any additional budget."
  }
];

export const RECRUITER_DEFAULT_RESPONSES = [
  "Thanks for sharing that perspective. We really value your expertise. Let's dig deeper: how does the equity component of the package feel compared to your market expectations?",
  "That makes sense. To help me advocate to our finance team, are there specific competing offers or active interview loops that are setting this benchmark for you?",
  "I appreciate your transparency! I want to make sure we make this a win-win. If we can close the gap by half on the base salary, would you be ready to sign the agreement?",
  "Our hiring manager is incredibly excited about your background in scaling distributed architectures. We are willing to explore creative solutions to bring you on board."
];

export const FAQ_DATA = [
  {
    question: "When is the absolute best time to bring up compensation?",
    answer: "Wait until a formal written or verbal offer is extended. If asked early in interviews, defer by saying: 'I'd love to focus on understanding if there's a strong mutual fit first, and I'm confident we can align on a fair package once we reach that stage.'"
  },
  {
    question: "How do I handle the 'What is your current salary?' question?",
    answer: "Many states prohibit employers from asking this. Defer politely by focusing on future targets: 'I am focused on roles in the $160k-$180k range to reflect the scale of responsibility and market value for this position.'"
  },
  {
    question: "What if they say 'This offer is non-negotiable'?",
    answer: "Ask for flexibility on non-cash terms: 'I understand base salary is fixed. Are there opportunities to discuss a one-time sign-on bonus, extra equity options, or a structured salary review in six months?'"
  },
  {
    question: "How much of a counter-offer should I ask for?",
    answer: "Aim for 10% to 15% above their initial offer, provided it remains within the realistic 75th percentile of the market data you researched."
  },
  {
    question: "Is it risky to negotiate? Could they rescind the offer?",
    answer: "It is extremely rare (<1% of cases) for an offer to be rescinded just for polite, professional negotiation. Employers expect you to negotiate; it shows professional maturity and high commercial communication skills."
  }
];
