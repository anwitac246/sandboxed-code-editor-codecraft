"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import type { LoginRequest, FormErrors } from "@/types/auth";

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const EyeOnIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="4"/>
    <path d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

function validate(email: string, password: string): FormErrors {
  const errs: FormErrors = {};
  if (!email.trim()) errs.email = "Please enter a valid email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address.";
  if (!password) errs.password = "Password is required.";
  else if (password.length < 8) errs.password = "Password must be at least 8 characters.";
  return errs;
}

export function LoginForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const { isLoading, isGoogleLoading, errors, handleEmailLogin, handleGoogleLogin, clearErrors } = useAuth();

  const switchMode = useCallback((m: "signin" | "signup") => {
    setMode(m);
    setFieldErrors({});
    clearErrors();
  }, [clearErrors]);

  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(email, password);
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    const data: LoginRequest = { email: email.trim(), password };
    await handleEmailLogin(data);
  }, [email, password, handleEmailLogin]);

  const combined: FormErrors = { ...fieldErrors, ...errors };
  const isSignIn = mode === "signin";

  const inputBase = (hasErr: boolean) => [
    "w-full h-10 rounded-[7px] bg-[#1a2845]",
    "border text-sm text-[#f0f4ff] placeholder:text-[#4a6080]",
    "px-3 pr-9 outline-none",
    "transition-[border-color,box-shadow] duration-150",
    hasErr
      ? "border-red-400/40 focus:border-red-400/60 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.09)]"
      : "border-white/[0.09] focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.11)]",
  ].join(" ");

  const oauthBtn = "flex items-center justify-center gap-[7px] h-10 rounded-[7px] bg-[#1a2845] border border-white/[0.08] text-[#f0f4ff] text-[0.8375rem] font-medium transition-[border-color,background] duration-150 hover:border-white/[0.18] hover:bg-[#1f3055] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  return (
    <>
    
      <div className="flex items-center justify-center gap-0.5 mb-7" role="tablist">
        <button
          role="tab"
          aria-selected={isSignIn}
          onClick={() => switchMode("signin")}
          className={[
            "px-[1.125rem] py-1.5 rounded-md text-[0.9375rem] font-medium transition-colors duration-150",
            isSignIn ? "text-[#f0f4ff] font-semibold" : "text-[#4a6080] hover:text-[#8fa3c0]",
          ].join(" ")}
        >
          Sign In
        </button>
        <div className="w-px h-3.5 bg-white/10" aria-hidden="true" />
        <button
          role="tab"
          aria-selected={!isSignIn}
          onClick={() => switchMode("signup")}
          className={[
            "px-[1.125rem] py-1.5 rounded-md text-[0.9375rem] font-medium transition-colors duration-150",
            !isSignIn ? "text-[#f0f4ff] font-semibold" : "text-[#4a6080] hover:text-[#8fa3c0]",
          ].join(" ")}
        >
          Create Account
        </button>
      </div>

    
      <div className="flex items-center gap-3 text-[0.8125rem] text-[#8fa3c0] mb-[0.875rem]">
        <div className="flex-1 h-px bg-white/[0.07]" />
        Sign in with
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      
      <div className="grid grid-cols-2 gap-2 mb-[1.125rem]">
        <button
          type="button"
          className={oauthBtn}
          disabled={isGoogleLoading}
          onClick={handleGoogleLogin}
          aria-label="Sign in with Google"
        >
          {isGoogleLoading ? <Spinner /> : <GoogleIcon />}
          Google
        </button>
        <button
          type="button"
          className={oauthBtn}
          aria-label="Sign in with GitHub"
        >
          <GitHubIcon />
          GitHub
        </button>
      </div>

   
      <div className="flex items-center gap-3 text-[0.8rem] text-[#4a6080] my-[1.125rem]" role="separator" aria-label="or continue with email">
        <div className="flex-1 h-px bg-white/[0.07]" />
        or continue with email
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      
      {combined.general && (
        <div role="alert" className="flex items-start gap-2 bg-red-500/[0.06] border border-red-400/20 rounded-lg px-3 py-2.5 text-[0.8rem] text-red-400 mb-4 leading-relaxed">
          <svg className="shrink-0 mt-[1px]" width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z"/>
          </svg>
          {combined.general}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-0">

   
        <div className="flex flex-col gap-[5px] mb-[0.8125rem]">
          <label htmlFor="email" className="text-[0.875rem] font-medium text-[#f0f4ff]">
            Email
          </label>
          <input
            type="email" id="email" name="email"
            placeholder="Your email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            aria-required="true"
            aria-invalid={Boolean(combined.email)}
            aria-describedby={combined.email ? "email-err" : undefined}
            className={inputBase(Boolean(combined.email)) + " pr-3"}
          />
          {combined.email && (
            <span id="email-err" role="alert" className="text-[0.74rem] text-red-400">
              {combined.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-[5px] mb-[0.8125rem]">
          <label htmlFor="password" className="text-[0.875rem] font-medium text-[#f0f4ff]">
            Password
          </label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              id="password" name="password"
              placeholder="Your password"
              autoComplete={isSignIn ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              aria-required="true"
              aria-invalid={Boolean(combined.password)}
              aria-describedby={combined.password ? "pass-err" : undefined}
              className={inputBase(Boolean(combined.password))}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4a6080] hover:text-[#8fa3c0] transition-colors p-0.5"
            >
              {showPwd ? <EyeOnIcon /> : <EyeOffIcon />}
            </button>
          </div>
          {/* Forgot password — sign in only */}
          {isSignIn && (
            <div className="flex justify-end mt-[3px]">
              <Link href="/auth/forgot-password"
                className="text-[0.74rem] text-blue-400 hover:text-blue-300 transition-colors hover:underline underline-offset-2">
                Forgot password?
              </Link>
            </div>
          )}
          {combined.password && (
            <span id="pass-err" role="alert" className="text-[0.74rem] text-red-400">
              {combined.password}
            </span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full h-10 rounded-[7px] bg-blue-600 hover:bg-blue-700 text-white text-[0.9375rem] font-semibold transition-[background,box-shadow] duration-150 hover:shadow-[0_4px_22px_rgba(37,99,235,0.38)] disabled:opacity-55 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-blue-400/60 focus-visible:outline-offset-2 mt-1 cursor-pointer"
        >
          {isLoading ? <Spinner /> : (isSignIn ? "Continue" : "Create Account")}
        </button>
      </form>

      {/* ── Card footer ───────────────────────────────── */}
      <div className="text-center mt-[1.125rem] text-[0.79rem] text-[#4a6080] leading-[1.7]">
        <div className="mb-1">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => switchMode(isSignIn ? "signup" : "signin")}
            className="text-blue-400 font-medium underline underline-offset-2 hover:text-blue-300 transition-colors cursor-pointer"
          >
            {isSignIn ? "Create account" : "Sign in"}
          </button>
        </div>
        <div>
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-[#8fa3c0] underline underline-offset-2 hover:text-[#f0f4ff] transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-[#8fa3c0] underline underline-offset-2 hover:text-[#f0f4ff] transition-colors">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </>
  );
}