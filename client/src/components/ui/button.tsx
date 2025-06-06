import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium font-poppins ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-neon-green text-dark hover:shadow-[0_0_10px_rgba(57,255,20,0.5)] hover:bg-neon-green/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-neon-green text-neon-green bg-transparent hover:bg-neon-green/10",
        secondary:
          "bg-secondary text-dark hover:bg-secondary/80",
        ghost: "text-gray-light hover:bg-dark-lighter",
        link: "text-neon-green underline-offset-4 hover:underline",
        glow: "bg-neon-green text-dark shadow-[0_0_15px_rgba(57,255,20,0.6)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)]",
        tech: "bg-dark-card border border-neon-green text-neon-green hover:bg-neon-green hover:text-dark hover:shadow-[0_0_10px_rgba(57,255,20,0.5)]",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
