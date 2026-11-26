import type { ReactNode } from 'react'
import { hapticPress } from '../lib/telegram.ts'
import type { TileColor } from './IconTile.tsx'
import styles from './QuickActions.module.css'

export type QuickActionItem = {
  id: string
  label: string
  icon: ReactNode
  color?: TileColor
  disabled?: boolean
  onClick?: () => void
}

type QuickActionsProps = {
  items: QuickActionItem[]
}

export function QuickActions({ items }: QuickActionsProps) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={styles.action}
          disabled={item.disabled}
          onClick={() => {
            if (item.disabled) return
            hapticPress()
            item.onClick?.()
          }}
        >
          <span
            className={styles.icon}
            style={{ color: item.color ? `var(--tile-${item.color})` : undefined }}
            aria-hidden
          >
            {item.icon}
          </span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </div>
  )
}
