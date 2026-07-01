import React from "react";
import { ScreenProps } from "../types";
import { MOCK_JOBS } from "../data/mockData";
import { Search, MapPin, DollarSign, ArrowRight, Star } from "lucide-react";

export default function JobSearchResultsScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  // Let's filter or sort jobs to prioritize matching roles
  const filteredJobs = [...MOCK_JOBS].sort((a, b) => {
    const aMatch = a.title.toLowerCase().includes(state.role.toLowerCase());
    const bMatch = b.title.toLowerCase().includes(state.role.toLowerCase());
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });

  const handleSelectJob = (jobId: string) => {
    updateState({ selectedJobId: jobId });
    nextStep(); // Advance directly to Screen 9 (Job Details)
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="job-search-results-screen">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Market Backup Listings</h2>
          <p className="text-slate-500 mt-1">
            Browse similar vacancies for <strong className="text-slate-800">{state.role}</strong> to establish competing offers or alternative leverage points.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium self-start md:self-auto">
          <Search className="w-3.5 h-3.5" /> Showing {filteredJobs.length} matches
        </div>
      </div>

      {/* Grid List */}
      <div className="space-y-4 mb-8">
        {filteredJobs.map((job) => {
          const isSelected = state.selectedJobId === job.id;
          const roleMatch = job.title.toLowerCase().includes(state.role.toLowerCase());
          
          return (
            <div 
              key={job.id}
              onClick={() => handleSelectJob(job.id)}
              className={`p-6 rounded-2xl border transition-all duration-150 cursor-pointer text-left flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isSelected 
                  ? "border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-500/10" 
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-800">{job.title}</h3>
                  {roleMatch && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded-full">
                      <Star className="w-2.5 h-2.5 fill-indigo-600" /> Best Match
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400">
                  <span className="font-semibold text-slate-600">{job.company}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {job.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary Range</span>
                  <span className="text-sm font-extrabold text-indigo-600">${(job.salaryRange.min / 1000).toFixed(0)}k - ${(job.salaryRange.max / 1000).toFixed(0)}k</span>
                </div>
                
                <button
                  type="button"
                  className="p-3 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-600 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
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
            // Pick first matching job as selected if none selected, then next
            if (!state.selectedJobId && filteredJobs.length > 0) {
              updateState({ selectedJobId: filteredJobs[0].id });
            }
            nextStep();
          }}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer"
        >
          Next: Job Details
        </button>
      </div>
    </div>
  );
}
