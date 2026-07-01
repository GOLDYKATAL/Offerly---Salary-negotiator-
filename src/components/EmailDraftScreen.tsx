import React, { useState, useEffect } from "react";
import { ScreenProps } from "../types";
import { Copy, Check, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

export default function EmailDraftScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  const [tone, setTone] = useState<"confident" | "collaborative" | "firm">(state.emailTone || "collaborative");
  const [emailText, setEmailText] = useState("");
  const [copied, setCopied] = useState(false);

  const initialBase = state.offerSalary || 140000;
  const recommendedCounter = Math.round((initialBase * 1.12) / 1000) * 1000;

  // Generate Email template based on selected Tone
  const generateEmail = (selectedTone: "confident" | "collaborative" | "firm") => {
    const company = state.offerCompany || "FinOptima Systems";
    const role = state.role || "Senior Software Engineer";
    
    let body = "";
    if (selectedTone === "collaborative") {
      body = `Subject: Excited to Join ${company} - Discussion on Offer Details

Hi Brenda,

Thank you so much for extending the offer to join ${company} as a ${role}! I am incredibly excited about the prospect of working together to scale your key systems.

I’ve reviewed the compensation summary and details. Based on my ${state.experienceYears} years of technical experience in similar scaling environments and my deep research into local market bands, I was hoping we could meet at $${recommendedCounter.toLocaleString()} on the annual base salary. 

If we can align on this base compensation, I am fully prepared to accept immediately and sign the written offer letter today so we can kick off my onboarding.

Could you let me know if this adjustment is possible to align closer with market ranges?

Warmly,
[Your Name]`;
    } else if (selectedTone === "confident") {
      body = `Subject: Professional Offer Consideration - ${role} - [Your Name]

Hi Brenda,

I want to extend my sincere gratitude for the official offer of employment at ${company} for the ${role} position. The conversations with the executive and engineering teams have reinforced my excitement for your upcoming project timelines.

To ensure my compensation package reflects the high immediate value and technical scaling practices I will bring to the team, I would like to suggest an adjustment to the starting base salary to $${recommendedCounter.toLocaleString()}. 

This target is fully calibrated to industry standards for Senior Engineers with my background in high-availability systems.

If we can finalize this base adjustment, I will withdraw from all other active candidate interview pipelines and commit to joining your team. Let me know what your team's budget looks like for this update!

Best regards,
[Your Name]`;
    } else { // firm
      body = `Subject: Offer Follow-up: ${role} - [Your Name]

Hi Brenda,

Thank you for putting together the written offer details for the ${role} opening. I am very enthusiastic about the work ahead and the chance to contribute to ${company}.

Before I can officially commit to signing the offer letter, we need to address a gap in the base salary. Based on standard market compensation benchmarks for ${state.location.split(" (")[0]} and my specialized background, I am requesting a base salary of $${recommendedCounter.toLocaleString()}. 

I believe this represents a fair valuation of the quick-turnaround distributed scaling expertise I will bring to your immediate roadmap.

If we can align on this target, or bridge the gap with a one-time sign-on bonus of $20,000, I am ready to finalize my paperwork today. Let's schedule a brief call if you need to align with the hiring manager first.

Sincerely,
[Your Name]`;
    }
    
    setEmailText(body);
  };

  // Run on mount or when tone/inputs change
  useEffect(() => {
    generateEmail(tone);
  }, [tone, state.offerCompany, state.role, state.offerSalary]);

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToneChange = (newTone: "confident" | "collaborative" | "firm") => {
    setTone(newTone);
    updateState({ emailTone: newTone });
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="email-draft-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Counter-Offer Email Draft</h2>
          <p className="text-slate-500 mt-2">
            Select a writing tone, review the generated letter, tweak any sentences directly inside the editor, and click copy.
          </p>
        </div>
      </div>

      {/* Tone selection buttons */}
      <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mb-6">
        <button
          type="button"
          onClick={() => handleToneChange("collaborative")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            tone === "collaborative" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Collaborative
        </button>
        <button
          type="button"
          onClick={() => handleToneChange("confident")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            tone === "confident" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Confident
        </button>
        <button
          type="button"
          onClick={() => handleToneChange("firm")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            tone === "firm" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Firm / Direct
        </button>
      </div>

      {/* Email Editor area */}
      <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs text-left mb-6 relative">
        {/* Editor controls */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-indigo-400" />
            <span className="text-[10px] text-slate-400 font-mono font-bold ml-2">Email Composer (Editable)</span>
          </div>
          
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-600 shadow-xs transition-all cursor-pointer hover:text-indigo-600"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-600" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Email
              </>
            )}
          </button>
        </div>

        {/* Text Area */}
        <textarea
          rows={14}
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          className="w-full px-6 py-5 focus:outline-none text-slate-700 text-sm font-semibold font-sans leading-relaxed select-all"
        />
      </div>

      {/* Quick advice box */}
      <div className="flex gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 mb-8">
        <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-left font-medium">
          <strong>Strategic Checklist before sending:</strong> Triple-check the spelled target values. Keep the tone completely professional—negotiating by email should always end with a confirmation of your enthusiasm to join the organization.
        </p>
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
          onClick={() => {
            updateState({ customEmailText: emailText });
            nextStep();
          }}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer"
        >
          Next: Live Q&A
        </button>
      </div>
    </div>
  );
}
