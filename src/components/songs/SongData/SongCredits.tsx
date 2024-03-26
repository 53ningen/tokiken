import SectionHeading from '@/components/commons/SectionHeading'
import { listSongCreditsBySong } from '@/db/song-credits'
import SongCreditItem from './SongCreditItem'

interface Props {
  songId: number
}

const SongCredits = async ({ songId }: Props) => {
  const credits = await listSongCreditsBySong(songId)()
  const groupedCredits = [
    credits.filter((credit) => credit.role === 'Vocal'),
    credits.filter((credit) => credit.role === 'Lyrics'),
    credits.filter((credit) => credit.role === 'Music'),
    credits.filter((credit) => credit.role === 'Arrangement'),
    credits.filter((credit) => credit.role === 'Dance'),
    credits.filter((credit) => credit.role === 'Produce'),
  ]
  return (
    <div className="py-4">
      <SectionHeading title="楽曲クレジット" />
      {groupedCredits.map((credits, index) => (
        <div key={index} className="grid grid-cols-1 sm:grid-cols-2  gap-2">
          {credits.map((credit) => (
            <div key={credit.id} className="pb-2">
              <SongCreditItem credit={credit} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default SongCredits
