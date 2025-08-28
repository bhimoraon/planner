import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 transition-all duration-200 shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:shadow-md [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:shadow-md [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:shadow-md [a&]:hover:bg-destructive/90",
        outline:
          "text-foreground border-border/60 bg-background hover:shadow-md [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:border-border",
        success: "border-transparent bg-green-500 text-white hover:shadow-md [a&]:hover:bg-green-600",
        warning: "border-transparent bg-orange-500 text-white hover:shadow-md [a&]:hover:bg-orange-600",
        info: "border-transparent bg-blue-500 text-white hover:shadow-md [a&]:hover:bg-blue-600",
      },
      size: {
        default: "px-2.5 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
