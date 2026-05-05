"use client"

import * as React from "react"
import { Dropdown } from "antd"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@openreel/ui/lib/utils"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue>({
  open: false,
  setOpen: () => {},
})

interface DropdownMenuProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, open: controlledOpen, onOpenChange, defaultOpen }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [controlledOpen, onOpenChange])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
  }), [open, setOpen])

  let triggerElement: React.ReactNode = null
  let contentElement: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DropdownMenuTrigger) {
        triggerElement = child.props.children
      } else if (child.type === DropdownMenuContent) {
        contentElement = child
      }
    }
  })

  return (
    <DropdownMenuContext.Provider value={contextValue}>
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        trigger={["click"]}
        popupRender={() => (
          <div
            className={cn(
              "z-[9999] max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {contentElement}
          </div>
        )}
      >
        <div className="inline-block">
          {triggerElement}
        </div>
      </Dropdown>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children?: React.ReactNode
  asChild?: boolean
}

const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({ children }) => {
  return <>{children}</>
}

const DropdownMenuGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const DropdownMenuPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const DropdownMenuSub = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const DropdownMenuRadioGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>

interface DropdownMenuSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  children?: React.ReactNode
}

const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </div>
))
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger"

interface DropdownMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = "DropdownMenuSubContent"

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  sideOffset?: number
  side?: string
  align?: string
}

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ children, className, sideOffset = 4, side, align, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-[9999] max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  disabled?: boolean
}

const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ className, inset, disabled, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    data-disabled={disabled ? "" : undefined}
    {...props}
  >
    {children}
  </div>
))
DropdownMenuItem.displayName = "DropdownMenuItem"

interface DropdownMenuCheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuCheckboxItemProps
>(({ className, children, checked, onCheckedChange, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    data-disabled={disabled ? "" : undefined}
    onClick={() => !disabled && onCheckedChange?.(!checked)}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <AnimatePresence>
        {checked && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
    {children}
  </div>
))
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

interface DropdownMenuRadioItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  disabled?: boolean
}

const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuRadioItemProps
>(({ className, children, value, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    data-disabled={disabled ? "" : undefined}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <Circle className="h-2 w-2 fill-current" />
      </motion.span>
    </span>
    {children}
  </div>
))
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = "DropdownMenuLabel"

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
