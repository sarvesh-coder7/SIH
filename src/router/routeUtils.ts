import { AppView } from '../context/AppContext';

export const VIEW_ROUTE_MAP: Record<string, string> = {
  landing: '/',
  'role-selection': '/role-selection',
  login: '/login',
  signup: '/signup',
  'explore-challenges': '/explore-challenges',
  'challenge-detail': '/challenge-detail',
  'citizen-challenge-detail': '/challenge-detail',
  'submit-challenge': '/submit-challenge',
  universities: '/universities',
  industry: '/industry',
  impact: '/impact',
  'map-view': '/map-view',
  'how-it-works': '/how-it-works',
  
  // Citizen
  'citizen-dashboard': '/dashboard/citizen',
  'citizen-my-challenges': '/dashboard/citizen/my-challenges',
  'citizen-notifications': '/dashboard/citizen/notifications',
  'citizen-profile': '/dashboard/citizen/profile',
  'citizen-help': '/dashboard/citizen/help',
  'citizen-privacy': '/dashboard/citizen/privacy',

  // University
  'university-dashboard': '/dashboard/university',
  'university-challenges': '/dashboard/university/challenges',
  'university-teams': '/dashboard/university/teams',
  'university-proposals': '/dashboard/university/proposals',
  'university-notifications': '/dashboard/university/notifications',
  'university-profile': '/dashboard/university/profile',
  'university-guidelines': '/dashboard/university/guidelines',
  'university-applications': '/dashboard/university/applications',
  'university-reports': '/dashboard/university/reports',
  'university-industry': '/dashboard/university/industry',
  'university-help': '/dashboard/university/help',
  'university-settings': '/dashboard/university/settings',

  // Student
  'student-dashboard': '/dashboard/student',
  'student-projects': '/dashboard/student/projects',
  'student-experiments': '/dashboard/student/experiments',
  'student-contributions': '/dashboard/student/contributions',
  'student-team': '/dashboard/student/team',
  'student-notifications': '/dashboard/student/notifications',
  'student-settings': '/dashboard/student/settings',

  // Industry
  'industry-dashboard': '/dashboard/industry',
  'industry-discovery': '/dashboard/industry/discovery',
  'industry-requests': '/dashboard/industry/requests',
  'industry-collaborations': '/dashboard/industry/collaborations',
  'industry-progress': '/dashboard/industry/progress',
  'industry-reports': '/dashboard/industry/reports',
  'industry-funding': '/dashboard/industry/funding',
  'industry-technical': '/dashboard/industry/technical',
  'industry-profile': '/dashboard/industry/profile',
  'industry-members': '/dashboard/industry/members',
  'industry-notifications': '/dashboard/industry/notifications',
  'industry-help': '/dashboard/industry/help',
  'industry-settings': '/dashboard/industry/settings',
  'industry-project-detail': '/dashboard/industry/project-detail',
  'industry-collaboration-workspace': '/dashboard/industry/collaboration-workspace',
  'industry-partnerships': '/dashboard/industry/partnerships',

  // Government
  'government-dashboard': '/dashboard/government',
  'government-challenges': '/dashboard/government/challenges',
  'government-verification': '/dashboard/government/verification',
  'government-assignments': '/dashboard/government/assignments',
  'government-projects': '/dashboard/government/projects',
  'government-analytics': '/dashboard/government/analytics',
  'government-collaborations': '/dashboard/government/collaborations',
  'government-reports': '/dashboard/government/reports',
  'government-impact': '/dashboard/government/impact',
  'government-districts': '/dashboard/government/districts',
  'government-moderation': '/dashboard/government/moderation',
  'government-notifications': '/dashboard/government/notifications',
  'government-help': '/dashboard/government/help',
  'government-settings': '/dashboard/government/settings',

  // Project & Admin
  'project-workspace': '/project-workspace',
  'project-detail': '/project-workspace',
  'admin-dashboard': '/dashboard/government',
};

// Reverse map from normalized route pathname to AppView
const ROUTE_VIEW_MAP: Record<string, AppView> = {};
Object.entries(VIEW_ROUTE_MAP).forEach(([view, route]) => {
  if (!ROUTE_VIEW_MAP[route]) {
    ROUTE_VIEW_MAP[route] = view as AppView;
  }
});

// Additional explicit aliases
ROUTE_VIEW_MAP[''] = 'landing';
ROUTE_VIEW_MAP['/'] = 'landing';
ROUTE_VIEW_MAP['/landing'] = 'landing';
ROUTE_VIEW_MAP['/citizen-dashboard'] = 'citizen-dashboard';
ROUTE_VIEW_MAP['/university-dashboard'] = 'university-dashboard';
ROUTE_VIEW_MAP['/industry-dashboard'] = 'industry-dashboard';
ROUTE_VIEW_MAP['/government-dashboard'] = 'government-dashboard';
ROUTE_VIEW_MAP['/student-dashboard'] = 'student-dashboard';

export const getViewRoutePath = (viewId: string, params?: { challengeId?: string; projectId?: string }): string => {
  if (!viewId) return '/';
  
  if (viewId === 'challenge-detail' && params?.challengeId) {
    return `/challenge/${params.challengeId}`;
  }
  if ((viewId === 'project-workspace' || viewId === 'project-detail') && params?.projectId) {
    return `/project/${params.projectId}`;
  }

  if (viewId in VIEW_ROUTE_MAP) return VIEW_ROUTE_MAP[viewId];
  if (viewId.startsWith('/')) return viewId;
  return `/${viewId}`;
};

export const getRouteViewInfo = (pathname: string): { view: AppView; challengeId?: string; projectId?: string } => {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // Handle parameterized routes: /challenge/:id
  const challengeMatch = cleanPath.match(/^\/challenge\/([^/]+)$/);
  if (challengeMatch) {
    return { view: 'challenge-detail', challengeId: challengeMatch[1] };
  }

  // Handle parameterized routes: /project/:id
  const projectMatch = cleanPath.match(/^\/project\/([^/]+)$/);
  if (projectMatch) {
    return { view: 'project-workspace', projectId: projectMatch[1] };
  }

  if (cleanPath in ROUTE_VIEW_MAP) {
    return { view: ROUTE_VIEW_MAP[cleanPath] };
  }

  // Strip leading / and check if it directly matches an AppView
  const candidate = cleanPath.replace(/^\//, '') as AppView;
  if (candidate in VIEW_ROUTE_MAP) {
    return { view: candidate };
  }

  return { view: 'landing' };
};
