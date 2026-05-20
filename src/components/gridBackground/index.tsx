import { useRef } from 'react'

import { BackgroundWrapper, ContentWrapper, GlowOverlay } from './styles'

import type { GridBackgroundProps } from './types'
import type { MouseEvent } from 'react'

export const GridBackground = ({ disableGlow = false, children }: GridBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <BackgroundWrapper ref={containerRef} onMouseMove={disableGlow ? undefined : handleMouseMove}>
      {!disableGlow && <GlowOverlay />}
      <ContentWrapper>{children}</ContentWrapper>
    </BackgroundWrapper>
  )
}
