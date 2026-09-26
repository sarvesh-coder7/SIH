import {
  ProjectLifecycle,
  SolutionProposal,
} from '../types';

class ProjectService {
  /*
   * Active project lifecycle records.
   *
   * PROJ-JH-2026-0081 is reconstructed from the existing
   * Government, University, Industry and Project Workspace data.
   *
   * The current Supabase schema does not contain a dedicated
   * projects table, so this lifecycle record is maintained here.
   */

  private projects: ProjectLifecycle[] = [
    {
      id: 'PROJ-JH-2026-0081',

      challengeId: 'JH-2026-001248',

      challengeTitle:
        'High Fluoride Contamination in Ground Water (Khunti)',

      title:
        'Jal-Shuddhi: Solar-Powered Biochar & Activated Alumina Dual-Stage Filter',

      summary:
        'Solar-powered dual-stage filtration system using modified biochar and activated alumina for fluoride-contaminated groundwater in Khunti district.',

      description:
        'A field-oriented water filtration solution combining modified biochar and activated alumina filtration for fluoride-contaminated groundwater sources in Torpa block.',

      currentStage:
        'TRL 5: Lab Testing & Calibration',

      stage:
        'Lab Testing & Calibration',

      district: 'Khunti',

      category: 'Water Resources' as any,

      universityId: 'univ-bit-mesra',

      universityName:
        'Birla Institute of Technology (BIT) Mesra',

      university: {
        id: 'univ-bit-mesra',
        name: 'Birla Institute of Technology (BIT) Mesra',
        location: 'Mesra, Ranchi, Jharkhand',
        facultyMentor:
          'Dr. Alok Verma (Professor, Chemical Engineering)',
      },

      budget: {
        totalBudget: 480000,
        allowCorporateSponsorship: true,
        csrRequiredAmount: 350000,
        approvedBudget: 480000,
        estimatedTotal: 480000,
      },

      leadFaculty:
        'Dr. Alok Verma (Professor, Chemical Engineering)',

      industryPartner:
        'Tata Steel Innovation Centre',

      team: {
        id: 'TEAM-2026-01',

        challengeId: 'JH-2026-001248',

        projectId: 'PROJ-JH-2026-0081',

        name:
          'Team Jal-Shuddhi (Water Sanitation Cohort)',

        universityName:
          'Birla Institute of Technology (BIT Mesra)',

        facultyMentor:
          'Dr. Alok Verma (Professor, Chemical Engg)',

        leadFaculty: {
          id: 'member-jalshuddhi-faculty',

          name: 'Dr. Alok Verma',

          role: 'Faculty Lead',

          discipline: 'Chemical Engineering',

          department: 'Chemical Engineering',

          institution:
            'Birla Institute of Technology (BIT Mesra)',

          universityId: 'univ-bit-mesra',

          skills: [
            'Chemical Engineering',
            'Water Treatment',
            'Adsorption',
          ],

          email: 'alok.verma@bitmesra.ac.in',

          isLead: true,
        },

        members: [
          {
            id: 'member-pooja-soren',

            name: 'Pooja Soren',

            role:
              'Student Team Lead & Adsorption Testing',

            discipline: 'Chemical Engineering',

            department: 'Chemical Engineering',

            institution:
              'Birla Institute of Technology (BIT Mesra)',

            universityId: 'univ-bit-mesra',

            skills: [
              'Spectrometry',
              'Water Testing',
              'Lab Analysis',
            ],

            email: 'pooja.soren@bitmesra.ac.in',

            isLead: true,
          },

          {
            id: 'member-rohan-gupta',

            name: 'Rohan Kumar Gupta',

            role:
              'IoT Firmware & Telemetry',

            discipline:
              'Electronics & Communication',

            department:
              'Electronics & Comm (ECE)',

            institution:
              'Birla Institute of Technology (BIT Mesra)',

            universityId: 'univ-bit-mesra',

            skills: [
              'STM32',
              'LoRaWAN',
              'C++',
            ],

            email: 'rohan.gupta@bitmesra.ac.in',
          },

          {
            id: 'member-amit-murmu',

            name: 'Amit Murmu',

            role:
              'Mechanical Filtration Enclosure',

            discipline:
              'Mechanical Engineering',

            department:
              'Mechanical Engineering',

            institution:
              'Birla Institute of Technology (BIT Mesra)',

            universityId: 'univ-bit-mesra',

            skills: [
              'CAD / SolidWorks',
              '3D Printing',
              'Fabrication',
            ],

            email: 'amit.murmu@bitmesra.ac.in',
          },

          {
            id: 'member-sunita-hembrom',

            name: 'Sunita Hembrom',

            role:
              'Community Field Deployment & Surveys',

            discipline:
              'Rural Development / Social Work',

            department:
              'Rural Development / Social Work',

            institution:
              'Birla Institute of Technology (BIT Mesra)',

            universityId: 'univ-bit-mesra',

            skills: [
              'Santhali Language',
              'Field Trials',
              'SHG Liaison',
            ],

            email:
              'sunita.hembrom@bitmesra.ac.in',
          },
        ],

        formedDate: '2026-01-20',

        status: 'Active',

        domainFocus: [
          'Water Treatment',
          'Groundwater Quality',
          'Fluoride Removal',
          'Solar Power',
          'IoT Telemetry',
          'Community Field Testing',
        ],
      },

      proposal: {
        id: 'PROP-JH-2026-0081',

        challengeId: 'JH-2026-001248',

        challengeTitle:
          'High Fluoride Contamination in Ground Water (Khunti)',

        universityId: 'univ-bit-mesra',

        universityName:
          'Birla Institute of Technology (BIT Mesra)',

        teamId: 'TEAM-2026-01',

        title:
          'Jal-Shuddhi: Solar-Powered Biochar & Activated Alumina Dual-Stage Filter',

        problemUnderstanding:
          'Groundwater sources in Torpa block show significant fluoride contamination, requiring an affordable and locally maintainable treatment solution.',

        executiveSummary:
          'Jal-Shuddhi combines modified biochar and activated alumina in a dual-stage filtration system with solar-powered operation and telemetry for rural groundwater treatment.',

        proposedSolution:
          'Develop and field-test a solar-powered gravity filtration unit using modified biochar and activated alumina, supported by IoT monitoring and a community-oriented maintenance model.',

        innovationHighlights: [
          'Dual-stage biochar and activated alumina filtration',
          'Solar-powered operation',
          'IoT telemetry for field monitoring',
          'Locally maintainable filtration enclosure',
          'Community-focused operating model',
        ],

        technologyStack: [
          'Modified Biochar',
          'Activated Alumina',
          'Solar PV',
          'IoT Sensors',
          'STM32',
          'LoRaWAN',
          'SS316 Enclosure',
        ],

        methodology:
          'Laboratory characterization followed by prototype fabrication, hydraulic testing, calibration and controlled field deployment in Torpa block.',

        expectedOutcomes: [
          'Improved fluoride removal from contaminated groundwater',
          'Validated filtration performance under field conditions',
          'Low-maintenance rural deployment model',
          'Community-level operating and maintenance capability',
        ],

        resourcesRequired:
          'Chemical testing facilities, filtration materials, IoT electronics, fabrication facilities and controlled field-testing locations.',

        estimatedTimelineMonths: 6,

        durationMonths: 6,

        totalBudget: 480000,

        totalBudgetINR: 480000,

        budgetBreakdown: [
          {
            item:
              'Filtration materials and activated media',

            amount: 160000,

            justification:
              'Biochar, activated alumina and filtration components.',
          },

          {
            item:
              'Prototype fabrication and enclosure',

            amount: 140000,

            justification:
              'SS316 enclosure, fabrication and mechanical components.',
          },

          {
            item:
              'IoT and solar monitoring hardware',

            amount: 90000,

            justification:
              'Sensors, telemetry electronics and solar power components.',
          },

          {
            item:
              'Field testing and validation',

            amount: 90000,

            justification:
              'Water testing, field installation and validation activities.',
          },
        ],

        socialImpactScore: 92,

        sustainabilityPlan:
          'Community-oriented operation and maintenance supported by trained local Jal Sahiya workers and standardized replacement components.',

        risksAndMitigation: [
          {
            risk:
              'Variation in groundwater contamination levels',

            mitigation:
              'Use baseline water-quality testing and recalibrate filtration media for field conditions.',
          },

          {
            risk:
              'Maintenance and replacement of filtration media',

            mitigation:
              'Use standardized components and community-level operating procedures.',
          },

          {
            risk:
              'Field installation constraints',

            mitigation:
              'Coordinate pilot installations with PHED and district administration.',
          },
        ],

        status: 'Approved',

        submittedDate: '2026-01-20',

        approvedDate: '2026-02-05',

        industryPartnersRequested: [
          'Tata Steel Innovation Centre',
        ],

        csrFundingRequested: true,

        attachments: [
          {
            name:
              'Jal-Shuddhi-Lab-Spectrometry-Validation.pdf',

            size: '3.4 MB',

            url: '#',
          },

          {
            name:
              'Jal-Shuddhi-CAD-Enclosure-Specs-v2.pdf',

            size: '7.8 MB',

            url: '#',
          },
        ],
      },

      industryPartners: [
        {
          partnerId: 'ind-tata-steel',

          partnerName:
            'Tata Steel Innovation Centre',

          contributionType:
            'Hardware/Software',

          fundingAmount: 350000,

          mentorName:
            'Vikram Sengupta',
        },

        {
          partnerId:
            'ind-tata-steel-testing',

          partnerName:
            'Tata Steel Innovation Centre',

          contributionType:
            'Testing Facility',

          mentorName:
            'Vikram Sengupta',
        },

        {
          partnerId:
            'ind-tata-steel-mentorship',

          partnerName:
            'Tata Steel Innovation Centre',

          contributionType:
            'Mentorship',

          mentorName:
            'Vikram Sengupta',
        },
      ],

      currentStageIndex: 4,

      milestones: [
        {
          id: 'MS-001',

          title:
            'Groundwater Baseline Survey',

          description:
            'GPS-tagged water-quality assessment across Torpa block handpumps.',

          targetDate: '2026-01-31',

          completedDate: '2026-01-25',

          completed: true,

          deliverable:
            'Torpa baseline hydrology and water-quality survey',

          status: 'Completed',

          deliverables: [
            {
              name:
                'Torpa-Baseline-Hydrology-Survey-Jan2026.pdf',

              type: 'Research Report',

              fileUrl: '#',

              verified: true,
            },
          ],

          fundingTranche: 50000,
        },

        {
          id: 'MS-002',

          title:
            'Laboratory Adsorption & Spectrometry Validation',

          description:
            'Validate fluoride removal performance of the selected filtration media.',

          targetDate: '2026-02-15',

          completedDate: '2026-02-14',

          completed: true,

          deliverable:
            'Lab-scale spectrometry and adsorption kinetics report',

          status: 'Completed',

          deliverables: [
            {
              name:
                'Jal-Shuddhi-Lab-Spectrometry-Validation.pdf',

              type: 'Testing Report',

              fileUrl: '#',

              verified: true,
            },
          ],

          fundingTranche: 100000,
        },

        {
          id: 'MS-003',

          title:
            'Prototype Fabrication',

          description:
            'Fabricate the SS316 filtration enclosure and integrate the solar and telemetry systems.',

          targetDate: '2026-02-28',

          completedDate: '2026-02-18',

          completed: true,

          deliverable:
            'Prototype CAD schematics and industrial enclosure specifications',

          status: 'Completed',

          deliverables: [
            {
              name:
                'Jal-Shuddhi-CAD-Enclosure-Specs-v2.pdf',

              type: 'Prototype Report',

              fileUrl: '#',

              verified: true,
            },
          ],

          fundingTranche: 100000,
        },

        {
          id: 'MS-004',

          title:
            'Hydraulic Testing & Calibration',

          description:
            'Conduct hydraulic and filtration performance tests before field deployment.',

          targetDate: '2026-03-15',

          completed: false,

          status: 'In Progress',

          deliverable:
            'Hydraulic pressure and filtration calibration results',

          fundingTranche: 100000,
        },

        {
          id: 'MS-005',

          title:
            'Torpa Field Pilot',

          description:
            'Deploy pilot units in coordination with PHED and district administration.',

          targetDate: '2026-03-30',

          completed: false,

          status: 'Pending',

          deliverable:
            'Field pilot installation and monitoring report',

          fundingTranche: 80000,
        },

        {
          id: 'MS-006',

          title:
            'Community Operations & Validation',

          description:
            'Train local operators and evaluate field performance and community usability.',

          targetDate: '2026-04-15',

          completed: false,

          status: 'Pending',

          deliverable:
            'Community impact and field validation report',

          fundingTranche: 50000,
        },
      ],

      prototypeStatus: {
        trlLevel: 5,

        description:
          'Prototype validated through laboratory testing and calibration. Field pilot preparation is underway.',

        demoUrl: '#',

        testedAtLocation:
          'BIT Mesra laboratory and Torpa baseline testing sites',
      },

      fieldPilot: {
        location:
          'Torpa Block, Khunti District, Jharkhand',

        startDate: '2026-03-20',

        targetBeneficiaries: 300,

        actualBeneficiariesToDate: 0,

        successRatePercent: 0,

        pilotFeedback:
          'Pilot authorization has been coordinated with the District Collectorate, BDO Torpa and PHED Khunti for three installations.',
      },

      intellectualProperty: {
        patentFiled: true,

        patentApplicationNo:
          'IN-PAT-2026-JH-004128',

        patentTitle:
          'Regenerable Gravity Filtration System',

        filingDate: '2026-02-10',

        isStartupIncubated: false,
      },

      impactScorecard: {
        livesImpacted: 0,

        costReductionPercent: 0,

        environmentalSavings:
          'Solar-powered operation is intended to reduce dependence on conventional grid-powered filtration systems.',

        sdgGoals: [
          'SDG 6 - Clean Water and Sanitation',
          'SDG 7 - Affordable and Clean Energy',
          'SDG 9 - Industry, Innovation and Infrastructure',
          'SDG 11 - Sustainable Cities and Communities',
        ],
      },

      activityLog: [
        {
          timestamp:
            '2026-02-24T10:15:00Z',

          actor:
            'Dr. Vivek H. Topno, IAS',

          role:
            'Special Secretary (Innovation), DHTE',

          action:
            'Confirmed Official University Assignment — Challenge #JH-2026-001248 officially assigned to Birla Institute of Technology (BIT) Mesra (Official Attempt #1).',
        },

        {
          timestamp:
            '2026-02-18T11:15:00Z',

          actor:
            'Priya Kumari',

          role:
            'Student Lead',

          action:
            'Prototype CAD documentation uploaded — Industrial enclosure specifications were shared with the manufacturing partner.',
        },

        {
          timestamp:
            '2026-02-14T16:30:00Z',

          actor:
            'Dr. Ramesh Kumar Sinha',

          role:
            'Faculty Lead',

          action:
            'Laboratory validation report uploaded — Fluoride removal performance was documented through spectrometry and adsorption kinetics testing.',
        },

        {
          timestamp:
            '2026-02-05T10:00:00Z',

          actor:
            'Vikram Sengupta',

          role:
            'Tata Steel Innovation Centre',

          action:
            'Industry collaboration activated — Tata Steel Innovation Centre joined the project for manufacturing, testing and mentorship support.',
        },
      ],
    },
  ];

  async getProjects(): Promise<ProjectLifecycle[]> {
    await new Promise((res) => setTimeout(res, 120));

    return [...this.projects];
  }

  async getProjectById(
    id: string
  ): Promise<ProjectLifecycle | undefined> {
    await new Promise((res) => setTimeout(res, 80));

    return this.projects.find(
      (p) => p.id === id
    );
  }

  async getProjectByChallengeId(
    challengeId: string
  ): Promise<ProjectLifecycle | undefined> {
    await new Promise((res) => setTimeout(res, 80));

    return this.projects.find(
      (p) => p.challengeId === challengeId
    );
  }

  async advanceProjectStage(
    projectId: string
  ): Promise<ProjectLifecycle | null> {
    const proj = this.projects.find(
      (p) => p.id === projectId
    );

    if (proj && proj.currentStageIndex < 13) {
      proj.currentStageIndex += 1;

      if (!proj.activityLog) {
        proj.activityLog = [];
      }

      proj.activityLog.unshift({
        timestamp:
          new Date().toLocaleString(),

        actor: 'Project Lead',

        role: 'Faculty Mentor',

        action:
          `Project advanced to Stage ${proj.currentStageIndex + 1}/14`,
      });

      return { ...proj };
    }

    return null;
  }

  async completeMilestone(
    projectId: string,
    milestoneId: string,
    feedback?: string
  ): Promise<ProjectLifecycle | null> {
    const proj = this.projects.find(
      (p) => p.id === projectId
    );

    if (proj) {
      const ms = proj.milestones.find(
        (m) => m.id === milestoneId
      );

      if (ms) {
        ms.status = 'Completed';

        ms.completed = true;

        ms.completedDate =
          new Date()
            .toISOString()
            .split('T')[0];

        if (feedback) {
          ms.reviewerFeedback = feedback;
        }

        if (ms.deliverables) {
          ms.deliverables.forEach(
            (d) => {
              d.verified = true;
            }
          );
        }
      }

      if (!proj.activityLog) {
        proj.activityLog = [];
      }

      proj.activityLog.unshift({
        timestamp:
          new Date().toLocaleString(),

        actor:
          'CSR & Nodal Reviewer',

        role:
          'CSR Partner',

        action:
          `Milestone "${ms?.title}" verified and completed. Tranche released.`,
      });

      return { ...proj };
    }

    return null;
  }

  async submitProposal(
    proposal: Partial<SolutionProposal>
  ): Promise<SolutionProposal> {
    await new Promise(
      (res) => setTimeout(res, 200)
    );

    const fullProposal: SolutionProposal = {
      id:
        `prop-${Date.now().toString().slice(-4)}`,

      challengeId:
        proposal.challengeId ||
        'JH-2026-001309',

      challengeTitle:
        proposal.challengeTitle ||
        'Tribal Value Addition Solution',

      universityId:
        proposal.universityId ||
        'univ-bau-kanke',

      universityName:
        proposal.universityName ||
        'Birla Agricultural University',

      teamId:
        proposal.teamId ||
        'team-new-01',

      title:
        proposal.title ||
        'Innovative Societal Solution Proposal',

      problemUnderstanding:
        proposal.problemUnderstanding ||
        '',

      proposedSolution:
        proposal.proposedSolution ||
        '',

      innovationHighlights:
        proposal.innovationHighlights ||
        [
          'High-efficiency low-cost localized mechanism',
        ],

      technologyStack:
        proposal.technologyStack ||
        [
          'Solar PV',
          'IoT Sensors',
          'Local Fabrication',
        ],

      methodology:
        proposal.methodology ||
        'Phase 1: Lab modeling, Phase 2: Pilot prototype, Phase 3: Field deployment',

      expectedOutcomes:
        proposal.expectedOutcomes ||
        [
          '100% rural adoption',
          'Significant economic upliftment',
        ],

      resourcesRequired:
        proposal.resourcesRequired ||
        'Engineering workshop and test site access',

      estimatedTimelineMonths:
        proposal.estimatedTimelineMonths ||
        6,

      totalBudget:
        proposal.totalBudget ||
        450000,

      budgetBreakdown:
        proposal.budgetBreakdown ||
        [
          {
            item:
              'Prototyping Materials & Electronics',

            amount: 250000,

            justification:
              'Hardware bill of materials',
          },

          {
            item:
              'Field Validation & Village Testing',

            amount: 120000,

            justification:
              'Field trials across 3 Panchayats',
          },

          {
            item:
              'Student Innovation Grants',

            amount: 80000,

            justification:
              'Research stipends',
          },
        ],

      socialImpactScore: 92,

      sustainabilityPlan:
        proposal.sustainabilityPlan ||
        'Local SHG operation & maintenance model',

      risksAndMitigation:
        proposal.risksAndMitigation ||
        [
          {
            risk:
              'Spare parts supply chain',

            mitigation:
              'Standard off-the-shelf local hardware components',
          },
        ],

      status: 'Submitted',

      submittedDate:
        new Date()
          .toISOString()
          .split('T')[0],

      industryPartnersRequested: [
        'Tata Steel',
        'Tata Trusts',
      ],

      attachments: [
        {
          name:
            'Detailed-Project-Report-v1.pdf',

          size: '3.4 MB',

          url: '#',
        },
      ],
    };

    return fullProposal;
  }
}

export const projectService =
  new ProjectService();
