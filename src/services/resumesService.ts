import { api } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Resume {
  id: string;
  title_en: string;
  title_fr: string;
  file_url: string;
  file_name: string;
  language: 'en' | 'fr';
  file_size?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ResumeCreate {
  title_en: string;
  title_fr: string;
  file_url: string;
  file_name: string;
  language: 'en' | 'fr';
  file_size?: number;
  is_active?: boolean;
}

export const getResumes = async (language?: string): Promise<Resume[]> => {
  const response = await api.get<Resume[]>('/resumes/', {
    params: { language }
  });
  return response.data;
};

export const getActiveResume = async (language: 'en' | 'fr'): Promise<Resume> => {
  const response = await api.get<Resume>(`/resumes/active/${language}`);
  return response.data;
};

export const getResume = async (id: string): Promise<Resume> => {
  const response = await api.get<Resume>(`/resumes/${id}`);
  return response.data;
};

export const createResume = async (resume: ResumeCreate): Promise<Resume> => {
  const response = await api.post<Resume>('/resumes/', resume);
  return response.data;
};

export const updateResume = async (id: string, resume: Partial<ResumeCreate>): Promise<Resume> => {
  const response = await api.put<Resume>(`/resumes/${id}`, resume);
  return response.data;
};

export const deleteResume = async (id: string): Promise<void> => {
  await api.delete(`/resumes/${id}`);
};
