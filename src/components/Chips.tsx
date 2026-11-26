import { hapticPress } from '../lib/telegram.ts'
import styles from './pills.module.css'

export type ChipItem = {
  id: string
  label: string
  disabled?: boolean
}

type ChipsProps = {
  items: ChipItem[]
  value: string[]
  onChange: (value: string[]) => void
}

export function Chips({ items, value, onChange }: ChipsProps) {
  return (
    <div className={styles.row} role="group">
      {items.map((item) => {
        const active = value.includes(item.id)
        return (
          <button
            key={item.id}
            type="button"
            className={styles.chip}
            data-active={active ? 'true' : 'false'}
            aria-pressed={active}
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return
              hapticPress()
              onChange(active ? value.filter((id) => id !== item.id) : [...value, item.id])
            }}
          >
            <span className={styles.label}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
