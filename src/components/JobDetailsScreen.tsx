import React from "react";
import { ScreenProps } from "../types";
import { MOCK_JOBS } from "../data/mockData";
import { MapPin, CheckCircle, Gift, DollarSign, ArrowLeft } from "lucide-react";

export default function JobDetailsScreen({ state, nextStep, prevStep }: ScreenProps) {
  const jobId = state.selectedJobId || MOCK_JOBS[0].id;
  const job = MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="job-details-screen">
      {/* Back to search trigger */}
      <button
        onClick={prevStep}
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-bold mb-6 group cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Back to job list
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{job.title}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
              <span className="font-semibold text-slate-700">{job.company}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Median Target</span>
            <span className="text-xl font-extrabold text-indigo-600 font-mono">${job.salaryRange.median.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Description + Bullets */}
      <div className="space-y-6 mb-8 text-left">
        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Role Overview</h3>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium">{job.description}</p>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Requirements</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-600 leading-normal">
                <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="font-medium">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Perks & Benefits */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-indigo-600" /> Compensation Extras & Benefits
          </h3>
          <ul className="space-y-2.5">
            {job.benefits.map((benefit, i) => (
              <li key={i} className="flex gap-3 text-xs text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-200 leading-relaxed font-medium">
                <div className="text-indigo-600 mt-0.5 font-bold">•</div>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
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
          Next: Recommendation
        </button>
      </div>
    </div>
  );
}
