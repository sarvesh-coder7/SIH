import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserRound,
  Landmark,
  GraduationCap,
  Building2,
  UsersRound,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ChevronDown,
  Sparkles,
  Lightbulb,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-[#fbf8ee] text-slate-800 selection:bg-amber-500 selection:text-white flex flex-col">
      {/* 2. SIMPLE HEADER */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-amber-200/60 bg-white/50 backdrop-blur-md sticky top-0 z-50">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('role-selection')}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={() => setCurrentView('login')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-xl transition-colors"
          >
            + Report a Problem
          </button>
        </div>
      </header>

      {/* 4. HERO */}
      <div className="w-full max-w-3xl mx-auto pt-4 pb-3 px-6 text-center space-y-1.5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0d5c3a] tracking-tight">
          About JH Innovation Connect
        </h1>
        <h2 className="text-lg sm:text-xl font-serif-display text-amber-800 font-bold italic">
          Where Jharkhand's Challenges Meet Innovation
        </h2>
        <p className="text-sm sm:text-base text-slate-700 font-medium max-w-xl mx-auto leading-relaxed">
          “A platform that connects community problems with the people, expertise and resources needed to create solutions.”
        </p>
      </div>

      {/* 5. MAIN PURPOSE */}
      <div className="text-center mb-4 space-y-1">
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
          From Problem to Solution
        </h3>
        <p className="text-sm text-slate-600 font-medium italic">
          “One connected journey from a citizen-reported problem to a real-world solution.”
        </p>
      </div>

      {/* 6. & 7. PRIMARY FLOW (VISUAL STRUCTURE) */}
      <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto pb-4 px-4">

        {/* CITIZEN */}
        <div className="w-full sm:w-[300px] bg-white border border-amber-200 rounded-xl py-3 px-4 shadow-sm text-center flex flex-col items-center gap-1.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
            <UserRound className="w-5 h-5" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">Citizen</h4>
          <span className="font-extrabold text-amber-600 text-xs sm:text-sm">REPORTS</span>
          <p className="text-xs text-slate-600 font-medium leading-tight">
            “Identifies and reports a local problem.”
          </p>
        </div>

        <div className="h-5 w-[1px] bg-slate-300 relative">
          <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* GOVERNMENT */}
        <div className="w-full sm:w-[300px] bg-white border border-emerald-200 rounded-xl py-3 px-4 shadow-sm text-center flex flex-col items-center gap-1.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">Government</h4>
          <span className="font-extrabold text-emerald-600 text-xs sm:text-sm">VERIFIES</span>
          <p className="text-xs text-slate-600 font-medium leading-tight">
            “Reviews and validates the problem.”
          </p>
        </div>

        {/* Branching */}
        <div className="relative w-full max-w-[500px] h-6 flex justify-center">
          {/* Mobile vertical line */}
          <div className="sm:hidden absolute top-0 w-[1px] h-full bg-slate-300">
            <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
          </div>

          {/* Desktop branching */}
          <div className="hidden sm:flex w-full absolute inset-0">
            {/* Top short vertical drop from Government */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-slate-300"></div>
            
            <div className="flex w-full">
              {/* Left Side (University) */}
              <div className="flex-1 flex justify-center relative">
                {/* Horizontal line from center to right edge */}
                <div className="absolute top-2 left-1/2 right-0 h-[1px] bg-slate-300"></div>
                {/* Vertical drop to University */}
                <div className="absolute top-2 w-[1px] h-4 bg-slate-300">
                  <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
              
              {/* Gap (gap-6 = 24px) */}
              <div className="w-6 relative">
                {/* Horizontal line across the gap */}
                <div className="absolute top-2 left-0 right-0 h-[1px] bg-slate-300"></div>
              </div>
              
              {/* Right Side (Industry) */}
              <div className="flex-1 flex justify-center relative">
                {/* Horizontal line from left edge to center */}
                <div className="absolute top-2 left-0 right-1/2 h-[1px] bg-slate-300"></div>
                {/* Vertical drop to Industry */}
                <div className="absolute top-2 w-[1px] h-4 bg-slate-300">
                  <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UNIVERSITY & INDUSTRY */}
        <div className="w-full max-w-[500px] flex flex-col sm:flex-row items-stretch justify-center gap-6 relative z-10">
          {/* UNIVERSITY */}
          <div className="flex-1 bg-white border border-blue-200 rounded-xl py-3 px-4 shadow-sm text-center flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide">University</h4>
            <span className="font-extrabold text-blue-600 text-[11px] sm:text-xs">RESEARCH & DEVELOP</span>
            <p className="text-xs text-slate-600 font-medium leading-tight">
              “Brings academic and technical expertise.”
            </p>
          </div>

          <div className="sm:hidden flex justify-center py-1">
            <div className="w-[1px] h-4 bg-slate-300 relative">
              <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* INDUSTRY */}
          <div className="flex-1 bg-white border border-purple-200 rounded-xl py-3 px-4 shadow-sm text-center flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide">Industry</h4>
            <span className="font-extrabold text-purple-600 text-[11px] sm:text-xs">SUPPORT & SCALE</span>
            <p className="text-xs text-slate-600 font-medium leading-tight">
              “Provides resources and implementation support.”
            </p>
          </div>
        </div>

        {/* Merge */}
        <div className="relative w-full max-w-[500px] h-6 flex justify-center">
          {/* Mobile vertical line */}
          <div className="sm:hidden absolute top-0 w-[1px] h-full bg-slate-300">
            <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
          </div>

          {/* Desktop merging */}
          <div className="hidden sm:flex w-full absolute inset-0">
            <div className="flex w-full">
              {/* Left Side (University) */}
              <div className="flex-1 flex justify-center relative">
                {/* Vertical drop from University */}
                <div className="absolute top-0 w-[1px] h-4 bg-slate-300"></div>
                {/* Horizontal line from center to right edge */}
                <div className="absolute top-4 left-1/2 right-0 h-[1px] bg-slate-300"></div>
              </div>
              
              {/* Gap (gap-6 = 24px) */}
              <div className="w-6 relative">
                {/* Horizontal line across the gap */}
                <div className="absolute top-4 left-0 right-0 h-[1px] bg-slate-300"></div>
              </div>
              
              {/* Right Side (Industry) */}
              <div className="flex-1 flex justify-center relative">
                {/* Vertical drop from Industry */}
                <div className="absolute top-0 w-[1px] h-4 bg-slate-300"></div>
                {/* Horizontal line from left edge to center */}
                <div className="absolute top-4 left-0 right-1/2 h-[1px] bg-slate-300"></div>
              </div>
            </div>

            {/* Bottom short vertical drop to Collaboration */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-2 bg-slate-300">
              <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* COLLABORATION */}
        <div className="w-full sm:w-[300px] bg-white border border-slate-300 rounded-xl py-3 px-4 shadow-sm text-center flex flex-col items-center gap-1.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
            <UsersRound className="w-5 h-5" />
          </div>
          <h4 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">Collaboration</h4>
          <span className="font-extrabold text-slate-600 text-xs sm:text-sm">WORK TOGETHER</span>
          <p className="text-xs text-slate-600 font-medium leading-tight">
            “Partners work together to build the solution.”
          </p>
        </div>

        <div className="h-5 w-[1px] bg-slate-300 relative">
          <ChevronDown className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 text-slate-400" />
        </div>

        {/* PROBLEM -> SOLUTION */}
        <div className="w-full sm:w-[340px] bg-[#0d5c3a] border border-[#09422a] rounded-xl py-4 px-5 shadow-md text-center flex flex-col items-center gap-1.5 relative z-10">
          <div className="w-10 h-10 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold text-white uppercase tracking-wide">Problem → Solution</h4>
          <span className="font-extrabold text-amber-400 text-xs sm:text-sm">REAL IMPACT</span>
          <p className="text-xs text-emerald-100 font-medium leading-tight">
            “Solutions are tested and moved toward implementation.”
          </p>
        </div>
      </div>

      {/* 9. ADD A SIMPLE EXAMPLE */}
      <div className="w-full max-w-2xl mx-auto mt-12 mb-10 px-6">
        <h2 className="text-center text-xl font-bold text-slate-900 mb-6">For Example</h2>
        <div className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
            <span className="w-32 font-bold text-amber-700 text-sm shrink-0">Community Problem</span>
            <span className="hidden sm:inline text-slate-300">→</span>
            <span className="text-sm text-slate-700">“Water supply issue in a local community”</span>
          </div>
          <div className="flex justify-center sm:hidden"><ArrowDown className="w-3 h-3 text-slate-300" /></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
            <span className="w-32 font-bold text-emerald-700 text-sm shrink-0">Government</span>
            <span className="hidden sm:inline text-slate-300">→</span>
            <span className="text-sm text-slate-700">“Problem verified”</span>
          </div>
          <div className="flex justify-center sm:hidden"><ArrowDown className="w-3 h-3 text-slate-300" /></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
            <span className="w-32 font-bold text-blue-700 text-sm shrink-0">University</span>
            <span className="hidden sm:inline text-slate-300">→</span>
            <span className="text-sm text-slate-700">“Students & faculty develop a technical solution”</span>
          </div>
          <div className="flex justify-center text-slate-400 text-xs font-bold my-[-4px] sm:my-[-8px] sm:pl-32">+</div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
            <span className="w-32 font-bold text-purple-700 text-sm shrink-0">Industry</span>
            <span className="hidden sm:inline text-slate-300">→</span>
            <span className="text-sm text-slate-700">“Provides technology / implementation support”</span>
          </div>
          <div className="flex justify-center sm:hidden"><ArrowDown className="w-3 h-3 text-slate-300" /></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left">
            <span className="w-32 font-bold text-slate-600 text-sm shrink-0">Collaboration</span>
            <span className="hidden sm:inline text-slate-300">→</span>
            <span className="text-sm text-slate-700">“Solution is tested”</span>
          </div>
          <div className="flex justify-center sm:hidden"><ArrowDown className="w-3 h-3 text-slate-300" /></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left mt-2 pt-3 border-t border-slate-100">
            <span className="w-32 font-bold text-[#0d5c3a] text-sm shrink-0">Solution</span>
            <span className="hidden sm:inline text-slate-300">→</span>
            <span className="text-sm font-semibold text-slate-900">“Improved water management for the community”</span>
          </div>
        </div>
      </div>

      {/* 10. ONE-LINE PLATFORM MESSAGE */}
      <div className="mt-8 text-center px-4 mb-10">
        <h3 className="text-xl sm:text-2xl font-bold text-[#0d5c3a] mb-3">
          “We don't just collect problems. We connect problems to solutions.”
        </h3>
        <p className="text-sm font-bold text-amber-800 flex flex-wrap justify-center items-center gap-1 sm:gap-2">
          Citizen <ArrowRight className="w-3 h-3 text-slate-400" />
          Government <ArrowRight className="w-3 h-3 text-slate-400" />
          University / Industry <ArrowRight className="w-3 h-3 text-slate-400" />
          Collaboration <ArrowRight className="w-3 h-3 text-slate-400" />
          Solution
        </p>
      </div>

      {/* 11. FINAL CTA */}
      <div className="mt-10 mb-20 text-center flex flex-col items-center">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Have a problem that needs a solution?</h3>
        <button
          onClick={() => setCurrentView('login')}
          className="px-6 py-3 bg-[#0d5c3a] hover:bg-[#0a472d] text-white rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-0.5 flex items-center gap-2"
        >
          Report a Problem
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
