import React, { useState } from "react";
import { ScreenProps } from "../types";
import { ROLE_OPTIONS, LOCATION_OPTIONS, EXPERIENCE_LEVELS } from "../data/mockData";
import { DollarSign, MapPin, Briefcase, Calendar } from "lucide-react";

export default function InputDetailsScreen({ state, updateState, nextStep, prevStep }: ScreenProps) {
  const [role, setRole] = useState(state.role || ROLE_OPTIONS[0]);
  const [location, setLocation] = useState(state.location || LOCATION_OPTIONS[0]);
  const [experience, setExperience] = useState(state.experience || EXPERIENCE_LEVELS[2].value);
  const [expYears, setExpYears] = useState(state.experienceYears || 5);
  const [currentSalary, setCurrentSalary] = useState(state.currentSalary || 120000);
  const [targetSalary, setTargetSalary] = useState(state.targetSalary || 145000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateState({
      role,
      location,
      experience,
      experienceYears: Number(expYears),
      currentSalary: Number(currentSalary),
      targetSalary: Number(targetSalary),
    });
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8" id="input-details-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Career Baseline</h2>
        <p className="text-slate-500 mt-2">
          Help us calibrate the market metrics by inputting your current status and target baseline compensation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-600" /> Target Professional Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            id="input-role"
            required
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Location Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" /> Target Job Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            id="input-location"
            required
          >
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Experience Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" /> Professional Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              id="input-experience-level"
              required
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              Total Years of Experience
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={expYears}
              onChange={(e) => setExpYears(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              id="input-experience-years"
              required
            />
          </div>
        </div>

        {/* Salaries section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-slate-400" /> Current Annual Salary ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                id="input-current-salary"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-indigo-600" /> Desired Target Salary ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-semibold">$</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={targetSalary}
                onChange={(e) => setTargetSalary(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-semibold"
                id="input-target-salary"
                required
              />
            </div>
          </div>
        </div>

        {/* Form controls */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={prevStep}
            className="px-6 py-3 border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
            id="btn-back-to-welcome"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-150 transition-all cursor-pointer"
            id="btn-to-offer-upload"
          >
            Next: Upload Offer
          </button>
        </div>
      </form>
    </div>
  );
}
