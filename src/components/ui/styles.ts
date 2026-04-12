import styled from 'styled-components'

export const ButtonBase = styled.button<{ $variant: 'default' | 'primary' | 'ghost'; $iconOnly: boolean }>`
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: background 150ms ease, border-color 150ms ease, transform 120ms ease;

  &:hover {
    border-color: rgba(43, 122, 106, 0.35);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  ${(p) =>
    p.$variant === 'primary'
      ? `
    background: linear-gradient(180deg, var(--color-accent), var(--color-accent-2));
    color: #fff;
    border-color: rgba(0, 0, 0, 0.08);
  `
      : ''}

  ${(p) =>
    p.$variant === 'ghost'
      ? `
    background: transparent;
    box-shadow: none;
  `
      : ''}

  ${(p) =>
    p.$iconOnly
      ? `
    width: 40px;
    height: 40px;
    display: inline-grid;
    place-items: center;
    padding: 0;
  `
      : ''}
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  color: var(--color-muted);
  margin: 0 0 6px;
`

export const Input = styled.input`
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
`

export const Select = styled.select`
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
`

export const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 10px;
  padding: 10px 12px;
  font: inherit;
  resize: vertical;
  min-height: 96px;
`

export const Error = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(197, 35, 50, 0.12);
  border: 1px solid rgba(197, 35, 50, 0.35);
  color: var(--color-text);
`

export const ErrorIcon = styled.span`
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(197, 35, 50, 0.2);
  font-weight: 700;
  line-height: 1;
`

export const ToggleWrap = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
`

export const ToggleInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`

export const ToggleTrack = styled.span`
  width: 44px;
  height: 26px;
  background: rgba(29, 27, 22, 0.12);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  position: relative;

  :root[data-theme='dark'] & {
    background: rgba(240, 243, 243, 0.12);
  }
`

export const ToggleThumb = styled.span<{ $checked: boolean }>`
  width: 22px;
  height: 22px;
  position: absolute;
  top: 1px;
  left: 1px;
  border-radius: 999px;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: transform 160ms ease;
  transform: translateX(${(p) => (p.$checked ? '18px' : '0')});
`

export const SliderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
`

export const SliderInput = styled.input`
  width: 100%;
`

export const Empty = styled.div`
  height: 100%;
  display: grid;
  place-items: center;
  padding: 40px 20px;
  color: var(--color-muted);
`

export const EmptyCard = styled.div`
  width: min(520px, 100%);
  padding: 22px;
  border: 1px dashed var(--color-border);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.6);

  :root[data-theme='dark'] & {
    background: rgba(0, 0, 0, 0.16);
  }
`

export const EmptyTitle = styled.h2`
  margin: 0 0 6px;
  color: var(--color-text);
  font-size: 16px;
`

export const EmptyText = styled.p`
  margin: 0;
`
