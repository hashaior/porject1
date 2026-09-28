import { Outlet, useLocation } from 'react-router'
import { BottomNav } from '../components/BottomNav/BottomNav'
import { UnderwaterScene } from '../components/UnderwaterScene/UnderwaterScene'
import { useSwipeNavigation } from '../navigation/useSwipeNavigation'
import styles from './AppShell.module.css'

/** Mobile frame shared by every tab: scene background, routed screen and the fixed bottom dock. */
export function AppShell() {
  const { pathname } = useLocation()
  const swipeHandlers = useSwipeNavigation()

  return (
    <div className={styles.viewport}>
      <div className={styles.frame}>
        <UnderwaterScene variant={pathname === '/' ? 'hero' : 'muted'} />
        <main className={styles.content} {...swipeHandlers}>
          <div key={pathname} className={styles.screen}>
            <Outlet />
          </div>
        </main>
        <footer className={styles.dock}>
          <BottomNav />
        </footer>
      </div>
    </div>
  )
}
