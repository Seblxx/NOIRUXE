import { api } from '@/lib/api';

export interface Project {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  short_description_en?: string;
  short_description_fr?: string;
  image_url?: string;
  gallery_urls?: string[];
  project_url?: string;
  github_url?: string;
  technologies?: string[];
  category?: string;
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data.data || response.data;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects/featured');
  return response.data.data || response.data;
};
