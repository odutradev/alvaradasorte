import EmptyState from '@components/emptyState'
import SweepstakeCard from '../sweepstakeCard'
import { ListContainer } from './styles'

import type { SweepstakeListProps } from './types'

const SweepstakeList = ({ sweepstakes, onViewDetails, onEdit, onDelete }: SweepstakeListProps) => (
  <ListContainer>
    {sweepstakes.map((sweepstake) => (
      <SweepstakeCard
        key={sweepstake.id}
        sweepstake={sweepstake}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
    {sweepstakes.length === 0 && (
      <EmptyState
        title="Nenhum bolão cadastrado"
        description="Ainda não existem bolões cadastrados no sistema."
      />
    )}
  </ListContainer>
)

export default SweepstakeList