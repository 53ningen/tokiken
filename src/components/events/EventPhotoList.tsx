import { Event } from '@/db/events'
import SectionHeading from '../commons/SectionHeading'

interface Props {
  event: Event
  showHeading?: boolean
}

const EventPhotoList = async ({ event, showHeading = false }: Props) => {
  const photos = []
  return (
    <>
      {photos.length > 0 && (
        <div>
          {showHeading && <SectionHeading title="📝 写真" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"></div>
        </div>
      )}
    </>
  )
}

export default EventPhotoList
