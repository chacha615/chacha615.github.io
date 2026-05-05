// ...existing code...
"use client"

import * as React from "react"
import { Popover as AntdPopover } from "antd"

import { cn } from "@openreel/ui/lib/utils"

/**
 * Popover 二次封装（基于 antd Popover）
 * - 保持原导出名 Popover / PopoverTrigger / PopoverContent
 * - 保持原有 props 名称（open/defaultOpen/onOpenChange）并支持受控/非受控
 * - 保持原结构与样式（PopoverContent 的 className/children 将被传入 antd overlay）
 * - 克隆 trigger 时过滤非标准 DOM 属性（如 asChild）以避免 React 警告
 */

type PopoverRootProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  className?: string
}

const isDisplayName = (el: React.ReactElement, name: string) => {
  const t = el.type as any
  return t?.displayName === name || t === (name as any)
}

const mapAlignToPlacement = (align?: string) => {
  switch (align) {
    case "start":
    case "left":
      return "left"
    case "end":
    case "right":
      return "right"
    case "top":
      return "top"
    case "bottom":
      return "bottom"
    case "center":
    default:
      return "bottom"
  }
}

const Popover = React.forwardRef<HTMLDivElement, PopoverRootProps>(
  ({ open: controlledOpen, defaultOpen = false, onOpenChange, children, className, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState<boolean>(() => !!defaultOpen)
    const isControlled = typeof controlledOpen !== "undefined"
    const open = isControlled ? !!controlledOpen : internalOpen

    React.useEffect(() => {
      if (!isControlled) return
      setInternalOpen(!!controlledOpen)
    }, [controlledOpen, isControlled])

    const setOpen = (next: boolean) => {
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    }

    // 提取 Trigger / Content 节点
    const arr = React.Children.toArray(children)
    let triggerNode: React.ReactElement | null = null
    let contentNode: React.ReactElement | null = null
    let contentProps: any = {}

    arr.forEach((child) => {
      if (!React.isValidElement(child)) return
      if (isDisplayName(child as React.ReactElement, "PopoverTrigger")) {
        triggerNode = child
        return
      }
      if (isDisplayName(child as React.ReactElement, "PopoverContent")) {
        contentNode = child
        contentProps = (child.props as any) || {}
        return
      }
    })

    // overlay 内容包装（保持 PopoverContent 的 className 与 children）
    const overlay = contentNode ? (
      <div className={cn(contentProps.className)}>{contentProps.children}</div>
    ) : null

    // 如果没有 trigger，直接渲染 children（兼容之前用法）
    if (!triggerNode) {
      return (
        <div ref={ref} className={cn(className)} {...(props as any)}>
          {children}
        </div>
      )
    }

    // 过滤掉不应透传到 DOM 的内部 props（如 asChild/as）
    const originalTriggerProps = (triggerNode as any).props || {}
    const { asChild, as, ...restTriggerProps } = originalTriggerProps

    // 只允许安全的原生/事件/aria/data 属性透传，避免把内部标记（如 asChild）透传到原生 DOM
    const safeTriggerProps: Record<string, any> = {}
    for (const [k, v] of Object.entries(restTriggerProps)) {
      if (
        k.startsWith("data-") ||
        k.startsWith("aria-") ||
        k === "id" ||
        k === "role" ||
        k === "style" ||
        k === "tabIndex" ||
        typeof v === "function" || // event handlers
        typeof v === "string" ||
        typeof v === "number" ||
        typeof v === "boolean"
      ) {
        safeTriggerProps[k] = v
      }
    }

    const triggerChild = React.cloneElement(triggerNode as React.ReactElement, {
      // 仅注入 className 与经过过滤的安全 props
      className: cn(safeTriggerProps.className || (triggerNode as any).props?.className),
      ...safeTriggerProps,
    })

    const placement = mapAlignToPlacement(contentProps.align)

    return (
      <div ref={ref} className={cn(className)} {...(props as any)}>
        <AntdPopover
          open={open}
          // Antd Popover v5 uses onOpenChange, keep mapping
          onOpenChange={(o: boolean) => setOpen(o)}
          content={overlay}
          placement={placement as any}
          trigger="click"
          getPopupContainer={() => (typeof document !== "undefined" ? document.body : undefined) as any}
          overlayClassName={cn("z-[9999]")}
          overlayStyle={contentProps.style}
        >
          {triggerChild}
        </AntdPopover>
      </div>
    )
  }
)
Popover.displayName = "Popover"

type PopoverTriggerProps = React.HTMLAttributes<HTMLElement> & { asChild?: boolean; as?: any }

const PopoverTrigger = React.forwardRef<any, PopoverTriggerProps>(({ children, ...props }, ref) => {
  // 避免将内部 props（如 asChild）透传到子元素，先过滤 props
  const { asChild, as, ...rest } = props || {}
  const safeProps: Record<string, any> = {}
  for (const [k, v] of Object.entries(rest)) {
    if (
      k.startsWith("data-") ||
      k.startsWith("aria-") ||
      k === "id" ||
      k === "role" ||
      k === "style" ||
      k === "tabIndex" ||
      typeof v === "function" ||
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      safeProps[k] = v
    }
  }

  // 直接返回子节点，Popover Root 会 clone 并处理事件；保留语义包装
  return React.cloneElement(React.Children.only(children) as React.ReactElement, {
    ref,
    ...safeProps,
  })
})
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { align?: string; sideOffset?: number; side?: string }>(
  ({ className, align = "center", sideOffset = 4, side, style, children, ...props }, ref) => {
    // Popover Root 会将其 children 放入 antd overlay；此处保留类名和数据属性以保持样式语义
    return (
      <div
        ref={ref}
        data-align={align}
        data-side={side}
        data-side-offset={sideOffset}
        className={cn(
          "rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          className
        )}
        style={style}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }