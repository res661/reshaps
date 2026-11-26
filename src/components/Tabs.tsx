import { hapticPress } from '../lib/telegram.ts'
import styles from './pills.module.css'

export type TabItem = {
  id: string
  label: string
  disabled?: boolean
}

type TabsProps = {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div className={styles.row} role="tablist">
      {items.map((item) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            className={styles.chip}
            data-active={selected ? 'true' : 'false'}
            aria-selected={selected}
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled || selected) return
              hapticPress()
              onChange(item.id)
            }}
          >
            <span className={styles.label}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
