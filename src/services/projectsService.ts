import { api } from '@/lib/api';

export interface Project {
  id: string;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  shortDescriptionEn?: string;
  shortDescriptionFr?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  projectUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  category?: string;
  startDate?: string;
  endDate?: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data.data || response.data;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects/featured');
  return response.data.data || response.data;
};
