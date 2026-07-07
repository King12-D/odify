import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover glow-primary',
  secondary: 'bg-zinc-50 text-zinc-900 hover:bg-zinc-100 border border-zinc-200',
  ghost: 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50/80',
  outline: 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn('inline-flex items-center justify-center gap-2 font-medium transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none', variants[variant], sizes[size], className)}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
