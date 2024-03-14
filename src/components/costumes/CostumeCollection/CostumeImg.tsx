import { imageUrl } from '@/consts/metadata'

interface Props {
  imageKey?: string
  size: 'xs' | 'md' | 'lg'
  alt: string
}

const CostumeImg = ({ imageKey, size, alt }: Props) => {
  const key = imageKey
    ? encodeURIComponent(`costumes/${imageKey}.${size}.png`)
    : undefined
  const url = imageUrl(key)
  return (
    <div>
      <img
        src={url}
        alt={alt}
        className="w-full aspect-square object-cover"
        loading="lazy"
      />
    </div>
  )
}

export default CostumeImg
