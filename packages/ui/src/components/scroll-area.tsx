// ...existing code...
import * as React from "react"

import { cn } from "@openreel/ui/lib/utils"

type ScrollAreaProps = React.ComponentPropsWithoutRef<"div"> & {
  children?: React.ReactNode
}

type ScrollBarProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal"
}

/**
 * 简单替代 Radix ScrollArea 的实现（不依赖 antd）
 * - 保持原有导出 ScrollArea / ScrollBar API（props 名称保持一致）
 * - 保持结构与样式语义，默认垂直滚动条；提供自定义 thumb 大小与位置同步
 * - 使用原有 className 语义：根节点保留 "relative overflow-hidden"，viewport 为 "h-full w-full rounded-[inherit]"
 *
 * 注意：此实现为轻量替代，尽量兼容原来对外观/类名的依赖，但不会完全复刻 Radix 的所有细节。
 */

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, children, ...props }, ref) => {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const vThumbRef = React.useRef<HTMLDivElement | null>(null)
  const hThumbRef = React.useRef<HTMLDivElement | null>(null)

  // 合并外部 ref
  React.useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, [])

  const updateThumbs = React.useCallback(() => {
    const vp = viewportRef.current
    const vThumb = vThumbRef.current
    const hThumb = hThumbRef.current
    if (!vp) return

    // vertical
    if (vThumb) {
      const { clientHeight, scrollHeight, scrollTop } = vp
      if (scrollHeight <= clientHeight) {
        vThumb.style.height = `0px`
        vThumb.style.transform = `translateY(0px)`
      } else {
        const trackSize = clientHeight
        const thumbSize = Math.max(12, (clientHeight / scrollHeight) * trackSize)
        const maxThumbTop = trackSize - thumbSize
        const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * maxThumbTop
        vThumb.style.height = `${thumbSize}px`
        vThumb.style.transform = `translateY(${thumbTop}px)`
      }
    }

    // horizontal
    if (hThumb) {
      const { clientWidth, scrollWidth, scrollLeft } = vp
      if (scrollWidth <= clientWidth) {
        hThumb.style.width = `0px`
        hThumb.style.transform = `translateX(0px)`
      } else {
        const trackSize = clientWidth
        const thumbSize = Math.max(12, (clientWidth / scrollWidth) * trackSize)
        const maxThumbLeft = trackSize - thumbSize
        const thumbLeft = (scrollLeft / (scrollWidth - clientWidth)) * maxThumbLeft
        hThumb.style.width = `${thumbSize}px`
        hThumb.style.transform = `translateX(${thumbLeft}px)`
      }
    }
  }, [])

  React.useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    updateThumbs()
    const onScroll = () => updateThumbs()
    const ro = new ResizeObserver(updateThumbs)
    vp.addEventListener("scroll", onScroll, { passive: true })
    ro.observe(vp)
    return () => {
      vp.removeEventListener("scroll", onScroll)
      ro.disconnect()
    }
  }, [updateThumbs])

  return (
    <div ref={rootRef} className={cn("relative overflow-hidden", className)} {...props}>
      <div
        ref={viewportRef}
        className={cn("h-full w-full rounded-[inherit] [&>div]:!block [&>div]:!min-w-0", "overflow-auto")}
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" } as React.CSSProperties}
      >
        {/* 隐藏原生滚动条的 CSS（webkit） */}
        <style>{`
          .${(className || "scroll-area-root").replace(/\s+/g, ".")}::-webkit-scrollbar { display: none; }
        `}</style>
        {children}
      </div>

      {/* 自定义滚动条：竖直（右侧） */}
      <div
        aria-hidden
        className={cn(
          "absolute right-0 top-0 h-full w-2.5 p-[1px] transition-colors",
          "pointer-events-none"
        )}
      >
        <div className={cn("relative h-full w-full rounded-full bg-transparent")}>
          <div
            ref={vThumbRef}
            className={cn(
              "absolute right-0 w-2.5 rounded-full bg-border/60",
              "pointer-events-auto"
            )}
            style={{ transform: "translateY(0px)" }}
          />
        </div>
      </div>

      {/* 自定义滚动条：水平（底部） */}
      <div
        aria-hidden
        className={cn(
          "absolute left-0 bottom-0 w-full h-2.5 p-[1px] transition-colors",
          "pointer-events-none"
        )}
      >
        <div className={cn("relative w-full h-full rounded-full bg-transparent")}>
          <div
            ref={hThumbRef}
            className={cn(
              "absolute left-0 h-2.5 rounded-full bg-border/60",
              "pointer-events-auto"
            )}
            style={{ transform: "translateX(0px)" }}
          />
        </div>
      </div>
    </div>
  )
})
ScrollArea.displayName = "ScrollArea"

/**
 * ScrollBar 仍然导出以兼容外部直接使用的场景
 * - 该组件当前为样式包装，用于在特殊场景中单独渲染自定义轨道/拇指
 * - 接受 orientation/className 等属性，尽量保持与原 Radix API 的兼容性
 */
const ScrollBar = React.forwardRef<HTMLDivElement, ScrollBarProps>(({ className, orientation = "vertical", ...props }, ref) => {
  if (orientation === "horizontal") {
    return (
      <div
        ref={ref}
        className={cn("w-full h-2.5 p-[1px] pointer-events-none", className)}
        {...props}
      >
        <div className="relative w-full h-full">
          <div className="absolute left-0 h-2.5 rounded-full bg-border/60" />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn("h-full w-2.5 p-[1px] pointer-events-none", className)}
      {...props}
    >
      <div className="relative h-full w-full">
        <div className="absolute right-0 w-2.5 rounded-full bg-border/60" />
      </div>
    </div>
  )
})
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
// ...existing