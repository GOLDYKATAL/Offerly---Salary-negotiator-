import React, { useState } from "react";
import { ScreenProps } from "../types";
import { MessageSquare, ThumbsUp, HelpCircle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

export default function NegotiationScriptScreen({ state, nextStep, prevStep }: ScreenProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeObjection, setActiveObjection] = useState<number>(0);

  const recommendedCounter = Math.round(((state.offerSalary || 140000) * 1.12) / 1000) * 1000;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const scripts = {
    opening: `“Thank you so much for putting this together, and please pass along my appreciation to the interview panel! I’m incredibly excited about the work ${state.offerCompany || "the company"} is doing, and I’m confident I can make an immediate impact on your upcoming goals. Based on my technical background and standard market ranges for this location, I was hoping we could align closer to $${recommendedCounter.toLocaleString()} on the base salary. If we can make that work, I'm ready to wrap up other active conversations and sign the offer letter today.”`,
    
    closing: `“Again, I’m deeply enthusiastic about joining. If we can adjust the base to $${recommendedCounter.toLocaleString()}, or bridge that difference with a structured $15,000 sign-on bonus, I am 100% committed to accepting. What do you think is possible to help close that gap?”`,
    
    objections: [
      {
        title: "“We are at the absolute limit of our approved budget band.”",
        script: `“I completely understand that teams operate under strict budget allocations. Since cash base is tight, could we look at a combination of stock options or a structured 6-month review? If we write in a 10% performance review into the contract for 6 months out, that gives me a chance to demonstrate my impact first.”`
      },
      {
        title: "“Our internal equity won't allow us to offer that base to candidates at this level.”",
        script: `“I respect your dedication to internal fairness and parity. Since we can't alter the core base level, could we explore a one-time sign-on bonus of $20,000 to offset the difference for this initial year? That allows you to keep the internal base aligned while helping me transition cleanly.”`
      },
      {
        title: "“We have other competitive candidates who are ready to accept today.”",
        script: `“I'm not surprised—it’s a phenomenal role and a world-class team. What separates me is my direct experience scaling distributed architectures without needing ramp-up time. I want to make this easy for you: if we can meet at $${recommendedCounter.toLocaleString()}, you can cancel those loops today because I am ready to accept.”`
      }
    ]
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="negotiation-script-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Verbal Negotiation Scripts</h2>
        <p className="text-slate-500 mt-2">
          Use these proven verbal scripts during your phone or video negotiation conversations. Speak them calmly, confidently, and with enthusiasm.
        </p>
      </div>

      {/* Opening statement panel */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-6 text-left relative">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-extrabold">1. The Opening Pitch</span>
          <button 
            type="button"
            onClick={() => handleCopy(scripts.opening, "opening")}
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
          >
            {copiedSection === "opening" ? <Check className="w-4 h-4 text-indigo-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm font-semibold text-slate-700 italic leading-relaxed">
          {scripts.opening}
        </p>
        <span className="block text-[10px] text-slate-400 mt-3 font-mono font-medium">🎯 Goal: Reiterate strong excitement while setting a firm, market-backed anchor value.</span>
      </div>

      {/* Accordion Objection Handlers */}
      <div className="mb-6">
        <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3 text-left">2. Recruiter Objection Handlers</span>
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-left bg-white shadow-xs">
          {scripts.objections.map((obj, i) => {
            const isOpen = activeObjection === i;
            return (
              <div key={i} className="border-b border-slate-200 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setActiveObjection(i)}
                  className="w-full flex justify-between items-center px-5 py-4 hover:bg-slate-50/50 transition-colors text-left font-bold text-slate-800 text-sm cursor-pointer"
                >
                  <span>{obj.title}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 bg-slate-50/30">
                    <p className="text-sm font-semibold italic text-slate-600 border-l-4 border-indigo-600 pl-4 py-1 leading-relaxed">
                      {obj.script}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleCopy(obj.script, `obj-${i}`)}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 font-bold cursor-pointer"
                      >
                        {copiedSection === `obj-${i}` ? (
                          <>
                            <Check className="w-3 h-3 text-indigo-600" /> Copied Script
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Objection Script
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing Statement */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 text-left relative">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-700 font-extrabold">3. The Trial Close</span>
          <button 
            type="button"
            onClick={() => handleCopy(scripts.closing, "closing")}
            className="text-slate-400 hover:text-indigo-600 transition-colors p-1 font-bold"
          >
            {copiedSection === "closing" ? <Check className="w-4 h-4 text-indigo-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-sm font-semibold text-slate-700 italic leading-relaxed">
          {scripts.closing}
        </p>
        <span className="block text-[10px] text-slate-400 mt-3 font-mono font-medium">🎯 Goal: Offer alternative negotiation levers (sign-on bonus/equity) if base salary has zero budget flexibility.</span>
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
          Next: Practice Chat
        </button>
      </div>
    </div>
  );
}
