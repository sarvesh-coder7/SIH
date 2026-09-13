import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectLifecycle } from '../../types';
import { IndustryExpressInterestModal } from './IndustryExpressInterestModal';
import {
  Search,
  Filter,
  Layers,
  MapPin,
  Building2,
  Cpu,
  Handshake,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  SlidersHorizontal,
  X,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const IndustryProjectDiscovery: React.FC = () => {
  const {
    projects,
    challenges,
    setSelectedProjectId,
    setCurrentView,
    activeIndustry,
    currentIndustryMember,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedNeed, setSelectedNeed] = useState<string>('All');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('All');
  const [showOnlyCsr, setShowOnlyCsr] = useState<boolean>(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Selected project for Express Interest Modal
  const [expressInterestProject, setExpressInterestProject] = useState<ProjectLifecycle | null>(null);

  // Derive unique filter lists
  const sectors = ['All', 'Water & Sanitation', 'Air Quality & Environment', 'Renewable Energy', 'Agriculture', 'Healthcare', 'Mining & Safety'];
  const stages = ['All', 'Research', 'Development', 'Prototype', 'Testing', 'Pilot', 'Deployment', 'Impact'];
  const districts = ['All', 'Khunti', 'Dhanbad', 'Ranchi', 'East Singhbhum (Jamshedpur)', 'Bokaro', 'Hazaribagh', 'Giridih'];
  const needs = ['All', 'Manufacturing', 'Testing', 'Deployment', 'Funding', 'Technology', 'Mentorship', 'CSR'];
  const universities = ['All', 'Birla Institute of Technology (BIT) Mesra', 'IIT (ISM) Dhanbad', 'NIT Jamshedpur', 'Ranchi University'];

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      // Search text
      const projTitle = proj.title || proj.proposal?.title || proj.challengeTitle || '';
      const projSummary = proj.summary || proj.proposal?.executiveSummary || proj.proposal?.proposedSolution || '';
      const projUniv = proj.universityName || proj.university?.name || '';
      const projDistrict = proj.district || '';
      const projStage = proj.currentStage || 'Prototype';

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = projTitle.toLowerCase().includes(q);
        const matchSummary = projSummary.toLowerCase().includes(q);
        const matchUniv = projUniv.toLowerCase().includes(q);
        const matchDistrict = projDistrict.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchUniv && !matchDistrict) return false;
      }

      // Stage
      if (selectedStage !== 'All' && projStage !== selectedStage) {
        return false;
      }

      // District
      if (selectedDistrict !== 'All' && projDistrict !== selectedDistrict) {
        return false;
      }

      // University
      if (selectedUniversity !== 'All' && projUniv !== selectedUniversity) {
        return false;
      }

      // CSR filter
      if (showOnlyCsr && !proj.budget?.allowCorporateSponsorship && !proj.proposal?.totalBudget) {
        return false;
      }

      return true;
    });
  }, [
    projects,
    searchQuery,
    selectedSector,
    selectedStage,
    selectedDistrict,
    selectedNeed,
    selectedUniversity,
    showOnlyCsr,
  ]);

  const handleOpenDetail = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentView('industry-project-detail');
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedSector('All');
    setSelectedStage('All');
    setSelectedDistrict('All');
    setSelectedNeed('All');
    setSelectedUniversity('All');
    setShowOnlyCsr(false);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Research':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Development':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Prototype':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Testing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pilot':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'Deployment':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Impact':
      case 'Success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Centralized Academic Innovation Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover University Projects for Co-Development
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Review live multidisciplinary research from premier state technical universities. Partner to provide
            prototyping testbeds, certified laboratory testing, hardware manufacturing, CSR grants, or district deployment.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Org: <strong>{activeIndustry.organization_name}</strong>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified State Academic Projects: <strong>{projects.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by technology (IoT, sensors), district, problem or university..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="sm:hidden px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 flex-1 justify-center bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters {selectedStage !== 'All' || selectedDistrict !== 'All' ? '(Active)' : ''}
            </button>

            <label className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition whitespace-nowrap">
              <input
                type="checkbox"
                checked={showOnlyCsr}
                onChange={(e) => setShowOnlyCsr(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span>CSR Grants Eligible Only</span>
            </label>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className={`${showFiltersMobile ? 'block' : 'hidden sm:grid'} grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100`}>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Project Stage
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              District
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              University
            </label>
            <select
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearAllFilters}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-dashed border-slate-300 transition text-center"
            >
              Reset All Filters
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong>{filteredProjects.length}</strong> eligible projects:
          </span>
          {selectedStage !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
              Stage: {selectedStage}
              <button onClick={() => setSelectedStage('All')} className="hover:text-emerald-900">
                ×
              </button>
            </span>
          )}
          {selectedDistrict !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
              District: {selectedDistrict}
              <button onClick={() => setSelectedDistrict('All')} className="hover:text-emerald-900">
                ×
              </button>
            </span>
          )}
          {selectedUniversity !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
              {selectedUniversity}
              <button onClick={() => setSelectedUniversity('All')} className="hover:text-emerald-900">
                ×
              </button>
            </span>
          )}
          {showOnlyCsr && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">
              CSR Grant Eligible
              <button onClick={() => setShowOnlyCsr(false)} className="hover:text-emerald-900">
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Projects Match Your Filters</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            There are currently no university research projects matching the selected criteria. Try resetting the stage
            or district filters to browse active opportunities.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const challenge = challenges.find((c) => c.id === project.challengeId);
            const needsManufacturing = project.currentStage === 'Prototype' || project.currentStage === 'Testing';
            const needsTesting = project.currentStage === 'Testing' || project.currentStage === 'Prototype';
            const needsDeployment = project.currentStage === 'Pilot' || project.currentStage === 'Deployment';

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/50 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Top Bar with Stage & Location */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getStageColor(
                        project.currentStage || 'Prototype'
                      )}`}
                    >
                      {project.currentStage || 'Prototype'} Stage
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.district || 'Jharkhand'}</span>
                    </div>
                  </div>

                  {/* Title & Challenge Association */}
                  <div>
                    <h3
                      onClick={() => handleOpenDetail(project.id)}
                      className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition cursor-pointer leading-snug"
                    >
                      {project.title || project.proposal?.title || project.challengeTitle}
                    </h3>
                    <div className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-700">{project.universityName || project.university?.name || 'Academic Institution'}</span>
                    </div>
                  </div>

                  {/* Challenge Problem Snippet */}
                  {challenge && (
                    <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-700 block mb-0.5">Societal Problem:</span>
                      <p className="line-clamp-2">{challenge.problemSummary || challenge.description}</p>
                    </div>
                  )}

                  {/* Technology Badges */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-emerald-600" />
                      Key Technologies & Sensors:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['IoT Telemetry', 'Solar Automation', 'Spectrometry', 'Embedded Systems'].map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Industry Collaboration Needs */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Handshake className="w-3 h-3 text-emerald-600" />
                      Sought Industry Support:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {needsManufacturing && (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-[11px] font-semibold">
                          • Manufacturing / Fab
                        </span>
                      )}
                      {needsTesting && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-semibold">
                          • Environmental Testing
                        </span>
                      )}
                      {needsDeployment && (
                        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-md text-[11px] font-semibold">
                          • Field Deployment Partner
                        </span>
                      )}
                      {project.budget?.allowCorporateSponsorship && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-[11px] font-semibold">
                          • CSR Matching Grant
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[11px] font-semibold">
                        • Technical Mentorship
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleOpenDetail(project.id)}
                    className="text-xs font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 transition"
                  >
                    View Project Dossier
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setExpressInterestProject(project)}
                    disabled={!currentIndustryMember.permissions.canExpressCollaboration}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
                    title={
                      !currentIndustryMember.permissions.canExpressCollaboration
                        ? 'Your role cannot express collaboration'
                        : 'Express interest'
                    }
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    Express Interest
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Express Interest Modal */}
      {expressInterestProject && (
        <IndustryExpressInterestModal
          project={expressInterestProject}
          onClose={() => setExpressInterestProject(null)}
        />
      )}
    </div>
  );
};
