// ...existing code...
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Alert as AntdAlert } from "antd"

import { cn } from "@openreel/ui/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type AlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>

/**
 * Alert 二次封装（基于 antd Alert）
 * - 保持原有组合 API（AlertTitle / AlertDescription / 自定义 icon）
 * - 若使用组合 API（存在 AlertTitle/AlertDescription），优先使用 antd Alert 渲染 message/description
 * - 否则回退为原始 wrapper，保持结构与样式不变
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ className, variant, children, ...props }, ref) => {
  const classes = cn(alertVariants({ variant }), className)

  const childArray = React.Children.toArray(children)
  let foundTitle: React.ReactNode | undefined
  let foundDescription: React.ReactNode | undefined
  let foundIcon: React.ReactNode | undefined
  const otherChildren: React.ReactNode[] = []

  childArray.forEach((child) => {
    if (!React.isValidElement(child)) {
      otherChildren.push(child)
      return
    }
    const t = (child.type as any)
    const displayName = t?.displayName

    // 识别自定义 AlertTitle / AlertDescription
    if (displayName === "AlertTitle") {
      foundTitle = child.props.children
      return
    }
    if (displayName === "AlertDescription") {
      foundDescription = child.props.children
      return
    }

    // 如果子元素是 svg React 元素（常见图标输出），作为 icon
    if (!foundIcon && (child.type as any) === "svg") {
      foundIcon = child
      return
    }
    // 另一个穷举：某些 icon 组件并非标注 displayName，但其 type.toString 包含 "svg"
    if (!foundIcon && typeof t === "function" && t.toString && t.toString().includes("svg")) {
      foundIcon = child
      return
    }

    otherChildren.push(child)
  })

  // 当识别到组合 API（title/description）时，使用 antd Alert 渲染以保留语义
  if (foundTitle || foundDescription) {
    const typeMap: Record<string, any> = {
      default: "info",
      destructive: "error",
    }
    const antdType = typeMap[variant ?? "default"]

    return (
      <AntdAlert
        ref={ref as any}
        type={antdType}
        className={classes}
        icon={foundIcon}
        message={foundTitle ? <h5 className={cn("mb-1 font-medium leading-none tracking-tight")}>{foundTitle}</h5> : undefined}
        description={foundDescription ? <div className={cn("text-sm [&_p]:leading-relaxed")}>{foundDescription}</div> : undefined}
        {...(props as any)}
      />
    )
  }

  // fallback：保持原有 wrapper（保持外观与结构）
  return (
    <div ref={ref} role="alert" className={classes} {...props}>
      {children}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }