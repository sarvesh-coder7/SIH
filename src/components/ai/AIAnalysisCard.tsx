import React from 'react';
import { AIAnalysis } from '../../types';
import {
  Sparkles,
  AlertTriangle,
  Layers,
  GraduationCap,
  CopyCheck,
  CheckCircle2,
  Info,
  Building2,
  TrendingUp,
  Cpu,
  Brain,
} from 'lucide-react';

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
  compact?: boolean;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ analysis, compact = false }) => {
  const getPriorityBadge = (score: number, urgency: string) => {
    if (score >= 90 || urgency === 'Critical') {
      return {
        bg: 'bg-rose-50 border-rose-200 text-rose-800',
        bar: 'bg-rose-500',
        label: 'Critical Priority',
      };
    }
    if (score >= 80 || urgency === 'High') {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        bar: 'bg-amber-500',
        label: 'High Priority',
      };
    }
    return {
      bg: 'bg-blue-50 border-blue-200 text-blue-800',
      bar: 'bg-blue-500',
      label: 'Medium Priority',
    };
  };

  const priorityMeta = getPriorityBadge(analysis.priorityScore, analysis.priority);

  return (
    <div className="bg-[#fbf8ee] text-slate-900 rounded-2xl p-5 border border-[#e2d6bc] shadow-xs relative overflow-hidden">
      {/* Subtle background circuit watermark */}
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
        <Cpu className="w-64 h-64 text-emerald-800" />
      </div>

      {/* Header with Prototype Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e2d6bc] pb-3.5 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-slate-900 tracking-tight">
                AI Problem Triage & University Recommendation
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                AI-generated analysis (prototype)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Confidence Score: {(analysis.confidenceScore * 100).toFixed(0)}% &bull; NLP Semantic Triage Pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Priority Score</span>
            <span className="text-base font-black text-amber-600 leading-none">
              {analysis.priorityScore}<span className="text-xs text-slate-500 font-normal">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 4 Core AI Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* 1. Categorization & Reasoning */}
        <div className="p-3.5 rounded-xl bg-white border border-[#e2d6bc] space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              1. Automated Categorization
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
              {analysis.category}
            </span>
          </div>
          <div>
            <div className="text-[11px] text-slate-800 font-medium">{analysis.subCategory}</div>
            <p className="text-slate-600 text-[11px] mt-1 leading-relaxed bg-[#fbf8ee] p-2.5 rounded-lg border border-[#e2d6bc] italic">
              &ldquo;{analysis.reasoning}&rdquo;
            </p>
          </div>
        </div>

        {/* 2. Priority Scoring & Duplicate Detection */}
        <div className="p-3.5 rounded-xl bg-white border border-[#e2d6bc] space-y-3 shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                2. Societal Impact Priority Index
              </span>
              <span className="font-bold text-amber-800 text-xs">{analysis.priority} Urgency</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
              <div
                className={`h-full ${priorityMeta.bar} transition-all duration-700`}
                style={{ width: `${analysis.priorityScore}%` }}
              ></div>
            </div>
          </div>

          {/* Duplicate Detection */}
          <div className="pt-2 border-t border-[#e2d6bc]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <CopyCheck className="w-3.5 h-3.5 text-blue-600" />
                3. Semantic Duplicate Detection
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                {analysis.similarChallengesCount} Similar Problems Detected
              </span>
            </div>
            <p className="text-slate-600 text-[11px] mt-1">
              Cross-referenced with Palamu & Latehar blocks. Recommends clustering research resources to maximize field impact.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Recommended Disciplines & University Matching */}
      <div className="mt-4 pt-3.5 border-t border-[#e2d6bc] space-y-3">
        <div>
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5 mb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
            Recommended Academic Disciplines
          </span>
          <div className="flex flex-wrap gap-1.5">
            {analysis.recommendedDisciplines.map((disc) => (
              <span
                key={disc}
                className="px-2.5 py-1 rounded-md bg-white text-emerald-900 border border-[#e2d6bc] text-[11px] font-medium"
              >
                {disc}
              </span>
            ))}
          </div>
        </div>

        {/* Ranked Recommended Universities */}
        <div>
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center gap-1.5 mb-2">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            4. Recommended Higher Education Institutions (Ranked by Domain Match)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {analysis.recommendedUniversities.map((univ, index) => (
              <div
                key={univ.universityId}
                className="p-3 rounded-xl bg-white border border-[#e2d6bc] flex flex-col justify-between hover:border-emerald-500 transition-colors shadow-2xs"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {index + 1}. {univ.universityName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] shrink-0 border border-emerald-200">
                    {univ.matchScore}% match
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 mt-1 line-clamp-2">{univ.domainExcellence}</p>
                <div className="mt-2 text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{univ.matchingFacultyCount} Matching Faculty Labs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
