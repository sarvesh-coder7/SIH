import React from 'react';
import { useApp } from '../../context/AppContext';
import { JharkhandEmblem } from '../common/JharkhandEmblem';
import { Footer } from '../common/Footer';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Compass,
  Bell,
  User as UserIcon,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export const CitizenLayout: React.FC<CitizenLayoutProps> = ({ children }) => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    unreadNotifsCount,
    showToast,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    {
      id: 'citizen-dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: 'submit-challenge' as const,
      label: 'Report a Problem',
      icon: PlusCircle,
      isPrimaryAction: true,
    },
    {
      id: 'citizen-my-challenges' as const,
      label: 'My Challenges',
      icon: FileText,
      badge: undefined,
    },
    {
      id: 'explore-challenges' as const,
      label: 'Explore Challenges',
      icon: Compass,
      badge: undefined,
    },
    {
      id: 'citizen-notifications' as const,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
    },
    {
      id: 'citizen-profile' as const,
      label: 'Profile & Settings',
      icon: UserIcon,
      badge: undefined,
    },
  ];

  const handleLogout = () => {
    showToast('info', 'Logged Out', 'You have securely logged out of the Citizen Portal.');
    setCurrentView('role-selection');
  };

  const isCurrentActive = (viewId: string) => {
    if (viewId === currentView) return true;
    if (viewId === 'citizen-my-challenges' && currentView === 'challenge-detail') return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              onClick={() => setCurrentView('citizen-dashboard')}
              className="flex items-center gap-3 cursor-pointer group shrink-0"
            >
              <JharkhandEmblem size={38} className="ring-1 ring-emerald-600/30 shadow-xs" />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-800 transition-colors whitespace-nowrap">
                    JH INNOVATION CONNECT
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/60 uppercase tracking-wider whitespace-nowrap">
                    Citizen / Community
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block mt-0.5 whitespace-nowrap">
                  Govt. of Jharkhand &bull; Grassroots Problem Reporting
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Quick Report CTA in Header on Desktop */}
            <button
              type="button"
              onClick={() => setCurrentView('submit-challenge')}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>+ Report a Problem</span>
            </button>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setCurrentView('citizen-notifications')}
              className={`relative p-2 rounded-xl border transition-colors cursor-pointer ${
                currentView === 'citizen-notifications'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <button
              type="button"
              onClick={() => setCurrentView('citizen-profile')}
              className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer ${
                currentView === 'citizen-profile'
                  ? 'bg-amber-50/80 border-amber-300 text-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              {currentUser.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="text-left hidden sm:block whitespace-nowrap">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  {currentUser.district} District
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Body with Desktop Sidebar + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Sidebar (Left Navigation) */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-6">
          {/* Main Citizen Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Citizen Portal
            </div>

            {navItems.map((item) => {
              const active = isCurrentActive(item.id);
              const Icon = item.icon;

              if (item.isPrimaryAction) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all my-1.5 cursor-pointer ${
                      active
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-gradient-to-r from-amber-400/90 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-950" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-950/10 font-black">
                      NEW
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    active
                      ? 'bg-amber-50 text-amber-950 font-bold border border-amber-200/80 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        active ? 'text-amber-600' : 'text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Help & Privacy Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
              Support & Guidelines
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('citizen-help')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentView === 'citizen-help'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>Help & Support</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('citizen-privacy')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentView === 'citizen-privacy'
                  ? 'bg-slate-100 text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-slate-600" />
              <span>Privacy & Trust</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Citizen Trust Note */}
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 rounded-2xl border border-amber-200/60 p-4 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>How it Works</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              When you report a problem, the platform verifies it and connects the right Jharkhand Universities and partners to build real solutions.
            </p>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      <Footer />

      {/* Mobile Drawer (When hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-50 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <JharkhandEmblem size={32} />
                  <span className="font-bold text-xs text-slate-900">
                    Citizen Portal
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
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
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                        active
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('citizen-help');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('citizen-privacy');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  <Shield className="w-4 h-4" />
                  <span>Privacy</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Matching Requirement 2 & 39) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => setCurrentView('citizen-dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'citizen-dashboard'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('submit-challenge')}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-950 transition-transform active:scale-95 cursor-pointer -mt-4"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md ring-2 ring-white">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span>Report</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('citizen-my-challenges')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'citizen-my-challenges' || currentView === 'challenge-detail'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Reports</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('explore-challenges')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'explore-challenges'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Explore</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('citizen-profile')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors cursor-pointer ${
            currentView === 'citizen-profile'
              ? 'text-amber-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};
