export type EngagementType = "member" | "volunteer";

export interface MemberFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  motivation: string;
  consent: boolean;
}

export interface VolunteerFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  skills: string;
  availability: string;
  helpType: string;
  message: string;
  consent: boolean;
}
