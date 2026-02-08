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

export interface SkillCreate {
  name_en: string;
  name_fr: string;
  category: string;
  proficiency: number;
  icon_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills');
  return response.data.data || response.data;
};

export const getAllSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills/all');
  return response.data.data || response.data;
};

export const createSkill = async (skill: SkillCreate): Promise<Skill> => {
  const response = await api.post('/skills', skill);
  return response.data;
};

export const updateSkill = async (id: string, skill: Partial<SkillCreate>): Promise<Skill> => {
  const response = await api.put(`/skills/${id}`, skill);
  return response.data;
};

export const deleteSkill = async (id: string): Promise<void> => {
  await api.delete(`/skills/${id}`);
};
