import React from "react";
import { ScreenProps } from "../types";
import { MOCK_COMPANY_HEALTH } from "../data/mockData";
import { Landmark, TrendingUp, AlertOctagon, Sparkles, Building2 } from "lucide-react";

export default function CompanyHealthScreen({ state, nextStep, prevStep }: ScreenProps) {
  const companyName = state.offerCompany || "FinOptima Systems";
  
  // Find or fallback company health profile
  const matched = Object.keys(MOCK_COMPANY_HEALTH).find(
    (key) => key.toLowerCase().includes(companyName.toLowerCase()) || companyName.toLowerCase().includes(key.toLowerCase())
  );
  
  const profile = matched 
    ? MOCK_COMPANY_HEALTH[matched as keyof typeof MOCK_COMPANY_HEALTH] 
    : {
        score: 79,
        risk: "Low-Moderate Risk",
        funding: "Mid-Market Enterprise",
        growth: "+18% headcount YoY",
        cashRunway: "Stable Operating Capital",
        recommendation: `Steady financial footing. Good opportunity to negotiate competitive benefits and regular performance salary adjustments. Focus on showing how your skills directly generate enterprise value.`
      };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="company-health-screen">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-indigo-600 shadow-sm">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Company Health Intelligence</h2>
          <p className="text-slate-500 mt-1">
            Financial analysis & positioning for <strong className="text-slate-800">{companyName}</strong>.
          </p>
        </div>
      </div>

      {/* Main Health Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Score Ring */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Financial Health Score</span>
          <div className="text-5xl font-extrabold text-indigo-600 mt-2 mb-1">{profile.score}</div>
          <span className="text-xs font-mono px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-bold">{profile.risk}</span>
        </div>

        {/* Operating Metrics */}
        <div className="md:col-span-2 border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-[11px] text-slate-400 uppercase font-bold">Funding / Tier</span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{profile.funding}</p>
            </div>
            <div>
              <span className="block text-[11px] text-slate-400 uppercase font-bold">Headcount Trend</span>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{profile.growth}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <span className="block text-[11px] text-slate-400 uppercase font-bold">Cash Runway / Reserves</span>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{profile.cashRunway}</p>
          </div>
        </div>
      </div>

      {/* Recommended Strategy (Coaching Advice) */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" /> Custom Negotiation Bidding Guide
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          {profile.recommendation}
        </p>
      </div>

      {/* Warning/Opportunity Box */}
      <div className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 mb-8">
        {profile.score > 80 ? (
          <>
            <TrendingUp className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong>Growth Opportunity:</strong> High-scoring companies are extremely sensitive to losing key hires to competitors. You have the leverage to request standard signing bonuses to expedite your decision.
            </p>
          </>
        ) : (
          <>
            <AlertOctagon className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong>Risk Warning:</strong> Early-stage or bootstrapped firms have fixed cash ceilings. Shift your ask toward performance-based milestones, work-from-home allowances, and structured 6-month review dates.
            </p>
          </>
        )}
      </div>

      {/* Navigation action bar */}
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
          Next: Similar Jobs
        </button>
      </div>
    </div>
  );
}
