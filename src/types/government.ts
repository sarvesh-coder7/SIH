import { ChallengeCategory } from './index';

export type GovernmentAccessLevel = 'state' | 'department' | 'district' | 'monitoring';

export interface GovernmentDepartment {
  id: string;
  name: string;
  code: string;
  department_type: 'State PMU' | 'Line Department' | 'District Administration' | 'Monitoring Unit';
  state: string;
  district?: string;
  focal_categories: ChallengeCategory[];
  contact_information: {
    nodal_officer: string;
    designation: string;
    email: string;
    phone: string;
    office_address: string;
  };
}

export interface GovernmentMember {
  id: string;
  profile_id: string;
  department_id: string;
  name: string;
  email: string;
  designation: string;
  access_level: GovernmentAccessLevel;
  department_name: string;
  district?: string;
  avatar_url?: string;
  permissions: {
    canVerifyChallenges: boolean;
    canConfirmAssignments: boolean;
    canReviewReports: boolean;
    canRestrictReports: boolean;
    canCreateSupportActions: boolean;
    canViewStateAnalytics: boolean;
    canModerateContent: boolean;
  };
  status: 'Active' | 'Suspended';
  created_at: string;
}

export interface GovernmentSupportAction {
  id: string;
  project_id: string;
  challenge_id?: string;
  project_title: string;
  issue_description: string;
  action_plan: string;
  responsible_department: string;
  priority: 'Normal' | 'High' | 'Critical' | 'Urgent';
  target_date: string;
  created_by: string;
  created_at: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Completed';
  title?: string;
  action_type?: string;
  description?: string;
  assigned_department?: string;
  target_completion_date?: string;
}


export interface ModerationRecord {
  id: string;
  target_type: 'Challenge' | 'Report' | 'Document' | 'User' | 'Project';
  target_id: string;
  target_title: string;
  action: 'Review' | 'Flag' | 'Restrict' | 'Request Correction' | 'Archive' | 'Remove';
  reason: string;
  actor_name: string;
  actor_department: string;
  timestamp: string;
  previous_state: string;
  new_state: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  department?: string;
  action: string;
  details: string;
  targetType?: string;
  targetId?: string;
}
