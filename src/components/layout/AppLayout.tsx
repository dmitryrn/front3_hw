import type { ReactNode } from 'react'
import styles from './AppLayout.module.css'

type AppLayoutProps = {
  sidebar: ReactNode
  chat: ReactNode
}

export default function AppLayout({ sidebar, chat }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      {sidebar}
      <main className={styles.main}>{chat}</main>
    </div>
  )
}
