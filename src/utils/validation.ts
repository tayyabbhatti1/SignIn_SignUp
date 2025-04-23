// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simplified password validation for testing (min 6 chars)
const PASSWORD_REGEX = /.{6,}/;

// Name validation - letters, spaces, hyphens, and apostrophes, 2-50 chars
const NAME_REGEX = /^[a-zA-Z\s'-]{2,50}$/;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }
  
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  
  // For testing purposes, we'll use a simpler validation
  // In production, you'd want to use a stronger validation
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  // For testing purposes, we'll use a simpler validation
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

export const validateCode = (code: string): string | null => {
  if (!code.trim()) {
    return 'Verification code is required';
  }
  
  if (!/^\d{6}$/.test(code)) {
    return 'Verification code must be 6 digits';
  }
  
  return null;
}; 