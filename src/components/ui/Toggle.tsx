import styles from './ui.module.css'

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  const trackClass = [styles.toggleTrack, checked ? styles.toggleOn : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <label className={styles.toggle}>
      <span>{label}</span>
      <span className={trackClass}>
        <span className={styles.toggleThumb} />
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        aria-label={label}
      />
    </label>
  )
}
