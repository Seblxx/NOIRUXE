import { api } from '@/lib/api';

export interface Skill {
  id: string;
  nameEn: string;
  nameFr: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills');
  return response.data.data || response.data;
};

export const getAllSkills = async (): Promise<Skill[]> => {
  const response = await api.get('/skills/all');
  return response.data.data || response.data;
};
