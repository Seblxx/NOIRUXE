// Authentication security utilities
import emailjs from '@emailjs/browser';

const RATE_LIMIT_KEY = 'login_attempts';
const LOCKOUT_KEY = 'login_lockout_until';
const SESSION_ACTIVITY_KEY = 'last_activity';
const TWO_FA_CODE_KEY = 'two_fa_code';
const ACCOUNT_CREATED_KEY = 'account_created_at';

// EmailJS configuration (same as contact form)
const EMAILJS_SERVICE_ID = 'service_ds5co9t';
const EMAILJS_VERIFICATION_TEMPLATE_ID = 'template_q4jp97z';
const EMAILJS_PUBLIC_KEY = 'QVGjsCgwvtrQV1XXH';

const MAX_ATTEMPTS = 7;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes (for testing - change to 3 * 60 * 60 * 1000 for production)
const TWO_FA_GRACE_PERIOD_MS = 10 * 1000; // 10 seconds (for testing - change to 7 * 24 * 60 * 60 * 1000 for production)

// Rate limiting for login attempts
export const checkRateLimit = (email: string): { allowed: boolean; remainingAttempts?: number; lockoutMinutes?: number } => {
  const key = `${RATE_LIMIT_KEY}_${email}`;
  const lockoutKey = `${LOCKOUT_KEY}_${email}`;
  
  // Check if currently locked out
  const lockoutUntil = localStorage.getItem(lockoutKey);
  if (lockoutUntil) {
    const lockoutTime = parseInt(lockoutUntil);
    if (Date.now() < lockoutTime) {
      const remainingMs = lockoutTime - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      return { allowed: false, lockoutMinutes: remainingMinutes };
    } else {
      // Lockout expired, clear it
      localStorage.removeItem(lockoutKey);
      localStorage.removeItem(key);
    }
  }
  
  const attempts = parseInt(localStorage.getItem(key) || '0');
  const remaining = MAX_ATTEMPTS - attempts;
  
  if (attempts >= MAX_ATTEMPTS) {
    // Trigger lockout
    const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    localStorage.setItem(lockoutKey, lockoutUntil.toString());
    return { allowed: false, lockoutMinutes: 15 };
  }
  
  return { allowed: true, remainingAttempts: remaining };
};

export const recordFailedAttempt = (email: string) => {
  const key = `${RATE_LIMIT_KEY}_${email}`;
  const attempts = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, (attempts + 1).toString());
};

export const clearFailedAttempts = (email: string) => {
  const key = `${RATE_LIMIT_KEY}_${email}`;
  const lockoutKey = `${LOCKOUT_KEY}_${email}`;
  localStorage.removeItem(key);
  localStorage.removeItem(lockoutKey);
};

// Session timeout management
export const updateSessionActivity = () => {
  localStorage.setItem(SESSION_ACTIVITY_KEY, Date.now().toString());
};

export const checkSessionTimeout = (): boolean => {
  const lastActivity = localStorage.getItem(SESSION_ACTIVITY_KEY);
  if (!lastActivity) {
    updateSessionActivity();
    return false;
  }
  
  const timeSinceActivity = Date.now() - parseInt(lastActivity);
  return timeSinceActivity > SESSION_TIMEOUT_MS;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_ACTIVITY_KEY);
  localStorage.removeItem('token');
};

// 2FA via email
export const generateTwoFactorCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeTwoFactorCode = (email: string, code: string) => {
  const data = {
    code,
    timestamp: Date.now(),
    email
  };
  localStorage.setItem(TWO_FA_CODE_KEY, JSON.stringify(data));
};

export const verifyTwoFactorCode = (email: string, inputCode: string): { valid: boolean; error?: string } => {
  const stored = localStorage.getItem(TWO_FA_CODE_KEY);
  if (!stored) {
    return { valid: false, error: 'No verification code found. Please request a new one.' };
  }
  
  const data = JSON.parse(stored);
  
  // Check if code is for the correct email
  if (data.email !== email) {
    return { valid: false, error: 'Invalid verification code.' };
  }
  
  // Check if code has expired (10 minutes)
  const codeAge = Date.now() - data.timestamp;
  if (codeAge > 10 * 60 * 1000) {
    localStorage.removeItem(TWO_FA_CODE_KEY);
    return { valid: false, error: 'Verification code has expired. Please request a new one.' };
  }
  
  // Verify the code matches
  if (data.code !== inputCode) {
    return { valid: false, error: 'Incorrect verification code.' };
  }
  
  // Code is valid
  localStorage.removeItem(TWO_FA_CODE_KEY);
  return { valid: true };
};

export const clearTwoFactorCode = () => {
  localStorage.removeItem(TWO_FA_CODE_KEY);
};

// Check if 2FA is required for this account
export const isTwoFactorRequired = (userEmail: string): boolean => {
  const key = `${ACCOUNT_CREATED_KEY}_${userEmail}`;
  const created = localStorage.getItem(key);
  
  if (!created) {
    // First time seeing this account, record creation time
    localStorage.setItem(key, Date.now().toString());
    return false; // Not required yet
  }
  
  const accountAge = Date.now() - parseInt(created);
  return accountAge > TWO_FA_GRACE_PERIOD_MS; // Required after grace period
};

// Send 2FA code via email
export const sendTwoFactorEmail = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Store the code locally
    storeTwoFactorCode(email, code);
    
    // Send via EmailJS using existing One-Time Password template
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_VERIFICATION_TEMPLATE_ID,
      {
        email: email,
        to_name: email.split('@')[0], // Use email username as name
        verification_code: code,
      },
      EMAILJS_PUBLIC_KEY
    );
    
    // Log success in development
    if (import.meta.env.DEV) {
      console.log(`✅ 2FA email sent to ${email} with code: ${code}`);
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send 2FA email:', error);
    return { success: false, error: error.message || 'Failed to send verification email' };
  }
};
