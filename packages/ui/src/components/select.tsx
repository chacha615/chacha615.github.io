"use client"

import * as React from "react"
import { Select as AntdSelect } from "antd"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@openreel/ui/lib/utils"

const { Option, OptGroup } = (AntdSelect as any)

type SelectProps = {
  value?: string | number | Array<string | number>
  defaultValue?: string | number | Array<string | number>
  onValueChange?: (v: any) => void
  onChange?: (v: any) => void
  multiple?: boolean
  placeholder?: string
  className?: string
  children?: React.ReactNode
  allowClear?: boolean
  disabled?: boolean
  size?: "small" | "middle" | "large"
}

/**
 * 将原 Radix Select 的组合式 children 映射为 antd Select 的 options
 * - 保持原样式类名与外观语义（尽量复现 Trigger / Item 的类）
 * - 保留图标库（lucide-react 的 Check/Chevron）
 * - 导出原先的子组件以保持兼容（这些子组件为语义占位）
 */

const isDisplayName = (el: React.ReactElement, name: string) => {
  const t = el.type as any
  return t?.displayName === name || t === (name as any)
}

const buildOptions = (children: React.ReactNode, selectedValue: any) => {
  const arr = React.Children.toArray(children)
  let keyIdx = 0

  const walk = (nodes: React.ReactNode[]) => {
    const opts: any[] = []
    nodes.forEach((child) => {
      keyIdx++
      const key = `opt-${keyIdx}`
      if (!React.isValidElement(child)) {
        opts.push({ key, label: String(child), value: String(child) })
        return
      }
      const t = child.type as any
      const display = t?.displayName

      // Group / Label -> OptGroup
      if (display === "SelectGroup" || display === "SelectLabel") {
        const label = child.props.children ?? child.props.label
        const groupChildren = React.Children.toArray(child.props.children)
        const groupOptions = walk(groupChildren)
        opts.push({
          key,
          label,
          options: groupOptions,
        })
        return
      }

      // Separator -> divider-like disabled option
      if (display === "SelectSeparator") {
        opts.push({
          key: `${key}-sep`,
          label: <div className="h-px my-1 bg-muted" />,
          value: `${key}-sep`,
          disabled: true,
        })
        return
      }

      // Item
      if (display === "SelectItem" || display === "div" || !display) {
        const val = child.props.value ?? String(child.props.children ?? key)
        const labelNode = (
          <div className="relative flex items-center px-2 py-1.5">
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              {/* 显示选中图标（antd 渲染时会根据 value 与 selectedValue 匹配） */}
              {Array.isArray(selectedValue)
                ? selectedValue.includes(val)
                  ? <Check className="h-4 w-4" />
                  : null
                : selectedValue === val
                ? <Check className="h-4 w-4" />
                : null}
            </span>
            <span className="ml-8"><span className="line-clamp-1">{child.props.children}</span></span>
          </div>
        )
        opts.push({
          key,
          label: labelNode,
          value: val,
          disabled: !!child.props.disabled,
        })
        return
      }

      // Fallback
      opts.push({
        key,
        label: child.props.children,
        value: child.props.value ?? String(child.props.children ?? key),
      })
    })
    return opts
  }

  return walk(arr)
}

/** Root Select：解析 children 构建 options，映射事件保持原 prop 名称 */
const Select = React.forwardRef<any, SelectProps>(({
  value,
  defaultValue,
  onValueChange,
  onChange,
  multiple = false,
  placeholder,
  className,
  children,
  allowClear = false,
  disabled = false,
  size = "middle",
  ...props
}, ref) => {
  const selected = typeof value !== "undefined" ? value : undefined
  const options = buildOptions(children, selected)

  const handleChange = (val: any) => {
    onValueChange?.(val)
    onChange?.(val)
  }

// 使用 antd Select 渲染，下拉项由 options 决定
// ...existing code...
return (
  <AntdSelect
    ref={ref}
    mode={multiple ? "multiple" : undefined}
    value={value as any}
    defaultValue={defaultValue as any}
    onChange={handleChange as any}
    placeholder={placeholder}
    options={options}
    allowClear={allowClear}
    disabled={disabled}
    size={size}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    /* Antd v5: dropdownClassName 已弃用，改用 classNames.popup.root 映射 popup 根节点类名 */
    classNames={{ popup: { root: cn("!rounded-md !border !bg-popover !text-popover-foreground shadow-md") } }}
    {...(props as any)}
  />
)
})
Select.displayName = "Select"

/** 保留原组合式导出，作为语义占位以兼容旧用法 */
const SelectGroup = ({ children }: { children?: React.ReactNode }) => <>{children}</>
SelectGroup.displayName = "SelectGroup"

const SelectValue = ({ children }: { children?: React.ReactNode }) => <>{children}</>
SelectValue.displayName = "SelectValue"

const SelectTrigger = React.forwardRef<any, React.ComponentPropsWithoutRef<"button">>(({ children, ...props }, ref) => {
  // 语义占位：实际 trigger 由 antd Select 控制
  return React.cloneElement(React.Children.only(children) as React.ReactElement, {
    ref,
    ...props,
  })
})
SelectTrigger.displayName = "SelectTrigger"

const SelectScrollUpButton = React.forwardRef<any, React.ComponentPropsWithoutRef<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <ChevronUp className="h-4 w-4" />
  </div>
))
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<any, React.ComponentPropsWithoutRef<"div">>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex cursor-default items-center justify-center py-1", className)} {...props}>
    <ChevronDown className="h-4 w-4" />
  </div>
))
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectContent = ({ children }: { children?: React.ReactNode }) => <>{children}</>
SelectContent.displayName = "SelectContent"

const SelectLabel = ({ children, className }: { children?: React.ReactNode; className?: string }) => (
  <div className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}>{children}</div>
)
SelectLabel.displayName = "SelectLabel"

const SelectItem = ({ children, value, disabled }: { children?: React.ReactNode; value?: any; disabled?: boolean }) => (
  <div data-value={value} data-disabled={disabled}>{children}</div>
)
SelectItem.displayName = "SelectItem"

const SelectSeparator = () => <div className="my-1 h-px bg-muted" />
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}