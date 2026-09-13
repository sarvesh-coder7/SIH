import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_DISTRICT_METRICS, JHARKHAND_DISTRICTS, CATEGORIES_LIST } from '../../mock/data';
import { ChallengeCategory, ChallengeUrgency, ChallengeStatus } from '../../types';
import {
  MapPin,
  Filter,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Users,
  Compass,
  Maximize2,
  Info,
  Map,
  GraduationCap,
  Leaf,
  Recycle,
  Droplet,
  Sprout,
  Zap,
  Heart,
  Settings,
  Route,
  TreePine,
  Crosshair,
} from 'lucide-react';

export const JharkhandMap: React.FC = () => {
  const { challenges, navigateToChallenge, setCurrentView } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Khunti');
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'All'>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<ChallengeUrgency | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered district list
  const activeDistrictMetric = MOCK_DISTRICT_METRICS.find((d) => d.districtName.toLowerCase() === selectedDistrict.toLowerCase()) || MOCK_DISTRICT_METRICS[0];

  // Filtered challenges for map pins & drawer
  const filteredChallenges = challenges.filter((c) => {
    const matchDist = selectedDistrict === 'All' || c.district.toLowerCase().includes(selectedDistrict.toLowerCase());
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchUrg = selectedUrgency === 'All' || c.urgency === selectedUrgency;
    const matchSearch =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDist && matchCat && matchUrg && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Geospatial Innovation Heatmap
            </span>
            <span className="text-xs font-medium text-slate-500">All 24 Districts of Jharkhand</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Jharkhand Societal Challenge Geo-Explorer
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Interactive geographical distribution of community problems, HEI allocations, and live pilot deployments across rural and urban blocks.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('submit-challenge')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Geotag & Submit Problem</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Map Filters:</span>
        </div>

        {/* District Filter */}
        <div className="min-w-[180px]">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All 24 Districts</option>
            {JHARKHAND_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Domain Filter */}
        <div className="min-w-[180px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Innovation Domains</option>
            {CATEGORIES_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency Filter */}
        <div className="min-w-[130px]">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value as any)}
            className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Urgency</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Search input */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search block, village, or problem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Main Map & Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-slate-900 relative overflow-hidden flex flex-col min-h-[540px] shadow-sm">
          {/* Map Controls Overlay */}
          <div className="flex items-center justify-between z-10 mb-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-emerald-700" />
              <span className="text-[15px] font-extrabold text-slate-900 tracking-tight">Jharkhand State Vector Grid</span>
              <span className="text-[10px] bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-medium ml-1">
                Leaflet/OSM Compatible Canvas
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Critical</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> High</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Resolved</div>
            </div>
          </div>

          {/* Interactive Vector Grid of Districts */}
          <div className="flex-1 relative rounded-xl bg-slate-50/50 border border-slate-100 p-4 flex flex-col justify-between overflow-hidden">
            {/* Background topographic contours mock */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MOCK_DISTRICT_METRICS.slice(0, 16).map((dist) => {
                const isSelected = selectedDistrict.toLowerCase().includes(dist.districtName.toLowerCase());
                
                let Icon = Map;
                let iconColor = "text-slate-600";
                let iconBg = "bg-slate-100";
                
                if (dist.dominantDomain.includes("Education")) { Icon = GraduationCap; iconColor = "text-emerald-700"; iconBg = "bg-emerald-100/50"; }
                else if (dist.dominantDomain.includes("Environment")) { Icon = Leaf; iconColor = "text-emerald-600"; iconBg = "bg-emerald-50"; }
                else if (dist.dominantDomain.includes("Urban")) { Icon = Building2; iconColor = "text-blue-600"; iconBg = "bg-blue-50"; }
                else if (dist.dominantDomain.includes("Sanitation")) { Icon = Recycle; iconColor = "text-emerald-600"; iconBg = "bg-emerald-50"; }
                else if (dist.dominantDomain.includes("Water")) { Icon = Droplet; iconColor = "text-blue-500"; iconBg = "bg-blue-50"; }
                else if (dist.dominantDomain.includes("Agriculture")) { Icon = Sprout; iconColor = "text-green-600"; iconBg = "bg-green-50"; }
                else if (dist.dominantDomain.includes("Energy")) { Icon = Zap; iconColor = "text-amber-500"; iconBg = "bg-amber-50"; }
                else if (dist.dominantDomain.includes("Healthcare")) { Icon = Heart; iconColor = "text-rose-500"; iconBg = "bg-rose-50"; }
                else if (dist.dominantDomain.includes("Tribal")) { Icon = Users; iconColor = "text-indigo-600"; iconBg = "bg-indigo-50"; }

                if (dist.districtName === "Simdega") { Icon = Settings; iconColor = "text-indigo-600"; iconBg = "bg-indigo-50"; }
                if (dist.districtName === "Seraikela Kharsawan") { Icon = Route; iconColor = "text-blue-600"; iconBg = "bg-blue-50"; }
                if (dist.districtName === "Ramgarh") { Icon = TreePine; iconColor = "text-emerald-600"; iconBg = "bg-emerald-50"; }

                return (
                  <button
                    key={dist.districtName}
                    onClick={() => setSelectedDistrict(dist.districtName)}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500 shadow-sm scale-102 z-10'
                        : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
                         <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[13px] text-slate-900 line-clamp-1">{dist.districtName}</span>
                          <span className="text-[14px] text-orange-600 font-bold">
                            {dist.totalChallenges}
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-500 truncate mt-0.5">{dist.dominantDomain}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[10px] font-medium text-slate-600 border-t border-slate-50 pt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{dist.inProgressProjects} Active Projects</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Simulated GPS Pins on Map */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500 animate-bounce" />
                <span className="text-slate-600 text-[11px]">
                  Showing <strong>{filteredChallenges.length}</strong> active challenge coordinates in{' '}
                  <strong className="text-emerald-700">{selectedDistrict}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <Crosshair className="w-3.5 h-3.5" />
                Lat: 23.3441° N, Lng: 85.3096° E
              </div>
            </div>
          </div>
        </div>

        {/* Right District Detail & Challenge Drawer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected District KPI Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  District Profile
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{activeDistrictMetric.districtName}</h3>
                <p className="text-xs text-slate-600">Dominant Need: {activeDistrictMetric.dominantDomain}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-800">{activeDistrictMetric.totalChallenges}</span>
                <span className="text-[10px] text-slate-600 block">Total Challenges</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-amber-800 block">{activeDistrictMetric.inProgressProjects}</span>
                <span className="text-[10px] text-slate-600">Active HEI R&D</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-emerald-800 block">{activeDistrictMetric.resolvedChallenges}</span>
                <span className="text-[10px] text-slate-600">Resolved</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs font-bold text-indigo-800 block">
                  {(activeDistrictMetric.beneficiariesCount / 1000).toFixed(0)}k
                </span>
                <span className="text-[10px] text-slate-600">Beneficiaries</span>
              </div>
            </div>
          </div>

          {/* Localized Challenges List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Geotagged Challenges ({filteredChallenges.length})
              </h4>
              <span className="text-[10px] text-slate-600">Click to inspect</span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {filteredChallenges.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-600">
                  No challenges match the active filters in this district.
                </div>
              ) : (
                filteredChallenges.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => navigateToChallenge(ch.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{ch.title}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
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

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-600" />
                        {ch.block}, {ch.district}
                      </span>
                      <span className="font-semibold text-emerald-800">{ch.status}</span>
                    </div>

                    <div className="text-[10px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>Affected: {(ch.affectedPopulation || 0).toLocaleString()} citizens</span>
                      <span className="text-emerald-800 font-bold flex items-center gap-0.5">
                        View Details &rarr;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
