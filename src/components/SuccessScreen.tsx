import React from "react";
import { ScreenProps } from "../types";
import { Trophy, CheckCircle, Sparkles, Star, RefreshCw, Calendar, Flame } from "lucide-react";

export default function SuccessScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  const handleReset = () => {
    updateState({
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
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-12 text-center relative overflow-hidden" id="success-screen">
      {/* Visual background confetti glow */}
      <div className="absolute -left-16 -top-16 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />

      {/* Hero Badge */}
      <div className="inline-flex items-center justify-center p-4 bg-indigo-100 text-indigo-800 rounded-full mb-6 relative shadow-xs">
        <Trophy className="w-12 h-12 text-indigo-600 animate-bounce" />
        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-500" />
      </div>

      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">You're Ready to Negotiate!</h2>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-10 leading-relaxed font-semibold">
        Your customized playbook, objection-handling scripts, and email drafts are fully calibrated. Take a deep breath—you are fully prepared.
      </p>

      {/* Gold Rules Summary Checklist */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 text-left shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Golden Rules of Salary Negotiation
        </h3>
        
        <ul className="space-y-3">
          <li className="flex gap-3 text-xs text-slate-600 leading-relaxed font-semibold">
            <CheckCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5 animate-scale-up" />
            <span><strong>Always be enthusiastic:</strong> Express continuous excitement about the team and the mission. Energy is magnetic and preserves rapport.</span>
          </li>
          <li className="flex gap-3 text-xs text-slate-600 leading-relaxed font-semibold">
            <CheckCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5 animate-scale-up" />
            <span><strong>Never apologize for asking:</strong> Delete phrases like 'sorry to ask' or 'I feel bad'. Negotiating is a standard business custom.</span>
          </li>
          <li className="flex gap-3 text-xs text-slate-600 leading-relaxed font-semibold">
            <CheckCircle className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5 animate-scale-up" />
            <span><strong>Secure alternative concessions:</strong> If base salaries are hard capped, immediately pivot to asking for signing bonuses or vacation stipends.</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-all shadow-xs cursor-pointer bg-white"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" /> Start Over
        </button>
        
        <a
          href="https://ai.studio/build"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 cursor-pointer"
        >
          <Flame className="w-4 h-4 text-indigo-300" /> Exit Coach Playbook
        </a>
      </div>
    </div>
  );
}
