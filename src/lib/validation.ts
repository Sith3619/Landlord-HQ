// ─── Shared Validation Rules ──────────────────────────────────────────────────
// Reusable validation functions for form fields across the application.
// Each function returns undefined (valid) or an error message string.

export type ValidationResult = string | undefined;

export const required = (value: unknown, label = "This field"): ValidationResult => {
  if (value === null || value === undefined || value === "" || value === 0) {
    return `${label} is required`;
  }
  return undefined;
};

export const email = (value: string): ValidationResult => {
  if (!value) return undefined;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(value)) return "Enter a valid email address";
  return undefined;
};

export const phone = (value: string): ValidationResult => {
  if (!value) return undefined;
  const stripped = value.replace(/\D/g, "");
  if (stripped.length < 10 || stripped.length > 11) return "Enter a valid phone number";
  return undefined;
};

export const postalCode = (value: string): ValidationResult => {
  if (!value) return undefined;
  const pattern = /^[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d$/;
  if (!pattern.test(value)) return "Enter a valid Canadian postal code (e.g. V6B 1A1)";
  return undefined;
};

export const minAmount = (value: number, min: number, label = "Amount"): ValidationResult => {
  if (value < min) return `${label} must be at least $${min}`;
  return undefined;
};

export const positiveNumber = (value: number | string, label = "Value"): ValidationResult => {
  const n = Number(value);
  if (isNaN(n) || n <= 0) return `${label} must be a positive number`;
  return undefined;
};

export const dateRequired = (value: string, label = "Date"): ValidationResult => {
  if (!value) return `${label} is required`;
  const d = new Date(value);
  if (isNaN(d.getTime())) return `${label} is not a valid date`;
  return undefined;
};

export const endDateAfterStart = (start: string, end: string): ValidationResult => {
  if (!start || !end) return undefined;
  if (new Date(end) <= new Date(start)) return "End date must be after start date";
  return undefined;
};

export const rentAmount = (value: number | string): ValidationResult => {
  const n = Number(value);
  if (isNaN(n) || n <= 0) return "Rent amount must be greater than $0";
  if (n > 50000) return "Rent amount seems unusually high";
  return undefined;
};

export const securityDeposit = (
  depositAmount: number | string,
  rentAmount: number | string
): ValidationResult => {
  const deposit = Number(depositAmount);
  const rent = Number(rentAmount);
  if (isNaN(deposit) || deposit < 0) return "Security deposit must be $0 or more";
  if (rent > 0 && deposit > rent * 2) return "Security deposit typically should not exceed 2 months rent";
  return undefined;
};

// Run multiple validators and return the first error
export const validate = (...rules: ValidationResult[]): ValidationResult => {
  return rules.find(r => r !== undefined);
};
