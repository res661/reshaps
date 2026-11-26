import styles from './Input.module.css'

type InputProps = {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  type?: 'text' | 'number'
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  type = 'text',
}: InputProps) {
  return (
    <label className={styles.field}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        className={styles.input}
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </label>
  )
}
