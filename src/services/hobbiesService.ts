import { api } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Hobby {
  id: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  icon_url?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface HobbyCreate {
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  icon_url?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export const getHobbies = async (activeOnly: boolean = true): Promise<Hobby[]> => {
  const response = await api.get<Hobby[]>('/hobbies/', {
    params: { active_only: activeOnly }
  });
  return response.data;
};

export const getHobby = async (id: string): Promise<Hobby> => {
  const response = await api.get<Hobby>(`/hobbies/${id}`);
  return response.data;
};

export const createHobby = async (hobby: HobbyCreate): Promise<Hobby> => {
  const response = await api.post<Hobby>('/hobbies/', hobby);
  return response.data;
};

export const updateHobby = async (id: string, hobby: Partial<HobbyCreate>): Promise<Hobby> => {
  const response = await api.put<Hobby>(`/hobbies/${id}`, hobby);
  return response.data;
};

export const deleteHobby = async (id: string): Promise<void> => {
  await api.delete(`/hobbies/${id}`);
};
