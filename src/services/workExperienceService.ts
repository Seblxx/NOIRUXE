import { api } from '@/lib/api';

export interface WorkExperience {
  id: string;
  company_name: string;
  position_en: string;
  position_fr: string;
  description_en: string;
  description_fr: string;
  location?: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  company_logo_url?: string;
  company_website?: string;
  achievements_en?: string[];
  achievements_fr?: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkExperienceCreate {
  company_name: string;
  position_en: string;
  position_fr: string;
  description_en: string;
  description_fr: string;
  location?: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  company_logo_url?: string;
  company_website?: string;
  achievements_en?: string[];
  achievements_fr?: string[];
  display_order?: number;
  is_active?: boolean;
}

export const getWorkExperience = async (): Promise<WorkExperience[]> => {
  const response = await api.get('/work-experience');
  return response.data.data || response.data;
};

export const createWorkExperience = async (exp: WorkExperienceCreate): Promise<WorkExperience> => {
  const response = await api.post('/work-experience', exp);
  return response.data;
};

export const updateWorkExperience = async (id: string, exp: Partial<WorkExperienceCreate>): Promise<WorkExperience> => {
  const response = await api.put(`/work-experience/${id}`, exp);
  return response.data;
};

export const deleteWorkExperience = async (id: string): Promise<void> => {
  await api.delete(`/work-experience/${id}`);
};
