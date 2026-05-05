// ...existing code...
import * as React from "react"
import { Progress as AntdProgress } from "antd"

import { cn } from "@openreel/ui/lib/utils"

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * 进度值，范围 0-100（与原 Radix.value 语义保持一致）
   */
  value?: number
  /**
   * 是否显示数值标签（默认隐藏，保持原 Radix 风格）
   */
  showValue?: boolean
  /**
   * 进度条高度（px），默认与原 h-4 相当（16）
   */
  height?: number
}

/**
 * Progress 二次封装（基于 antd Progress）
 * - 保持原有外层结构与样式（根节点使用原来的类名语义）
 * - 使用 antd Progress 做渲染，映射 value -> percent，保留样式可定制点位
 */
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value = 0, showValue = false, height = 16, ...props }, ref) => {
  const percent = Math.max(0, Math.min(100, Number(value || 0)))

  // 根容器保留原来的类名语义
  const rootClass = cn("relative w-full overflow-hidden rounded-full bg-secondary", className)

  return (
    <div ref={ref} className={rootClass} {...props}>
      <AntdProgress
        type="line"
        percent={percent}
        showInfo={!!showValue}
        strokeWidth={height}
        // 使用 CSS 变量或自定义类来匹配项目配色（保持图层与圆角）
        strokeColor="var(--primary)"
        trailColor="var(--secondary)"
        className="w-full"
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
// ...existing code...