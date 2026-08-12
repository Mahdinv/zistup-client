import type { AuthIdentifierDTO } from "./send-code.types";

const iranMobileRegex = /^09\d{9}$/;

export const mapLoginFormToIdentifierDto = (
  value: string,
): AuthIdentifierDTO => {
  const normalizedValue = value.trim();

  if (iranMobileRegex.test(normalizedValue)) {
    return {
      mobile: normalizedValue,
    };
  }

  return {
    email: normalizedValue.toLowerCase(),
  };
};
