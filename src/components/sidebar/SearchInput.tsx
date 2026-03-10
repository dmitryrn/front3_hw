import ui from '../ui/ui.module.css'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <input
      className={ui.input}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Поиск по чатам"
      aria-label="Поиск по чатам"
    />
  )
}
