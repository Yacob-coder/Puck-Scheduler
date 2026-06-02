import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'on-dark'
type Size = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  'on-dark': styles.onDark,
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className, children, ...rest }, ref) => {
    const classes = [
      styles.button,
      variantClass[variant],
      size === 'sm' ? styles.sm : '',
      fullWidth ? styles.fullWidth : '',
      className ?? '',
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
