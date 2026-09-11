export type AuthErrors = Record<string, string>;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const validateEmail = (value: string) => {
  const email = normalizeEmail(value);
  if (!email) return "Enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
  return undefined;
};

export const validatePassword = (value: string) => {
  if (!value) return "Enter your password.";
  if (value.length < 8) return "Use at least 8 characters.";
  return undefined;
};

export const getClerkErrorMessage = (error: unknown, fallback: string) => {
  const value = error as {
    errors?: Array<{ longMessage?: string; message?: string }>;
    longMessage?: string;
    message?: string;
  } | null;

  const messages = value?.errors
    ?.map((item) => item.longMessage || item.message)
    .filter(Boolean);

  return messages?.join(" ") || value?.longMessage || value?.message || fallback;
};
