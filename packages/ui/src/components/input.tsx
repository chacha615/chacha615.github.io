// ...existing code...
import * as React from "react"
import { Input as AntdInput } from "antd"

import { cn } from "@openreel/ui/lib/utils"

type NativeInputProps = React.ComponentProps<"input">
type InputProps = NativeInputProps & {
  /**
   * 保留原有 type 语义：
   * - 普通 input -> antd Input
   * - type="textarea" -> antd Input.TextArea
   * - type="password" -> antd Input.Password
   */
  type?: string
}

const baseClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const classes = cn(baseClass, className)

  // textarea 映射到 antd TextArea，保留 rows 等原生属性
  if (type === "textarea") {
    const { rows, ...rest } = props as any
    return (
      <AntdInput.TextArea
        ref={ref as any}
        className={classes}
        rows={rows}
        {...(rest as any)}
      />
    )
  }

  // password 使用 antd 提供的 Password 组件以保留额外行为（可见切换等）
  if (type === "password") {
    return (
      <AntdInput.Password
        ref={ref as any}
        className={classes}
        {...(props as any)}
      />
    )
  }

  // 默认使用 antd Input，保留 type/value/defaultValue/onChange 等属性
  return (
    <AntdInput
      ref={ref as any}
      type={type}
      className={classes}
      {...(props as any)}
    />
  )
})
Input.displayName = "Input"

export { Input }