import { useId } from 'react'
import { formatBalance } from '../../data/account'
import styles from './BalanceHud.module.css'

interface BalanceHudProps {
  balance: number
  onBalanceClick: () => void
  onTopUp: () => void
}

function CoinIcon() {
  const id = useId()
  return (
    <svg className={styles.coin} viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1c2" />
          <stop offset="0.5" stopColor="#f3bf4a" />
          <stop offset="1" stopColor="#a86912" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd978" />
          <stop offset="1" stopColor="#d99526" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill={`url(#${id}-rim)`} />
      <circle cx="16" cy="16" r="11.2" fill={`url(#${id}-face)`} stroke="#a86912" strokeOpacity="0.55" />
      <path
        d="M16 9.6 17.9 14l4.5.3-3.4 3 1.1 4.5L16 19.3l-4.1 2.5 1.1-4.5-3.4-3 4.5-.3Z"
        fill="#fff3cc"
        fillOpacity="0.9"
        stroke="#9a5f0f"
        strokeOpacity="0.5"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <path d="M7.5 11.5a10 10 0 0 1 6-5" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function BalanceHud({ balance, onBalanceClick, onTopUp }: BalanceHudProps) {
  const formatted = formatBalance(balance)

  return (
    <div className={styles.hud} role="group" aria-label="Wallet">
      <button
        type="button"
        className={styles.balance}
        onClick={onBalanceClick}
        aria-label={`Balance ${formatted} coins`}
      >
        <CoinIcon />
        <span className={styles.balanceText}>
          <span className={styles.caption}>Balance</span>
          <span className={styles.amount}>{formatted}</span>
        </span>
      </button>
      <button type="button" className={styles.topUp} onClick={onTopUp}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span>Top up</span>
      </button>
    </div>
  )
}
