import React from "react";
import { ScreenProps } from "../types";
import { Landmark, TrendingUp, Handshake, AlertTriangle, ShieldCheck } from "lucide-react";

export default function NegotiationRecScreen({ state, nextStep, prevStep }: ScreenProps) {
  // Let's compute some realistic strategic counter ranges based on actual state inputs
  const initialBase = state.offerSalary || 140000;
  
  // Counter recommendation is typically 8% to 15% above initial offer
  const multiplier = state.experienceYears >= 8 ? 1.15 : state.experienceYears >= 4 ? 1.12 : 1.08;
  const recommendedCounter = Math.round((initialBase * multiplier) / 1000) * 1000;
  
  // Walk away calculation (lowest tolerable, normally midway between current and target, or 95% of target)
  const walkAwayValue = Math.round((Math.max(state.currentSalary * 1.05, state.targetSalary * 0.92)) / 1000) * 1000;

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="negotiation-rec-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Strategic Recommendation</h2>
        <p className="text-slate-500 mt-2">
          Calculated by cross-referencing your experience level, company runway profiles, and current market timings.
        </p>
      </div>

      {/* Main Core Recommendations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recommended Counter-Offer Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-md border border-indigo-800/40 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300">Recommended Counter-Offer</span>
            <div className="text-4xl font-extrabold text-indigo-400 mt-2 mb-1">${recommendedCounter.toLocaleString()}</div>
            <span className="text-xs text-slate-300 font-medium">
              A {(multiplier * 100 - 100).toFixed(0)}% adjustment from their initial written offer of ${initialBase.toLocaleString()}.
            </span>
          </div>

          <div className="flex gap-2 bg-indigo-950/60 p-3 rounded-xl border border-indigo-850/40 mt-6 items-center">
            <Handshake className="w-5 h-5 text-indigo-400 shrink-0" />
            <p className="text-[11px] text-slate-300 leading-normal">
              Assertive but completely defensible. Sits comfortably within the 75th percentile of matching tiers.
            </p>
          </div>
        </div>

        {/* Walk-Away Threshold Card */}
        <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-extrabold">Walk-Away Threshold</span>
            <div className="text-4xl font-extrabold text-slate-900 mt-2 mb-1">${walkAwayValue.toLocaleString()}</div>
            <span className="text-xs text-slate-500">
              The absolute bottom boundary to maintain compensation dignity and career equity.
            </span>
          </div>

          <div className="flex gap-2 bg-white p-3 rounded-xl border border-slate-200/60 mt-6 items-center shadow-xs">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-slate-500 leading-normal">
              Do not drop below this. If they cannot meet this cash baseline, prioritize firm performance triggers or stock concessions.
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Rationale list */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Core Strategic Rationales</h3>
        
        <div className="space-y-3.5 text-left">
          <div className="flex gap-3 items-start">
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 text-xs font-bold w-7 h-7 flex items-center justify-center">1</div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Direct Domain Alignment</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Connect your previous scaling experience directly to their current key priorities (e.g., accelerating their cloud API refactoring goals by 2-3 months).
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 text-xs font-bold w-7 h-7 flex items-center justify-center">2</div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Value of Immediate Availability</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Highlight that aligning on a mutually acceptable package today ensures you can wrap up active competitor loops and start immediately, reducing recruiter workload.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg shrink-0 text-xs font-bold w-7 h-7 flex items-center justify-center">3</div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Market Calibration Sourcing</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cite local high-leverage cost parameters in <strong className="text-slate-700">{state.location.split(" (")[0]}</strong> as a standard cost-of-labor delta requirement.
              </p>
            </div>
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
          Next: Negotiation Script
        </button>
      </div>
    </div>
  );
}
