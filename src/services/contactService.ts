import emailjs from '@emailjs/browser';
import { api } from '@/lib/api';

const EMAILJS_SERVICE_ID = 'service_ds5co9t';
const EMAILJS_TEMPLATE_ID = 'template_pcw8f7h';
const EMAILJS_VERIFICATION_TEMPLATE_ID = 'template_q4jp97z';
const EMAILJS_PUBLIC_KEY = 'QVGjsCgwvtrQV1XXH';

// Store verification codes in memory (in production, use backend database)
const verificationCodes = new Map<string, { code: string; expiresAt: number; name: string }>();

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

// Generate 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code to email
export const sendVerificationCode = async (email: string, name: string): Promise<void> => {
  const code = generateVerificationCode();
  const expiresAt = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

  // Store code
  verificationCodes.set(email, { code, expiresAt, name });

  // Send email with verification code
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_VERIFICATION_TEMPLATE_ID,
    {
      email: email,
      to_name: name,
      verification_code: code,
    },
    EMAILJS_PUBLIC_KEY
  );
};

// Verify the code entered by user
export const verifyCode = (email: string, code: string): boolean => {
  const stored = verificationCodes.get(email);
  
  if (!stored) {
    throw new Error('No verification code found. Please request a new code.');
  }

  if (Date.now() > stored.expiresAt) {
    verificationCodes.delete(email);
    throw new Error('Verification code has expired. Please request a new code.');
  }

  if (stored.code !== code) {
    throw new Error('Invalid verification code. Please try again.');
  }

  return true;
};

// Send email via EmailJS AND store in database (with verification)
export const sendContactMessage = async (data: ContactMessage, verificationCode: string): Promise<void> => {
  // Verify the code first
  verifyCode(data.email, verificationCode);

  // Send email notification with styled HTML
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      from_name: data.name,
      from_email: data.email,
      message: data.message,
      html_message: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="color: white; margin: 0;">New Contact Message</h2>
          </div>
          <div style="background-color: #1a1a2e; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="color: #e0e0e0; font-size: 14px; margin-bottom: 15px;">A message from <strong style="color: white;">${data.name}</strong> has been received.</p>
            <div style="background-color: #16213e; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <p style="color: #8892b0; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Email</p>
              <p style="color: #64ffda; font-size: 14px; margin: 0;"><a href="mailto:${data.email}" style="color: #64ffda;">${data.email}</a></p>
            </div>
            <div style="background-color: #16213e; padding: 15px; border-radius: 8px;">
              <p style="color: #8892b0; font-size: 12px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Message</p>
              <p style="color: white; font-size: 16px; margin: 0; line-height: 1.6;">${data.message}</p>
            </div>
            <div style="margin-top: 20px; padding: 12px; background-color: #0a192f; border-radius: 6px; text-align: center;">
              <p style="color: #8892b0; font-size: 12px; margin: 0;">Reply to: <a href="mailto:${data.email}" style="color: #64ffda;">${data.email}</a></p>
            </div>
          </div>
        </div>
      `,
    },
    EMAILJS_PUBLIC_KEY
  );

  // Clear used verification code
  verificationCodes.delete(data.email);

  // Also store in database for admin access
  try {
    await api.post('/contact/send', data);
  } catch {
    // Don't fail the whole submission if DB storage fails — email was already sent
    console.warn('Message sent via email but failed to store in database');
  }
};

// Old function for backward compatibility (without verification)
export const sendContactMessageDirect = async (data: ContactMessage): Promise<void> => {
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
