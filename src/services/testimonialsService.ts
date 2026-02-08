import { api } from '@/lib/api';

export interface Testimonial {
  id: string;
  author_name: string;
  author_email: string;
  author_position_en: string | null;
  author_position_fr: string | null;
  author_company: string | null;
  author_image_url: string | null;
  testimonial_text_en: string;
  testimonial_text_fr: string | null;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  display_order: number;
  created_at: string;
  reviewed_at: string | null;
  updated_at: string | null;
}

export interface TestimonialSubmission {
  author_name: string;
  author_email: string;
  author_position_en?: string;
  author_company?: string;
  testimonial_text_en: string;
  testimonial_text_fr?: string;
  rating: number;
}

// Public: Get approved testimonials
export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get('/testimonials/', { params: { approved_only: true } });
  return response.data;
};

// Public: Submit a new testimonial (auto-pending)
export const submitTestimonial = async (data: TestimonialSubmission): Promise<Testimonial> => {
  const response = await api.post('/testimonials/submit', data);
  return response.data;
};

// Admin: Get all testimonials (with optional status filter)
export const getAllTestimonialsAdmin = async (statusFilter?: string): Promise<Testimonial[]> => {
  const params: Record<string, string> = {};
  if (statusFilter) params.status_filter = statusFilter;
  const response = await api.get('/testimonials/admin/all', { params });
  return response.data;
};

// Admin: Approve a testimonial
export const approveTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await api.put(`/testimonials/${id}/approve`);
  return response.data;
};

// Admin: Reject a testimonial
export const rejectTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await api.put(`/testimonials/${id}/reject`);
  return response.data;
};

// Admin: Delete a testimonial
export const deleteTestimonial = async (id: string): Promise<void> => {
  await api.delete(`/testimonials/${id}`);
};
