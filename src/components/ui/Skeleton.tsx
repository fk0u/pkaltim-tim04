// import { cn } from "@/utils/cn";
// If utils/cn doesn't exist, I'll essentially inline it or use clsx/tailwind-merge if project has it.
// Checking package.json earlier, it has `clsx` and `tailwind-merge`.

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-gray-200/80", className)}
            {...props}
        />
    );
}
