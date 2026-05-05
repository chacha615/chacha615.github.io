// ...existing code...
import * as React from "react"
import { Checkbox as AntdCheckbox } from "antd"
import { Check } from "lucide-react"

import { cn } from "@openreel/ui/lib/utils"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Radix 的 onCheckedChange 兼容
   */
  onCheckedChange?: (checked: boolean) => void
}

/**
 * Checkbox 二次封装（以 antd Checkbox 为基础）
 * - 保持原有 props 名称（checked/defaultChecked/onChange/onCheckedChange/className 等）
 * - 保持原有结构与样式（使用原始的 tailwind 类名）
 * - 图标库不变（仍使用 lucide-react 的 Check）
 *
 * 说明：
 * - 为了保留原有外观（自定义 indicator），隐藏 antd 默认的 checkbox inner，
 *   并在 wrapper 内摆放自定义 indicator（保持原先 svg 放置与样式语义）。
 * - 同时支持受控（checked）与非受控（defaultChecked）用法，并触发 onCheckedChange/onChange。
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onChange, onCheckedChange, checked, defaultChecked, ...props }, ref) => {
    const controlled = typeof checked !== "undefined"
    const [internalChecked, setInternalChecked] = React.useState<boolean>(
      () => !!defaultChecked
    )

    React.useEffect(() => {
      if (controlled) return
      setInternalChecked(!!defaultChecked)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultChecked])

    const realChecked = controlled ? !!checked : internalChecked

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked
      if (!controlled) setInternalChecked(next)
      onCheckedChange?.(next)
      onChange?.(e)
    }

    // 与原来 radix root 使用的 class 保持一致
    const rootClass = cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      // 保留 data-state=checked 的视觉语义，通过 realChecked 条件类模拟
      realChecked && "bg-primary text-primary-foreground",
      // 隐藏 antd 默认 inner 样式，使用自定义 indicator
      "[&_span.ant-checkbox-inner]:hidden",
      className
    )

    const indicatorClass = cn("grid place-content-center text-current pointer-events-none")

    return (
      <AntdCheckbox
        ref={ref as any}
        checked={realChecked}
        onChange={(e: any) => handleChange(e.target as unknown as React.ChangeEvent<HTMLInputElement>)}
        className={rootClass}
        {...(props as any)}
      >
        {/* 自定义 indicator：覆盖 antd 默认 inner（通过上面的 selector 隐藏），
            保持原来结构中 Indicator 的类名与图标 */}
        <span className={cn("relative", "[&>svg]:pointer-events-none")}>
          <span className={indicatorClass} aria-hidden>
            <Check className="h-4 w-4" />
          </span>
        </span>
      </AntdCheckbox>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
//