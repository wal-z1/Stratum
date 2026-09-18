import * as React from "react";

import { cn } from "@/lib/utils";

const Alert = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(
			"rounded-xl border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-100",
			className,
		)}
		{...props}
	/>
));
Alert.displayName = "Alert";

export { Alert };
