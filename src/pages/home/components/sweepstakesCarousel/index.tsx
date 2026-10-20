import { useState } from 'react'

import { EmptyCard } from './styles'
import EmptyState from '@components/emptyState'
import SweepstakeCard from '../sweepstakeCard'

import type { SweepstakesCarouselProps } from './types'

const SweepstakesCarousel = ({ sweepstakes, onJoin }: SweepstakesCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (sweepstakes.length === 0) {
    return (
      <EmptyCard elevation={0}>
        <EmptyState description="Nenhum bolão aberto no momento. Fique de olho!" />
      </EmptyCard>
    )
  }

  const goToPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
  const goToNext = () => setCurrentIndex((prev) => Math.min(sweepstakes.length - 1, prev + 1))

  return (
    <SweepstakeCard
      data={sweepstakes[currentIndex]}
      onJoin={onJoin}
      currentIndex={currentIndex}
      totalCount={sweepstakes.length}
      onPrev={goToPrev}
      onNext={goToNext}
    />
  )
}

export default SweepstakesCarousel

