import { AuthUser, AuthSession, RolePermissions } from '../types/auth';
import { UserRole } from '../types';
import { supabase } from '../lib/supabase';

const toAuthUser = (profile: any, authUser?: any): AuthUser => ({
  id: profile.id || authUser?.id,
  name: profile.name || authUser?.user_metadata?.full_name || authUser?.user_metadata?.first_name || 'User',
  email: profile.email || authUser?.email || '',
  phone: profile.phone || authUser?.user_metadata?.phone || '',
  role: profile.role || authUser?.user_metadata?.role || 'citizen',
  district: profile.district || authUser?.user_metadata?.district || 'Ranchi',
  organization: profile.organization || authUser?.user_metadata?.organization || undefined,
  designation: profile.designation || authUser?.user_metadata?.designation || undefined,
  verified: Boolean(profile.verified ?? true),
  isEmailVerified: Boolean(profile.is_email_verified ?? authUser?.email_confirmed_at),
  joinedDate: profile.joined_date ? profile.joined_date.split('T')[0] : new Date().toISOString().split('T')[0],
  roleProfileId: profile.login_id || profile.id || authUser?.id,
});

export class AuthService {
  private currentSession: AuthSession | null = null;

  constructor() {
    void this.initDatabase();
  }

  private async initDatabase() {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) await this.syncSessionFromSupabase(data.session.user, data.session);

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        this.currentSession = null;
        return;
      }
      void this.syncSessionFromSupabase(session.user, session);
    });
  }

  private async syncSessionFromSupabase(user: any, session?: any) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    const mapped = toAuthUser(profile || {}, user);
    this.currentSession = {
      token: session?.access_token || '',
      user: mapped,
      expiresAt: session?.expires_at ? session.expires_at * 1000 : Date.now() + 60 * 60 * 1000,
    };
  }

  public getSession(): AuthSession | null { return this.currentSession; }

  public async restoreCurrentUser(): Promise<AuthUser | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;
    await this.syncSessionFromSupabase(data.session.user, data.session);
    return this.currentSession?.user || null;
  }

  public getCurrentUser(): AuthUser {
    return this.currentSession?.user || {
      id: 'guest', name: 'Guest', email: 'guest@example.com', phone: '', role: 'citizen', district: 'Ranchi',
      verified: false, isEmailVerified: false, joinedDate: new Date().toISOString().split('T')[0], roleProfileId: 'guest',
    };
  }

  public isAuthenticated(): boolean {
    return !!this.currentSession && this.currentSession.expiresAt > Date.now();
  }

  public getAllUsers(): AuthUser[] { return []; }

  public async login(identifier: string, password?: string, requestedRole?: UserRole, rememberMe = true): Promise<{success:boolean; user?:AuthUser; message:string}> {
    let email = identifier.trim().toLowerCase();
    if (!email.includes('@')) {
      const { data: resolvedEmail, error: resolveError } = await supabase.rpc('get_auth_email_by_login_identifier', { p_identifier: identifier.trim() });
      if (resolveError || !resolvedEmail) return { success:false, message:'Login ID not found. Please use your registered email address.' };
      email = resolvedEmail;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
    if (error || !data.user) return { success:false, message:error?.message || 'Authentication failed. Please check your credentials.' };

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
    const m = data.user.user_metadata || {};
    const effectiveProfile = profile || {
      id: data.user.id,
      name: m.full_name || m.first_name || data.user.email?.split('@')[0] || 'Citizen',
      email: data.user.email,
      phone: m.phone || '',
      role: m.role || requestedRole || 'citizen',
      district: m.district || 'Ranchi',
      organization: m.organization || '',
      designation: m.designation || '',
      verified: true,
      is_email_verified: Boolean(data.user.email_confirmed_at),
      joined_date: data.user.created_at || new Date().toISOString(),
    };

    if (requestedRole && effectiveProfile.role !== requestedRole) {
      const compatible =
        (requestedRole === 'csr_org' && effectiveProfile.role === 'industry_msme') ||
        (requestedRole === 'industry_msme' && effectiveProfile.role === 'csr_org') ||
        (requestedRole === 'govt_department' && effectiveProfile.role === 'platform_admin') ||
        (requestedRole === 'university_admin' && ['student','faculty_mentor'].includes(effectiveProfile.role)) ||
        (requestedRole === 'student' && ['university_admin','faculty_mentor'].includes(effectiveProfile.role)) ||
        (requestedRole === 'faculty_mentor' && ['university_admin','student'].includes(effectiveProfile.role));
      if (!compatible) {
        await supabase.auth.signOut();
        return { success:false, message:`This account is registered as ${String(effectiveProfile.role).replace('_',' ').toUpperCase()}, not ${requestedRole.replace('_',' ').toUpperCase()}.` };
      }
    }

    const mapped = toAuthUser(effectiveProfile, data.user);
    this.currentSession = {
      token: data.session?.access_token || '',
      user: mapped,
      expiresAt: rememberMe ? (data.session?.expires_at ? data.session.expires_at * 1000 : Date.now()+86400000) : Date.now()+86400000,
    };
    return { success:true, user:mapped, message:`Welcome back, ${mapped.name}! Authentication successful.` };
  }

  public switchUser(_userId: string): AuthUser | null { return null; }

  public async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.currentSession = null;
  }

  public async generateVerificationCode(email: string): Promise<boolean> {
    const { error } = await supabase.auth.resend({ type:'signup', email: email.trim().toLowerCase() });
    return !error;
  }

  public async verifyEmail(_userId: string, email: string, code: string): Promise<{success:boolean; message:string}> {
    const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type:'email' });
    if (error || !data.user) return { success:false, message:error?.message || 'Invalid verification code.' };
    await this.syncSessionFromSupabase(data.user, data.session);
    return { success:true, message:'Email address verified successfully!' };
  }

  public async requestPasswordReset(email: string): Promise<{success:boolean; resetCode?:string; message:string}> {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/reset-password` });
    return error ? {success:false,message:error.message} : {success:true,message:`Password reset link sent to ${email}.`};
  }

  public async resetPassword(_email: string, _resetCode: string, newPassword?: string): Promise<{success:boolean; message:string}> {
    if (!newPassword) return {success:false,message:'Please provide a new password.'};
    const { error } = await supabase.auth.updateUser({ password:newPassword });
    return error ? {success:false,message:error.message} : {success:true,message:'Password updated successfully.'};
  }

  private async signUpWithProfile(email: string, password: string, meta: Record<string, any>, requestedRole: UserRole, message: string) {
    const { data, error } = await supabase.auth.signUp({ email, password, options:{ data: meta } });
    if (error) return { success:false, user:undefined, message:error.message, requiresVerification:false };
    if (!data.user) return { success:false, user:undefined, message:'Supabase did not create the account.', requiresVerification:false };

    if (data.session) await this.syncSessionFromSupabase(data.user, data.session);
    else {
      // Email confirmation is enabled: return a lightweight user so the UI can open verification.
      this.currentSession = null;
    }

    const user = this.currentSession?.user || {
      id:data.user.id, name:meta.full_name || meta.first_name || 'User', email, phone:meta.phone || '', role:requestedRole,
      district:meta.district || 'Ranchi', organization:meta.organization, designation:meta.designation,
      verified:false, isEmailVerified:false, joinedDate:new Date().toISOString().split('T')[0], roleProfileId:data.user.id,
    } as AuthUser;
    return { success:true, user, message, requiresVerification:!data.session };
  }

  public async registerCitizen(data: {fullName:string;email:string;phone:string;password?:string;district:string;block?:string;village?:string}) {
    return this.signUpWithProfile(data.email.trim().toLowerCase(), data.password || 'Citizen@12345!', {
      full_name:data.fullName, phone:data.phone, district:data.district, block:data.block || '', village:data.village || '', role:'citizen'
    }, 'citizen', 'Citizen account created successfully!');
  }

  public async registerUniversity(data: {institutionName:string;shortName?:string;category?:any;district:string;address?:string;officialEmail:string;website?:string;aisheCode?:string;accreditationGrade?:string;academicDisciplines?:string[];departments?:string[];researchAreas?:string[];labsAndFacilities?:string[];incubationCentreName?:string;authorizedContactPerson:string;authorizedContactDesignation:string;authorizedContactPhone:string;password?:string}) {
    return this.signUpWithProfile(data.officialEmail.trim().toLowerCase(), data.password || 'University@12345!', {
      full_name:data.authorizedContactPerson, phone:data.authorizedContactPhone, district:data.district, role:'university_admin',
      organization:data.institutionName, designation:data.authorizedContactDesignation, institution_name:data.institutionName,
      short_name:data.shortName || '', category:data.category || 'Private University', address:data.address || 'Jharkhand, India',
      website:data.website || 'https://example.com', aishe_code:data.aisheCode || '', accreditation_grade:data.accreditationGrade || '',
      academic_disciplines:data.academicDisciplines || [], departments:data.departments || [], research_areas:data.researchAreas || [],
      labs_and_facilities:data.labsAndFacilities || [], incubation_centre_name:data.incubationCentreName || ''
    }, 'university_admin', 'University account created successfully!');
  }

  public async registerFaculty(data: {fullName:string;officialEmail:string;phone:string;universityId:string;universityName:string;department:string;designation:string;areasOfExpertise:string[];researchInterests:string[];password?:string}) {
    return this.signUpWithProfile(data.officialEmail.trim().toLowerCase(), data.password || 'Faculty@12345!', {
      full_name:data.fullName, phone:data.phone, district:'Ranchi', role:'faculty_mentor', organization:data.universityName,
      designation:`${data.designation}, ${data.department}`, university_id:data.universityId, department:data.department,
      areas_of_expertise:data.areasOfExpertise, research_interests:data.researchInterests
    }, 'faculty_mentor', 'Faculty mentor account created successfully!');
  }

  public async registerIndustry(data: {organizationName:string;orgType:string;officialEmail:string;contactPerson:string;contactDesignation:string;contactPhone:string;district:string;domain:string;expertiseAreas:string[];fundingCapabilities?:any;technologyCapabilities?:string[];mentoringCapabilities?:string[];testingAndDeploymentCapabilities?:string[];password?:string}) {
    return this.signUpWithProfile(data.officialEmail.trim().toLowerCase(), data.password || 'Industry@12345!', {
      full_name:data.contactPerson, phone:data.contactPhone, district:data.district, role:'csr_org', organization:data.organizationName,
      designation:data.contactDesignation, org_type:data.orgType, domain:data.domain, expertise_areas:data.expertiseAreas || [],
      max_grant_per_project:data.fundingCapabilities?.maxGrantPerProject || '', csr_focus_sectors:data.fundingCapabilities?.csrFocusSectors || [],
      technology_capabilities:data.technologyCapabilities || [], mentoring_capabilities:data.mentoringCapabilities || [],
      testing_and_deployment_capabilities:data.testingAndDeploymentCapabilities || []
    }, 'csr_org', 'Industry & CSR partner account created successfully!');
  }

  public async registerStartup(data: {startupName:string;orgType:string;officialEmail:string;contactPerson:string;contactPhone:string;district:string;domain:string;dpiitNumber?:string;productsAndServices?:string;technicalCapabilities?:string[];areasOfInterest?:string[];password?:string}) {
    return this.signUpWithProfile(data.officialEmail.trim().toLowerCase(), data.password || 'Startup@12345!', {
      full_name:data.contactPerson, phone:data.contactPhone, district:data.district, role:'industry_msme', organization:data.startupName,
      designation:'Founder / Innovator', org_type:data.orgType, domain:data.domain, expertise_areas:data.areasOfInterest || [],
      technology_capabilities:data.technicalCapabilities || [], startup_dpiit_number:data.dpiitNumber || '', products_and_services:data.productsAndServices || ''
    }, 'industry_msme', 'Startup / MSME account created successfully!');
  }

  public getPermissions(role: UserRole): RolePermissions {
    switch (role) {
      case 'citizen': case 'community_org': case 'pri_ulb':
        return {canSubmitChallenge:true,canViewAllChallenges:true,canEvaluateChallenges:false,canProposeSolution:false,canFormTeam:false,canFundProjects:false,canValidateChallenges:false,canAccessGovtAnalytics:false,canAdministerSystem:false,allowedViews:['landing','role-selection','login','signup','citizen-dashboard','submit-challenge','explore-challenges','challenge-detail','map-view','impact','how-it-works','universities','industry']};
      case 'university_admin': case 'student':
        return {canSubmitChallenge:false,canViewAllChallenges:true,canEvaluateChallenges:true,canProposeSolution:true,canFormTeam:true,canFundProjects:false,canValidateChallenges:false,canAccessGovtAnalytics:false,canAdministerSystem:false,allowedViews:['landing','role-selection','login','signup','university-dashboard','university-challenges','university-teams','university-proposals','project-workspace','explore-challenges','challenge-detail','map-view','impact','how-it-works','universities','industry']};
      case 'faculty_mentor':
        return {canSubmitChallenge:false,canViewAllChallenges:true,canEvaluateChallenges:true,canProposeSolution:true,canFormTeam:true,canFundProjects:false,canValidateChallenges:false,canAccessGovtAnalytics:false,canAdministerSystem:false,allowedViews:['landing','role-selection','login','signup','university-dashboard','university-proposals','project-workspace','explore-challenges','challenge-detail','map-view','impact','how-it-works']};
      case 'csr_org': case 'industry_msme': case 'research_institute':
        return {canSubmitChallenge:false,canViewAllChallenges:true,canEvaluateChallenges:false,canProposeSolution:false,canFormTeam:false,canFundProjects:true,canValidateChallenges:false,canAccessGovtAnalytics:false,canAdministerSystem:false,allowedViews:['landing','role-selection','login','signup','industry-dashboard','industry-partnerships','industry-funding','project-workspace','explore-challenges','challenge-detail','map-view','impact','how-it-works','industry','universities']};
      case 'govt_department': case 'platform_admin':
        return {canSubmitChallenge:true,canViewAllChallenges:true,canEvaluateChallenges:true,canProposeSolution:false,canFormTeam:false,canFundProjects:true,canValidateChallenges:true,canAccessGovtAnalytics:true,canAdministerSystem:true,allowedViews:['landing','role-selection','login','signup','government-dashboard','admin-dashboard','explore-challenges','challenge-detail','project-workspace','map-view','impact','how-it-works','universities','industry']};
      default:
        return {canSubmitChallenge:true,canViewAllChallenges:true,canEvaluateChallenges:false,canProposeSolution:false,canFormTeam:false,canFundProjects:false,canValidateChallenges:false,canAccessGovtAnalytics:false,canAdministerSystem:false,allowedViews:['landing','role-selection','login','explore-challenges']};
    }
  }
}

export const authService = new AuthService();
