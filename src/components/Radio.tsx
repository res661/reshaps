import { hapticPress } from '../lib/telegram.ts'
import styles from './Radio.module.css'

type RadioProps = {
  name: string
  value: string
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (value: string) => void
}

export function Radio({ name, value, label, checked, disabled = false, onChange }: RadioProps) {
  return (
    <label className={styles.row}>
      <input
        className={styles.input}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => {
          hapticPress()
          onChange(value)
        }}
      />
      <span className={styles.mark} aria-hidden />
      <span className={styles.label}>{label}</span>
    </label>
  )
}
