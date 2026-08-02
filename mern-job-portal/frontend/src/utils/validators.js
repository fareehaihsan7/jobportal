// Email must be like: ali97@gmail.com
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function validateEmail(value) {
  const email = value.trim();

  if (!email) {
    return "Email is required";
  }

  if (!EMAIL_RE.test(email)) {
    return "Enter a valid email address (e.g. ali97@gmail.com)";
  }

  return "";
}

export function validatePassword(value, { minLength = 6 } = {}) {
  if (!value || !value.trim()) {
    return "Password is required";
  }

  if (value.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }

  return "";
}

export function validateRequired(value, label) {
  if (!value || !value.trim()) {
    return `${label} is required`;
  }

  return "";
}

export function validateConfirmPassword(value, password) {
  if (!value || !value.trim()) {
    return "Please confirm your password";
  }

  if (value !== password) {
    return "Passwords don't match";
  }

  return "";
}
//username validations
const USERNAME_RE = /^[A-Za-z\s]+$/;

export function validateUsername(value) {
  const username = value.trim();

  if (!username) {
    return "Full name is required";
  }

  if (!USERNAME_RE.test(username)) {
    return "Full name can only contain alphabets";
  }

  return "";
}