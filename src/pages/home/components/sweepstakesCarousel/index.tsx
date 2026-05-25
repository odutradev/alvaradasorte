import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'

import { CarouselWrapper, CarouselHeader, NavigationRow, CounterText } from './styles'
import EmptyState from '@components/emptyState'
import SweepstakeCard from '../sweepstakeCard'

import type { SweepstakesCarouselProps } from './types'

const SweepstakesCarousel = ({ sweepstakes, onJoin }: SweepstakesCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (sweepstakes.length === 0) {
    return (
      <CarouselWrapper>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Bolões Disponíveis
        </Typography>
        <EmptyState description="Nenhum bolão aberto no momento. Fique de olho!" />
      </CarouselWrapper>
    )
  }

  const goToPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
  const goToNext = () => setCurrentIndex((prev) => Math.min(sweepstakes.length - 1, prev + 1))

  return (
    <CarouselWrapper>
      <CarouselHeader>
        <Typography variant="h5" fontWeight={700}>
          Bolões Disponíveis
        </Typography>
        <NavigationRow>
          <CounterText variant="body2">
            {currentIndex + 1} / {sweepstakes.length}
          </CounterText>
          <IconButton onClick={goToPrev} disabled={currentIndex === 0} size="small" aria-label="Bolão anterior">
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={goToNext} disabled={currentIndex === sweepstakes.length - 1} size="small" aria-label="Próximo bolão">
            <ChevronRightIcon />
          </IconButton>
        </NavigationRow>
      </CarouselHeader>
      <SweepstakeCard data={sweepstakes[currentIndex]} onJoin={onJoin} />
    </CarouselWrapper>
  )
}

export default SweepstakesCarousel
