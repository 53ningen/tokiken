import IndexHeading from '@/components/commons/Index/IndexHeading'
import { jpIndexNavItems } from '@/components/commons/Index/IndexNav'
import { Artist, listArtists } from '@/db/artists'
import ArtistCollection from './ArtistCollection'

const IndexedArtistCollection = async () => {
  const artists = await listArtists()
  const navItems = jpIndexNavItems
  const groupedArtists = new Map<string, Artist[]>()
  for (const artist of artists) {
    var key = navItems.length - 1
    for (var i = 1; i <= navItems.length; i++) {
      if (artist.kana.charAt(0) < navItems[i]) {
        key = i - 1
        break
      }
    }
    const item = artist
    const newItems = [...(groupedArtists.get(navItems[key]) || []), item]
    groupedArtists.set(navItems[key], newItems)
  }
  return (
    <div>
      {navItems.map((i) => (
        <div key={i}>
          <IndexHeading id={i} />
          <ArtistCollection artists={groupedArtists.get(i) || []} />
        </div>
      ))}
    </div>
  )
}

export default IndexedArtistCollection
