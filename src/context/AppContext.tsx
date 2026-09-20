import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Challenge,
  ProjectLifecycle,
  NotificationItem,
  IndustryOrganization,
  IndustryMember,
  IndustryMemberRole,
  IndustryCapabilities,
  ProjectIndustryCollaboration,
  ProjectReportDocument,
  TechnicalFeedbackItem,
  CollaborationSupportType,
  IndustryContribution,
  GovernmentDepartment,
  GovernmentMember,
  GovernmentSupportAction,
  ActivityLogItem,
  ModerationRecord,
  GovernmentAccessLevel,
  IndustrySolutionSubmission,
} from '../types';
import { MOCK_USERS, MOCK_CHALLENGES } from '../mock/data';

import {
  MOCK_GOVERNMENT_DEPARTMENTS,
  MOCK_GOVERNMENT_MEMBERS,
  MOCK_SUPPORT_ACTIONS,
  MOCK_ACTIVITY_LOGS,
  MOCK_MODERATION_RECORDS,
} from '../mock/governmentData';
import { challengeService, isValidUUID } from '../services/challengeService';
import { projectService } from '../services/projectService';
import { communicationService } from '../services/communicationService';
import { authService } from '../services/authService';
import { getViewRoutePath, getRouteViewInfo } from '../router/routeUtils';
import { supabase } from '../lib/supabase';


export type AppView =
  | 'landing'
  | 'role-selection'
  | 'login'
  | 'signup'
  | 'about'
  | 'how-it-works'
  | 'explore-challenges'
  | 'challenge-detail'
  | 'citizen-challenge-detail'
  | 'submit-challenge'
  | 'universities'
  | 'industry'
  | 'impact'
  | 'map-view'
  | 'messages'
  | 'citizen-dashboard'
  | 'citizen-my-challenges'
  | 'citizen-notifications'
  | 'citizen-profile'
  | 'citizen-help'
  | 'citizen-privacy'
  | 'university-dashboard'
  | 'university-challenges'
  | 'university-applications'
  | 'university-teams'
  | 'university-proposals'
  | 'university-reports'
  | 'university-industry'
  | 'university-milestones'
  | 'university-projects'
  | 'university-notifications'
  | 'university-profile'
  | 'university-guidelines'
  | 'university-help'
  | 'university-settings'
  | 'student-dashboard'
  | 'student-projects'
  | 'student-experiments'
  | 'student-contributions'
  | 'student-team'
  | 'student-notifications'
  | 'student-settings'
  | 'industry-dashboard'
  | 'industry-open-challenges'
  | 'industry-discovery'
  | 'industry-requests'
  | 'industry-collaborations'
  | 'industry-progress'
  | 'industry-reports'
  | 'industry-funding'
  | 'industry-technical'
  | 'industry-profile'
  | 'industry-members'
  | 'industry-notifications'
  | 'industry-help'
  | 'industry-settings'
  | 'industry-project-detail'
  | 'industry-collaboration-workspace'
  | 'industry-partnerships'
  | 'project-detail'
  | 'project-workspace'
  | 'government-dashboard'
  | 'government-challenges'
  | 'government-verification'
  | 'government-assignments'
  | 'government-projects'
  | 'government-analytics'
  | 'government-collaborations'
  | 'government-reports'
  | 'government-impact'
  | 'government-districts'
  | 'government-moderation'
  | 'government-notifications'
  | 'government-help'
  | 'government-settings'
  | 'admin-dashboard';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export interface DemoStep {
  stepNumber: number;
  title: string;
  role: UserRole;
  targetView: AppView;
  targetId?: string;
  description: string;
  highlightAction: string;
}

export const JUDGE_DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Public Portal & Problem Statement',
    role: 'citizen',
    targetView: 'landing',
    description: 'Welcome to JH Innovation Connect - Government of Jharkhand portal for crowdsourcing community challenges and connecting Universities & Industry.',
    highlightAction: 'Explore the public ecosystem overview and click "Submit a Challenge".',
  },
  {
    stepNumber: 2,
    title: 'Citizen Challenge Crowdsourcing',
    role: 'citizen',
    targetView: 'submit-challenge',
    description: 'Citizens, PRIs, or NGOs submit local challenges with geotagging, affected population, urgency, and multimedia evidence.',
    highlightAction: 'Review the intuitive submission wizard and auto-generated AI triage.',
  },
  {
    stepNumber: 3,
    title: 'AI Problem Triage & University Routing',
    role: 'citizen',
    targetView: 'challenge-detail',
    targetId: 'JH-2026-001248',
    description: 'AI Engine analyzes urgency (94/100), detects semantic duplicates across blocks, and matches Top 3 Jharkhand Universities with faculty strengths.',
    highlightAction: 'Inspect the AI analysis card and recommended HEIs (BIT Mesra, IIT ISM Dhanbad).',
  },
  {
    stepNumber: 4,
    title: 'University Evaluation & Team Formation',
    role: 'university_admin',
    targetView: 'university-dashboard',
    targetId: 'JH-2026-001248',
    description: 'University evaluates the problem, assigns faculty mentors, and forms a multidisciplinary student team (Chemical + IoT + Civil).',
    highlightAction: 'View assigned challenge evaluation and the multidisciplinary team roster.',
  },
  {
    stepNumber: 5,
    title: 'Solution Proposal & CSR Co-Funding',
    role: 'faculty_mentor',
    targetView: 'university-proposals',
    description: 'Faculty and student leads submit comprehensive technical proposal with budget breakdown, TRL roadmap, and CSR co-funding request.',
    highlightAction: 'Examine the Jal-Shuddhi proposal approved with Tata Trusts grant.',
  },
  {
    stepNumber: 6,
    title: 'Industry & CSR Collaboration Hub',
    role: 'industry_msme',
    targetView: 'industry-dashboard',
    description: 'Industries (Tata Steel, BCCL, SAIL) and CSR foundations commit funding, assign co-mentors, and provide testing facilities.',
    highlightAction: 'See industry funding commitments and active student co-mentorship.',
  },
  {
    stepNumber: 7,
    title: '14-Stage Project Lifecycle & Field Pilot',
    role: 'student',
    targetView: 'project-detail',
    targetId: 'PROJ-JH-2026-0081',
    description: 'Complete 14-stage innovation workflow: Milestones, TRL 5 prototype validation, Patent application, and Village field pilot results.',
    highlightAction: 'Review milestone deliverables, Indian Patent filing, and live water telemetry.',
  },
  {
    stepNumber: 8,
    title: 'Government State Monitoring & Analytics',
    role: 'govt_department',
    targetView: 'government-dashboard',
    description: 'Higher Education Dept & State PMU track 24-district heatmaps, domain distribution, university performance, and societal ROI.',
    highlightAction: 'Filter by district and analyze cross-department societal impact analytics.',
  },
  {
    stepNumber: 9,
    title: 'Interactive Jharkhand Geographical Map',
    role: 'citizen',
    targetView: 'map-view',
    description: 'Geospatial challenge map showing clusters across all 24 districts with domain heat levels and live community endorsements.',
    highlightAction: 'Click district pins (Khunti, Dhanbad, Gumla, Ranchi) to view localized challenges.',
  },
  {
    stepNumber: 10,
    title: 'State Impact Scorecard & Success Stories',
    role: 'citizen',
    targetView: 'impact',
    description: 'Verified public impact: 1.48M+ lives impacted, 58 patents filed, 27 startups incubated, and ₹19.4 Cr CSR mobilized.',
    highlightAction: 'Celebrate the full citizen-to-solution innovation lifecycle!',
  },
];

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView, params?: { challengeId?: string; projectId?: string }) => void;
  goBack: (fallbackView?: AppView) => void;
  selectedChallengeId: string | null;
  setSelectedChallengeId: (id: string | null) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;

  challenges: Challenge[];
  projects: ProjectLifecycle[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  // Fast track judge demo tour
  isDemoTourActive: boolean;
  setIsDemoTourActive: (active: boolean) => void;
  currentDemoStep: number;
  goToDemoStep: (stepNumber: number) => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  // Quick navigation helpers
  navigateToChallenge: (id: string) => void;
  navigateToProject: (id: string) => void;
  refreshData: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isEcosystemModalOpen: boolean;
  setIsEcosystemModalOpen: (open: boolean) => void;
  submitExpressionOfInterest: (
    challengeId: string,
    details: {
      initialApproach: string;
      facultyLead: string;
      department: string;
      targetTimeline: string;
      resourcesNeeded: string;
      studentCohortSize: number;
    }
  ) => void;
  grantOfficialAssignment: (challengeId: string, universityName?: string, attemptNumber?: number) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  markNotificationRead: (id: string) => void;
  // Industry specific state and actions
  activeIndustry: IndustryOrganization;
  currentIndustryMember: IndustryMember;
  setCurrentIndustryMember: (member: IndustryMember) => void;
  industryMembers: IndustryMember[];
  industryCapabilities: IndustryCapabilities;
  collaborations: ProjectIndustryCollaboration[];
  projectReports: ProjectReportDocument[];
  technicalFeedback: TechnicalFeedbackItem[];
  selectedCollaborationId: string | null;
  setSelectedCollaborationId: (id: string | null) => void;
  switchIndustryMemberRole: (role: IndustryMemberRole) => void;
  expressCollaborationInterest: (data: {
    projectId: string;
    collaborationTypes: CollaborationSupportType[];
    proposedContribution: string;
    expectedSupport: string;
    contactPerson: string;
    contactEmail: string;
    additionalInfo?: string;
  }) => { success: boolean; message: string };
  addIndustryContribution: (
    collaborationId: string,
    contribution: Omit<IndustryContribution, 'id' | 'collaboration_id' | 'date'>
  ) => void;
  submitTechnicalFeedback: (
    feedback: Omit<TechnicalFeedbackItem, 'id' | 'date' | 'author_name' | 'author_org' | 'author_role'>
  ) => void;
  updateIndustryProfile: (data: Partial<IndustryOrganization>) => void;
  updateIndustryCapabilities: (data: Partial<IndustryCapabilities>) => void;
  addIndustryMember: (member: Omit<IndustryMember, 'id' | 'created_at'>) => void;
  acceptCollaborationByUniversity: (collaborationId: string, responseNotes?: string) => void;
  declineCollaborationByUniversity: (collaborationId: string, reason?: string) => void;
  industrySubmissions: IndustrySolutionSubmission[];
  submitIndustrySolution: (submission: Omit<IndustrySolutionSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  reviewIndustrySubmission: (submissionId: string, decision: 'APPROVED' | 'COLLABORATION_ACCEPTED' | 'REJECTED', notes: string) => void;
  approveProblemStatement: (challengeId: string, notes?: string) => void;
  // Government Module
  governmentDepartments: GovernmentDepartment[];
  governmentMembers: GovernmentMember[];
  currentGovernmentMember: GovernmentMember;
  switchGovernmentMember: (memberId: string) => void;
  supportActions: GovernmentSupportAction[];
  activityLogs: ActivityLogItem[];
  moderationRecords: ModerationRecord[];
  verifyChallenge: (
    challengeId: string,
    decision: 'VERIFIED' | 'REQUEST_MORE_INFO' | 'FLAG' | 'REJECT' | 'DUPLICATE' | 'ARCHIVE',
    reason: string,
    notes?: string,
    requiredInfo?: string[]
  ) => void;
  confirmUniversityAssignment: (
    challengeId: string,
    universityName: string,
    reason: string,
    notes?: string
  ) => void;
  reviewProjectReport: (
    reportId: string,
    decision: 'Approved' | 'Correction Requested' | 'Flagged' | 'Restricted' | 'Archived',
    reason: string
  ) => void;
  createGovernmentSupportAction: (
    data: Omit<GovernmentSupportAction, 'id' | 'created_at' | 'created_by' | 'status'>
  ) => void;
  updateGovernmentSupportActionStatus: (
    actionId: string,
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  ) => void;
  moderateContent: (data: {
    targetType: 'Challenge' | 'Report' | 'Document' | 'User' | 'Project';
    targetId: string;
    targetTitle: string;
    action: 'Review' | 'Flag' | 'Restrict' | 'Request Correction' | 'Archive' | 'Remove';
    reason: string;
  }) => void;
  deleteChallenge: (id: string) => Promise<boolean>;
  addChallenge: (challenge: Challenge) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialRoute = typeof window !== 'undefined' ? getRouteViewInfo(window.location.pathname) : { view: 'landing' as AppView };
  const [currentUser, setCurrentUser] = useState<User>({ id: 'guest', name: 'Guest', email: '', phone: '', role: 'citizen', district: 'Ranchi', verified: false, joinedDate: new Date().toISOString().split('T')[0] });
  const [currentView, setCurrentViewState] = useState<AppView>(initialRoute.view || 'landing');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(initialRoute.challengeId || 'JH-2026-001248');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialRoute.projectId || 'PROJ-JH-2026-0081');
  const [viewHistory, setViewHistory] = useState<AppView[]>([initialRoute.view || 'landing']);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [projects, setProjects] = useState<ProjectLifecycle[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoTourActive, setIsDemoTourActive] = useState<boolean>(false);
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEcosystemModalOpen, setIsEcosystemModalOpen] = useState<boolean>(false);

  // Restore the real Supabase Auth session on refresh and reactively listen for auth state changes
  useEffect(() => {
    let mounted = true;
    void authService.restoreCurrentUser().then((user) => {
      if (mounted && user) setCurrentUser(user as any);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await authService.restoreCurrentUser();
        if (mounted && user) {
          setCurrentUser(user as any);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setCurrentUser({
            id: 'guest',
            name: 'Guest',
            email: '',
            phone: '',
            role: 'citizen',
            district: 'Ranchi',
            verified: false,
            joinedDate: new Date().toISOString().split('T')[0],
          });
        }
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sync state on browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const routeInfo = getRouteViewInfo(window.location.pathname);
      setCurrentViewState(routeInfo.view);
      if (routeInfo.challengeId) {
        setSelectedChallengeId(routeInfo.challengeId);
      }
      if (routeInfo.projectId) {
        setSelectedProjectId(routeInfo.projectId);
      }
      setViewHistory((prev) => {
        if (prev.length > 1) {
          return prev.slice(0, -1);
        }
        return [routeInfo.view];
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Smooth and synchronous view navigation
  const setCurrentView = (view: AppView, params?: { challengeId?: string; projectId?: string }) => {
    setCurrentViewState(view);
    setViewHistory((prev) => (prev[prev.length - 1] === view ? prev : [...prev, view]));
    if (params?.challengeId) setSelectedChallengeId(params.challengeId);
    if (params?.projectId) setSelectedProjectId(params.projectId);

    const path = getViewRoutePath(view, {
      challengeId: params?.challengeId || (view === 'challenge-detail' ? selectedChallengeId || undefined : undefined),
      projectId: params?.projectId || ((view === 'project-workspace' || view === 'project-detail') ? selectedProjectId || undefined : undefined),
    });

    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({ view, params }, '', path);
    }
  };

  const goBack = (fallbackView?: AppView) => {
    if (typeof window !== 'undefined' && window.history.length > 1 && viewHistory.length > 1) {
      window.history.back();
    } else {
      const defaultRoleDashboard =
        currentUser.role === 'student' ? 'student-dashboard' :
        currentUser.role === 'university_admin' || currentUser.role === 'faculty_mentor' ? 'university-dashboard' :
        currentUser.role === 'industry_msme' || currentUser.role === 'csr_org' || currentUser.role === 'research_institute' ? 'industry-dashboard' :
        currentUser.role === 'govt_department' || currentUser.role === 'platform_admin' ? 'government-dashboard' :
        currentUser.role === 'citizen' || currentUser.role === 'community_org' || currentUser.role === 'pri_ulb' ? 'citizen-dashboard' : 'landing';

      setCurrentView(fallbackView || (defaultRoleDashboard as AppView));
    }
  };


  const switchRole = (role: UserRole) => {
    const userMatch = MOCK_USERS.find((u) => u.role === role) || {
      ...MOCK_USERS[0],
      role,
      name: `${role.replace('_', ' ').toUpperCase()} Representative`,
    };
    setCurrentUser(userMatch);
    showToast('info', 'User Role Switched', `Logged in as ${userMatch.name} (${userMatch.role.toUpperCase()})`);

    // Auto-navigate to appropriate role dashboard
    if (role === 'citizen' || role === 'community_org' || role === 'pri_ulb') {
      if (currentView.startsWith('university') || currentView.startsWith('student') || currentView.startsWith('industry') || currentView.startsWith('govt') || currentView.startsWith('admin')) {
        setCurrentView('citizen-dashboard');
      }
    } else if (role === 'student') {
      setCurrentView('student-dashboard');
    } else if (role === 'university_admin' || role === 'faculty_mentor') {
      setCurrentView('university-dashboard');
    } else if (role === 'industry_msme' || role === 'csr_org' || role === 'research_institute') {
      setCurrentView('industry-dashboard');
    } else if (role === 'govt_department') {
      setCurrentView('government-dashboard');
    } else if (role === 'platform_admin') {
      setCurrentView('admin-dashboard');
    }
  };

  const showToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const goToDemoStep = (stepNumber: number) => {
    const step = JUDGE_DEMO_STEPS.find((s) => s.stepNumber === stepNumber);
    if (step) {
      setCurrentDemoStep(stepNumber);
      setIsDemoTourActive(true);
      // Switch role matching the step
      const matchedUser = MOCK_USERS.find((u) => u.role === step.role) || MOCK_USERS[0];
      setCurrentUser(matchedUser);
      if (step.targetId) {
        if (step.targetView === 'challenge-detail' || step.targetView === 'university-challenges') {
          setSelectedChallengeId(step.targetId);
        } else if (step.targetView === 'project-detail') {
          setSelectedProjectId(step.targetId);
        }
      }
      setCurrentView(step.targetView);
      showToast('info', `Demo Step ${step.stepNumber}/10: ${step.title}`, step.highlightAction);
    }
  };

  const nextDemoStep = () => {
    if (currentDemoStep < JUDGE_DEMO_STEPS.length) {
      goToDemoStep(currentDemoStep + 1);
    } else {
      goToDemoStep(1);
    }
  };

  const prevDemoStep = () => {
    if (currentDemoStep > 1) {
      goToDemoStep(currentDemoStep - 1);
    }
  };

  const navigateToChallenge = (id: string) => {
    setSelectedChallengeId(id);
    setCurrentView('challenge-detail', { challengeId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project-workspace', { projectId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const addChallenge = (newChallenge: Challenge) => {
    setChallenges((prev) => [
      newChallenge,
      ...prev.filter((c) => c.id !== newChallenge.id && c.trackingId !== newChallenge.trackingId),
    ]);
  };

  const refreshData = async () => {
    try {
      const [chRes, prRes, noRes] = await Promise.allSettled([
        challengeService.getChallenges(),
        projectService.getProjects(),
        communicationService.getNotifications(currentUser.id),
      ]);

      if (chRes.status === 'fulfilled') {
        const chList = chRes.value;
        setChallenges((prev) => {
          if (prev.length === 0) return chList;
          return chList.map((incoming) => {
            const local = prev.find(
              (p) => p.id === incoming.id || (p.trackingId && p.trackingId === incoming.trackingId)
            );
            if (local && local.status === 'Validated' && incoming.status !== 'Validated') {
              return {
                ...incoming,
                status: local.status,
                trustStatus: local.trustStatus,
                openForSolutions: local.openForSolutions,
                currentStage: local.currentStage,
                timeline:
                  local.timeline && local.timeline.length > incoming.timeline.length
                    ? local.timeline
                    : incoming.timeline,
              };
            }
            return incoming;
          });
        });
      } else {
        console.warn('Could not refresh challenges:', chRes.reason);
      }

      if (prRes.status === 'fulfilled') {
        setProjects(prRes.value);
      }
      if (noRes.status === 'fulfilled') {
        setNotifications(noRes.value);
      }
    } catch (err) {
      console.warn('refreshData error:', err);
    }
  };

  const deleteChallenge = async (id: string): Promise<boolean> => {
    const success = await challengeService.deleteChallenge(id);
    if (success) {
      setChallenges((prev) => prev.filter((c) => c.id !== id && c.trackingId !== id));
    }
    return success;
  };

  const markNotificationAsRead = async (id: string) => {
    await communicationService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const submitExpressionOfInterest = (
    challengeId: string,
    details: {
      initialApproach: string;
      facultyLead: string;
      department: string;
      targetTimeline: string;
      resourcesNeeded: string;
      studentCohortSize: number;
    }
  ) => {
    const univName = currentUser.organization || 'Birla Institute of Technology (BIT) Mesra';
    const newEoi = {
      id: `EOI-${Date.now()}`,
      challengeId,
      universityId: currentUser.id || 'univ-bit-mesra',
      universityName: univName,
      facultyLead: details.facultyLead,
      department: details.department,
      initialApproach: details.initialApproach,
      targetTimeline: details.targetTimeline,
      resourcesNeeded: details.resourcesNeeded,
      studentCohortSize: details.studentCohortSize,
      submittedAt: new Date().toISOString(),
      status: 'Under Review' as const,
      governmentReviewNotes: 'Application registered. Scheduled for State PMU Screening Committee evaluation.',
    };

    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const existing = ch.expressionsOfInterest || [];
          return {
            ...ch,
            status: 'Under Review' as const,
            expressionsOfInterest: [newEoi, ...existing.filter((e) => e.universityName !== univName)],
          };
        }
        return ch;
      })
    );

    showToast(
      'info',
      'Expression of Interest Submitted',
      'Initial approach submitted & Under Review by State PMU. (University does not own this challenge yet)'
    );
  };

  const grantOfficialAssignment = (challengeId: string, universityName?: string, attemptNumber = 1) => {
    const univ = universityName || currentUser.organization || 'Birla Institute of Technology (BIT) Mesra';
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId) {
          const updatedEois = (ch.expressionsOfInterest || []).map((eoi) =>
            eoi.universityName === univ
              ? { ...eoi, status: 'Officially Assigned' as const, assignedAttemptNumber: attemptNumber }
              : eoi
          );
          return {
            ...ch,
            status: 'Assigned' as const,
            assignedUniversityName: univ,
            officialAssignment: {
              assignedToUniversity: univ,
              assignedDate: new Date().toISOString().split('T')[0],
              assignedBy: 'Jharkhand State PMU / JSHEC',
              attemptNumber,
              projectId: ch.projectId || 'PROJ-JH-2026-0081',
              status: 'Active Workspace' as const,
            },
            expressionsOfInterest: updatedEois,
          };
        }
        return ch;
      })
    );

    showToast(
      'success',
      'Official Assignment Sanctioned',
      `Government officially assigned challenge to ${univ} (Official Attempt #${attemptNumber}). Project Workspace is now active!`
    );
  };

  const EMPTY_INDUSTRY: IndustryOrganization = {
    id: '', organization_name: '', organization_type: 'Other', sector: '', state: 'Jharkhand', district: '',
    website_url: '', description: '', verification_status: 'Pending', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
  };
  const EMPTY_PERMISSIONS = {
    canManageProfile: true, canManageOrgProfile: true, canManageMembers: true, canManageCapabilities: true,
    canExpressCollaboration: true, canManageCollaborations: true, canViewAuthorizedReports: true,
    canSubmitTechnicalFeedback: true, canSubmitFeedback: true, canAddContributions: true, canManageCSR: true, canManageFunding: true
  };
  const [activeIndustry, setActiveIndustry] = useState<IndustryOrganization>(EMPTY_INDUSTRY);
  const [industryMembers, setIndustryMembers] = useState<IndustryMember[]>([]);
  const [currentIndustryMember, setCurrentIndustryMember] = useState<IndustryMember>({
    id: '', profile_id: '', industry_id: '', name: 'Partner', email: '', phone: '', designation: 'Organization Administrator',
    member_role: 'org_admin', role: 'org_admin', permissions: EMPTY_PERMISSIONS, status: 'Active', created_at: new Date().toISOString()
  });
  const [industryCapabilities, setIndustryCapabilities] = useState<IndustryCapabilities>({
    id: '', industry_id: '', sectors: [], technologies: [], expertise: [], manufacturing: [], testing: [],
    funding: { maxGrantINR: 0, annualBudgetINR: 0, preferredStages: [] },
    csr: { eligible: false, thematicAreas: [], priorityDistricts: [] }, deployment: [], mentorship: [], keywords: []
  });
  const [collaborations, setCollaborations] = useState<ProjectIndustryCollaboration[]>([]);
  const [industrySubmissions, setIndustrySubmissions] = useState<IndustrySolutionSubmission[]>([]);
  const [projectReports, setProjectReports] = useState<ProjectReportDocument[]>([]);
  const [technicalFeedback, setTechnicalFeedback] = useState<TechnicalFeedbackItem[]>([]);
  const [selectedCollaborationId, setSelectedCollaborationId] = useState<string | null>(null);

  // Load the authenticated industry's real profile from Supabase. No demo industry data is used.
  useEffect(() => {
    const loadIndustryProfile = async () => {
      if (!currentUser.id || currentUser.id === 'guest' || !isValidUUID(currentUser.id) || !['csr_org', 'industry_msme', 'research_institute'].includes(currentUser.role)) return;

      const { data, error } = await supabase
        .from('industry_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load industry profile from Supabase:', error.message);
        return;
      }
      if (!data) return;

      const now = new Date().toISOString();
      const industry: IndustryOrganization = {
        id: data.user_id,
        organization_name: data.organization_name || currentUser.organization || 'Industry Partner',
        organization_type: (data.organization_type || 'Other') as IndustryOrganization['organization_type'],
        sector: data.domain || '',
        state: 'Jharkhand',
        district: data.district || currentUser.district || '',
        website_url: '',
        website: '',
        description: '',
        verification_status: 'Verified',
        created_at: data.created_at || now,
        updated_at: data.updated_at || now,
      };
      setActiveIndustry(industry);

      const member: IndustryMember = {
        id: data.user_id,
        profile_id: data.user_id,
        industry_id: data.user_id,
        name: data.contact_person || currentUser.name || 'Partner',
        email: data.official_email || currentUser.email || '',
        phone: data.contact_phone || currentUser.phone || '',
        designation: data.contact_designation || currentUser.designation || 'Organization Administrator',
        member_role: 'org_admin',
        role: 'org_admin',
        permissions: EMPTY_PERMISSIONS,
        status: 'Active',
        created_at: data.created_at || now,
      };
      setCurrentIndustryMember(member);
      setIndustryMembers([member]);
      setIndustryCapabilities({
        id: data.user_id, industry_id: data.user_id,
        sectors: data.csr_focus_sectors || [], technologies: data.technology_capabilities || [],
        expertise: data.expertise_areas || [], manufacturing: [], testing: data.testing_and_deployment_capabilities || [],
        funding: { maxGrantINR: Number(data.max_grant_per_project || 0), annualBudgetINR: 0, preferredStages: [] },
        csr: { eligible: data.organization_type?.toLowerCase().includes('csr') || false, thematicAreas: data.csr_focus_sectors || [], priorityDistricts: [] },
        deployment: [], mentorship: data.mentoring_capabilities || [], keywords: []
      });
    };
    void loadIndustryProfile();
  }, [currentUser.id, currentUser.role, currentUser.organization, currentUser.district, currentUser.name, currentUser.email, currentUser.phone, currentUser.designation]);

  const switchIndustryMemberRole = (role: IndustryMemberRole) => {
    const matched = industryMembers.find((m) => m.member_role === role || m.role === role);
    if (!matched) return;
    setCurrentIndustryMember(matched);
    const roleTitles: Record<IndustryMemberRole, string> = {
      org_admin: 'Organization Administrator (Full Access)',
      technical_member: 'Technical Member (Testing & R&D)',
      csr_member: 'CSR / Partnership Member (Grants & Impact)',
    };
    showToast(
      'info',
      'Industry Role Switched',
      `Active member: ${matched.name} — ${roleTitles[role]}`
    );
  };

  const expressCollaborationInterest = (data: {
    projectId: string;
    collaborationTypes: CollaborationSupportType[];
    proposedContribution: string;
    expectedSupport: string;
    contactPerson: string;
    contactEmail: string;
    additionalInfo?: string;
  }): { success: boolean; message: string } => {
    if (!currentIndustryMember.permissions.canExpressCollaboration) {
      showToast('error', 'Permission Denied', 'Your role cannot submit collaboration requests.');
      return { success: false, message: 'Your industry role does not have permission to submit collaboration requests.' };
    }

    const targetProject = projects.find((p) => p.id === data.projectId);
    if (!targetProject) {
      return { success: false, message: 'Target project not found in centralized registry.' };
    }

    const univId = targetProject.universityId || targetProject.university?.id || 'univ-bit-01';
    const univName = targetProject.universityName || targetProject.university?.name || 'Partner University';
    const projTitle = targetProject.title || targetProject.challengeTitle || 'Innovation Project';

    const newCollabId = `collab-${Date.now()}`;
    const newCollab: ProjectIndustryCollaboration = {
      id: newCollabId,
      project_id: data.projectId,
      challenge_id: targetProject.challengeId,
      industry_id: activeIndustry.id,
      industry_name: activeIndustry.organization_name,
      university_id: univId,
      university_name: univName,
      project_title: projTitle,
      collaboration_types: data.collaborationTypes,
      status: 'Pending',
      started_at: new Date().toISOString(),
      proposed_contribution: data.proposedContribution,
      expected_support: data.expectedSupport,
      contact_person: data.contactPerson,
      contact_email: data.contactEmail,
      additional_info: data.additionalInfo,
      progress_percent: 10,
      contributions: [],
    };

    setCollaborations((prev) => [newCollab, ...prev]);

    // Send notification to University & Ecosystem
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: univId,
      title: `Collaboration Request from ${activeIndustry.organization_name}`,
      message: `${activeIndustry.organization_name} expressed partnership interest (${data.collaborationTypes.join(
        ', '
      )}) for "${projTitle}".`,
      type: 'Collaboration',
      timestamp: 'Just now',
      read: false,
      actionUrl: '/university-industry',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast(
      'success',
      'Collaboration Request Submitted',
      `Your proposal was submitted to ${univName}. Status: Pending review.`
    );


    return {
      success: true,
      message: 'Collaboration request submitted successfully. The university research cell has been notified.',
    };
  };

  const addIndustryContribution = (
    collaborationId: string,
    contribution: Omit<IndustryContribution, 'id' | 'collaboration_id' | 'date'>
  ) => {
    const newId = `contrib-${Date.now()}`;
    const newEntry: IndustryContribution = {
      ...contribution,
      id: newId,
      collaboration_id: collaborationId,
      date: new Date().toISOString().split('T')[0],
    };

    setCollaborations((prev) =>
      prev.map((c) => {
        if (c.id === collaborationId) {
          const updatedContribs = [newEntry, ...c.contributions];
          return {
            ...c,
            contributions: updatedContribs,
            progress_percent: Math.min(100, c.progress_percent + 10),
          };
        }
        return c;
      })
    );

    showToast('success', 'Contribution Logged', `Recorded ${contribution.contribution_type} contribution.`);
  };

  const submitTechnicalFeedback = (
    feedback: Omit<TechnicalFeedbackItem, 'id' | 'date' | 'author_name' | 'author_org' | 'author_role'>
  ) => {
    const newFeedback: TechnicalFeedbackItem = {
      ...feedback,
      id: `fb-${Date.now()}`,
      author_name: currentIndustryMember.name,
      author_org: activeIndustry.organization_name,
      author_role: currentIndustryMember.designation,
      date: new Date().toISOString().split('T')[0],
    };

    setTechnicalFeedback((prev) => [newFeedback, ...prev]);
    showToast('success', 'Technical Feedback Added', 'Shared with the university engineering research team.');
  };

  const updateIndustryProfile = (data: Partial<IndustryOrganization>) => {
    setActiveIndustry((prev) => ({ ...prev, ...data, updated_at: new Date().toISOString() }));
    showToast('success', 'Profile Updated', 'Organization details have been saved.');
  };

  const updateIndustryCapabilities = (data: Partial<IndustryCapabilities>) => {
    setIndustryCapabilities((prev) => ({ ...prev, ...data }));
    showToast('success', 'Capabilities Updated', 'Matching parameters refreshed.');
  };

  const addIndustryMember = (member: Omit<IndustryMember, 'id' | 'created_at'>) => {
    const newMem: IndustryMember = {
      ...member,
      id: `ind-mem-${Date.now()}`,
      created_at: new Date().toISOString(),
      member_role: member.member_role || member.role || 'technical_member',
      role: member.role || member.member_role || 'technical_member',
    };
    setIndustryMembers((prev) => [...prev, newMem]);
    showToast('success', 'Member Added', `Invitation sent to ${member.name} (${member.email}).`);
  };

  const acceptCollaborationByUniversity = (collaborationId: string, responseNotes?: string) => {
    setCollaborations((prev) =>
      prev.map((c) => {
        if (c.id === collaborationId) {
          return {
            ...c,
            status: 'Active',
            university_response_notes: responseNotes || 'Accepted by University Research & Development Cell.',
            progress_percent: 30,
          };
        }
        return c;
      })
    );
    showToast('success', 'Collaboration Activated', 'Project is now co-developed with Industry partner.');
  };

  const declineCollaborationByUniversity = (collaborationId: string, reason?: string) => {
    setCollaborations((prev) =>
      prev.map((c) => {
        if (c.id === collaborationId) {
          return {
            ...c,
            status: 'Declined',
            university_response_notes: reason || 'Declined due to scope or timeline variance.',
          };
        }
        return c;
      })
    );
    showToast('info', 'Collaboration Declined', 'Proposal marked as declined.');
  };

  // Government Module State
  const [governmentDepartments] = useState<GovernmentDepartment[]>(MOCK_GOVERNMENT_DEPARTMENTS);
  const [governmentMembers] = useState<GovernmentMember[]>(MOCK_GOVERNMENT_MEMBERS);
  const [currentGovernmentMember, setCurrentGovernmentMember] = useState<GovernmentMember>(MOCK_GOVERNMENT_MEMBERS[0]);
  const [supportActions, setSupportActions] = useState<GovernmentSupportAction[]>(MOCK_SUPPORT_ACTIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(MOCK_ACTIVITY_LOGS);
  const [moderationRecords, setModerationRecords] = useState<ModerationRecord[]>(MOCK_MODERATION_RECORDS);

  const switchGovernmentMember = (memberId: string) => {
    const member = governmentMembers.find((m) => m.id === memberId) || governmentMembers[0];
    setCurrentGovernmentMember(member);
    const govtUser = MOCK_USERS.find((u) => u.id === member.profile_id) || {
      id: member.profile_id,
      name: member.name,
      role: 'govt_department' as UserRole,
      email: member.email,
      phone: '+91 651 2400811',
      district: member.district || 'Ranchi',
      organization: member.department_name,
      designation: member.designation,
      verified: true,
      joinedDate: '2025-01-01',
      avatarUrl: member.avatar_url,
    };
    setCurrentUser(govtUser);
    showToast(
      'info',
      'Government Official Switched',
      `Active: ${member.name} (${member.designation}) — Scope: ${member.access_level.toUpperCase()}`
    );
  };

  const verifyChallenge = (
    challengeId: string,
    decision: 'VERIFIED' | 'REQUEST_MORE_INFO' | 'FLAG' | 'REJECT' | 'DUPLICATE' | 'ARCHIVE',
    reason: string,
    notes?: string,
    requiredInfo?: string[]
  ) => {
    const targetChallenge = challenges.find(
      (c) => c.id === challengeId || (c.trackingId && c.trackingId === challengeId)
    );
    if (!targetChallenge) return;

    const timestamp = new Date().toISOString();
    const dateStr = timestamp.split('T')[0];

    let newStatus = targetChallenge.status;
    let newTrustStatus = targetChallenge.trustStatus;

    if (decision === 'VERIFIED') {
      newStatus = 'Validated';
      newTrustStatus = 'Verified';
    } else if (decision === 'REQUEST_MORE_INFO') {
      newStatus = 'Under Review';
      newTrustStatus = 'Under Review';
    } else if (decision === 'FLAG') {
      newStatus = 'Under Review';
    } else if (decision === 'REJECT') {
      newStatus = 'Submitted';
    }

    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newTimelineEntry = {
      stage: decision === 'VERIFIED' ? 'Approved as Open Problem Statement' : `Verification Action: ${decision}`,
      date: formattedDateTime,
      description: `${decision === 'VERIFIED' ? 'Officially vetted and verified by' : 'Reviewed by'} ${currentGovernmentMember.name} (${currentGovernmentMember.designation}, ${currentGovernmentMember.department_name}). ${decision === 'VERIFIED' ? 'Accepted into Open Problem Statements for University & Industry solutions.' : ''} Reason: ${reason}${notes ? ` | Notes: ${notes}` : ''}`,
      actor: currentGovernmentMember.name,
    };

    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === targetChallenge.id || (ch.trackingId && ch.trackingId === targetChallenge.trackingId)) {
          return {
            ...ch,
            status: newStatus,
            trustStatus: newTrustStatus,
            openForSolutions: decision === 'VERIFIED' ? true : ch.openForSolutions,
            timeline: [...ch.timeline, newTimelineEntry],
            additionalInformation:
              requiredInfo && requiredInfo.length > 0
                ? `${ch.additionalInformation || ''}\n[Government Request for Additional Information]: ${requiredInfo.join(', ')}. Details: ${reason}`
                : ch.additionalInformation,
          };
        }
        return ch;
      })
    );

    // Persist to Supabase so industry & university see it immediately
    void challengeService.updateChallengeStatus(targetChallenge.id, newStatus as any, {
      trustStatus: newTrustStatus as any,
      openForSolutions: decision === 'VERIFIED' ? true : undefined,
      currentStage: decision === 'VERIFIED' ? 'Approved as Open Problem Statement' : `Verification Action: ${decision}`,
      notes: reason + (notes ? ` | Notes: ${notes}` : ''),
      actorName: currentGovernmentMember.name,
    }).then((updated) => {
      if (updated) {
        setChallenges((prev) =>
          prev.map((ch) =>
            ch.id === updated.id || (ch.trackingId && ch.trackingId === updated.trackingId) ? updated : ch
          )
        );
      }
    });

    const auditItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp,
      actor: currentGovernmentMember.name,
      role: currentGovernmentMember.designation,
      department: currentGovernmentMember.department_name,
      action: decision === 'VERIFIED' ? 'Officially Verified Challenge' : `Verification Action: ${decision}`,
      details: `${decision} for Challenge #${targetChallenge.trackingId || targetChallenge.id} ("${targetChallenge.title}"). Reason: ${reason}`,
      targetType: 'Challenge',
      targetId: targetChallenge.id,
    };
    setActivityLogs((prev) => [auditItem, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetChallenge.submittedBy.userId,
      type: 'Challenge',
      title: decision === 'VERIFIED' ? 'Challenge Officially Verified' : `Government Verification Update: ${decision}`,
      message: `Your challenge #${targetChallenge.trackingId || targetChallenge.id} was reviewed by ${currentGovernmentMember.department_name}. ${reason}`,
      read: false,
      timestamp: 'Just now',
      actionUrl: 'citizen-my-challenges',
      relatedId: targetChallenge.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      decision === 'VERIFIED' ? 'success' : 'info',
      'Verification Processed',
      `Challenge #${targetChallenge.trackingId || targetChallenge.id} recorded as ${decision}. Official audit entry created.`
    );
  };

  const confirmUniversityAssignment = (
    challengeId: string,
    universityName: string,
    reason: string,
    notes?: string
  ) => {
    const targetChallenge = challenges.find(
      (c) => c.id === challengeId || (c.trackingId && c.trackingId === challengeId)
    );
    if (!targetChallenge) return;

    const timestamp = new Date().toISOString();
    const dateStr = timestamp.split('T')[0];
    const attemptNumber = (targetChallenge.attemptsHistory?.length || targetChallenge.previousAttempts?.length || 0) + 1;

    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === targetChallenge.id || (ch.trackingId && ch.trackingId === targetChallenge.trackingId)) {
          const updatedEois = ch.expressionsOfInterest?.map((eoi) => ({
            ...eoi,
            status: eoi.universityName.toLowerCase().includes(universityName.toLowerCase())
              ? ('Officially Assigned' as const)
              : eoi.status,
            assignedAttemptNumber: eoi.universityName.toLowerCase().includes(universityName.toLowerCase())
              ? attemptNumber
              : eoi.assignedAttemptNumber,
            governmentReviewNotes: eoi.universityName.toLowerCase().includes(universityName.toLowerCase())
              ? reason
              : eoi.governmentReviewNotes,
          }));

          const timelineEntry = {
            stage: 'Official University Assignment',
            date: dateStr,
            description: `Sanctioned by ${currentGovernmentMember.name} (${currentGovernmentMember.department_name}) to ${universityName} (Attempt #${attemptNumber}). Reason: ${reason}${notes ? ` | Notes: ${notes}` : ''}`,
            actor: currentGovernmentMember.name,
          };

          return {
            ...ch,
            status: 'Assigned' as const,
            currentStage: 'University Allocation' as const,
            assignedUniversityName: universityName,
            officialAssignment: {
              assignedToUniversity: universityName,
              assignedDate: dateStr,
              assignedBy: `${currentGovernmentMember.name}, ${currentGovernmentMember.department_name}`,
              attemptNumber,
              projectId: ch.projectId || `PROJ-JH-2026-00${ch.id.slice(-2)}`,
              status: 'Active Workspace' as const,
            },
            expressionsOfInterest: updatedEois,
            timeline: [...ch.timeline, timelineEntry],
          };
        }
        return ch;
      })
    );

    // Persist assignment to Supabase
    void challengeService.updateChallengeStatus(targetChallenge.id, 'Assigned', {
      assignedUniversityName: universityName,
      currentStage: 'Assigned to University R&D',
      notes: `Sanctioned by ${currentGovernmentMember.name} to ${universityName}. Reason: ${reason}`,
      actorName: currentGovernmentMember.name,
    }).then((updated) => {
      if (updated) {
        setChallenges((prev) =>
          prev.map((ch) =>
            ch.id === updated.id || (ch.trackingId && ch.trackingId === updated.trackingId) ? updated : ch
          )
        );
      }
    });

    const auditItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp,
      actor: currentGovernmentMember.name,
      role: currentGovernmentMember.designation,
      department: currentGovernmentMember.department_name,
      action: 'Confirmed Official University Assignment',
      details: `Sanctioned official assignment of Challenge #${targetChallenge.trackingId || targetChallenge.id} to ${universityName}. Reason: ${reason}`,
      targetType: 'Challenge',
      targetId: targetChallenge.id,
    };
    setActivityLogs((prev) => [auditItem, ...prev]);

    const univNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-univ-01',
      type: 'Approval',
      title: 'Official Challenge Assignment Sanctioned',
      message: `Government of Jharkhand officially assigned Challenge #${targetChallenge.trackingId || targetChallenge.id} to ${universityName}. Project workspace is activated.`,
      read: false,
      timestamp: 'Just now',
      actionUrl: 'university-projects',
      relatedId: targetChallenge.id,
    };
    setNotifications((prev) => [univNotif, ...prev]);

    showToast(
      'success',
      'Official Assignment Sanctioned',
      `Challenge #${targetChallenge.trackingId || targetChallenge.id} assigned to ${universityName} (Attempt #${attemptNumber}). Notification dispatched.`
    );
  };

  const approveProblemStatement = (challengeId: string, notes?: string) => {
    const targetChallenge = challenges.find(
      (c) => c.id === challengeId || (c.trackingId && c.trackingId === challengeId)
    );
    if (!targetChallenge) return;

    const now = new Date();
    const isoString = now.toISOString();
    const formattedDateTime = now.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newTimelineEntry = {
      stage: 'Approved as Open Problem Statement',
      date: formattedDateTime,
      description: `Officially vetted and accepted by ${currentGovernmentMember.name} (${currentGovernmentMember.department_name}). Published to state open innovation repository for universities and industries.${notes ? ` Review Notes: ${notes}` : ''}`,
      actor: currentGovernmentMember.name,
    };

    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === targetChallenge.id || (ch.trackingId && ch.trackingId === targetChallenge.trackingId)) {
          return {
            ...ch,
            status: 'Validated' as const,
            trustStatus: 'Verified' as const,
            openForSolutions: true,
            timeline: [...ch.timeline, newTimelineEntry],
          };
        }
        return ch;
      })
    );

    // Persist to Supabase database so industry & university portals see it immediately
    void challengeService.updateChallengeStatus(targetChallenge.id, 'Validated', {
      trustStatus: 'Verified',
      openForSolutions: true,
      currentStage: 'Approved as Open Problem Statement',
      notes: notes || `Officially vetted and accepted by ${currentGovernmentMember.name} (${currentGovernmentMember.department_name}). Published to state open innovation repository for universities and industries.`,
      actorName: currentGovernmentMember.name,
    }).then((updated) => {
      if (updated) {
        setChallenges((prev) =>
          prev.map((ch) =>
            ch.id === updated.id || (ch.trackingId && ch.trackingId === updated.trackingId) ? updated : ch
          )
        );
      }
    });

    const auditItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp: isoString,
      actor: currentGovernmentMember.name,
      role: currentGovernmentMember.designation,
      department: currentGovernmentMember.department_name,
      action: 'Approved Open Problem Statement',
      details: `Challenge #${targetChallenge.trackingId || targetChallenge.id} ("${targetChallenge.title}") approved and published to open problem statements.`,
      targetType: 'Challenge',
      targetId: targetChallenge.id,
    };
    setActivityLogs((prev) => [auditItem, ...prev]);

    showToast(
      'success',
      'Problem Statement Approved',
      `Challenge #${targetChallenge.trackingId || targetChallenge.id} is now published in Open Problem Statements for Universities & Industries.`
    );
  };

  const submitIndustrySolution = (
    submission: Omit<IndustrySolutionSubmission, 'id' | 'submittedAt' | 'status'>
  ) => {
    const now = new Date();
    const isoString = now.toISOString();
    const formattedDateTime = now.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newSub: IndustrySolutionSubmission = {
      ...submission,
      id: `ind-sub-${Date.now()}`,
      status: 'Submitted to Government',
      submittedAt: isoString,
    };

    setIndustrySubmissions((prev) => [newSub, ...prev]);

    // Update challenge timeline
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === submission.challengeId) {
          const newTimelineEntry = {
            stage: 'Industry Solution & Results Uploaded',
            date: formattedDateTime,
            description: `${submission.industryName} submitted technical solution & prototype test results ("${submission.solutionTitle}") to Government for review. Collaboration mode: ${submission.collaborationMode}.`,
            actor: submission.industryName,
          };
          return {
            ...ch,
            industrySubmissions: [...(ch.industrySubmissions || []), newSub],
            timeline: [...ch.timeline, newTimelineEntry],
          };
        }
        return ch;
      })
    );

    // Notify government
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'gov-user-pmu-01',
      type: 'Project',
      title: 'Industry Solution Result Received',
      message: `${submission.industryName} uploaded solution results for Challenge #${submission.challengeId}. Ready for Government review.`,
      read: false,
      timestamp: 'Just now',
      actionUrl: 'government-collaborations',
      relatedId: submission.challengeId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(
      'success',
      'Solution Results Uploaded to Government',
      `Your proposal and test results have been transmitted to the State Government Innovation Cell.`
    );
  };

  const reviewIndustrySubmission = (
    submissionId: string,
    decision: 'APPROVED' | 'COLLABORATION_ACCEPTED' | 'REJECTED',
    notes: string
  ) => {
    const sub = industrySubmissions.find((s) => s.id === submissionId);
    if (!sub) return;

    const now = new Date();
    const formattedDateTime = now.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newStatus: IndustrySolutionSubmission['status'] =
      decision === 'APPROVED'
        ? 'Government Approved'
        : decision === 'COLLABORATION_ACCEPTED'
        ? 'Collaboration Accepted'
        : 'Revision Requested';

    setIndustrySubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: newStatus, governmentNotes: notes } : s))
    );

    // If approved or collaboration accepted, update challenge status & add timeline entry
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === sub.challengeId) {
          const actionText =
            decision === 'APPROVED'
              ? `Government selected and approved ${sub.industryName}'s solution for implementation.`
              : decision === 'COLLABORATION_ACCEPTED'
              ? `Government sanctioned joint collaboration between ${sub.industryName} and ${sub.targetUniversityName || 'University Partner'}.`
              : `Government requested revisions on ${sub.industryName}'s submission: ${notes}`;

          const newTimelineEntry = {
            stage:
              decision === 'APPROVED'
                ? 'Industry Solution Sanctioned'
                : decision === 'COLLABORATION_ACCEPTED'
                ? 'University-Industry Collaboration Sanctioned'
                : 'Industry Submission Feedback',
            date: formattedDateTime,
            description: actionText,
            actor: currentGovernmentMember.name,
          };

          return {
            ...ch,
            status:
              decision === 'APPROVED'
                ? ('In Development' as const)
                : decision === 'COLLABORATION_ACCEPTED'
                ? ('Assigned' as const)
                : ch.status,
            timeline: [...ch.timeline, newTimelineEntry],
          };
        }
        return ch;
      })
    );

    // If collaboration accepted, also create an active collaboration record in collaborations list
    if (decision === 'COLLABORATION_ACCEPTED') {
      const newCollab: ProjectIndustryCollaboration = {
        id: `collab-${Date.now()}`,
        project_id: sub.challengeId,
        challenge_id: sub.challengeId,
        industry_id: sub.industryId,
        industry_name: sub.industryName,
        university_id: 'univ-bau-kanke',
        university_name: sub.targetUniversityName || 'Birla Institute of Technology (BIT) Mesra',
        project_title: sub.solutionTitle,
        collaboration_types: ['Mentorship', 'Testing', 'Manufacturing'],
        status: 'Active',
        started_at: new Date().toISOString(),
        proposed_contribution: sub.summary,
        expected_support: 'Academic faculty research validation and student cohort support',
        contact_person: sub.submittedBy,
        contact_email: sub.contactEmail,
        progress_percent: 25,
        contributions: [
          {
            id: `contrib-${Date.now()}`,
            collaboration_id: `collab-${Date.now()}`,
            project_id: sub.challengeId,
            contribution_type: 'Manufacturing',
            description: sub.technicalDetails,
            date: new Date().toISOString().split('T')[0],
            status: 'Verified',
            created_by: sub.submittedBy,
          },
        ],
      };
      setCollaborations((prev) => [newCollab, ...prev]);
    }

    showToast(
      'success',
      decision === 'APPROVED' ? 'Solution Approved' : decision === 'COLLABORATION_ACCEPTED' ? 'Collaboration Sanctioned' : 'Feedback Sent',
      `State Government decision recorded for ${sub.industryName}.`
    );
  };

  const reviewProjectReport = (
    reportId: string,
    decision: 'Approved' | 'Correction Requested' | 'Flagged' | 'Restricted' | 'Archived',
    reason: string
  ) => {
    const targetDoc = projectReports.find((r) => r.id === reportId);
    if (!targetDoc) return;

    const timestamp = new Date().toISOString();
    const newVisibility = decision === 'Restricted' ? 'RESTRICTED' : targetDoc.visibility;

    setProjectReports((prev) =>
      prev.map((doc) => {
        if (doc.id === reportId) {
          const auditHistory = doc.audit_history || [];
          return {
            ...doc,
            visibility: newVisibility,
            review_status: decision,
            review_notes: reason,
            reviewed_by: currentGovernmentMember.name,
            reviewed_at: timestamp,
            moderation_reason: decision === 'Restricted' || decision === 'Flagged' ? reason : doc.moderation_reason,
            audit_history: [
              ...auditHistory,
              {
                action: decision,
                reason,
                actor: currentGovernmentMember.name,
                timestamp,
                previous_visibility: doc.visibility,
                new_visibility: newVisibility,
                previous_status: doc.review_status,
                new_status: decision,
              },
            ],
          };
        }
        return doc;
      })
    );

    const auditItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp,
      actor: currentGovernmentMember.name,
      role: currentGovernmentMember.designation,
      department: currentGovernmentMember.department_name,
      action: `Report Review: ${decision}`,
      details: `${decision} applied to Report #${reportId} ("${targetDoc.title}"). Reason: ${reason}`,
      targetType: 'Report',
      targetId: reportId,
    };
    setActivityLogs((prev) => [auditItem, ...prev]);

    if (decision === 'Restricted' || decision === 'Flagged') {
      const modRecord: ModerationRecord = {
        id: `mod-${Date.now()}`,
        target_type: 'Report',
        target_id: reportId,
        target_title: targetDoc.title,
        action: decision === 'Restricted' ? 'Restrict' : 'Flag',
        reason,
        actor_name: currentGovernmentMember.name,
        actor_department: currentGovernmentMember.department_name,
        timestamp,
        previous_state: targetDoc.visibility,
        new_state: newVisibility,
      };
      setModerationRecords((prev) => [modRecord, ...prev]);
    }

    showToast(
      decision === 'Approved' ? 'success' : 'warning',
      'Report Decision Recorded',
      `Report #${reportId} status updated to ${decision}. Reason logged in audit registry.`
    );
  };

  const createGovernmentSupportAction = (
    data: Omit<GovernmentSupportAction, 'id' | 'created_at' | 'created_by' | 'status'>
  ) => {
    const timestamp = new Date().toISOString();
    const newAction: GovernmentSupportAction = {
      ...data,
      id: `gsa-${Date.now()}`,
      created_by: currentGovernmentMember.name,
      created_at: timestamp,
      status: 'Open',
    };
    setSupportActions((prev) => [newAction, ...prev]);

    const auditItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp,
      actor: currentGovernmentMember.name,
      role: currentGovernmentMember.designation,
      department: currentGovernmentMember.department_name,
      action: 'Created Government Support Action',
      details: `Created ${data.priority} priority support action for Project #${data.project_id}: ${data.issue_description}`,
      targetType: 'Project',
      targetId: data.project_id,
    };
    setActivityLogs((prev) => [auditItem, ...prev]);

    showToast(
      'success',
      'Support Action Initiated',
      `Intervention for Project #${data.project_id} logged. Responsible: ${data.responsible_department}`
    );
  };

  const updateGovernmentSupportActionStatus = (
    actionId: string,
    status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  ) => {
    setSupportActions((prev) =>
      prev.map((act) => (act.id === actionId ? { ...act, status } : act))
    );

    const auditItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentGovernmentMember.name,
      role: currentGovernmentMember.designation,
      department: currentGovernmentMember.department_name,
      action: `Updated Support Action Status to ${status}`,
      details: `Support Action #${actionId} marked as ${status}`,
    };
    setActivityLogs((prev) => [auditItem, ...prev]);

    showToast('info', 'Status Updated', `Support action #${actionId} updated to ${status}.`);
  };

  const moderateContent = (data: {
    targetType: 'Challenge' | 'Report' | 'Document' | 'User' | 'Project';
    targetId: string;
    targetTitle: string;
    action: 'Review' | 'Flag' | 'Restrict' | 'Request Correction' | 'Archive' | 'Remove';
    reason: string;
  }) => {
    const timestamp = new Date().toISOString();
    const modRecord: ModerationRecord = {
      id: `mod-${Date.now()}`,
      target_type: data.targetType,
      target_id: data.targetId,
      target_title: data.targetTitle,
      action: data.action,
      reason: data.reason,
      actor_name: currentGovernmentMember.name,
      actor_department: currentGovernmentMember.department_name,
      timestamp,
      previous_state: 'Active',
      new_state: data.action,
    };
    setModerationRecords((prev) => [modRecord, ...prev]);

    const auditItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      timestamp,
      actor: currentGovernmentMember.name,
      role: currentGovernmentMember.designation,
      department: currentGovernmentMember.department_name,
      action: `Moderation: ${data.action}`,
      details: `${data.action} on ${data.targetType} "${data.targetTitle}" (#${data.targetId}). Reason: ${data.reason}`,
      targetType: data.targetType,
      targetId: data.targetId,
    };
    setActivityLogs((prev) => [auditItem, ...prev]);

    showToast('warning', 'Moderation Action Applied', `${data.action} applied to ${data.targetType}. Reason logged in audit registry.`);
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const logout = () => {
    void authService.logout();
    setCurrentUser({ id: 'guest', name: 'Guest', email: '', phone: '', role: 'citizen', district: 'Ranchi', verified: false, joinedDate: new Date().toISOString().split('T')[0] });
    setCurrentView('landing');
    showToast('info', 'Logged Out', 'Successfully signed out of your portal session.');
  };

  const updateProfile = (data: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
    showToast('success', 'Profile Saved', 'User profile information updated successfully.');
  };

  useEffect(() => {
    refreshData();
  }, [currentUser.id]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentRole: currentUser.role,
        switchRole,
        currentView,
        setCurrentView,
        goBack,
        selectedChallengeId,
        setSelectedChallengeId,
        selectedProjectId,
        setSelectedProjectId,
        challenges,
        projects,
        notifications,
        unreadNotifsCount,
        toasts,
        showToast,
        removeToast,
        isDemoTourActive,
        setIsDemoTourActive,
        currentDemoStep,
        goToDemoStep,
        nextDemoStep,
        prevDemoStep,
        navigateToChallenge,
        navigateToProject,
        refreshData,
        markNotificationAsRead,
        markNotificationRead: markNotificationAsRead,
        logout,
        updateProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isEcosystemModalOpen,
        setIsEcosystemModalOpen,
        submitExpressionOfInterest,
        grantOfficialAssignment,
        // Industry values
        activeIndustry,
        currentIndustryMember,
        setCurrentIndustryMember,
        industryMembers,
        industryCapabilities,
        collaborations,
        projectReports,
        technicalFeedback,
        selectedCollaborationId,
        setSelectedCollaborationId,
        switchIndustryMemberRole,
        expressCollaborationInterest,
        addIndustryContribution,
        submitTechnicalFeedback,
        updateIndustryProfile,
        updateIndustryCapabilities,
        addIndustryMember,
        acceptCollaborationByUniversity,
        declineCollaborationByUniversity,
        industrySubmissions,
        submitIndustrySolution,
        reviewIndustrySubmission,
        approveProblemStatement,
        // Government values
        governmentDepartments,
        governmentMembers,
        currentGovernmentMember,
        switchGovernmentMember,
        supportActions,
        activityLogs,
        moderationRecords,
        verifyChallenge,
        confirmUniversityAssignment,
        reviewProjectReport,
        createGovernmentSupportAction,
        updateGovernmentSupportActionStatus,
        moderateContent,
        deleteChallenge,
        addChallenge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
