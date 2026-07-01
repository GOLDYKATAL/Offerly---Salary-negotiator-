import React from "react";
import { ScreenProps } from "../types";
import { Briefcase, FileSearch, HelpCircle, Trophy } from "lucide-react";

export default function WelcomeScreen({ state, updateState, nextStep }: ScreenProps) {
  const handlePathChange = (path: "full" | "review" | "practice") => {
    updateState({ coachingPath: path });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4 py-8" id="welcome-screen">
      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-3xl shadow-lg p-8 md:p-12 transition-all duration-300">
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <Trophy className="w-4 h-4" /> Professional Career Advancement
        </div>

        {/* Hero Typography */}
        <h1 className="font-sans font-bold text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight mb-2">
          Offerly
        </h1>
        <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6 font-mono">
          Your Salary Negotiation Coach
        </p>
        
        <p className="text-slate-500 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Stop leaving money on the table. Walk away with the compensation package, benefits, and equity options you truly deserve.
        </p>

        {/* Path Selection Radio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left">
          {/* Card 1 */}
          <label 
            className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
              state.coachingPath === "full" 
                ? "border-indigo-600 bg-indigo-50/40 shadow-sm" 
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
            htmlFor="path-full"
          >
            <input 
              type="radio" 
              name="coachingPath" 
              id="path-full" 
              value="full"
              checked={state.coachingPath === "full"}
              onChange={() => handlePathChange("full")}
              className="sr-only"
            />
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl w-10 h-10 flex items-center justify-center mb-4 font-semibold">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm mb-1">Full Curriculum</span>
            <span className="text-xs text-slate-500 leading-normal">
              16-step complete coach from market search to scripts & chat.
            </span>
          </label>

          {/* Card 2 */}
          <label 
            className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
              state.coachingPath === "review" 
                ? "border-indigo-600 bg-indigo-50/40 shadow-sm" 
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
            htmlFor="path-review"
          >
            <input 
              type="radio" 
              name="coachingPath" 
              id="path-review" 
              value="review"
              checked={state.coachingPath === "review"}
              onChange={() => handlePathChange("review")}
              className="sr-only"
            />
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl w-10 h-10 flex items-center justify-center mb-4 font-semibold">
              <FileSearch className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm mb-1">Analyze Offer</span>
            <span className="text-xs text-slate-500 leading-normal">
              Directly upload and run full red-flag analysis on a live offer.
            </span>
          </label>

          {/* Card 3 */}
          <label 
            className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all duration-200 select-none ${
              state.coachingPath === "practice" 
                ? "border-indigo-600 bg-indigo-50/40 shadow-sm" 
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
            htmlFor="path-practice"
          >
            <input 
              type="radio" 
              name="coachingPath" 
              id="path-practice" 
              value="practice"
              checked={state.coachingPath === "practice"}
              onChange={() => handlePathChange("practice")}
              className="sr-only"
            />
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl w-10 h-10 flex items-center justify-center mb-4 font-semibold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-800 text-sm mb-1">Practice Room</span>
            <span className="text-xs text-slate-500 leading-normal">
              Focus strictly on the recruiter simulator & script generation.
            </span>
          </label>
        </div>

        {/* CTA Button */}
        <button
          onClick={nextStep}
          id="btn-lets-go"
          className="w-full md:w-auto inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-indigo-150 transition-all duration-150 cursor-pointer"
        >
          Let's Go
        </button>
      </div>
    </div>
  );
}
