import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-primary-light hover:shadow-[0_10px_40px_-12px_rgba(130,52,233,0.7)]",
        white: "bg-white text-[#09090A] hover:bg-zinc-200",
        outline:
          "border border-primary/50 bg-primary/5 text-foreground hover:bg-primary/15 hover:border-primary",
        ghost: "text-text-secondary hover:bg-surface hover:text-foreground",
        gradient:
          "bg-brand text-[#09090A] hover:shadow-[0_12px_44px_-12px_rgba(95,117,242,0.7)]",
      },
      size: {
        default: "h-11 px-5",
        lg: "h-13 px-7 text-base",
        sm: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

interface BaseProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: React.ReactNode;
}

export function Button({
  href,
  external,
  variant,
  size,
  className,
  children,
  ...props
}: BaseProps & {
  href?: string;
  external?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(buttonVariants({ variant, size, className }));
  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
