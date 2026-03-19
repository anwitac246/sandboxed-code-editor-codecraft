"use client";


import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "relative overflow-hidden",
    "bg-gradient-to-r from-cyan-500 to-indigo-500",
    "text-white font-semibold tracking-wide",
    "shadow-[0_0_24px_rgba(99,179,237,0.25)]",
    "hover:shadow-[0_0_32px_rgba(99,179,237,0.45)]",
    "hover:from-cyan-400 hover:to-indigo-400",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
    "transition-all duration-200 ease-out",
    "after:absolute after:inset-0 after:bg-white/10 after:opacity-0",
    "hover:after:opacity-100 after:transition-opacity after:duration-200",
  ].join(" "),

  secondary: [
    "bg-transparent",
    "border border-[#2a2a4a]",
    "text-[#a0a8c0] font-medium",
    "hover:border-[#4a4a7a] hover:text-white hover:bg-white/[0.03]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200",
  ].join(" "),

  ghost: [
    "bg-transparent",
    "text-[#a0a8c0] font-medium",
    "hover:text-white hover:bg-white/[0.05]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "transition-all duration-200",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-5 text-sm rounded-xl gap-2.5",
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      children,
      className = "",
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[
          "inline-flex items-center justify-center",
          "select-none focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a14]",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...rest}
      >
        {isLoading ? (
          <Spinner />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";