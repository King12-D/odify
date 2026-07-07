import { type HTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
}

const variants = {
  default: 'bg-zinc-50 text-zinc-700',
  success: 'bg-accent/10 text-accent border border-accent/20',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
  info: 'bg-primary/10 text-primary border border-primary/20',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <span ref={ref} className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full', variants[variant], className)} {...props} />
  ),
)
Badge.displayName = 'Badge'
