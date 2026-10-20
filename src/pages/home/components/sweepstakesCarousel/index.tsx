import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { useState } from 'react'

import { CarouselWrapper, CarouselHeader, NavigationRow } from './styles'
import EmptyState from '@components/emptyState'
import SweepstakeCard from '../sweepstakeCard'

import type { SweepstakesCarouselProps } from './types'

const SweepstakesCarousel = ({ sweepstakes, onJoin }: SweepstakesCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (sweepstakes.length === 0) {
    return (
      <CarouselWrapper>
        <CarouselHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>
              Bolões Disponíveis
            </Typography>
            <Chip
              label={0}
              size="small"
              color="default"
              sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem', borderRadius: 1 }}
            />
          </Box>
        </CarouselHeader>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: 200 }}>
          <EmptyState description="Nenhum bolão aberto no momento. Fique de olho!" />
        </Box>
      </CarouselWrapper>
    )
  }

  const goToPrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
  const goToNext = () => setCurrentIndex((prev) => Math.min(sweepstakes.length - 1, prev + 1))

  return (
    <CarouselWrapper>
      <CarouselHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" fontWeight={600}>
            Bolões Disponíveis
          </Typography>
          <Chip
            label={`${currentIndex + 1} de ${sweepstakes.length}`}
            size="small"
            color="default"
            sx={{ fontWeight: 600, height: 24, fontSize: '0.75rem', borderRadius: 1 }}
          />
        </Box>
        <NavigationRow>
          <IconButton
            onClick={goToPrev}
            disabled={currentIndex === 0}
            size="small"
            aria-label="Bolão anterior"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={goToNext}
            disabled={currentIndex === sweepstakes.length - 1}
            size="small"
            aria-label="Próximo bolão"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': { backgroundColor: 'action.hover' }
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </NavigationRow>
      </CarouselHeader>
      <SweepstakeCard data={sweepstakes[currentIndex]} onJoin={onJoin} />
    </CarouselWrapper>
  )
}

export default SweepstakesCarousel


