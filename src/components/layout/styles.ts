import styled from 'styled-components'

export const Layout = styled.div`
  height: 100%;
  display: flex;
  background: radial-gradient(1200px 700px at 15% 0%, rgba(43, 122, 106, 0.08), transparent 60%),
    radial-gradient(900px 500px at 95% 30%, rgba(43, 122, 106, 0.06), transparent 55%),
    var(--color-bg);
`

export const Main = styled.main`
  flex: 1;
  min-width: 0;
`
