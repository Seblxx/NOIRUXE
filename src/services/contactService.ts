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
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Message</h1>
          </div>
          <div style="background-color: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #2c3e50; margin-bottom: 20px;">
              A message from <strong>${data.name}</strong> has been received.
            </p>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #667eea;">
              <div style="font-size: 12px; color: #6c757d; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 2px;">From</div>
              <div style="font-size: 16px; font-weight: bold; color: #2c3e50;">${data.name}</div>
              <div style="font-size: 14px; color: #667eea; margin-top: 4px;"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></div>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px solid #667eea;">
              <div style="font-size: 12px; color: #6c757d; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 2px;">Message</div>
              <p style="font-size: 16px; color: #2c3e50; margin: 0; line-height: 1.6;">${data.message}</p>
            </div>
            <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
              Reply to: <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;"><strong>${data.email}</strong></a>
            </p>
          </div>
          <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
            <p>Sent from NOIRUXE Portfolio contact form.</p>
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
