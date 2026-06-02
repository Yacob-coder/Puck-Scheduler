import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type Variant = 'soft' | 'dark' | 'success' | 'warning' | 'danger' | 'neutral'

interface BadgeProps {
  variant?: Variant
  children: ReactNode
  className?: string
}

const variantClass: Record<Variant, string> = {
  soft: styles.soft,
  dark: styles.dark,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  neutral: styles.neutral,
}

export function Badge({ variant = 'soft', children, className }: BadgeProps) {
  const classes = [styles.badge, variantClass[variant], className ?? '']
    .filter(Boolean)
    .join(' ')

  return <span className={classes}>{children}</span>
}
