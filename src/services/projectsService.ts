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
  video_url?: string;
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

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects/all');
  return response.data.data || response.data;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects/featured');
  return response.data.data || response.data;
};

export interface ProjectCreate {
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  short_description_en?: string;
  short_description_fr?: string;
  image_url?: string;
  video_url?: string;
  gallery_urls?: string[];
  project_url?: string;
  github_url?: string;
  technologies?: string[];
  category?: string;
  start_date?: string;
  end_date?: string;
  is_featured?: boolean;
  display_order?: number;
  is_active?: boolean;
}

export const createProject = async (project: ProjectCreate): Promise<Project> => {
  const response = await api.post('/projects', project);
  return response.data;
};

export const updateProject = async (id: string, project: Partial<ProjectCreate>): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
