import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JharkhandEmblem } from '../common/JharkhandEmblem';
import { EcosystemArchitectureModal } from '../common/EcosystemArchitectureModal';

import {
  LayoutDashboard,
  Sparkles,
  Users,
  FileText,
  Layers,
  Bell,
  User as UserIcon,
  Award,
  LogOut,
  Menu,
  X,
  Building2,
  Search,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Check,
  Rocket,
  FlaskConical,
  Settings,
  Handshake,
  FileCheck,
  MessageSquare,
  GraduationCap,
} from 'lucide-react';

interface AcademicNotif {
  id: string;
  title: string;
  message: string;
  type:
    | 'Funding'
    | 'AI Match'
    | 'Milestone'
    | 'Co-Mentorship'
    | 'Patent';
  timestamp: string;
  read: boolean;
  actionView: string;
}

const INITIAL_ACADEMIC_NOTIFICATIONS: AcademicNotif[] = [
  {
    id: 'NOTIF-ACAD-01',
    title: 'CSR Grant Sanctioned: ₹3.50 Lakhs (Tata Steel CSR)',
    message:
      'Tranche-1 grant disbursed to BIT Mesra innovation fund for Torpa water filtration pilot.',
    type: 'Funding',
    timestamp: '2h ago',
    read: false,
    actionView: 'university-proposals',
  },
  {
    id: 'NOTIF-ACAD-02',
    title: 'AI Priority Match (94% Score): Torpa Fluoride Issue',
    message:
      'Automated problem triage routed high-priority Khunti water challenge to Chemical & IoT faculty.',
    type: 'AI Match',
    timestamp: '5h ago',
    read: false,
    actionView: 'university-challenges',
  },
  {
    id: 'NOTIF-ACAD-03',
    title: 'Milestone 4 Verified by State PMU / JSHEC',
    message:
      'Lab spectrometry calibration report validated. Cleared for Torpa village field pilot.',
    type: 'Milestone',
    timestamp: '1d ago',
    read: false,
    actionView: 'project-workspace',
  },
  {
    id: 'NOTIF-ACAD-04',
    title: 'Industry Co-Mentor Joined: Central Coalfields Ltd',
    message:
      'Er. Rajiv Prasad (CGM Environment) confirmed mentorship for capstone student cohort.',
    type: 'Co-Mentorship',
    timestamp: '2d ago',
    read: true,
    actionView: 'university-teams',
  },
  {
    id: 'NOTIF-ACAD-05',
    title: 'Patent Prior Art Clearance: Indian Patent #202631008472',
    message:
      'State IP facilitation cell cleared novelty search with zero conflicting citations.',
    type: 'Patent',
    timestamp: '3d ago',
    read: true,
    actionView: 'project-workspace',
  },
];

interface UniversityLayoutProps {
  children: React.ReactNode;
}

export const UniversityLayout: React.FC<UniversityLayoutProps> = ({
  children,
}) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    showToast,
    challenges,
    projects,
    isEcosystemModalOpen,
    setIsEcosystemModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [notifsList, setNotifsList] = useState<AcademicNotif[]>(
    INITIAL_ACADEMIC_NOTIFICATIONS
  );
  const [notifFilter, setNotifFilter] = useState<
    'all' | 'unread' | 'grants' | 'ai'
  >('all');

  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifsList.filter((n) => !n.read).length;

  const incomingChallengesCount = challenges.filter(
    (c) =>
      c.status === 'University Matching' ||
      c.status === 'Validated' ||
      c.trustStatus === 'Verified' ||
      c.openForSolutions === true
  ).length;

  const isStudent = currentUser.role === 'student';

  /* ---------------------------------------------------------
     CLOSE NOTIFICATION DROPDOWN ON OUTSIDE CLICK / ESC
  --------------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
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

  /* ---------------------------------------------------------
     NAVIGATION
  --------------------------------------------------------- */

  const universityNavItems = [
    {
      group: 'Core Navigation',
      items: [
        {
          id: 'university-dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'university-challenges',
          label: 'Verified Challenges',
          icon: Search,
          badge:
            incomingChallengesCount > 0
              ? `${incomingChallengesCount} Open`
              : null,
          badgeColor: 'bg-amber-500 text-slate-950',
        },
        {
          id: 'university-projects',
          label: 'My Projects',
          icon: Rocket,
          badge: `${projects.length} Active`,
          badgeColor: 'bg-emerald-600 text-white',
        },
        {
          id: 'university-proposals',
          label: 'Project Proposals',
          icon: FileText,
          badge: 'Formulator',
          badgeColor: 'bg-blue-100 text-blue-800',
        },
        {
          id: 'university-collaborate',
          label: 'Collaborate & Partner',
          icon: Handshake,
          badge: 'MoU & CSR',
          badgeColor: 'bg-amber-100 text-amber-900',
        },
        {
          id: 'university-funding',
          label: 'Funding Opportunities',
          icon: DollarSign,
          badge: '₹42.5L',
          badgeColor: 'bg-teal-100 text-teal-900',
        },
        {
          id: 'university-messages',
          label: 'Messages',
          icon: MessageSquare,
          badge: unreadCount > 0 ? `${unreadCount}` : null,
          badgeColor: 'bg-indigo-600 text-white',
        },
        {
          id: 'university-reports',
          label: 'Reports & Analytics',
          icon: FileCheck,
        },
        {
          id: 'university-settings',
          label: 'Profile & Settings',
          icon: Settings,
        },
      ],
    },
  ];

  const studentNavItems = [
    {
      group: 'Student Researcher Hub',
      items: [
        {
          id: 'student-dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'student-projects',
          label: 'My Projects',
          icon: Rocket,
          badge: 'Capstone',
          badgeColor: 'bg-blue-600 text-white',
        },
        {
          id: 'student-experiments',
          label: 'Research & Experiments',
          icon: FlaskConical,
          badge: '18 Runs',
          badgeColor: 'bg-indigo-100 text-indigo-800',
        },
        {
          id: 'student-contributions',
          label: 'My Contributions',
          icon: FileText,
          badge: '12 ABC',
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
          id: 'student-team',
          label: 'My Team',
          icon: Users,
        },
        {
          id: 'student-notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadCount > 0 ? `${unreadCount}` : null,
          badgeColor: 'bg-rose-500 text-white',
        },
      ],
    },
    {
      group: 'Preferences',
      items: [
        {
          id: 'student-settings',
          label: 'Settings',
          icon: Settings,
        },
      ],
    },
  ];

  const navItems = isStudent
    ? studentNavItems
    : universityNavItems;

  /* ---------------------------------------------------------
     ACTIVE STATE
  --------------------------------------------------------- */

  const isCurrentActive = (viewId: string) => {
    if (viewId === currentView) return true;

    if (
      viewId === 'university-projects' &&
      (
        currentView === 'project-workspace' ||
        currentView === 'project-detail' ||
        currentView === 'university-milestones'
      )
    ) {
      return true;
    }

    if (
      viewId === 'university-challenges' &&
      (
        currentView === 'challenge-detail' ||
        currentView === 'citizen-challenge-detail'
      )
    ) {
      return true;
    }

    if (
      viewId === 'university-collaborate' &&
      (
        currentView === 'university-industry' ||
        currentView === 'university-teams'
      )
    ) {
      return true;
    }

    if (
      viewId === 'university-settings' &&
      currentView === 'university-profile'
    ) {
      return true;
    }

    if (
      viewId === 'university-messages' &&
      currentView === 'messages'
    ) {
      return true;
    }

    if (
      viewId === 'student-projects' &&
      (
        currentView === 'project-workspace' ||
        currentView === 'project-detail'
      )
    ) {
      return true;
    }

    return false;
  };

  /* ---------------------------------------------------------
     HELPERS
  --------------------------------------------------------- */

  const navigate = (view: string) => {
    setCurrentView(view as any);
    setMobileMenuOpen(false);
    setIsNotifDropdownOpen(false);
  };

  const handleLogout = () => {
    showToast(
      'info',
      'Logged Out',
      'You have securely logged out of the Higher Education Institution Portal.'
    );

    setCurrentView('role-selection');
  };

  const handleMarkAllNotifsRead = () => {
    setNotifsList((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    );

    showToast(
      'success',
      'All Notifications Read',
      'Marked all academic notifications as read.'
    );
  };

  const handleNotifClick = (notification: AcademicNotif) => {
    setNotifsList((prev) =>
      prev.map((item) =>
        item.id === notification.id
          ? { ...item, read: true }
          : item
      )
    );

    setIsNotifDropdownOpen(false);

    if (notification.actionView) {
      setCurrentView(notification.actionView as any);

      showToast(
        'info',
        notification.title,
        'Navigated to related module.'
      );
    }
  };

  const filteredNotifs = notifsList.filter((notification) => {
    if (notifFilter === 'unread') {
      return !notification.read;
    }

    if (notifFilter === 'grants') {
      return notification.type === 'Funding';
    }

    if (notifFilter === 'ai') {
      return notification.type === 'AI Match';
    }

    return true;
  });

  const institutionName =
    currentUser.organization ||
    'Birla Institute of Technology (BIT Mesra), Ranchi';

  const profileName =
    currentUser.name ||
    'HEI Administrator';

  const profileInitials =
    institutionName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('') || 'HE';

  const pageLabel =
    currentView
      .replace('university-', '')
      .replace('student-', '')
      .replace(/-/g, ' ') || 'dashboard';

  /* ---------------------------------------------------------
     PROFILE AVATAR
  --------------------------------------------------------- */

  const ProfileAvatar = ({
    size = 'normal',
  }: {
    size?: 'small' | 'normal';
  }) => {
    const sizeClass =
      size === 'small'
        ? 'w-9 h-9 rounded-xl text-[10px]'
        : 'w-10 h-10 rounded-xl text-xs';

    if (currentUser.avatarUrl) {
      return (
        <img
          src={currentUser.avatarUrl}
          alt="University profile"
          className={`${sizeClass} object-cover border border-indigo-100 shrink-0`}
        />
      );
    }

    return (
      <div
        className={`${sizeClass} bg-indigo-50 border border-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0`}
      >
        {profileInitials || (
          <GraduationCap className="w-4 h-4" />
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-slate-100 flex text-slate-800 font-sans antialiased overflow-hidden">

      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 h-full w-[280px] bg-slate-50 text-slate-700 flex flex-col border-r border-slate-200 transition-transform duration-300 ease-out shrink-0 ${
          mobileMenuOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >

        {/* -------------------------------------------------
            BRAND HEADER
        ------------------------------------------------- */}
        <div className="px-4 pt-4 pb-4 shrink-0">

          <div className="flex items-center justify-between px-2">

            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer"
              onClick={() => navigate('university-dashboard')}
            >

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>

              <div className="min-w-0">

                <div className="text-[12px] font-black tracking-[0.04em] text-slate-900 uppercase truncate">
                  JH Innovation Connect
                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />

                  <span className="text-[9px] text-indigo-700 font-bold uppercase tracking-[0.14em]">
                    University Portal
                  </span>
                </div>

              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

          {/* -------------------------------------------------
              INSTITUTION CARD
          ------------------------------------------------- */}
          <button
            type="button"
            onClick={() => navigate('university-profile')}
            className="mt-5 w-full text-left rounded-2xl bg-white border border-slate-200 shadow-sm p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition"
          >

            <div className="text-[9px] uppercase tracking-[0.12em] font-bold text-slate-500">
              Affiliated Institution
            </div>

            <div className="mt-1.5 text-[12px] font-bold text-slate-900 truncate">
              {institutionName}
            </div>

            <div className="mt-2.5 flex items-center gap-1.5 text-[9px] font-semibold text-indigo-700">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />

              <span className="truncate">
                State Verified Higher Education Institution
              </span>
            </div>

          </button>
        </div>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">

          {/* MAIN NAV */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">

            {navItems.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="mb-3 last:mb-0"
              >

                <div className="px-3 pt-2 pb-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.14em]">
                  {group.group}
                </div>

                <div className="space-y-1">

                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isCurrentActive(item.id);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.id)}
                        className={`group w-full min-h-[42px] flex items-center justify-between gap-2 px-3 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-100 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >

                        <div className="flex items-center gap-3 min-w-0">

                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                              active
                                ? 'bg-indigo-600 text-white'
                                : 'bg-transparent text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
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
                              active
                                ? 'bg-indigo-600 text-white'
                                : item.badgeColor ||
                                  'bg-indigo-100 text-indigo-700'
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
            ))}

            {/* LOGOUT */}
            <div className="mt-2 pt-2 border-t border-slate-100">

              <button
                type="button"
                onClick={handleLogout}
                className="w-full min-h-[42px] flex items-center gap-3 px-3 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition"
              >

                <div className="w-7 h-7 rounded-lg flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>

                <span>Logout Portal</span>

              </button>

            </div>

          </div>

          {/* -------------------------------------------------
              ACCREDITATION CARD
          ------------------------------------------------- */}
          {!isStudent && (
            <div className="mt-4 bg-[#fbf8ee] rounded-2xl p-4 border border-[#e2d6bc] shadow-sm space-y-3">

              <div className="flex items-center justify-between gap-2">

                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>NAAC A++ Certified</span>
                </div>

                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-emerald-800 font-mono border border-[#e2d6bc]">
                  AISHE: U-0275
                </span>

              </div>

              <div className="space-y-1.5 text-[11px] text-slate-700 border-t border-[#e2d6bc] pt-2">

                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">
                    Active Innovators:
                  </span>
                  <span className="font-bold text-slate-900">
                    48 Students
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">
                    R&D / CSR Grants:
                  </span>
                  <span className="font-bold text-emerald-800">
                    ₹42.5 Lakhs
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">
                    Patents Filed:
                  </span>
                  <span className="font-bold text-slate-900">
                    12 Applications
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* =====================================================
            BOTTOM PROFILE CARD
        ===================================================== */}
        <div className="px-4 pb-4 pt-2 shrink-0">

          <button
            type="button"
            onClick={() => navigate('university-profile')}
            className={`w-full p-3 rounded-2xl bg-white hover:bg-slate-50 border shadow-sm text-left flex items-center justify-between transition ${
              currentView === 'university-profile'
                ? 'border-indigo-300 bg-indigo-50/40 ring-2 ring-indigo-500/10'
                : 'border-slate-200'
            }`}
          >

            <div className="flex items-center gap-2.5 min-w-0">

              <ProfileAvatar size="small" />

              <div className="min-w-0">

                <div className="text-[11px] font-bold text-slate-900 truncate">
                  {currentUser.role === 'university_admin'
                    ? 'HEI Admin'
                    : profileName}
                </div>

                <div className="flex items-center gap-1 mt-0.5 text-[9px] text-indigo-700 font-semibold">
                  <span className="w-1 h-1 rounded-full bg-indigo-500" />

                  {currentUser.role === 'university_admin'
                    ? 'University Administrator'
                    : 'Student Researcher'}
                </div>

              </div>
            </div>

            <ChevronRight
              className={`w-4 h-4 shrink-0 transition-transform ${
                currentView === 'university-profile'
                  ? 'text-indigo-600 rotate-90'
                  : 'text-slate-400'
              }`}
            />

          </button>

        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-slate-100">

        {/* ===================================================
            TOP NAVBAR
        =================================================== */}
        <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div
              className="hidden sm:flex items-center gap-2 min-w-0 cursor-pointer"
              onClick={() => navigate('university-dashboard')}
            >

              <span className="text-[11px] font-semibold text-slate-400">
                JH Innovation Connect
              </span>

              <span className="text-slate-300">
                /
              </span>

              <span className="text-[11px] font-bold text-indigo-700 capitalize truncate">
                {pageLabel}
              </span>

            </div>

            <div className="sm:hidden min-w-0">

              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                University Portal
              </div>

              <div className="text-xs font-bold text-slate-800 capitalize truncate">
                {pageLabel}
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* QUICK ACTIONS */}
            <button
              type="button"
              onClick={() => navigate('university-teams')}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl shadow-sm transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Assemble Team</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('university-proposals')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-xl shadow-sm transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ New Proposal</span>
            </button>

            {/* NOTIFICATIONS */}
            <div
              className="relative"
              ref={notifDropdownRef}
            >

              <button
                type="button"
                onClick={() =>
                  setIsNotifDropdownOpen((prev) => !prev)
                }
                className={`relative w-9 h-9 rounded-xl border flex items-center justify-center transition ${
                  isNotifDropdownOpen ||
                  currentView === 'university-notifications'
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 ring-2 ring-indigo-500/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Notifications"
                aria-expanded={isNotifDropdownOpen}
              >

                <Bell className="w-4 h-4" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}

              </button>

              {/* NOTIFICATION DROPDOWN */}
              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[340px] sm:w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">

                  {/* HEADER */}
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5" />
                      </div>

                      <div>
                        <div className="font-bold text-xs">
                          Academic & R&D Alerts
                        </div>

                        <div className="text-[10px] text-slate-400">
                          Higher Education Institution Cell
                        </div>
                      </div>

                    </div>

                    {unreadCount > 0 ? (
                      <button
                        type="button"
                        onClick={handleMarkAllNotifsRead}
                        className="text-[9px] font-bold px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        Mark all read
                      </button>
                    ) : (
                      <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        All caught up
                      </span>
                    )}

                  </div>

                  {/* FILTERS */}
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto">

                    {[
                      ['all', 'All'],
                      ['unread', 'Unread'],
                      ['grants', 'CSR Grants'],
                      ['ai', 'AI Matches'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setNotifFilter(
                            value as
                              | 'all'
                              | 'unread'
                              | 'grants'
                              | 'ai'
                          )
                        }
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${
                          notifFilter === value
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}

                  </div>

                  {/* LIST */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">

                    {filteredNotifs.length === 0 ? (
                      <div className="py-10 text-center">

                        <Bell className="w-6 h-6 text-slate-300 mx-auto" />

                        <p className="text-xs font-semibold text-slate-600 mt-2">
                          No alerts in this category
                        </p>

                        <p className="text-[10px] text-slate-400 mt-1">
                          You are up to date with institutional R&D tasks.
                        </p>

                      </div>
                    ) : (
                      filteredNotifs.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() =>
                            handleNotifClick(notification)
                          }
                          className={`w-full text-left p-3 hover:bg-indigo-50/50 transition relative ${
                            !notification.read
                              ? 'bg-indigo-50/30'
                              : 'bg-white'
                          }`}
                        >

                          <div className="flex items-start gap-2.5">

                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                notification.type === 'Funding'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : notification.type === 'AI Match'
                                  ? 'bg-amber-100 text-amber-800'
                                  : notification.type === 'Milestone'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {notification.type === 'Funding' ? (
                                <DollarSign className="w-3.5 h-3.5" />
                              ) : notification.type === 'AI Match' ? (
                                <Sparkles className="w-3.5 h-3.5" />
                              ) : notification.type === 'Milestone' ? (
                                <Layers className="w-3.5 h-3.5" />
                              ) : (
                                <Users className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">

                              <div className="flex items-start justify-between gap-2">

                                <span
                                  className={`text-[11px] font-bold leading-snug ${
                                    !notification.read
                                      ? 'text-slate-900'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {notification.title}
                                </span>

                                <span className="text-[9px] text-slate-400 shrink-0">
                                  {notification.timestamp}
                                </span>

                              </div>

                              <p className="text-[10px] text-slate-600 leading-tight mt-1">
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between mt-2">

                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                  {notification.type}
                                </span>

                                <span className="text-[9px] font-bold text-indigo-600 flex items-center gap-0.5">
                                  View
                                  <ChevronRight className="w-3 h-3" />
                                </span>

                              </div>

                            </div>

                          </div>

                          {!notification.read && (
                            <span className="absolute left-1 top-4 w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          )}

                        </button>
                      ))
                    )}

                  </div>

                  {/* FOOTER */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100">

                    <button
                      type="button"
                      onClick={() => {
                        setIsNotifDropdownOpen(false);
                        navigate('university-notifications');
                      }}
                      className="w-full text-center py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-xl text-[10px] transition flex items-center justify-center gap-1.5"
                    >
                      <Bell className="w-3.5 h-3.5 text-indigo-600" />
                      Open Full Notifications
                      <span>→</span>
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                TOP RIGHT PROFILE
            ================================================= */}
            <button
              type="button"
              onClick={() => navigate('university-profile')}
              className={`hidden sm:flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition ${
                currentView === 'university-profile'
                  ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/10'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >

              <ProfileAvatar size="small" />

              <div className="text-left min-w-0">

                <div className="text-[11px] font-bold text-slate-900 truncate max-w-[150px]">
                  {institutionName}
                </div>

                <div className="text-[9px] text-indigo-700 font-semibold truncate">
                  {currentUser.role === 'university_admin'
                    ? 'HEI Admin'
                    : profileName}
                </div>

              </div>

            </button>

          </div>
        </header>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24">

          <div className="max-w-7xl w-full mx-auto">

            <div className="animate-in fade-in duration-200">
              {children}
            </div>

          </div>

        </main>

      </div>

      {/* =====================================================
          MOBILE NAVIGATION DRAWER
      ===================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-slate-50 shadow-2xl flex flex-col">

            {/* MOBILE HEADER */}
            <div className="px-4 pt-4 pb-4">

              <div className="flex items-center justify-between">

                <button
                  type="button"
                  onClick={() => navigate('university-dashboard')}
                  className="flex items-center gap-3"
                >

                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md">
                    <GraduationCap className="w-5 h-5" />
                  </div>

                  <div className="text-left">
                    <div className="text-[11px] font-black text-slate-900 uppercase">
                      JH Innovation Connect
                    </div>

                    <div className="text-[9px] text-indigo-700 font-bold uppercase tracking-wider">
                      University Portal
                    </div>
                  </div>

                </button>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* MOBILE PROFILE */}
              <button
                type="button"
                onClick={() => navigate('university-profile')}
                className="mt-4 w-full p-3 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3 text-left"
              >

                <ProfileAvatar />

                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 truncate">
                    {institutionName}
                  </div>

                  <div className="text-[9px] text-indigo-700 font-semibold mt-0.5">
                    {currentUser.role === 'university_admin'
                      ? 'HEI Admin'
                      : profileName}
                  </div>
                </div>

              </button>

            </div>

            {/* MOBILE NAV */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">

                {navItems.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="mb-3 last:mb-0"
                  >

                    <div className="px-3 pt-2 pb-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.14em]">
                      {group.group}
                    </div>

                    <div className="space-y-1">

                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isCurrentActive(item.id);

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => navigate(item.id)}
                            className={`w-full min-h-[42px] flex items-center justify-between gap-2 px-3 rounded-xl text-[11px] font-bold transition ${
                              active
                                ? 'bg-indigo-50 text-indigo-800 border border-indigo-100'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >

                            <div className="flex items-center gap-3 min-w-0">

                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                  active
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400'
                                }`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>

                              <span className="truncate">
                                {item.label}
                              </span>

                            </div>

                            {item.badge && (
                              <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[8px] font-black">
                                {item.badge}
                              </span>
                            )}

                          </button>
                        );
                      })}

                    </div>

                  </div>
                ))}

                <div className="mt-2 pt-2 border-t border-slate-100">

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full min-h-[42px] flex items-center gap-3 px-3 rounded-xl text-[11px] font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout Portal</span>
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          MOBILE BOTTOM NAV
      ===================================================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">

        <button
          type="button"
          onClick={() => navigate('university-dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentView === 'university-dashboard'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('university-challenges')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentView === 'university-challenges'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Challenges</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('university-teams')}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-900 -mt-4"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-md ring-2 ring-white">
            <Users className="w-5 h-5" />
          </div>

          <span>Teams</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('university-proposals')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentView === 'university-proposals'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Proposals</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('university-profile')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            currentView === 'university-profile'
              ? 'text-indigo-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt="Profile"
              className="w-5 h-5 rounded-md object-cover"
            />
          ) : (
            <UserIcon className="w-4 h-4" />
          )}

          <span>Profile</span>
        </button>

      </nav>

      {/* =====================================================
          ECOSYSTEM MODAL
      ===================================================== */}
      <EcosystemArchitectureModal
        isOpen={isEcosystemModalOpen}
        onClose={() => setIsEcosystemModalOpen(false)}
      />

    </div>
  );
};