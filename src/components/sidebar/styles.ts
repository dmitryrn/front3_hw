import styled from 'styled-components'

export const Overlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 800px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 20;
    opacity: ${(p) => (p.$open ? 1 : 0)};
    pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
    transition: opacity 160ms ease;
  }
`

export const SidebarAside = styled.aside<{ $open: boolean }>`
  width: 320px;
  border-right: 1px solid var(--color-border);
  background: linear-gradient(180deg, var(--color-surface), var(--color-surface-2));
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (max-width: 800px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(${(p) => (p.$open ? '0' : '-105%')});
    transition: transform 180ms ease;
    z-index: 30;
  }
`

export const Top = styled.div`
  padding: 14px;
  display: grid;
  gap: 10px;
  border-bottom: 1px solid var(--color-border);
`

export const NewChat = styled.span`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`

export const Plus = styled.span`
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
`

export const List = styled.div`
  padding: 8px;
  overflow: auto;
`

export const Item = styled.div<{ $active: boolean }>`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 10px 10px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;

  ${(p) =>
    p.$active
      ? `
    background: rgba(43, 122, 106, 0.14);
    border-color: rgba(43, 122, 106, 0.35);
  `
      : ''}

  &:hover {
    background: rgba(43, 122, 106, 0.08);
    border-color: rgba(43, 122, 106, 0.18);
  }
`

export const Title = styled.div`
  font-size: 14px;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Meta = styled.div`
  font-size: 12px;
  color: var(--color-muted);
`

export const Actions = styled.div`
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 120ms ease;

  ${Item}:hover & {
    opacity: 1;
  }
`

export const ActionBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;

  &:hover {
    border-color: rgba(43, 122, 106, 0.35);
  }
`
