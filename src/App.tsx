import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastProvider } from './context/ToastContext';
import { AuthModal } from './components/common/AuthModal';
import { AIChatWidget } from './components/ai/AIChatWidget';

// Standalone Public & Auth Pages
import { LandingPage } from './components/public/LandingPage';
import { RoleSelectionPage } from './components/public/RoleSelectionPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';

// Citizen Dedicated Layout & Pages
import { CitizenLayout } from './components/citizen/CitizenLayout';
import { CitizenDashboard } from './components/citizen/CitizenDashboard';
import { SubmitChallengeForm } from './components/citizen/SubmitChallengeForm';
import { CitizenMyChallengesPage } from './components/citizen/CitizenMyChallengesPage';
import { CitizenChallengeDetail } from './components/citizen/CitizenChallengeDetail';
import { CitizenNotificationsPage } from './components/citizen/CitizenNotificationsPage';
import { CitizenProfilePage } from './components/citizen/CitizenProfilePage';
import { CitizenHelpPage } from './components/citizen/CitizenHelpPage';
import { CitizenPrivacyPage } from './components/citizen/CitizenPrivacyPage';

// University Dedicated Layout & Pages
import { UniversityLayout } from './components/university/UniversityLayout';
import { UniversityDashboard } from './components/university/UniversityDashboard';
import { UniversityChallengesPage } from './components/university/UniversityChallengesPage';
import { UniversityTeamsPage } from './components/university/UniversityTeamsPage';
import { UniversityProposalsPage } from './components/university/UniversityProposalsPage';
import { UniversityNotificationsPage } from './components/university/UniversityNotificationsPage';
import { UniversityProfilePage } from './components/university/UniversityProfilePage';
import { UniversityGuidelinesPage } from './components/university/UniversityGuidelinesPage';
import { UniversityApplicationsPage } from './components/university/UniversityApplicationsPage';
import { UniversityReportsPage } from './components/university/UniversityReportsPage';
import { UniversityIndustryPage } from './components/university/UniversityIndustryPage';
import { UniversityHelpPage } from './components/university/UniversityHelpPage';
import { UniversitySettingsPage } from './components/university/UniversitySettingsPage';

// Student Dedicated Pages
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProjectsPage } from './components/student/StudentProjectsPage';
import { StudentExperimentsPage } from './components/student/StudentExperimentsPage';
import { StudentContributionsPage } from './components/student/StudentContributionsPage';
import { StudentTeamPage } from './components/student/StudentTeamPage';
import { StudentSettingsPage } from './components/student/StudentSettingsPage';

// Other Roles & Dashboards
import { ExploreChallengesPage } from './components/public/ExploreChallengesPage';
import { UniversitiesPage } from './components/public/UniversitiesPage';
import { IndustryPage } from './components/public/IndustryPage';
import { AboutPage } from './components/public/AboutPage';
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { IndustryLayout } from './components/industry/IndustryLayout';
import { GovernmentDashboard } from './components/government/GovernmentDashboard';
import { GovernmentLayout } from './components/government/GovernmentLayout';
import { ProjectWorkspace } from './components/project/ProjectWorkspace';
import { JharkhandMap } from './components/map/JharkhandMap';
import { PublicImpactDashboard } from './components/impact/PublicImpactDashboard';

const AppContent: React.FC = () => {
  const { currentView, currentRole } = useApp();

  // Standalone full-screen views (landing, role selection, login, signup)
  const isStandalonePublicView =
    currentView === 'landing' ||
    currentView === 'role-selection' ||
    currentView === 'login' ||
    currentView === 'signup' ||
    currentView === 'about';

  // View overrides take precedence so routing commands (like open report) always open the right workspace
  const isCitizenTarget =
    currentView === 'submit-challenge' ||
    currentView.startsWith('citizen-');

  const isUniversityTarget =
    currentView.startsWith('university-') ||
    currentView.startsWith('student-');

  const isIndustryTarget =
    currentView.startsWith('industry-');

  const isGovernmentTarget =
    currentView.startsWith('government-');

  // Role Checks with View Overrides
  const isIndustryRole =
    !isCitizenTarget &&
    !isUniversityTarget &&
    !isGovernmentTarget &&
    (currentRole === 'industry_msme' ||
      currentRole === 'csr_org' ||
      currentRole === 'research_institute' ||
      isIndustryTarget);

  const isUniversityRole =
    !isCitizenTarget &&
    !isIndustryRole &&
    !isGovernmentTarget &&
    (currentRole === 'university_admin' ||
      currentRole === 'faculty_mentor' ||
      currentRole === 'student' ||
      isUniversityTarget);

  const isCitizenRole =
    isCitizenTarget ||
    (!isIndustryRole &&
      !isUniversityRole &&
      !isGovernmentTarget &&
      (currentRole === 'citizen' ||
        currentRole === 'community_org' ||
        currentRole === 'pri_ulb'));

  const isGovernmentRole =
    isGovernmentTarget ||
    (!isIndustryRole &&
      !isUniversityRole &&
      !isCitizenRole &&
      (currentRole === 'govt_department' ||
        currentRole === 'platform_admin'));

  // Render Citizen Specific Views inside CitizenLayout
  const renderCitizenView = () => {
    const content = (() => {
      switch (currentView) {
        case 'citizen-dashboard':
          return <CitizenDashboard />;
        case 'submit-challenge':
          return <SubmitChallengeForm />;
        case 'citizen-my-challenges':
          return <CitizenMyChallengesPage />;
        case 'challenge-detail':
        case 'citizen-challenge-detail':
          return <CitizenChallengeDetail />;
        case 'explore-challenges':
          return <ExploreChallengesPage />;
        case 'citizen-notifications':
          return <CitizenNotificationsPage />;
        case 'citizen-profile':
          return <CitizenProfilePage />;
        case 'citizen-help':
          return <CitizenHelpPage />;
        case 'citizen-privacy':
          return <CitizenPrivacyPage />;
        case 'map-view':
          return <JharkhandMap />;
        case 'impact':
          return <PublicImpactDashboard />;
        case 'about':
          return <AboutPage />;
        default:
          return <CitizenDashboard />;
      }
    })();
    return <div key={currentView} className="pt-page-enter w-full">{content}</div>;
  };

  // Render University Specific Views inside UniversityLayout
  const renderUniversityView = () => {
    const content = (() => {
      switch (currentView) {
        case 'university-dashboard':
          return <UniversityDashboard />;
        case 'university-challenges':
          return <UniversityChallengesPage />;
        case 'university-applications':
          return <UniversityApplicationsPage />;
        case 'university-teams':
          return <UniversityTeamsPage />;
        case 'university-proposals':
          return <UniversityProposalsPage />;
        case 'project-workspace':
        case 'project-detail':
        case 'university-projects':
        case 'university-milestones':
          return <ProjectWorkspace />;
        case 'university-reports':
          return <UniversityReportsPage />;
        case 'university-industry':
          return <UniversityIndustryPage />;
        case 'challenge-detail':
        case 'citizen-challenge-detail':
          return <CitizenChallengeDetail />;
        case 'explore-challenges':
          return <ExploreChallengesPage />;
        case 'university-notifications':
        case 'student-notifications':
          return <UniversityNotificationsPage />;
        case 'university-profile':
          return <UniversityProfilePage />;
        case 'university-guidelines':
          return <UniversityGuidelinesPage />;
        case 'university-help':
          return <UniversityHelpPage />;
        case 'university-settings':
          return <UniversitySettingsPage />;
        // Student Specific Views
        case 'student-dashboard':
          return <StudentDashboard />;
        case 'student-projects':
          return <StudentProjectsPage />;
        case 'student-experiments':
          return <StudentExperimentsPage />;
        case 'student-contributions':
          return <StudentContributionsPage />;
        case 'student-team':
          return <StudentTeamPage />;
        case 'student-settings':
          return <StudentSettingsPage />;
        case 'map-view':
          return <JharkhandMap />;
        case 'impact':
          return <PublicImpactDashboard />;
        case 'about':
          return <AboutPage />;
        default:
          return currentRole === 'student' ? <StudentDashboard /> : <UniversityDashboard />;
      }
    })();
    return <div key={currentView} className="pt-page-enter w-full">{content}</div>;
  };

  // Render Standard Portal Views
  const renderStandardView = () => {
    const content = (() => {
      switch (currentView) {
        case 'explore-challenges':
          return <ExploreChallengesPage />;
        case 'submit-challenge':
          return <SubmitChallengeForm />;
        case 'challenge-detail':
          return <CitizenChallengeDetail />;
        case 'citizen-dashboard':
          return <CitizenDashboard />;
        case 'university-dashboard':
          return <UniversityDashboard />;
        case 'student-dashboard':
          return <StudentDashboard />;
        case 'university-applications':
          return <UniversityApplicationsPage />;
        case 'university-reports':
          return <UniversityReportsPage />;
        case 'university-industry':
          return <UniversityIndustryPage />;
        case 'industry-dashboard':
          return <IndustryDashboard />;
        case 'government-dashboard':
          return <GovernmentDashboard />;
        case 'project-workspace':
          return <ProjectWorkspace />;
        case 'map-view':
          return <JharkhandMap />;
        case 'universities':
          return <UniversitiesPage />;
        case 'industry':
          return <IndustryPage />;
        case 'impact':
          return <PublicImpactDashboard />;
        case 'about':
          return <AboutPage />;
        default:
          return <LandingPage />;
      }
    })();
    return <div key={currentView} className="pt-page-enter">{content}</div>;
  };

  // 1. Standalone Full-Screen View for Public Entry Points (Landing, Role Selection, Login, Sign Up)
  if (isStandalonePublicView) {
    return (
      <div key={currentView} className="pt-page-enter min-h-screen w-full bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col">
        <main className="flex-1 w-full flex flex-col">
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'role-selection' && <RoleSelectionPage />}
          {currentView === 'login' && <LoginPage initialRole={currentRole} />}
          {currentView === 'signup' && <SignUpPage initialRole={currentRole} />}
          {currentView === 'about' && <AboutPage />}
        </main>
        {currentView !== 'landing' && currentView !== 'role-selection' && currentView !== 'about' && currentView !== 'signup' && currentView !== 'login' && <Footer />}
        <AuthModal />
      </div>
    );
  }

  // 2. Dedicated Standalone Citizen Experience with sidebar, bottom nav, and full-screen layout
  if (isCitizenRole) {
    return (
      <div key="citizen-portal" className="pt-portal-enter">
        <CitizenLayout>
          {renderCitizenView()}
        </CitizenLayout>
        <AuthModal />
      </div>
    );
  }

  // 3. Dedicated Standalone University Experience with institutional sidebar, bottom nav, and full-screen layout
  if (isUniversityRole) {
    return (
      <div key="university-portal" className="pt-portal-enter">
        <UniversityLayout>
          {renderUniversityView()}
        </UniversityLayout>
        <AuthModal />
      </div>
    );
  }

  // 4. Dedicated Standalone Industry Experience with corporate sidebar, role switcher, and workspaces
  if (isIndustryRole) {
    return (
      <div key="industry-portal" className="pt-portal-enter">
        <IndustryLayout />
        <AuthModal />
      </div>
    );
  }

  // 5. Dedicated Standalone Government Experience with official state header, access level switcher, and governance sidebar
  if (isGovernmentRole) {
    return (
      <div key="government-portal" className="pt-portal-enter">
        <GovernmentLayout />
        <AuthModal />
      </div>
    );
  }

  // 6. Regular Portal Layout for Other Roles (Public)
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Header */}
      <Header />



      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderStandardView()}
      </main>

      {/* Global Alerts & Modals */}
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
        <AIChatWidget />
      </AppProvider>
    </ToastProvider>
  );
}

