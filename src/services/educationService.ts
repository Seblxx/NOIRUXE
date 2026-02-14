import { api } from '@/lib/api';

export interface Education {
  id: string;
  institution_name: string;
  degree_en: string;
  degree_fr: string;
  field_of_study_en: string;
  field_of_study_fr: string;
  description_en?: string;
  description_fr?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  grade?: string;
  logo_url?: string;
  achievements_en?: string[];
  achievements_fr?: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getEducation = async (): Promise<Education[]> => {
  const response = await api.get('/education');
  return response.data.data || response.data;
};

export const getAllEducation = async (): Promise<Education[]> => {
  const response = await api.get('/education/all');
  return response.data.data || response.data;
};

export interface EducationCreate {
  institution_name: string;
  degree_en: string;
  degree_fr: string;
  field_of_study_en: string;
  field_of_study_fr: string;
  description_en?: string;
  description_fr?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  grade?: string;
  logo_url?: string;
  achievements_en?: string[];
  achievements_fr?: string[];
  display_order?: number;
  is_active?: boolean;
}

export const createEducation = async (edu: EducationCreate): Promise<Education> => {
  const response = await api.post('/education', edu);
  return response.data;
};

export const updateEducation = async (id: string, edu: Partial<EducationCreate>): Promise<Education> => {
  const response = await api.put(`/education/${id}`, edu);
  return response.data;
};

export const deleteEducation = async (id: string): Promise<void> => {
  await api.delete(`/education/${id}`);
};
