import * as React from "react"
import { Tooltip as AntTooltip } from "antd"
import type { TooltipProps as AntTooltipProps } from "antd"

import { cn } from "@openreel/ui/lib/utils"

interface TooltipContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextValue>({
  open: false,
  setOpen: () => {},
})

const TooltipProvider = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>
}

interface TooltipProps extends Omit<AntTooltipProps, "title"> {
  children?: React.ReactNode
  defaultOpen?: boolean
  delayDuration?: number
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  defaultOpen = false,
  delayDuration = 300,
  onOpenChange,
  open,
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [isControlled, onOpenChange])

  return (
    <TooltipContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      <AntTooltip
        open={isOpen}
        onOpenChange={handleOpenChange}
        mouseEnterDelay={delayDuration / 1000}
        getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
      >
        {children}
      </AntTooltip>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = Tooltip

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { sideOffset?: number }
>(({ className, children, sideOffset = 4, ...props }, ref) => {
  const { open } = React.useContext(TooltipContext)

  return (
    <div
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-tooltip-content-transform-origin]",
        className
      )}
      style={{ marginTop: sideOffset, display: open ? "block" : "none" }}
      {...props}
    >
      {children}
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }