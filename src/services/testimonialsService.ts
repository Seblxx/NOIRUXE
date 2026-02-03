import { api } from '@/lib/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Testimonial {
  id: string;
  author_name: string;
  author_email: string;
  author_position_en?: string;
  author_position_fr?: string;
  author_company?: string;
  author_image_url?: string;
  testimonial_text_en: string;
  testimonial_text_fr?: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  display_order: number;
  created_at: string;
  reviewed_at?: string;
  updated_at?: string;
}

export interface TestimonialSubmit {
  author_name: string;
  author_email: string;
  author_position_en?: string;
  author_company?: string;
  author_image_url?: string;
  testimonial_text_en: string;
  testimonial_text_fr?: string;
  rating?: number;
}

export interface TestimonialCreate extends TestimonialSubmit {
  author_position_fr?: string;
  display_order?: number;
  status?: 'pending' | 'approved' | 'rejected';
}

export const getTestimonials = async (approvedOnly: boolean = true): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>('/testimonials/', {
    params: { approved_only: approvedOnly }
  });
  return response.data;
};

export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  return getTestimonials(true);
};

export const getAllTestimonialsAdmin = async (statusFilter?: string): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>('/testimonials/admin/all', {
    params: { status_filter: statusFilter }
  });
  return response.data;
};

export const getTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await api.get<Testimonial>(`/testimonials/${id}`);
  return response.data;
};

export const submitTestimonial = async (testimonial: TestimonialSubmit): Promise<Testimonial> => {
  const response = await api.post<Testimonial>('/testimonials/submit', testimonial);
  return response.data;
};

export const createTestimonial = async (testimonial: TestimonialCreate): Promise<Testimonial> => {
  const response = await api.post<Testimonial>('/testimonials/', testimonial);
  return response.data;
};

export const approveTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await api.put<Testimonial>(`/testimonials/${id}/approve`);
  return response.data;
};

export const rejectTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await api.put<Testimonial>(`/testimonials/${id}/reject`);
  return response.data;
};

export const updateTestimonial = async (id: string, testimonial: Partial<TestimonialCreate>): Promise<Testimonial> => {
  const response = await api.put<Testimonial>(`/testimonials/${id}`, testimonial);
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await api.delete(`/testimonials/${id}`);
};
