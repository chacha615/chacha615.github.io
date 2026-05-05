// ...existing code...
"use client"

import * as React from "react"
import { Switch as AntdSwitch } from "antd"

import { cn } from "@openreel/ui/lib/utils"

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  /**
   * 保留 size 语义（原项目可能使用），映射到 antd 的 small/default
   */
  size?: "small" | "default" | "large"
  id?: string
  name?: string
}

/**
 * Switch 二次封装（基于 antd）
 * - 保持原有 props 名称（checked/defaultChecked/onCheckedChange）
 * - 保持原有样式类名（尽量与之前一致），图标库不变
 */
const Switch = React.forwardRef<any, SwitchProps>(({ className, checked, defaultChecked, onCheckedChange, onChange, disabled, size = "default", id, name, ...props }, ref) => {
  const handleChange = (nextChecked: boolean) => {
    onCheckedChange?.(nextChecked)
    onChange?.(nextChecked)
  }

  // 将项目原先的 tailwind 类尽量保留在外层 className 中
  const baseClass =
    "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"

  // antd size 映射：large 使用默认，small 使用 small
  const antdSize = size === "small" ? "small" : undefined

  return (
    <AntdSwitch
      ref={ref}
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={handleChange}
      disabled={disabled}
      className={cn(baseClass, className)}
      size={antdSize as any}
      id={id}
      {...(name ? { name } : {})}
      {...(props as any)}
    />
  )
})

Switch.displayName = "Switch"

export { Switch }