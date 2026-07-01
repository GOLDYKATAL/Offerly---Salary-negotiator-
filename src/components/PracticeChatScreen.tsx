import React, { useState, useRef, useEffect } from "react";
import { ScreenProps, ChatMessage } from "../types";
import { RECRUITER_MOCK_RESPONSES, RECRUITER_DEFAULT_RESPONSES } from "../data/mockData";
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  ThumbsUp, 
  Award, 
  Flame, 
  HeartHandshake,
  ShieldCheck
} from "lucide-react";

export default function PracticeChatScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat if empty
  useEffect(() => {
    if (state.chatMessages.length === 0) {
      updateState({
        chatMessages: [
          {
            sender: "recruiter",
            text: `Hi! I'm Brenda, the lead recruiter at ${state.offerCompany || "FinOptima Systems"}. We are so excited about your interview rounds! How are you feeling about the written offer letter we extended?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]
      });
    }
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.chatMessages, isTyping]);

  const evaluateMessage = (text: string) => {
    const lower = text.toLowerCase();
    let score = 75;
    let feedback = "Neutral phrasing. Try to be more specific in your ask and align it directly to your core expertise.";

    if (lower.includes("sorry") || lower.includes("apologize") || lower.includes("afraid")) {
      score -= 15;
      feedback = "Avoid apologizing or sounding submissive. Asking for fair market compensation is a standard commercial discussion.";
    } else if (lower.includes("want") || lower.includes("need")) {
      score -= 5;
      feedback = "Using 'want' or 'need' sounds personal. Reframe around 'market alignment' and 'the value you bring'.";
    }

    if (lower.includes("market") || lower.includes("research") || lower.includes("experience") || lower.includes("align")) {
      score += 15;
      feedback = "Excellent! Backing your expectations with research and alignment establishes instant professional credibility.";
    }

    if (lower.includes("accept") || lower.includes("ready to sign") || lower.includes("wrap up")) {
      score += 10;
      feedback = "Great trial close! Giving the recruiter high assurance of immediate acceptance creates a powerful incentive for them to authorize updates.";
    }

    return { score: Math.max(30, Math.min(100, score)), feedback };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const evaluation = evaluateMessage(inputText);

    const userMsg: ChatMessage = {
      sender: "user",
      text: inputText,
      timestamp: userTime,
      score: evaluation.score,
      feedback: evaluation.feedback
    };

    const updatedMessages = [...state.chatMessages, userMsg];
    updateState({ chatMessages: updatedMessages });
    setInputText("");
    setIsTyping(true);

    // Simulated recruiter response
    setTimeout(() => {
      const lowerInput = inputText.toLowerCase();
      let match = RECRUITER_MOCK_RESPONSES.find((item) =>
        item.triggers.some((trig) => lowerInput.includes(trig))
      );

      let replyText = "";
      if (match) {
        replyText = match.response;
      } else {
        // Pick a random default response
        const idx = Math.floor(Math.random() * RECRUITER_DEFAULT_RESPONSES.length);
        replyText = RECRUITER_DEFAULT_RESPONSES[idx];
      }

      const recruiterMsg: ChatMessage = {
        sender: "recruiter",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      updateState({ chatMessages: [...updatedMessages, recruiterMsg] });
      setIsTyping(false);
    }, 1500);
  };

  const currentScore = state.chatMessages
    .filter(m => m.sender === "user" && m.score !== undefined)
    .reduce((acc, curr) => acc + (curr.score || 0), 0) / 
    Math.max(1, state.chatMessages.filter(m => m.sender === "user").length);

  // Determine Recruiter Stance text, color, and meter percentage
  const getStance = (scoreVal: number) => {
    const val = scoreVal || 75; // Default to mid neutral
    if (val < 55) {
      return {
        label: "Firm / Reluctant",
        sub: "Brenda is defensive. Avoid apologizing, stand firm on market metrics.",
        color: "bg-rose-500",
        textColor: "text-rose-700",
        bgLight: "bg-rose-50",
        percent: val
      };
    } else if (val < 75) {
      return {
        label: "Skeptical / Observant",
        sub: "Provide market percentile data or reference competing offers to build leverage.",
        color: "bg-amber-500",
        textColor: "text-amber-800",
        bgLight: "bg-amber-50/40",
        percent: val
      };
    } else if (val < 88) {
      return {
        label: "Receptive & Collaborative",
        sub: "Excellent tone! Reiterate high excitement. Brenda is open to reviewing terms.",
        color: "bg-indigo-500",
        textColor: "text-indigo-700",
        bgLight: "bg-indigo-50",
        percent: val
      };
    } else {
      return {
        label: "Highly Favorable (Closed)",
        sub: "Extremely strong. Provide assurance of rapid signing if these terms are met.",
        color: "bg-emerald-500",
        textColor: "text-emerald-700",
        bgLight: "bg-emerald-50",
        percent: val
      };
    }
  };

  const stance = getStance(currentScore);

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-xl p-6 md:p-8 text-left" id="practice-chat-screen">
      
      {/* Title block with elegant elements */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-100">
            <Award className="w-3.5 h-3.5" /> Phase III: Tactical Simulator
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">Recruiter Roleplay Room</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Test your pitch live against Brenda. Check her stance gauge to optimize your leverage in real-time.
          </p>
        </div>
        
        {/* Overall Negotiation Rating Badge */}
        <div className="bg-indigo-50 border border-indigo-100 px-5 py-3 rounded-2xl flex flex-col items-center shadow-sm self-start md:self-auto shrink-0 min-w-[120px]">
          <span className="text-[9px] font-bold uppercase text-indigo-600 tracking-widest leading-none mb-1">Coach Score</span>
          <span className="text-2xl font-black text-indigo-950 leading-none">{currentScore ? Math.round(currentScore) : 75}%</span>
        </div>
      </div>

      {/* Real-time Recruiter Stance Gauge (Very interactive!) */}
      <div className={`border border-slate-150 rounded-2xl p-4 mb-6 shadow-sm transition-all duration-300 ${stance.bgLight}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-2">
          <div className="text-left">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Recruiter Live Posture</span>
            <span className={`text-base font-bold ${stance.textColor} flex items-center gap-1.5`}>
              <span className={`w-2.5 h-2.5 rounded-full ${stance.color} animate-ping`} />
              {stance.label}
            </span>
          </div>
          <p className="text-slate-600 text-xs font-semibold md:max-w-md text-left md:text-right leading-tight">
            {stance.sub}
          </p>
        </div>

        {/* Meter Track */}
        <div className="w-full h-4 bg-white border border-slate-200 rounded-xl overflow-hidden p-0.5 relative shadow-inner">
          <div 
            className={`h-full rounded-lg transition-all duration-700 ${stance.color}`}
            style={{ width: `${stance.percent}%` }}
          />
          {/* Milestone Labels */}
          <div className="absolute inset-0 flex justify-between px-3 text-[8px] font-bold text-slate-400/80 items-center pointer-events-none uppercase font-mono">
            <span>Firm</span>
            <span>Neutral</span>
            <span>Open</span>
            <span>Victory</span>
          </div>
        </div>
      </div>

      {/* Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Recruiter Conversational Box */}
        <div className="lg:col-span-2 border border-slate-200 rounded-3xl flex flex-col bg-slate-50/50 overflow-hidden h-[420px] shadow-sm">
          {/* Recruiter Contact Card Header */}
          <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                B
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-none text-white">Brenda Vance</p>
                <span className="text-[10px] text-indigo-300 font-bold">Principal Talent Sourcing Lead</span>
              </div>
            </div>
            <span className="text-[9px] bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-lg font-bold tracking-widest uppercase border border-slate-700">
              SIMULATED
            </span>
          </div>

          {/* Message Thread Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
            {state.chatMessages.map((msg, i) => {
              const isUser = msg.sender === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs border relative shadow-sm ${
                    isUser 
                      ? "bg-slate-905 border-slate-900 bg-slate-900 text-white rounded-tr-none font-medium text-right" 
                      : "bg-slate-50 border-slate-200 text-slate-800 rounded-tl-none font-semibold text-left leading-relaxed"
                  }`}>
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className="block text-[8px] text-right mt-1.5 opacity-50 font-mono font-bold">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs rounded-tl-none shadow-sm flex items-center gap-1.5 text-slate-400 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span>Brenda is drafting reply...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Thanks Brenda. I am thrilled. Let's discuss a base salary alignment..."
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-semibold placeholder-slate-400"
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

        {/* Sidebar AI Coach Evaluator Card */}
        <div className="border border-slate-200 rounded-3xl p-5 bg-amber-50/20 flex flex-col justify-between h-[420px] shadow-sm text-left">
          <div className="overflow-y-auto scrollbar-none pr-1 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-widest border-b border-amber-100 pb-2.5 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" /> Behavioral Evaluator
            </div>
            
            {/* Find last user message with feedback */}
            {(() => {
              const userMsgs = state.chatMessages.filter(m => m.sender === "user" && m.feedback);
              if (userMsgs.length === 0) {
                return (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                      Your communications coach monitors Brenda's emotional reception and your strategic positioning.
                    </p>
                    <div className="p-3.5 bg-white border border-slate-100 rounded-2xl text-[11px] text-slate-500 font-semibold italic leading-normal shadow-sm">
                      "Pro Tip: Submit an initial request asking to calibrate base compensation around your target market research, or explore signing incentives."
                    </div>
                  </div>
                );
              }
              const lastMsg = userMsgs[userMsgs.length - 1];
              const isExcellent = (lastMsg.score || 0) >= 80;

              return (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phrase Impact</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                      isExcellent 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}>
                      {isExcellent ? <ThumbsUp className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {isExcellent ? "High Impact" : "Medium Impact"}
                    </span>
                  </div>
                  
                  <div className="bg-white border border-slate-150 rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                      {lastMsg.feedback}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Quick Words insertion bar */}
          <div className="pt-4 border-t border-slate-100 mt-4 text-left shrink-0">
            <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> Insert Tactics:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button 
                type="button"
                className="text-[9px] bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-xl cursor-pointer font-bold transition-all shadow-sm" 
                onClick={() => setInputText("Thank you Brenda. Based on localized salary indices and internal equity trends, can we adjust base to reflect research?")}
              >
                + Market Align
              </button>
              <button 
                type="button"
                className="text-[9px] bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-2.5 py-1.5 rounded-xl cursor-pointer font-bold transition-all shadow-sm" 
                onClick={() => setInputText("Is there flexibility around signing incentives or holiday structures to reach parity?")}
              >
                + Secondary Levers
              </button>
            </div>
          </div>
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
          Next: Email Designer
        </button>
      </div>
    </div>
  );
}
