import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Users,
  GraduationCap,
  Award,
  Briefcase,
  Rocket,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export interface RoleConfig {
  id: string;
  name: string;
  subtitle: string;
  role: UserRole;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  points: [string, string, string];
  accentColor: {
    border: string;
    bg: string;
    text: string;
    button: string;
    glow: string;
    chip: string;
    iconBg: string;
  };
  targetView: string;
}

export const SIX_ROLES: RoleConfig[] = [
  {
    id: 'citizen',
    name: 'CITIZEN / COMMUNITY',
    subtitle: 'Grassroots Problem Reporter',
    role: 'citizen',
    badge: 'Grassroots & PRIs',
    icon: Users,
    points: [
      'Report local problems',
      'Track submissions',
      'See community impact',
    ],
    accentColor: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-950',
      button: 'bg-emerald-700 hover:bg-emerald-800 text-white',
      glow: 'shadow-emerald-500/25 ring-emerald-500/30',
      chip: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      iconBg: 'bg-emerald-600 text-white',
    },
    targetView: 'citizen-dashboard',
  },
  {
    id: 'university',
    name: 'UNIVERSITY / HEI',
    subtitle: 'Higher Education Institutions',
    role: 'university_admin',
    badge: 'Academia & R&D',
    icon: GraduationCap,
    points: [
      'Find suitable challenges',
      'Build student teams',
      'Develop solutions',
    ],
    accentColor: {
      border: 'border-indigo-500',
      bg: 'bg-indigo-50/70',
      text: 'text-indigo-950',
      button: 'bg-indigo-700 hover:bg-indigo-800 text-white',
      glow: 'shadow-indigo-500/25 ring-indigo-500/30',
      chip: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      iconBg: 'bg-indigo-600 text-white',
    },
    targetView: 'university-dashboard',
  },
  {
    id: 'faculty',
    name: 'FACULTY / MENTOR',
    subtitle: 'Domain Experts & Professors',
    role: 'faculty_mentor',
    badge: 'Mentorship & Advisory',
    icon: Award,
    points: [
      'Mentor student teams',
      'Review proposals',
      'Guide projects',
    ],
    accentColor: {
      border: 'border-sky-500',
      bg: 'bg-sky-50/70',
      text: 'text-sky-950',
      button: 'bg-sky-700 hover:bg-sky-800 text-white',
      glow: 'shadow-sky-500/25 ring-sky-500/30',
      chip: 'bg-sky-100 text-sky-800 border-sky-300',
      iconBg: 'bg-sky-600 text-white',
    },
    targetView: 'university-proposals',
  },
  {
    id: 'industry',
    name: 'INDUSTRY / CSR / PARTNER',
    subtitle: 'Corporate & Funding Partners',
    role: 'csr_org',
    badge: 'Sponsors & Deployment',
    icon: Briefcase,
    points: [
      'Fund projects',
      'Provide technology',
      'Support deployment',
    ],
    accentColor: {
      border: 'border-purple-500',
      bg: 'bg-purple-50/70',
      text: 'text-purple-950',
      button: 'bg-purple-700 hover:bg-purple-800 text-white',
      glow: 'shadow-purple-500/25 ring-purple-500/30',
      chip: 'bg-purple-100 text-purple-800 border-purple-300',
      iconBg: 'bg-purple-600 text-white',
    },
    targetView: 'industry-dashboard',
  },
  {
    id: 'startup',
    name: 'STARTUP / MSME',
    subtitle: 'Innovators & Enterprises',
    role: 'industry_msme',
    badge: 'Scale & Commercialization',
    icon: Rocket,
    points: [
      'Build solutions',
      'Collaborate with universities',
      'Scale innovations',
    ],
    accentColor: {
      border: 'border-amber-500',
      bg: 'bg-amber-50/70',
      text: 'text-amber-950',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      glow: 'shadow-amber-500/25 ring-amber-500/30',
      chip: 'bg-amber-100 text-amber-900 border-amber-300',
      iconBg: 'bg-amber-600 text-white',
    },
    targetView: 'industry-dashboard',
  },
  {
    id: 'government',
    name: 'GOVERNMENT / ADMIN',
    subtitle: 'State PMU & Line Departments',
    role: 'govt_department',
    badge: 'Policy & Validation',
    icon: ShieldCheck,
    points: [
      'Review challenges',
      'Coordinate stakeholders',
      'Monitor impact',
    ],
    accentColor: {
      border: 'border-slate-800',
      bg: 'bg-slate-100',
      text: 'text-slate-950',
      button: 'bg-slate-900 hover:bg-slate-800 text-amber-300',
      glow: 'shadow-slate-900/25 ring-slate-800/30',
      chip: 'bg-slate-200 text-slate-800 border-slate-300',
      iconBg: 'bg-slate-900 text-amber-400',
    },
    targetView: 'government-dashboard',
  },
];

interface RoleCarouselProps {
  onRoleSelect?: (role: RoleConfig) => void;
  onOpenAuthModal?: (role: RoleConfig, mode: 'login' | 'signup') => void;
}

export const RoleCarousel: React.FC<RoleCarouselProps> = ({
  onRoleSelect,
}) => {
  const { switchRole, setCurrentView, showToast } = useApp();

  // Continuous virtual index (allows infinite scrolling in both directions)
  const [virtualIndex, setVirtualIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Normalized active index (0 to 5)
  const activeNormalizedIndex = ((virtualIndex % 6) + 6) % 6;
  const activeRole = SIX_ROLES[activeNormalizedIndex];

  // Continuous infinite step forward (Right)
  const handleNext = useCallback(() => {
    setVirtualIndex((prev) => prev + 1);
  }, []);

  // Continuous infinite step backward (Left)
  const handlePrev = useCallback(() => {
    setVirtualIndex((prev) => prev - 1);
  }, []);

  // Move directly to a specific role using the shortest circular path
  const handleGoToRole = useCallback(
    (targetIndex: number) => {
      let diff = (targetIndex - activeNormalizedIndex) % 6;
      if (diff > 3) diff -= 6;
      if (diff < -3) diff += 6;
      setVirtualIndex((prev) => prev + diff);
    },
    [activeNormalizedIndex]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch Swipe handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Move Forward
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Move Backward
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Perform Role Selection
  const handleSelectRole = (roleConfig: RoleConfig) => {
    if (onRoleSelect) {
      onRoleSelect(roleConfig);
      return;
    }

    switchRole(roleConfig.role);
    showToast(
      'success',
      `Role Selected: ${roleConfig.name}`,
      `Entering ${roleConfig.name} dashboard environment.`
    );
    setCurrentView(roleConfig.targetView as any);
  };

  return (
    <div
      className="relative w-full max-w-6xl mx-auto select-none py-4"
      ref={containerRef}
    >
      {/* PERSPECTIVE CAROUSEL STAGE */}
      <div
        className="relative h-[390px] sm:h-[420px] w-full flex items-center justify-center overflow-hidden touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: '1200px' }}
      >
        {/* CARDS RENDERING */}
        {SIX_ROLES.map((roleConfig, idx) => {
          // Calculate circular relative offset from current active index
          let offset = (idx - activeNormalizedIndex) % 6;
          if (offset > 3) offset -= 6;
          if (offset < -3) offset += 6;

          const isCenter = offset === 0;
          const isImmediateNeighbor = Math.abs(offset) === 1;
          const isFarNeighbor = Math.abs(offset) === 2;

          const IconComponent = roleConfig.icon;

          // CSS transformation calculations
          let transformStyle = '';
          let opacity = 0;
          let zIndex = 0;
          let pointerEvents: 'auto' | 'none' = 'none';

          if (isCenter) {
            transformStyle = 'translateX(0px) scale(1.04) rotateY(0deg)';
            opacity = 1;
            zIndex = 30;
            pointerEvents = 'auto';
          } else if (offset === 1) {
            transformStyle = 'translateX(clamp(200px, 42vw, 320px)) scale(0.88) rotateY(-12deg)';
            opacity = 0.75;
            zIndex = 20;
            pointerEvents = 'auto';
          } else if (offset === -1) {
            transformStyle = 'translateX(clamp(-320px, -42vw, -200px)) scale(0.88) rotateY(12deg)';
            opacity = 0.75;
            zIndex = 20;
            pointerEvents = 'auto';
          } else if (offset === 2) {
            transformStyle = 'translateX(clamp(360px, 75vw, 540px)) scale(0.72) rotateY(-20deg)';
            opacity = 0.3;
            zIndex = 10;
            pointerEvents = 'auto';
          } else if (offset === -2) {
            transformStyle = 'translateX(clamp(-540px, -75vw, -360px)) scale(0.72) rotateY(20deg)';
            opacity = 0.3;
            zIndex = 10;
            pointerEvents = 'auto';
          } else {
            transformStyle = 'translateX(0px) scale(0.5) rotateY(0deg)';
            opacity = 0;
            zIndex = 0;
            pointerEvents = 'none';
          }

          return (
            <div
              key={roleConfig.id}
              onClick={() => {
                if (isCenter) {
                  handleSelectRole(roleConfig);
                } else {
                  setVirtualIndex((prev) => prev + offset);
                }
              }}
              style={{
                transform: transformStyle,
                opacity,
                zIndex,
                pointerEvents,
                transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1), opacity 450ms ease, box-shadow 450ms ease',
                willChange: 'transform, opacity',
              }}
              className={`absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-3xl bg-white border-2 flex flex-col justify-between overflow-hidden ${
                isCenter
                  ? `w-[310px] sm:w-[360px] h-[340px] sm:h-[370px] shadow-2xl ring-4 ${roleConfig.accentColor.border} ${roleConfig.accentColor.glow}`
                  : isImmediateNeighbor
                  ? `w-[270px] sm:w-[320px] h-[300px] sm:h-[330px] shadow-lg border-slate-200 hover:border-slate-400`
                  : isFarNeighbor
                  ? `w-[240px] sm:w-[280px] h-[260px] sm:h-[290px] shadow-sm border-slate-200 hidden sm:flex`
                  : 'w-[200px] h-[240px]'
              }`}
            >
              {/* CARD TOP BANNER */}
              <div
                className={`p-4 sm:p-5 border-b flex items-start justify-between ${
                  isCenter ? roleConfig.accentColor.bg : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs ${roleConfig.accentColor.iconBg}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleConfig.accentColor.chip}`}
                    >
                      {roleConfig.badge}
                    </span>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 mt-1 leading-tight tracking-tight">
                      {roleConfig.name}
                    </h3>
                  </div>
                </div>

                {isCenter && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-200 shrink-0"></span>
                )}
              </div>

              {/* CARD BODY: 3 CONCISE BULLET POINTS */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center space-y-2.5 bg-white">
                {roleConfig.points.map((point, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2.5">
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        isCenter ? 'text-emerald-700 font-bold' : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-[13px] leading-snug ${
                        isCenter
                          ? 'text-slate-800 font-medium'
                          : 'text-slate-500 font-normal'
                      }`}
                    >
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              {/* CARD FOOTER & ACTION */}
              <div
                className={`p-3.5 sm:p-4 border-t flex items-center justify-between ${
                  isCenter ? 'bg-slate-50' : 'bg-slate-50/60'
                }`}
              >
                {isCenter ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(roleConfig);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 ${roleConfig.accentColor.button}`}
                  >
                    <span>Select Role & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-900 py-1">
                    Click to Focus &rarr;
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* LEFT ARROW (ALWAYS ENABLED) */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Role"
          className="absolute left-2 sm:left-4 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-300 hover:border-emerald-600 text-slate-800 hover:text-emerald-700 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* RIGHT ARROW (ALWAYS ENABLED) */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Role"
          className="absolute right-2 sm:right-4 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/95 backdrop-blur-xs border border-slate-300 hover:border-emerald-600 text-slate-800 hover:text-emerald-700 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* PAGINATION DOTS */}
      <div className="flex flex-col items-center justify-center gap-2 mt-4">
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 backdrop-blur-xs rounded-full border border-slate-300">
          {SIX_ROLES.map((r, dotIdx) => {
            const isActive = dotIdx === activeNormalizedIndex;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleGoToRole(dotIdx)}
                title={r.name}
                aria-label={`Select ${r.name}`}
                className={`transition-all duration-300 rounded-full cursor-pointer flex items-center justify-center ${
                  isActive
                    ? 'w-7 sm:w-8 h-3 bg-emerald-700 ring-2 ring-emerald-400'
                    : 'w-3 h-3 bg-slate-400 hover:bg-slate-600'
                }`}
              />
            );
          })}
        </div>

        {/* Active Role Quick Name Indicator */}
        <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mt-1">
          <span className="text-slate-400 font-mono">
            Role {activeNormalizedIndex + 1} of 6:
          </span>
          <span className="text-slate-900 font-extrabold uppercase">
            {activeRole.name}
          </span>
        </div>
      </div>
    </div>
  );
};
