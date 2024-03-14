import { noImageUrl } from '@/consts/metadata'

interface Props {
  src?: string
  alt: string
}

const AlbumCover = ({ src, alt }: Props) => {
  return (
    <div>
      <img
        src={src || noImageUrl}
        alt={alt}
        className="aspect-square w-full object-cover"
      />
    </div>
  )
}

export default AlbumCover
