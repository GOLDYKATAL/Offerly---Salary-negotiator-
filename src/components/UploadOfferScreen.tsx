import React, { useState } from "react";
import { ScreenProps } from "../types";
import { Upload, FileText, Sparkles } from "lucide-react";

export default function UploadOfferScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  const [offerCompany, setOfferCompany] = useState(state.offerCompany || "FinOptima Systems");
  const [offerSalary, setOfferSalary] = useState(state.offerSalary || 140000);
  const [offerEquity, setOfferEquity] = useState(state.offerEquity || "0.05% options (4yr vest)");
  const [offerBonus, setOfferBonus] = useState(state.offerBonus || "10% annual performance");
  const [offerText, setOfferText] = useState(state.offerText || "");
  const [dragActive, setDragActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setOfferCompany("FinOptima Systems");
      setOfferSalary(150000);
      setOfferEquity("0.08% options with 1-year cliff");
      setOfferBonus("$15,000 sign-on + 10% annual bonus");
      setOfferText(`OFFER OF EMPLOYMENT - FINOPTIMA SYSTEMS
Dear Candidate,
We are excited to offer you the position of Senior Software Engineer.
Your starting base salary will be $150,000 per annum, paid bi-weekly.
You will be granted stock options equivalent to 0.08% of the company, vesting over 4 years.
Additionally, you will receive a $15,000 one-time sign-on bonus, subject to standard withholdings.
We look forward to having you on our hybrid Austin team!`);
      setIsSimulating(false);
    }, 800);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSimulate();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateState({
      offerCompany,
      offerSalary: Number(offerSalary),
      offerEquity,
      offerBonus,
      offerText: offerText || `Base Offer of $${Number(offerSalary).toLocaleString()} at ${offerCompany}`
    });
    nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="upload-offer-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Upload or Paste Your Offer</h2>
          <p className="text-slate-500 mt-2">
            Enter the details of your official written offer so we can cross-reference it with market data and flag key risks.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSimulate}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-indigo-200 hover:border-indigo-300 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
          {isSimulating ? "Parsing..." : "Simulate Live PDF Offer"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag and Drop Simulator */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
            dragActive 
              ? "border-indigo-600 bg-indigo-50/20 scale-[1.01]" 
              : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          <Upload className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-slate-700 font-semibold text-sm">Drag and drop your offer PDF or doc here</p>
          <p className="text-xs text-slate-400 mt-1">Files remain local and secure inside browser storage</p>
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">or</span>
          </div>
          <button
            type="button"
            onClick={handleSimulate}
            className="mt-3 text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
          >
            Select file from device
          </button>
        </div>

        {/* Structured Offer Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
            <input
              type="text"
              value={offerCompany}
              onChange={(e) => setOfferCompany(e.target.value)}
              placeholder="e.g. FinOptima Systems"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Offered Base Salary ($/yr)</label>
            <input
              type="number"
              value={offerSalary}
              onChange={(e) => setOfferSalary(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Offered Equity Options</label>
            <input
              type="text"
              value={offerEquity}
              onChange={(e) => setOfferEquity(e.target.value)}
              placeholder="e.g. 10,000 ISO shares (4yr vesting)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Offered Bonus Structure</label>
            <input
              type="text"
              value={offerBonus}
              onChange={(e) => setOfferBonus(e.target.value)}
              placeholder="e.g. 10% annual target or $10k signing"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
            />
          </div>
        </div>

        {/* Text Area for copy paste */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-600" /> Full Offer Copy/Paste Details
          </label>
          <textarea
            rows={5}
            value={offerText}
            onChange={(e) => setOfferText(e.target.value)}
            placeholder="Paste your full email, compensation breakdown, or terms sheet here to identify hidden red flags..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-mono"
          />
        </div>

        {/* Back and Next Controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-150 transition-all cursor-pointer"
          >
            Next: Offer Analysis Results
          </button>
        </div>
      </form>
    </div>
  );
}
