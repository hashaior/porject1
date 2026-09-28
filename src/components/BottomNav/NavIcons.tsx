import type { ReactNode, SVGProps } from 'react'
import type { TabId } from '../../navigation/tabs'

/* Shapes marked with data-fill get a soft tint when their tab is active. */

function IconBase({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

function HomeIcon() {
  return (
    <IconBase>
      <path data-fill d="M5.5 9.4V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V9.4L12 4.2Z" />
      <path d="M3.5 10.8 12 4l8.5 6.8" />
      <path d="M10 20.5v-4.7a2 2 0 0 1 4 0v4.7" />
    </IconBase>
  )
}

function WalletIcon() {
  return (
    <IconBase>
      <path d="M5 7.4 15.8 4.6a1.2 1.2 0 0 1 1.5 1.1v1.7" />
      <rect data-fill x="3.5" y="7.5" width="17" height="12.5" rx="2.6" />
      <path d="M20.5 11.6h-3.6a2.1 2.1 0 0 0 0 4.2h3.6" />
      <circle cx="17" cy="13.7" r="0.9" fill="currentColor" stroke="none" />
    </IconBase>
  )
}

function GamesIcon() {
  return (
    <IconBase>
      <path data-fill d="M14.5 17.5 3.5 6.5v-3h3l11 11" />
      <path d="M13 19l6-6M16 16l4 4M19 21l2-2" />
      <path data-fill d="M14.5 6.5 17.5 3.5h3v3l-3 3" />
      <path d="M5 14l4 4M7 17l-3 3M3 19l2 2" />
    </IconBase>
  )
}

function MoreIcon() {
  return (
    <IconBase>
      <rect data-fill x="4" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
      <rect data-fill x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
    </IconBase>
  )
}

function ProfileIcon() {
  return (
    <IconBase>
      <circle data-fill cx="12" cy="8.2" r="3.8" />
      <path d="M4.8 20.2c.9-3.6 3.8-5.7 7.2-5.7s6.3 2.1 7.2 5.7" />
    </IconBase>
  )
}

const ICONS: Record<TabId, () => ReactNode> = {
  home: HomeIcon,
  wallet: WalletIcon,
  games: GamesIcon,
  more: MoreIcon,
  profile: ProfileIcon,
}

export function NavIcon({ tab }: { tab: TabId }) {
  const Icon = ICONS[tab]
  return <Icon />
}
