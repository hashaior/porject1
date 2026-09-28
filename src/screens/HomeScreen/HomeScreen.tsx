import { useNavigate } from 'react-router'
import { BalanceHud } from '../../components/BalanceHud/BalanceHud'
import { account } from '../../data/account'
import styles from './HomeScreen.module.css'

/**
 * Home: the avatar and its underwater world (rendered by the shell's scene)
 * fill the screen; only the wallet HUD sits on top so the character stays the focus.
 */
export function HomeScreen() {
  const navigate = useNavigate()

  return (
    <div className={styles.home}>
      <h1 className="visually-hidden">Home</h1>
      <header className={styles.topBar}>
        <BalanceHud
          balance={account.balance}
          onBalanceClick={() => navigate('/wallet')}
          onTopUp={() => navigate('/wallet', { state: { intent: 'top-up' } })}
        />
      </header>
    </div>
  )
}
