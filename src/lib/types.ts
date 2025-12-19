export type NavIcon = "home" | "briefcase" | "file-text" | "settings";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon?: NavIcon;
}

export type JobDetails = {
  id: string;
  company_id: string;
  area: string;
  role: string;
  min_experience_years: number;
  min_education: string;
  required_skills: string[];
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  observations: string | null;
  status: "open" | "draft" | "closed";
  created_at: string;
  updated_at: string;
};

export type Job = {
  id: string;
  area_id: string;
  area_name: string;
  role: string;
  status: "open" | "draft" | "closed";
};

export type Candidate = {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  location?: string | null;
  country?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  github_url?: string | null;
  website_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type JobArea = {
  id: string;
  key: string;
  name: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
  color: string;
};

export type ApplicationStatus =
  | "applied"
  | "pending"
  | "reviewed"
  | "rejected"
  | "accepted";

export type AIRecommendation =
  | "strong_fit"
  | "good_fit"
  | "neutral"
  | "weak_fit"
  | "not_recommended";

export type ApplicationSource =
  | "manual_upload"
  | "linkedin"
  | "website"
  | "referral"
  | "other";

export type Application = {
  id: string;
  candidate_id: string;
  job_id: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  applied_at: string;
  rejected_reason: string | null;
  created_at: string;
  updated_at: string;
  ai_score: number | null;
  ai_recommendation: AIRecommendation | null;
  ai_summary: string | null;
  ai_evaluated_at: string | null;
  candidate?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
    location: string | null;
    country: string | null;
  } | null;
};

// Form schemas
export type JobSchema = {
  area: string;
  role: string;
  min_experience_years: number;
  min_education: string;
  required_skills: string[];
  location: string;
  salary_min?: number;
  salary_max?: number;
  observations?: string;
  status: "draft" | "open" | "closed";
};

export type RegisterSchema = {
  company_name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginSchema = {
  email: string;
  password: string;
};

// Component types
export type JobRow = Job;

export type JobTableActions = {
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewApplications?: (id: string) => void;
  areas?: JobArea[];
};

export type JobWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId?: string;
};

export type ApplicationCardProps = {
  application: Application;
  fromJobId?: string;
};

export type JobSummaryProps = {
  values: JobSchema;
  areas?: JobArea[];
};

export type JobApplicationsProps = {
  jobId: string;
};

export type UploadDocumentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type JobsTableProps = {
  onEditJob?: (id: string) => void;
  onCreateJob?: () => void;
};

export type StepProps = {
  form: any; // UseFormReturn<JobSchema>
  areas?: JobArea[];
};

export type SkillsStepProps = StepProps & {
  skillInput: string;
  onSkillInputChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
};

// Hook options
export type UseJobsOptions = {
  limit?: number;
  status?: "open" | "draft" | "closed";
  area_id?: string;
};

export type UseApplicationsOptions = {
  job_id?: string;
  status?: ApplicationStatus;
  skip?: number;
  limit?: number;
  order_by?: string;
  order_direction?: "asc" | "desc";
};

export type UseJobAreasOptions = {
  activeOnly?: boolean;
};

// Store types
export type AuthState = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  authCheckPromise: Promise<string | null> | null;
  setAuthCheckPromise: (promise: Promise<string | null> | null) => void;
};
