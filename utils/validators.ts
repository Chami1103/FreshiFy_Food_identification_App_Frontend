export const isEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isNumber = (value: string): boolean => !isNaN(Number(value));

export const isEmpty = (value?: string | null): boolean =>
  !value || value.trim().length === 0;

export const validateField = (label: string, value: string): string | null => {
  if (isEmpty(value)) return `${label} is required`;
  return null;
};

export const validateRecipeInput = (ingredients: string[]): boolean =>
  ingredients.length > 0 && ingredients.every((i) => i.length > 2);
