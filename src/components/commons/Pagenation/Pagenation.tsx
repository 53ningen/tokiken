import PageButton from './PageButton'

interface Props {
  current: number
  hasNext: boolean
  path: (page: number) => string
}

const Pagenation = ({ current, hasNext, path }: Props) => {
  const hasBefore = current > 1
  return (
    <div className="flex gap-8 justify-between py-8">
      {hasBefore ? <PageButton label="previous" href={path(current - 1)} /> : <div />}
      {hasNext ? <PageButton label="next" href={path(current + 1)} /> : <div />}
    </div>
  )
}

export default Pagenation
