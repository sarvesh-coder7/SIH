import {
  AIAnalysis,
  ChallengeCategory,
  ChallengeUrgency,
} from '../types';

import { MOCK_UNIVERSITIES } from '../mock/data';

export interface AIAnalysisRequest {
  title: string;
  description: string;
  district: string;
  block?: string;
  category?: ChallengeCategory;
  affectedPopulation: number;
}

/**
 * AI SERVER URL
 *
 * Configurable via environment variable:
 *   VITE_AI_API_URL or VITE_AI_SERVER_URL
 * Defaults to http://127.0.0.1:8001
 */
const AI_SERVER_URL = (
  import.meta.env.VITE_AI_API_URL ||
  import.meta.env.VITE_AI_SERVER_URL ||
  'http://127.0.0.1:8001'
).replace(/\/$/, '');

const isProduction =
  import.meta.env.PROD === true;


/**
 * AI SERVICE
 */
export const aiService = {

  /**
   * Analyze a municipal challenge.
   *
   * NOTE:
   * This function currently contains the existing
   * deterministic fallback analysis logic.
   */
  analyzeChallengeAsync: async (
    request: AIAnalysisRequest
  ): Promise<AIAnalysis> => {

    // Simulate short processing latency
    await new Promise((resolve) =>
      setTimeout(resolve, 600)
    );

    const text =
      `${request.title} ${request.description}`.toLowerCase();

    // Default values
    let detectedCategory: ChallengeCategory =
      request.category || 'Water Resources';

    let subCat =
      'Rural Drinking Water & Quality Monitoring';

    let urgency: ChallengeUrgency = 'High';

    let priorityScore = 85;

    const affectedPopFormatted =
      (request.affectedPopulation || 0).toLocaleString();

    let reasoning =
      `High societal impact in ${request.district} affecting an estimated ${affectedPopFormatted} citizens. Problem exhibits clear technological feasibility for university research intervention.`;


    // --------------------------------------------------
    // WATER
    // --------------------------------------------------

    if (
      text.includes('water') ||
      text.includes('arsenic') ||
      text.includes('fluoride') ||
      text.includes('handpump') ||
      text.includes('filter')
    ) {
      detectedCategory = 'Water Resources';

      subCat =
        'Groundwater Remediation & IoT Filtration Systems';

      priorityScore =
        request.affectedPopulation > 10000
          ? 94
          : 86;

      urgency =
        priorityScore > 90
          ? 'Critical'
          : 'High';

      reasoning =
        `High chemical/pathogenic hazard reported in ${request.district}. Potential severe public health risks (fluorosis/gastroenteritis). High priority for adsorption or membrane technology deployment.`;
    }


    // --------------------------------------------------
    // AGRICULTURE
    // --------------------------------------------------

    else if (
      text.includes('crop') ||
      text.includes('farmer') ||
      text.includes('lac') ||
      text.includes('mahua') ||
      text.includes('soil') ||
      text.includes('irrigation') ||
      text.includes('vegetable')
    ) {
      detectedCategory =
        'Agriculture & Rural Economy';

      subCat =
        'Agro-Mechanization, Solar Cold Chain & Post-Harvest Value Addition';

      priorityScore = 88;

      urgency = 'High';

      reasoning =
        `Direct income multiplier for agrarian/tribal producers in ${request.district}. Addresses post-harvest storage losses and physical labor bottlenecks.`;
    }


    // --------------------------------------------------
    // HEALTHCARE
    // --------------------------------------------------

    else if (
      text.includes('health') ||
      text.includes('doctor') ||
      text.includes('hospital') ||
      text.includes('clinic') ||
      text.includes('maternal') ||
      text.includes('sickle cell')
    ) {
      detectedCategory =
        'Healthcare & Telemedicine';

      subCat =
        'Point-of-Care Diagnostics & Rural Tele-Consultation Grid';

      priorityScore = 95;

      urgency = 'Critical';

      reasoning =
        `Critical clinical accessibility gap in remote geography. High potential for portable battery-operated diagnostic hardware and specialist telemedicine.`;
    }


    // --------------------------------------------------
    // EDUCATION
    // --------------------------------------------------

    else if (
      text.includes('school') ||
      text.includes('student') ||
      text.includes('learning') ||
      text.includes('education') ||
      text.includes('teacher')
    ) {
      detectedCategory =
        'Smart Education & Skilling';

      subCat =
        'Offline Mesh Learning Pods & Solar Digital Classrooms';

      priorityScore = 82;

      urgency = 'Medium';

      reasoning =
        `Significant pedagogical inequality in low-connectivity forest school blocks. Highly suitable for edge-cached micro-servers (Raspberry Pi/Diksha).`;
    }


    // --------------------------------------------------
    // ENVIRONMENT
    // --------------------------------------------------

    else if (
      text.includes('coal') ||
      text.includes('dust') ||
      text.includes('smoke') ||
      text.includes('pollution') ||
      text.includes('forest') ||
      text.includes('mine')
    ) {
      detectedCategory =
        'Environment & Forest Livelihood';

      subCat =
        'Industrial Air & Runoff Remediation Telemetry';

      priorityScore = 91;

      urgency = 'Critical';

      reasoning =
        `Severe environmental compliance violation impacting community respiratory health and water bodies. High scope for CSR co-funding.`;
    }


    // --------------------------------------------------
    // UNIVERSITY MATCHING
    // --------------------------------------------------

    const recommendedUniversities =
      MOCK_UNIVERSITIES
        .map((univ) => {

          let match = 70;

          if (
            univ.domainStrengths.includes(
              detectedCategory
            )
          ) {
            match += 20;
          }

          if (
            univ.district === request.district
          ) {
            match += 6;
          }

          match = Math.min(
            98,
            Math.max(
              65,
              match + (priorityScore % 7)
            )
          );

          return {
            universityId: univ.id,

            universityName:
              `${univ.shortName} (${univ.district})`,

            matchScore: match,

            matchingFacultyCount:
              Math.floor(match / 10),

            domainExcellence:
              `Recognized lab for ${detectedCategory} and rural technology transfer`,
          };
        })
        .sort(
          (a, b) =>
            b.matchScore - a.matchScore
        )
        .slice(0, 3);


    // --------------------------------------------------
    // FINAL ANALYSIS RESPONSE
    // --------------------------------------------------

    return {
      category: detectedCategory,

      subCategory: subCat,

      priority: urgency,

      priorityScore,

      reasoning,

      similarChallengesCount:
        Math.floor(Math.random() * 3) + 1,

      similarChallengeIds: [
        'JH-2025-008910',
        'JH-2025-006240',
      ],

      recommendedDisciplines: [
        'Applied Science & Materials Engineering',
        'IoT Telemetry & Embedded Systems',
        'Civil & Environmental Design',
        'Social Impact & Field Ergonomics',
      ],

      recommendedUniversities,

      potentialImpactAssessment:
        `Direct upliftment of ${(request.affectedPopulation || 0).toLocaleString()} citizens with scalable deployment across neighboring blocks of ${request.district}.`,

      estimatedBudgetRange:
        '₹3,50,000 – ₹6,80,000 (Eligible for State R&D Grant + CSR)',

      confidenceScore: 0.96,
    };
  },


  /**
   * Send a chat message to FastAPI AI server.
   *
   * POST /chat
   *
   * Request:
   * {
   *   message: string
   * }
   *
   * Response:
   * {
   *   response: string,
   *   provider: string
   * }
   */
  sendChatMessage: async (
    message: string
  ): Promise<{
    response: string;
    provider: string;
  }> => {
    const cleanMessage = message.trim();

    if (!cleanMessage) {
      throw new Error('Please enter a message.');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(`${AI_SERVER_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: cleanMessage,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Successful response
      if (response.ok) {
        const data = await response.json();
        return {
          response: data.response || 'No response returned from AI.',
          provider: data.provider || 'gemini',
        };
      }

      // Server returned an error
      let errorDetail = 'Failed to get response from AI server.';
      try {
        const errorData = await response.json();
        if (errorData?.detail) {
          errorDetail = errorData.detail;
        }
      } catch {
        errorDetail = `AI server returned status ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorDetail);
    } catch (error: any) {
      if (isProduction) {
        throw new Error(error?.message || 'Unable to connect to the deployed AI server.');
      }

      const isConnectionError =
        error.name === 'AbortError' ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.message?.includes('Load failed');

      if (isConnectionError) {
        throw new Error('Unable to connect to local AI server. Make sure FastAPI is running on port 8001.');
      }

      throw error;
    }
  },

  /**
   * Check AI server health.
   *
   * GET /health
   */
  checkHealth: async (): Promise<{
    status: string;
    service: string;
    primary?: string;
    fallback?: string;
  } | null> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${AI_SERVER_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json();
      }

      return null;
    } catch {
      // Safe fallback when AI server is offline or unreachable - avoids spamming console errors
      return null;
    }
  },
};
