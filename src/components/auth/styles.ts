import styled from 'styled-components'

export const Wrap = styled.div`
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(900px 520px at 20% 10%, rgba(43, 122, 106, 0.12), transparent 60%),
    radial-gradient(800px 480px at 90% 20%, rgba(43, 122, 106, 0.09), transparent 55%),
    var(--color-bg);
`

export const Card = styled.div`
  width: min(560px, 100%);
  border-radius: 18px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.72);
  padding: 18px;
  box-shadow: var(--shadow-md);

  :root[data-theme='dark'] & {
    background: rgba(0, 0, 0, 0.25);
  }
`

export const Title = styled.h1`
  margin: 0 0 6px;
  font-size: 18px;
`

export const Subtitle = styled.p`
  margin: 0 0 16px;
  color: var(--color-muted);
  font-size: 13px;
`

export const Grid = styled.div`
  display: grid;
  gap: 12px;
`

export const Radios = styled.div`
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
`

export const Radio = styled.label`
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--color-text);
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`
