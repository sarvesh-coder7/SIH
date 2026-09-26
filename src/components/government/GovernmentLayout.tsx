import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GovernmentDashboard } from './GovernmentDashboard';
import { GovernmentChallengesPage } from './GovernmentChallengesPage';
import { GovernmentVerificationPage } from './GovernmentVerificationPage';
import { GovernmentAssignmentsPage } from './GovernmentAssignmentsPage';
import { GovernmentProjectsPage } from './GovernmentProjectsPage';
import { GovernmentAnalyticsPage } from './GovernmentAnalyticsPage';
import { GovernmentCollaborationsPage } from './GovernmentCollaborationsPage';
import { GovernmentReportsPage } from './GovernmentReportsPage';
import { GovernmentImpactPage } from './GovernmentImpactPage';
import { GovernmentDistrictsPage } from './GovernmentDistrictsPage';
import { GovernmentModerationPage } from './GovernmentModerationPage';
import { GovernmentNotificationsPage } from './GovernmentNotificationsPage';
import { GovernmentHelpPage } from './GovernmentHelpPage';
import { GovernmentSettingsPage } from './GovernmentSettingsPage';
import { ErrorBoundary } from '../common/ErrorBoundary';
import {
  LayoutDashboard,
  Compass,
  CheckCircle2,
  FileCheck,
  Rocket,
  BarChart3,
  Handshake,
  FileText,
  Globe2,
  MapPin,
  AlertTriangle,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Building,
  UserCheck,
  ExternalLink,
} from 'lucide-react';

export const GovernmentLayout: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentGovernmentMember,
    governmentMembers,
    switchGovernmentMember,
    notifications,
    logout,
    challenges,
    projects,
    projectReports,
    industrySubmissions,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const pendingVerificationCount = challenges.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  ).length;
  const pendingAssignmentCount = challenges.filter(
    (c) => c.status === 'Validated' || (c.status === 'Assigned' && !c.officialAssignment)
  ).length;
  const reportsPendingReviewCount = projectReports.filter(
    (r) => !r.review_status || r.review_status === 'Under Review'
  ).length;
  const pendingIndustrySolutionsCount = industrySubmissions.filter(
    (s) => s.status === 'Submitted to Government'
  ).length;

  const accessLevel = currentGovernmentMember?.access_level || 'state';

  const navItems = [
    {
      id: 'government-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      allowedLevels: ['state', 'department', 'district', 'monitoring'],
    },
    {
      id: 'government-challenges',
      label: 'Challenge Monitoring',
      icon: Compass,
      allowedLevels: ['state', 'department', 'district', 'monitoring'],
      badge: challenges.length,
    },
    {
      id: 'government-verification',
      label: 'Challenge Verification',
      icon: CheckCircle2,
      allowedLevels: ['state', 'department', 'district', 'monitoring'],
      badge: pendingVerificationCount > 0 ? pendingVerificationCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'government-assignments',
      label: 'Assignment Management',
      icon: FileCheck,
      allowedLevels: ['state', 'district'],
      badge: pendingAssignmentCount > 0 ? pendingAssignmentCount : undefined,
      badgeColor: 'bg-indigo-500 text-white',
    },
    {
      id: 'government-projects',
      label: 'Project Monitoring',
      icon: Rocket,
      allowedLevels: ['state', 'department', 'district'],
      badge: projects.length,
    },
    {
      id: 'government-analytics',
      label: 'Progress & Analytics',
      icon: BarChart3,
      allowedLevels: ['state', 'department', 'district'],
    },
    {
      id: 'government-collaborations',
      label: 'Industry Collaboration',
      icon: Handshake,
      allowedLevels: ['state', 'department', 'district'],
      badge: pendingIndustrySolutionsCount > 0 ? pendingIndustrySolutionsCount : undefined,
      badgeColor: 'bg-teal-600 text-white',
    },
    {
      id: 'government-reports',
      label: 'Reports & Documents',
      icon: FileText,
      allowedLevels: ['state', 'department', 'district'],
      badge: reportsPendingReviewCount > 0 ? reportsPendingReviewCount : undefined,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'government-impact',
      label: 'Impact & Outcomes',
      icon: Globe2,
      allowedLevels: ['state', 'department', 'district'],
    },
    {
      id: 'government-districts',
      label: 'District / State View',
      icon: MapPin,
      allowedLevels: ['state', 'department', 'district'],
    },
    {
      id: 'government-moderation',
      label: 'Issues & Moderation',
      icon: AlertTriangle,
      allowedLevels: ['state'],
    },
    {
      id: 'government-notifications',
      label: 'Notifications & Audit',
      icon: Bell,
      allowedLevels: ['state', 'department', 'district', 'monitoring'],
      badge: unreadNotifs > 0 ? unreadNotifs : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.allowedLevels.includes(accessLevel)
  );

  const renderActiveView = () => {
    const content = (() => {
      switch (currentView) {
        case 'government-dashboard':
          return <GovernmentDashboard />;
        case 'government-challenges':
          return <GovernmentChallengesPage />;
        case 'government-verification':
          return <GovernmentVerificationPage />;
        case 'government-assignments':
          return <GovernmentAssignmentsPage />;
        case 'government-projects':
          return <GovernmentProjectsPage />;
        case 'government-analytics':
          return <GovernmentAnalyticsPage />;
        case 'government-collaborations':
          return <GovernmentCollaborationsPage />;
        case 'government-reports':
          return <GovernmentReportsPage />;
        case 'government-impact':
          return <GovernmentImpactPage />;
        case 'government-districts':
          return <GovernmentDistrictsPage />;
        case 'government-moderation':
          return <GovernmentModerationPage />;
        case 'government-notifications':
          return <GovernmentNotificationsPage />;
        case 'government-help':
          return <GovernmentHelpPage />;
        case 'government-settings':
          return <GovernmentSettingsPage />;
        default:
          return <GovernmentDashboard />;
      }
    })();
    return <div key={currentView} className="pt-page-enter">{content}</div>;
  };

  const accessLevelLabels: Record<string, { title: string; color: string; bg: string }> = {
    state: { title: 'State Level (Statewide PMU)', color: 'text-amber-800', bg: 'bg-amber-100 border-amber-300' },
    department: { title: 'Department Level', color: 'text-blue-800', bg: 'bg-blue-100 border-blue-300' },
    district: { title: 'District Level', color: 'text-emerald-800', bg: 'bg-emerald-100 border-emerald-300' },
    monitoring: { title: 'Monitoring Officer', color: 'text-purple-800', bg: 'bg-purple-100 border-purple-300' },
  };

  const currentLevelInfo = accessLevelLabels[accessLevel] || accessLevelLabels.state;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Official State Header */}
      <header className="shrink-0 bg-slate-900 text-white border-b border-slate-800 z-30 shadow-md">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Branding */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div
                onClick={() => setCurrentView('government-dashboard')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-amber-300 shadow-md border border-emerald-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                      झारखंड सरकार • Govt of Jharkhand
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentLevelInfo.bg} ${currentLevelInfo.color}`}>
                      {accessLevel.toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                    JH Innovation Connect — Government Portal
                  </h1>
                </div>
              </div>
            </div>

            {/* Right: Access Level Switcher & User Profile */}
            <div className="flex items-center gap-3">
              {/* Quick Access Switcher Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs text-slate-200 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <div className="text-left">
                    <div className="font-semibold truncate max-w-[150px]">
                      {currentGovernmentMember.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">
                      {currentGovernmentMember.designation}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Switch Government Official / Access Scope
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Test different permissions across State, Department, District, & Field levels.
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {governmentMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => {
                            switchGovernmentMember(member.id);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                            member.id === currentGovernmentMember.id ? 'bg-emerald-50/70' : ''
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0 mt-0.5">
                            {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {member.name}
                              </span>
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                  accessLevelLabels[member.access_level]?.bg || 'bg-slate-100'
                                } ${accessLevelLabels[member.access_level]?.color || 'text-slate-700'}`}
                              >
                                {member.access_level}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 truncate">{member.designation}</div>
                            <div className="text-[10px] text-slate-400 truncate">{member.department_name}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Public Portal Switcher */}
              <button
                onClick={() => setCurrentView('landing')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 rounded-lg text-xs font-semibold text-emerald-300 transition-colors"
                title="View Public Community Portal"
              >
                <span>Public Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign out of Government Portal"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-full w-full mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-hidden items-stretch">
        {/* Navigation Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 p-4 my-6 overflow-y-auto shrink-0 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto lg:rounded-2xl lg:shadow-xs lg:border pt-sidebar-enter flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Sidebar Close */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Government Portal Navigation
            </span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card in Sidebar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Authorized Official
            </div>
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {currentGovernmentMember.name}
            </div>
            <div className="text-[11px] text-slate-600 truncate mt-0.5">
              {currentGovernmentMember.designation}
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-1">
              {currentGovernmentMember.department_name}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as any);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || (isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Secondary Links */}
          <div className="pt-4 mt-auto border-t border-slate-200 space-y-1">
            <button
              onClick={() => {
                setCurrentView('government-help');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentView === 'government-help'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Help & SOPs</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('government-settings');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                currentView === 'government-settings'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Official Settings</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 py-6 overflow-y-auto pb-24 lg:pb-8">
          <ErrorBoundary>
            {renderActiveView()}
          </ErrorBoundary>
        </main>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/40 z-30 lg:hidden backdrop-blur-xs"
        />
      )}
    </div>
  );
};