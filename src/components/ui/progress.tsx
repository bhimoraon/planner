"use client"

import type * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  variant?: "default" | "success" | "warning" | "destructive"
  size?: "default" | "sm" | "lg"
}) {
  const sizeClasses = {
    sm: "h-1.5",
    default: "h-2.5",
    lg: "h-4",
  }

  const variantClasses = {
    default: "bg-gradient-to-r from-primary to-primary/80",
    success: "bg-gradient-to-r from-green-500 to-green-600",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600",
    destructive: "bg-gradient-to-r from-destructive to-destructive/80",
  }

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-muted/50 relative w-full overflow-hidden rounded-full shadow-inner border border-border/30",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-out rounded-full shadow-sm relative overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:animate-pulse",
          variantClasses[variant],
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {/* Shine effect for enhanced visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-50 rounded-full" />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
