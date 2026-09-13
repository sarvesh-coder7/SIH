import { ProjectLifecycle, SolutionProposal, Milestone, MultidisciplinaryTeam } from '../types';
import { MOCK_PROJECTS } from '../mock/data';

class ProjectService {
  private projects: ProjectLifecycle[] = [...MOCK_PROJECTS];

  async getProjects(): Promise<ProjectLifecycle[]> {
    await new Promise((res) => setTimeout(res, 120));
    return [...this.projects];
  }

  async getProjectById(id: string): Promise<ProjectLifecycle | undefined> {
    await new Promise((res) => setTimeout(res, 80));
    return this.projects.find((p) => p.id === id);
  }

  async getProjectByChallengeId(challengeId: string): Promise<ProjectLifecycle | undefined> {
    await new Promise((res) => setTimeout(res, 80));
    return this.projects.find((p) => p.challengeId === challengeId);
  }

  async advanceProjectStage(projectId: string): Promise<ProjectLifecycle | null> {
    const proj = this.projects.find((p) => p.id === projectId);
    if (proj && proj.currentStageIndex < 13) {
      proj.currentStageIndex += 1;
      if (!proj.activityLog) proj.activityLog = [];
      proj.activityLog.unshift({
        timestamp: new Date().toLocaleString(),
        actor: 'Project Lead',
        role: 'Faculty Mentor',
        action: `Project advanced to Stage ${proj.currentStageIndex + 1}/14`,
      });
      return { ...proj };
    }
    return null;
  }

  async completeMilestone(projectId: string, milestoneId: string, feedback?: string): Promise<ProjectLifecycle | null> {
    const proj = this.projects.find((p) => p.id === projectId);
    if (proj) {
      const ms = proj.milestones.find((m) => m.id === milestoneId);
      if (ms) {
        ms.status = 'Completed';
        ms.completedDate = new Date().toISOString().split('T')[0];
        if (feedback) ms.reviewerFeedback = feedback;
        if (ms.deliverables) {
          ms.deliverables.forEach((d) => (d.verified = true));
        }
      }
      if (!proj.activityLog) proj.activityLog = [];
      proj.activityLog.unshift({
        timestamp: new Date().toLocaleString(),
        actor: 'CSR & Nodal Reviewer',
        role: 'CSR Partner',
        action: `Milestone "${ms?.title}" verified and completed. Tranche released.`,
      });
      return { ...proj };
    }
    return null;
  }


  async submitProposal(proposal: Partial<SolutionProposal>): Promise<SolutionProposal> {
    await new Promise((res) => setTimeout(res, 200));
    const fullProposal: SolutionProposal = {
      id: `prop-${Date.now().toString().slice(-4)}`,
      challengeId: proposal.challengeId || 'JH-2026-001309',
      challengeTitle: proposal.challengeTitle || 'Tribal Value Addition Solution',
      universityId: proposal.universityId || 'univ-bau-kanke',
      universityName: proposal.universityName || 'Birla Agricultural University',
      teamId: proposal.teamId || 'team-new-01',
      title: proposal.title || 'Innovative Societal Solution Proposal',
      problemUnderstanding: proposal.problemUnderstanding || '',
      proposedSolution: proposal.proposedSolution || '',
      innovationHighlights: proposal.innovationHighlights || ['High-efficiency low-cost localized mechanism'],
      technologyStack: proposal.technologyStack || ['Solar PV', 'IoT Sensors', 'Local Fabrication'],
      methodology: proposal.methodology || 'Phase 1: Lab modeling, Phase 2: Pilot prototype, Phase 3: Field deployment',
      expectedOutcomes: proposal.expectedOutcomes || ['100% rural adoption', 'Significant economic upliftment'],
      resourcesRequired: proposal.resourcesRequired || 'Engineering workshop and test site access',
      estimatedTimelineMonths: proposal.estimatedTimelineMonths || 6,
      totalBudget: proposal.totalBudget || 450000,
      budgetBreakdown: proposal.budgetBreakdown || [
        { item: 'Prototyping Materials & Electronics', amount: 250000, justification: 'Hardware bill of materials' },
        { item: 'Field Validation & Village Testing', amount: 120000, justification: 'Field trials across 3 Panchayats' },
        { item: 'Student Innovation Grants', amount: 80000, justification: 'Research stipends' },
      ],
      socialImpactScore: 92,
      sustainabilityPlan: proposal.sustainabilityPlan || 'Local SHG operation & maintenance model',
      risksAndMitigation: proposal.risksAndMitigation || [
        { risk: 'Spare parts supply chain', mitigation: 'Standard off-the-shelf local hardware components' },
      ],
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      industryPartnersRequested: ['Tata Steel', 'Tata Trusts'],
      attachments: [{ name: 'Detailed-Project-Report-v1.pdf', size: '3.4 MB', url: '#' }],
    };
    return fullProposal;
  }
}

export const projectService = new ProjectService();
