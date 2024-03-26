import { Event, listEventCostumes } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'
import CostumeCollection from '../costumes/CostumeCollection/CostumeCollection'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventCostumeList = async ({ event, showHeading = false }: Props) => {
  const costumes = await listEventCostumes(event.id)()
  return (
    <>
      {costumes.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="👗 衣装" />}
          <CostumeCollection costumes={costumes} />
        </div>
      )}
    </>
  )
}

export default EventCostumeList
