import EmptyState from '@components/emptyState'
import SweepstakeCard from '../sweepstakeCard'
import { ListContainer } from './styles'

import type { SweepstakeListProps } from './types'

const SweepstakeList = ({ sweepstakes, onViewDetails }: SweepstakeListProps) => (
  <ListContainer>
    {sweepstakes.map((sweepstake) => (
      <SweepstakeCard key={sweepstake.id} sweepstake={sweepstake} onViewDetails={onViewDetails} />
    ))}
    {sweepstakes.length === 0 && (
      <EmptyState description="Nenhum bolão cadastrado no sistema." />
    )}
  </ListContainer>
)

export default SweepstakeList
