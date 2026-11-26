import { cn } from '../lib/cn.ts'
import { hapticPress } from '../lib/telegram.ts'
import styles from './StoriesRow.module.css'

export type StoryItem = {
  id: string
  title: string
  background: string
  onClick?: () => void
}

type StoriesRowProps = {
  items: StoryItem[]
  className?: string
}

export function StoriesRow({ items, className }: StoriesRowProps) {
  return (
    <div className={cn(styles.row, className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={styles.story}
          style={{ background: item.background }}
          onClick={() => {
            hapticPress()
            item.onClick?.()
          }}
        >
          <span className={styles.label}>{item.title}</span>
        </button>
      ))}
    </div>
  )
}
