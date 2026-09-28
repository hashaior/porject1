export type TabId = 'home' | 'wallet' | 'games' | 'more' | 'profile'

export interface TabConfig {
  id: TabId
  path: string
  label: string
}

/**
 * The five bottom-navigation destinations, in spec order (first = home).
 * The app is RTL, so the first tab renders at the right edge.
 */
export const TABS: readonly TabConfig[] = [
  { id: 'home', path: '/', label: 'בית' },
  { id: 'wallet', path: '/wallet', label: 'ארנק' },
  { id: 'games', path: '/games', label: 'משחקים' },
  { id: 'more', path: '/more', label: 'עוד' },
  { id: 'profile', path: '/profile', label: 'פרופיל' },
]

export function getTabIndex(pathname: string): number {
  const index = TABS.findIndex((tab) =>
    tab.path === '/' ? pathname === '/' : pathname === tab.path || pathname.startsWith(`${tab.path}/`),
  )
  return index === -1 ? 0 : index
}
