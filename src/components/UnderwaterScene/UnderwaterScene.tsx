import type { CSSProperties } from 'react'
import sceneUrl from '../../assets/home/underwater-scene.webp'
import styles from './UnderwaterScene.module.css'

interface UnderwaterSceneProps {
  /** `hero` shows the avatar in full; `muted` dims and blurs it behind other screens' content. */
  variant?: 'hero' | 'muted'
}

const RAYS = [
  { left: '8%', width: 46, rotate: 16, delay: 0 },
  { left: '30%', width: 70, rotate: 10, delay: -3 },
  { left: '52%', width: 38, rotate: 6, delay: -6 },
  { left: '70%', width: 58, rotate: -2, delay: -1.5 },
]

const BUBBLES = [
  { left: '12%', size: 6, duration: 11, delay: 0 },
  { left: '22%', size: 4, duration: 9, delay: -4 },
  { left: '81%', size: 8, duration: 13, delay: -2 },
  { left: '88%', size: 5, duration: 10, delay: -7 },
  { left: '67%', size: 3, duration: 8, delay: -5 },
  { left: '6%', size: 3, duration: 12, delay: -9 },
  { left: '93%', size: 4, duration: 9.5, delay: -1 },
]

export function UnderwaterScene({ variant = 'hero' }: UnderwaterSceneProps) {
  const isHero = variant === 'hero'

  return (
    <div className={`${styles.scene} ${isHero ? styles.hero : styles.muted}`}>
      <img
        className={styles.art}
        src={sceneUrl}
        alt={isHero ? 'Game avatar: a robed shark holding a bag of coins among ancient underwater ruins' : ''}
        draggable={false}
        decoding="async"
      />

      <div className={styles.rays} aria-hidden="true">
        {RAYS.map((ray) => (
          <span
            key={ray.left}
            className={styles.ray}
            style={
              {
                insetInlineStart: ray.left,
                width: ray.width,
                '--ray-rotate': `${ray.rotate}deg`,
                animationDelay: `${ray.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className={styles.bubbles} aria-hidden="true">
        {BUBBLES.map((bubble) => (
          <span
            key={bubble.left}
            className={styles.bubble}
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.scrim} aria-hidden="true" />
    </div>
  )
}
