import { api } from "@/app/lib/api";
import { createResourceService, type ResourceId } from "@/app/services/resourceService";

// ─── Shared base type ────────────────────────────────────────────────────────
export interface CmsRecord {
  _id?: string;
  id?: ResourceId;
}

// ─── Spouse Visa — Resource Types ────────────────────────────────────────────

export interface Review extends CmsRecord {
  name: string;
  date: string;
  review_title: string;
  review_body: string;
  stars: number;
  image?: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface Faq extends CmsRecord {
  question: string;
  answer: string;
  is_active: boolean;
  sort_order: number;
}

export interface Fee extends CmsRecord {
  label: string;
  price: string;
  category: "personal" | "business" | "appeals";
  is_main: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface ProcessStep extends CmsRecord {
  title: string;
  /** Backend field is "text", not "description" */
  text: string;
  is_active: boolean;
  sort_order: number;
}


export interface HomeService extends CmsRecord {
  title: string;
  text: string;
  is_active: boolean;
  sort_order: number;
}

export interface Feature extends CmsRecord {
  title: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

export interface Logo extends CmsRecord {
  src: string;
  alt: string;
  is_active: boolean;
  sort_order: number;
}

export interface BlogSection {
  type: "intro" | "heading_text" | "list" | "cards" | "callout";
  heading?: string;
  text?: string;
  items?: string[];
  cards?: { title: string; text: string }[];
}

export interface BlogPost extends CmsRecord {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: BlogSection[];
  is_active: boolean;
  sort_order: number;
}

export interface Submission extends CmsRecord {
  name: string;
  email: string;
  phone: string;
  service: string;
  nationality: string;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  source: "contact" | "eligibility" | "process";
  notes: string;
  createdAt?: string;
}

export interface TeamMember extends CmsRecord {
  name: string;
  role?: string;
  bio?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
  sort_order: number;
}

export interface TeamMemberPayload extends Omit<TeamMember, "_id" | "id"> {}

export interface Service extends CmsRecord {
  title: string;
  slug?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
}

export interface ServicePayload extends Omit<Service, "_id" | "id"> {}

export interface SiteSettings {
  _id?: string;
  contact_phone: string;
  contact_phone_href: string;
  contact_email: string;
  contact_email_href: string;
  contact_whatsapp: string;
  contact_whatsapp_href: string;
  parent_site_name: string;
  parent_site_url: string;
  nav_items: { href: string; label: string }[];
  countries: string[];
  visa_services: string[];
  home_highlights: string[];
  quick_steps: string[];
  eligibility_requirements: string[];
  document_groups: string[];
  fee_options: string[];
  service_items: string[];
}

export interface CmsUser extends CmsRecord {
  name: string;
  email: string;
  role: "admin" | "editor";
  is_active: boolean;
  createdAt?: string;
}

export interface CmsUserPayload {
  name: string;
  email: string;
  role: "admin" | "editor";
  password?: string;
}

// ─── Payload types (strip DB-generated fields) ───────────────────────────────
export type ReviewPayload       = Omit<Review,       "_id" | "id">;
export type FaqPayload          = Omit<Faq,          "_id" | "id">;
export type FeePayload          = Omit<Fee,          "_id" | "id">;
export type ProcessStepPayload  = Omit<ProcessStep,  "_id" | "id">;
export type HomeServicePayload  = Omit<HomeService,  "_id" | "id">;
export type FeaturePayload      = Omit<Feature,      "_id" | "id">;
export type LogoPayload         = Omit<Logo,         "_id" | "id">;
export type BlogPostPayload     = Omit<BlogPost,     "_id" | "id">;

// ─── Spouse Visa CRUD services (all use /spouse-visa/ prefix) ─────────────────

export const reviewsService      = createResourceService<Review,      ReviewPayload>     ("/spouse-visa/reviews");
export const faqsService         = createResourceService<Faq,         FaqPayload>        ("/spouse-visa/faqs");
export const feesService         = createResourceService<Fee,         FeePayload>        ("/spouse-visa/fees");
export const processStepsService = createResourceService<ProcessStep, ProcessStepPayload>("/spouse-visa/process-steps");
export const homeServicesService = createResourceService<HomeService, HomeServicePayload>("/spouse-visa/home-services");
export const featuresService     = createResourceService<Feature,     FeaturePayload>    ("/spouse-visa/features");
export const logosService        = createResourceService<Logo,        LogoPayload>       ("/spouse-visa/logos");
export const blogPostsService    = createResourceService<BlogPost,    BlogPostPayload>   ("/spouse-visa/blog-posts");
export const servicesService     = createResourceService<any,         any>               ("/spouse-visa/home-services");
// Note: teamService has no backend endpoint yet — team page uses local state
export const teamService         = createResourceService<any,         any>               ("/spouse-visa/home-services");
export const projectsService     = createResourceService<any,         any>               ("/spouse-visa/home-services");

// ─── British Citizenship — extra fee type ────────────────────────────────────
export interface BcFee extends CmsRecord {
  label: string;
  price: string;
  category: "solicitor" | "home_office";
  note?: string;
  is_main: boolean;
  is_active: boolean;
  sort_order: number;
}
export type BcFeePayload = Omit<BcFee, "_id" | "id">;

// ─── Project-aware service factory ───────────────────────────────────────────
// Usage: const svc = createProjectServices("british-citizenship")
//        svc.reviews.list(), svc.faqs.list(), etc.
export function createProjectServices(apiPrefix: string) {
  return {
    reviews:      createResourceService<Review,      ReviewPayload>     (`/${apiPrefix}/reviews`),
    faqs:         createResourceService<Faq,         FaqPayload>        (`/${apiPrefix}/faqs`),
    fees:         createResourceService<any,         any>               (`/${apiPrefix}/fees`),
    processSteps: createResourceService<ProcessStep, ProcessStepPayload>(`/${apiPrefix}/process-steps`),
    features:     createResourceService<Feature,     FeaturePayload>    (`/${apiPrefix}/features`),
    logos:        createResourceService<Logo,        LogoPayload>       (`/${apiPrefix}/logos`),
    blogPosts:    createResourceService<BlogPost,    BlogPostPayload>   (`/${apiPrefix}/blog-posts`),
    // homeServices only exists for spouse-visa; for other projects returns empty
    homeServices: apiPrefix === "spouse-visa"
      ? createResourceService<HomeService, HomeServicePayload>(`/${apiPrefix}/home-services`)
      : createResourceService<any, any>(`/${apiPrefix}/features`),
    submissions: {
      ...createResourceService<Submission, Partial<Submission>>(`/${apiPrefix}/submissions`),
      updateStatus: (id: ResourceId, payload: Pick<Submission, "status" | "notes">) =>
        createResourceService<Submission, Partial<Submission>>(`/${apiPrefix}/submissions`).update(id, payload),
    },
    settings: {
      get:    ()             => api.get<any>(`/${apiPrefix}/settings`),
      update: (data: any)    => api.put<any>(`/${apiPrefix}/settings`, data),
    },
  };
}

// ─── Submissions service ─────────────────────────────────────────────────────

const submissionsResource = createResourceService<Submission, Partial<Submission>>("/spouse-visa/submissions");

export const submissionsService = {
  ...submissionsResource,
  updateStatus: (id: ResourceId, payload: Pick<Submission, "status" | "notes">) =>
    submissionsResource.update(id, payload),
};

// ─── Settings service (singleton — GET + PUT) ─────────────────────────────────

export const settingsService = {
  get:    ()                  => api.get<SiteSettings>("/spouse-visa/settings"),
  update: (data: SiteSettings) => api.put<SiteSettings>("/spouse-visa/settings", data),
};

// ─── Users service (shared, not spouse-visa namespaced) ───────────────────────

export const usersService = createResourceService<CmsUser, CmsUserPayload>("/users");
