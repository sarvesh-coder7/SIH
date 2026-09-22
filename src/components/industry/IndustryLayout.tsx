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
  ExternalLink,
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
    { id: 'industry-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'industry-open-challenges',
      label: 'Open Problem Statements',
      icon: Sparkles,
      badge: openProblemCount > 0 ? `${openProblemCount} Open` : null,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    { id: 'industry-discovery', label: 'Project Discovery', icon: Search },
    { id: 'industry-requests', label: 'Collaboration Requests', icon: ClipboardList },
    { id: 'industry-collaborations', label: 'Active Collaborations', icon: Handshake },
    { id: 'industry-progress', label: 'Project Progress', icon: TrendingUp },
    { id: 'industry-reports', label: 'Reports & Documents', icon: FileText },
    { id: 'industry-funding', label: 'Funding & CSR', icon: DollarSign },
    { id: 'industry-technical', label: 'Technical Collaboration', icon: Cpu },
    { id: 'industry-profile', label: 'Organization Profile', icon: Building2 },
    { id: 'industry-members', label: 'Members & Roles', icon: Users },
    {
      id: 'industry-notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifs > 0 ? unreadNotifs : null,
    },
  ];

  const secondaryNavItems = [
    { id: 'industry-help', label: 'Help & Support', icon: HelpCircle },
    { id: 'industry-settings', label: 'Settings', icon: Settings },
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
    return <div key={currentView} className="pt-page-enter">{content}</div>;
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

  return (
    <div className="h-screen w-full bg-slate-100 flex text-slate-800 font-sans antialiased overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 h-full w-72 bg-slate-950 text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-900/30 shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider text-white uppercase leading-tight">
                  JH Innovation Connect
                </div>
                <div className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Industry Portal
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Organization Chip */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/90 text-xs">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Affiliated Enterprise</div>
            <div className="font-bold text-white truncate">{activeIndustry?.organization_name || 'Tata Steel Innovation Centre'}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span className="truncate">State Verified Industry Partner</span>
            </div>
          </div>
        </div>

        {/* Navigation Items (Scrollable) */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Collaboration Suite
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentView(item.id as any);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                      isActive ? 'bg-white text-emerald-800' : 'bg-emerald-500 text-slate-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Governance & Support
          </div>
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentView(item.id as any);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User / Member Role Switcher Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/80 space-y-2 shrink-0">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                  {currentIndustryMember?.name?.charAt(0) || 'P'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {currentIndustryMember?.name || 'Partner'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    {getRoleBadgeLabel(currentIndustryMember?.role || currentIndustryMember?.member_role)}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {/* Role dropdown */}
            {roleDropdownOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 space-y-1 z-50 text-xs max-h-56 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">
                  Switch Active Role:
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
                    className={`w-full p-2 text-left rounded-lg transition flex items-center justify-between cursor-pointer ${
                      m.id === currentIndustryMember.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs leading-tight">{m.name}</div>
                      <div className="text-[10px] opacity-80">{m.designation}</div>
                    </div>
                    {m.id === currentIndustryMember.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-100">
        {/* Top Navbar */}
        <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">JH Innovation Connect</span>
              <span>/</span>
              <span className="text-emerald-700 font-bold capitalize">
                {currentView.replace('industry-', '').replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('industry-notifications')}
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-200 text-xs">
              <div className="text-right">
                <div className="font-bold text-slate-800">{activeIndustry?.organization_name || 'Industry Partner'}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  {currentIndustryMember?.name || 'Partner'} • {getRoleBadgeLabel(currentIndustryMember?.role || currentIndustryMember?.member_role)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Routed Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 pb-32">
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
