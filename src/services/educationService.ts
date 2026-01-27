import { api } from '@/lib/api';

export interface Education {
  id: string;
  institutionName: string;
  degreeEn: string;
  degreeFr: string;
  fieldOfStudyEn: string;
  fieldOfStudyFr: string;
  descriptionEn?: string;
  descriptionFr?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  logoUrl?: string;
  achievementsEn?: string[];
  achievementsFr?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getEducation = async (): Promise<Education[]> => {
  const response = await api.get('/education');
  return response.data.data || response.data;
};
