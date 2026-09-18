import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:pointer-events-none disabled:opacity-60",
	{
		variants: {
			variant: {
				default:
					"bg-[var(--accent)] text-[var(--button-text)] shadow-sm shadow-amber-500/20 hover:bg-[var(--accent-strong)]",
				secondary:
					"border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:bg-[var(--surface-muted)]",
				ghost: "text-[var(--text)] hover:bg-[var(--surface-muted)]",
				destructive:
					"bg-rose-500/20 text-rose-200 border border-rose-400/30 hover:bg-rose-500/30",
			},
			size: {
				default: "h-11 px-4 py-2",
				sm: "h-9 px-3",
				lg: "h-12 px-5 text-base",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button };
