"use client";


import { useState, useCallback } from "react";
import { loginWithEmail, loginWithGoogle, storeTokens } from "@/service/auth.service";
import type { LoginRequest, FormErrors, LoginResponse } from "@/types/auth";

interface UseAuthReturn {
  isLoading: boolean;
  isGoogleLoading: boolean;
  errors: FormErrors;
  handleEmailLogin: (data: LoginRequest) => Promise<LoginResponse | null>;
  handleGoogleLogin: () => Promise<void>;
  clearErrors: () => void;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearErrors = useCallback(() => setErrors({}), []);

  const handleEmailLogin = useCallback(
    async (data: LoginRequest): Promise<LoginResponse | null> => {
      setIsLoading(true);
      setErrors({});

      try {
        const response = await loginWithEmail(data);

        // Persist tokens — swap storeTokens implementation for real storage
        storeTokens(response.token, response.refreshToken);

        // TODO: Update global auth context / redirect
        // e.g. router.push("/dashboard")

        return response;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setErrors({ general: message });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleGoogleLogin = useCallback(async (): Promise<void> => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      await loginWithGoogle();
      // TODO: Handle OAuth redirect / callback
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed.";
      setErrors({ general: message });
    } finally {
      setIsGoogleLoading(false);
    }
  }, []);

  return {
    isLoading,
    isGoogleLoading,
    errors,
    handleEmailLogin,
    handleGoogleLogin,
    clearErrors,
  };
}