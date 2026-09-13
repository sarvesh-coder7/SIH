
import React, { useEffect } from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useNavigate,
  useParams,
  Navigate,
} from '@tanstack/react-router';

import { ToastProvider } from '../context/ToastContext';
import { AppProvider, useApp, AppView } from '../context/AppContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

import { ToastContainer } from '../components/common/ToastContainer';
import { AuthModal } from '../components/common/AuthModal';
import { getViewRoutePath } from './routeUtils';

export { getViewRoutePath };

// Public & Auth Pages
import { LandingPage } from '../components/public/LandingPage';
import { RoleSelectionPage } from '../components/public/RoleSelectionPage';
import { LoginPage } from '../components/auth/LoginPage';
import { SignUpPage } from '../components/auth/SignUpPage';
import { ExploreChallengesPage } from '../components/public/ExploreChallengesPage';
import { UniversitiesPage } from '../components/public/UniversitiesPage';
import { IndustryPage } from '../components/public/IndustryPage';
import { HowItWorksPage } from '../components/public/HowItWorksPage';
import { PublicImpactDashboard } from '../components/impact/PublicImpactDashboard';
import { JharkhandMap } from '../components/map/JharkhandMap';

// Citizen Experience
import { CitizenLayout } from '../components/citizen/CitizenLayout';
import { CitizenDashboard } from '../components/citizen/CitizenDashboard';
import { SubmitChallengeForm } from '../components/citizen/SubmitChallengeForm';
import { CitizenMyChallengesPage } from '../components/citizen/CitizenMyChallengesPage';
import { CitizenChallengeDetail } from '../components/citizen/CitizenChallengeDetail';
import { CitizenNotificationsPage } from '../components/citizen/CitizenNotificationsPage';
import { CitizenProfilePage } from '../components/citizen/CitizenProfilePage';
import { CitizenHelpPage } from '../components/citizen/CitizenHelpPage';
import { CitizenPrivacyPage } from '../components/citizen/CitizenPrivacyPage';

// University Experience
import { UniversityLayout } from '../components/university/UniversityLayout';
import { UniversityDashboard } from '../components/university/UniversityDashboard';
import { UniversityChallengesPage } from '../components/university/UniversityChallengesPage';
import { UniversityTeamsPage } from '../components/university/UniversityTeamsPage';
import { UniversityProposalsPage } from '../components/university/UniversityProposalsPage';
import { UniversityNotificationsPage } from '../components/university/UniversityNotificationsPage';
import { UniversityProfilePage } from '../components/university/UniversityProfilePage';
import { UniversityGuidelinesPage } from '../components/university/UniversityGuidelinesPage';

// Industry, Government & Project
import { IndustryDashboard } from '../components/industry/IndustryDashboard';
import { GovernmentDashboard } from '../components/government/GovernmentDashboard';
import { ProjectWorkspace } from '../components/project/ProjectWorkspace';

// Helper component to sync parameterized routes like /challenge/$challengeId or /project/$projectId
const ChallengeDetailWrapper: React.FC = () => {
  const { challengeId } = useParams({ strict: false });
  const { setSelectedChallengeId } = useApp();

  useEffect(() => {
    if (challengeId) {
      setSelectedChallengeId(challengeId);
    }
  }, [challengeId, setSelectedChallengeId]);

  return <CitizenChallengeDetail />;
};

const ProjectWorkspaceWrapper: React.FC = () => {
  const { projectId } = useParams({ strict: false });
  const { setSelectedProjectId } = useApp();

  useEffect(() => {
    if (projectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId, setSelectedProjectId]);

  return <ProjectWorkspace />;
};

// Root Component layout wrapper
const RootComponent: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans antialiased">
          <Outlet />
          <AuthModal />
        </div>
      </AppProvider>
    </ToastProvider>
  );
};

// Standard Portal Layout Wrapper for general portal pages
const PortalLayoutWrapper: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Create Root Route
const rootRoute = createRootRoute({
  component: RootComponent,
});

// 1. Standalone / Public Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/landing',
  component: LandingPage,
});

const roleSelectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/role-selection',
  component: RoleSelectionPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => {
    const { currentRole } = useApp();
    return <LoginPage initialRole={currentRole} />;
  },
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => {
    const { currentRole } = useApp();
    return <SignUpPage initialRole={currentRole} />;
  },
});

// 2. Portal Layout Section with Header & Footer
const portalLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'portal-layout',
  component: PortalLayoutWrapper,
});

const exploreRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/explore-challenges',
  component: ExploreChallengesPage,
});

const submitChallengeRoute = createRoute({
  getParentRoute: () => citizenLayoutRoute,
  path: '/submit-challenge',
  component: SubmitChallengeForm,
});

const challengeDetailRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/challenge/$challengeId',
  component: ChallengeDetailWrapper,
});

const challengeDetailFallbackRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/challenge-detail',
  component: CitizenChallengeDetail,
});

const universitiesRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/universities',
  component: UniversitiesPage,
});

const industryRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/industry',
  component: IndustryPage,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/how-it-works',
  component: HowItWorksPage,
});

const impactRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/impact',
  component: PublicImpactDashboard,
});

const mapViewRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/map-view',
  component: JharkhandMap,
});

const industryDashboardRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/dashboard/industry',
  component: IndustryDashboard,
});

const governmentDashboardRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/dashboard/government',
  component: GovernmentDashboard,
});

const projectWorkspaceRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/project/$projectId',
  component: ProjectWorkspaceWrapper,
});

const projectWorkspaceFallbackRoute = createRoute({
  getParentRoute: () => portalLayoutRoute,
  path: '/project-workspace',
  component: ProjectWorkspace,
});

// 3. Citizen Dedicated Layout Section
const citizenLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'citizen-layout',
  component: () => (
    <CitizenLayout>
      <Outlet />
    </CitizenLayout>
  ),
});

const citizenDashboardRoute = createRoute({
  getParentRoute: () => citizenLayoutRoute,
  path: '/dashboard/citizen',
  component: CitizenDashboard,
});

const citizenMyChallengesRoute = createRoute({
  getParentRoute: () => citizenLayoutRoute,
  path: '/dashboard/citizen/my-challenges',
  component: CitizenMyChallengesPage,
});

const citizenNotificationsRoute = createRoute({
  getParentRoute: () => citizenLayoutRoute,
  path: '/dashboard/citizen/notifications',
  component: CitizenNotificationsPage,
});

const citizenProfileRoute = createRoute({
  getParentRoute: () => citizenLayoutRoute,
  path: '/dashboard/citizen/profile',
  component: CitizenProfilePage,
});

const citizenHelpRoute = createRoute({
  getParentRoute: () => citizenLayoutRoute,
  path: '/dashboard/citizen/help',
  component: CitizenHelpPage,
});

const citizenPrivacyRoute = createRoute({
  getParentRoute: () => citizenLayoutRoute,
  path: '/dashboard/citizen/privacy',
  component: CitizenPrivacyPage,
});

// 4. University Dedicated Layout Section
const universityLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'university-layout',
  component: () => (
    <UniversityLayout>
      <Outlet />
    </UniversityLayout>
  ),
});

const universityDashboardRoute = createRoute({
  getParentRoute: () => universityLayoutRoute,
  path: '/dashboard/university',
  component: UniversityDashboard,
});

const universityChallengesRoute = createRoute({
  getParentRoute: () => universityLayoutRoute,
  path: '/dashboard/university/challenges',
  component: UniversityChallengesPage,
});

const universityTeamsRoute = createRoute({
  getParentRoute: () => universityLayoutRoute,
  path: '/dashboard/university/teams',
  component: UniversityTeamsPage,
});

const universityProposalsRoute = createRoute({
  getParentRoute: () => universityLayoutRoute,
  path: '/dashboard/university/proposals',
  component: UniversityProposalsPage,
});

const universityNotificationsRoute = createRoute({
  getParentRoute: () => universityLayoutRoute,
  path: '/dashboard/university/notifications',
  component: UniversityNotificationsPage,
});

const universityProfileRoute = createRoute({
  getParentRoute: () => universityLayoutRoute,
  path: '/dashboard/university/profile',
  component: UniversityProfilePage,
});

const universityGuidelinesRoute = createRoute({
  getParentRoute: () => universityLayoutRoute,
  path: '/dashboard/university/guidelines',
  component: UniversityGuidelinesPage,
});

// Legacy Alias Redirects
const citizenDashboardAlias = createRoute({
  getParentRoute: () => rootRoute,
  path: '/citizen-dashboard',
  component: () => <Navigate to="/dashboard/citizen" replace />,
});

const universityDashboardAlias = createRoute({
  getParentRoute: () => rootRoute,
  path: '/university-dashboard',
  component: () => <Navigate to="/dashboard/university" replace />,
});

const industryDashboardAlias = createRoute({
  getParentRoute: () => rootRoute,
  path: '/industry-dashboard',
  component: () => <Navigate to="/dashboard/industry" replace />,
});

const governmentDashboardAlias = createRoute({
  getParentRoute: () => rootRoute,
  path: '/government-dashboard',
  component: () => <Navigate to="/dashboard/government" replace />,
});

// Assemble Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  landingRoute,
  roleSelectionRoute,
  loginRoute,
  signupRoute,
  citizenDashboardAlias,
  universityDashboardAlias,
  industryDashboardAlias,
  governmentDashboardAlias,
  portalLayoutRoute.addChildren([
    exploreRoute,
    challengeDetailRoute,
    challengeDetailFallbackRoute,
    universitiesRoute,
    industryRoute,
    howItWorksRoute,
    impactRoute,
    mapViewRoute,
    industryDashboardRoute,
    governmentDashboardRoute,
    projectWorkspaceRoute,
    projectWorkspaceFallbackRoute,
  ]),
  citizenLayoutRoute.addChildren([
    citizenDashboardRoute,
    submitChallengeRoute,
    citizenMyChallengesRoute,
    citizenNotificationsRoute,
    citizenProfileRoute,
    citizenHelpRoute,
    citizenPrivacyRoute,
  ]),
  universityLayoutRoute.addChildren([
    universityDashboardRoute,
    universityChallengesRoute,
    universityTeamsRoute,
    universityProposalsRoute,
    universityNotificationsRoute,
    universityProfileRoute,
    universityGuidelinesRoute,
  ]),
]);

// Create TanStack Router instance
export const tanstackRouter = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Declare router type safety for TanStack Router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof tanstackRouter;
  }
}

