import type { ReactNode } from 'react'
import { Layout, Main } from '../styles'

type AppLayoutProps = {
  sidebar: ReactNode
  chat: ReactNode
}

export default function AppLayout({ sidebar, chat }: AppLayoutProps) {
  return (
    <Layout>
      {sidebar}
      <Main>{chat}</Main>
    </Layout>
  )
}
