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
  about: '/about',
  
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
  'university-projects': '/dashboard/university/projects',
  'university-proposals': '/dashboard/university/proposals',
  'university-collaborate': '/dashboard/university/collaborate',
  'university-funding': '/dashboard/university/funding',
  'university-messages': '/dashboard/university/messages',
  'university-teams': '/dashboard/university/teams',
  'university-notifications': '/dashboard/university/notifications',
  'university-profile': '/dashboard/university/profile',
  'university-guidelines': '/dashboard/university/guidelines',
  'university-applications': '/dashboard/university/applications',
  'university-reports': '/dashboard/university/reports',
  'university-industry': '/dashboard/university/collaborate',
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
ROUTE_VIEW_MAP['/role_selection'] = 'role-selection';
ROUTE_VIEW_MAP['/citizen-dashboard'] = 'citizen-dashboard';
ROUTE_VIEW_MAP['/university-dashboard'] = 'university-dashboard';
ROUTE_VIEW_MAP['/dashboard/university/industry'] = 'university-collaborate';
ROUTE_VIEW_MAP['/industry-dashboard'] = 'industry-dashboard';
ROUTE_VIEW_MAP['/government-dashboard'] = 'government-dashboard';
ROUTE_VIEW_MAP['/student-dashboard'] = 'student-dashboard';
ROUTE_VIEW_MAP['/tracking'] = 'challenge-detail';
ROUTE_VIEW_MAP['/track'] = 'challenge-detail';
ROUTE_VIEW_MAP['/challenge'] = 'challenge-detail';
ROUTE_VIEW_MAP['/challenge-detail'] = 'challenge-detail';

export const getViewRoutePath = (viewId: string, params?: { challengeId?: string; projectId?: string }): string => {
  if (!viewId) return '/';
  
  if ((viewId === 'challenge-detail' || viewId === 'citizen-challenge-detail') && params?.challengeId) {
    return `/tracking/${params.challengeId}`;
  }
  if (viewId === 'university-projects' && params?.projectId) {
    return `/dashboard/university/project/${params.projectId}`;
  }
  if (viewId === 'student-projects' && params?.projectId) {
    return `/dashboard/student/project/${params.projectId}`;
  }
  if (viewId === 'government-projects' && params?.projectId) {
    return `/dashboard/government/project/${params.projectId}`;
  }
  if (viewId === 'industry-project-detail' && params?.projectId) {
    return `/dashboard/industry/project/${params.projectId}`;
  }
  if ((viewId === 'project-workspace' || viewId === 'project-detail') && params?.projectId) {
    return `/project/${params.projectId}`;
  }

  if (viewId in VIEW_ROUTE_MAP) return VIEW_ROUTE_MAP[viewId];
  if (viewId.startsWith('/')) return viewId;
  return `/${viewId}`;
};

export const getRouteViewInfo = (pathname: string): { view: AppView; challengeId?: string; projectId?: string } => {
  const [pathOnly] = pathname.split('?');
  const cleanPath = (pathOnly || pathname).replace(/\/$/, '') || '/';

  // Handle parameterized routes: /challenge/:id, /tracking/:id, /track/:id, /tracking-id/:id
  const challengeMatch = cleanPath.match(/^\/(?:challenge|tracking|track|tracking-id)\/([^/]+)$/i);
  if (challengeMatch) {
    return { view: 'challenge-detail', challengeId: decodeURIComponent(challengeMatch[1]) };
  }

  // Handle parameterized routes: /dashboard/university/project/:id
  const uniProjectMatch = cleanPath.match(/^\/dashboard\/university\/project\/([^/]+)$/i);
  if (uniProjectMatch) {
    return { view: 'university-projects', projectId: decodeURIComponent(uniProjectMatch[1]) };
  }

  // Handle parameterized routes: /dashboard/student/project/:id
  const studentProjectMatch = cleanPath.match(/^\/dashboard\/student\/project\/([^/]+)$/i);
  if (studentProjectMatch) {
    return { view: 'student-projects', projectId: decodeURIComponent(studentProjectMatch[1]) };
  }

  // Handle parameterized routes: /dashboard/government/project/:id
  const govProjectMatch = cleanPath.match(/^\/dashboard\/government\/project\/([^/]+)$/i);
  if (govProjectMatch) {
    return { view: 'government-projects', projectId: decodeURIComponent(govProjectMatch[1]) };
  }

  // Handle parameterized routes: /dashboard/industry/project/:id
  const indProjectMatch = cleanPath.match(/^\/dashboard\/industry\/project\/([^/]+)$/i);
  if (indProjectMatch) {
    return { view: 'industry-project-detail', projectId: decodeURIComponent(indProjectMatch[1]) };
  }

  // Handle parameterized routes: /project/:id
  const projectMatch = cleanPath.match(/^\/project\/([^/]+)$/i);
  if (projectMatch) {
    return { view: 'project-workspace', projectId: decodeURIComponent(projectMatch[1]) };
  }

  // Handle query parameter fallback: /tracking?trackingId=... or /challenge-detail?trackingId=...
  if (typeof window !== 'undefined' && window.location.search) {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const queryTrackingId = searchParams.get('trackingId') || searchParams.get('id');
      if (queryTrackingId && (cleanPath === '/tracking' || cleanPath === '/track' || cleanPath === '/challenge' || cleanPath === '/challenge-detail')) {
        return { view: 'challenge-detail', challengeId: queryTrackingId };
      }
    } catch (_) {}
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

