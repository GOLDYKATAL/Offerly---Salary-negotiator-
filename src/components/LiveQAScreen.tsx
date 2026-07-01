import React, { useState, useRef, useEffect } from "react";
import { ScreenProps, QAMessage } from "../types";
import { FAQ_DATA } from "../data/mockData";
import { 
  Send, 
  HelpCircle, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Award,
  BookOpen,
  MessageSquare
} from "lucide-react";

export default function LiveQAScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  const [inputText, setInputText] = useState("");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);
  const [qaHistory, setQaHistory] = useState<QAMessage[]>(state.qaHistory || []);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [qaHistory, isTyping]);

  const handleAsk = (question: string) => {
    if (!question.trim()) return;

    const userQuestion = question;
    setInputText("");
    setIsTyping(true);

    // Append user question
    const updatedHistory = [...qaHistory, { question: userQuestion, answer: "" }];
    setQaHistory(updatedHistory);

    // Simulate smart coaching answering
    setTimeout(() => {
      const lower = userQuestion.toLowerCase();
      let ans = "";

      if (lower.includes("rescind") || lower.includes("take back") || lower.includes("cancel")) {
        ans = "Rescinding an offer is extremely rare. As long as you negotiate with enthusiasm, politeness, and rely on market numbers, employers will respect your commercial maturity. They spent thousands of dollars sourcing you, and would much rather adjust terms than start the hiring cycle over.";
      } else if (lower.includes("history") || lower.includes("current") || lower.includes("making")) {
        ans = "If asked about salary history: 'I am focused on roles in the $160,000-$180,000 range to reflect the responsibilities of this level and my localized expertise.' Many jurisdictions have legally banned questions about historical salaries to ensure pay equity.";
      } else if (lower.includes("time") || lower.includes("deadline") || lower.includes("review")) {
        ans = "Always request ample time: 'Thank you for this exciting offer! I want to review the full written documentation regarding medical benefits and equity terms. Can we connect on Wednesday to talk through questions?' 48 to 72 hours is standard.";
      } else if (lower.includes("non-compete") || lower.includes("legal") || lower.includes("restrict")) {
        ans = "Be cautious with non-competes. Ask for clarity: 'Could we limit the non-compete scope to direct product competitors, or reduce the restriction window from 12 months to 3 months?' Many states are cracking down on or ban non-compete agreements entirely.";
      } else {
        ans = "That is a great question! Standard negotiation protocol advises you to always frame requests around mutual gain: 'By aligning on these terms, I can confidently commit all my energy immediately without distraction.' Focus strictly on what value you are bringing to the employer to justify the cost.";
      }

      const finalHistory = [...qaHistory, { question: userQuestion, answer: ans }];
      setQaHistory(finalHistory);
      updateState({ qaHistory: finalHistory });
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(inputText);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl p-6 md:p-8 text-left" id="live-qa-screen">
      
      {/* Header element with elegant indicators */}
      <div className="mb-6 border-b border-slate-100 pb-5">
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-100">
          <Award className="w-3.5 h-3.5" /> Level 14: Expert Advisor
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Live Negotiation Q&A</h2>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          Read top expert negotiation guides or query our virtual coach regarding difficult contract policies.
        </p>
      </div>

      {/* Main Grid: FAQ List & Live Ask Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Left Side: Top FAQ Accordions */}
        <div className="space-y-3 text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
            <BookOpen className="w-4 h-4 text-indigo-600" /> Curated Expert Guides
          </h3>
          
          <div className="space-y-3">
            {FAQ_DATA.map((faq, i) => {
              const isOpen = activeFAQ === i;
              return (
                <div 
                  key={i} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-150 ${
                    isOpen ? "bg-slate-50 border-slate-300 shadow-sm" : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFAQ(isOpen ? null : i)}
                    className="w-full flex justify-between items-center px-4 py-3.5 text-left font-bold text-slate-800 text-xs hover:bg-slate-100/60 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-100">
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">{faq.answer}</p>
                      <button
                        type="button"
                        onClick={() => handleAsk(faq.question)}
                        className="mt-3 text-[10px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1 border border-indigo-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" /> Ask in chat console
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Coach Chat Interface */}
        <div className="border border-slate-200 rounded-3xl bg-slate-50 flex flex-col h-[400px] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-none">Negotiation Concierge</p>
                <span className="text-[9px] text-indigo-300 font-bold">Ask general coaching questions</span>
              </div>
            </div>
            <span className="text-[9px] bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-lg font-bold tracking-widest uppercase border border-slate-700">
              CONCIERGE
            </span>
          </div>

          {/* QA Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
            {qaHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-full p-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm mb-3">
                  <Bot className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">No active discussion yet</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal font-medium">
                  Ask about counter thresholds, sign-on budgets, health coverage terms, or equity cliff clauses.
                </p>
              </div>
            ) : (
              qaHistory.map((item, index) => (
                <div key={index} className="space-y-3">
                  {/* Question */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-slate-900 text-white rounded-2xl border border-slate-900 rounded-tr-none px-4 py-2.5 text-xs shadow-sm font-medium">
                      <p className="leading-relaxed">{item.question}</p>
                    </div>
                  </div>
                  {/* Answer */}
                  {item.answer && (
                    <div className="flex justify-start text-left">
                      <div className="max-w-[85%] bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm flex gap-2 font-semibold leading-relaxed">
                        <Bot className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">{item.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 text-slate-450 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs shadow-sm flex items-center gap-1.5 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Can employers rescind an offer for negotiating?"
              className="flex-1 px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-semibold placeholder-slate-400"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:translate-y-[-1px] active:translate-y-[1px] transition-all cursor-pointer flex items-center justify-center font-bold text-xs"
              disabled={isTyping}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Action panel */}
      <div className="flex justify-between items-center pt-5 border-t border-slate-100">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl shadow-sm transition-all cursor-pointer text-xs"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs"
        >
          Next: Plan Summary
        </button>
      </div>
    </div>
  );
}
