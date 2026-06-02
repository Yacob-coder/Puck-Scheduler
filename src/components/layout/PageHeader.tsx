import type { ReactNode } from 'react'
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  withMesh?: boolean
}

export function PageHeader({ title, subtitle, action, withMesh = false }: PageHeaderProps) {
  if (withMesh) {
    return (
      <div className={styles.mesh}>
        <div className={styles.meshGradient} aria-hidden />
        <div className={styles.meshContent}>
          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.title}>{title}</h1>
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {action && <div className={styles.action}>{action}</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div className={styles.action}>{action}</div>}
      </div>
    </div>
  )
}
