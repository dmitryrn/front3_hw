import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  justify-items: end;
  z-index: 50;
`

export const Panel = styled.div`
  width: min(520px, 100%);
  height: 100%;
  border-left: 1px solid var(--color-border);
  background: linear-gradient(180deg, var(--color-surface), var(--color-surface-2));
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
`

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
`

export const Title = styled.h3`
  margin: 0;
  font-size: 14px;
`

export const Body = styled.div`
  padding: 14px 16px;
  overflow: auto;
  display: grid;
  gap: 12px;
`

export const Row = styled.div`
  display: grid;
  gap: 6px;
`

export const Actions = styled.div`
  padding: 14px 16px;
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`
