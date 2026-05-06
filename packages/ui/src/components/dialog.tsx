"use client"

import * as React from "react"
import { Modal } from "antd"
import { X } from "lucide-react"

import { cn } from "@openreel/ui/lib/utils"

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue>({
  open: false,
  onOpenChange: () => {},
})

interface DialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

const Dialog: React.FC<DialogProps> = ({ children, open: controlledOpen, onOpenChange, defaultOpen }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [controlledOpen, onOpenChange])

  let triggerElement: React.ReactNode = null
  let contentElement: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === DialogTrigger) {
        triggerElement = child.props.children
      } else if (child.type === DialogContent) {
        contentElement = child
      }
    }
  })

  return (
    <DialogContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      {triggerElement && (
        <div onClick={() => handleOpenChange(true)} className="inline-block cursor-pointer">
          {triggerElement}
        </div>
      )}
      {contentElement && React.isValidElement(contentElement) ? (
        React.cloneElement(contentElement as React.ReactElement<any>, {
          open,
          onOpenChange: handleOpenChange,
        })
      ) : null}
    </DialogContext.Provider>
  )
}

interface DialogTriggerProps {
  children?: React.ReactNode
  asChild?: boolean
}

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children }) => {
  return <>{children}</>
}

const DialogPortal = ({ children }: { children?: React.ReactNode }) => <>{children}</>

interface DialogCloseProps {
  children?: React.ReactNode
  onClose?: () => void
}

const DialogClose: React.FC<DialogCloseProps> = ({ children, onClose }) => {
  const context = React.useContext(DialogContext)
  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        context.onOpenChange(false)
        onClose?.()
      }}
      className="cursor-pointer"
    >
      {children}
    </div>
  )
}

interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogOverlay: React.FC<DialogOverlayProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  hideCloseButton?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, children, hideCloseButton = false, open, onOpenChange, ...props }, ref) => {
  const context = React.useContext(DialogContext)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : context.open
  const handleOpenChange = onOpenChange || context.onOpenChange

  return (
    <Modal
      open={isOpen}
      onCancel={() => handleOpenChange(false)}
      closable={!hideCloseButton}
      closeIcon={<X className="h-4 w-4" />}
      footer={null}
      mask={{ closable: true }}
      className={cn(
        "!top-1/2 !-translate-y-1/2 !max-w-lg !w-full",
        className
      )}
      styles={{
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
        body: {
          padding: 0,
        },
        wrapper: {
          borderRadius: "8px",
        },
      }}
      {...props}
    >
      <div
        ref={ref}
        className={cn(
          "relative",
        )}
      >
        {children}
      </div>
    </Modal>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  asChild?: boolean
}

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(({ className, asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: cn("text-sm text-muted-foreground", className, (children as React.ReactElement<any>).props.className),
      ref,
      ...props,
    })
  }
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  )
})
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
