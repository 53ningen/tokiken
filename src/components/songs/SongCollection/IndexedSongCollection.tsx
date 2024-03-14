import IndexHeading from '@/components/commons/Index/IndexHeading'
import { jpIndexNavItems } from '@/components/commons/Index/IndexNav'
import { Song, SongCredit, listSongs } from '@/db/songs'
import SongCollection from './SongCollection'

const IndexedSongCollection = async () => {
  const songs = await listSongs()

  const navItems = jpIndexNavItems
  const groupedSongs = new Map<string, (Song & { song_credits: SongCredit[] })[]>()
  for (const song of songs) {
    var key = navItems.length - 1
    for (var i = 1; i <= navItems.length; i++) {
      if (song.kana.charAt(0) < navItems[i]) {
        key = i - 1
        break
      }
    }
    const newItems = [...(groupedSongs.get(navItems[key]) || []), song]
    groupedSongs.set(navItems[key], newItems)
  }

  return (
    <div>
      {navItems.map((i) => (
        <div key={i}>
          <IndexHeading id={i} />
          <SongCollection songs={groupedSongs.get(i) || []} />
        </div>
      ))}
    </div>
  )
}

export default IndexedSongCollection
