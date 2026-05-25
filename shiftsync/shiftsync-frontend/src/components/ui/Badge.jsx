import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: "bg-slate-100/80 text-slate-600 border border-slate-200/50",
    primary: "bg-primary-50 text-primary-700 border border-primary-100",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    danger: "bg-red-50 text-red-700 border border-red-100",
  };

  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors", variants[variant], className)} {...props}>
      {children}
    </div>
  );
}
