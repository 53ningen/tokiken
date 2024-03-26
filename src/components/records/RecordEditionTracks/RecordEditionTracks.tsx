import SectionHeading from '@/components/commons/SectionHeading'
import { listRecordTracksByEdition } from '@/db/record-tracks'
import TrackList from './TrackList'

interface Props {
  editionId: number
}

const RecordEditionTracks = async ({ editionId }: Props) => {
  const tracks = await listRecordTracksByEdition(editionId)()
  const discs = Array.from(
    { length: Math.max(...tracks.map((t) => t.disc)) },
    (_, i) => i + 1
  )
  return (
    <>
      {discs.map((disc) => (
        <div key={`${tracks[0].edition_id}_${disc}`}>
          <SectionHeading title={`DISC ${disc.toString()}`} />
          <TrackList tracks={tracks.filter((t) => t.disc === disc)} />
        </div>
      ))}
    </>
  )
}

export default RecordEditionTracks
