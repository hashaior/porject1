import { useLocation } from 'react-router'
import styles from './SectionScreen.module.css'

interface SectionScreenProps {
  title: string
  description: string
}

/**
 * Destination for the non-home tabs. Each area is defined in its own spec;
 * this keeps navigation working until those screens are built.
 */
export function SectionScreen({ title, description }: SectionScreenProps) {
  const { state } = useLocation()
  const isTopUp = (state as { intent?: string } | null)?.intent === 'top-up'

  return (
    <section className={styles.section} aria-labelledby="section-title">
      <h1 id="section-title" className={styles.title}>
        {title}
      </h1>
      <div className={styles.card}>
        {isTopUp && <p className={styles.eyebrow}>הטענת יתרה</p>}
        <p className={styles.body}>{description}</p>
      </div>
    </section>
  )
}
