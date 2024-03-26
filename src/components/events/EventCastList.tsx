import { getTokisenRegime } from '@/consts/tokisen'
import { Event, listEventCasts } from '@/db/events'

interface Props {
  event: Event
}

const EventCastList = async ({ event }: Props) => {
  const { date } = event
  const castNames = (await listEventCasts(event.id)()).map((c) => c.name)
  const regime = getTokisenRegime(date)

  const casts = regime?.members.filter((m) => castNames.includes(m.name)) || []
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
      {casts.length > 0 && (
        <>
          <span className="pr-2">出演:</span>
          {casts.map((cast) => {
            const color = getColor(cast.name)
            const className = [color, ...baseClasses].join(' ')
            return (
              <span key={cast.name} className={className}>
                {cast.name}
              </span>
            )
          })}
        </>
      )}
    </>
  )
}

const getColor = (name: string) => {
  switch (name) {
    case '辻野かなみ':
      return 'bg-tokimekiblue'
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
    case 'パブりん':
    default:
      return 'bg-tokimekiorange'
  }
}

export default EventCastList
