import { api } from '@/lib/api';

export interface Skill {
  id: string;
  name_en: string;
  name_fr: string;
  category: string;
  proficiency: number;
  icon_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills');
  return response.data.data || response.data;
};

export const getAllSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills/all');
  return response.data.data || response.data;
};
