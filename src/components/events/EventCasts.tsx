import { getTokisenRegime } from '@/consts/tokisen'
import { EventCast } from '@/db/events'

interface Props {
  date: string
  casts: EventCast[]
}

const EventCasts = ({ date, casts }: Props) => {
  const names: string[] = []
  if (casts.length === 1 && casts[0].cast.endsWith('ときめき♡宣伝部')) {
    const members = getTokisenRegime(date)?.members
    names.push(...(members?.map((m) => m.name) || []))
  } else {
    names.push(...casts.map((c) => c.cast))
  }
  const baseClasses = [
    'inline-block',
    'py-[0.1rem]',
    'px-2',
    'mr-1',
    'mb-1',
    'text-xs',
    'rounded-full',
    'text-white',
    'select-none',
  ]
  return (
    <>
      {names.map((name) => {
        const color = getColor(name)
        const className = [color, ...baseClasses].join(' ')
        return (
          <span key={name} className={className}>
            {name}
          </span>
        )
      })}
    </>
  )
}

const getColor = (name: string) => {
  switch (name) {
    case '辻野かなみ':
      return 'bg-tokimekiorange'
    case '杏ジュリア':
    case '小高サラ':
      return 'bg-tokimekipurple'
    case '坂井仁香':
      return 'bg-tokimekired'
    case '小泉遥香':
      return 'bg-tokimekipink'
    case '菅田愛貴':
    case '藤本ばんび':
    case '永坂真心':
      return 'bg-tokimekilemon'
    case '吉川ひより':
      return 'bg-tokimekigreen'
    default:
      return 'bg-tokimekiorange'
  }
}

export default EventCasts
