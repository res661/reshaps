import type { ReactNode } from 'react'
import { Card } from './Card.tsx'
import styles from './EmptyState.module.css'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <Card>
      <div className={styles.empty}>
        {icon ? <div className={styles.icon}>{icon}</div> : null}
        <div className={styles.title}>{title}</div>
        {description ? <div className={styles.description}>{description}</div> : null}
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
    </Card>
  )
}
