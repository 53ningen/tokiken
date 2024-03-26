import SectionHeading from '@/components/commons/SectionHeading'
import { Song, SongCredit } from '@/db/songs'
import SongCreditItem from './SongCreditItem'

interface Props {
  title: string
  credits: (SongCredit & { songs: Song })[]
}

const SongCredits = ({ title, credits }: Props) => {
  return credits.length === 0 ? (
    <></>
  ) : (
    <div className="py-4">
      <SectionHeading title={title} badgeText={credits.length.toString()} />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {credits.map((credit) => (
          <SongCreditItem key={credit.id} credit={credit} />
        ))}
      </div>
    </div>
  )
}

export default SongCredits
