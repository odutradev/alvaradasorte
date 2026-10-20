import React from 'react'
import dayjs from 'dayjs'

import {
  Container,
  TimelineTrack,
  Connector,
  NodeAnchor,
  Dot,
  StepLabel,
  DateTimeText
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

  const lastFilledIndex = items.reduce(
    (acc, item, index) => (item.status === 'completed' || item.status === 'current' ? index : acc),
    -1
  )

  const TOTAL_DURATION = 2200
  const START_DELAY = 200

  const completedConnectorsCount = Math.max(1, nowIndex)
  const durationPerConnector = Math.round(TOTAL_DURATION / completedConnectorsCount)

  return (
    <Container>
      <TimelineTrack>
        {items.map((item, index) => {
          const align = index === 0 ? 'start' : index === items.length - 1 ? 'end' : 'center'
          const isLast = index === items.length - 1
          const isConnectorCompleted = index < nowIndex
          const isPulsing = index === lastFilledIndex
          const connectorDelay = START_DELAY + index * durationPerConnector
          const nodeDelay = START_DELAY + Math.min(index * durationPerConnector, TOTAL_DURATION)

          return (
            <React.Fragment key={item.id}>
              <NodeAnchor delayMs={nodeDelay}>
                <StepLabel align={align} isCurrent={item.status === 'current'}>
                  {item.label}
                </StepLabel>

                <Dot status={item.status} isPulsing={isPulsing} />

                <DateTimeText align={align} isCurrent={item.status === 'current'}>
                  {item.formattedDate} - {item.formattedTime}
                </DateTimeText>
              </NodeAnchor>

              {!isLast && (
                <Connector
                  isCompleted={isConnectorCompleted}
                  durationMs={durationPerConnector}
                  delayMs={connectorDelay}
                />
              )}
            </React.Fragment>
          )
        })}
      </TimelineTrack>
    </Container>
  )
}

export default SweepstakeTimeline
