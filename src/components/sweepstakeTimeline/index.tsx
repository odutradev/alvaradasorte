import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import dayjs from 'dayjs'

import {
  Container,
  TimelineWrapper,
  TrackBackground,
  TrackProgress,
  StepNode,
  DotWrapper,
  Dot,
  StepLabel,
  DateText,
  TimeText
} from './styles'

import type { SweepstakeTimelineProps, TimelineItem } from './types'

export const SweepstakeTimeline = ({ createdAt, purchaseLimitDate, drawDate }: SweepstakeTimelineProps) => {
  const now = dayjs()
  const start = dayjs(createdAt)
  const limit = dayjs(purchaseLimitDate)
  const draw = dayjs(drawDate)

  const rawItems: Array<{
    id: TimelineItem['id']
    label: string
    date: dayjs.Dayjs
  }> = [
    { id: 'start', label: 'Início', date: start },
    { id: 'now', label: 'Hoje', date: now },
    { id: 'closing', label: 'Fechamento', date: limit },
    { id: 'draw', label: 'Sorteio', date: draw }
  ]

  const sorted = [...rawItems].sort((a, b) => a.date.valueOf() - b.date.valueOf())
  const nowIndex = sorted.findIndex((item) => item.id === 'now')

  const items: TimelineItem[] = sorted.map((item, index) => {
    let status: TimelineItem['status'] = 'upcoming'
    if (item.id === 'now') {
      status = 'current'
    } else if (index < nowIndex) {
      status = 'completed'
    }

    return {
      id: item.id,
      label: item.label,
      timestamp: item.date.valueOf(),
      status,
      formattedDate: item.date.format('DD/MM'),
      formattedTime: item.date.format('HH:mm')
    }
  })

  const progressPercentage = (nowIndex / (items.length - 1)) * 75

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Cronograma do Bolão
        </Typography>
      </Box>

      <TimelineWrapper>
        <TrackBackground />
        <TrackProgress progressPercentage={progressPercentage} />

        {items.map((item) => (
          <StepNode key={item.id}>
            <StepLabel isCurrent={item.status === 'current'}>
              {item.label}
            </StepLabel>

            <DotWrapper>
              <Dot status={item.status} />
            </DotWrapper>

            <DateText color={item.status === 'current' ? 'primary.main' : 'text.primary'}>
              {item.formattedDate}
            </DateText>
            <TimeText>
              {item.formattedTime}
            </TimeText>
          </StepNode>
        ))}
      </TimelineWrapper>
    </Container>
  )
}

export default SweepstakeTimeline
