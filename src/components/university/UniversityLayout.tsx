import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { JharkhandEmblem } from '../common/JharkhandEmblem';

import { EcosystemArchitectureModal } from '../common/EcosystemArchitectureModal';
import { Footer } from '../common/Footer';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  Users,
  FileText,
  Layers,
  Compass,
  MapPin,
  Bell,
  User as UserIcon,
  BookOpen,
  Award,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Building2,
  TrendingUp,
  Search,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check,
  Rocket,
  FlaskConical,
  HelpCircle,
  Settings,
  Handshake,
  FileCheck,
  Share2,
} from 'lucide-react';

interface AcademicNotif {
  id: string;
  title: string;
  message: string;
  type: 'Funding' | 'AI Match' | 'Milestone' | 'Co-Mentorship' | 'Patent';
  timestamp: string;
  read: boolean;
  actionView: string;
}

const INITIAL_ACADEMIC_NOTIFICATIONS: AcademicNotif[] = [
  {
    id: 'NOTIF-ACAD-01',
    title: 'CSR Grant Sanctioned: ₹3.50 Lakhs (Tata Steel CSR)',
    message: 'Tranche-1 grant disbursed to BIT Mesra innovation fund for Torpa water filtration pilot.',
    type: 'Funding',
    timestamp: '2h ago',
    read: false,
    actionView: 'university-proposals',
  },
  {
    id: 'NOTIF-ACAD-02',
    title: 'AI Priority Match (94% Score): Torpa Fluoride Issue',
    message: 'Automated problem triage routed high-priority Khunti water challenge to Chemical & IoT faculty.',
    type: 'AI Match',
    timestamp: '5h ago',
    read: false,
    actionView: 'university-challenges',
  },
  {
    id: 'NOTIF-ACAD-03',
    title: 'Milestone 4 Verified by State PMU / JSHEC',
    message: 'Lab spectrometry calibration report validated. Cleared for Torpa village field pilot.',
    type: 'Milestone',
    timestamp: '1d ago',
    read: false,
    actionView: 'project-workspace',
  },
  {
    id: 'NOTIF-ACAD-04',
    title: 'Industry Co-Mentor Joined: Central Coalfields Ltd',
    message: 'Er. Rajiv Prasad (CGM Environment) confirmed mentorship for capstone student cohort.',
    type: 'Co-Mentorship',
    timestamp: '2d ago',
    read: true,
    actionView: 'university-teams',
  },
  {
    id: 'NOTIF-ACAD-05',
    title: 'Patent Prior Art Clearance: Indian Patent #202631008472',
    message: 'State IP facilitation cell cleared novelty search with zero conflicting citations.',
    type: 'Patent',
    timestamp: '3d ago',
    read: true,
    actionView: 'project-workspace',
  },
];

interface UniversityLayoutProps {
  children: React.ReactNode;
}

export const UniversityLayout: React.FC<UniversityLayoutProps> = ({ children }) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    unreadNotifsCount: globalUnreadCount,
    showToast,
    challenges,
    projects,
    isEcosystemModalOpen,
    setIsEcosystemModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifsList, setNotifsList] = useState<AcademicNotif[]>(INITIAL_ACADEMIC_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'grants' | 'ai'>('all');
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotifDropdownOpen(false);
      }
    };

    if (isNotifDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotifDropdownOpen]);

  const unreadCount = notifsList.filter((n) => !n.read).length;

  const handleMarkAllNotifsRead = () => {
    setNotifsList((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('success', 'All Notifications Read', 'Marked all academic notifications as read.');
  };

  const handleNotifClick = (notif: AcademicNotif) => {
    setNotifsList((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    setIsNotifDropdownOpen(false);
    if (notif.actionView) {
      setCurrentView(notif.actionView as any);
      showToast('info', notif.title, 'Navigated to related module.');
    }
  };

  const filteredNotifs = notifsList.filter((n) => {
    if (notifFilter === 'unread') return !n.read;
    if (notifFilter === 'grants') return n.type === 'Funding';
    if (notifFilter === 'ai') return n.type === 'AI Match';
    return true;
  });

  // Incoming challenges for badge count (only government-approved open problem statements)
  const incomingChallengesCount = challenges.filter(
    (c) => c.status === 'University Matching' || c.status === 'Validated'
  ).length;

  const isStudent = currentUser.role === 'student';

  const universityNavItems = [
    {
      group: 'Core Navigation',
      items: [
        {
          id: 'university-dashboard' as const,
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: undefined,
        },
        {
          id: 'university-challenges' as const,
          label: 'Challenge Discovery',
          icon: Search,
          badge: incomingChallengesCount > 0 ? `${incomingChallengesCount} Open` : undefined,
          badgeColor: 'bg-amber-500 text-slate-950',
        },
        {
          id: 'university-applications' as const,
          label: 'My Applications',
          icon: FileText,
          badge: 'Under Review',
          badgeColor: 'bg-blue-100 text-blue-800',
        },
        {
          id: 'project-workspace' as const,
          label: 'Active Projects',
          icon: Rocket,
          badge: `${projects.length} Active`,
          badgeColor: 'bg-emerald-600 text-white',
        },
        {
          id: 'university-teams' as const,
          label: 'Team & Members',
          icon: Users,
          badge: undefined,
        },
        {
          id: 'university-reports' as const,
          label: 'Reports & Documents',
          icon: FileCheck,
          badge: undefined,
        },
        {
          id: 'university-industry' as const,
          label: 'Industry Collaboration',
          icon: Handshake,
          badge: 'Co-funding',
          badgeColor: 'bg-amber-100 text-amber-900',
        },
        {
          id: 'university-profile' as const,
          label: 'University Profile',
          icon: Building2,
          badge: undefined,
        },
        {
          id: 'university-notifications' as const,
          label: 'Notifications',
          icon: Bell,
          badge: unreadCount > 0 ? `${unreadCount}` : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
      ],
    },
    {
      group: 'Support & Settings',
      items: [
        {
          id: 'university-help' as const,
          label: 'Help & Support',
          icon: HelpCircle,
          badge: undefined,
        },
        {
          id: 'university-settings' as const,
          label: 'Settings',
          icon: Settings,
          badge: undefined,
        },
      ],
    },
  ];

  const studentNavItems = [
    {
      group: 'Student Researcher Hub',
      items: [
        {
          id: 'student-dashboard' as const,
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: undefined,
        },
        {
          id: 'student-projects' as const,
          label: 'My Projects',
          icon: Rocket,
          badge: 'Capstone',
          badgeColor: 'bg-blue-600 text-white',
        },
        {
          id: 'student-experiments' as const,
          label: 'Research & Experiments',
          icon: FlaskConical,
          badge: '18 Runs',
          badgeColor: 'bg-indigo-100 text-indigo-800',
        },
        {
          id: 'student-contributions' as const,
          label: 'My Contributions',
          icon: FileText,
          badge: '12 ABC',
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
          id: 'student-team' as const,
          label: 'My Team',
          icon: Users,
          badge: undefined,
        },
        {
          id: 'student-notifications' as const,
          label: 'Notifications',
          icon: Bell,
          badge: unreadCount > 0 ? `${unreadCount}` : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
      ],
    },
    {
      group: 'Preferences',
      items: [
        {
          id: 'student-settings' as const,
          label: 'Settings',
          icon: Settings,
          badge: undefined,
        },
      ],
    },
  ];

  const navItems = isStudent ? studentNavItems : universityNavItems;

  const handleLogout = () => {
    showToast('info', 'Logged Out', 'You have securely logged out of the Higher Education Institution Portal.');
    setCurrentView('role-selection');
  };

  const isCurrentActive = (viewId: string) => {
    if (viewId === currentView) return true;
    if (viewId === 'project-workspace' && currentView === 'project-detail') return true;
    if (viewId === 'university-challenges' && currentView === 'challenge-detail') return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">


      {/* Top Institutional Header */}
      <header className="sticky top-0 z-30 w-full bg-slate-900 text-white border-b border-indigo-500/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Left */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setCurrentView('university-dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <JharkhandEmblem size={38} className="ring-1 ring-indigo-400/40 shadow-xs" />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-indigo-300 transition-colors whitespace-nowrap">
                    JH INNOVATION CONNECT
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider whitespace-nowrap">
                    University / HEI Portal
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block mt-0.5 whitespace-nowrap">
                  Govt. of Jharkhand &bull; Higher Education & R&D Cell
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Action: Assemble Team */}
            <button
              type="button"
              onClick={() => setCurrentView('university-teams')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Assemble Team</span>
            </button>

            {/* Quick Action: New Proposal */}
            <button
              type="button"
              onClick={() => setCurrentView('university-proposals')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ New Proposal</span>
            </button>

            {/* Notification Bell with Dropdown Popover */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                type="button"
                onClick={() => setIsNotifDropdownOpen((prev) => !prev)}
                className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
                  isNotifDropdownOpen || currentView === 'university-notifications'
                    ? 'bg-indigo-950 border-indigo-400 text-indigo-300 shadow-sm ring-2 ring-indigo-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                }`}
                title="Academic & R&D Notifications"
                aria-expanded={isNotifDropdownOpen}
                aria-haspopup="true"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
                  {/* Top Dropdown Header */}
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-indigo-600/60 flex items-center justify-center text-amber-300">
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block leading-tight">
                          Academic & R&D Alerts
                        </span>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          Higher Education Institution Cell
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadCount > 0 ? (
                        <button
                          type="button"
                          onClick={handleMarkAllNotifsRead}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Mark all read</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-medium text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>All caught up</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Filter Chips inside Popover */}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto text-[11px]">
                    <button
                      type="button"
                      onClick={() => setNotifFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                        notifFilter === 'all'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      All ({notifsList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifFilter('unread')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                        notifFilter === 'unread'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      Unread ({unreadCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifFilter('grants')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                        notifFilter === 'grants'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      CSR Grants
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifFilter('ai')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                        notifFilter === 'ai'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      AI Matches
                    </button>
                  </div>

                  {/* Notifications Scrollable List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifs.length === 0 ? (
                      <div className="py-8 text-center px-4 space-y-1">
                        <Bell className="w-6 h-6 text-slate-300 mx-auto" />
                        <p className="text-xs font-semibold text-slate-600">No alerts in this category</p>
                        <p className="text-[10px] text-slate-400">You are all up to date with institutional R&D tasks.</p>
                      </div>
                    ) : (
                      filteredNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotifClick(notif)}
                          className={`p-3 text-xs hover:bg-indigo-50/50 cursor-pointer transition-colors relative group ${
                            !notif.read ? 'bg-indigo-50/30' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            {/* Icon Type */}
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                notif.type === 'Funding'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : notif.type === 'AI Match'
                                  ? 'bg-amber-100 text-amber-800'
                                  : notif.type === 'Milestone'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {notif.type === 'Funding' ? (
                                <DollarSign className="w-3.5 h-3.5" />
                              ) : notif.type === 'AI Match' ? (
                                <Sparkles className="w-3.5 h-3.5" />
                              ) : notif.type === 'Milestone' ? (
                                <Layers className="w-3.5 h-3.5" />
                              ) : (
                                <Users className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1.5">
                                <span
                                  className={`text-xs font-bold leading-snug line-clamp-1 ${
                                    !notif.read ? 'text-slate-900' : 'text-slate-700'
                                  }`}
                                >
                                  {notif.title}
                                </span>
                                <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-tight">
                                {notif.message}
                              </p>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {notif.type}
                                </span>
                                <span className="text-[10px] font-bold text-indigo-600 group-hover:text-indigo-800 flex items-center gap-0.5">
                                  <span>View</span>
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          </div>
                          {!notif.read && (
                            <span className="absolute left-1 top-4 w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Dropdown Bottom Bar */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotifDropdownOpen(false);
                        setCurrentView('university-notifications');
                      }}
                      className="w-full text-center py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Open Full Notifications Dossier &rarr;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Institution / User Profile Pill */}
            <button
              type="button"
              onClick={() => setCurrentView('university-profile')}
              className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer ${
                currentView === 'university-profile'
                  ? 'bg-indigo-950 border-indigo-400 text-white'
                  : 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-amber-300 font-bold text-xs flex items-center justify-center shadow-xs">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block whitespace-nowrap">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[140px]">
                  {currentUser.organization || 'BIT Mesra (Ranchi)'}
                </span>
                <span className="text-[10px] text-indigo-300 block leading-tight">
                  {currentUser.role === 'university_admin' ? 'HEI Admin' : currentUser.name}
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Body with Desktop Sidebar + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 lg:gap-8">
        {/* Desktop Sidebar (Left Navigation) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-5">
          {/* Main University Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-2xs space-y-4">
            {navItems.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const active = isCurrentActive(item.id);
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentView(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            active ? 'text-indigo-600' : 'text-slate-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                            item.badgeColor || 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Ecosystem Architecture Trigger Card */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEcosystemModalOpen(true)}
                className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>4-Pillar Platform Engine</span>
                </div>
                <p className="text-[10px] text-amber-800 leading-tight">
                  Discover &rarr; Express Interest &rarr; Official Assignment &rarr; Workspace Lifecycle
                </p>
                <span className="text-[10px] font-bold text-amber-900 group-hover:underline inline-flex items-center gap-1 mt-1.5">
                  <span>View Full System Architecture</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            </div>

            {/* Logout Divider */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Logout Portal</span>
              </button>
            </div>
          </div>

          {/* Institutional Status & Accreditation Badge */}
          <div className="bg-[#fbf8ee] rounded-2xl p-4 border border-[#e2d6bc] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <Award className="w-4 h-4 text-amber-500" />
                <span>NAAC A++ Certified</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-emerald-800 font-mono border border-[#e2d6bc]">
                AISHE: U-0275
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-700 border-t border-[#e2d6bc] pt-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Active Innovators:</span>
                <span className="font-bold text-slate-900">48 Students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">R&D / CSR Grants:</span>
                <span className="font-bold text-emerald-800">₹42.5 Lakhs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patents Filed:</span>
                <span className="font-bold text-slate-900">12 Applications</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      <Footer />

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <JharkhandEmblem size={30} />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">
                      University Portal
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      HEI R&D Cell
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items */}
              {navItems.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    {group.group}
                  </div>
                  {group.items.map((item) => {
                    const active = isCurrentActive(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCurrentView(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.badgeColor || 'bg-indigo-100 text-indigo-900'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 mt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setCurrentView('university-dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'university-dashboard'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('university-challenges')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'university-challenges'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Challenges</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('university-teams')}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-white transition-transform active:scale-95 cursor-pointer -mt-4"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md ring-2 ring-white">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-slate-900">Teams</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('university-proposals')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'university-proposals'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Proposals</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('university-profile')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'university-profile'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Global Ecosystem Architecture & Knowledge Layer Modal */}
      <EcosystemArchitectureModal
        isOpen={isEcosystemModalOpen}
        onClose={() => setIsEcosystemModalOpen(false)}
      />
    </div>
  );
};
