export interface SweepstakeTimelineProps {
  createdAt: string
  purchaseLimitDate: string
  drawDate: string
}

export type TimelineNodeStatus = 'completed' | 'current' | 'upcoming'

export interface TimelineItem {
  id: 'start' | 'now' | 'closing' | 'draw'
  label: string
  timestamp: number
  status: TimelineNodeStatus
  formattedDate: string
  formattedTime: string
}
