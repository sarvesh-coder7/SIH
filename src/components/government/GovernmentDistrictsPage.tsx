import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Search,
  Building2,
  Users,
  Compass,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const JHARKHAND_DISTRICTS = [
  'Ranchi', 'Dhanbad', 'East Singhbhum', 'Bokaro', 'Palamu', 'Hazaribagh',
  'Deoghar', 'Giridih', 'Ramgarh', 'Khunti', 'Gumla', 'Simdega',
  'Lohardaga', 'West Singhbhum', 'Saraikela Kharsawan', 'Jamtara', 'Dumka',
  'Godda', 'Sahibganj', 'Pakur', 'Chatra', 'Koderma', 'Garhwa', 'Latehar',
];

export const GovernmentDistrictsPage: React.FC = () => {
  const { challenges, projects, setCurrentView, setSelectedChallengeId } = useApp();

  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Group real data
  const districtData = JHARKHAND_DISTRICTS.map((d) => {
    const districtChallenges = challenges.filter(
      (c) => c.district.toLowerCase() === d.toLowerCase()
    );
    const affectedPop = districtChallenges.reduce(
      (acc, c) => acc + (c.affectedPopulation || 0),
      0
    );
    const assignedCount = districtChallenges.filter(
      (c) => c.officialAssignment || c.assignedUniversityName
    ).length;

    return {
      name: d,
      challengesCount: districtChallenges.length,
      assignedCount,
      affectedPop,
      challenges: districtChallenges,
    };
  });

  const filteredDistricts = districtData.filter((d) =>
    d.name.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  const activeDistrictDetails = selectedDistrict
    ? districtData.find((d) => d.name === selectedDistrict)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>State Administrative Geography</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            District Innovation Matrix (24 Districts)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic distribution of grassroots problems, university pilot sites, and population vulnerability.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchDistrict}
            onChange={(e) => setSearchDistrict(e.target.value)}
            placeholder="Filter district..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Grid of 24 Districts */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredDistricts.map((d) => {
          const isSelected = selectedDistrict === d.name;

          return (
            <div
              key={d.name}
              onClick={() => setSelectedDistrict(isSelected ? null : d.name)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-bold text-xs text-slate-900">{d.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    d.challengesCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {d.challengesCount} Problems
                </span>
              </div>

              <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                <div className="flex justify-between">
                  <span>Assigned Teams:</span>
                  <strong className="text-indigo-700">{d.assignedCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Target Citizens:</span>
                  <strong className="text-slate-800">{d.affectedPop.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected District Drill-Down */}
      {activeDistrictDetails && (
        <div className="bg-white rounded-2xl border border-emerald-300 shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                District Drill-Down
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Challenges in {activeDistrictDetails.name} District ({activeDistrictDetails.challenges.length})
              </h3>
            </div>
            <button
              onClick={() => setSelectedDistrict(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Close Drill-Down
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activeDistrictDetails.challenges.map((ch) => (
              <div
                key={ch.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono font-bold text-slate-700">{ch.id}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-600">{ch.block} Block</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-700 font-semibold">{ch.category}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">{ch.title}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {ch.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedChallengeId(ch.id);
                      setCurrentView('government-challenges');
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
                  >
                    View in Repository
                  </button>
                </div>
              </div>
            ))}

            {activeDistrictDetails.challenges.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">
                No challenges currently logged for {activeDistrictDetails.name} district.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
