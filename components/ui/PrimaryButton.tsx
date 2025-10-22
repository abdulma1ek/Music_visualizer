"use client";

import { cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

import { classNames } from "@/lib/classNames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function PrimaryButton({ asChild = false, children, className = "", ...props }: ButtonProps) {
  const baseClasses = classNames(
    "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-brand-600/50 transition hover:from-brand-300 hover:to-brand-500",
    className
  );

  if (asChild && isValidElement(children)) {
    return cloneElement(children as ReactElement, {
      className: classNames((children.props as { className?: string }).className, baseClasses),
      ...props
    });
  }

  return (
    <button type="button" className={baseClasses} {...props}>
      {children}
    </button>
  );
}
