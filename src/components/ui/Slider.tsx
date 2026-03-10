import styles from './ui.module.css'

type SliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}

export default function Slider({ label, value, min, max, step, onChange }: SliderProps) {
  return (
    <div>
      <div className={styles.sliderRow}>
        <label className={styles.fieldLabel}>{label}</label>
        <div className={styles.fieldLabel}>{value.toFixed(2)}</div>
      </div>
      <input
        className={styles.slider}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}
