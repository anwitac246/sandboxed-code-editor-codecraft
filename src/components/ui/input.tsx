"use client";


import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftElement,
      rightElement,
      className = "",
      id,
      ...rest
    },
    ref
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const hasError = Boolean(error);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-[#8890a8] tracking-wide uppercase"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <span className="absolute left-3 flex items-center text-[#4a5070] pointer-events-none">
              {leftElement}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={[
              "w-full h-11 bg-[#0d0d1e] rounded-xl",
              "border",
              hasError
                ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                : "border-[#1e1e38] focus:border-cyan-500/70 focus:ring-cyan-500/10",
              "text-sm text-[#e2e8f0] placeholder:text-[#3a4060]",
              "focus:outline-none focus:ring-4",
              "transition-all duration-200",
              leftElement ? "pl-10" : "pl-4",
              rightElement ? "pr-10" : "pr-4",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className,
            ].join(" ")}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            {...rest}
          />

          {rightElement && (
            <span className="absolute right-3 flex items-center text-[#4a5070]">
              {rightElement}
            </span>
          )}
        </div>

        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <svg
              className="h-3.5 w-3.5 shrink-0"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75a.75.75 0 0 1 1.5 0v3.5a.75.75 0 0 1-1.5 0v-3.5zm.75 7a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75z" />
            </svg>
            {error}
          </p>
        )}

        {!hasError && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-[#5a6080]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";