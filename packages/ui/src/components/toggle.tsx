import * as React from "react"
import { Switch, SwitchProps } from "antd"
import { cva, type VariantProps as CVAVariantProps } from "class-variance-authority"

import { cn } from "@openreel/ui/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ToggleVariants = CVAVariantProps<typeof toggleVariants>

interface ToggleProps extends Omit<SwitchProps, "checked" | "onChange" | "size"> {
  defaultPressed?: boolean
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  variant?: ToggleVariants["variant"]
  size?: ToggleVariants["size"]
}

const Toggle = React.forwardRef<
  React.ElementRef<typeof Switch>,
  ToggleProps
>(({ className, variant = "default", size = "default", defaultPressed, pressed, onPressedChange, disabled, ...props }, ref) => {
  const [internalPressed, setInternalPressed] = React.useState(defaultPressed ?? false)
  const isControlled = pressed !== undefined
  const isPressed = isControlled ? pressed : internalPressed

  const handleChange = React.useCallback((checked: boolean) => {
    if (!isControlled) {
      setInternalPressed(checked)
    }
    onPressedChange?.(checked)
  }, [isControlled, onPressedChange])

  const switchClassName = cn(
    toggleVariants({ variant, size, className }),
    isPressed && "bg-accent text-accent-foreground",
    !isPressed && variant === "outline" && "border border-input bg-transparent",
    !isPressed && variant !== "outline" && "bg-transparent",
    disabled && "opacity-50 pointer-events-none"
  )

  return (
    <Switch
      ref={ref}
      checked={isPressed}
      onChange={handleChange}
      disabled={disabled}
      className={switchClassName}
      {...props}
    />
  )
})

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }