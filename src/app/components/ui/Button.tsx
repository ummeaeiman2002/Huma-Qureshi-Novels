import React from "react";
import Link from "next/link";
import type { Route } from "next";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  external?: boolean;
};

type ButtonAsLink = CommonProps & {
  href: Route;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

const base =
  "inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-cream hover:bg-brand-dark shadow-md",
  secondary: "bg-gold text-brand-deep hover:bg-gold-dark hover:text-cream shadow-md",
  outline: "border-2 border-brand text-brand hover:bg-brand hover:text-cream",
  ghost: "border-2 border-transparent text-brand hover:bg-brand/10",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm sm:text-base",
  lg: "px-8 py-3 text-base sm:text-lg",
};

function classes(variant: Variant, size: Size, className: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  external,
  ...rest
}: ButtonAsLink | ButtonAsButton) {
  if (href) {
    if (external) {
      return (
        <a
          href={String(href)}
          target="_blank"
          rel="noopener noreferrer"
          className={classes(variant, size, className)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes(variant, size, className)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
