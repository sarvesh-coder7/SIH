import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryDashboard } from './IndustryDashboard';
import { IndustryProjectDiscovery } from './IndustryProjectDiscovery';
import { IndustryProjectDetail } from './IndustryProjectDetail';
import { IndustryCollaborationRequests } from './IndustryCollaborationRequests';
import { IndustryActiveCollaborations } from './IndustryActiveCollaborations';
import { IndustryCollaborationWorkspace } from './IndustryCollaborationWorkspace';
import { IndustryReportsPage } from './IndustryReportsPage';
import { IndustryFundingCSRPage } from './IndustryFundingCSRPage';
import { IndustryTechnicalPage } from './IndustryTechnicalPage';
import { IndustryProjectProgressPage } from './IndustryProjectProgressPage';
import { IndustryProfilePage } from './IndustryProfilePage';
import { IndustryMembersPage } from './IndustryMembersPage';
import { IndustryNotificationsPage } from './IndustryNotificationsPage';
import { IndustryHelpPage } from './IndustryHelpPage';
import { IndustrySettingsPage } from './IndustrySettingsPage';
import { IndustryOpenProblemStatements } from './IndustryOpenProblemStatements';
import { ErrorBoundary } from '../common/ErrorBoundary';

import {
  Building2,
  LayoutDashboard,
  Search,
  ClipboardList,
  Handshake,
  TrendingUp,
  FileText,
  DollarSign,
  Cpu,
  Users,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const IndustryLayout: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeIndustry,
    currentIndustryMember,
    industryMembers,
    setCurrentIndustryMember,
    notifications,
    logout,
    showToast,
    challenges,
  } = useApp();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const openProblemCount = challenges.filter(
    (c) =>
      c.trustStatus === 'Verified' ||
      c.status === 'Validated' ||
      c.status === 'University Matching' ||
      c.openForSolutions === true
  ).length;

  const navItems = [
    {
      id: 'industry-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'industry-open-challenges',
      label: 'Open Problem Statements',
      icon: Sparkles,
      badge: openProblemCount > 0 ? `${openProblemCount} Open` : null,
    },
    {
      id: 'industry-discovery',
      label: 'Project Discovery',
      icon: Search,
    },
    {
      id: 'industry-requests',
      label: 'Collaboration Requests',
      icon: ClipboardList,
    },
    {
      id: 'industry-collaborations',
      label: 'Active Collaborations',
      icon: Handshake,
    },
    {
      id: 'industry-progress',
      label: 'Project Progress',
      icon: TrendingUp,
    },
    {
      id: 'industry-reports',
      label: 'Reports & Documents',
      icon: FileText,
    },
    {
      id: 'industry-funding',
      label: 'Funding & CSR',
      icon: DollarSign,
    },
    {
      id: 'industry-technical',
      label: 'Technical Collaboration',
      icon: Cpu,
    },
    {
      id: 'industry-profile',
      label: 'Organization Profile',
      icon: Building2,
    },
    {
      id: 'industry-members',
      label: 'Members & Roles',
      icon: Users,
    },
    {
      id: 'industry-notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : null,
    },
  ];

  const secondaryNavItems = [
    {
      id: 'industry-help',
      label: 'Help & Support',
      icon: HelpCircle,
    },
    {
      id: 'industry-settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const renderContent = () => {
    const content = (() => {
      switch (currentView) {
        case 'industry-dashboard':
          return <IndustryDashboard />;

        case 'industry-open-challenges':
          return <IndustryOpenProblemStatements />;

        case 'industry-discovery':
          return <IndustryProjectDiscovery />;

        case 'industry-project-detail':
          return <IndustryProjectDetail />;

        case 'industry-requests':
          return <IndustryCollaborationRequests />;

        case 'industry-collaborations':
          return <IndustryActiveCollaborations />;

        case 'industry-collaboration-workspace':
          return <IndustryCollaborationWorkspace />;

        case 'industry-reports':
          return <IndustryReportsPage />;

        case 'industry-funding':
          return <IndustryFundingCSRPage />;

        case 'industry-technical':
          return <IndustryTechnicalPage />;

        case 'industry-progress':
          return <IndustryProjectProgressPage />;

        case 'industry-profile':
          return <IndustryProfilePage />;

        case 'industry-members':
          return <IndustryMembersPage />;

        case 'industry-notifications':
          return <IndustryNotificationsPage />;

        case 'industry-help':
          return <IndustryHelpPage />;

        case 'industry-settings':
          return <IndustrySettingsPage />;

        default:
          return <IndustryDashboard />;
      }
    })();

    return (
      <div
        key={currentView}
        className="pt-page-enter animate-in fade-in duration-200"
      >
        {content}
      </div>
    );
  };

  const getRoleBadgeLabel = (role?: string) => {
    switch (role) {
      case 'org_admin':
        return 'Org Admin';

      case 'technical_member':
        return 'Technical Lead';

      case 'csr_member':
        return 'CSR Director';

      default:
        return 'Partner';
    }
  };

  const navigate = (view: string) => {
    setCurrentView(view as any);
    setSidebarOpen(false);
    setRoleDropdownOpen(false);
  };

  const currentPageLabel =
    currentView
      .replace('industry-', '')
      .replace(/-/g, ' ') || 'dashboard';

  return (
    <div className="h-screen w-full bg-slate-100 flex text-slate-800 font-sans antialiased overflow-hidden">

      {/* MOBILE BACKDROP */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 h-full w-[280px] bg-slate-50 text-slate-700 flex flex-col border-r border-slate-200 transition-transform duration-300 ease-out shrink-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >

        {/* BRAND HEADER */}
        <div className="px-4 pt-4 pb-4 shrink-0">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-200 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="text-[12px] font-black tracking-[0.04em] text-slate-900 uppercase truncate">
                  JH Innovation Connect
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />

                  <span className="text-[9px] text-blue-700 font-bold uppercase tracking-[0.14em]">
                    Industry Portal
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ORGANIZATION CARD */}
          <div className="mt-5 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="text-[9px] uppercase tracking-[0.12em] font-bold text-slate-500">
              Affiliated Enterprise
            </div>

            <div className="mt-1.5 text-[12px] font-bold text-slate-900 truncate">
              {activeIndustry?.organization_name ||
                'Tata Steel Innovation Centre'}
            </div>

            <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-semibold text-blue-700">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />

              <span className="truncate">
                State Verified Industry Partner
              </span>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

          {/* MAIN NAVIGATION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
            <div className="px-3 pt-2 pb-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.14em]">
              Collaboration Suite
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`group w-full min-h-[42px] flex items-center justify-between gap-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 border border-blue-100 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-transparent text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <span className="truncate">
                        {item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className={`shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-black ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUPPORT */}
          <div className="mt-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
            <div className="px-3 pt-2 pb-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.14em]">
              Governance & Support
            </div>

            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`group w-full min-h-[42px] flex items-center gap-3 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-800 border border-blue-100'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-400 group-hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className="truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* LOGOUT */}
            <div className="mt-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={logout}
                className="w-full min-h-[42px] flex items-center gap-3 px-3 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>

                <span>Sign Out Portal</span>
              </button>
            </div>
          </div>
        </div>

        {/* MEMBER / ROLE FOOTER */}
        <div className="px-4 pb-4 pt-2 shrink-0">
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setRoleDropdownOpen((prev) => !prev)
              }
              className="w-full p-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 shadow-sm text-left flex items-center justify-between transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">

                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-black text-xs flex items-center justify-center shrink-0">
                  {currentIndustryMember?.name?.charAt(0) || 'P'}
                </div>

                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 truncate">
                    {currentIndustryMember?.name || 'Partner'}
                  </div>

                  <div className="flex items-center gap-1 mt-0.5 text-[9px] text-blue-700 font-semibold">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />

                    {getRoleBadgeLabel(
                      currentIndustryMember?.role ||
                        currentIndustryMember?.member_role
                    )}
                  </div>
                </div>
              </div>

              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                  roleDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* ROLE DROPDOWN */}
            {roleDropdownOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1 z-50 max-h-56 overflow-y-auto">

                <div className="px-2.5 py-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  Switch Active Role
                </div>

                {industryMembers.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndustryMember(m);
                      setRoleDropdownOpen(false);

                      showToast(
                        'info',
                        'Role Switched',
                        `Now acting as ${m.name} (${m.designation})`
                      );
                    }}
                    className={`w-full p-2.5 text-left rounded-xl transition flex items-center justify-between ${
                      m.id === currentIndustryMember.id
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-[11px] leading-tight truncate">
                        {m.name}
                      </div>

                      <div className="text-[9px] opacity-70 truncate mt-0.5">
                        {m.designation}
                      </div>
                    </div>

                    {m.id === currentIndustryMember.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-100">

        {/* TOP NAVBAR */}
        <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 min-w-0">

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* BREADCRUMB */}
            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-semibold text-slate-400">
                JH Innovation Connect
              </span>

              <span className="text-slate-300">/</span>

              <span className="text-[11px] font-bold text-blue-700 capitalize truncate">
                {currentPageLabel}
              </span>
            </div>

            {/* MOBILE TITLE */}
            <div className="sm:hidden min-w-0">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Industry Portal
              </div>

              <div className="text-xs font-bold text-slate-800 capitalize truncate">
                {currentPageLabel}
              </div>
            </div>
          </div>

          {/* HEADER RIGHT */}
          <div className="flex items-center gap-2.5 shrink-0">

            <button
              type="button"
              onClick={() =>
                setCurrentView('industry-notifications')
              }
              className="relative w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition flex items-center justify-center"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />

              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200 max-w-[280px]">

              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-black text-xs shrink-0">
                {currentIndustryMember?.name?.charAt(0) || 'P'}
              </div>

              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-800 truncate">
                  {activeIndustry?.organization_name ||
                    'Industry Partner'}
                </div>

                <div className="text-[9px] text-blue-700 font-semibold truncate">
                  {currentIndustryMember?.name || 'Partner'} •{' '}
                  {getRoleBadgeLabel(
                    currentIndustryMember?.role ||
                      currentIndustryMember?.member_role
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ROUTED CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-28">
          <div className="max-w-7xl w-full mx-auto">
            <ErrorBoundary fallbackTitle="Industry Hub Module">
              {renderContent()}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};