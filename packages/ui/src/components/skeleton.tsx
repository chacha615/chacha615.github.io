import * as React from "react"
import { Skeleton as AntdSkeleton } from "antd"

import { cn } from "@openreel/ui/lib/utils"

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * 是否显示骨架（默认 true）
   */
  loading?: boolean
  /**
   * 是否启用动画（对应 antd 的 active）
   */
  active?: boolean
  /**
   * 形状，仅作语义保留（antd 支持 avatar/title/paragraph 组合，此处做最小映射）
   */
  shape?: "rect" | "round" | "circle"
  /**
   * 大小语义（仅用于 className 或自定义样式）
   */
  size?: "small" | "default" | "large"
}

/**
 * Skeleton 二次封装（基于 antd Skeleton）
 * - 保留原组件的 className/children/其它通用属性
 * - 暴露 loading/active/shape/size 等常用属性并映射到 antd
 * - 保持原有样式语义（rounded-md bg-muted），并允许通过 className 覆盖
 */
function Skeleton({
  className,
  children,
  loading = true,
  active = true,
  shape = "rect",
  size = "default",
  ...props
}: SkeletonProps) {
  // antd Skeleton 的 avatar/title/paragraph 能够构成多种骨架外观，
  // 这里使用简单的 paragraph 以匹配原项目中小块占位的样式。
  return (
    <AntdSkeleton
      active={active}
      loading={loading}
      paragraph={{ rows: 1 }}
      avatar={false}
      title={false}
      className={cn("rounded-md bg-muted", className)}
      {...(props as any)}
    >
      {/* 当 loading 为 false 时，渲染 children（与原简单占位兼容） */}
      {children}
    </AntdSkeleton>
  )
}

export { Skeleton }