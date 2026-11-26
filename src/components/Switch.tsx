import { useId } from 'react'
import { hapticPress } from '../lib/telegram.ts'
import styles from './Switch.module.css'

type SwitchProps = {
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ label, checked, disabled = false, onChange }: SwitchProps) {
  const id = useId()
  return (
    <button
      type="button"
      className={styles.row}
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        hapticPress()
        onChange(!checked)
      }}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.switch} aria-hidden>
        <span className={styles.track} data-on={checked ? 'true' : 'false'}>
          <span className={styles.thumb} />
        </span>
      </span>
    </button>
  )
}
