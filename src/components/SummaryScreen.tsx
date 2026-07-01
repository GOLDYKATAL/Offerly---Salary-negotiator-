import React from "react";
import { ScreenProps } from "../types";
import { ClipboardList, UserCheck, ShieldCheck, CheckCircle2, DollarSign, Award, FileText } from "lucide-react";

export default function SummaryScreen({ state, nextStep, prevStep }: ScreenProps) {
  const initialBase = state.offerSalary || 140000;
  const recommendedCounter = Math.round((initialBase * 1.12) / 1000) * 1000;
  const walkAwayValue = Math.round((Math.max(state.currentSalary * 1.05, state.targetSalary * 0.92)) / 1000) * 1000;

  const stepsList = [
    "Verify health & medical premiums coverage during 48-hour review window.",
    "Schedule a 10-minute sync call with Brenda to verbalize the counter.",
    "Re-anchor base request at exactly $" + recommendedCounter.toLocaleString() + " using collaborative scripts.",
    "If met with hard base budgets, trigger secondary negotiation options (e.g., $15,000 signing bonus).",
    "Prepare to sign revised written offer sheet within 24 hours of approval."
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="summary-screen">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Completed Negotiation Plan</h2>
        <p className="text-slate-500 mt-2">
          Your comprehensive strategic playbook is finalized. Review the core metrics and action items before initiating.
        </p>
      </div>

      {/* Playbook Executive Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
        {/* Card 1: Your Baseline */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Your Baseline Profile</span>
            <h3 className="font-extrabold text-slate-800 text-base mb-3 leading-tight">{state.role}</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-medium">
                <span className="text-slate-400">Target Location:</span>
                <span className="font-bold text-slate-700">{state.location.split(" (")[0]}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-medium">
                <span className="text-slate-400">Total Experience:</span>
                <span className="font-bold text-slate-700">{state.experienceYears} Years</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Current Salary:</span>
                <span className="font-bold text-slate-700">${state.currentSalary.toLocaleString()}/yr</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <UserCheck className="w-4 h-4 text-indigo-600" /> Profiling completed
          </div>
        </div>

        {/* Card 2: Initial Offer */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest block mb-1">Offered Package</span>
            <h3 className="font-extrabold text-slate-800 text-base mb-3 leading-tight">{state.offerCompany || "FinOptima Systems"}</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-medium">
                <span className="text-slate-400">Offered Base:</span>
                <span className="font-extrabold text-slate-800">${initialBase.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1.5 font-medium">
                <span className="text-slate-400">Equity Grant:</span>
                <span className="font-bold text-slate-700 truncate max-w-[120px]">{state.offerEquity || "None Specified"}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-400">Bonus Structure:</span>
                <span className="font-bold text-slate-700 truncate max-w-[120px]">{state.offerBonus || "None Specified"}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
            <FileText className="w-4 h-4" /> Terms analyzed
          </div>
        </div>

        {/* Card 3: Counter Strategy */}
        <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-[9px] uppercase font-bold text-indigo-800 tracking-widest block mb-1">Counter Targets</span>
            <h3 className="font-extrabold text-indigo-950 text-base mb-3 leading-tight">Recommended Counter</h3>
            
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex justify-between border-b border-indigo-100/50 pb-1.5">
                <span className="text-indigo-800">Target Base:</span>
                <span className="font-extrabold text-indigo-900">${recommendedCounter.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-indigo-100/50 pb-1.5">
                <span className="text-indigo-800">Walk-Away Limit:</span>
                <span className="font-bold text-rose-700">${walkAwayValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-800">Writing Style:</span>
                <span className="font-extrabold text-indigo-900 capitalize">{state.emailTone || "Collaborative"}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-indigo-200/50 flex items-center gap-1.5 text-xs text-indigo-800 font-bold">
            <Award className="w-4 h-4 text-indigo-600" /> Strategy Approved
          </div>
        </div>
      </div>

      {/* Timeline Steps Checklist */}
      <div className="mb-8 text-left">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <ClipboardList className="w-4 h-4 text-slate-500" /> Action Roadmap Checklist
        </h3>

        <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-4">
          {stepsList.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 animate-scale-up" />
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action panel */}
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
          Generate Success Certificate
        </button>
      </div>
    </div>
  );
}
