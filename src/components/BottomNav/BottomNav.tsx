import type { CSSProperties } from 'react'
import { Link, useLocation } from 'react-router'
import { TABS, getTabIndex } from '../../navigation/tabs'
import { NavIcon } from './NavIcons'
import styles from './BottomNav.module.css'

export function BottomNav() {
  const { pathname } = useLocation()
  const activeIndex = getTabIndex(pathname)

  return (
    <nav
      className={styles.dock}
      aria-label="ניווט ראשי"
      style={{ '--active-index': activeIndex } as CSSProperties}
    >
      <span className={styles.indicator} aria-hidden="true">
        <span className={styles.medallion} />
      </span>
      <ul className={styles.list}>
        {TABS.map((tab, index) => {
          const isActive = index === activeIndex
          return (
            <li key={tab.id} className={styles.item}>
              <Link
                to={tab.path}
                className={isActive ? `${styles.link} ${styles.active}` : styles.link}
                aria-current={isActive ? 'page' : undefined}
                // Tapping the tab you're already on must not trigger a navigation.
                onClick={isActive ? (event) => event.preventDefault() : undefined}
              >
                <span className={styles.icon}>
                  <NavIcon tab={tab.id} />
                </span>
                <span className={styles.label}>{tab.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
