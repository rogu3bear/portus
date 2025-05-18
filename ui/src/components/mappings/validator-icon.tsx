import { Check, X } from 'lucide-react';

export function ValidatorIcon({ valid }: { valid: boolean }) {
  return valid ? (
    <Check className="h-4 w-4 text-success-500" aria-label="valid" />
  ) : (
    <X className="h-4 w-4 text-error-500" aria-label="invalid" />
  );
}
