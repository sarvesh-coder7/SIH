import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChallengeCategory, ChallengeUrgency, ChallengeStatus } from '../../types';
import { JHARKHAND_DISTRICTS, CATEGORIES_LIST } from '../../mock/data';
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  Calendar,
  Users,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';

export const ExploreChallengesPage: React.FC = () => {
  const { challenges, navigateToChallenge, setCurrentView } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus | 'All'>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<ChallengeUrgency | 'All'>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'newest' | 'affected'>('priority');

  const filteredChallenges = challenges.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.district.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    const matchDistrict = selectedDistrict === 'All' || c.district.toLowerCase() === selectedDistrict.toLowerCase();
    const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchUrgency = selectedUrgency === 'All' || c.urgency === selectedUrgency;

    return matchSearch && matchDistrict && matchCategory && matchStatus && matchUrgency;
  });

  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    if (sortBy === 'priority') {
      return b.aiAnalysis.priorityScore - a.aiAnalysis.priorityScore;
    }
    if (sortBy === 'affected') {
      return b.affectedPopulation - a.affectedPopulation;
    }
    return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-emerald-700 text-xs font-bold uppercase tracking-wider">
              Grassroots Challenge Directory
            </span>
            <span className="text-xs text-slate-500">&bull; All 24 Districts of Jharkhand</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Explore Crowdsourced Community Challenges
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Browse verified problems submitted by citizens and PRIs across water, healthcare, agriculture, sanitation, and rural livelihoods.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('submit-challenge')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Submit a Problem</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search problem, village, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* District Select */}
          <div className="sm:col-span-2">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All 24 Districts</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Domain Select */}
          <div className="sm:col-span-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Domains</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div className="sm:col-span-2">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Urgency</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-bold focus:ring-2 focus:ring-emerald-500 text-slate-800"
            >
              <option value="priority">Sort: AI Priority</option>
              <option value="newest">Sort: Newest</option>
              <option value="affected">Sort: Affected Count</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong>{sortedChallenges.length}</strong> matching community challenges
          </span>
          {(selectedDistrict !== 'All' || selectedCategory !== 'All' || search) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedDistrict('All');
                setSelectedCategory('All');
                setSelectedUrgency('All');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedChallenges.map((ch) => (
          <div
            key={ch.id}
            onClick={() => navigateToChallenge(ch.id)}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header tags */}
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {ch.id}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    AI Score: {ch.aiAnalysis.priorityScore}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      ch.urgency === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : ch.urgency === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ch.urgency}
                  </span>
                </div>
              </div>

              {/* Title & category */}
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide block">
                  {ch.category}
                </span>
                <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5">
                  {ch.title}
                </h3>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.description}</p>
            </div>

            {/* Footer metadata */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {ch.block}, {ch.district}
                </span>
                <span className="font-semibold text-emerald-800">{ch.status}</span>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span>Affected: {(ch.affectedPopulation || 0).toLocaleString()} citizens</span>
                <span className="text-slate-900 font-bold flex items-center gap-0.5">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
