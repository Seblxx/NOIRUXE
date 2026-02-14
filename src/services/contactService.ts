import emailjs from '@emailjs/browser';
import { api } from '@/lib/api';

const EMAILJS_SERVICE_ID = 'service_ds5co9t';
const EMAILJS_TEMPLATE_ID = 'template_pcw8f7h';
const EMAILJS_PUBLIC_KEY = 'QVGjsCgwvtrQV1XXH';

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface StoredContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Send email via EmailJS AND store in database
export const sendContactMessage = async (data: ContactMessage): Promise<void> => {
  // Send email notification
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name: data.name,
      from_email: data.email,
      message: data.message,
    },
    EMAILJS_PUBLIC_KEY
  );

  // Also store in database for admin access
  try {
    await api.post('/contact/send', data);
  } catch {
    // Don't fail the whole submission if DB storage fails — email was already sent
    console.warn('Message sent via email but failed to store in database');
  }
};

// Admin: Get all contact messages
export const getContactMessages = async (): Promise<StoredContactMessage[]> => {
  const response = await api.get('/contact');
  return response.data;
};

// Admin: Mark a message as read
export const markMessageAsRead = async (id: string): Promise<void> => {
  await api.patch(`/contact/${id}/read`);
};

// Admin: Delete a contact message
export const deleteContactMessage = async (id: string): Promise<void> => {
  await api.delete(`/contact/${id}`);
};

export interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export const getContactInfo = async (): Promise<ContactInfo[]> => {
  const response = await api.get('/contact-info');
  return response.data.data || response.data;
};
