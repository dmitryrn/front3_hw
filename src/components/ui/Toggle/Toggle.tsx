import { ToggleInput, ToggleThumb, ToggleTrack, ToggleWrap } from '../styles'

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export default function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <ToggleWrap>
      <span>{label}</span>
      <ToggleTrack>
        <ToggleThumb $checked={checked} />
      </ToggleTrack>
      <ToggleInput
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
    </ToggleWrap>
  )
}
