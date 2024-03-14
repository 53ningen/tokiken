type Position = 'top' | 'bottom' | 'left' | 'right'

interface Props {
  text: string
  children: React.ReactNode
  tipPosition?: Position
}

const Tooltip = ({ text, children, tipPosition = 'bottom' }: Props) => {
  const posClasses = getPostionClasses(tipPosition)
  return (
    <div className="group relative cursor-pointer inline-block">
      <div>{children}</div>
      <div className={[...chipClasses, ...posClasses].join(' ')}>{text}</div>
    </div>
  )
}

const getPostionClasses = (position: Position) => {
  switch (position) {
    case 'top':
      return [
        'left-1/2',
        '-top-8',
        '-translate-x-1/2',
        'before:-translate-x-1/2',
        'before:left-1/2',
        'before:top-full',
        'before:border-t-gray-500',
      ]
    case 'bottom':
      return [
        'left-1/2',
        '-bottom-8',
        '-translate-x-1/2',
        'before:-translate-x-1/2',
        'before:left-1/2',
        'before:bottom-full',
        'before:border-b-gray-500',
      ]
    case 'right':
      return [
        'left-8',
        'top-0',
        'before:-left-2',
        'before:-bottom-1',
        'before:-translate-y-3',
        'before:border-r-gray-500',
      ]
    case 'left':
      return [
        'right-8',
        'top-0',
        'before:-right-2',
        'before:-bottom-1',
        'before:-translate-y-3',
        'before:border-l-gray-500',
      ]
  }
}

const chipClasses = [
  'opacity-0',
  'invisible',
  'group-hover:opacity-100',
  'group-hover:visible',
  'absolute',
  'p-1',
  'z-10',
  'whitespace-nowrap',
  'rounded',
  'bg-gray-500',
  'text-white',
  'text-xs',
  'transition',
  'duration-500',
  'pointer-events-none',
  "before:content-['']",
  'before:absolute',
  'before:border-4',
  'before:border-transparent',
]

export default Tooltip
