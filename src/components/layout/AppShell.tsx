import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import styles from './AppShell.module.css'

export function AppShell() {
  return (
    <div className={styles.shell}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
