import React, { useState, useRef, useEffect } from "react";
import { CoachedState } from "./types";

// Import all 16 separate screens
import WelcomeScreen from "./components/WelcomeScreen";
import InputDetailsScreen from "./components/InputDetailsScreen";
import UploadOfferScreen from "./components/UploadOfferScreen";
import OfferAnalysisScreen from "./components/OfferAnalysisScreen";
import MarketAnalysisScreen from "./components/MarketAnalysisScreen";
import MarketTimingScreen from "./components/MarketTimingScreen";
import CompanyHealthScreen from "./components/CompanyHealthScreen";
import JobSearchResultsScreen from "./components/JobSearchResultsScreen";
import JobDetailsScreen from "./components/JobDetailsScreen";
import NegotiationRecScreen from "./components/NegotiationRecScreen";
import NegotiationScriptScreen from "./components/NegotiationScriptScreen";
import PracticeChatScreen from "./components/PracticeChatScreen";
import EmailDraftScreen from "./components/EmailDraftScreen";
import LiveQAScreen from "./components/LiveQAScreen";
import SummaryScreen from "./components/SummaryScreen";
import SuccessScreen from "./components/SuccessScreen";

import { 
  Compass, 
  Target, 
  MapPin, 
  Briefcase, 
  ChevronDown, 
  ChevronUp, 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  HelpCircle, 
  Trophy, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Play,
  Check,
  MessageSquare,
  Award,
  TrendingUp,
  FileText
} from "lucide-react";

// Stepper items list grouped by 4 phases
interface StepConfig {
  num: number;
  label: string;
}

interface PhaseConfig {
  name: string;
  icon: any;
  color: string;
  accent: string;
  steps: StepConfig[];
}

const PHASES: PhaseConfig[] = [
  {
    name: "Intake & Profile",
    icon: Target,
    color: "from-indigo-500 to-indigo-600",
    accent: "indigo",
    steps: [
      { num: 1, label: "Welcome Setup" },
      { num: 2, label: "Career Baseline" },
      { num: 3, label: "Upload Offer" },
      { num: 4, label: "Offer Red-Flags" }
    ]
  },
  {
    name: "Market Intelligence",
    icon: Compass,
    color: "from-amber-500 to-amber-600",
    accent: "amber",
    steps: [
      { num: 5, label: "Percentile Curve" },
      { num: 6, label: "Hiring Timing" },
      { num: 7, label: "Employer Health" },
      { num: 8, label: "Market Backups" },
      { num: 9, label: "Backup Details" }
    ]
  },
  {
    name: "Battle Preparation",
    icon: TrendingUp,
    color: "from-emerald-500 to-emerald-600",
    accent: "emerald",
    steps: [
      { num: 10, label: "Negotiation Blueprint" },
      { num: 11, label: "Verbal Pitch Scripts" },
      { num: 12, label: "Interactive Practice Chat" }
    ]
  },
  {
    name: "Closure & Victory",
    icon: Award,
    color: "from-rose-500 to-rose-600",
    accent: "rose",
    steps: [
      { num: 13, label: "Counter Email Draft" },
      { num: 14, label: "Expert Concierge Q&A" },
      { num: 15, label: "Playbook Summary" },
      { num: 16, label: "Complete Playbook" }
    ]
  }
];

interface CoachMessage {
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export default function App() {
  const [state, setState] = useState<CoachedState>({
    currentStep: 1,
    coachingPath: "full",
    role: "Software Engineer",
    location: "San Francisco, CA (High Cost)",
    experience: "Senior",
    experienceYears: 5,
    currentSalary: 120000,
    targetSalary: 145000,
    offerCompany: "FinOptima Systems",
    offerSalary: 140000,
    offerEquity: "0.05% options (4yr vest)",
    offerBonus: "10% annual performance",
    offerText: "",
    selectedJobId: null,
    chatMessages: [],
    qaHistory: [],
    emailTone: "collaborative",
    customEmailText: ""
  });

  // Sidebar expanded phases state
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    0: true, // Auto-expand current active phase
    1: false,
    2: false,
    3: false
  });

  // Mobile Campaign Map Overlay State
  const [showMobileMap, setShowMobileMap] = useState(false);

  // Floating AI Coach State
  const [showCoach, setShowCoach] = useState(false);
  const [coachInput, setCoachInput] = useState("");
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([
    {
      sender: "coach",
      text: "Hi! I'm Coach Offerly, your personal AI Negotiation wingman. Feel free to ask me anything about your current step or get advice on base compensation adjustments, remote terms, or vesting schedules!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isCoachTyping, setIsCoachTyping] = useState(false);
  const coachChatEndRef = useRef<HTMLDivElement>(null);

  // Automatically expand active step's phase
  useEffect(() => {
    const activePhaseIndex = PHASES.findIndex(phase => 
      phase.steps.some(step => step.num === state.currentStep)
    );
    if (activePhaseIndex !== -1) {
      setExpandedPhases(prev => ({
        ...prev,
        [activePhaseIndex]: true
      }));
    }
  }, [state.currentStep]);

  // Scroll coach chat to bottom
  useEffect(() => {
    coachChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coachMessages, isCoachTyping]);

  const updateState = (updates: Partial<CoachedState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(16, prev.currentStep + 1)
    }));
  };

  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1)
    }));
  };

  const goToStep = (stepNumber: number) => {
    setState((prev) => ({ ...prev, currentStep: stepNumber }));
    setShowMobileMap(false);
  };

  // Toggle phase in roadmap
  const togglePhase = (index: number) => {
    setExpandedPhases(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Get current phase details
  const currentPhaseIndex = PHASES.findIndex(p => p.steps.some(s => s.num === state.currentStep));
  const currentPhase = PHASES[currentPhaseIndex >= 0 ? currentPhaseIndex : 0];

  // Dynamic Suggestion Prompts for AI Coach based on current screen
  const getContextualPrompts = () => {
    switch (state.currentStep) {
      case 1:
        return [
          "How much do candidates usually lose by not negotiating?",
          "How does Offerly's 16-step curriculum work?"
        ];
      case 2:
        return [
          `Are salaries for ${state.role} currently rising in ${state.location.split(" (")[0]}?`,
          "Is a 5-year tenure considered mid-level or senior?"
        ];
      case 3:
      case 4:
        return [
          `What are red flags in a standard written offer letter?`,
          `How can I calculate the real value of an annual performance bonus?`
        ];
      case 5:
        return [
          "What percentile should I target as a mid/senior candidate?",
          "How is the market curve generated?"
        ];
      case 6:
      case 7:
        return [
          `Is ${state.offerCompany || "the company"} in a high-growth hiring cycle?`,
          "What is the best month to conclude salary discussions?"
        ];
      case 10:
      case 11:
        return [
          "Give me an active negotiation script for base salary.",
          "How should I counter if they say 'This is our final budget limit'?"
        ];
      case 12:
        return [
          "What is the best counter to Brenda's first salary anchor?",
          "How do I express high enthusiasm without sounding desperate?"
        ];
      case 13:
        return [
          "How do I write a compelling email subject line?",
          "Should I write the specific target numbers or a range?"
        ];
      default:
        return [
          "What are the golden rules of career negotiation?",
          "How do I ask for an equity grant bump?"
        ];
    }
  };

  // AI Chatbot Logic
  const handleSendCoachMsg = (questionText: string) => {
    if (!questionText.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: CoachMessage = {
      sender: "user",
      text: questionText,
      timestamp: userTime
    };

    setCoachMessages(prev => [...prev, newMsg]);
    setCoachInput("");
    setIsCoachTyping(true);

    // Context-aware AI Coach response generator
    setTimeout(() => {
      const lower = questionText.toLowerCase();
      let reply = "";

      if (lower.includes("lose") || lower.includes("not negotiating")) {
        reply = "Studies show that candidates who fail to negotiate lose out on an average of $500,000 to $1,000,000 in cumulative lifetime earnings! Companies expect a counter-offer; their initial offer is almost always anchored at the 40th to 60th percentile of their maximum approved budget, leaving considerable room.";
      } else if (lower.includes("how does offerly") || lower.includes("curriculum")) {
        reply = "Offerly is structured into 4 sequential blocks: first, we map your career details and analyze your offer. Then, we look at market telemetry, curves, and backups to establish leverage. Third, we prepare personalized verbal scripts and let you practice with a live AI recruiter. Finally, we auto-write the counter-offer emails and secure victory!";
      } else if (lower.includes("red flag") || lower.includes("written offer")) {
        reply = `For a ${state.role} role at ${state.offerCompany || "FinOptima Systems"}, look out for: 1) Overly long vesting cliffs (e.g. 1 year with zero early grant), 2) Broad intellectual property assignments extending outside working hours, 3) Unclear performance standards for bonuses, and 4) Strict hybrid rules lacking team-level discretion.`;
      } else if (lower.includes("percentile") || lower.includes("curve")) {
        reply = `With ${state.experienceYears} years of experience as a ${state.role}, you should target between the 75th and 90th percentile of localized market data. This aligns your base compensation with top-tier contributors, and establishes a strong commercial anchor.`;
      } else if (lower.includes("timing") || lower.includes("best month") || lower.includes("employer health")) {
        reply = "Hiring cycles show high leverage during Q1 and Q3 when new budgets release. If the company is growing quickly, they would rather pay a 15% premium than delay project timelines by restarting a search. Use this team-growth pressure as your primary leverage.";
      } else if (lower.includes("final budget") || lower.includes("they say")) {
        reply = "If a recruiter asserts 'this is our maximum budget limit,' pivot immediately to secondary levers: 'I respect that the base salary is hard-capped. To help bridge the difference, can we align on a $15,000 sign-on bonus to offset my unvested equity, or explore a 6-month accelerated performance review cycle?'";
      } else if (lower.includes("script") || lower.includes("verbal") || lower.includes("base salary")) {
        reply = `Here is an elite script: 'Thank you so much, Brenda. I am incredibly excited about joining ${state.offerCompany || "FinOptima Systems"} and collaborating on the upcoming launch. Given my specialized expertise in this space and localized market data, I was expecting a base closer to $${Math.round(state.offerSalary * 1.15).toLocaleString()}. If we can align on that number, I am ready to sign the agreement today!'`;
      } else if (lower.includes("brenda") || lower.includes("counter")) {
        reply = "When practicing with Brenda in our Simulator (Step 12), try using terms like 'market index' or 'internal equity'. Always reiterate your strong commitment to the company. She reacts extremely well to candidates who combine firm numbers with massive structural excitement.";
      } else if (lower.includes("email") || lower.includes("subject line")) {
        reply = "An excellent email subject line is: 'Excited for the journey ahead / Questions regarding offer terms - [Your Name]'. Keep it clean, positive, and collaborative. State your request clearly, back it with the value you bring, and conclude with high enthusiasm to sign.";
      } else if (lower.includes("equity") || lower.includes("vesting") || lower.includes("grant")) {
        reply = "Equity grants are highly negotiable because they don't impact the immediate cash budget of the hiring manager. Frame it as long-term alignment: 'I am looking for a larger equity stake so I can be fully incentivized and financially aligned with the long-term success of the product.'";
      } else {
        reply = `That is an excellent point regarding your step. As a ${state.role} localized in ${state.location.split(" (")[0]}, every piece of research you complete strengthens your position. Focus on maintaining a collaborative 'win-win' tone, state your market backed value, and pivot to secondary levers if base salaries are temporarily capped! Let me know if you need specific phrasing.`;
      }

      setCoachMessages(prev => [...prev, {
        sender: "coach",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
      setIsCoachTyping(false);
    }, 1000);
  };

  // Render current active screen component
  const renderCurrentScreen = () => {
    const props = {
      state,
      updateState,
      nextStep,
      prevStep
    };

    switch (state.currentStep) {
      case 1: return <WelcomeScreen {...props} />;
      case 2: return <InputDetailsScreen {...props} />;
      case 3: return <UploadOfferScreen {...props} />;
      case 4: return <OfferAnalysisScreen {...props} />;
      case 5: return <MarketAnalysisScreen {...props} />;
      case 6: return <MarketTimingScreen {...props} />;
      case 7: return <CompanyHealthScreen {...props} />;
      case 8: return <JobSearchResultsScreen {...props} />;
      case 9: return <JobDetailsScreen {...props} />;
      case 10: return <NegotiationRecScreen {...props} />;
      case 11: return <NegotiationScriptScreen {...props} />;
      case 12: return <PracticeChatScreen {...props} />;
      case 13: return <EmailDraftScreen {...props} />;
      case 14: return <LiveQAScreen {...props} />;
      case 15: return <SummaryScreen {...props} />;
      case 16: return <SuccessScreen {...props} />;
      default: return <WelcomeScreen {...props} />;
    }
  };

  // Calculate overall progress percentage
  const progressPercent = Math.round(((state.currentStep - 1) / 15) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] flex flex-col font-sans text-slate-900 pb-16" id="coach-app-container">
      
      {/* Elegant Premium Top Navigation Header */}
      <header className="h-16 bg-white border border-slate-200 mx-4 mt-4 rounded-2xl px-6 flex items-center justify-between shrink-0 sticky top-4 z-40 shadow-md">
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm animate-bounce-slow">
            $
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">Offerly</span>
            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5 font-mono">Negotiation Coach</span>
          </div>
        </div>

        {/* Dynamic Tactile Top Progress Bar */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Playbook Calibrated</span>
            <div className="w-32 h-3 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden p-0.5">
              <div 
                className="bg-indigo-600 h-full rounded-md transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
            <span className="text-xs font-black text-indigo-600 font-mono">{progressPercent}%</span>
          </div>

          {/* Interactive Mobile Roadmap Trigger */}
          <button 
            onClick={() => setShowMobileMap(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" /> Map
          </button>

          {/* Active User Persona Profile Badge */}
          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 leading-none">ROLE</span>
              <span className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[120px]">{state.role}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-slate-200 flex items-center justify-center text-slate-800 font-bold text-xs uppercase shadow-sm">
              {state.role ? state.role.split(" ").map(w => w[0]).join("").slice(0, 2) : "SE"}
            </div>
          </div>
        </div>
      </header>

      {/* Main Tactical Workspace Grid */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto p-4 md:p-6 gap-6 items-stretch">
        
        {/* Navigation Sidebar: Gamified Progressive Pathway (Desktop) */}
        <aside className="hidden lg:flex w-80 shrink-0 flex-col gap-4 text-left">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-lg max-h-[80vh]">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" /> Strategic Campaign Map
              </h3>
              <span className="text-[10px] font-bold text-slate-400 font-mono">16 LEVELS</span>
            </div>
            
            {/* Scrollable Phase Tab Structure */}
            <div className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-none">
              {PHASES.map((phase, pIdx) => {
                const isExpanded = expandedPhases[pIdx];
                const PhaseIcon = phase.icon;
                const isActivePhase = phase.steps.some(step => step.num === state.currentStep);

                return (
                  <div 
                    key={pIdx} 
                    className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                      isActivePhase 
                        ? "bg-slate-50/50 border-slate-300 shadow-sm" 
                        : "bg-white border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    {/* Phase Header Accordion trigger */}
                    <button
                      onClick={() => togglePhase(pIdx)}
                      className="w-full flex items-center justify-between p-3.5 text-left font-bold text-sm text-slate-800 transition-colors hover:bg-slate-100 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 bg-${phase.accent}-50 border border-${phase.accent}-100 text-${phase.accent}-700 rounded-lg`}>
                          <PhaseIcon className="w-4 h-4" />
                        </div>
                        <span className="leading-tight text-xs tracking-tight">{phase.name}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {/* Step levels inside phase (Connected Winding Path) */}
                    {isExpanded && (
                      <div className="px-5 pb-4 pt-2 border-t border-slate-100 bg-white/70 space-y-3 relative">
                        {/* Connector vertical pipeline */}
                        <div className="absolute left-7 top-4 bottom-10 w-0.5 bg-slate-200" />

                        {phase.steps.map((step) => {
                          const isStepActive = state.currentStep === step.num;
                          const isStepCompleted = state.currentStep > step.num;

                          return (
                            <button
                              key={step.num}
                              onClick={() => goToStep(step.num)}
                              className="w-full flex items-center gap-3 relative text-left group transition-all"
                            >
                              {/* Step circle node with sleek indicator */}
                              <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 border transition-all ${
                                isStepActive 
                                  ? "bg-indigo-600 border-indigo-600 text-white animate-pulse-glow scale-110 shadow-md" 
                                  : isStepCompleted
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                    : "bg-slate-100 border-slate-200 text-slate-400"
                              }`}>
                                {isStepCompleted ? (
                                  <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                                ) : (
                                  step.num
                                )}
                              </div>

                              <span className={`text-xs truncate transition-all leading-none ${
                                isStepActive 
                                  ? "font-bold text-indigo-600 translate-x-1" 
                                  : isStepCompleted
                                    ? "font-semibold text-slate-700 hover:text-slate-900"
                                    : "font-medium text-slate-400 hover:text-slate-500"
                              }`}>
                                {step.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tactical TIP Box styled like a premium card */}
            <div className="mt-4 p-4 bg-amber-50/40 border border-amber-100 rounded-2xl text-left shadow-sm relative overflow-hidden shrink-0">
              <div className="absolute -right-2 -top-2 w-12 h-12 bg-amber-200/20 rounded-full blur-xl" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" /> Strategist Tip
              </div>
              <p className="text-amber-950 text-[11px] font-medium leading-relaxed italic">
                "Never accept the first offer on the spot. Express deep excitement, request the written benefits package, and take 48 hours to align."
              </p>
            </div>
          </div>
        </aside>

        {/* Content Box with premium framing */}
        <main className="flex-1 flex flex-col justify-start">
          
          {/* Mobile Current Phase Indicator Bar */}
          <div className="lg:hidden flex flex-col gap-2 mb-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-md text-left">
            <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">CURRENT PHASES & LEVEL</span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center border border-indigo-200 text-indigo-700 font-bold text-xs">
                  {state.currentStep}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{currentPhase.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                    Step {state.currentStep} of 16: {[
                      "Welcome Setup", "Career Baseline", "Upload Offer", "Offer Red-Flags",
                      "Percentile Curve", "Hiring Timing", "Employer Health", "Market Backups",
                      "Backup Details", "Negotiation Blueprint", "Verbal Pitch Scripts", "Interactive Practice Chat",
                      "Counter Email Draft", "Expert Concierge Q&A", "Playbook Summary", "Complete Playbook"
                    ][state.currentStep - 1]}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowMobileMap(true)}
                className="px-2.5 py-1 bg-indigo-50 border border-indigo-150 text-[10px] font-bold rounded-lg text-indigo-700 transition-all cursor-pointer shadow-sm hover:bg-indigo-100"
              >
                Expand Roadmap
              </button>
            </div>
          </div>

          {/* Actual Active Screen nested in premium layout */}
          <div className="flex-1 transition-all duration-300">
            {renderCurrentScreen()}
          </div>
        </main>
      </div>

      {/* Floating AI Coach Chatbot Widget Trigger */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowCoach(!showCoach)}
          className={`relative group w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full border border-indigo-500 flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer ${
            showCoach ? "rotate-90" : "animate-bounce-slow"
          }`}
          id="ai-coach-trigger"
        >
          {showCoach ? (
            <X className="w-6 h-6 stroke-[3]" />
          ) : (
            <>
              <Bot className="w-7 h-7" />
              {/* Dynamic notification visual glow */}
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-rose-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white animate-pulse">
                AI
              </span>
            </>
          )}
        </button>
      </div>

      {/* Premium Elegant AI Coach Panel (Floating) */}
      {showCoach && (
        <div 
          className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-32px)] h-[500px] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-50 animate-scale-up"
          id="ai-coach-panel"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">Coach Offerly</p>
                <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Expert AI Co-Pilot Active
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowCoach(false)}
              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* AI Advisor Chat Messages Log */}
          <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4 scrollbar-none flex flex-col justify-start">
            {coachMessages.map((msg, idx) => {
              const isUser = msg.sender === "user";
              return (
                <div key={idx} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm border ${
                    isUser 
                      ? "bg-slate-900 border-slate-900 text-white rounded-tr-none text-right font-medium" 
                      : "bg-white border-slate-200 text-slate-800 rounded-tl-none text-left font-semibold leading-relaxed"
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <span className="block text-[8px] mt-1.5 opacity-50 font-mono text-right">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}
            
            {isCoachTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs shadow-sm flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-70" />
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-140" />
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-210" />
                  <span className="text-[10px] text-slate-500 font-bold ml-1 font-mono">Analyzing step...</span>
                </div>
              </div>
            )}
            <div ref={coachChatEndRef} />
          </div>

          {/* Dynamic Suggestion Prompts Feed */}
          <div className="bg-white border-t border-slate-200 p-3 flex flex-col text-left">
            <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-600 fill-indigo-200" /> Active Level Tips:
            </span>
            <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto pr-1 scrollbar-none">
              {getContextualPrompts().map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleSendCoachMsg(prompt)}
                  className="text-[10px] text-left px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl font-bold text-slate-700 hover:text-indigo-900 transition-all truncate cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Chat control box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendCoachMsg(coachInput);
            }}
            className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              placeholder="e.g. How do I ask for accelerated reviews?"
              className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-semibold placeholder-slate-400"
              disabled={isCoachTyping}
            />
            <button
              type="submit"
              className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center font-bold text-xs"
              disabled={isCoachTyping}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Campaign Roadmap Overlay Panel */}
      {showMobileMap && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[85vh] animate-scale-up overflow-hidden text-left">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-indigo-400" /> Strategic Campaign Map
              </h3>
              <button 
                onClick={() => setShowMobileMap(false)}
                className="p-1.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 scrollbar-none">
              {PHASES.map((phase, pIdx) => {
                const PhaseIcon = phase.icon;
                const isActivePhase = phase.steps.some(step => step.num === state.currentStep);

                return (
                  <div key={pIdx} className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                      <div className={`p-1.5 bg-${phase.accent}-50 border border-${phase.accent}-100 text-${phase.accent}-700 rounded-lg`}>
                        <PhaseIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{phase.name}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {phase.steps.map((step) => {
                        const isStepActive = state.currentStep === step.num;
                        const isStepCompleted = state.currentStep > step.num;

                        return (
                          <button
                            key={step.num}
                            onClick={() => goToStep(step.num)}
                            className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                              isStepActive 
                                ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-bold shadow-sm" 
                                : isStepCompleted
                                  ? "bg-slate-50 border-slate-200 text-slate-600 font-semibold"
                                  : "bg-white border-slate-150 text-slate-400 font-medium"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border ${
                              isStepActive 
                                ? "bg-indigo-600 border-indigo-600 text-white" 
                                : isStepCompleted
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                  : "bg-slate-100 border-slate-200 text-slate-400"
                            }`}>
                              {isStepCompleted ? (
                                <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
                              ) : (
                                step.num
                              )}
                            </div>
                            <span className="text-[10px] truncate leading-none">{step.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Humble Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400 font-semibold">
        Offerly Negotiation Playbook © 2026. All strategies are licensed for personal candidate career growth.
      </footer>
    </div>
  );
}
