import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-lg border border-border/60 bg-background/50 px-4 py-2 text-sm",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground/70",
        "selection:bg-primary/20 selection:text-primary-foreground",
        "transition-all duration-200 ease-out",
        "focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20 focus:ring-offset-0 focus:outline-none",
        "hover:border-border hover:bg-background/80",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:focus:ring-destructive/30",
        "shadow-sm focus:shadow-md",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
