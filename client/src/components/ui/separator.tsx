import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export const Separator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('h-px bg-zinc-50', className)} {...props} />
  ),
)
Separator.displayName = 'Separator'
