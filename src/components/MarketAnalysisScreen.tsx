import React from "react";
import { ScreenProps } from "../types";
import { DollarSign, Landmark, TrendingUp, Users } from "lucide-react";

export default function MarketAnalysisScreen({ state, nextStep, prevStep }: ScreenProps) {
  // Setup standard base ranges based on Role
  let baseSalary = 135000;
  if (state.role.includes("Software")) baseSalary = 150000;
  else if (state.role.includes("Product")) baseSalary = 140000;
  else if (state.role.includes("Data")) baseSalary = 145000;
  else if (state.role.includes("Director")) baseSalary = 200000;
  else if (state.role.includes("Manager")) baseSalary = 120000;
  else if (state.role.includes("Executive") || state.role.includes("Sales")) baseSalary = 130000;
  else baseSalary = 105000;

  // Calibrate based on years of experience
  const expMultiplier = Math.min(1.5, 0.8 + (state.experienceYears * 0.08));
  const median = Math.round(baseSalary * expMultiplier);
  const p25 = Math.round(median * 0.85);
  const p75 = Math.round(median * 1.15);
  const p90 = Math.round(median * 1.30);

  // Calculate percentage positions for sliders
  const minRange = p25 * 0.8;
  const maxRange = p90 * 1.1;
  const totalRange = maxRange - minRange;

  const getPercent = (val: number) => {
    const pct = ((val - minRange) / totalRange) * 100;
    return Math.max(5, Math.min(95, pct));
  };

  const offerPercent = getPercent(state.offerSalary);
  const targetPercent = getPercent(state.targetSalary);
  const currentPercent = getPercent(state.currentSalary);

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="market-analysis-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Market Intelligence Analysis</h2>
        <p className="text-slate-500 mt-2">
          Calibrated data for a <strong className="text-slate-800">{state.role}</strong> with <strong className="text-slate-800">{state.experienceYears} yrs experience</strong> in <strong className="text-slate-800">{state.location}</strong>.
        </p>
      </div>

      {/* Salary Distribution Visualizer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8 text-center">Market Distribution Percentiles</h3>
        
        {/* The slider axis */}
        <div className="relative pt-12 pb-16">
          {/* Axis line */}
          <div className="h-4 bg-gradient-to-r from-slate-200 via-indigo-500 to-indigo-950 rounded-full" />
          
          {/* Percentile Ticks */}
          <div className="absolute top-24 left-0 w-full flex justify-between px-1 text-[11px] text-slate-500 font-mono">
            <div className="text-left">
              <span className="block font-bold">25th Percentile</span>
              <span>${p25.toLocaleString()}</span>
            </div>
            <div className="text-center">
              <span className="block font-bold">50th (Median)</span>
              <span>${median.toLocaleString()}</span>
            </div>
            <div className="text-center">
              <span className="block font-bold">75th Percentile</span>
              <span>${p75.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="block font-bold">90th Percentile</span>
              <span>${p90.toLocaleString()}</span>
            </div>
          </div>

          {/* User's points indicators floating on the line */}
          {/* Current Salary */}
          <div 
            className="absolute -top-3 flex flex-col items-center -translate-x-1/2 transition-all duration-700"
            style={{ left: `${currentPercent}%` }}
          >
            <span className="bg-slate-400 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm mb-1.5">Current</span>
            <div className="w-5 h-5 bg-slate-400 border-4 border-white rounded-full shadow" />
            <span className="text-xs font-semibold text-slate-500 mt-1">${state.currentSalary.toLocaleString()}</span>
          </div>

          {/* Offered Salary */}
          <div 
            className="absolute -top-3 flex flex-col items-center -translate-x-1/2 transition-all duration-700"
            style={{ left: `${offerPercent}%` }}
          >
            <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm mb-1.5 animate-bounce">Offered</span>
            <div className="w-5 h-5 bg-indigo-600 border-4 border-white rounded-full shadow" />
            <span className="text-xs font-extrabold text-indigo-700 mt-1">${state.offerSalary.toLocaleString()}</span>
          </div>

          {/* Target Salary */}
          <div 
            className="absolute -top-3 flex flex-col items-center -translate-x-1/2 transition-all duration-700"
            style={{ left: `${targetPercent}%` }}
          >
            <span className="bg-sky-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-sm mb-1.5">Target</span>
            <div className="w-5 h-5 bg-sky-600 border-4 border-white rounded-full shadow" />
            <span className="text-xs font-extrabold text-sky-700 mt-1">${state.targetSalary.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Market Assessment Bullets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Your Target Position</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your target of <span className="font-bold text-indigo-700">${state.targetSalary.toLocaleString()}</span> lies at the <strong className="text-slate-700">
                {state.targetSalary > p75 ? "90th" : state.targetSalary > median ? "75th" : "50th"} percentile
              </strong> of the verified compensation curve. This is an achievable, assertive ask.
            </p>
          </div>
        </div>

        <div className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="p-2.5 bg-sky-50 text-sky-700 rounded-lg shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Candidate Leverage</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Our market survey shows that {state.experienceYears >= 5 ? "85%" : "60%"} of recruiters have extra budget reserves up to 12% above initial offer ranges for candidates demonstrating specialized technical skills.
            </p>
          </div>
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
          Next: Market Timing
        </button>
      </div>
    </div>
  );
}
