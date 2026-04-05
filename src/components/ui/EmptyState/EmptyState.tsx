import { Empty, EmptyCard, EmptyText, EmptyTitle } from '../styles'

type EmptyStateProps = {
  title?: string
  text?: string
}

export default function EmptyState({
  title = 'Начните новый диалог',
  text = 'Выберите чат слева или создайте новый, чтобы начать переписку.',
}: EmptyStateProps) {
  return (
    <Empty>
      <EmptyCard>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyText>{text}</EmptyText>
      </EmptyCard>
    </Empty>
  )
}
