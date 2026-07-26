const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value) {
  if (!value.trim()) return "Email is required";
  if (!EMAIL_RE.test(value.trim())) return "Enter a valid email address";
  return "";
}

export function validatePassword(value, { minLength = 6 } = {}) {
  if (!value) return "Password is required";
  if (value.length < minLength) return `Password must be at least ${minLength} characters`;
  return "";
}

export function validateRequired(value, label) {
  if (!value || !value.trim()) return `${label} is required`;
  return "";
}

export function validateConfirmPassword(value, password) {
  if (!value) return "Please confirm your password";
  if (value !== password) return "Passwords don't match";
  return "";
}