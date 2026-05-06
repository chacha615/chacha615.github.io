"use client"

import * as React from "react"
import { Tabs as AntTabs, TabsProps as AntTabsProps } from "antd"
import { motion } from "motion/react"

import { cn } from "@openreel/ui/lib/utils"

interface TabsContextValue {
  activeValue: string | undefined
}

const TabsContext = React.createContext<TabsContextValue>({ activeValue: undefined })

interface TabsProps extends Omit<AntTabsProps, "activeKey" | "defaultActiveKey" | "onChange"> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof AntTabs>,
  TabsProps
>(({ value, defaultValue, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const activeValue = value ?? internalValue

  const handleChange = React.useCallback((newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }, [onValueChange])

  const tabItems = React.useMemo(() => {
    const tabs: { key: string; label: React.ReactNode }[] = []
    const contents: { key: string; node: React.ReactNode }[] = []

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return
      const childElement = child as React.ReactElement<{ value?: string; children?: React.ReactNode }>
      const { value: childValue } = childElement.props

      if (childElement.type === TabsList) {
        React.Children.forEach(child.props.children, (subChild) => {
          if (!React.isValidElement(subChild)) return
          const triggerElement = subChild as React.ReactElement<{ value?: string; children?: React.ReactNode }>
          if (triggerElement.type === TabsTrigger) {
            const { value: triggerValue, children: triggerChildren } = triggerElement.props
            if (triggerValue) {
              tabs.push({ key: triggerValue, label: triggerChildren })
            }
          }
        })
      } else if (childElement.type === TabsContent) {
        if (childValue) {
          contents.push({ key: childValue, node: child })
        }
      }
    })

    return { tabs, contents }
  }, [children])

  return (
    <TabsContext.Provider value={{ activeValue }}>
      <AntTabs
        ref={ref}
        activeKey={activeValue}
        defaultActiveKey={defaultValue}
        onChange={handleChange}
        {...props}
        items={tabItems.tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          children: tabItems.contents.find((c) => c.key === tab.key)?.node
        }))}
      />
    </TabsContext.Provider>
  )
})
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground relative",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & { value?: string }
>(({ className, value, children, ...props }, ref) => {
  const { activeValue } = React.useContext(TabsContext)
  const isActive = activeValue === value

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      value={value}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative z-10",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.span
          layoutId="active-tab"
          className="absolute inset-0 bg-background rounded-sm shadow-sm -z-10"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { value?: string }
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="tabpanel"
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  </div>
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }