import type { BadgeTone } from './Badge.tsx'
import { Badge } from './Badge.tsx'
import { Card } from './Card.tsx'
import styles from './HeroBalance.module.css'

type HeroBalanceProps = {
  label: string
  value: string
  tag?: string
  tagTone?: BadgeTone
}

export function HeroBalance({ label, value, tag, tagTone = 'accent' }: HeroBalanceProps) {
  return (
    <Card>
      <div className={styles.hero}>
        <div className={styles.copy}>
          <span className={styles.label}>{label}</span>
          <span className={styles.value}>{value}</span>
        </div>
        {tag ? <Badge tone={tagTone}>{tag}</Badge> : null}
      </div>
    </Card>
  )
}
