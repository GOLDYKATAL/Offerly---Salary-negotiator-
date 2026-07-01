import React from "react";
import { ScreenProps } from "../types";
import { Flame, Clock, BarChart3, AlertCircle } from "lucide-react";

export default function MarketTimingScreen({ state, nextStep, prevStep }: ScreenProps) {
  // Let's create an elegant seasonal roadmap with active monthly budget cycles
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  
  // Power Score calculation
  const basePower = 65;
  const expBonus = Math.min(20, state.experienceYears * 2);
  const locationBonus = state.location.includes("High") ? 10 : 5;
  const powerScore = Math.min(95, basePower + expBonus + locationBonus);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="market-timing-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Market Timing & Leverage</h2>
        <p className="text-slate-500 mt-2">
          Macroeconomics and seasonal hiring curves determine how hard you can push. Analyze your leverage today.
        </p>
      </div>

      {/* Candidate Power Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl" />
          
          <div>
            <Flame className="w-8 h-8 text-indigo-400 mb-4" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Your Power Score</span>
            <div className="text-4xl font-extrabold text-indigo-400 mt-1">{powerScore} <span className="text-lg text-slate-300 font-normal">/100</span></div>
          </div>
          <p className="text-xs text-slate-300 mt-4 leading-relaxed">
            {powerScore > 80 
              ? "Exceptional leverage. Recruiter is highly motivated to close you fast. Push for top percentiles." 
              : "Healthy leverage. Stand firm on your core requirements with standard structured counter offers."}
          </p>
        </div>

        {/* Seasonal Budget cycles info */}
        <div className="md:col-span-2 border border-slate-200 bg-slate-50 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Seasonal Budget Cycles ({currentMonth})</span>
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Q1</span>
                <span className="text-xs text-slate-700 font-semibold">Budget Flush</span>
                <span className="block w-2 h-2 mx-auto bg-indigo-500 rounded-full mt-1.5" />
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Q2</span>
                <span className="text-xs text-slate-700 font-semibold">Active Hiring</span>
                <span className="block w-2 h-2 mx-auto bg-indigo-500 rounded-full mt-1.5" />
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg border-2 border-indigo-500 shadow-sm relative">
                <span className="absolute -top-1.5 right-1 px-1 bg-indigo-600 text-[8px] text-white font-extrabold rounded">Active</span>
                <span className="block text-[10px] font-bold text-indigo-700 uppercase">Q3</span>
                <span className="text-xs text-indigo-950 font-bold">Mid-Year Review</span>
                <span className="block w-2 h-2 mx-auto bg-amber-400 rounded-full mt-1.5" />
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Q4</span>
                <span className="text-xs text-slate-700 font-semibold">Eoy Freeze</span>
                <span className="block w-2 h-2 mx-auto bg-rose-400 rounded-full mt-1.5" />
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-4 pt-3 border-t border-slate-200">
            <Clock className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-normal">
              <strong>Takeaway:</strong> We are currently in the prime Q3 cycle. Companies have headcount targets to hit before end-of-year freezes. Use this speed-of-hire requirement as leverage to close compensation gaps.
            </p>
          </div>
        </div>
      </div>

      {/* Demand and Trend indicators */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-indigo-600" /> Talent Market Signals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-800">Job Board Posting Vol</span>
              <span className="text-xs font-semibold text-indigo-600 font-mono">+14.2% MoM</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[82%]" />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium">
              New listings for <strong className="text-slate-700">{state.role}</strong> are expanding, meaning company needs are immediate.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-800">Employer Supply Crunch</span>
              <span className="text-xs font-semibold text-indigo-600 font-mono font-bold">High Need</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-[76%]" />
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-medium">
              Qualified candidates in <strong className="text-slate-700">{state.location.split(" (")[0]}</strong> remain scarce, increasing your bidding premium.
            </p>
          </div>
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
          Next: Company Health
        </button>
      </div>
    </div>
  );
}
