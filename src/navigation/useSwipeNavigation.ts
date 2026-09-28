import { useCallback, useRef } from 'react'
import type { PointerEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { TABS, getTabIndex } from './tabs'

const MIN_DISTANCE = 56
const MAX_DURATION_MS = 800
/** Horizontal travel must dominate vertical travel so scrolling never triggers a tab change. */
const DIRECTION_RATIO = 1.5

interface SwipeStart {
  x: number
  y: number
  time: number
}

/**
 * Swipe left/right between the bottom-navigation screens.
 * Swiping towards the reading-start edge moves forward (left in LTR, right in RTL).
 */
export function useSwipeNavigation() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const start = useRef<SwipeStart | null>(null)

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (!event.isPrimary) return
    start.current = { x: event.clientX, y: event.clientY, time: event.timeStamp }
  }, [])

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const origin = start.current
      start.current = null
      if (!origin || !event.isPrimary) return

      const dx = event.clientX - origin.x
      const dy = event.clientY - origin.y
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * DIRECTION_RATIO) return
      if (event.timeStamp - origin.time > MAX_DURATION_MS) return

      const isRtl = getComputedStyle(event.currentTarget).direction === 'rtl'
      const step = (dx > 0) === isRtl ? 1 : -1
      const target = TABS[getTabIndex(pathname) + step]
      if (target) navigate(target.path)
    },
    [navigate, pathname],
  )

  const onPointerCancel = useCallback(() => {
    start.current = null
  }, [])

  return { onPointerDown, onPointerUp, onPointerCancel }
}
