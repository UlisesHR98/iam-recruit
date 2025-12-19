import { authErrors } from "@/shared/errors/auth";
import { commonErrors } from "@/shared/errors/common";

export const errorMessages = {
  ...authErrors,
  ...commonErrors,
};

type ErrorDetail =
  | string
  | { message?: string; code?: string }
  | undefined
  | null;

export function translateError(
  error: ErrorDetail,
  defaultMessage: string
): string {
  if (!error) {
    return defaultMessage;
  }

  if (typeof error === "string") {
    const errorCode = error.trim().toUpperCase();
    if (errorMessages[errorCode]) {
      return errorMessages[errorCode];
    }
    return error;
  }

  if (typeof error === "object" && error !== null) {
    if (error.code) {
      const errorCode = error.code.trim().toUpperCase();
      if (errorMessages[errorCode]) {
        return errorMessages[errorCode];
      }
    }

    if (error.message) {
      const errorCode = error.message.trim().toUpperCase();
      if (errorMessages[errorCode]) {
        return errorMessages[errorCode];
      }
      return error.message;
    }
  }

  return defaultMessage;
}
