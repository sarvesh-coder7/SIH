import { ChallengeCategory, LifecycleStage, ProjectStage, UserRole } from './index';

export type IndustryMemberRole = 'org_admin' | 'technical_member' | 'csr_member';

export type OrganizationType =
  | 'Large Enterprise'
  | 'MSME'
  | 'Startup'
  | 'PSU'
  | 'Non-Profit Organization'
  | 'Research & Technology Organization'
  | 'Other';

export type ReportVisibility =
  | 'PUBLIC'
  | 'PARTICIPANTS'
  | 'UNIVERSITY_ONLY'
  | 'INDUSTRY_ONLY'
  | 'GOVERNMENT'
  | 'RESTRICTED';

export type CollaborationSupportType =
  | 'Funding'
  | 'Technology'
  | 'Manufacturing'
  | 'Testing'
  | 'Mentorship'
  | 'Deployment'
  | 'CSR';

export type CollaborationStatus =
  | 'Pending'
  | 'Under Review'
  | 'Accepted'
  | 'Declined'
  | 'Active'
  | 'Completed';

export interface IndustryOrganization {
  id: string;
  organization_name: string;
  organization_type: OrganizationType;
  sector: string;
  state: string;
  district: string;
  website_url: string;
  website?: string;
  description: string;
  verification_status: 'Verified' | 'Pending' | 'In Review';
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface IndustryMember {
  id: string;
  profile_id?: string;
  industry_id: string;
  name: string;
  email: string;
  phone?: string;
  designation: string;
  member_role: IndustryMemberRole;
  role?: IndustryMemberRole;
  avatar_url?: string;
  permissions: {
    canManageProfile: boolean;
    canManageOrgProfile?: boolean;
    canManageMembers: boolean;
    canManageCapabilities: boolean;
    canExpressCollaboration: boolean;
    canManageCollaborations: boolean;
    canViewAuthorizedReports: boolean;
    canSubmitTechnicalFeedback: boolean;
    canSubmitFeedback?: boolean;
    canAddContributions: boolean;
    canManageCSR: boolean;
    canManageFunding?: boolean;
  };
  status: 'Active' | 'Invited' | 'Suspended';
  created_at: string;
}

export interface IndustryCapabilities {
  id: string;
  industry_id: string;
  sectors: string[];
  technologies: string[];
  expertise: string[];
  manufacturing: string[];
  testing: string[];
  funding: {
    maxGrantINR: number;
    annualBudgetINR: number;
    preferredStages: string[];
  };
  csr: {
    eligible: boolean;
    thematicAreas: string[];
    priorityDistricts: string[];
  };
  deployment: string[];
  mentorship: string[];
  keywords: string[];
}

export interface IndustryContribution {
  id: string;
  collaboration_id: string;
  project_id: string;
  contribution_type: CollaborationSupportType;
  description: string;
  quantity?: string | number;
  status: 'Submitted' | 'In Progress' | 'Completed' | 'Verified';
  date: string;
  evidence_url?: string;
  evidence_name?: string;
  created_by: string;
}

export interface TechnicalFeedbackItem {
  id: string;
  project_id: string;
  author_name: string;
  author_org: string;
  author_role: string;
  date: string;
  created_at?: string;
  category: 'Testing Requirement' | 'Prototype Specifications' | 'Manufacturing Guidance' | 'Integration Requirements' | 'General Feedback';
  title: string;
  feedback_text: string;
  status: 'Open' | 'Addressed' | 'Incorporated';
  attachments?: {
    name: string;
    size: string;
    url: string;
  }[];
}

export interface ProjectIndustryCollaboration {
  id: string;
  project_id: string;
  challenge_id: string;
  industry_id: string;
  industry_name: string;
  university_id: string;
  university_name: string;
  project_title: string;
  collaboration_types: CollaborationSupportType[];
  status: CollaborationStatus;
  started_at: string;
  ended_at?: string;
  proposed_contribution: string;
  expected_support: string;
  contact_person: string;
  contact_email: string;
  additional_info?: string;
  progress_percent: number;
  university_response_notes?: string;
  contributions: IndustryContribution[];
  technical_updates?: {
    id: string;
    type: 'Testing Update' | 'Manufacturing Update' | 'Engineering Review';
    title: string;
    details: string;
    author: string;
    date: string;
    status: 'Pending' | 'Verified';
  }[];
}

export type IndustryCollaboration = ProjectIndustryCollaboration;


export interface ProjectReportDocument {
  id: string;
  project_id: string;
  challenge_id: string;
  title: string;
  project_title: string;
  university_name: string;
  report_type:
    | 'Initial Project Report'
    | 'Research Report'
    | 'Prototype Report'
    | 'Testing Report'
    | 'Pilot Report'
    | 'Final Project Report'
    | 'Impact Report'
    | 'Technical Specs'
    | 'Patent Application';
  uploaded_by: string;
  uploaded_at: string;
  file_name: string;
  file_size: string;
  file_url: string;
  visibility: ReportVisibility;
  description: string;
  verified: boolean;
  review_status?: 'Approved' | 'Correction Requested' | 'Flagged' | 'Restricted' | 'Archived' | 'Under Review';
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  moderation_reason?: string;
  audit_history?: {
    action: string;
    reason: string;
    actor: string;
    timestamp: string;
    previous_visibility?: ReportVisibility;
    new_visibility?: ReportVisibility;
    previous_status?: string;
    new_status?: string;
  }[];
}
