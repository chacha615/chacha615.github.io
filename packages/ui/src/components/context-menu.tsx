"use client"

import * as React from "react"
import { Dropdown } from "antd"
import { motion, AnimatePresence } from "motion/react"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@openreel/ui/lib/utils"

interface ContextMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const ContextMenuContext = React.createContext<ContextMenuContextValue>({
  open: false,
  setOpen: () => {},
})

interface ContextMenuProps {
  children?: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ children, onOpenChange }) => {
  const [open, setOpen] = React.useState(false)

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }, [onOpenChange])

  const contextValue = React.useMemo(() => ({
    open,
    setOpen: handleOpenChange,
  }), [open, handleOpenChange])

  let triggerElement: React.ReactNode = null
  let contentElement: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === ContextMenuTrigger) {
        triggerElement = child.props.children
      } else if (child.type === ContextMenuContent) {
        contentElement = child
      }
    }
  })

  return (
    <ContextMenuContext.Provider value={contextValue}>
      <Dropdown
        open={open}
        onOpenChange={handleOpenChange}
        trigger={["contextMenu"]}
        popupRender={() => (
          <div
            className={cn(
              "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
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
    </ContextMenuContext.Provider>
  )
}

interface ContextMenuTriggerProps {
  children?: React.ReactNode
  asChild?: boolean
}

const ContextMenuTrigger: React.FC<ContextMenuTriggerProps> = ({ children }) => {
  return <>{children}</>
}

const ContextMenuGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const ContextMenuPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const ContextMenuSub = ({ children }: { children?: React.ReactNode }) => <>{children}</>

const ContextMenuRadioGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>

interface ContextMenuSubTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  children?: React.ReactNode
}

const ContextMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  ContextMenuSubTriggerProps
>(({ className, inset, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </div>
))
ContextMenuSubTrigger.displayName = "ContextMenuSubTrigger"

interface ContextMenuSubContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenuSubContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuSubContentProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 slide-in-from-left-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = "ContextMenuSubContent"

interface ContextMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  ContextMenuContentProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ContextMenuContent.displayName = "ContextMenuContent"

interface ContextMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  children?: React.ReactNode
  disabled?: boolean
}

const ContextMenuItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuItemProps
>(({ className, inset, disabled, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      inset && "pl-8",
      disabled && "pointer-events-none opacity-50 cursor-not-allowed",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
ContextMenuItem.displayName = "ContextMenuItem"

interface ContextMenuCheckboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  checked?: boolean
  children?: React.ReactNode
}

const ContextMenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuCheckboxItemProps
>(({ className, children, checked, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
      className
    )}
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
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem"

interface ContextMenuRadioItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const ContextMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuRadioItemProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
      className
    )}
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
ContextMenuRadioItem.displayName = "ContextMenuRadioItem"

interface ContextMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

const ContextMenuLabel = React.forwardRef<
  HTMLDivElement,
  ContextMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = "ContextMenuLabel"

interface ContextMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = "ContextMenuSeparator"

const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut
}