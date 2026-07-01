import React from "react";
import { ScreenProps } from "../types";
import { ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";

export default function OfferAnalysisScreen({ state, nextStep, prevStep }: ScreenProps) {
  // Let's compute some realistic evaluation scores based on target vs offer salary
  const gap = state.offerSalary - state.targetSalary;
  const targetMet = state.offerSalary >= state.targetSalary;
  
  // Calculate basic score
  let score = 78;
  if (targetMet) score += 15;
  else if (Math.abs(gap) < 10000) score += 5;
  else score -= 10;
  
  if (state.offerEquity && state.offerEquity.toLowerCase().includes("cliff")) score += 2;
  if (state.offerBonus && state.offerBonus.toLowerCase().includes("signing")) score += 5;
  
  // Bound score
  score = Math.max(40, Math.min(98, score));

  // Determine label and colors
  let rating = "Fair Offer";
  let themeColor = "amber";
  if (score >= 90) {
    rating = "Outstanding Offer";
    themeColor = "emerald";
  } else if (score < 65) {
    rating = "Under-market Offer";
    themeColor = "rose";
  }

  // Set red flags
  const redFlags = [
    {
      title: "Vesting Terms Require Vigilance",
      description: "Standard vesting is a 4-year period with a 1-year cliff. If there's no mention of acceleration on transition, you bear double risk on early acquisitions.",
      severity: "warning"
    },
    {
      title: "Over-weighted Performance Bonus",
      description: "Over 10% of total cash relies on discretionary criteria. Standard guidance is securing a higher base salary since bonuses are legally non-guaranteed.",
      severity: "notice"
    },
    {
      title: "No Sign-on to Bridge Equity Void",
      description: state.offerBonus.toLowerCase().includes("sign-on") || state.offerBonus.toLowerCase().includes("signing")
        ? "Good! A sign-on bonus is present, offsetting immediate gap."
        : "Warning: Missing a one-time sign-on bonus. You need to negotiate a sign-on to bridge the 1-year cliff equity freeze.",
      severity: state.offerBonus.toLowerCase().includes("sign-on") || state.offerBonus.toLowerCase().includes("signing") ? "ok" : "danger"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8 animate-fade-in" id="offer-analysis-screen">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Offer Analysis Results</h2>
        <p className="text-slate-500 mt-2">
          Here is how your offer at <strong className="text-slate-800">{state.offerCompany || "FinOptima"}</strong> measures up against your target salary of <strong className="text-indigo-600">${state.targetSalary.toLocaleString()}</strong>.
        </p>
      </div>

      {/* Score Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Radial Score Gauge */}
        <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-slate-200">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-2">Offer Grade Score</span>
          <div className="relative flex items-center justify-center w-28 h-28 mb-3">
            {/* Circular track */}
            <svg className="absolute w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="48"
                className="stroke-slate-200 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="56"
                cy="56"
                r="48"
                className={`fill-none transition-all duration-1000 ${
                  themeColor === "emerald" ? "stroke-indigo-600" : themeColor === "amber" ? "stroke-amber-500" : "stroke-rose-600"
                }`}
                strokeWidth="8"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - (301.6 * score) / 100}
              />
            </svg>
            <div className="text-3xl font-extrabold text-slate-800">{score}%</div>
          </div>
          <span className={`text-sm font-bold ${
            themeColor === "emerald" ? "text-indigo-700" : themeColor === "amber" ? "text-amber-700" : "text-rose-700"
          }`}>{rating}</span>
        </div>

        {/* Salary Gap Comparison */}
        <div className="col-span-2 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 block">Salary Calibration</span>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                  <span>Your Target: ${state.targetSalary.toLocaleString()}</span>
                  <span>Offered: ${state.offerSalary.toLocaleString()}</span>
                </div>
                {/* Visual horizontal bar */}
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-slate-300 h-full transition-all"
                    style={{ width: `${Math.min(100, (state.currentSalary / state.targetSalary) * 100)}%` }}
                  />
                  <div 
                    className={`h-full transition-all ${targetMet ? "bg-indigo-600" : "bg-amber-400"}`}
                    style={{ width: `${Math.min(100, (state.offerSalary / state.targetSalary) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
            {targetMet ? (
              <div className="p-2 bg-indigo-100 text-indigo-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-700">
                {targetMet 
                  ? "Base Target Achieved!" 
                  : `Base Offer is short of your goal by $${Math.abs(gap).toLocaleString()}`}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {targetMet 
                  ? "Now optimize for equity scaling and structural perks." 
                  : "We will target this specific gap in your custom scripts and draft."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags & Risks Warning */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" /> Contract Analysis & Red Flags
        </h3>
        
        <div className="space-y-3">
          {redFlags.map((flag, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                flag.severity === "danger" 
                  ? "bg-rose-50/50 border-rose-100 text-rose-900" 
                  : flag.severity === "warning"
                    ? "bg-amber-50/50 border-amber-100 text-amber-950"
                    : flag.severity === "ok"
                      ? "bg-indigo-50/50 border-indigo-100 text-indigo-950"
                      : "bg-slate-50 border-slate-200 text-slate-800"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {flag.severity === "danger" && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                {flag.severity === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                {flag.severity === "ok" && <ShieldCheck className="w-5 h-5 text-indigo-600" />}
                {flag.severity === "notice" && <HelpCircle className="w-5 h-5 text-slate-500" />}
              </div>
              <div>
                <h4 className="text-sm font-bold">{flag.title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{flag.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next/Back Action bar */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer"
        >
          Next: Market Analysis
        </button>
      </div>
    </div>
  );
}
