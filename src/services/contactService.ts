import { api } from '@/lib/api';

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const sendContactMessage = async (data: ContactMessage): Promise<void> => {
  await api.post('/contact/send', data);
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
