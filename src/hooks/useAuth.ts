"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, registerWithEmail, loginWithGoogle, storeTokens } from "@/service/auth.service";
import type { LoginRequest, FormErrors, LoginResponse } from "@/types/auth";

interface UseAuthReturn {
  isLoading:        boolean;
  isGoogleLoading:  boolean;
  errors:           FormErrors;
  handleEmailLogin: (data: LoginRequest, mode: "signin" | "signup") => Promise<LoginResponse | null>;
  handleGoogleLogin: () => Promise<void>;
  clearErrors:      () => void;
}

export function useAuth(): UseAuthReturn {
  const [isLoading,       setIsLoading]       = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors,          setErrors]          = useState<FormErrors>({});
  const router = useRouter();

  const clearErrors = useCallback(() => setErrors({}), []);

  const handleEmailLogin = useCallback(
    async (data: LoginRequest, mode: "signin" | "signup"): Promise<LoginResponse | null> => {
      setIsLoading(true);
      setErrors({});

      try {
        const response = mode === "signin"
          ? await loginWithEmail(data)
          : await registerWithEmail(data);

        storeTokens(response.token, response.refreshToken, response.expiresAt);

        if (response.user?.id) {
          router.push('/dashboard/projects');
        } else {
          // Fallback redirect if user ID is not available for some reason
          router.push("/");
        }

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
    [router]
  );

  const handleGoogleLogin = useCallback(async (): Promise<void> => {
    setIsGoogleLoading(true);
    setErrors({});

    try {
      const response = await loginWithGoogle();
      if (response.user?.id) {
        router.push('/dashboard/projects');
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Google sign-in failed.";
      setErrors({ general: message });
    } finally {
      setIsGoogleLoading(false);
    }
  }, [router]);

  return {
    isLoading,
    isGoogleLoading,
    errors,
    handleEmailLogin,
    handleGoogleLogin,
    clearErrors,
  };
}
