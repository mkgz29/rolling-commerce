export const isEmailValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isPasswordValid = (password) => {
  return password.length >= 6;
};

export const isRequired = (value) => {
  return value && value.trim() !== "";
};

export const isNumber = (value) => {
  return !isNaN(value);
};