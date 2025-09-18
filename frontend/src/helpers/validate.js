export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
export const validatePassword = (password) => password && password.length >= 6;
export const validateRequired = (value) => value && value.trim() !== '';
