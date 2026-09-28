export type TabId = 'home' | 'wallet' | 'games' | 'more' | 'profile'

export interface TabConfig {
  id: TabId
  path: string
  label: string
}

/**
 * The five bottom-navigation destinations, in spec order (first = home).
 */
export const TABS: readonly TabConfig[] = [
  { id: 'home', path: '/', label: 'Home' },
  { id: 'wallet', path: '/wallet', label: 'Wallet' },
  { id: 'games', path: '/games', label: 'Games' },
  { id: 'more', path: '/more', label: 'More' },
  { id: 'profile', path: '/profile', label: 'Profile' },
]

export function getTabIndex(pathname: string): number {
  const index = TABS.findIndex((tab) =>
    tab.path === '/' ? pathname === '/' : pathname === tab.path || pathname.startsWith(`${tab.path}/`),
  )
  return index === -1 ? 0 : index
}
