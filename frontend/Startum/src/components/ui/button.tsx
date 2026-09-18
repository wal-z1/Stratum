import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:pointer-events-none disabled:opacity-60",
	{
		variants: {
			variant: {
				default:
					"bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/20 hover:bg-emerald-300",
				secondary:
					"border border-slate-600/70 bg-slate-900/80 text-slate-100 hover:bg-slate-800",
				ghost: "text-slate-200 hover:bg-slate-800/80",
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
