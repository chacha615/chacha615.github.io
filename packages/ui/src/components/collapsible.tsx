"use client"

// ...existing code...
import * as React from "react"
import { Collapse as AntdCollapse } from "antd"

import { cn } from "@openreel/ui/lib/utils"

type CollapsibleContextValue = {
  open: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue>({ open: false, toggle: () => {} })

interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

/**
 * Collapsible 二次封装（基于 antd Collapse）
 * - 保持原 API：Collapsible / CollapsibleTrigger / CollapsibleContent
 * - props 名称保持一致（open/defaultOpen/onOpenChange）并可受控/非受控使用
 * - 使用 antd Collapse 的 items API（替换 children，消除 rc-collapse 警告）
 */
const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ open: controlledOpen, onOpenChange, defaultOpen = false, children, className, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState<boolean>(() => !!defaultOpen)
    const isControlled = typeof controlledOpen !== "undefined"
    const isOpen = isControlled ? !!controlledOpen : internalOpen

    const toggle = React.useCallback(() => {
      const next = !isOpen
      if (!isControlled) setInternalOpen(next)
      onOpenChange?.(next)
    }, [isOpen, isControlled, onOpenChange])

    // Extract Trigger and Content from children (保持原组合 API)
    const childArray = React.Children.toArray(children)
    let triggerNode: React.ReactNode | undefined
    let contentNode: React.ReactNode | undefined
    const otherChildren: React.ReactNode[] = []

    childArray.forEach((child) => {
      if (!React.isValidElement(child)) {
        otherChildren.push(child)
        return
      }
      const t = (child.type as any)
      const displayName = t?.displayName

      if (displayName === "CollapsibleTrigger") {
        triggerNode = child.props.children
        return
      }
      if (displayName === "CollapsibleContent") {
        contentNode = child.props.children
        return
      }
      otherChildren.push(child)
    })

    // antd Collapse 的 activeKey 使用数组形式
    const activeKey = isOpen ? ["panel"] : []

    // 使用 items API 避免 rc-collapse children 警告
    const items = [
      {
        key: "panel",
        label: triggerNode ?? null,
        children: <div className={cn("overflow-hidden")}>{contentNode}</div>,
        className: cn("!p-0", !contentNode && "hidden"),
      },
    ]

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <CollapsibleContext.Provider value={{ open: isOpen, toggle }}>
          <AntdCollapse
            activeKey={activeKey}
            onChange={(keys) => {
              // keys 可能为 string 或 string[]，归一为 boolean
              const openNow = Array.isArray(keys) ? keys.includes("panel") : keys === "panel"
              if (!isControlled) setInternalOpen(openNow)
              onOpenChange?.(openNow)
            }}
            bordered={false}
            ghost
            items={items}
          />

          {/* 渲染其它不属于 Trigger/Content 的子元素（保持兼容） */}
          {otherChildren.length > 0 ? <div>{otherChildren}</div> : null}
        </CollapsibleContext.Provider>
      </div>
    )
  }
)
Collapsible.displayName = "Collapsible"

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ children, className, ...props }, ref) => {
    const { open, toggle } = React.useContext(CollapsibleContext)

    // 触发器保留原始渲染结构/类名，只负责展示 children，并在点击时触发 toggle（以保持行为一致）
    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault()
          toggle()
        }}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    // Content 的渲染由 Collapsible 通过 antd items 中的 children 完成（在 panel 内部），
    // 但为兼容开发者直接渲染 CollapsibleContent 独立使用的场景，仍然提供一个可渲染组件。
    return (
      <div ref={ref} className={cn("overflow-hidden", className)} {...props}>
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
//