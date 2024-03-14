import { Artist } from '@/db/artists'
import { Costume, CostumeImage } from '@/db/costumes'
import { listSongCreditsByArtist } from '@/db/song-credits'
import ArtistMetadata from './ArtistMetadata'
import CostumeCredits from './CostumeCredits'
import SongCredits from './SongCredits'

interface Props {
  artist: Artist & { costumes: (Costume & { costume_images: CostumeImage[] })[] }
}

const ArtistDetails = async ({ artist }: Props) => {
  const songCredits = (await listSongCreditsByArtist(artist.id)()).filter(
    (c) => c.artist_id === artist.id
  )
  return (
    <>
      <ArtistMetadata artist={artist} />
      <SongCredits
        title="🎤 歌唱"
        credits={songCredits.filter((c) => c.role === 'Vocal')}
      />
      <SongCredits
        title="🎵 作詞"
        credits={songCredits.filter((c) => c.role === 'Lyrics')}
      />
      <SongCredits
        title="🎵 作曲"
        credits={songCredits.filter((c) => c.role === 'Music')}
      />
      <SongCredits
        title="🎵 編曲"
        credits={songCredits.filter((c) => c.role === 'Arrangement')}
      />
      <SongCredits
        title="🎵 制作"
        credits={songCredits.filter((c) => c.role === 'Produce')}
      />
      <SongCredits
        title="💃 ダンス"
        credits={songCredits.filter((c) => c.role === 'Dance')}
      />
      <CostumeCredits title="👗 制作衣装" costumes={artist.costumes} />
      <SongCredits title="🏟️ 制作イベント" credits={[]} />
    </>
  )
}

export default ArtistDetails
