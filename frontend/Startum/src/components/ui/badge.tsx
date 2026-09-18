import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]",
	{
		variants: {
			variant: {
				default:
					"border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)]",
				critical: "border-rose-400/40 bg-rose-500/10 text-rose-200",
				high: "border-orange-400/40 bg-orange-500/10 text-orange-200",
				medium: "border-amber-400/40 bg-amber-500/10 text-amber-200",
				low: "border-[var(--accent)]/60 bg-[var(--accent)]/10 text-[var(--accent-strong)]",
				info: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends
		React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge };
