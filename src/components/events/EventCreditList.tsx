import { Event, listEventCredits } from '@/db/events'
import Link from 'next/link'
import SectionHeading from '../commons/SectionHeading'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventCreditList = async ({ event, showHeading = false }: Props) => {
  const credits = await listEventCredits(event.id)()
  return (
    <>
      {credits.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="👥 クレジット" />}
          <ul>
            {credits.map((credit) => {
              return (
                <li key={credit.id} className="text-xs">
                  <div className="flex gap-2">
                    <div className="text-gray-500">{credit.title}:</div>
                    <div className={credit.artists ? 'text-primary' : ''}>
                      {credit.artists ? (
                        <>
                          <Link href={`/artists/${credit.artists.id}`}>
                            {credit.artists.name}
                          </Link>
                        </>
                      ) : (
                        credit.name
                      )}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </>
  )
}

export default EventCreditList
