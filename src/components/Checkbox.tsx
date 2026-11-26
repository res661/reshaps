import { hapticPress } from '../lib/telegram.ts'
import styles from './Checkbox.module.css'

type CheckboxProps = {
  label: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}

export function Checkbox({ label, checked, disabled = false, onChange }: CheckboxProps) {
  return (
    <label className={styles.row}>
      <input
        className={styles.input}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          hapticPress()
          onChange(event.target.checked)
        }}
      />
      <span className={styles.box} aria-hidden>
        <svg className={styles.check} viewBox="0 0 16 16">
          <path
            d="M3.5 8.2 6.6 11.3 12.5 4.8"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  )
}
