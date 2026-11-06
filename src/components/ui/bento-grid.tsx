import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

// Started from the Magic UI bento grid (MIT, magicui.design), then changed to
// fit this site: 12 columns, rows that fit their content, colour tokens only,
// and a whole-card link in place of the sliding text and hover-only button.

interface BentoGridProps extends ComponentPropsWithoutRef<"ul"> {
  children: ReactNode
}

interface BentoCardProps extends ComponentPropsWithoutRef<"li"> {
  name: string
  description: string
  href: string
  children: ReactNode
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <ul
      className={cn("grid w-full grid-cols-1 gap-4 md:grid-cols-12", className)}
      {...props}
    >
      {children}
    </ul>
  )
}

const BentoCard = ({
  name,
  description,
  href,
  children,
  className,
  ...props
}: BentoCardProps) => (
  <li
    className={cn(
      "sunset-edge relative flex flex-col gap-4 overflow-hidden rounded-xl bg-card p-4 text-card-foreground ring-1",
      className
    )}
    {...props}
  >
    <h3 className="text-lg font-semibold">
      {/* The ::after layer stretches this link over the whole card. */}
      <Link href={href} className="after:absolute after:inset-0">
        {name}
      </Link>
    </h3>
    <p className="text-muted-foreground">{description}</p>
    <div className="flex flex-1 flex-col gap-4">{children}</div>
  </li>
)

export { BentoCard, BentoGrid }
