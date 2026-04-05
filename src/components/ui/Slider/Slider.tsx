import { FieldLabel, SliderInput, SliderRow } from '../styles'

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
      <SliderRow>
        <FieldLabel as="span">{label}</FieldLabel>
        <FieldLabel as="span">{value.toFixed(2)}</FieldLabel>
      </SliderRow>
      <SliderInput
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
