import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Card.module.css'

type Variant = 'feature' | 'dashboard' | 'cream' | 'dark' | 'soft'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant
  children: ReactNode
}

const variantClass: Record<Variant, string> = {
  feature: styles.feature,
  dashboard: styles.dashboard,
  cream: styles.cream,
  dark: styles.dark,
  soft: styles.soft,
}

export function Card({ variant = 'feature', className, children, ...rest }: CardProps) {
  const classes = [styles.card, variantClass[variant], className ?? '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}
