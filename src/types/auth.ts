import { UserRole } from './index';

export interface AuthUser {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  name: string;
  organization?: string;
  district: string;
  verified: boolean;
  isEmailVerified: boolean;
  joinedDate: string;
  avatarUrl?: string;
  designation?: string;
  loginId?: string;
  sessionToken?: string;
  roleProfileId?: string;
}

export interface CitizenProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  district: string;
  block?: string;
  village?: string;
  pincode?: string;
  preferredLanguage?: 'en' | 'hi' | 'sat';
}

export interface UniversityProfile {
  userId: string;
  institutionName: string;
  shortName?: string;
  category: 'State Public University' | 'Institute of National Importance' | 'Deemed University' | 'Private University' | 'Autonomous Engineering College';
  district: string;
  address: string;
  officialEmail: string;
  website: string;
  aisheCode?: string;
  accreditationGrade?: string; // NAAC A++, NBA, NIRF Rank
  academicDisciplines: string[];
  departments: string[];
  researchAreas: string[];
  labsAndFacilities: string[];
  incubationCentreName?: string;
  authorizedContactPerson: string;
  authorizedContactDesignation: string;
  authorizedContactPhone: string;
}

export interface FacultyProfile {
  userId: string;
  fullName: string;
  officialEmail: string;
  phone: string;
  universityId: string;
  universityName: string;
  department: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Dean / HoD' | 'Research Scientist';
  areasOfExpertise: string[];
  researchInterests: string[];
  orcidId?: string;
  googleScholarUrl?: string;
}

export interface IndustryProfile {
  userId: string;
  organizationName: string;
  orgType: 'Public Sector Undertaking (PSU)' | 'Large Enterprise / Corporate' | 'CSR Foundation / Trust' | 'Industry Association (CII/FICCI)';
  officialEmail: string;
  contactPerson: string;
  contactDesignation: string;
  contactPhone: string;
  district: string;
  domain: string;
  expertiseAreas: string[];
  fundingCapabilities: {
    maxGrantPerProject: string;
    csrFocusSectors: string[];
  };
  technologyCapabilities: string[];
  mentoringCapabilities: string[];
  testingAndDeploymentCapabilities: string[];
}

export interface StartupProfile {
  userId: string;
  startupName: string;
  orgType: 'DPIIT Recognized Startup' | 'Registered MSME' | 'University Incubatee' | 'Social Enterprise';
  officialEmail: string;
  contactPerson: string;
  contactPhone: string;
  district: string;
  domain: string;
  dpiitNumber?: string;
  udyamNumber?: string;
  productsAndServices: string;
  technicalCapabilities: string[];
  areasOfInterest: string[];
}

export interface GovernmentProfile {
  userId: string;
  fullName: string;
  officialEmail: string;
  phone: string;
  department: string;
  designation: string;
  district: string;
  employeeId?: string;
  authorizationLevel: 'State Nodal Officer' | 'District Collectorate / DDC' | 'JSHEC PMU Administrator' | 'Line Department Reviewer';
}

export interface RolePermissions {
  canSubmitChallenge: boolean;
  canViewAllChallenges: boolean;
  canEvaluateChallenges: boolean;
  canProposeSolution: boolean;
  canFormTeam: boolean;
  canFundProjects: boolean;
  canValidateChallenges: boolean;
  canAccessGovtAnalytics: boolean;
  canAdministerSystem: boolean;
  allowedViews: string[];
}

export interface AuthSession {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface LoginCredentials {
  identifier: string; // Email or Phone
  password?: string;
  role: UserRole;
  rememberMe?: boolean;
}
