import { Challenge, ChallengeCategory, ChallengeUrgency, ChallengeStatus, AIAnalysis } from '../types';
import { aiService } from './aiService';
import { supabase } from '../lib/supabase';

export interface CreateChallengeInput {
  title: string;
  description: string;
  category: ChallengeCategory;
  subCategory?: string;
  district: string;
  block: string;
  village: string;
  gpsCoordinates?: { lat: number; lng: number };
  affectedPopulation: number;
  frequency: 'Daily' | 'Seasonal' | 'Recurring Periodic' | 'One-Time Event';
  urgency: ChallengeUrgency;
  expectedImpact: string;
  additionalInformation?: string;
  submittedBy: {
    userId: string;
    userName: string;
    userRole: any;
    contactNumber: string;
    organization?: string;
  };
  evidenceUrls?: {
    type: 'image' | 'video' | 'document' | 'audio';
    url: string;
    caption: string;
    gpsCoordinates?: { lat: number; lng: number };
    geotagLocation?: string;
    accuracy?: number;
    isGeotagged?: boolean;
    timestamp?: string;
    source?: 'camera' | 'upload' | 'sample';
    fileName?: string;
    fileSize?: string;
  }[];
}

const emptyAI = (category: ChallengeCategory, subCategory = ''): AIAnalysis => ({
  category, subCategory, priority: 'Medium', priorityScore: 0, reasoning: '',
  similarChallengesCount: 0, similarChallengeIds: [], recommendedDisciplines: [],
  recommendedUniversities: [], potentialImpactAssessment: '', estimatedBudgetRange: '', confidenceScore: 0,
});

class ChallengeService {
  private async hydrate(row: any): Promise<Challenge> {
    const [mediaRes, tagsRes, timelineRes, aiRes] = await Promise.all([
      supabase.from('challenge_media').select('*').eq('challenge_id', row.id).order('created_at', { ascending: true }),
      supabase.from('challenge_tags').select('*').eq('challenge_id', row.id).order('id', { ascending: true }),
      supabase.from('challenge_timeline').select('*').eq('challenge_id', row.id).order('date', { ascending: true }),
      supabase.from('ai_classifications').select('*').eq('challenge_id', row.id).order('created_at', { ascending: false }).limit(1),
    ]);

    const ai = aiRes.data?.[0];
    const aiAnalysis: AIAnalysis = ai ? {
      category: ai.category || row.category,
      subCategory: ai.sub_category || row.sub_category || '',
      priority: ai.priority || row.urgency || 'Medium',
      priorityScore: ai.priority_score || 0,
      reasoning: ai.reasoning || '',
      similarChallengesCount: ai.similar_challenges_count || 0,
      similarChallengeIds: ai.similar_challenge_ids || [],
      recommendedDisciplines: ai.recommended_disciplines || [],
      recommendedUniversities: [],
      potentialImpactAssessment: ai.potential_impact_assessment || '',
      estimatedBudgetRange: ai.estimated_budget_range || '',
      confidenceScore: ai.confidence_score || 0,
    } : emptyAI(row.category, row.sub_category);

    return {
      id: row.id,
      trackingId: row.tracking_id || row.id,
      title: row.title,
      description: row.description,
      problemSummary: row.problem_summary,
      category: row.category,
      subCategory: row.sub_category,
      district: row.district,
      block: row.block || '',
      village: row.village || '',
      gpsCoordinates: { lat: Number(row.latitude), lng: Number(row.longitude) },
      submittedBy: {
        userId: row.submitted_by || '', userName: row.submitter_name || 'Citizen',
        userRole: row.submitter_role || 'citizen', contactNumber: row.submitter_phone || '', organization: row.submitter_organization,
      },
      affectedPopulation: Number(row.affected_population || 0),
      frequency: row.frequency || 'Daily',
      urgency: row.urgency || 'Medium',
      expectedImpact: row.expected_impact || '',
      evidence: (mediaRes.data || []).map((m: any) => ({
        id: m.id, type: m.media_type, url: m.public_url || m.storage_path, caption: m.caption || '',
        timestamp: m.created_at || '', gpsCoordinates: m.latitude != null ? { lat: Number(m.latitude), lng: Number(m.longitude) } : undefined,
        geotagLocation: m.geotag_location, accuracy: m.accuracy, isGeotagged: m.is_geotagged,
        metadataAvailable: m.metadata_available, source: m.source, fileName: m.file_name, fileSize: m.file_size,
      })),
      additionalInformation: row.additional_information,
      submittedAt: row.submitted_at || row.created_at,
      status: row.status,
      currentStage: row.current_stage,
      aiAnalysis,
      assignedUniversityId: row.assigned_university_id || undefined,
      tags: (tagsRes.data || []).map((t: any) => t.tag),
      endorsementsCount: Number(row.endorsements_count || 0),
      viewsCount: Number(row.views_count || 0),
      timeline: (timelineRes.data || []).map((t: any) => ({
        stage: t.stage, date: t.date || t.created_at, description: t.description || '', actor: t.actor_name || 'Platform',
      })),
      trustStatus: row.trust_status || undefined,
      latestUpdate: row.latest_update || undefined,
      isReopened: row.is_reopened || false,
      reopenedReason: row.reopened_reason || undefined,
      openForSolutions: row.open_for_solutions || false,
    };
  }

  async getChallenges(filters?: { district?: string; category?: ChallengeCategory | 'All'; urgency?: ChallengeUrgency | 'All'; status?: ChallengeStatus | 'All'; search?: string; }): Promise<Challenge[]> {
    let query = supabase.from('challenges').select('*').order('submitted_at', { ascending: false });
    if (filters?.district && filters.district !== 'All') query = query.eq('district', filters.district);
    if (filters?.category && filters.category !== 'All') query = query.eq('category', filters.category);
    if (filters?.urgency && filters.urgency !== 'All') query = query.eq('urgency', filters.urgency);
    if (filters?.status && filters.status !== 'All') query = query.eq('status', filters.status);
    if (filters?.search?.trim()) {
      const q = filters.search.trim();
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,district.ilike.%${q}%,block.ilike.%${q}%,tracking_id.ilike.%${q}%`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return Promise.all((data || []).map((row) => this.hydrate(row)));
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    if (!id) return undefined;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let query = supabase.from('challenges').select('*');
    if (isUUID) {
      query = query.or(`id.eq.${id},tracking_id.eq.${id}`);
    } else {
      query = query.eq('tracking_id', id);
    }
    const { data, error } = await query.maybeSingle();
    if (error || !data) return undefined;
    return this.hydrate(data);
  }

  async getChallengesByUser(userId: string): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('submitted_by', userId)
      .order('submitted_at', { ascending: false });
    if (error) throw new Error(error.message);
    return Promise.all((data || []).map((row) => this.hydrate(row)));
  }

  async getTimeline(challengeId: string) {
    const { data, error } = await supabase
      .from('challenge_timeline')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('date', { ascending: true });
    if (error) {
      console.warn('Failed to fetch timeline:', error.message);
      return [];
    }
    return (data || []).map((t: any) => ({
      stage: t.stage,
      date: t.date || t.created_at,
      description: t.description || '',
      actor: t.actor_name || 'Platform Nodal Officer',
    }));
  }

  async getMedia(challengeId: string) {
    const { data, error } = await supabase
      .from('challenge_media')
      .select('*')
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: true });
    if (error) {
      console.warn('Failed to fetch challenge media:', error.message);
      return [];
    }
    return (data || []).map((m: any) => ({
      id: m.id,
      type: m.media_type,
      url: m.public_url || m.storage_path,
      caption: m.caption || '',
      timestamp: m.created_at || '',
      gpsCoordinates: m.latitude != null ? { lat: Number(m.latitude), lng: Number(m.longitude) } : undefined,
      geotagLocation: m.geotag_location,
      accuracy: m.accuracy,
      isGeotagged: m.is_geotagged,
      metadataAvailable: m.metadata_available,
      source: m.source,
      fileName: m.file_name,
      fileSize: m.file_size,
    }));
  }

  async addTimelineEntry(
    challengeId: string,
    stage: string,
    description: string,
    actorName?: string,
    actorUserId?: string
  ): Promise<void> {
    const { error } = await supabase.from('challenge_timeline').insert({
      challenge_id: challengeId,
      stage,
      description,
      actor_name: actorName || 'Platform Officer',
      actor_user_id: actorUserId || null,
      date: new Date().toISOString(),
    });
    if (error) {
      console.warn('Could not insert timeline entry:', error.message);
    }
  }

  async uploadEvidence(
    challengeId: string,
    evidence: NonNullable<CreateChallengeInput['evidenceUrls']>[number],
    index: number
  ) {
    try {
      const response = await fetch(evidence.url);
      if (!response.ok) throw new Error(`Unable to read evidence (${response.status})`);
      const blob = await response.blob();
      const ext =
        evidence.fileName?.split('.').pop() ||
        (evidence.type === 'image' ? 'jpg' : evidence.type === 'video' ? 'webm' : 'pdf');
      const contentType =
        blob.type ||
        (evidence.type === 'video'
          ? 'video/webm'
          : evidence.type === 'image'
          ? 'image/jpeg'
          : 'application/pdf');
      
      const subDir = evidence.type === 'video' ? 'videos' : evidence.type === 'document' ? 'documents' : 'photos';
      const path = `${challengeId}/${subDir}/${Date.now()}-${index}.${ext}`;
      
      let uploadBucket = 'challenge-evidence';
      let uploadRes = await supabase.storage.from(uploadBucket).upload(path, blob, { contentType, upsert: true });
      if (uploadRes.error) {
        uploadBucket = 'media';
        uploadRes = await supabase.storage.from(uploadBucket).upload(path, blob, { contentType, upsert: true });
      }
      if (uploadRes.error) throw uploadRes.error;

      const { data: publicData } = supabase.storage.from(uploadBucket).getPublicUrl(path);
      const publicUrl = publicData.publicUrl;

      const { error: insertErr } = await supabase.from('challenge_media').insert({
        challenge_id: challengeId,
        media_type: evidence.type,
        storage_path: path,
        public_url: publicUrl,
        caption:
          evidence.caption ||
          (evidence.type === 'video'
            ? 'Recorded site video evidence'
            : evidence.type === 'document'
            ? 'Official supporting document'
            : 'Site evidence photo'),
        file_name:
          evidence.fileName ||
          (evidence.type === 'video'
            ? `video_${Date.now()}.${ext}`
            : evidence.type === 'document'
            ? `document_${Date.now()}.${ext}`
            : `photo_${Date.now()}.${ext}`),
        file_size: evidence.fileSize || `${(blob.size / (1024 * 1024)).toFixed(2)} MB`,
        latitude: evidence.gpsCoordinates?.lat,
        longitude: evidence.gpsCoordinates?.lng,
        geotag_location: evidence.geotagLocation,
        accuracy: evidence.accuracy,
        is_geotagged: evidence.isGeotagged ?? Boolean(evidence.gpsCoordinates),
        metadata_available: Boolean(evidence.gpsCoordinates),
        source: evidence.source || 'upload',
      });
      if (insertErr) {
        console.warn('Could not insert row into challenge_media:', insertErr.message);
      }
    } catch (err) {
      console.warn('Evidence upload failed:', err);
    }
  }

  async createChallenge(input: CreateChallengeInput): Promise<Challenge> {
    let aiAnalysis: AIAnalysis;
    try {
      aiAnalysis = await aiService.analyzeChallengeAsync({
        title: input.title,
        description: input.description,
        district: input.district,
        block: input.block,
        category: input.category,
        affectedPopulation: input.affectedPopulation,
      });
    } catch (err) {
      console.warn('AI Analysis fallback triggered:', err);
      aiAnalysis = emptyAI(input.category, input.subCategory);
    }

    const isValidUUID = (val?: string | null): boolean => {
      if (!val) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    };

    // Obtain authenticated user UUID or validate submittedBy
    const { data: authData } = await supabase.auth.getUser();
    const currentAuthId = authData?.user?.id;
    const validSubmittedBy = (currentAuthId && isValidUUID(currentAuthId))
      ? currentAuthId
      : (isValidUUID(input.submittedBy?.userId) ? input.submittedBy.userId : null);

    const latVal = typeof input.gpsCoordinates?.lat === 'number' && !isNaN(input.gpsCoordinates.lat)
      ? input.gpsCoordinates.lat
      : 23.3441;
    const lngVal = typeof input.gpsCoordinates?.lng === 'number' && !isNaN(input.gpsCoordinates.lng)
      ? input.gpsCoordinates.lng
      : 85.3096;
    const trackingId = `JH-${new Date().getFullYear()}-${Date.now().toString().slice(-8)}`;

    const { data: row, error } = await supabase
      .from('challenges')
      .insert({
        title: input.title,
        description: input.description,
        problem_summary: input.description,
        category: input.category,
        sub_category: input.subCategory || aiAnalysis.subCategory,
        district: input.district || 'Ranchi',
        block: input.block || '',
        village: input.village || '',
        latitude: latVal,
        longitude: lngVal,
        submitted_by: validSubmittedBy,
        affected_population: Math.max(1, Number(input.affectedPopulation) || 1),
        frequency: input.frequency || 'Daily',
        urgency: input.urgency || 'High',
        expected_impact: input.expectedImpact,
        additional_information: input.additionalInformation,
        status: 'Submitted',
        current_stage: 'Challenge Submitted',
        trust_status: 'Evidence Submitted',
        views_count: 1,
        endorsements_count: 1,
        tracking_id: trackingId,
      })
      .select('*')
      .single();
    if (error || !row) {
      console.error('Failed to insert challenge into Supabase:', error);
      throw new Error(error?.message || 'Unable to save challenge to Supabase.');
    }

    // Write initial milestone and tags
    await Promise.allSettled([
      supabase.from('challenge_tags').insert([
        { challenge_id: row.id, tag: input.category },
        { challenge_id: row.id, tag: input.district || 'Jharkhand' },
        { challenge_id: row.id, tag: 'Crowdsourced' },
      ]),
      supabase.from('challenge_timeline').insert([
        {
          challenge_id: row.id,
          stage: 'Challenge Submitted',
          description: `Filed by ${input.submittedBy?.userName || 'Citizen Submitter'} from ${input.district || 'Jharkhand'} (${input.affectedPopulation || 1} affected people reported). Initial review pending.`,
          actor_user_id: validSubmittedBy,
          actor_name: input.submittedBy?.userName || 'Citizen Submitter',
          date: new Date().toISOString(),
        },
        {
          challenge_id: row.id,
          stage: 'AI Screening & Ingestion',
          description: `AI Priority Score: ${aiAnalysis.priorityScore}/100. Category: ${aiAnalysis.category}. Recommended Disciplines: ${aiAnalysis.recommendedDisciplines?.join(', ') || 'Rural Infrastructure'}.`,
          actor_user_id: null,
          actor_name: 'AI Problem Triage Engine',
          date: new Date().toISOString(),
        },
      ]),
      supabase.from('ai_classifications').insert({
        challenge_id: row.id,
        category: aiAnalysis.category,
        sub_category: aiAnalysis.subCategory,
        priority: aiAnalysis.priority,
        priority_score: aiAnalysis.priorityScore,
        reasoning: aiAnalysis.reasoning,
        similar_challenges_count: aiAnalysis.similarChallengesCount,
        similar_challenge_ids: aiAnalysis.similarChallengeIds || [],
        recommended_disciplines: aiAnalysis.recommendedDisciplines || [],
        potential_impact_assessment: aiAnalysis.potentialImpactAssessment,
        estimated_budget_range: aiAnalysis.estimatedBudgetRange,
        confidence_score: aiAnalysis.confidenceScore,
      }),
    ]);

    // Upload all evidence sequentially to ensure data integrity
    if (input.evidenceUrls && input.evidenceUrls.length > 0) {
      for (let i = 0; i < input.evidenceUrls.length; i++) {
        await this.uploadEvidence(row.id, input.evidenceUrls[i], i);
      }
    }

    return this.hydrate(row);
  }

  async updateChallenge(id: string, patch: Partial<CreateChallengeInput>): Promise<Challenge | null> {
    const dbPatch: any = { updated_at: new Date().toISOString() };
    if (patch.title) dbPatch.title = patch.title;
    if (patch.description) {
      dbPatch.description = patch.description;
      dbPatch.problem_summary = patch.description;
    }
    if (patch.category) dbPatch.category = patch.category;
    if (patch.subCategory) dbPatch.sub_category = patch.subCategory;
    if (patch.district) dbPatch.district = patch.district;
    if (patch.block) dbPatch.block = patch.block;
    if (patch.village) dbPatch.village = patch.village;
    if (patch.affectedPopulation !== undefined) dbPatch.affected_population = Number(patch.affectedPopulation);
    if (patch.frequency) dbPatch.frequency = patch.frequency;
    if (patch.urgency) dbPatch.urgency = patch.urgency;
    if (patch.expectedImpact) dbPatch.expected_impact = patch.expectedImpact;

    const { data, error } = await supabase.from('challenges').update(dbPatch).eq('id', id).select('*').single();
    if (error || !data) return null;
    return this.hydrate(data);
  }

  async endorseChallenge(id: string): Promise<number> {
    return this.addEndorsement(id);
  }

  async addEndorsement(id: string): Promise<number> {
    const { data, error } = await supabase.from('challenges').select('endorsements_count').eq('id', id).single();
    if (error || !data) return 0;
    const next = Number(data.endorsements_count || 0) + 1;
    const { data: updated } = await supabase
      .from('challenges')
      .update({ endorsements_count: next, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('endorsements_count')
      .single();
    return Number(updated?.endorsements_count || next);
  }

  async assignGovernment(challengeId: string, deptId: string, officerName: string, departmentName?: string): Promise<Challenge | null> {
    const notes = `Assigned to ${departmentName || deptId} by nodal authority. Project Lead: ${officerName}.`;
    return this.updateChallengeStatus(challengeId, 'Validated', {
      actorName: officerName,
      currentStage: 'Government Department Assigned',
      notes,
      trustStatus: 'Verified',
      openForSolutions: true,
    });
  }

  async assignUniversity(challengeId: string, universityId: string, universityName: string, facultyName: string): Promise<Challenge | null> {
    const notes = `Officially assigned to ${universityName}. Faculty Mentor: ${facultyName}. R&D cohort initiated.`;
    return this.updateChallengeStatus(challengeId, 'Assigned', {
      assignedUniversityName: universityName,
      actorName: facultyName,
      currentStage: 'Assigned to University R&D',
      notes,
      openForSolutions: true,
    });
  }

  async addIndustryCollaborator(challengeId: string, industryId: string, industryName: string, contributionType: string): Promise<Challenge | null> {
    const notes = `${industryName} partnered as Industry Co-Developer for pilot deployment (${contributionType}).`;
    await this.addTimelineEntry(challengeId, 'Industry Co-Development Partnered', notes, industryName);
    const { data } = await supabase
      .from('challenges')
      .update({
        latest_update: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', challengeId)
      .select('*')
      .single();
    return data ? this.hydrate(data) : null;
  }

  async updateChallengeStatus(
    id: string,
    status: ChallengeStatus,
    options?: {
      assignedUniversityName?: string;
      trustStatus?: 'Community Report' | 'Evidence Submitted' | 'Under Review' | 'Verified';
      openForSolutions?: boolean;
      currentStage?: string;
      notes?: string;
      actorName?: string;
      actorUserId?: string;
    }
  ): Promise<Challenge | null> {
    const patch: any = {
      status,
      latest_update: options?.notes || `Challenge advanced to ${status} stage.`,
      updated_at: new Date().toISOString(),
    };

    if (options?.assignedUniversityName) {
      patch.assigned_university_id = null;
    }
    if (options?.trustStatus) {
      patch.trust_status = options.trustStatus;
    } else if (status === 'Validated') {
      patch.trust_status = 'Verified';
    }
    if (options?.openForSolutions !== undefined) {
      patch.open_for_solutions = options.openForSolutions;
    } else if (status === 'Validated' || status === 'University Matching') {
      patch.open_for_solutions = true;
    }
    if (options?.currentStage) {
      patch.current_stage = options.currentStage;
    } else if (status === 'Validated') {
      patch.current_stage = 'Approved as Open Problem Statement';
    }

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    let targetDbId = id;
    let submittedBy: string | null = null;

    if (!isUUID) {
      const { data: found } = await supabase
        .from('challenges')
        .select('id, submitted_by')
        .eq('tracking_id', id)
        .maybeSingle();
      if (found?.id) {
        targetDbId = found.id;
        submittedBy = found.submitted_by;
      }
    } else {
      const { data: current } = await supabase
        .from('challenges')
        .select('submitted_by')
        .eq('id', id)
        .maybeSingle();
      submittedBy = current?.submitted_by || null;
    }

    const { data, error } = await supabase
      .from('challenges')
      .update(patch)
      .eq('id', targetDbId)
      .select('*')
      .maybeSingle();

    if (error) {
      console.warn('Could not update challenge in Supabase:', error.message);
    }

    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetDbId)) {
      const timelineStage =
        options?.currentStage ||
        (status === 'Validated' ? 'Approved as Open Problem Statement' : `Status updated to ${status}`);
      const timelineDesc =
        options?.notes ||
        `Challenge advanced to ${status} stage. Officially updated in state open problem statements repository.`;
      const timelineActor = options?.actorName || 'Platform Nodal Officer';
      const timelineUserId = options?.actorUserId || submittedBy || null;

      try {
        await supabase.from('challenge_timeline').insert({
          challenge_id: targetDbId,
          stage: timelineStage,
          description: timelineDesc,
          actor_user_id: timelineUserId,
          actor_name: timelineActor,
          date: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Could not insert timeline record:', err);
      }
    }

    if (data) {
      return this.hydrate(data);
    }

    const existing = await this.getChallengeById(targetDbId);
    if (existing) {
      return {
        ...existing,
        status,
        trustStatus: patch.trust_status || existing.trustStatus,
        openForSolutions: patch.open_for_solutions !== undefined ? patch.open_for_solutions : existing.openForSolutions,
        currentStage: patch.current_stage || existing.currentStage,
        latestUpdate: patch.latest_update || existing.latestUpdate,
      };
    }

    return null;
  }
}

export const challengeService = new ChallengeService();
