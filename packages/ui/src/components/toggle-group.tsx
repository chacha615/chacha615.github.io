"use client"

import * as React from "react"
import { Space } from "antd"
import type { SpaceProps } from "antd"
import { type VariantProps as CVAVariantProps } from "class-variance-authority"

import { cn } from "@openreel/ui/lib/utils"
import { toggleVariants } from "@openreel/ui/components/toggle"

const ToggleGroupContext = React.createContext<
  CVAVariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

interface ToggleGroupProps extends Omit<SpaceProps, "size" | "children"> {
  type?: "single" | "multiple"
  value?: string
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
  variant?: CVAVariantProps<typeof toggleVariants>["variant"]
  size?: CVAVariantProps<typeof toggleVariants>["size"]
  children?: React.ReactNode
}

const ToggleGroup = React.forwardRef<
  React.ElementRef<"div">,
  ToggleGroupProps
>(({ className, variant, size, type = "single", value, defaultValue, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
  const controlledValue = value ?? internalValue

  const handleValueChange = React.useCallback((newValue: string | undefined) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }, [onValueChange])

  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <Space
        ref={ref}
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child
          return React.cloneElement(child as React.ReactElement<{ groupValue?: string; onGroupChange?: (val: string) => void; groupType?: string }>, {
            groupValue: controlledValue,
            onGroupChange: handleValueChange,
            groupType: type,
          })
        })}
      </Space>
    </ToggleGroupContext.Provider>
  )
})

ToggleGroup.displayName = "ToggleGroup"

interface ToggleGroupItemProps extends Omit<React.ComponentPropsWithoutRef<"button">, "onClick"> {
  value: string
  variant?: CVAVariantProps<typeof toggleVariants>["variant"]
  size?: CVAVariantProps<typeof toggleVariants>["size"]
  groupValue?: string
  groupType?: string
  onGroupChange?: (value: string) => void
}

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<"button">,
  ToggleGroupItemProps
>(({ className, variant, size, value, children, groupValue, groupType, onGroupChange, disabled, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  const isActive = groupValue === value

  const handleClick = React.useCallback(() => {
    if (disabled) return
    if (groupType === "single") {
      onGroupChange?.(isActive ? "" : value)
    }
  }, [disabled, groupType, isActive, onGroupChange, value])

  return (
    <button
      ref={ref}
      type="button"
      role="group"
      aria-pressed={isActive}
      data-state={isActive ? "on" : "off"}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }