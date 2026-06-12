import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-secondary transition-[border-color,box-shadow,background-color] duration-200 hover:border-text-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/30 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground placeholder:text-text-secondary transition-[border-color,box-shadow,background-color] duration-200 hover:border-text-secondary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:ring-danger/30 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Input, Textarea };
