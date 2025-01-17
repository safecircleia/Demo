import React, { Suspense } from 'react'
import styles from './styles.module.scss'

type BackgroundGradientProps = {
  className?: string
}

export default function BackgroundGradient(props: BackgroundGradientProps) {
  const { className } = props

  return (
    <div className={[className, styles.backgroundGradientWrapper].filter(Boolean).join(' ')}>
      <Suspense fallback={<div className={styles.fallback} />}>
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://l4wlsi8vxy8hre4v.public.blob.vercel-storage.com/video/glass-animation-5-f0gPcjmKFIV3ot5MGOdNy2r4QHBoXt.mp4"
        />
      </Suspense>
    </div>
  )
}