import { api } from '@/lib/api';

export interface WorkExperience {
  id: string;
  companyName: string;
  positionEn: string;
  positionFr: string;
  descriptionEn: string;
  descriptionFr: string;
  location?: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  companyLogoUrl?: string;
  companyWebsite?: string;
  achievementsEn?: string[];
  achievementsFr?: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getWorkExperience = async (): Promise<WorkExperience[]> => {
  const response = await api.get('/work-experience');
  return response.data.data || response.data;
};
