// ...existing code...
import * as React from "react"
import { Card as AntdCard } from "antd"

import { cn } from "@openreel/ui/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  // 保持原有根节点样式（rounded border bg-card text-card-foreground shadow-sm）
  // 使用 antd Card 做包裹，但 bodyPadding 交给内部子组件（如 CardHeader/CardContent）保持原结构样式
  const classes = cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)

  return (
    <AntdCard
      ref={ref as any}
      className={classes}
      bordered
      // 保持子组件的内边距由子元素控制，避免 antd 默认 body padding 干扰原结构
      bodyStyle={{ padding: 0 }}
      {...(props as any)}
    >
      {children}
    </AntdCard>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  // Card 的内容区域保留原有的 padding 语义（p-6 pt-0）
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
// ...existing code...