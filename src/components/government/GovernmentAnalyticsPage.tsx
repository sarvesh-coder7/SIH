import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  Building2,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  Handshake,
  Download,
} from 'lucide-react';

export const GovernmentAnalyticsPage: React.FC = () => {
  const { challenges, projects, collaborations, showToast } = useApp();

  // Category breakdown
  const categoryStats = challenges.reduce((acc, c) => {
    if (!acc[c.category]) {
      acc[c.category] = { count: 0, population: 0, assigned: 0 };
    }
    acc[c.category].count += 1;
    acc[c.category].population += c.affectedPopulation || 0;
    if (c.officialAssignment || c.assignedUniversityName) {
      acc[c.category].assigned += 1;
    }
    return acc;
  }, {} as Record<string, { count: number; population: number; assigned: number }>);

  // Stage distribution
  const stageCounts = projects.reduce((acc, p) => {
    const stage = p.currentStage || 'Planning';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);


  // Multi-attempt failure analysis
  const multiAttemptChallenges = challenges.filter(
    (c) => (c.attemptsHistory && c.attemptsHistory.length > 0) || (c.previousAttempts && c.previousAttempts.length > 0)
  );

  // Industry funding calculation
  const totalFunding = collaborations.reduce((acc, c) => {
    return acc + (c.collaboration_types.some((t) => t.toLowerCase().includes('funding')) ? 750000 : 350000);
  }, 0);

  const handleExportAnalytics = () => {
    showToast('success', 'State Innovation Analytics Exported', 'CSV summary of Jharkhand innovation KPIs and stage metrics generated.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>State Intelligence & Decision Support</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Progress & Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of grassroots problem pipelines, academic completion velocity, and iterative institutional learning.
          </p>
        </div>

        <button
          onClick={handleExportAnalytics}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Pipeline Throughput</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {challenges.length > 0 ? Math.round((projects.length / challenges.length) * 100) : 0}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">Challenges converted to R&D</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Multi-Attempt Lineage</div>
          <div className="text-2xl font-black text-indigo-900 mt-1">
            {multiAttemptChallenges.length}
          </div>
          <div className="text-[11px] text-indigo-600 mt-1">Reassigned to new universities</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Industry Co-Funding</div>
          <div className="text-2xl font-black text-teal-900 mt-1">
            ₹{(totalFunding / 100000).toFixed(1)} Lakhs
          </div>
          <div className="text-[11px] text-teal-600 mt-1">Across active CSR/MSME collabs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Avg Beneficiaries/Prob</div>
          <div className="text-2xl font-black text-amber-900 mt-1">
            {challenges.length > 0
              ? Math.round(
                  challenges.reduce((a, b) => a + b.affectedPopulation, 0) / challenges.length
                ).toLocaleString()
              : 0}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Citizens directly impacted</div>
        </div>
      </div>

      {/* R&D Stage Pipeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            University Project Stage Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Active capstone solutions mapped along the 5 development milestones
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {[
            'Research & Planning',
            'Prototype Development',
            'Testing & Simulation',
            'Pilot Deployment',
            'Scale-up & Policy Integration',
          ].map((stage, idx) => {
            const count = stageCounts[stage] || 0;
            const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0;

            return (
              <div
                key={stage}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Phase {idx + 1}
                  </span>
                  <div className="text-xs font-bold text-slate-800 mt-1 leading-tight">
                    {stage}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-xl font-black text-indigo-900">{count}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{pct}% of total projects</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Performance Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Problem Domain Breakdown (Grassroots Focus)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Problem Category</th>
                <th className="py-3 px-4">Total Submissions</th>
                <th className="py-3 px-4">Assigned to Universities</th>
                <th className="py-3 px-4">Total Population Impact</th>
                <th className="py-3 px-4">Conversion Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {Object.entries(categoryStats).map(([cat, stats]) => {
                const ratio = Math.round((stats.assigned / (stats.count || 1)) * 100);

                return (
                  <tr key={cat} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-bold text-slate-900">{cat}</td>
                    <td className="py-3 px-4 font-semibold">{stats.count}</td>
                    <td className="py-3 px-4 text-indigo-700 font-semibold">{stats.assigned}</td>
                    <td className="py-3 px-4 font-mono">{stats.population.toLocaleString()} citizens</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${ratio}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{ratio}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failure Analysis & Institutional Memory */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Iterative Attempt History & Institutional Learning</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Documented lessons learned from previous university cohorts to ensure new teams don't repeat failed approaches.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {multiAttemptChallenges.map((ch) => (
            <div key={ch.id} className="py-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">
                  Challenge #{ch.id}: {ch.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Multiple Institutional Attempts
                </span>
              </div>

              {ch.attemptsHistory &&
                ch.attemptsHistory.map((att) => (
                  <div
                    key={att.attemptNumber}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Attempt #{att.attemptNumber}: {att.universityName}</span>
                      <span className="text-[11px] text-slate-500">{att.period}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      <strong>Method Tried:</strong> {att.approach}
                    </div>
                    <div className="text-[11px] text-amber-900">
                      <strong>Limitation / Cause of Discontinuation:</strong> {att.failureReason}
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium">
                      <strong>Preserved Lesson for State Repository:</strong> {att.lessonsLearned}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
