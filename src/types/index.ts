export type UserRole =
  | 'citizen'
  | 'community_org'
  | 'pri_ulb'
  | 'govt_department'
  | 'university_admin'
  | 'faculty_mentor'
  | 'student'
  | 'industry_msme'
  | 'csr_org'
  | 'research_institute'
  | 'platform_admin';

export type ChallengeCategory =
  | 'Water Resources'
  | 'Agriculture & Rural Economy'
  | 'Healthcare & Telemedicine'
  | 'Smart Education & Skilling'
  | 'Sanitation & Waste Management'
  | 'Renewable Energy & Power'
  | 'Environment & Forest Livelihood'
  | 'Tribal Handicrafts & Value Addition'
  | 'Urban Infrastructure & Mobility'
  | 'Public Service Delivery';

export type ChallengeUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export type ChallengeStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Validated'
  | 'University Matching'
  | 'Assigned'
  | 'Project Proposed'
  | 'In Development'
  | 'Pilot'
  | 'Implemented'
  | 'Impact Measured'
  | 'Rejected';

export type LifecycleStage =
  | 'Challenge Submitted'
  | 'Validation & Screening'
  | 'University Allocation'
  | 'Team Formation'
  | 'Proposal Formulation'
  | 'Stakeholder Approval'
  | 'Research & Planning'
  | 'Prototype Development'
  | 'Lab & Simulation Testing'
  | 'Field Pilot Testing'
  | 'Industry Co-Implementation'
  | 'Technology Transfer'
  | 'Social Impact Measurement'
  | 'Project Completed';

export type ProjectStage =
  | '1_Challenge_Ingestion'
  | '2_Institutional_Assignment'
  | '3_Team_Formation'
  | '4_Proposal_Design'
  | '5_Proposal_Evaluation_Funding'
  | '6_Solution_Prototyping'
  | '7_Lab_Testing'
  | '8_Community_CoDesign_PilotPrep'
  | '9_Field_Deployment'
  | '10_User_Feedback_Iteration'
  | '11_Govt_Industry_Handover'
  | '12_Large_Scale_Implementation'
  | '13_Impact_Measurement'
  | '14_Policy_Feedback_Loop';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  organization?: string;
  district: string;
  avatarUrl?: string;
  designation?: string;
  verified: boolean;
  joinedDate: string;
}

export interface MultimediaEvidence {
  id: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url: string;
  caption: string;
  timestamp: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
  geotagLocation?: string;
  accuracy?: number;
  isGeotagged?: boolean;
  metadataAvailable?: boolean;
  source?: 'camera' | 'upload' | 'sample';
  fileName?: string;
  fileSize?: string;
}

export interface AIAnalysis {
  category: ChallengeCategory;
  subCategory: string;
  priority: ChallengeUrgency;
  priorityScore: number; // 0-100
  reasoning: string;
  similarChallengesCount: number;
  similarChallengeIds: string[];
  recommendedDisciplines: string[];
  recommendedUniversities: {
    universityId: string;
    universityName: string;
    matchScore: number;
    matchingFacultyCount: number;
    domainExcellence: string;
  }[];
  potentialImpactAssessment: string;
  estimatedBudgetRange: string;
  confidenceScore: number;
}

export interface Challenge {
  id: string;
  trackingId?: string;
  title: string;
  description: string;
  problemSummary?: string;
  category: ChallengeCategory;
  subCategory?: string;
  district: string;
  block: string;
  village: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
  submittedBy: {
    userId: string;
    userName: string;
    userRole: UserRole;
    contactNumber: string;
    organization?: string;
  };
  affectedPopulation: number;
  frequency: 'Daily' | 'Seasonal' | 'Recurring Periodic' | 'One-Time Event';
  urgency: ChallengeUrgency;
  expectedImpact: string;
  evidence: MultimediaEvidence[];
  additionalInformation?: string;
  submittedAt: string;
  status: ChallengeStatus;
  currentStage: LifecycleStage;
  aiAnalysis: AIAnalysis;
  assignedUniversityId?: string;
  assignedUniversityName?: string;
  assignedFacultyId?: string;
  assignedFacultyName?: string;
  projectId?: string;
  tags: string[];
  endorsementsCount: number;
  viewsCount: number;
  timeline: {
    stage: string;
    date: string;
    description: string;
    actor: string;
  }[];
  trustStatus?: 'Community Report' | 'Evidence Submitted' | 'Under Review' | 'Verified';
  latestUpdate?: string;
  isReopened?: boolean;
  reopenedReason?: string;
  openForSolutions?: boolean;
  visibleToUniversities?: string[];
  expressionsOfInterest?: ExpressionOfInterest[];
  attemptsHistory?: ChallengeAttempt[];
  officialAssignment?: {
    assignedToUniversity: string;
    assignedDate: string;
    assignedBy: string;
    attemptNumber: number;
    projectId?: string;
    status: 'Active Workspace' | 'Completed' | 'Halted';
  };
  previousAttempts?: {
    attemptNumber: number;
    universityName: string;
    outcome: 'Unsuccessful' | 'Successful' | 'In Progress';
    completedDate: string;
    publicSummary: string;
    publicReportUrl?: string;
  }[];
  publicOutcome?: {
    title: string;
    summary: string;
    beneficiariesCount: number;
    districtsCount: number;
    deploymentStatus: string;
    universityName: string;
    industryPartner?: string;
    completedDate: string;
  };
  industrySubmissions?: IndustrySolutionSubmission[];
}

export interface IndustrySolutionSubmission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  industryId: string;
  industryName: string;
  submittedBy: string;
  contactEmail: string;
  contactPhone?: string;
  solutionTitle: string;
  summary: string;
  technicalDetails: string;
  resultsMetrics?: string;
  resultsDocuments?: { name: string; size: string; url: string }[];
  collaborationMode: 'Independent' | 'Collaborate with University';
  targetUniversityName?: string;
  budgetOrCsrCommitment?: string;
  timelineEstimate: string;
  status: 'Submitted to Government' | 'Government Approved' | 'Collaboration Accepted' | 'Under Review' | 'Revision Requested';
  governmentNotes?: string;
  submittedAt: string;
}

export interface ExpressionOfInterest {
  id: string;
  challengeId: string;
  universityId: string;
  universityName: string;
  facultyLead: string;
  department: string;
  initialApproach: string;
  targetTimeline: string;
  resourcesNeeded: string;
  studentCohortSize: number;
  submittedAt: string;
  submittedDate?: string;
  projectedTimelineMonths?: number;
  approachProposal?: string;
  feasibilityScore?: number;
  status: 'Under Review' | 'Officially Assigned' | 'Declined';
  governmentReviewNotes?: string;
  assignedAttemptNumber?: number;
}

export interface ChallengeAttempt {
  attemptNumber: number;
  universityId: string;
  universityName: string;
  department: string;
  approach: string;
  outcome: 'FAILED' | 'HALTED' | 'IN_PROGRESS' | 'SUCCESS';
  startDate: string;
  endDate?: string;
  period?: string;
  status?: string;
  failureReason?: string;
  publicLessonsLearned: string;
  lessonsLearned?: string;
  preservedArtifacts: {
    title: string;
    type: 'dataset' | 'cad' | 'report' | 'sensor_log';
    size: string;
  }[];
  howNextAttemptLeveraged?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  discipline?: string;
  department: string;
  institution?: string;
  universityId?: string;
  avatar?: string;
  skills: string[];
  email: string;
  isLead?: boolean;
}

export interface MultidisciplinaryTeam {
  id: string;
  challengeId: string;
  projectId?: string;
  name: string;
  universityName: string;
  facultyMentor?: string;
  leadFaculty?: TeamMember;
  members: TeamMember[];
  formedDate: string;
  status: 'Active' | 'Forming' | 'Completed';
  domainFocus: string[];
}


export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate?: string;
  dueDate?: string;
  completedDate?: string;
  completed?: boolean;
  deliverable?: string;
  status?: 'Pending' | 'In Progress' | 'Under Review' | 'Completed' | 'Delayed';
  deliverables?: {
    name: string;
    type: string;
    fileUrl?: string;
    verified: boolean;
  }[];
  fundingTranche?: number;
  reviewerFeedback?: string;
}

export type ProposalStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Revision Required'
  | 'Rejected';

export interface SolutionProposal {
  id: string;
  challengeId: string;
  challengeTitle?: string;
  universityId: string;
  universityName: string;
  teamId?: string;
  title: string;
  problemUnderstanding?: string;
  executiveSummary?: string;
  proposedSolution?: string;
  innovationHighlights?: string[];
  technologyStack: string[];
  methodology?: string;
  expectedOutcomes?: string[];
  resourcesRequired?: string;
  estimatedTimelineMonths?: number;
  durationMonths?: number;
  totalBudget?: number; // in INR
  totalBudgetINR?: number;
  budgetBreakdown?: {
    item: string;
    amount: number;
    justification: string;
  }[];
  socialImpactScore?: number; // 0-100
  sustainabilityPlan?: string;
  risksAndMitigation?: {
    risk: string;
    mitigation: string;
  }[];
  status: ProposalStatus;
  submittedDate: string;
  approvedDate?: string;
  industryPartnersRequested?: string[];
  csrFundingRequested?: boolean;
  attachments?: {
    name: string;
    size: string;
    url: string;
  }[];
}

export interface IndustryPartner {
  id: string;
  name: string;
  type?: 'Large Industry' | 'Startup' | 'MSME' | 'CSR Foundation' | 'Research Institution';
  sector?: string;
  location?: string;
  headquarters?: string;
  focalDomains?: ChallengeCategory[];
  csrThematicAreas?: string[];
  totalFundingCommitted?: number; // INR
  committedFundingINR?: number;
  activeProjectsCount?: number;
  sponsoredProjectsCount?: number;
  mentorsCount?: number;
  logoUrl?: string;
  description: string;
  csrFocalDistricts?: string[];
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  district: string;
  location?: string;
  type: string;
  facultiesCount: number;
  studentsCount: number;
  activeProjects: number;
  activeProjectsCount?: number;
  resolvedChallenges: number;
  resolvedCount?: number;
  incubationCenter: string;
  patentsFiled: number;
  domainStrengths: string[];
  keyDomains?: string[];
  logo: string;
}

export interface Project {
  id: string;
  challengeId: string;
  challengeTitle?: string;
  title: string;
  description?: string;
  executiveSummary?: string;
  district?: string;
  category?: ChallengeCategory;
  universityId: string;
  universityName: string;
  status: 'In Development' | 'Lab Tested' | 'Field Pilot' | 'Implemented' | 'Scale Rollout';
  currentStage: ProjectStage | LifecycleStage;
  trlLevel: string;
  completionPercentage: number;
  teamMembers: TeamMember[];
  totalBudgetINR: number;
  milestones: Milestone[];
  csrFunding?: {
    sponsorName: string;
    amountINR: number;
    status: 'Approved' | 'Disbursed' | 'Pending';
    approvedDate?: string;
    mentorshipProvided?: string;
  };
  beneficiariesTarget?: number;
  actualBeneficiaries?: number;
  pilotLocation?: string;
  patentStatus?: string;
  createdDate: string;
}

export interface ProjectLifecycle {
  id: string;
  challengeId: string;
  challengeTitle: string;
  title?: string;
  summary?: string;
  currentStage?: string;
  district: string;
  category: ChallengeCategory;
  universityId: string;
  universityName: string;
  university?: {
    id?: string;
    name: string;
    location?: string;
    facultyMentor?: any;
  };

  budget?: {
    totalBudget?: number;
    allowCorporateSponsorship?: boolean;
    csrRequiredAmount?: number;
    approvedBudget?: number;
    estimatedTotal?: number;
  };
  stage?: string;
  description?: string;
  leadFaculty?: string;
  industryPartner?: string;
  team: MultidisciplinaryTeam;
  proposal: SolutionProposal;
  industryPartners: {
    partnerId: string;
    partnerName: string;
    contributionType: 'Funding' | 'Mentorship' | 'Testing Facility' | 'Pilot Site' | 'Hardware/Software';
    fundingAmount?: number;
    mentorName?: string;
  }[];
  currentStageIndex: number; // 0 to 13
  milestones: Milestone[];
  prototypeStatus: {
    trlLevel: number; // TRL 1 to 9
    description: string;
    demoUrl?: string;
    testedAtLocation?: string;
  };
  fieldPilot: {
    location: string;
    startDate: string;
    targetBeneficiaries: number;
    actualBeneficiariesToDate: number;
    successRatePercent: number;
    pilotFeedback: string;
  };
  intellectualProperty: {
    patentFiled: boolean;
    patentApplicationNo?: string;
    patentTitle?: string;
    filingDate?: string;
    isStartupIncubated: boolean;
    startupName?: string;
  };
  impactScorecard?: {
    livesImpacted: number;
    costReductionPercent: number;
    environmentalSavings: string;
    sdgGoals: string[];
  };
  activityLog?: {
    timestamp: string;
    actor: string;
    role: string;
    action: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Challenge' | 'Project' | 'Collaboration' | 'Approval' | 'System';
  timestamp: string;
  date?: string;
  read: boolean;
  actionUrl?: string;
  relatedId?: string;
  targetId?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderOrg?: string;
  timestamp: string;
  text: string;
  attachments?: {
    name: string;
    url: string;
    size: string;
  }[];
}

export interface Conversation {
  id: string;
  projectId?: string;
  challengeId?: string;
  title: string;
  participants: User[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface DistrictMetric {
  districtName: string;
  totalChallenges: number;
  inProgressProjects: number;
  resolvedChallenges: number;
  activeUniversities: number;
  beneficiariesCount: number;
  dominantDomain: ChallengeCategory;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export * from './auth';
export * from './industry';
export * from './government';
